import { CheckCircle2, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { FollowUpPreview } from "@/components/product-preview/follow-up-preview";
import { followUpTones } from "@/lib/dueflow-content";

export function FollowUpSection() {
  return (
    <section className="section-space border-y border-[var(--line)] bg-[var(--paper-strong)]">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Suggested Follow-Ups"
              title="Write clear payment reminders without sounding rude or confused."
              description="DueFlow uses the payment facts you recorded to help draft respectful follow-ups. The goal is a professional message with the right context, not pressure or threats."
            />
            <div className="mt-7 flex flex-wrap gap-2">
              {followUpTones.map((tone) => (
                <span
                  key={tone}
                  className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs font-extrabold text-[#626b64]"
                >
                  {tone}
                </span>
              ))}
            </div>
            <div className="mt-7 space-y-3">
              {[
                "Every message is user-approved before sending.",
                "DueFlow does not message clients automatically in this phase.",
                "DueFlow does not threaten or act as a debt collector.",
              ].map((item, index) => (
                <div key={item} className="flex gap-2.5">
                  {index === 0 ? (
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[var(--green)]"
                    />
                  ) : (
                    <ShieldCheck
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[var(--green)]"
                    />
                  )}
                  <p className="text-sm leading-6 text-[var(--text-muted)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <FollowUpPreview />
        </div>
      </div>
    </section>
  );
}
