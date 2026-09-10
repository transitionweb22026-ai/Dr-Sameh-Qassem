"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export function StaggerGroup({
  children,
  className,
  amount = 0.2,
  gap = 0.12,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  gap?: number;
  /** Set to false to replay the stagger every time the group re-enters the viewport. */
  once?: boolean;
}) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: gap },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={container}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}) {
  const offsets = {
    up: { y: 28 },
    left: { x: 28 },
    right: { x: -28 },
    none: {},
  } as const;

  const item: Variants = {
    hidden: { opacity: 0, ...offsets[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
