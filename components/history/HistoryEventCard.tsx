import type { HistoryEvent } from "@/modules/history/historyTypes";
import { cn } from "@/lib/utils";

interface HistoryEventCardProps {
  event: HistoryEvent;
}

export function HistoryEventCard({ event }: HistoryEventCardProps) {
  const isDecision = event.type === "decision_created";

  return (
    <div className="relative">
      <span
        className={cn(
          "absolute -left-[27px] top-2 h-2.5 w-2.5 rounded-full",
          isDecision ? "bg-copper-soft shadow-[0_0_10px_rgba(196,138,74,0.5)]" : "bg-white/20"
        )}
        aria-hidden
      />
      <p className="text-[15px] font-medium text-text-primary md:text-base">{event.title}</p>
      {event.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{event.description}</p>
      )}
    </div>
  );
}
