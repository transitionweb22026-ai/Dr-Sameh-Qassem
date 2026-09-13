import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { VideosGrid } from "@/components/sections/videos/VideosGrid";
import { FinalCta } from "@/components/layout/FinalCta";

type Video = { category: string; title: string; duration: string; videoUrl?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videosPage.hero" });
  const meta = await getTranslations({ locale, namespace: "meta.pages.videos" });
  const description = meta("description");
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
    description,
    alternates: buildAlternates(locale, "/videos"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "videosPage" });
  const common = await getTranslations({ locale, namespace: "common" });

  const items = t.raw("items") as Video[];

  return (
    <>
      <GlobalHeroSection
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitle={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#videos-grid" }}
        followLabel={common("followUs")}
        showDoctor
        doctorImage={t("hero.image")}
        doctorImageAlt={t("hero.title")}
        bg3DElement="zap"
        bookingCard={{
          title: common("bookingCard.title"),
          text: common("bookingCard.text"),
          cta: common("bookingCard.cta"),
        }}
      />
      <div id="videos-grid">
        <VideosGrid items={items} />
      </div>
      <FinalCta />
    </>
  );
}
