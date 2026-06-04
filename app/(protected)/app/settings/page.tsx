import type { Metadata } from "next";
import { Building2, Mail, ShieldCheck } from "lucide-react";
import { requireOrganization } from "@/lib/auth/guards";
import {
  formatBusinessType,
  formatMembershipRole,
} from "@/lib/organizations";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const { user, membership, organization } = await requireOrganization();

  const details = [
    { label: "Organization name", value: organization.name },
    {
      label: "Business type",
      value: formatBusinessType(organization.businessType),
    },
    { label: "Currency", value: organization.currency },
    { label: "Timezone", value: organization.timezone },
    { label: "Current user role", value: formatMembershipRole(membership.role) },
    { label: "Account email", value: user.email },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-[var(--app-accent)]">
            Workspace foundation
          </p>
          <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--app-text)] sm:text-4xl">
            Settings
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--app-text-muted)] sm:text-base sm:leading-8">
            Review the organization boundary and account identity that will own
            future DueFlow records.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-3.5 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
          Read only
        </span>
      </div>

      <section className="mt-8 rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-[var(--app-shadow)] sm:p-7">
        <div className="flex items-start gap-3 border-b border-[var(--app-border)] pb-5">
          <span className="grid size-11 place-items-center rounded-xl bg-[var(--app-accent-soft)] text-[var(--app-accent)]">
            <Building2 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--app-text)]">
              Organization details
            </h2>
            <p className="mt-1 text-[0.9rem] leading-6 text-[var(--app-text-muted)]">
              These values are intentionally read-only during Phase 2A.
            </p>
          </div>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            >
              <dt className="text-[0.75rem] font-extrabold uppercase tracking-[0.09em] text-[var(--app-text-muted)]">
                {detail.label}
              </dt>
              <dd className="mt-2 break-words text-base font-extrabold text-[var(--app-text)]">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow-soft)]">
          <ShieldCheck
            aria-hidden="true"
            className="size-5 text-[var(--app-accent)]"
          />
          <p className="mt-4 text-[0.95rem] font-extrabold text-[var(--app-text)]">
            Tenant access is membership-based
          </p>
          <p className="mt-2 text-[0.9rem] leading-6 text-[var(--app-text-muted)]">
            Future product queries must filter by this organization and verify
            an active membership.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow-soft)]">
          <Mail aria-hidden="true" className="size-5 text-[var(--app-accent)]" />
          <p className="mt-4 text-[0.95rem] font-extrabold text-[var(--app-text)]">
            Team invitations are not active yet
          </p>
          <p className="mt-2 text-[0.9rem] leading-6 text-[var(--app-text-muted)]">
            Roles exist in the foundation, but invitation and email workflows
            are outside Phase 2A.
          </p>
        </div>
      </section>
    </div>
  );
}
