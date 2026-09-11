"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlayButton({
  label,
  size = "lg",
  variant = "gold",
  className,
  onClick,
}: {
  label: string;
  size?: "md" | "lg";
  variant?: "gold" | "glass";
  className?: string;
  onClick?: () => void;
}) {
  const dimensions = size === "lg" ? "w-20 h-20" : "w-14 h-14";
  const iconSize = size === "lg" ? "w-9 h-9" : "w-6 h-6";
  const ringColor = variant === "glass" ? "bg-white/50" : "bg-brand-gold/60";
  const ringColorSoft = variant === "glass" ? "bg-white/40" : "bg-brand-gold/50";

  return (
    <div className="relative flex items-center justify-center">
      <motion.span
        aria-hidden="true"
        className={cn("absolute rounded-full", ringColor, dimensions)}
        animate={{ scale: [1, 1.6], opacity: [0.55, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        aria-hidden="true"
        className={cn("absolute rounded-full", ringColorSoft, dimensions)}
        animate={{ scale: [1, 1.6], opacity: [0.55, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
      />
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={cn(
          "relative rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110",
          variant === "glass"
            ? "bg-white/25 backdrop-blur-md border border-white/50 text-white hover:bg-white/35"
            : "bg-brand-gold/95 text-brand-forest hover:shadow-gold-glow",
          dimensions,
          className
        )}
      >
        <Play className={cn(iconSize, "fill-current -translate-x-0.5 rtl:translate-x-0.5")} />
      </button>
    </div>
  );
}
