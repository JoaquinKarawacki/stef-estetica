import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-ink-700/[0.06] bg-cream-50 shadow-[0_20px_60px_-30px_rgba(74,47,52,0.25)]",
        className
      )}
      {...props}
    />
  );
}

export function CardShell({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[2rem] bg-ink-700/[0.03] p-1.5 ring-1 ring-ink-700/[0.06]", className)}
      {...props}
    />
  );
}
