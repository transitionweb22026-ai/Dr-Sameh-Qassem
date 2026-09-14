"use client";

import { DynamicIcon } from "@/lib/icons";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type Stat = { icon: string; value: number; suffix: string; label: string };

/**
 * A single continuous glass bar of stats (icon + number + label, separated
 * by thin dividers) rather than separate cards — meant to float half over
 * the hero image and half over the page background beneath it.
 */
export function HeroStatsBar({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;

  return (
    <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="liquid-glass rounded-3xl px-1 py-1 sm:rounded-full sm:px-3 sm:py-2">
        <StaggerGroup className="grid grid-cols-2 divide-x divide-y divide-brand-900/10 rtl:divide-x-reverse sm:flex sm:divide-y-0">
          {stats.map((stat) => (
            <StaggerItem key={stat.label} direction="none">
              <div className="flex h-full items-center gap-3 px-3 py-3 sm:flex-1 sm:justify-center sm:px-5 sm:py-2">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                  <DynamicIcon name={stat.icon} className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 text-start">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="block text-base sm:text-xl font-black leading-tight text-brand-forest font-tajawal"
                  />
                  <div className="text-[11px] sm:text-xs font-medium text-brand-800/70 leading-snug">
                    {stat.label}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </div>
  );
}
