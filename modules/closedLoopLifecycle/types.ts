export type ClosedLoopLifecycleStatus =
  | "draft"
  | "active"
  | "waiting_for_user"
  | "waiting_for_execution"
  | "waiting_for_report"
  | "needs_review"
  | "needs_follow_up"
  | "learning_ready"
  | "closed"
  | "archived"
  | "blocked"
  | "unclear";

export type ClosedLoopLifecycleStage =
  | "mission_decided"
  | "plan_created"
  | "action_prepared"
  | "action_queued"
  | "action_approved"
  | "execution_plan_created"
  | "workspace_created"
  | "handoff_created"
  | "report_intake_created"
  | "log_updated"
  | "review_created"
  | "follow_up_created"
  | "history_archived"
  | "mission_feedback_updated"
  | "cycle_closed";

export type ClosedLoopLifecycleHealth = "healthy" | "incomplete" | "risky" | "blocked" | "unclear";

export type ClosedLoopLifecycleSource =
  | "action_queue"
  | "mission_decision"
  | "mission_plan_bridge"
  | "safe_action_workspace"
  | "manual_execution_handoff"
  | "execution_report_intake"
  | "manual";

export type ClosedLoopLifecycleNextStepType =
  | "choose_mission"
  | "create_plan"
  | "prepare_action"
  | "add_to_queue"
  | "approve_action"
  | "create_execution_plan"
  | "create_workspace"
  | "create_handoff"
  | "paste_report"
  | "apply_report_to_log"
  | "generate_review"
  | "create_follow_up"
  | "archive_learning"
  | "update_mission_feedback"
  | "close_cycle"
  | "clarify_status"
  | "resolve_blocker";

export type ClosedLoopLifecycleStageStatus =
  | "completed"
  | "missing"
  | "available"
  | "blocked"
  | "optional"
  | "unclear";

export type ClosedLoopLifecycleSeverity = "info" | "warning" | "critical" | "success";

export interface ClosedLoopLifecycleStageItem {
  id: string;
  stage: ClosedLoopLifecycleStage;
  status: ClosedLoopLifecycleStageStatus;
  label: string;
  description: string;
  relatedId?: string;
  completedAt?: string;
  required: boolean;
  order: number;
}

export interface ClosedLoopLifecycleNextStep {
  id: string;
  type: ClosedLoopLifecycleNextStepType;
  label: string;
  description: string;
  reason: string;
  priority: number;
  targetRoute?: string;
  targetActionLabel?: string;
  relatedId?: string;
  manualOnly: boolean;
  createdAt: string;
}

export interface ClosedLoopLifecycleRisk {
  id: string;
  label: string;
  description: string;
  severity: ClosedLoopLifecycleSeverity;
  mitigation?: string;
  relatedId?: string;
}

export interface ClosedLoopLifecycleLearning {
  id: string;
  label: string;
  description: string;
  source: string;
  confidence: number;
  relatedId?: string;
}

export interface ClosedLoopLifecycle {
  id: string;
  title: string;
  status: ClosedLoopLifecycleStatus;
  health: ClosedLoopLifecycleHealth;
  source: ClosedLoopLifecycleSource;
  projectId?: string;
  missionId?: string;
  actionId?: string;
  missionDecisionId?: string;
  missionPlanBridgeId?: string;
  executionPlanId?: string;
  workspaceId?: string;
  handoffId?: string;
  reportIntakeId?: string;
  executionLogId?: string;
  executionReviewId?: string;
  followUpActionIds?: string[];
  historyEntryIds?: string[];
  missionFeedbackSignalIds?: string[];
  completedStages: ClosedLoopLifecycleStage[];
  missingStages: ClosedLoopLifecycleStage[];
  stageItems: ClosedLoopLifecycleStageItem[];
  currentStage?: ClosedLoopLifecycleStage;
  nextSteps: ClosedLoopLifecycleNextStep[];
  summary: string;
  risks: ClosedLoopLifecycleRisk[];
  learnings: ClosedLoopLifecycleLearning[];
  userNotes: string[];
  userClosed: boolean;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  archivedAt?: string;
  metadata?: Record<string, string>;
}

export interface ClosedLoopLifecycleState {
  lifecycles: ClosedLoopLifecycle[];
  lastUpdatedAt?: string;
  version: string;
}

export interface ClosedLoopLifecycleGlobalSummary {
  totalLifecycles: number;
  activeCount: number;
  closedCount: number;
  blockedCount: number;
  summaryText: string;
}

export interface ClosedLoopLifecycleIntent {
  isClosedLoopLifecycle: boolean;
  projectId: string | null;
}

export const CLOSED_LOOP_LIFECYCLE_STORAGE_KEY = "gigi-os-v211-closed-loop-action-lifecycle";
export const CLOSED_LOOP_LIFECYCLE_VERSION = "2.11";
export const CLOSED_LOOP_LIFECYCLE_ID_PREFIX = "cllifecycle-";

export const CLOSED_LOOP_LIFECYCLE_DISCLAIMER =
  "Gigi agrège des données locales déclarées. Aucune vérification Git, GitHub, fichier ou build. Chaque étape reste manuelle.";

export const CLOSED_LOOP_LIFECYCLE_STATUS_LABELS: Record<ClosedLoopLifecycleStatus, string> = {
  draft: "Brouillon",
  active: "En cours",
  waiting_for_user: "Attente utilisateur",
  waiting_for_execution: "Attente exécution",
  waiting_for_report: "Attente rapport",
  needs_review: "Review nécessaire",
  needs_follow_up: "Follow-up nécessaire",
  learning_ready: "Apprentissage prêt",
  closed: "Fermé",
  archived: "Archivé",
  blocked: "Bloqué",
  unclear: "Peu clair",
};

export const CLOSED_LOOP_LIFECYCLE_HEALTH_LABELS: Record<ClosedLoopLifecycleHealth, string> = {
  healthy: "Sain",
  incomplete: "Incomplet",
  risky: "Risqué",
  blocked: "Bloqué",
  unclear: "Peu clair",
};

export const CLOSED_LOOP_LIFECYCLE_STAGE_LABELS: Record<ClosedLoopLifecycleStage, string> = {
  mission_decided: "Mission décidée",
  plan_created: "Plan créé",
  action_prepared: "Action préparée",
  action_queued: "Action en file",
  action_approved: "Action validée",
  execution_plan_created: "Plan d'exécution créé",
  workspace_created: "Workspace créé",
  handoff_created: "Handoff créé",
  report_intake_created: "Rapport collé",
  log_updated: "Log mis à jour",
  review_created: "Review créée",
  follow_up_created: "Follow-up créé",
  history_archived: "Historique archivé",
  mission_feedback_updated: "Feedback mission",
  cycle_closed: "Cycle fermé",
};

export const STAGE_ORDER: ClosedLoopLifecycleStage[] = [
  "mission_decided",
  "plan_created",
  "action_prepared",
  "action_queued",
  "action_approved",
  "execution_plan_created",
  "workspace_created",
  "handoff_created",
  "report_intake_created",
  "log_updated",
  "review_created",
  "follow_up_created",
  "history_archived",
  "mission_feedback_updated",
  "cycle_closed",
];

export const ESSENTIAL_STAGES: ClosedLoopLifecycleStage[] = [
  "action_queued",
  "action_approved",
  "execution_plan_created",
  "workspace_created",
  "handoff_created",
  "report_intake_created",
  "log_updated",
  "review_created",
];
