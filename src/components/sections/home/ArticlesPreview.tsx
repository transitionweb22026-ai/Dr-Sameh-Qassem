"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type Article = {
  date: string;
  readTime: string;
  category: string;
  title: string;
  text: string;
};

export function ArticlesPreview() {
  const t = useTranslations("home.articlesSection");
  const articlesT = useTranslations("articlesPage");
  const featured = articlesT.raw("featured") as Article & { image: string };
  const items = (articlesT.raw("items") as Article[]).slice(0, 2);

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden" id="articles">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} text={t("text")} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <FadeIn direction="right">
            <GlassCard className="overflow-hidden h-full flex flex-col group">
              <div className="relative h-64 lg:h-72 w-full overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/80 via-transparent to-transparent" />
                <span className="absolute top-4 start-4 px-3 py-1 rounded-full bg-brand-gold text-brand-deep text-xs font-bold">
                  {featured.category}
                </span>
              </div>
              <div className="p-7 flex flex-col gap-3 flex-1">
                <span className="text-[11px] text-brand-700 font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {featured.date} • {featured.readTime}
                </span>
                <h3 className="text-xl font-bold text-brand-forest group-hover:text-brand-600 transition-colors">
                  {featured.title}
                </h3>
                <p className="text-sm text-brand-800/80 leading-relaxed flex-1">{featured.text}</p>
              </div>
            </GlassCard>
          </FadeIn>

          <StaggerGroup className="grid grid-cols-1 gap-8">
            {items.map((article) => (
              <StaggerItem key={article.title} direction="left">
                <GlassCard className="p-7 h-full flex flex-col justify-between group">
                  <div className="space-y-2">
                    <span className="text-[11px] text-brand-700 font-semibold">
                      {article.date} • {article.readTime}
                    </span>
                    <h3 className="text-lg font-bold text-brand-forest group-hover:text-brand-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-800/80 leading-relaxed">
                      {article.text}
                    </p>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-14 text-center">
            <Link
              href="/articles"
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
