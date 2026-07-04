import type { HistoryEvent } from "@/modules/history/historyTypes";
import { HistoryEventCard } from "./HistoryEventCard";

interface HistoryTimelineProps {
  events: HistoryEvent[];
}

const groupLabels: Record<HistoryEvent["group"], string> = {
  today: "Aujourd'hui",
  yesterday: "Hier",
  earlier: "Plus tôt",
};

export function HistoryTimeline({ events }: HistoryTimelineProps) {
  const groups = ["today", "yesterday", "earlier"] as const;

  return (
    <div className="animate-fade-in space-y-10">
      {groups.map((group) => {
        const groupEvents = events.filter((e) => e.group === group);
        if (groupEvents.length === 0) return null;

        return (
          <section key={group}>
            <h2 className="mb-5 text-[13px] font-medium uppercase tracking-wide text-text-secondary">
              {groupLabels[group]}
            </h2>
            <div className="relative space-y-6">
              {/* Vertical memory line, aligned to icon centers */}
              <span
                className="pointer-events-none absolute left-4 top-2 bottom-2 w-px -translate-x-1/2 bg-white/[0.06]"
                aria-hidden
              />
              {groupEvents.map((event) => (
                <HistoryEventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
