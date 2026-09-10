"use client";

import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function FaqSection() {
  const t = useTranslations("home.faqSection");
  const items = t.raw("items") as { q: string; a: string }[];

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} text={t("text")} />
        <Accordion items={items} />
      </div>
    </section>
  );
}
