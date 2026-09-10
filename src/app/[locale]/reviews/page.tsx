import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews.hero" });
  return { title: `${t("title")} ${t("titleHighlight")}` };
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "reviews" });

  const filters = t.raw("filters") as string[];
  const items = t.raw("items") as Review[];

  return (
    <>
      <PageHero
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitleHtml={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#reviews" }}
        image={t("hero.image")}
        imageAlt={t("hero.title")}
      />
      <div id="reviews">
        <ReviewsGrid filters={filters} items={items} />
      </div>
      <FinalCta />
    </>
  );
}
