import Link from "next/link";
import type { HistoryEvent } from "@/modules/history/historyTypes";
import { REFINED_EMPTY_STATES } from "@/modules/dailyUseRefinement";
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

  if (events.length === 0) {
    const empty = REFINED_EMPTY_STATES.history;
    return (
      <div className="gigi-empty-state rounded-xl px-6 py-8 text-center">
        <p className="text-[15px] font-semibold text-text-primary">{empty.title}</p>
        <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-text-secondary">
          {empty.body}
        </p>
        {empty.actionHref && empty.actionLabel && (
          <Link
            href={empty.actionHref}
            className="gigi-focus mt-4 inline-block text-[13px] text-accent-soft hover:underline"
          >
            {empty.actionLabel}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10">
      {groups.map((group) => {
        const groupEvents = events.filter((e) => e.group === group);
        if (groupEvents.length === 0) return null;

        return (
          <section key={group}>
            <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-wide text-accent-soft/80">
              {groupLabels[group]}
            </h2>
            <div className="relative space-y-6">
              <span
                className="pointer-events-none absolute left-4 top-2 bottom-2 w-px -translate-x-1/2 bg-gradient-to-b from-accent/40 via-accent/15 to-transparent"
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
