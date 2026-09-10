"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { FadeIn } from "@/components/motion/FadeIn";

type Treatment = { title: string; text: string; note: string };

export function TreatmentsGrid() {
  const t = useTranslations("home.treatmentsSection");
  const items = t.raw("items") as Treatment[];

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden" id="services">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          align="between"
          eyebrow={t("eyebrow")}
          title={t("title")}
          text={t("text")}
        />

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <GlassCard className="p-8 h-full">
                <div className="h-2 w-12 bg-brand-gold rounded-full mb-6" />
                <h3 className="text-xl font-bold text-brand-forest mb-3">{item.title}</h3>
                <p className="text-sm text-brand-800/80 leading-relaxed mb-6">{item.text}</p>
                <div className="p-3.5 bg-brand-50/90 rounded-xl text-xs font-semibold text-brand-800 border border-brand-200/60">
                  {item.note}
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <FadeIn delay={0.2}>
          <div className="mt-14 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-brand-forest text-white font-bold text-sm hover:bg-brand-900 transition-all duration-300 shadow-xl hover:scale-105 border border-emerald-700/30"
            >
              <span>{t("cta")}</span>
              <ArrowRight className="w-4 h-4 text-brand-gold rtl:rotate-180" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
