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
  Waves,
  Skull,
  Bone,
  Network,
  type LucideIcon,
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
  waves: Waves,
  skull: Skull,
  bone: Bone,
  network: Network,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? Activity;
}
