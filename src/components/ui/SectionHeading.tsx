import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/FadeIn";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "start" | "between";
  tone?: "light" | "dark";
  className?: string;
}) {
  if (align === "between") {
    return (
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16",
          className
        )}
      >
        <FadeIn direction="right">
          <div>
            {eyebrow ? (
              <span className="text-brand-gold font-bold text-sm tracking-wider uppercase">
                {eyebrow}
              </span>
            ) : null}
            <h2
              className={cn(
                "text-3xl sm:text-4xl font-extrabold font-tajawal mt-1",
                tone === "dark" ? "text-white" : "text-brand-forest"
              )}
            >
              {title}
            </h2>
          </div>
        </FadeIn>
        {text ? (
          <FadeIn direction="left" delay={0.1}>
            <p
              className={cn(
                "max-w-md text-sm leading-relaxed",
                tone === "dark" ? "text-brand-100/80" : "text-brand-800/80"
              )}
            >
              {text}
            </p>
          </FadeIn>
        ) : null}
      </div>
    );
  }

  return (
    <FadeIn>
      <div
        className={cn(
          "max-w-3xl mx-auto mb-16 space-y-3",
          align === "center" && "text-center",
          className
        )}
      >
        {eyebrow ? (
          <span className="text-brand-gold font-bold text-sm tracking-wider uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h2
          className={cn(
            "text-3xl sm:text-4xl font-black font-tajawal text-balance",
            tone === "dark" ? "text-white" : "text-brand-forest"
          )}
        >
          {title}
        </h2>
        {text ? (
          <p
            className={cn(
              "text-base",
              tone === "dark" ? "text-brand-100/80" : "text-brand-800/80"
            )}
          >
            {text}
          </p>
        ) : null}
      </div>
    </FadeIn>
  );
}
