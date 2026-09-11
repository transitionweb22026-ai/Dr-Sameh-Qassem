import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import type { Article } from "@/lib/articles";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { FeaturedArticle } from "@/components/sections/articles/FeaturedArticle";
import { ArticlesGrid } from "@/components/sections/articles/ArticlesGrid";
import { FinalCta } from "@/components/layout/FinalCta";

type Stat = { icon: string; value: number; suffix: string; label: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articlesPage.hero" });
  const meta = await getTranslations({ locale, namespace: "meta.pages.articles" });
  const description = meta("description");
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
    description,
    alternates: buildAlternates(locale, "/articles"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "articlesPage" });
  const common = await getTranslations({ locale, namespace: "common" });

  const featured = t.raw("featured") as Article;
  const items = t.raw("items") as Article[];
  const stats = t.raw("stats") as Stat[];

  return (
    <>
      <GlobalHeroSection
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitle={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#articles-grid" }}
        stats={stats}
        followLabel={common("followUs")}
        showStatsBar={false}
        showDoctor
        doctorImage={t("hero.image")}
        doctorImageAlt={t("hero.title")}
        bg3DElement="network"
        bookingCard={{
          title: common("bookingCard.title"),
          text: common("bookingCard.text"),
          cta: common("bookingCard.cta"),
        }}
      />
      <FeaturedArticle featured={featured} />
      <div id="articles-grid">
        <ArticlesGrid items={items} />
      </div>
      <FinalCta />
    </>
  );
}
