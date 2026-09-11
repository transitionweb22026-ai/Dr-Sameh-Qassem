import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { ReviewsGrid } from "@/components/sections/reviews/ReviewsGrid";
import { FinalCta } from "@/components/layout/FinalCta";

type Review = {
  name: string;
  location: string;
  procedure: string;
  category: string;
  rating: number;
  text: string;
};
type Stat = { icon: string; value: number; suffix: string; label: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews.hero" });
  const meta = await getTranslations({ locale, namespace: "meta.pages.reviews" });
  const description = meta("description");
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
    description,
    alternates: buildAlternates(locale, "/reviews"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "reviews" });
  const common = await getTranslations({ locale, namespace: "common" });

  const items = t.raw("items") as Review[];
  const stats = t.raw("stats") as Stat[];

  return (
    <>
      <GlobalHeroSection
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitle={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#reviews" }}
        stats={stats}
        followLabel={common("followUs")}
        showStatsBar={false}
        showDoctor
        doctorImage={t("hero.image")}
        doctorImageAlt={t("hero.title")}
        bg3DElement="waves"
        bookingCard={{
          title: common("bookingCard.title"),
          text: common("bookingCard.text"),
          cta: common("bookingCard.cta"),
        }}
      />
      <div id="reviews">
        <ReviewsGrid
          eyebrow={t("gridSection.eyebrow")}
          title={t("gridSection.title")}
          text={t("gridSection.text")}
          items={items}
        />
      </div>
      <FinalCta />
    </>
  );
}
