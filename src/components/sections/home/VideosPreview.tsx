"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlayButton } from "@/components/ui/PlayButton";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { FadeIn } from "@/components/motion/FadeIn";

type Video = { category: string; title: string; duration: string };

export function VideosPreview() {
  const t = useTranslations("home.videosSection");
  const videosT = useTranslations("videosPage");
  const items = (videosT.raw("items") as Video[]).slice(0, 3);

  return (
    <section className="py-24 bg-brand-forest text-white relative" id="videos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="between"
          tone="dark"
          eyebrow={t("eyebrow")}
          title={t("title")}
          text={t("text")}
        />

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((video) => (
            <StaggerItem key={video.title}>
              <div className="liquid-glass-dark glass-interactive rounded-3xl overflow-hidden flex flex-col justify-between group h-full">
                <div className="relative h-52 bg-brand-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-700/60 to-brand-950/80 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <PlayButton label={video.title} size="md" />
                  </div>
                  <span className="absolute bottom-3 end-3 bg-black/70 px-2.5 py-0.5 rounded text-xs font-mono text-white">
                    {video.duration}
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-xs text-brand-gold font-bold">{video.category}</span>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-goldLight transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <FadeIn delay={0.2}>
          <div className="mt-14 text-center">
            <Link
              href="/videos"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-brand-gold text-brand-deep font-extrabold text-sm hover:bg-white transition-all duration-300 shadow-xl hover:scale-105 border border-brand-goldLight/40"
            >
              <span>{t("cta")}</span>
              <ArrowRight className="w-4 h-4 text-brand-deep rtl:rotate-180" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
