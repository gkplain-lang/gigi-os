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
    <div className="space-y-10">
      {groups.map((group) => {
        const groupEvents = events.filter((e) => e.group === group);
        if (groupEvents.length === 0) return null;

        return (
          <section key={group}>
            <h2 className="mb-5 text-[13px] font-medium uppercase tracking-wide text-text-muted">
              {groupLabels[group]}
            </h2>
            <div className="ml-1 space-y-6 border-l border-white/[0.07] pl-7">
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
