import { CheckCircle2, Monitor, Smartphone } from "lucide-react";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { WebMobilePreview } from "@/components/product-preview/web-mobile-preview";
import { mobileCapabilities, webCapabilities } from "@/lib/dueflow-content";

export function WebMobileSection() {
  return (
    <section className="section-space overflow-hidden bg-[var(--paper)]">
      <div className="site-container grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div>
          <SectionHeader
            eyebrow="Designed for web + mobile"
            title="Full cashflow control at the desk. Fast proof and follow-up in the field."
            description="DueFlow is planned as a web command center with a mobile companion, because payment records are reviewed at the desk but proof and promises happen wherever the work happens."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <CapabilityList
              title="Web command center"
              subtitle="Reports, review, and control"
              icon={Monitor}
              items={webCapabilities}
            />
            <CapabilityList
              title="Mobile companion planned"
              subtitle="Daily actions in the field"
              icon={Smartphone}
              items={mobileCapabilities}
            />
          </div>
        </div>
        <WebMobilePreview />
      </div>
    </section>
  );
}

type CapabilityListProps = {
  title: string;
  subtitle: string;
  icon: typeof Monitor;
  items: string[];
};

function CapabilityList({
  title,
  subtitle,
  icon: Icon,
  items,
}: CapabilityListProps) {
  return (
    <div className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--paper-strong)] p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-[var(--green-soft)] text-[var(--green)]">
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-[var(--ink)]">{title}</p>
          <p className="mt-0.5 text-[0.68rem] text-[var(--text-muted)]">
            {subtitle}
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-xs leading-5 text-[#606a63]"
          >
            <CheckCircle2
              aria-hidden="true"
              className="mt-1 size-3 shrink-0 text-[var(--green)]"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
