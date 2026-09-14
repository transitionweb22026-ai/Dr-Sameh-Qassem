import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { cairo, tajawal, playfair, inter } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/controllers/siteSettings";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { VideoModalProvider } from "@/components/ui/VideoModal";
import "../../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const isAr = locale === "ar";

  return {
    metadataBase: new URL(siteConfig.domain),
    title: {
      default: t("titleSuffix"),
      template: `%s | ${t("siteName")}`,
    },
    description: isAr
      ? "د. سامح قاسم، استشاري جراحة المخ والأعصاب والعمود الفقري. جراحات ميكروسكوبية دقيقة وتدخل محدود بأعلى معايير السلامة العالمية."
      : "Dr. Sameh Qassem, Consultant Neurosurgeon & Spine Surgeon. Precise microsurgery and minimally invasive care with world-class safety standards.",
    alternates: {
      languages: { ar: "/ar", en: "/en" },
    },
    openGraph: {
      title: t("titleSuffix"),
      siteName: t("siteName"),
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  const settingsResult = await getSiteSettings();
  const contact = settingsResult.ok
    ? settingsResult.data
    : {
        phone_display: siteConfig.phoneDisplay,
        phone_href: siteConfig.phoneHref,
        whatsapp_number: siteConfig.whatsappNumber,
      };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} ${tajawal.variable} ${playfair.variable} ${inter.variable}`}
    >
      <body
        className={`antialiased bg-brand-ivory text-[#1e2d27] ${
          locale === "ar" ? "font-cairo" : "font-inter"
        }`}
      >
        <NextIntlClientProvider>
          <VideoModalProvider>
            <Navbar phoneHref={contact.phone_href} phoneDisplay={contact.phone_display} />
            <main>{children}</main>
            <Footer phoneDisplay={contact.phone_display} />
            <FloatingActions phoneHref={contact.phone_href} whatsappNumber={contact.whatsapp_number} />
          </VideoModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
