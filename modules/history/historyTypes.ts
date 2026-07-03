export type HistoryEventType =
  | "mission_completed"
  | "mission_started"
  | "mission_postponed"
  | "mission_rejected"
  | "decision_created"
  | "project_updated"
  | "document_created"
  | "data_reset";

export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  title: string;
  description?: string;
  date: string;
  group: "today" | "yesterday" | "earlier";
}
