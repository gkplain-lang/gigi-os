import type { Mission } from "../missions/missionTypes";
import type { ActionProposal } from "../agents/types";

export type ConversationIntent =
  | "project_specific"
  | "revenue"
  | "focus"
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
}

export interface ConversationContext {
  currentMissionId?: string;
  currentProjectId?: string;
  excludeMissionId?: string;
  excludeProjectId?: string;
  completedMissionIds?: string[];
}

export interface ConversationExchange {
  id: string;
  objective: string;
  response: GigiConversationResponse;
  applied: boolean;
}
