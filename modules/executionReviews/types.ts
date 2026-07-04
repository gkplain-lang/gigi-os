import type { ExecutionLogStatus } from "@/modules/executionLogs/types";

export type ExecutionReviewDecision =
  | "completed_confirmed"
  | "needs_fix"
  | "needs_retry"
  | "needs_new_action"
  | "abandoned_confirmed"
  | "unclear";

export type ExecutionReviewFindingType =
  | "completion_signal"
  | "failed_test"
  | "blocker"
  | "fix_required"
  | "manual_commit"
  | "missing_report"
  | "unclear_status"
  | "abandonment_signal"
  | "note";

export type ExecutionReviewFindingSeverity = "info" | "warning" | "critical" | "success";

export type ExecutionReviewRecommendedActionType =
  | "validate_done"
  | "create_fix_action"
  | "retry_execution"
  | "create_followup_action"
  | "abandon_action"
  | "add_missing_report"
  | "review_manually";

export interface ExecutionReviewFinding {
  id: string;
  type: ExecutionReviewFindingType;
  severity: ExecutionReviewFindingSeverity;
  title: string;
  description: string;
  relatedEntryId?: string;
}

export interface ExecutionReviewRecommendedAction {
  id: string;
  type: ExecutionReviewRecommendedActionType;
  label: string;
  description: string;
  nextStepHint?: string;
}

export interface ExecutionReviewValidationItem {
  id: string;
  label: string;
  required: boolean;
}

export interface ExecutionReview {
  id: string;
  executionLogId: string;
  executionPlanId?: string;
  actionId?: string;
  decision: ExecutionReviewDecision;
  confidence: number;
  summary: string;
  findings: ExecutionReviewFinding[];
  validationChecklist: ExecutionReviewValidationItem[];
  recommendedNextActions: ExecutionReviewRecommendedAction[];
  createdAt: string;
  updatedAt: string;
  sourceLogStatus: ExecutionLogStatus;
  sourceLogEntryCount: number;
  metadata?: {
    projectId?: string;
    projectName?: string;
  };
}

export interface ExecutionReviewsState {
  reviews: ExecutionReview[];
  lastUpdatedAt?: string;
}

export interface ExecutionReviewIntent {
  isExecutionReview: boolean;
  projectId: string | null;
}

export const EXECUTION_REVIEWS_STORAGE_KEY = "gigi-os-v22-execution-reviews";

export const EXECUTION_REVIEW_DECISION_LABELS: Record<ExecutionReviewDecision, string> = {
  completed_confirmed: "Terminé confirmé (déclaration manuelle)",
  needs_fix: "Correction nécessaire",
  needs_retry: "Relancer l'exécution",
  needs_new_action: "Nouvelle action recommandée",
  abandoned_confirmed: "Abandon confirmé",
  unclear: "Statut incertain",
};

export const EXECUTION_REVIEW_DISCLAIMER =
  "Gigi analyse uniquement les déclarations manuelles du journal V2.1 — aucune vérification réelle du repo, du build ou de Git.";
