import type { LucideIcon } from "lucide-react";
import { StaggerItem } from "@/components/motion/Stagger";

export function LegalSection({
  icon: Icon,
  title,
  text,
  list,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
  list?: string[];
}) {
  return (
    <StaggerItem>
      <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/55 p-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.85),0_12px_30px_-18px_rgba(10,42,34,0.25)] backdrop-blur-sm transition-all duration-300 hover:border-brand-gold/40 hover:bg-white/75 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-forest via-brand-deep to-brand-deep shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_6px_16px_rgba(10,42,34,0.25)]">
            <span
              className="absolute inset-1 rounded-xl border border-dashed border-brand-gold/30"
              aria-hidden="true"
            />
            <Icon
              className="relative h-5 w-5 text-brand-goldLight"
              strokeWidth={1.8}
              style={{ filter: "drop-shadow(0 0 5px rgba(197,160,89,0.75))" }}
            />
          </div>
          <div className="min-w-0 flex-1 space-y-3 pt-1">
            <h3 className="font-tajawal text-lg font-extrabold text-brand-forest sm:text-xl">
              {title}
            </h3>
            {text ? (
              <p className="text-sm leading-relaxed text-brand-800/85 sm:text-[15px]">{text}</p>
            ) : null}
            {list && list.length > 0 ? (
              <ul className="space-y-2.5 pt-1">
                {list.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-800/80"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}
