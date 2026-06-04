import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className={cn("eyebrow", align === "center" && "justify-center")}>
        {eyebrow}
      </p>
      <h2 className="text-balance mt-5 text-3xl font-extrabold tracking-[-0.045em] text-[var(--ink)] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-[var(--text-muted)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
