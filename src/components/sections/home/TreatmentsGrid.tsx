"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { FadeIn } from "@/components/motion/FadeIn";

type Treatment = { title: string; text: string; note?: string; image?: string };

export function TreatmentsGrid({
  eyebrow,
  title,
  text,
  cta,
  items,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  cta: string;
  items: Treatment[];
}) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden" id="services">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading align="between" eyebrow={eyebrow} title={title} text={text} />

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <GlassCard className="p-8 h-full">
                {item.image ? (
                  <div className="relative mb-5 h-40 w-full overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-2 w-12 bg-brand-gold rounded-full mb-6" />
                )}
                <h3 className="text-xl font-bold text-brand-forest mb-3">{item.title}</h3>
                <p className="text-sm text-brand-800/80 leading-relaxed mb-6">{item.text}</p>
                {item.note ? (
                  <div className="p-3.5 bg-brand-50/90 rounded-xl text-xs font-semibold text-brand-800 border border-brand-200/60">
                    {item.note}
                  </div>
                ) : null}
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <FadeIn delay={0.2}>
          <div className="mt-14 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-brand-forest text-white font-bold text-sm hover:bg-brand-900 transition-all duration-300 shadow-xl hover:scale-105 border border-emerald-700/30"
            >
              <span>{cta}</span>
              <ArrowRight className="w-4 h-4 text-brand-gold rtl:rotate-180" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
