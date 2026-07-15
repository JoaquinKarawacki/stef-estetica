import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  const centerPetal = "M60,88 C48,74 48,44 60,18 C72,44 72,74 60,88 Z";
  const midPetal = "M60,88 C51,78 50,58 58,40 C66,58 68,78 60,88 Z";
  const sidePetal = "M60,88 C52,80 51,64 58,50 C65,64 67,80 60,88 Z";

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={cn("h-10 w-10", className)}
      role="img"
      aria-label="Stef Valdez Estética Integral"
    >
      <path d={centerPetal} stroke="var(--color-burgundy-500)" strokeWidth="2" strokeLinejoin="round" />
      <path
        d={midPetal}
        stroke="var(--color-burgundy-500)"
        strokeWidth="2"
        strokeLinejoin="round"
        transform="rotate(-32 60 88)"
      />
      <path
        d={midPetal}
        stroke="var(--color-burgundy-500)"
        strokeWidth="2"
        strokeLinejoin="round"
        transform="rotate(32 60 88)"
      />
      <path
        d={sidePetal}
        stroke="var(--color-gold-400)"
        strokeWidth="1.75"
        strokeLinejoin="round"
        transform="rotate(-58 60 88)"
      />
      <path
        d={sidePetal}
        stroke="var(--color-gold-400)"
        strokeWidth="1.75"
        strokeLinejoin="round"
        transform="rotate(58 60 88)"
      />
      <path
        d="M28,94 C40,86 80,86 92,94"
        stroke="var(--color-gold-400)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LogoMonogram({ className }: { className?: string }) {
  return (
    <span
      className={cn("font-script text-3xl leading-none text-ink-900", className)}
      aria-label="Stef Valdez"
    >
      VsS
    </span>
  );
}

export function Logo({
  className,
  markClassName,
  showTagline = true,
}: {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className={markClassName} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl tracking-[0.08em] text-ink-900 uppercase">
          Stef Valdez
        </span>
        {showTagline && (
          <span className="mt-1 flex items-center gap-2 text-[10px] font-medium tracking-[0.35em] text-burgundy-400 uppercase">
            <span className="h-px w-3 bg-burgundy-400/50" />
            Estética Integral
            <span className="h-px w-3 bg-burgundy-400/50" />
          </span>
        )}
      </span>
    </span>
  );
}

export function LogoBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-square w-full max-w-[220px] flex-col items-center justify-center rounded-full border border-gold-400/40 bg-cream-50 p-8 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      <div className="absolute inset-3 rounded-full border border-gold-400/25" />
      <LogoMark className="h-16 w-16" />
      <span className="mt-4 font-display text-lg tracking-[0.08em] text-ink-900 uppercase">
        Stef Valdez
      </span>
      <span className="mt-1.5 text-[9px] font-medium tracking-[0.3em] text-burgundy-400 uppercase">
        Estética Integral
      </span>
    </div>
  );
}
