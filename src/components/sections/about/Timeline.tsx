"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

type TimelineItem = { year: string; title: string; text: string };

export function Timeline({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: TimelineItem[];
}) {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} />

        <StaggerGroup className="relative">
          <div className="absolute start-[27px] top-2 bottom-2 w-0.5 bg-brand-200" aria-hidden="true" />
          <div className="space-y-6">
            {items.map((item, index) => (
              <StaggerItem key={item.year} direction="right">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className="w-full flex items-start gap-6 text-start group"
                >
                  <span
                    className={cn(
                      "relative z-10 shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 border-2",
                      active === index
                        ? "bg-brand-forest text-brand-gold border-brand-gold scale-110 shadow-emerald-glow"
                        : "bg-white text-brand-forest border-brand-200 group-hover:border-brand-gold"
                    )}
                  >
                    <GraduationCap className="w-6 h-6" strokeWidth={1.8} />
                  </span>
                  <GlassCard
                    hover={false}
                    className={cn(
                      "flex-1 p-5 rounded-2xl transition-all duration-300",
                      active === index && "border-brand-gold/50 shadow-liquid-hover"
                    )}
                  >
                    <span className="text-brand-gold font-black text-sm">{item.year}</span>
                    <h3 className="text-base sm:text-lg font-bold text-brand-forest mt-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-brand-800/80 mt-1 leading-relaxed">{item.text}</p>
                  </GlassCard>
                </button>
              </StaggerItem>
            ))}
          </div>
        </StaggerGroup>
      </div>
    </section>
  );
}
