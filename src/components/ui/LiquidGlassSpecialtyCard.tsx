"use client";

import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function LiquidGlassSpecialtyCard({
  title,
  icon: Icon,
  href,
}: {
  title: string;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full"
    >
      <Link
        href={href}
        className="relative flex h-full min-h-[300px] sm:min-h-[320px] flex-col items-center justify-between rounded-[2rem] border border-white/80 bg-gradient-to-b from-[#fbf9f5] to-[#f4f0ea] px-6 pt-7 pb-10 text-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_15px_35px_rgba(10,42,34,0.08)] transition-shadow duration-300 group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_25px_50px_rgba(10,42,34,0.16)]"
      >
        {/* Shimmer sweep, clipped to the card's own rounded corners without
            affecting the arrow button below, which deliberately overlaps
            the card's bottom edge. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
        </span>

        <h3 className="relative font-tajawal text-base sm:text-lg font-bold leading-tight tracking-wide text-brand-forest text-balance">
          {title}
        </h3>

        <div className="relative flex flex-col items-center">
          <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-forest via-brand-deep to-brand-deep shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_8px_20px_rgba(10,42,34,0.25)] transition-transform duration-300 group-hover:scale-105">
            {/* HUD-style dashed scanner ring */}
            <span
              className="absolute inset-1.5 rounded-full border border-dashed border-brand-gold/30"
              aria-hidden="true"
            />
            {/* pulsing glow behind the icon */}
            <motion.span
              className="absolute inset-3 rounded-full bg-brand-gold/25 blur-md"
              animate={{ opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <Icon
              className="relative h-9 w-9 sm:h-11 sm:w-11 text-brand-goldLight"
              strokeWidth={1.3}
              style={{ filter: "drop-shadow(0 0 6px rgba(197,160,89,0.85)) drop-shadow(0 0 12px rgba(94,164,140,0.45))" }}
            />
          </div>
          <div className="-mt-1 h-3 w-16 rounded-full bg-brand-900/10 blur-[3px]" aria-hidden="true" />
        </div>

        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white text-brand-gold shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-forest group-hover:text-white">
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </span>
      </Link>
    </motion.div>
  );
}
