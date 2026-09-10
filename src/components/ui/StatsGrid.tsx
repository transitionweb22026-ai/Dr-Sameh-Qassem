"use client";

import { getIcon } from "@/lib/icons";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type Stat = { icon: string; value: number; suffix: string; label: string };

export function StatsGrid({ stats }: { stats: Stat[] }) {
  return (
    <section className="py-14 bg-brand-forest text-white relative overflow-hidden">
      <div
        className="absolute -end-20 -top-20 w-80 h-80 rounded-full bg-brand-700/30 blur-3xl animate-float-slow"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = getIcon(stat.icon);
            return (
              <StaggerItem key={stat.label}>
                <div className="liquid-glass-dark glass-interactive rounded-3xl p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4 h-full overflow-hidden">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 flex items-center justify-center text-brand-gold shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      className="text-3xl sm:text-4xl font-black text-white font-tajawal block leading-tight"
                    />
                    <div className="text-xs sm:text-sm text-brand-100/80 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
