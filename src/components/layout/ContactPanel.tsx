"use client";

import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { FadeIn } from "@/components/motion/FadeIn";
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";

export function ContactPanel() {
  const t = useTranslations("heroPanel");
  const common = useTranslations("common");

  return (
    <div className="space-y-4">
      <FadeIn direction="left" delay={0.2}>
        <a
          href={siteConfig.phoneHref}
          className="liquid-glass-dark rounded-2xl p-4 flex items-center gap-3.5 group block hover:border-brand-gold/60 hover:-translate-y-1 transition-transform duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-gold text-brand-deep flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6" />
          </div>
          <div className="text-start">
            <div className="text-xs font-semibold text-brand-goldLight">{t("hotlineLabel")}</div>
            <div className="text-base font-black text-white" dir="ltr">
              {siteConfig.phoneDisplay}
            </div>
          </div>
        </a>
      </FadeIn>

      <FadeIn direction="left" delay={0.3}>
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="liquid-glass-dark rounded-2xl p-4 flex items-center gap-3.5 group block hover:border-emerald-400/60 hover:-translate-y-1 transition-transform duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
            <WhatsAppIcon className="w-6 h-6" />
          </div>
          <div className="text-start">
            <div className="text-xs font-semibold text-emerald-400">{t("whatsappLabel")}</div>
            <div className="text-sm font-bold text-white">{t("whatsappSub")}</div>
          </div>
        </a>
      </FadeIn>

      <FadeIn direction="left" delay={0.4}>
        <div className="liquid-glass-dark rounded-2xl p-3 flex items-center justify-between px-5">
          <span className="text-xs text-brand-100/80 font-semibold hidden sm:inline">
            {common("channels")}
          </span>
          <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-brand-deep text-white flex items-center justify-center transition-all duration-300"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-brand-deep text-white flex items-center justify-center transition-all duration-300"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-gold hover:text-brand-deep text-white flex items-center justify-center transition-all duration-300"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
