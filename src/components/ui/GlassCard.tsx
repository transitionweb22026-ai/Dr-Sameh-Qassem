import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  as: Component = "div",
  variant = "light",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  variant?: "light" | "dark";
  hover?: boolean;
}) {
  const base = variant === "dark" ? "liquid-glass-dark" : "liquid-glass";

  return (
    <Component className={cn(base, "rounded-3xl", hover && "glass-interactive", className)}>
      {children}
    </Component>
  );
}
