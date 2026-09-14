import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { getPageBySlug } from "@/lib/controllers/pages";
import { getHeroByPageId } from "@/lib/controllers/heroes";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { pickLocale, metaString, finalCtaProps } from "@/lib/cms-render";
import type { ContentItem, PageHero, Section } from "@/lib/cms-types";
import type { Article } from "@/lib/articles";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { FeaturedArticle } from "@/components/sections/articles/FeaturedArticle";
import { ArticlesGrid } from "@/components/sections/articles/ArticlesGrid";
import { FinalCta } from "@/components/layout/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "meta.pages.articles" });
  const description = meta("description");

  const pageResult = await getPageBySlug("articles");
  const heroResult = pageResult.ok && pageResult.data ? await getHeroByPageId(pageResult.data.id) : null;
  const hero = heroResult?.ok ? heroResult.data : null;
  const isAr = locale === "ar";
  const title = hero
    ? `${isAr ? hero.title_ar : hero.title_en} ${(isAr ? hero.title_highlight_ar : hero.title_highlight_en) ?? ""}`.trim()
    : meta("description");

  return {
    title,
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
  const isAr = locale === "ar";
  const common = await getTranslations({ locale, namespace: "common" });

  const pageResult = await getPageBySlug("articles");
  const pageId = pageResult.ok ? pageResult.data?.id : undefined;

  let hero: PageHero | null = null;
  let sections: Section[] = [];
  const itemsBySectionKey = new Map<string, ContentItem[]>();

  if (pageId) {
    const [heroResult, sectionsResult] = await Promise.all([
      getHeroByPageId(pageId),
      listSectionsByPageId(pageId),
    ]);
    hero = heroResult.ok ? heroResult.data : null;
    sections = sectionsResult.ok ? sectionsResult.data : [];

    await Promise.all(
      sections.map(async (section) => {
        const itemsResult = await listContentItemsBySection(section.id);
        itemsBySectionKey.set(section.section_key, itemsResult.ok ? itemsResult.data : []);
      })
    );
  }

  const articleRows = (itemsBySectionKey.get("articlesSection") ?? [])
    .filter((item) => !item.parent_id)
    .sort((a, b) => a.order_index - b.order_index);

  const toArticle = (item: ContentItem): Article => ({
    slug: metaString(item.meta, "slug"),
    date: metaString(item.meta, isAr ? "date_ar" : "date_en"),
    readTime: metaString(item.meta, isAr ? "read_time_ar" : "read_time_en"),
    category: metaString(item.meta, isAr ? "category_ar" : "category_en"),
    title: pickLocale(locale, item.title_en, item.title_ar),
    text: pickLocale(locale, item.text_en, item.text_ar),
    content: [],
    image: item.image_url ?? undefined,
  });

  const [featuredRow, ...restRows] = articleRows;
  const featured = featuredRow ? toArticle(featuredRow) : null;
  const items = restRows.map(toArticle);

  return (
    <>
      <GlobalHeroSection
        title={hero ? pickLocale(locale, hero.title_en, hero.title_ar) : ""}
        titleHighlight={hero ? pickLocale(locale, hero.title_highlight_en, hero.title_highlight_ar) : ""}
        subtitle={hero ? pickLocale(locale, hero.subtitle_en, hero.subtitle_ar) : ""}
        primaryCta={{
          label: hero ? pickLocale(locale, hero.primary_cta_label_en, hero.primary_cta_label_ar) : "",
          href: hero?.primary_cta_href || "/contact",
        }}
        secondaryCta={{
          label: hero ? pickLocale(locale, hero.secondary_cta_label_en, hero.secondary_cta_label_ar) : "",
          href: hero?.secondary_cta_href || "#articles-grid",
        }}
        followLabel={hero ? pickLocale(locale, hero.follow_label_en, hero.follow_label_ar) : common("followUs")}
        showDoctor
        doctorImage={hero?.image_url ?? ""}
        doctorImageAlt={hero ? pickLocale(locale, hero.title_en, hero.title_ar) : ""}
        bg3DElement={hero?.bg_3d_element ?? "network"}
        bookingCard={{
          title: common("bookingCard.title"),
          text: common("bookingCard.text"),
          cta: common("bookingCard.cta"),
        }}
      />
      {featured ? <FeaturedArticle featured={featured} /> : null}
      <div id="articles-grid">
        <ArticlesGrid items={items} />
      </div>
      <FinalCta {...finalCtaProps(locale, sections.find((s) => s.section_key === "finalCta"))} />
    </>
  );
}
