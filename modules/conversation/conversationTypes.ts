import type { Mission } from "../missions/missionTypes";
import type { ActionProposal } from "../agents/types";
import type { AutomationProposal } from "../automation/types";
import type { IntegrationProposal } from "../integrations/types";

export type ConversationIntent =
  | "project_specific"
  | "revenue"
  | "focus"
  | "daily_review"
  | "alternative"
  | "creative"
  | "maintenance"
  | "unclear"
  | "general"
  | "action_plan"
  | "prepared_action"
  | "execution_plan"
  | "execution_log"
  | "execution_review"
  | "follow_up_action"
  | "history_learning"
  | "mission_feedback";

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
  /** V0.8 — integration proposals (dry-run only) */
  integrationProposals?: IntegrationProposal[];
  /** V0.8 — message when real integration is blocked */
  integrationBlockedMessage?: string;
  /** V0.6.1 — read-only daily review snapshot */
  dailyReview?: import("../dailyReview/types").DailyReviewSnapshot;
  /** V1.7 — structured action plan (dry-run only) */
  actionPlan?: import("../actionPlans/types").ActionPlan;
  /** V1.7 — reminder when plan is preparation-only */
  actionPlanBlockedMessage?: string;
  /** V1.8 — prepared action artifact (dry-run only) */
  preparedAction?: import("../preparedActions/types").PreparedAction;
  /** V1.8 — reminder when prepared action is copy-only */
  preparedActionBlockedMessage?: string;
  /** V2.0 — secure execution plan from approved action (dry-run only) */
  executionPlan?: import("../executionPlans/types").ExecutionPlan;
  /** V2.0 — reminder when execution is manual-only */
  executionPlanBlockedMessage?: string;
  /** V2.1 — guidance for manual execution logging */
  executionLogGuidance?: string[];
  /** V2.1 — reminder that Gigi does not auto-verify */
  executionLogBlockedMessage?: string;
  /** V2.2 — guidance for execution report review */
  executionReviewGuidance?: string[];
  /** V2.2 — review summary when log available client-side */
  executionReviewSummaryText?: string;
  /** V2.2 — recommended decision label */
  executionReviewDecisionLabel?: string;
  /** V2.2 — disclaimer for manual-only review */
  executionReviewBlockedMessage?: string;
  /** V2.3 — guidance for follow-up action generation */
  followUpGuidance?: string[];
  /** V2.3 — disclaimer for local proposals */
  followUpBlockedMessage?: string;
  /** V2.4 — guidance for history & learning loop */
  historyLearningGuidance?: string[];
  /** V2.4 — global summary snippet when entries exist */
  historyLearningSummaryText?: string;
  /** V2.4 — disclaimer for local-only archive */
  historyLearningBlockedMessage?: string;
  /** V2.5 — guidance for mission recommendation feedback */
  missionFeedbackGuidance?: string[];
  /** V2.5 — summary when feedback exists */
  missionFeedbackSummaryText?: string;
  /** V2.5 — top mission recommendation label */
  missionFeedbackTopMissionTitle?: string;
  /** V2.5 — score snippet */
  missionFeedbackScoreLabel?: string;
  /** V2.5 — disclaimer */
  missionFeedbackBlockedMessage?: string;
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
