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
  Heart,
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
  heart: Heart,
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

/** True when an "icon" value is actually an uploaded image (admin picked a
 * file in the dashboard) rather than one of the built-in Lucide icon keys
 * above. Uploaded images are stored as full URLs or absolute paths. */
export function isIconImage(value: string): boolean {
  return value.startsWith("http") || value.startsWith("/");
}

/** Renders an icon looked up by key without assigning a dynamically
 * resolved component to a local variable in the caller's render body.
 * Falls back to an <img> when the admin uploaded an icon image instead of
 * picking one of the built-in keys — see `isIconImage`. */
export function DynamicIcon({ name, className, ...props }: { name: string } & LucideProps) {
  if (isIconImage(name)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={name} alt="" className={className} />;
  }
  return createElement(getIcon(name), { className, ...props });
}
