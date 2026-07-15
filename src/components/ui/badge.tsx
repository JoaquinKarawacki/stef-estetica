import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-gold-400/10 px-4 py-1.5 text-[11px] font-medium tracking-[0.25em] text-gold-600 uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Badge({
  children,
  className,
  tone = "blush",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "blush" | "gold" | "burgundy" | "neutral";
}) {
  const tones: Record<string, string> = {
    blush: "bg-blush-100 text-burgundy-600",
    gold: "bg-gold-400/15 text-gold-600",
    burgundy: "bg-burgundy-500 text-ink-900",
    neutral: "bg-ink-700/5 text-ink-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
