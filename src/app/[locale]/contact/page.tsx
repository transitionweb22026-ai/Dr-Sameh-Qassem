import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
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
  const meta = await getTranslations({ locale, namespace: "meta.pages.contact" });
  const description = meta("description");
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
    description,
    alternates: buildAlternates(locale, "/contact"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const common = await getTranslations({ locale, namespace: "common" });

  const faqItems = t.raw("faq.items") as Faq[];

  return (
    <>
      <GlobalHeroSection
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitle={t("hero.subtitle")}
        primaryCta={{ label: t("hero.primaryCta"), href: "tel:+201001234567" }}
        secondaryCta={{ label: t("hero.secondaryCta"), href: "#booking-form" }}
        followLabel={common("followUs")}
        showDoctor
        doctorImage={t("hero.image")}
        doctorImageAlt={t("hero.title")}
        bg3DElement="skull"
        bookingCard={{
          title: common("bookingCard.title"),
          text: common("bookingCard.text"),
          cta: common("bookingCard.cta"),
        }}
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
