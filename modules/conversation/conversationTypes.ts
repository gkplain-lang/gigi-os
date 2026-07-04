import type { Mission } from "../missions/missionTypes";
import type { ActionProposal } from "../agents/types";
import type { AutomationProposal } from "../automation/types";

export type ConversationIntent =
  | "project_specific"
  | "revenue"
  | "focus"
  | "daily_review"
  | "alternative"
  | "creative"
  | "maintenance"
  | "unclear"
  | "general";

export interface NotNowItem {
  projectName: string;
  reason: string;
}

export interface AlternativeSuggestion {
  projectName: string;
  missionTitle: string;
}

export interface ClarificationChoice {
  label: string;
  prompt: string;
}

export interface GigiConversationResponse {
  intent: ConversationIntent;
  intentLabel: string;
  listen: string;

  needsClarification: boolean;
  clarificationQuestion?: string;
  choices?: ClarificationChoice[];

  priorityProjectName?: string;
  mission?: Mission;
  missionTitle?: string;
  why?: string;
  tasks?: string[];
  warning?: string;
  alternative?: AlternativeSuggestion;
  notNow?: NotNowItem[];
  /** Risque principal — affiché via warning si présent */
  primaryRisk?: string;
  /** Prochaine étape après exécution */
  nextStep?: string;
  finalMessage?: string;
  /** V0.6 — action proposals (dry-run only) */
  actionProposals?: ActionProposal[];
  /** V0.6 — message when real execution is blocked */
  agentBlockedMessage?: string;
  /** V0.7 — automation proposals (dry-run only) */
  automationProposals?: AutomationProposal[];
  /** V0.7 — message when real automation is blocked */
  automationBlockedMessage?: string;
  /** V0.6.1 — read-only daily review snapshot */
  dailyReview?: import("../dailyReview/types").DailyReviewSnapshot;
}

export interface ConversationContext {
  currentMissionId?: string;
  currentProjectId?: string;
  excludeMissionId?: string;
  excludeProjectId?: string;
  completedMissionIds?: string[];
  postponedMissionIds?: string[];
  rejectedMissionIds?: string[];
  executionHints?: import("../missionExecution/types").MissionExecutionHints | null;
  historyEvents?: import("../history/historyTypes").HistoryEvent[];
  projects?: import("../projects/projectTypes").Project[];
  currentMission?: import("../missions/missionTypes").Mission;
}

export interface ConversationExchange {
  id: string;
  objective: string;
  response: GigiConversationResponse;
  applied: boolean;
}
