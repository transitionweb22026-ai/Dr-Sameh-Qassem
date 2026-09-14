import type { Section } from "@/lib/cms-types";

/** Resolves a bilingual pair to the requested locale, falling back to
 * whichever language actually has a value. */
export function pickLocale(locale: string, en: string | null, ar: string | null): string {
  const value = locale === "ar" ? ar : en;
  return value ?? (locale === "ar" ? en : ar) ?? "";
}

export function sectionHeading(locale: string, section: Section | undefined) {
  if (!section) return { eyebrow: "", title: "", text: "" };
  return {
    eyebrow: pickLocale(locale, section.eyebrow_en, section.eyebrow_ar),
    title: pickLocale(locale, section.title_en, section.title_ar),
    text: pickLocale(locale, section.text_en, section.text_ar) || undefined,
  };
}

/** Props for the shared <FinalCta>: an absent section (or one whose title
 * was cleared) leaves `title` as `undefined` so the component's own
 * generic default kicks in, rather than rendering a blank headline. */
export function finalCtaProps(locale: string, section: Section | undefined) {
  if (!section) return { locale };
  return {
    locale,
    title: pickLocale(locale, section.title_en, section.title_ar) || undefined,
    titleHighlight: pickLocale(locale, section.title_highlight_en, section.title_highlight_ar) || undefined,
    text: pickLocale(locale, section.text_en, section.text_ar) || undefined,
  };
}

export function metaString(meta: Record<string, unknown>, key: string): string {
  const value = meta[key];
  return typeof value === "string" ? value : "";
}

export function metaNumber(meta: Record<string, unknown>, key: string): number {
  const value = meta[key];
  return typeof value === "number" ? value : 0;
}
