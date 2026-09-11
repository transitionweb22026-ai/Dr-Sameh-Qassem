"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LiquidGlassSpecialtyCard } from "@/components/ui/LiquidGlassSpecialtyCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getIcon, getCardImage } from "@/lib/icons";

type Discipline = { icon: string; title: string; text: string; conditions: string[] };

export function DisciplinesGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Discipline[];
}) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <StaggerGroup
          once={false}
          className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:max-w-none lg:grid-cols-5 gap-6 pb-6"
        >
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <LiquidGlassSpecialtyCard
                title={item.title}
                icon={getIcon(item.icon)}
                image={getCardImage(item.icon)}
                href="/contact"
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
