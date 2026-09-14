import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { getPageBySlug } from "@/lib/controllers/pages";
import { getHeroByPageId } from "@/lib/controllers/heroes";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { pickLocale, sectionHeading, finalCtaProps } from "@/lib/cms-render";
import type { ContentItem, PageHero, Section } from "@/lib/cms-types";
import type { Discipline } from "@/lib/services";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { DisciplinesGrid } from "@/components/sections/services/DisciplinesGrid";
import { ConditionDetailsGrid } from "@/components/sections/services/ConditionDetailsGrid";
import { WorkflowSteps } from "@/components/sections/services/WorkflowSteps";
import { FaqBlock } from "@/components/sections/shared/FaqBlock";
import { FinalCta } from "@/components/layout/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "meta.pages.services" });
  const description = meta("description");

  const pageResult = await getPageBySlug("services");
  const heroResult = pageResult.ok && pageResult.data ? await getHeroByPageId(pageResult.data.id) : null;
  const hero = heroResult?.ok ? heroResult.data : null;
  const isAr = locale === "ar";
  const title = hero
    ? `${isAr ? hero.title_ar : hero.title_en} ${(isAr ? hero.title_highlight_ar : hero.title_highlight_en) ?? ""}`.trim()
    : meta("description");

  return {
    title,
    description,
    alternates: buildAlternates(locale, "/services"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const common = await getTranslations({ locale, namespace: "common" });

  const pageResult = await getPageBySlug("services");
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

  // Disciplines (+ nested conditions) — shared between the grid and the
  // condition-details breakdown, exactly like the original static page.
  const disciplinesHeading = sectionHeading(locale, sectionByKey("disciplinesSection"));
  const disciplineItems = itemsFor("disciplinesSection");
  const disciplines: Discipline[] = disciplineItems
    .filter((item) => !item.parent_id)
    .map((item) => ({
      icon: item.icon ?? "brain",
      title: pickLocale(locale, item.title_en, item.title_ar),
      text: pickLocale(locale, item.text_en, item.text_ar),
      conditions: disciplineItems
        .filter((child) => child.parent_id === item.id)
        .map((child) => ({
          title: pickLocale(locale, child.title_en, child.title_ar),
          text: pickLocale(locale, child.text_en, child.text_ar),
          image: child.icon ?? undefined,
        })),
    }));

  const conditionsHeading = sectionHeading(locale, sectionByKey("conditionsSection"));

  const workflowHeading = sectionHeading(locale, sectionByKey("workflowSection"));
  const workflowSteps = itemsFor("workflowSection").map((item) => ({
    title: pickLocale(locale, item.title_en, item.title_ar),
    text: pickLocale(locale, item.text_en, item.text_ar),
  }));

  const faqHeading = sectionHeading(locale, sectionByKey("faqSection"));
  const faqItems = itemsFor("faqSection").map((item) => ({
    q: pickLocale(locale, item.title_en, item.title_ar),
    a: pickLocale(locale, item.text_en, item.text_ar),
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
          href: hero?.secondary_cta_href || "#disciplines",
        }}
        followLabel={hero ? pickLocale(locale, hero.follow_label_en, hero.follow_label_ar) : common("followUs")}
        showDoctor
        doctorImage={hero?.image_url ?? ""}
        doctorImageAlt={hero ? pickLocale(locale, hero.title_en, hero.title_ar) : ""}
        bg3DElement={hero?.bg_3d_element ?? "bone"}
        bookingCard={{
          title: (hero ? pickLocale(locale, hero.booking_card_title_en, hero.booking_card_title_ar) : "") || common("bookingCard.title"),
          text: (hero ? pickLocale(locale, hero.booking_card_text_en, hero.booking_card_text_ar) : "") || common("bookingCard.text"),
          cta: (hero ? pickLocale(locale, hero.booking_card_cta_en, hero.booking_card_cta_ar) : "") || common("bookingCard.cta"),
        }}
      />
      <div id="disciplines">
        <DisciplinesGrid eyebrow={disciplinesHeading.eyebrow} title={disciplinesHeading.title} items={disciplines} />
      </div>
      <ConditionDetailsGrid eyebrow={conditionsHeading.eyebrow} title={conditionsHeading.title} items={disciplines} />
      <WorkflowSteps eyebrow={workflowHeading.eyebrow} title={workflowHeading.title} steps={workflowSteps} />
      <FaqBlock eyebrow={faqHeading.eyebrow} title={faqHeading.title} items={faqItems} />
      <FinalCta {...finalCtaProps(locale, sectionByKey("finalCta"))} />
    </>
  );
}
