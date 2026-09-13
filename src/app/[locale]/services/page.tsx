import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import type { Discipline } from "@/lib/services";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { DisciplinesGrid } from "@/components/sections/services/DisciplinesGrid";
import { ConditionDetailsGrid } from "@/components/sections/services/ConditionDetailsGrid";
import { WorkflowSteps } from "@/components/sections/services/WorkflowSteps";
import { FaqBlock } from "@/components/sections/shared/FaqBlock";
import { FinalCta } from "@/components/layout/FinalCta";

type Step = { title: string; text: string };
type Faq = { q: string; a: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.hero" });
  const meta = await getTranslations({ locale, namespace: "meta.pages.services" });
  const description = meta("description");
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
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
  const t = await getTranslations({ locale, namespace: "services" });
  const common = await getTranslations({ locale, namespace: "common" });

  const disciplines = t.raw("disciplinesSection.items") as Discipline[];
  const steps = t.raw("workflowSection.steps") as Step[];
  const faqs = t.raw("faqSection.items") as Faq[];

  return (
    <>
      <GlobalHeroSection
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitle={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#disciplines" }}
        followLabel={common("followUs")}
        showDoctor
        doctorImage={t("hero.image")}
        doctorImageAlt={t("hero.title")}
        bg3DElement="bone"
        bookingCard={{
          title: common("bookingCard.title"),
          text: common("bookingCard.text"),
          cta: common("bookingCard.cta"),
        }}
      />
      <div id="disciplines">
        <DisciplinesGrid
          eyebrow={t("disciplinesSection.eyebrow")}
          title={t("disciplinesSection.title")}
          items={disciplines}
        />
      </div>
      <ConditionDetailsGrid
        eyebrow={t("conditionsSection.eyebrow")}
        title={t("conditionsSection.title")}
        items={disciplines}
      />
      <WorkflowSteps
        eyebrow={t("workflowSection.eyebrow")}
        title={t("workflowSection.title")}
        steps={steps}
      />
      <FaqBlock
        eyebrow={t("faqSection.eyebrow")}
        title={t("faqSection.title")}
        items={faqs}
      />
      <FinalCta />
    </>
  );
}
