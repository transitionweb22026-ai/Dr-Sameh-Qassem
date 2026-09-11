import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import {
  ClipboardList,
  ShieldCheck,
  MessageCircle,
  Cookie,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { LegalHero } from "@/components/sections/legal/LegalHero";
import { LegalSection } from "@/components/sections/legal/LegalSection";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup } from "@/components/motion/Stagger";
import { Link } from "@/i18n/navigation";

const iconMap: Record<string, LucideIcon> = {
  clipboardList: ClipboardList,
  shieldCheck: ShieldCheck,
  messageCircle: MessageCircle,
  cookie: Cookie,
  userCog: UserCog,
};

type Section = { icon: string; title: string; text: string; list?: string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy.hero" });
  const meta = await getTranslations({ locale, namespace: "meta.pages.privacyPolicy" });
  const description = meta("description");
  return {
    title: `${t("title")} ${t("titleHighlight")}`,
    description,
    alternates: buildAlternates(locale, "/privacy-policy"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });
  const sections = t.raw("sections") as Section[];

  return (
    <>
      <LegalHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitle={t("hero.subtitle")}
        lastUpdated={t("hero.lastUpdated")}
      />
      <section className="relative overflow-hidden bg-brand-ivory py-20 sm:py-24">
        <AmbientGlow />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="liquid-glass rounded-[2.5rem] p-6 sm:p-10 md:p-12">
            <StaggerGroup className="space-y-6 sm:space-y-8">
              {sections.map((section) => (
                <LegalSection
                  key={section.title}
                  icon={iconMap[section.icon] ?? ShieldCheck}
                  title={section.title}
                  text={section.text}
                  list={section.list}
                />
              ))}
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
