import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { AboutPreview } from "@/components/sections/home/AboutPreview";
import { SurgeriesGrid } from "@/components/sections/home/SurgeriesGrid";
import { TreatmentsGrid } from "@/components/sections/home/TreatmentsGrid";
import { TestimonialsSlider } from "@/components/sections/home/TestimonialsSlider";
import { VideosPreview } from "@/components/sections/home/VideosPreview";
import { ArticlesPreview } from "@/components/sections/home/ArticlesPreview";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { FinalCta } from "@/components/layout/FinalCta";

type Stat = { icon: string; value: number; suffix: string; label: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  const stats = t.raw("stats") as Stat[];

  return (
    <>
      <PageHero
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitleHtml={t.raw("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "/services" }}
        image={t("hero.image")}
        imageAlt={t("hero.title")}
      />
      <StatsGrid stats={stats} />
      <AboutPreview />
      <SurgeriesGrid />
      <TreatmentsGrid />
      <TestimonialsSlider />
      <VideosPreview />
      <ArticlesPreview />
      <FaqSection />
      <FinalCta />
    </>
  );
}
