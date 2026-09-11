"use client";

import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FeatureSplitCard } from "@/components/ui/FeatureSplitCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function AboutPreview() {
  const t = useTranslations("home.about");

  return (
    <section className="py-12 md:py-20 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FeatureSplitCard
          eyebrow={t("eyebrow")}
          title={`${t("title")} ${t("titleHighlight")}`}
          text={t.raw("text")}
          image={t("image")}
          imageAlt={t("eyebrow")}
          playVariant="glass"
          videoUrl={t("videoUrl")}
        >
          <Link
            href="/about"
            className="mt-1 inline-flex w-fit items-center gap-3 rounded-full bg-white/10 py-2 ps-2 pe-5 transition-colors hover:bg-white/15 group"
          >
            <span className="w-9 h-9 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0 group-hover:bg-brand-gold/30 transition-colors">
              <UserRound className="w-5 h-5" strokeWidth={1.8} />
            </span>
            <span className="text-sm font-bold text-white group-hover:text-brand-goldLight transition-colors">
              {t("cta")}
            </span>
          </Link>
        </FeatureSplitCard>
      </div>
    </section>
  );
}
