"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitch() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isAr = locale === "ar";

  function toggle() {
    const nextLocale = isAr ? "en" : "ar";
    router.replace(
      // @ts-expect-error - pathname is dynamic across locales
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <button type="button" onClick={toggle} aria-label={t("langSwitch")} className="lang-track">
      <div
        className="lang-thumb"
        style={{ transform: isAr ? "translateX(50px)" : "translateX(0)" }}
      />
      <span
        className={`z-10 text-xs font-bold w-1/2 text-center transition-colors duration-200 ${
          isAr ? "text-brand-800" : "text-white"
        }`}
      >
        EN
      </span>
      <span
        className={`z-10 text-xs font-bold w-1/2 text-center transition-colors duration-200 ${
          isAr ? "text-white" : "text-brand-800"
        }`}
      >
        AR
      </span>
    </button>
  );
}
