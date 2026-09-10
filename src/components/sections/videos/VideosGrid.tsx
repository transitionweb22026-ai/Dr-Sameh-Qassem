"use client";

import { Play } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

type Video = { category: string; title: string; duration: string };

export function VideosGrid({ items }: { items: Video[] }) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StaggerGroup className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
          {items.map((video) => (
            <StaggerItem key={video.title}>
              <div className="group relative rounded-3xl overflow-hidden aspect-[9/16] bg-brand-forest shadow-luxury">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-700/70 via-brand-900/80 to-brand-deep group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-16 h-16 rounded-full bg-brand-gold/40 blur-xl group-hover:bg-brand-gold/60 transition-all" />
                  <button
                    type="button"
                    aria-label={video.title}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-gold text-brand-forest flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current -translate-x-0.5 rtl:translate-x-0.5" />
                  </button>
                </div>
                <span className="absolute top-3 end-3 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  {video.duration}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wide">
                    {video.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 mt-1">
                    {video.title}
                  </h3>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
