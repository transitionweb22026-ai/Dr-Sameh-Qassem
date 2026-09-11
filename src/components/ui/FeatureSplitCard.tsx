"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { PlayButton } from "./PlayButton";
import { FadeIn } from "@/components/motion/FadeIn";
import { useVideoModal } from "@/components/ui/VideoModal";

export function FeatureSplitCard({
  eyebrow,
  title,
  text,
  image,
  imageAlt,
  duration,
  playVariant = "glass",
  videoUrl,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  duration?: string;
  playVariant?: "glass" | "gold";
  videoUrl?: string;
  children?: ReactNode;
}) {
  const { openVideo } = useVideoModal();
  return (
    <FadeIn>
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/40 grid grid-cols-1 lg:h-[310px] lg:grid-cols-[36%_64%] bg-brand-forest">
        <div className="h-full px-6 py-6 sm:px-8 sm:py-7 lg:px-8 lg:py-6 flex flex-col justify-center gap-3">
          <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3.5 py-1.5 text-brand-gold font-bold text-[11px] tracking-[0.15em] uppercase">
            {eyebrow}
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-2xl font-black text-brand-goldLight font-tajawal leading-tight text-balance">
            {title}
          </h2>
          <p
            className="text-xs sm:text-sm text-brand-100/85 leading-relaxed max-w-md line-clamp-2"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          {children}
        </div>

        <div className="relative aspect-video overflow-hidden rounded-b-3xl lg:aspect-auto lg:h-full lg:rounded-b-none lg:rounded-e-3xl">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-deep/25 flex items-center justify-center">
            <PlayButton
              label={imageAlt}
              variant={playVariant}
              size="md"
              onClick={() => openVideo(videoUrl, title)}
            />
          </div>
          {duration ? (
            <span className="absolute bottom-3 end-3 bg-black/60 px-3 py-1 rounded-lg text-xs font-mono text-white">
              {duration}
            </span>
          ) : null}
        </div>
      </div>
    </FadeIn>
  );
}
