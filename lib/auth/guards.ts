import "server-only";
import { notFound, redirect } from "next/navigation";
import type {
  MembershipRole,
  Prisma,
} from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const activeMembershipSelect = {
  id: true,
  userId: true,
  organizationId: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  organization: {
    select: {
      id: true,
      name: true,
      slug: true,
      businessType: true,
      currency: true,
      timezone: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.MembershipSelect;

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return getDb().user.findUnique({
    where: { id: session.user.id },
    select: safeUserSelect,
  });
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getActiveMembership(userId: string) {
  return getDb().membership.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "asc",
    },
    select: activeMembershipSelect,
  });
}

export async function getCurrentOrganization() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const membership = await getActiveMembership(user.id);

  if (!membership) {
    return null;
  }

  return {
    user,
    membership,
    organization: membership.organization,
  };
}

export async function requireOrganization() {
  const user = await requireUser();
  const membership = await getActiveMembership(user.id);

  if (!membership) {
    redirect("/onboarding");
  }

  return {
    user,
    membership,
    organization: membership.organization,
  };
}

export async function requireMembership(organizationId: string) {
  const user = await requireUser();
  const membership = await getDb().membership.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId,
      },
    },
    select: activeMembershipSelect,
  });

  if (!membership || membership.status !== "ACTIVE") {
    notFound();
  }

  return {
    user,
    membership,
    organization: membership.organization,
  };
}

export async function requireRole(
  roles: MembershipRole[],
  organizationId?: string,
) {
  const context = organizationId
    ? await requireMembership(organizationId)
    : await requireOrganization();

  if (!roles.includes(context.membership.role)) {
    notFound();
  }

  return context;
}

export async function assertOrganizationAccess(organizationId: string) {
  return requireMembership(organizationId);
}

export async function getPostAuthDestination() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const membership = await getActiveMembership(user.id);
  return membership ? "/app/today" : "/onboarding";
}
