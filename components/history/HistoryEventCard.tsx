import type { HistoryEvent } from "@/modules/history/historyTypes";
import { cn } from "@/lib/utils";

interface HistoryEventCardProps {
  event: HistoryEvent;
}

const HIGHLIGHTED_TYPES = new Set<HistoryEvent["type"]>([
  "decision_created",
  "mission_started",
  "mission_completed",
  "mission_postponed",
  "mission_rejected",
  "data_reset",
]);

export function HistoryEventCard({ event }: HistoryEventCardProps) {
  const isHighlighted = HIGHLIGHTED_TYPES.has(event.type);

  return (
    <div className="relative">
      <span
        className={cn(
          "absolute -left-[33px] top-1.5 h-2.5 w-2.5 rounded-full",
          isHighlighted
            ? "bg-copper-soft shadow-[0_0_12px_rgba(196,138,74,0.55)]"
            : "bg-white/20"
        )}
        aria-hidden
      />
      <p className="text-[15px] font-medium leading-snug text-text-primary md:text-base">
        {event.title}
      </p>
      {event.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{event.description}</p>
      )}
    </div>
  );
}
