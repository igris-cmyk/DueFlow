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
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[var(--green)]">
          Workspace foundation
        </p>
        <h1 className="text-balance mt-4 text-3xl font-black tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
          Settings
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base sm:leading-8">
          Review the organization boundary and account identity that will own
          future DueFlow records.
        </p>
      </div>

      <section className="mt-8 rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper-strong)] p-5 shadow-[var(--shadow-card)] sm:p-7">
        <div className="flex items-start gap-3 border-b border-[var(--line)] pb-5">
          <span className="grid size-11 place-items-center rounded-xl bg-[var(--green-soft)] text-[var(--green)]">
            <Building2 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-[-0.035em] text-[var(--ink)]">
              Organization details
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
              Editing remains intentionally disabled during Phase 2A.
            </p>
          </div>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4"
            >
              <dt className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#778079]">
                {detail.label}
              </dt>
              <dd className="mt-2 break-words text-sm font-extrabold text-[var(--ink)]">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-[#f7f6f1] p-5">
          <ShieldCheck
            aria-hidden="true"
            className="size-5 text-[var(--green)]"
          />
          <p className="mt-4 text-sm font-extrabold text-[var(--ink)]">
            Tenant access is membership-based
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Future product queries must filter by this organization and verify
            an active membership.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[#f7f6f1] p-5">
          <Mail aria-hidden="true" className="size-5 text-[var(--green)]" />
          <p className="mt-4 text-sm font-extrabold text-[var(--ink)]">
            Team invitations are not active yet
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Roles exist in the foundation, but invitation and email workflows
            are outside Phase 2A.
          </p>
        </div>
      </section>
    </div>
  );
}
