import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { AboutPreview } from "@/components/sections/home/AboutPreview";
import { SurgeriesGrid } from "@/components/sections/home/SurgeriesGrid";
import { TreatmentsGrid } from "@/components/sections/home/TreatmentsGrid";
import { TestimonialsSlider } from "@/components/sections/home/TestimonialsSlider";
import { VideosPreview } from "@/components/sections/home/VideosPreview";
import { ArticlesPreview } from "@/components/sections/home/ArticlesPreview";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { StatsSection } from "@/components/layout/StatsSection";
import { FinalCta } from "@/components/layout/FinalCta";

type Stat = { icon: string; value: number; suffix: string; label: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const meta = await getTranslations({ locale, namespace: "meta.pages.home" });
  const description = meta("description");
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
    description,
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
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
  const common = await getTranslations({ locale, namespace: "common" });

  const stats = t.raw("stats") as Stat[];

  return (
    <>
      <GlobalHeroSection
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitle={t.raw("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "/services" }}
        followLabel={common("followUs")}
        showDoctor
        doctorImage={t("hero.image")}
        doctorImageAlt={t("hero.title")}
        bg3DElement="brain"
        bookingCard={{
          title: common("bookingCard.title"),
          text: common("bookingCard.text"),
          cta: common("bookingCard.cta"),
        }}
      />
      <AboutPreview />
      <SurgeriesGrid />
      <TreatmentsGrid />
      <TestimonialsSlider />
      <VideosPreview />
      <ArticlesPreview />
      <FaqSection />
      <StatsSection
        stats={stats}
        eyebrow={t("statsSection.eyebrow")}
        title={t("statsSection.title")}
        text={t("statsSection.text")}
      />
      <FinalCta />
    </>
  );
}
