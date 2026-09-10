import { Calendar } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

export function LegalHero({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  lastUpdated,
}: {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  lastUpdated: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-forest pt-24 pb-16 text-white sm:pb-20">
      <div
        className="pointer-events-none absolute -top-24 -start-24 h-96 w-96 rounded-full bg-brand-gold/15 blur-3xl animate-float"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -end-24 h-96 w-96 rounded-full bg-brand-700/30 blur-3xl animate-float-slow"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-10 text-center sm:px-6 sm:pt-14 lg:px-8">
        <FadeIn>
          <span className="text-sm font-bold uppercase tracking-wider text-brand-gold">
            {eyebrow}
          </span>
        </FadeIn>
        <FadeIn delay={0.05}>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-balance text-white font-tajawal sm:text-5xl">
            {title}{" "}
            <span className="bg-gradient-to-l from-brand-goldLight via-brand-gold to-white bg-clip-text text-transparent">
              {titleHighlight}
            </span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-100/90 sm:text-lg">
            {subtitle}
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-7 text-center">
            <div className="liquid-glass-dark inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold text-brand-100">
              <Calendar className="h-4 w-4 text-brand-gold" strokeWidth={1.8} />
              <span>{lastUpdated}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
