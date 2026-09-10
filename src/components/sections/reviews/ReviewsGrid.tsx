"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StarRating } from "@/components/ui/StarRating";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

type Review = {
  name: string;
  location: string;
  procedure: string;
  category: string;
  rating: number;
  text: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function ReviewsGrid({
  filters,
  items,
}: {
  filters: string[];
  items: Review[];
}) {
  const [active, setActive] = useState(filters[0]);

  const filtered = useMemo(() => {
    if (active === filters[0]) return items;
    return items.filter((item) => item.category === active);
  }, [active, items, filters]);

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border",
                active === filter
                  ? "bg-brand-forest text-white border-brand-forest shadow-md"
                  : "bg-white text-brand-800 border-brand-900/15 hover:border-brand-gold hover:text-brand-gold"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filtered.map((review) => (
                <StaggerItem key={review.name}>
                  <GlassCard className="p-8 flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <StarRating rating={review.rating} />
                        <div className="w-9 h-9 rounded-full bg-gradient-to-b from-white to-brand-100/50 shadow-inner flex items-center justify-center shrink-0">
                          <Quote className="w-4 h-4 text-brand-gold" strokeWidth={1.8} />
                        </div>
                      </div>
                      <p className="text-sm text-brand-800 leading-relaxed font-medium">
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-brand-900/10 flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-brand-forest text-brand-gold flex items-center justify-center font-bold shrink-0">
                        {initials(review.name)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-brand-forest">{review.name}</h3>
                        <span className="text-xs text-brand-700">
                          {review.location} • {review.procedure}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
