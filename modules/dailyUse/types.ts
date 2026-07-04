import type { MissionStatus } from "@/modules/missions/missionTypes";

export type DailyUseMissionPhase =
  | "recommended"
  | "in_progress"
  | "completed"
  | "resting";

export interface DailyUseNextAction {
  label: string;
  hint: string;
  emphasis: "primary" | "secondary" | "neutral";
}

export interface DailyUseStripSummary {
  missionTitle: string;
  projectName: string;
  phase: DailyUseMissionPhase;
  nextAction: DailyUseNextAction;
  reviewPrompt: string;
}

export interface DailyUseEmptyState {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}

export type DailyUseEmptyStateKey = "history" | "feedback" | "conversation";

export interface DailyUseGuardrailsNote {
  short: string;
  long: string;
}

export const DAILY_USE_MISSION_STATUSES: MissionStatus[] = [
  "recommended",
  "in_progress",
  "completed",
  "postponed",
  "rejected_for_now",
];
