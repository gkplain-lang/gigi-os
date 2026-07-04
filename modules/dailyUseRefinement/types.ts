import type { DailyUseEmptyState } from "@/modules/dailyUse/types";

export type RefinementEmptyStateKey = "history" | "conversation" | "feedback" | "feedbackEntries";

export interface RefinementEmptyState extends DailyUseEmptyState {
  key: RefinementEmptyStateKey;
}

export interface MissionActionLabels {
  start: string;
  complete: string;
  postpone: string;
  reject: string;
  inProgressHint: string;
  recommendedHint: string;
}

export interface SimulationNote {
  short: string;
  long: string;
  pageHint: string;
}
