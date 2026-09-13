"use client";

import { DynamicIcon } from "@/lib/icons";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type Stat = { icon: string; value: number; suffix: string; label: string };

export function StatsSection({
  stats,
  eyebrow,
  title,
  text,
}: {
  stats: Stat[];
  eyebrow?: string;
  title?: string;
  text?: string;
}) {
  if (stats.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-brand-ivory relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {title ? <SectionHeading align="center" eyebrow={eyebrow} title={title} text={text} /> : null}
        <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <StaggerItem key={stat.label} direction="none">
              <div className="liquid-glass glass-interactive rounded-3xl p-5 sm:p-6 flex items-center gap-4 h-full">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold">
                  <DynamicIcon name={stat.icon} className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
                </div>
                <div className="text-start min-w-0">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="block text-xl sm:text-2xl font-black leading-tight text-brand-forest font-tajawal"
                  />
                  <div className="text-xs sm:text-sm font-medium text-brand-800/70 leading-snug">
                    {stat.label}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
