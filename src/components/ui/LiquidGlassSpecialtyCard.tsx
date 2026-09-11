"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function LiquidGlassSpecialtyCard({
  title,
  icon: Icon,
  image,
  href,
}: {
  title: string;
  icon: LucideIcon;
  image?: string;
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
          {image ? (
            <div className="relative h-32 w-32 transition-transform duration-300 group-hover:scale-105 sm:h-36 sm:w-36">
              <Image
                src={image}
                alt={title}
                fill
                sizes="160px"
                className="object-contain"
                style={{
                  maskImage: "radial-gradient(circle, black 58%, transparent 88%)",
                  WebkitMaskImage: "radial-gradient(circle, black 58%, transparent 88%)",
                }}
              />
            </div>
          ) : (
            <div className="liquid-glass relative flex h-28 w-28 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-32">
              {/* glossy sphere highlight, simulating light on curved glass */}
              <span
                className="pointer-events-none absolute start-3 top-3 h-8 w-8 rounded-full bg-gradient-to-br from-white/90 via-white/30 to-transparent blur-[2px]"
                aria-hidden="true"
              />
              {/* soft glass-toned glow */}
              <motion.span
                className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-gold/25 via-brand-200/30 to-transparent blur-md"
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              <span className="relative h-11 w-11 sm:h-14 sm:w-14">
                <Icon
                  className="absolute inset-0 h-full w-full text-brand-gold/50 blur-[2px]"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                <Icon
                  className="relative h-full w-full text-brand-forest"
                  strokeWidth={1.3}
                  style={{ filter: "drop-shadow(0 3px 6px rgba(10,42,34,0.2))" }}
                />
              </span>
            </div>
          )}
          {/* glass pedestal platform the badge appears to rest on */}
          <div className="liquid-glass -mt-2 h-2.5 w-20 rounded-full opacity-70" aria-hidden="true" />
          <div className="-mt-1 h-2 w-12 rounded-full bg-brand-900/15 blur-[3px]" aria-hidden="true" />
        </div>

        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white text-brand-gold shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-forest group-hover:text-white">
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </span>
      </Link>
    </motion.div>
  );
}
