import "server-only";
import { randomUUID } from "node:crypto";
import type { Prisma } from "@/app/generated/prisma/client";

export function slugifyOrganizationName(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/g, "");

  return slug || "workspace";
}

export async function createUniqueOrganizationSlug(
  name: string,
  tx: Prisma.TransactionClient,
) {
  const baseSlug = slugifyOrganizationName(name);

  for (let suffix = 1; suffix <= 50; suffix += 1) {
    const slug = suffix === 1 ? baseSlug : `${baseSlug}-${suffix}`;
    const existing = await tx.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }
  }

  return `${baseSlug}-${randomUUID().slice(0, 8)}`;
}
