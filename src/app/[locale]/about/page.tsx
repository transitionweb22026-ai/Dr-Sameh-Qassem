import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { DoctorMessage } from "@/components/sections/about/DoctorMessage";
import { Timeline } from "@/components/sections/about/Timeline";
import { WideVideoPlayer } from "@/components/ui/WideVideoPlayer";
import { ExpertiseGrid } from "@/components/sections/about/ExpertiseGrid";
import { CertificatesGrid } from "@/components/sections/about/CertificatesGrid";
import { FinalCta } from "@/components/layout/FinalCta";

type Stat = { icon: string; value: number; suffix: string; label: string };
type TimelineItem = { year: string; title: string; text: string };
type NamedItem = { title: string; text: string };
type Certificate = { title: string; org: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.hero" });
  const meta = await getTranslations({ locale, namespace: "meta.pages.about" });
  const description = meta("description");
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
    description,
    alternates: buildAlternates(locale, "/about"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const common = await getTranslations({ locale, namespace: "common" });

  const timelineItems = t.raw("timelineSection.items") as TimelineItem[];
  const expertiseItems = t.raw("expertiseSection.items") as NamedItem[];
  const certificates = t.raw("certificatesSection.items") as Certificate[];
  const counters = t.raw("counters") as Stat[];

  return (
    <>
      <GlobalHeroSection
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitle={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#timeline" }}
        stats={counters}
        followLabel={common("followUs")}
        showStatsBar
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
      <DoctorMessage
        badgeLabel={t("doctorMessage.badgeLabel")}
        headline={t("doctorMessage.headline")}
        paragraphs={t.raw("doctorMessage.paragraphs") as string[]}
        name={t("doctorMessage.name")}
        role={t("doctorMessage.role")}
        signature={t("doctorMessage.signature")}
        qualificationShort={t("doctorMessage.qualificationShort")}
        qualificationFull={t("doctorMessage.qualificationFull")}
        image={t("doctorMessage.image")}
        imageAlt={t("doctorMessage.name")}
      />
      <div id="timeline">
        <Timeline
          eyebrow={t("timelineSection.eyebrow")}
          title={t("timelineSection.title")}
          items={timelineItems}
        />
      </div>
      <WideVideoPlayer
        eyebrow={t("videoSection.eyebrow")}
        title={t("videoSection.title")}
        text={t("videoSection.text")}
        poster={t("videoSection.poster")}
        duration={t("videoSection.duration")}
        videoUrl={t("videoSection.videoUrl")}
      />
      <ExpertiseGrid
        eyebrow={t("expertiseSection.eyebrow")}
        title={t("expertiseSection.title")}
        items={expertiseItems}
      />
      <CertificatesGrid
        eyebrow={t("certificatesSection.eyebrow")}
        title={t("certificatesSection.title")}
        items={certificates}
      />
      <FinalCta />
    </>
  );
}
