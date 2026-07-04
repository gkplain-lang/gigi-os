import type { HistoryEvent } from "../history/historyTypes";

/** Groups considered "recent" for daily review signals. */
export const RECENT_HISTORY_GROUPS: ReadonlySet<HistoryEvent["group"]> = new Set([
  "today",
  "yesterday",
]);

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function filterRecentEvents(events: HistoryEvent[]): HistoryEvent[] {
  return events.filter((e) => RECENT_HISTORY_GROUPS.has(e.group));
}

export function filterTodayEvents(events: HistoryEvent[]): HistoryEvent[] {
  return events.filter((e) => e.group === "today");
}

export function filterYesterdayEvents(events: HistoryEvent[]): HistoryEvent[] {
  return events.filter((e) => e.group === "yesterday");
}
