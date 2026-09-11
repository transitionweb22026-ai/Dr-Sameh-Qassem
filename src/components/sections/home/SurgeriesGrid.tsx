"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LiquidGlassSpecialtyCard } from "@/components/ui/LiquidGlassSpecialtyCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { FadeIn } from "@/components/motion/FadeIn";
import { getIcon, getCardImage } from "@/lib/icons";

type Surgery = { icon: string; title: string; text: string; tags: string[] };

export function SurgeriesGrid() {
  const t = useTranslations("home.surgeriesSection");
  const items = t.raw("items") as Surgery[];

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden" id="surgeries">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} text={t("text")} />

        <StaggerGroup
          once={false}
          className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:max-w-none lg:grid-cols-5 gap-4 lg:gap-5 pb-6"
        >
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <LiquidGlassSpecialtyCard
                title={item.title}
                icon={getIcon(item.icon)}
                image={getCardImage(item.icon)}
                href="/services"
              />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <FadeIn delay={0.2}>
          <div className="mt-10 text-center">
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
