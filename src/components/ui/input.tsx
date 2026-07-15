import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-ink-700/10 bg-cream-50 px-4 text-[15px] text-ink-700 placeholder:text-ink-700/40 transition-colors duration-150 outline-none focus:border-burgundy-400 focus:ring-2 focus:ring-burgundy-400/15",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-2xl border border-ink-700/10 bg-cream-50 px-4 py-3 text-[15px] text-ink-700 placeholder:text-ink-700/40 transition-colors duration-150 outline-none focus:border-burgundy-400 focus:ring-2 focus:ring-burgundy-400/15",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-[13px] font-medium text-ink-700/70", className)}
      {...props}
    />
  );
}
