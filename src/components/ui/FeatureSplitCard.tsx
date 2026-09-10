import Image from "next/image";
import type { ReactNode } from "react";
import { PlayButton } from "./PlayButton";
import { FadeIn } from "@/components/motion/FadeIn";

export function FeatureSplitCard({
  eyebrow,
  title,
  text,
  image,
  imageAlt,
  duration,
  playVariant = "glass",
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  duration?: string;
  playVariant?: "glass" | "gold";
  children?: ReactNode;
}) {
  return (
    <FadeIn>
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/40 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-brand-forest p-10 sm:p-12 lg:p-14 flex flex-col justify-center gap-5">
          <span className="text-brand-gold font-bold text-xs tracking-[0.15em] uppercase">
            {eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-black text-white font-tajawal leading-tight text-balance">
            {title}
          </h2>
          <p
            className="text-sm sm:text-base text-brand-100/85 leading-relaxed max-w-md"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          {children}
        </div>

        <div className="relative bg-brand-forest flex items-center justify-center p-5 sm:p-6 lg:p-8">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-deep/25 flex items-center justify-center">
              <PlayButton label={imageAlt} variant={playVariant} size="md" />
            </div>
            {duration ? (
              <span className="absolute bottom-3 end-3 bg-black/60 px-3 py-1 rounded-lg text-xs font-mono text-white">
                {duration}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
