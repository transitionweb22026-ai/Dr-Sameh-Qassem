import { Brain, Activity, Target, Zap } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const icons = [Brain, Activity, Target, Zap];

type Item = { title: string; text: string };

export function ExpertiseGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Item[];
}) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <StaggerItem key={item.title}>
                <GlassCard className="p-7 h-full group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-forest text-brand-gold flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mb-5">
                    <Icon className="w-7 h-7" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-base font-bold text-brand-forest mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-800/80 leading-relaxed">{item.text}</p>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
