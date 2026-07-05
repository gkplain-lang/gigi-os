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
  | "mission_feedback"
  | "mission_decision"
  | "mission_plan_bridge"
  | "safe_action_workspace"
  | "manual_execution_handoff"
  | "execution_report_intake"
  | "closed_loop_lifecycle"
  | "mission_os"
  | "projects_command";

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
  /** V2.6 — guidance for mission decision center */
  missionDecisionGuidance?: string[];
  /** V2.6 — decision summary */
  missionDecisionSummaryText?: string;
  /** V2.6 — recommended mission title */
  missionDecisionTopTitle?: string;
  /** V2.6 — status label */
  missionDecisionStatusLabel?: string;
  /** V2.6 — candidate comparison */
  missionDecisionComparisonText?: string;
  /** V2.6 — disclaimer */
  missionDecisionBlockedMessage?: string;
  /** V2.7 — guidance for mission-to-plan bridge */
  missionPlanBridgeGuidance?: string[];
  /** V2.7 — bridge summary */
  missionPlanBridgeSummaryText?: string;
  /** V2.7 — accepted mission title for bridge */
  missionPlanBridgeMissionTitle?: string;
  /** V2.7 — disclaimer */
  missionPlanBridgeBlockedMessage?: string;
  /** V2.8 — guidance for safe action workspace */
  safeActionWorkspaceGuidance?: string[];
  /** V2.8 — workspace summary */
  safeActionWorkspaceSummaryText?: string;
  /** V2.8 — action title in workspace */
  safeActionWorkspaceActionTitle?: string;
  /** V2.8 — readiness label */
  safeActionWorkspaceReadinessLabel?: string;
  /** V2.8 — disclaimer */
  safeActionWorkspaceBlockedMessage?: string;
  /** V2.9 — guidance for manual execution handoff */
  manualExecutionHandoffGuidance?: string[];
  /** V2.9 — handoff summary */
  manualExecutionHandoffSummaryText?: string;
  /** V2.9 — action title */
  manualExecutionHandoffActionTitle?: string;
  /** V2.9 — target label */
  manualExecutionHandoffTargetLabel?: string;
  /** V2.9 — disclaimer */
  manualExecutionHandoffBlockedMessage?: string;
  /** V2.10 — guidance for execution report intake */
  executionReportIntakeGuidance?: string[];
  /** V2.10 — intake summary */
  executionReportIntakeSummaryText?: string;
  /** V2.10 — action title */
  executionReportIntakeActionTitle?: string;
  /** V2.10 — decision label */
  executionReportIntakeDecisionLabel?: string;
  /** V2.10 — disclaimer */
  executionReportIntakeBlockedMessage?: string;
  /** V2.11 — guidance for closed loop lifecycle */
  closedLoopLifecycleGuidance?: string[];
  /** V2.11 — lifecycle summary */
  closedLoopLifecycleSummaryText?: string;
  /** V2.11 — action title */
  closedLoopLifecycleActionTitle?: string;
  /** V2.11 — health label */
  closedLoopLifecycleHealthLabel?: string;
  /** V2.11 — status label */
  closedLoopLifecycleStatusLabel?: string;
  /** V2.11 — disclaimer */
  closedLoopLifecycleBlockedMessage?: string;
  /** V3.0 — guidance for Closed Loop Mission OS */
  missionOSGuidance?: string[];
  /** V3.0 — full pilotage summary (copyable) */
  missionOSSummaryText?: string;
  /** V3.0 — current UX phase label */
  missionOSPhaseLabel?: string;
  /** V3.0 — current step label */
  missionOSStepLabel?: string;
  /** V3.0 — next action CTA label */
  missionOSNextActionLabel?: string;
  /** V3.0 — suggested route */
  missionOSNextActionRoute?: string;
  /** V3.0 — readiness label */
  missionOSReadinessLabel?: string;
  /** V3.0 — safety disclaimer */
  missionOSBlockedMessage?: string;
  /** V3.6 — projects command guidance */
  projectsCommandGuidance?: string[];
  /** V3.6 — summary text */
  projectsCommandSummaryText?: string;
  /** V3.6 — recommended project name */
  projectsCommandRecommendedName?: string;
  /** V3.6 — recommended reason */
  projectsCommandRecommendedReason?: string;
  /** V3.6 — next mission title */
  projectsCommandNextMissionTitle?: string;
  /** V3.6 — active action title */
  projectsCommandActiveActionTitle?: string;
  /** V3.6 — primary route */
  projectsCommandPrimaryRoute?: string;
  /** V3.6 — disclaimer */
  projectsCommandBlockedMessage?: string;
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
