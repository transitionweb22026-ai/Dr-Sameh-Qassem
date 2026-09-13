"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DynamicIcon } from "@/lib/icons";
import { PlayButton } from "@/components/ui/PlayButton";
import { useVideoModal } from "@/components/ui/VideoModal";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type Bullet = { icon: string; title: string; text: string };

export function AboutPreview() {
  const t = useTranslations("home.about");
  const bullets = t.raw("bullets") as Bullet[];
  const videoUrl = t("videoUrl");
  const { openVideo } = useVideoModal();

  return (
    <section className="py-12 md:py-20 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16">
            <div className="group relative w-full aspect-[805/452] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src={t("image")}
                alt={t("eyebrow")}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brand-deep/20 flex items-center justify-center">
                <PlayButton
                  label={t("eyebrow")}
                  variant="glass"
                  size="lg"
                  onClick={() => openVideo(videoUrl, t("eyebrow"))}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6 py-4">
              <h2 className="font-tajawal text-2xl sm:text-3xl lg:text-4xl font-black leading-snug text-brand-gold text-balance">
                {t("mainTitle")}
              </h2>

              <StaggerGroup className="space-y-5">
                {bullets.map((bullet) => (
                  <StaggerItem key={bullet.title}>
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                        <DynamicIcon name={bullet.icon} className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-brand-forest leading-snug">
                          {bullet.title}
                        </h3>
                        <p className="mt-0.5 text-xs sm:text-sm text-brand-800/75 leading-relaxed">
                          {bullet.text}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>

              <Link
                href="/about"
                className="inline-flex w-fit items-center gap-2.5 rounded-full bg-brand-forest px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-900 hover:scale-105 shadow-lg"
              >
                <span>{t("cta")}</span>
                <ArrowRight className="h-4 w-4 text-brand-gold rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
