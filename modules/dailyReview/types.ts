import type { HistoryEvent } from "../history/historyTypes";
import type { NotNowItem } from "../conversation/conversationTypes";

export interface DailyReviewMissionRef {
  missionId: string;
  title: string;
  projectId: string;
  projectName: string;
}

export interface DailyReviewBlocker {
  type:
    | "postponed_mission"
    | "dismissed_mission"
    | "no_recent_completion"
    | "stale_project"
    | "project_switching"
    | "no_active_mission"
    | "completed_without_next_step"
    | "agent_action_blocked";
  message: string;
  severity: "low" | "medium" | "high";
}

export interface StaleProject {
  projectId: string;
  projectName: string;
  reason: string;
  daysSinceActivity: number | null;
}

export interface DailyReviewSnapshot {
  date: string;
  currentMission: DailyReviewMissionRef & { phase: string };
  activeMission: DailyReviewMissionRef | null;
  completedMissionsRecent: DailyReviewMissionRef[];
  postponedMissionsRecent: DailyReviewMissionRef[];
  dismissedMissionsRecent: DailyReviewMissionRef[];
  recentHistoryEvents: HistoryEvent[];
  staleProjects: StaleProject[];
  possibleBlockers: DailyReviewBlocker[];
  suggestedFocus: string;
  ignoredToday: NotNowItem[];
  nextStep: string;
  confidenceScore: number;
  /** Short bilan for conversation listen field */
  shortSummary: string;
}

export interface DailyReviewSummary {
  date: string;
  phase: string;
  recentEventCount: number;
  staleProjectCount: number;
  blockerCount: number;
  suggestedFocus: string;
  confidenceScore: number;
  shortSummary: string;
}
