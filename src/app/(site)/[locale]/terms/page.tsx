import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { Siren, BookOpen, CalendarCheck2, Copyright, ShieldCheck, type LucideIcon } from "lucide-react";
import { getPageBySlug } from "@/lib/controllers/pages";
import { getHeroByPageId } from "@/lib/controllers/heroes";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { pickLocale } from "@/lib/cms-render";
import type { ContentItem } from "@/lib/cms-types";
import { LegalHero } from "@/components/sections/legal/LegalHero";
import { LegalSection } from "@/components/sections/legal/LegalSection";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup } from "@/components/motion/Stagger";
import { Link } from "@/i18n/navigation";

const iconMap: Record<string, LucideIcon> = {
  siren: Siren,
  bookOpen: BookOpen,
  calendarCheck: CalendarCheck2,
  copyright: Copyright,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms.hero" });
  const meta = await getTranslations({ locale, namespace: "meta.pages.terms" });
  const description = meta("description");
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
    description,
    alternates: buildAlternates(locale, "/terms"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "terms" });

  const pageResult = await getPageBySlug("terms");
  const pageId = pageResult.ok ? pageResult.data?.id : undefined;

  let heroTitle = "";
  let heroTitleHighlight = "";
  let heroSubtitle = "";
  let legalItems: ContentItem[] = [];

  if (pageId) {
    const [heroResult, sectionsResult] = await Promise.all([
      getHeroByPageId(pageId),
      listSectionsByPageId(pageId),
    ]);
    const hero = heroResult.ok ? heroResult.data : null;
    if (hero) {
      heroTitle = pickLocale(locale, hero.title_en, hero.title_ar);
      heroTitleHighlight = pickLocale(locale, hero.title_highlight_en, hero.title_highlight_ar);
      heroSubtitle = pickLocale(locale, hero.subtitle_en, hero.subtitle_ar);
    }
    const section = sectionsResult.ok
      ? sectionsResult.data.find((s) => s.section_key === "legalSections")
      : undefined;
    if (section) {
      const itemsResult = await listContentItemsBySection(section.id);
      legalItems = itemsResult.ok ? itemsResult.data : [];
    }
  }

  const topLevel = legalItems.filter((item) => !item.parent_id).sort((a, b) => a.order_index - b.order_index);

  return (
    <>
      <LegalHero
        eyebrow=""
        title={heroTitle}
        titleHighlight={heroTitleHighlight}
        subtitle={heroSubtitle}
        lastUpdated={t("hero.lastUpdated")}
      />
      <section className="relative overflow-hidden bg-brand-ivory py-20 sm:py-24">
        <AmbientGlow />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="liquid-glass rounded-[2.5rem] p-6 sm:p-10 md:p-12">
            <StaggerGroup className="space-y-6 sm:space-y-8">
              {topLevel.map((item) => {
                const bullets = legalItems
                  .filter((child) => child.parent_id === item.id)
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((child) => pickLocale(locale, child.text_en, child.text_ar));
                return (
                  <LegalSection
                    key={item.id}
                    icon={iconMap[item.icon ?? ""] ?? ShieldCheck}
                    title={pickLocale(locale, item.title_en, item.title_ar)}
                    text={pickLocale(locale, item.text_en, item.text_ar)}
                    list={bullets}
                  />
                );
              })}
            </StaggerGroup>
          </div>
          <p className="mt-10 text-center text-sm text-brand-800/70">
            {t("contactNote")}{" "}
            <Link
              href="/contact"
              className="font-bold text-brand-forest transition-colors hover:text-brand-gold"
            >
              {t("contactCta")}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
