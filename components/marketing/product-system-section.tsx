import { SectionHeader } from "@/components/dueflow-ui/section-header";
import { productModules } from "@/lib/dueflow-content";

export function ProductSystemSection() {
  return (
    <section
      id="product"
      className="section-space overflow-hidden bg-[#19201c] text-white"
    >
      <div className="site-container grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeader
            eyebrow="The system"
            title="One cash desk for every rupee your work has earned."
            description="DueFlow connects the client, project, proof, reason, and next action behind each pending payment. It is built to make money records operational, not merely archived."
            className="[&_.eyebrow]:text-[#9fc8ab] [&_h2]:text-white [&_p:last-child]:text-white/55"
          />
        </div>
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035]">
          {productModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <article
                key={module.title}
                className="grid gap-4 border-b border-white/8 p-5 last:border-b-0 sm:grid-cols-[42px_1fr_auto] sm:items-center"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-white/8 text-[#afd4b8]">
                  <Icon aria-hidden="true" className="size-4.5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {module.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-6 text-white/48">
                    {module.description}
                  </p>
                </div>
                <span className="hidden text-[0.65rem] font-black tracking-[0.12em] text-white/18 sm:block">
                  0{index + 1}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
