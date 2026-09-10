import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { DisciplinesGrid } from "@/components/sections/services/DisciplinesGrid";
import { WorkflowSteps } from "@/components/sections/services/WorkflowSteps";
import { FaqBlock } from "@/components/sections/shared/FaqBlock";
import { FinalCta } from "@/components/layout/FinalCta";

type Discipline = { icon: string; title: string; text: string; conditions: string[] };
type Step = { title: string; text: string };
type Faq = { q: string; a: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.hero" });
  return { title: `${t("title")} ${t("titleHighlight")}` };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const disciplines = t.raw("disciplinesSection.items") as Discipline[];
  const steps = t.raw("workflowSection.steps") as Step[];
  const faqs = t.raw("faqSection.items") as Faq[];

  return (
    <>
      <PageHero
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitleHtml={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "/contact" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#disciplines" }}
        image={t("hero.image")}
        imageAlt={t("hero.title")}
      />
      <div id="disciplines">
        <DisciplinesGrid
          eyebrow={t("disciplinesSection.eyebrow")}
          title={t("disciplinesSection.title")}
          items={disciplines}
        />
      </div>
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
