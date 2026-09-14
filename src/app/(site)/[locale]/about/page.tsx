import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { getPageBySlug } from "@/lib/controllers/pages";
import { getHeroByPageId } from "@/lib/controllers/heroes";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { pickLocale, sectionHeading, metaString, finalCtaProps } from "@/lib/cms-render";
import type { ContentItem, PageHero, Section } from "@/lib/cms-types";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { DoctorMessage } from "@/components/sections/about/DoctorMessage";
import { Timeline } from "@/components/sections/about/Timeline";
import { WideVideoPlayer } from "@/components/ui/WideVideoPlayer";
import { ExpertiseGrid } from "@/components/sections/about/ExpertiseGrid";
import { CertificatesGrid } from "@/components/sections/about/CertificatesGrid";
import { StatsSection } from "@/components/layout/StatsSection";
import { FinalCta } from "@/components/layout/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "meta.pages.about" });
  const description = meta("description");

  const pageResult = await getPageBySlug("about");
  const heroResult = pageResult.ok && pageResult.data ? await getHeroByPageId(pageResult.data.id) : null;
  const hero = heroResult?.ok ? heroResult.data : null;
  const isAr = locale === "ar";
  const title = hero
    ? `${isAr ? hero.title_ar : hero.title_en} ${(isAr ? hero.title_highlight_ar : hero.title_highlight_en) ?? ""}`.trim()
    : meta("description");

  return {
    title,
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
  const isAr = locale === "ar";
  const common = await getTranslations({ locale, namespace: "common" });

  const pageResult = await getPageBySlug("about");
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

  const sectionByKey = (key: string) => sections.find((s) => s.section_key === key);
  const itemsFor = (key: string) => itemsBySectionKey.get(key) ?? [];

  // Doctor's message ---------------------------------------------------------
  const dmSection = sectionByKey("doctorMessage");
  const dmMeta = dmSection?.meta ?? {};
  const dmParagraphs = itemsFor("doctorMessage").map((item) => pickLocale(locale, item.text_en, item.text_ar));

  // Timeline -------------------------------------------------------------------
  const timelineHeading = sectionHeading(locale, sectionByKey("timelineSection"));
  const timelineItems = itemsFor("timelineSection").map((item) => ({
    year: metaString(item.meta, "year"),
    title: pickLocale(locale, item.title_en, item.title_ar),
    text: pickLocale(locale, item.text_en, item.text_ar),
  }));

  // Featured video ---------------------------------------------------------------
  const videoSection = sectionByKey("videoSection");
  const videoHeading = sectionHeading(locale, videoSection);
  const videoMeta = videoSection?.meta ?? {};

  // Expertise ----------------------------------------------------------------
  const expertiseHeading = sectionHeading(locale, sectionByKey("expertiseSection"));
  const expertiseItems = itemsFor("expertiseSection").map((item) => ({
    title: pickLocale(locale, item.title_en, item.title_ar),
    text: pickLocale(locale, item.text_en, item.text_ar),
    image: item.image_url ?? undefined,
  }));

  // Certificates ------------------------------------------------------------
  const certificatesHeading = sectionHeading(locale, sectionByKey("certificatesSection"));
  const certificatesItems = itemsFor("certificatesSection").map((item) => ({
    title: pickLocale(locale, item.title_en, item.title_ar),
    org: metaString(item.meta, isAr ? "org_ar" : "org_en"),
  }));

  // Stats -----------------------------------------------------------------------
  const statsHeading = sectionHeading(locale, sectionByKey("statsSection"));
  const statsItems = itemsFor("statsSection").map((item) => ({
    icon: item.icon ?? "activity",
    label: pickLocale(locale, item.title_en, item.title_ar),
    value: typeof item.meta.value === "number" ? item.meta.value : 0,
    suffix: metaString(item.meta, "suffix"),
  }));

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
          href: hero?.secondary_cta_href || "#timeline",
        }}
        followLabel={hero ? pickLocale(locale, hero.follow_label_en, hero.follow_label_ar) : common("followUs")}
        showDoctor
        doctorImage={hero?.image_url ?? ""}
        doctorImageAlt={hero ? pickLocale(locale, hero.title_en, hero.title_ar) : ""}
        bg3DElement={hero?.bg_3d_element ?? "brain"}
        bookingCard={{
          title: common("bookingCard.title"),
          text: common("bookingCard.text"),
          cta: common("bookingCard.cta"),
        }}
      />
      <DoctorMessage
        badgeLabel=""
        headline={dmSection ? pickLocale(locale, dmSection.title_en, dmSection.title_ar) : ""}
        paragraphs={dmParagraphs}
        name={metaString(dmMeta, isAr ? "name_ar" : "name_en")}
        role={metaString(dmMeta, isAr ? "role_ar" : "role_en")}
        signature={metaString(dmMeta, isAr ? "signature_ar" : "signature_en")}
        qualificationShort={metaString(dmMeta, isAr ? "qualification_short_ar" : "qualification_short_en")}
        qualificationFull={metaString(dmMeta, isAr ? "qualification_full_ar" : "qualification_full_en")}
        image={dmSection?.image_url ?? ""}
        imageAlt={metaString(dmMeta, isAr ? "name_ar" : "name_en")}
      />
      <div id="timeline">
        <Timeline eyebrow={timelineHeading.eyebrow} title={timelineHeading.title} items={timelineItems} />
      </div>
      <WideVideoPlayer
        eyebrow={videoHeading.eyebrow}
        title={videoHeading.title}
        text={videoHeading.text}
        poster={videoSection?.image_url ?? ""}
        duration={metaString(videoMeta, isAr ? "duration_ar" : "duration_en")}
        videoUrl={metaString(videoMeta, "video_url")}
      />
      <ExpertiseGrid eyebrow={expertiseHeading.eyebrow} title={expertiseHeading.title} items={expertiseItems} />
      <CertificatesGrid
        eyebrow={certificatesHeading.eyebrow}
        title={certificatesHeading.title}
        items={certificatesItems}
      />
      <StatsSection
        stats={statsItems}
        eyebrow={statsHeading.eyebrow}
        title={statsHeading.title}
        text={statsHeading.text}
      />
      <FinalCta {...finalCtaProps(locale, sectionByKey("finalCta"))} />
    </>
  );
}
