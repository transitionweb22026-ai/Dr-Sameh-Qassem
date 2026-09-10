import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { DoctorMessage } from "@/components/sections/about/DoctorMessage";
import { Timeline } from "@/components/sections/about/Timeline";
import { WideVideoPlayer } from "@/components/ui/WideVideoPlayer";
import { ExpertiseGrid } from "@/components/sections/about/ExpertiseGrid";
import { CertificatesGrid } from "@/components/sections/about/CertificatesGrid";
import { StatsGrid } from "@/components/ui/StatsGrid";
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
  return { title: `${t("title")} ${t("titleHighlight")}` };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const timelineItems = t.raw("timelineSection.items") as TimelineItem[];
  const expertiseItems = t.raw("expertiseSection.items") as NamedItem[];
  const certificates = t.raw("certificatesSection.items") as Certificate[];
  const counters = t.raw("counters") as Stat[];

  return (
    <>
      <PageHero
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitleHtml={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#timeline" }}
        image={t("hero.image")}
        imageAlt={t("hero.title")}
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
      <StatsGrid stats={counters} />
      <FinalCta />
    </>
  );
}
