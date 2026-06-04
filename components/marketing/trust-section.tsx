import { Check, X } from "lucide-react";
import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { trustDoes, trustDoesNot } from "@/lib/dueflow-content";

export function TrustSection() {
  return (
    <section className="section-space bg-[#19201c] text-white">
      <div className="site-container">
        <SectionHeader
          eyebrow="Trust and ethics"
          title="Professional money control without turning client relationships hostile."
          description="DueFlow is designed to help businesses act with better records, better timing, and better context. It is not designed to intimidate people or invent facts."
          className="[&_.eyebrow]:text-[#9fc8ab] [&_h2]:text-white [&_p:last-child]:text-white/55"
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.11em] text-[#9fc8ab]">
              DueFlow does
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {trustDoes.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"
                  >
                    <Icon aria-hidden="true" className="size-4 text-[#afd4b8]" />
                    <p className="mt-4 text-sm font-extrabold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-xs leading-5 text-white/45">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.11em] text-[#d2ae83]">
              DueFlow does not
            </p>
            <div className="mt-5 space-y-2.5">
              {trustDoesNot.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-3.5 py-3"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#a33d35]/15 text-[#e1a39d]">
                    <X aria-hidden="true" className="size-3.5" />
                  </span>
                  <p className="text-sm font-bold text-white/65">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2.5 border-t border-white/8 pt-5">
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-[#afd4b8]"
              />
              <p className="text-sm leading-6 text-white/48">
                DueFlow helps you keep a complete, honest payment record and act
                on it professionally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
