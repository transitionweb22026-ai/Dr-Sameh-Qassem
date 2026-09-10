import Image from "next/image";
import { ArrowRight, Compass, Calendar } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ContactPanel } from "./ContactPanel";
import { FadeIn } from "@/components/motion/FadeIn";

function isExternalHref(href: string) {
  return /^(tel:|mailto:|https?:|#)/.test(href);
}

export function PageHero({
  title,
  titleHighlight,
  subtitleHtml,
  primaryCta,
  secondaryCta,
  image,
  imageAlt,
  showContactPanel = true,
}: {
  title: string;
  titleHighlight: string;
  subtitleHtml: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  imageAlt: string;
  showContactPanel?: boolean;
}) {
  return (
    <section className="w-full min-h-screen relative overflow-hidden flex items-center pt-24 pb-16">
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071f19]/95 via-[#0a2a22]/85 to-[#071f19]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(7,31,25,0.4)_55%,_rgba(7,31,25,0.9)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-brand-forest to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-7 text-start">
            <FadeIn>
              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.2] tracking-tight font-tajawal text-balance">
                {title}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-goldLight via-brand-gold to-white">
                  {titleHighlight}
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p
                className="text-base sm:text-lg text-brand-100/90 leading-relaxed max-w-2xl font-medium"
                dangerouslySetInnerHTML={{ __html: subtitleHtml }}
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {isExternalHref(primaryCta.href) ? (
                  <a
                    href={primaryCta.href}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-gold text-brand-deep font-extrabold text-base hover:bg-white transition-all duration-300 shadow-xl hover:scale-105 border border-brand-goldLight/40"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>{primaryCta.label}</span>
                  </a>
                ) : (
                  <Link
                    href={primaryCta.href}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-gold text-brand-deep font-extrabold text-base hover:bg-white transition-all duration-300 shadow-xl hover:scale-105 border border-brand-goldLight/40"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>{primaryCta.label}</span>
                  </Link>
                )}
                {isExternalHref(secondaryCta.href) ? (
                  <a
                    href={secondaryCta.href}
                    className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full liquid-glass-dark glass-interactive text-white font-bold text-base hover:text-brand-gold transition-all duration-300"
                  >
                    <Compass className="w-5 h-5 text-brand-gold" />
                    <span>{secondaryCta.label}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </a>
                ) : (
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full liquid-glass-dark glass-interactive text-white font-bold text-base hover:text-brand-gold transition-all duration-300"
                  >
                    <Compass className="w-5 h-5 text-brand-gold" />
                    <span>{secondaryCta.label}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                )}
              </div>
            </FadeIn>
          </div>

          {showContactPanel ? (
            <div className="lg:col-span-4">
              <ContactPanel />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
