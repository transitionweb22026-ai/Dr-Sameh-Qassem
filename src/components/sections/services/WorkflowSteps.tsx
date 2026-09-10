import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type Step = { title: string; text: string };

export function WorkflowSteps({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: Step[];
}) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <StaggerItem key={step.title}>
              <GlassCard className="p-6 h-full relative">
                <span className="absolute -top-4 start-6 w-9 h-9 rounded-full bg-brand-forest text-brand-gold font-black text-sm flex items-center justify-center shadow-md border-2 border-brand-ivory">
                  {index + 1}
                </span>
                <h3 className="text-base font-bold text-brand-forest mt-4 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-brand-800/80 leading-relaxed">{step.text}</p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
