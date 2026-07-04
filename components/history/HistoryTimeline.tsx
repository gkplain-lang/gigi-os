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
    <div className="animate-fade-in space-y-12">
      {groups.map((group) => {
        const groupEvents = events.filter((e) => e.group === group);
        if (groupEvents.length === 0) return null;

        return (
          <section key={group}>
            <h2 className="mb-6 text-[13px] font-medium uppercase tracking-wide text-copper-soft">
              {groupLabels[group]}
            </h2>
            <div className="ml-1 space-y-7 border-l border-white/[0.06] pl-8">
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
