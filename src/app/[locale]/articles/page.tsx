import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { FeaturedArticle } from "@/components/sections/articles/FeaturedArticle";
import { ArticlesGrid } from "@/components/sections/articles/ArticlesGrid";
import { FinalCta } from "@/components/layout/FinalCta";

type Article = { date: string; readTime: string; category: string; title: string; text: string };
type Featured = Article & { image: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articlesPage.hero" });
  return { title: `${t("title")} ${t("titleHighlight")}` };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "articlesPage" });

  const featured = t.raw("featured") as Featured;
  const items = t.raw("items") as Article[];

  return (
    <>
      <PageHero
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitleHtml={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#articles-grid" }}
        image={t("hero.image")}
        imageAlt={t("hero.title")}
      />
      <FeaturedArticle featured={featured} />
      <div id="articles-grid">
        <ArticlesGrid items={items} />
      </div>
      <FinalCta />
    </>
  );
}
