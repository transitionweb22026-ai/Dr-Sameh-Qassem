import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { BookingForm } from "@/components/forms/BookingForm";
import { ClinicInfo } from "@/components/sections/contact/ClinicInfo";
import { ClinicMap } from "@/components/sections/contact/ClinicMap";
import { FaqBlock } from "@/components/sections/shared/FaqBlock";
import { FinalCta } from "@/components/layout/FinalCta";

type Faq = { q: string; a: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.hero" });
  return { title: `${t("title")} ${t("titleHighlight")}` };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  const faqItems = t.raw("faq.items") as Faq[];

  return (
    <>
      <PageHero
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitleHtml={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "tel:+201001234567" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#booking-form" }}
        image={t("hero.image")}
        imageAlt={t("hero.title")}
      />
      <section className="py-24 bg-brand-ivory relative" id="booking-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="h-full flex flex-col gap-6 justify-between">
              <ClinicInfo />
              <ClinicMap className="flex-1" />
            </div>
            <BookingForm />
          </div>
        </div>
      </section>
      <FaqBlock eyebrow={t("faq.eyebrow")} title={t("faq.title")} items={faqItems} />
      <FinalCta title={t("finalCta.title")} text={t("finalCta.text")} />
    </>
  );
}
