import { createElement } from "react";
import {
  Brain,
  Activity,
  Building2,
  Smile,
  Clock,
  Award,
  Globe,
  Target,
  Zap,
  Stethoscope,
  Skull,
  Bone,
  Microscope,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  activity: Activity,
  building: Building2,
  smile: Smile,
  clock: Clock,
  award: Award,
  globe: Globe,
  spine: Bone,
  target: Target,
  zap: Zap,
  stethoscope: Stethoscope,
  skull: Skull,
  bone: Bone,
  microscope: Microscope,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Activity;
}

/** 3D glass-model card art, provided by the clinic, matched to specialty
 * topics with a genuine visual match. */
export const cardImageMap: Record<string, string> = {
  brain: "/images/brain.png",
  spine: "/images/spine.png",
  skull: "/images/pediatric.png",
  zap: "/images/nerves.png",
  microscope: "/images/instruments.png",
};

export function getCardImage(key: string): string | undefined {
  return cardImageMap[key];
}

/** Renders an icon looked up by key without assigning a dynamically
 * resolved component to a local variable in the caller's render body. */
export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  return createElement(getIcon(name), props);
}
