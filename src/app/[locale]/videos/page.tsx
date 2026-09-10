import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { VideosGrid } from "@/components/sections/videos/VideosGrid";
import { FinalCta } from "@/components/layout/FinalCta";

type Video = { category: string; title: string; duration: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videosPage.hero" });
  return { title: `${t("title")} ${t("titleHighlight")}` };
}

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "videosPage" });

  const items = t.raw("items") as Video[];

  return (
    <>
      <PageHero
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitleHtml={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#videos-grid" }}
        image={t("hero.image")}
        imageAlt={t("hero.title")}
      />
      <div id="videos-grid">
        <VideosGrid items={items} />
      </div>
      <FinalCta />
    </>
  );
}
