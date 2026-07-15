import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function WhatsappPreviewCard({
  message,
  time,
  className,
}: {
  message: string;
  time: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-ink-700/[0.08]", className)}>
      <div className="flex items-center gap-2 bg-[#075E54] px-4 py-2.5 text-ink-900">
        <MessageCircle className="h-4 w-4" />
        <span className="text-[13px] font-medium">Stef Valdez Estética</span>
        <span className="ml-auto rounded-full bg-ink-900/15 px-2 py-0.5 text-[9px] font-medium tracking-wide uppercase">
          Simulado
        </span>
      </div>
      <div className="bg-[#e5ddd5] px-4 py-4">
        <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-3 py-2 shadow-sm">
          <p className="text-[13.5px] leading-relaxed text-[#1c1510]">{message}</p>
          <p className="mt-1 text-right text-[10px] text-[#1c1510]/45">{time}</p>
        </div>
      </div>
    </div>
  );
}
