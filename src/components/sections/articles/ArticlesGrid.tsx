"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type Article = {
  date: string;
  readTime: string;
  category: string;
  title: string;
  text: string;
};

export function ArticlesGrid({ items }: { items: Article[] }) {
  const common = useTranslations("common");

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((article) => (
            <StaggerItem key={article.title}>
              <GlassCard className="p-7 flex flex-col justify-between h-full group">
                <div className="space-y-3">
                  <span className="text-[11px] text-brand-gold font-bold uppercase tracking-wide">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold text-brand-forest group-hover:text-brand-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-800/80 leading-relaxed">
                    {article.text}
                  </p>
                </div>
                <div className="pt-6 mt-4 border-t border-brand-900/10 flex items-center justify-between">
                  <span className="text-[11px] text-brand-700 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest group-hover:text-brand-gold transition-colors"
                  >
                    <span>{common("readMore")}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
