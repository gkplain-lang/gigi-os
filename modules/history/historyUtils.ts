import type { HistoryEvent, HistoryEventType } from "./historyTypes";

export function getHistoryGroup(date: Date): HistoryEvent["group"] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - eventDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  return "earlier";
}

export function createHistoryEntry(
  type: HistoryEventType,
  title: string,
  description?: string
): HistoryEvent {
  const now = new Date();
  return {
    id: `h-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    title,
    description,
    date: now.toISOString().split("T")[0],
    group: getHistoryGroup(now),
  };
}

export function refreshHistoryGroups(events: HistoryEvent[]): HistoryEvent[] {
  return events.map((event) => ({
    ...event,
    group: getHistoryGroup(new Date(event.date)),
  }));
}
