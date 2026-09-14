"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { useVideoModal } from "@/components/ui/VideoModal";

export function WideVideoPlayer({
  eyebrow,
  title,
  text,
  poster,
  duration,
  videoUrl,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  poster: string;
  duration: string;
  videoUrl?: string;
}) {
  const { openVideo } = useVideoModal();
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-forest font-tajawal text-balance">
            {title}
          </h2>
          {text ? (
            <p className="text-brand-800/80 leading-relaxed max-w-2xl mx-auto mt-4">{text}</p>
          ) : null}
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/80 group mt-10">
            <Image
              src={poster}
              alt={title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-brand-deep/50 flex items-center justify-center">
              <button
                aria-label={title}
                type="button"
                onClick={() => openVideo(videoUrl, title)}
                className="w-20 h-20 rounded-full bg-brand-gold/95 text-brand-forest flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
              >
                <Play className="w-9 h-9 fill-current -translate-x-0.5 rtl:translate-x-0.5" />
              </button>
            </div>
            <span className="absolute bottom-4 end-4 bg-black/70 px-3 py-1 rounded-lg text-xs font-mono text-white">
              {duration}
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
