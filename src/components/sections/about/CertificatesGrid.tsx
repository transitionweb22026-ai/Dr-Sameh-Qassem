"use client";

import { Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

type Certificate = { title: string; org: string };

export function CertificatesGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Certificate[];
}) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((cert) => (
            <StaggerItem key={cert.title}>
              <div className="group [perspective:1200px] h-40">
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 liquid-glass rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 [backface-visibility:hidden]">
                    <div className="w-12 h-12 rounded-xl bg-brand-forest text-brand-gold flex items-center justify-center">
                      <Award className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <h3 className="text-sm font-bold text-brand-forest leading-snug">
                      {cert.title}
                    </h3>
                  </div>
                  <div
                    className="absolute inset-0 rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-2 bg-brand-forest text-white [backface-visibility:hidden]"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <span className="text-brand-gold text-xs font-bold uppercase tracking-wider">
                      {cert.org}
                    </span>
                    <p className="text-xs text-brand-100/80">{cert.title}</p>
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
