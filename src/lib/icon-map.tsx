import { Activity, Droplet, Flower2, Gift, Sparkles, Waves, Zap, type LucideIcon } from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  gift: Gift,
  sparkles: Sparkles,
  droplet: Droplet,
  waves: Waves,
  activity: Activity,
  flower: Flower2,
};

export function getServiceIcon(icon: string): LucideIcon {
  return SERVICE_ICONS[icon] ?? Sparkles;
}
