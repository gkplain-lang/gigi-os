export type HistoryLearningEntryStatus =
  | "archived"
  | "completed"
  | "abandoned"
  | "blocked"
  | "needs_follow_up"
  | "unclear";

export type HistoryLearningEntrySource =
  | "action_queue"
  | "execution_plan"
  | "execution_log"
  | "execution_review"
  | "follow_up_action"
  | "manual";

export type HistoryLearningOutcome =
  | "success"
  | "partial_success"
  | "failed"
  | "abandoned"
  | "blocked"
  | "unclear";

export type HistoryLearningSignalType =
  | "completed_action"
  | "failed_test"
  | "blocker"
  | "fix_created"
  | "retry_needed"
  | "follow_up_created"
  | "manual_commit"
  | "missing_report"
  | "decision_confirmed"
  | "recurring_pattern"
  | "learning_note";

export type HistoryLearningSeverity = "info" | "success" | "warning" | "critical";

export interface HistoryLearningSignal {
  id: string;
  type: HistoryLearningSignalType;
  label: string;
  description: string;
  severity: HistoryLearningSeverity;
  relatedId?: string;
  createdAt: string;
}

export interface HistoryLearningNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface RecommendedFutureBehavior {
  id: string;
  label: string;
  description: string;
  appliesTo: string;
  confidence: number;
}

export interface HistoryLearningEntry {
  id: string;
  title: string;
  summary: string;
  status: HistoryLearningEntryStatus;
  outcome: HistoryLearningOutcome;
  source: HistoryLearningEntrySource;
  sourceActionId?: string;
  sourceExecutionPlanId?: string;
  sourceExecutionLogId?: string;
  sourceExecutionReviewId?: string;
  sourceFollowUpActionIds?: string[];
  projectId?: string;
  missionId?: string;
  signals: HistoryLearningSignal[];
  learnings: HistoryLearningNote[];
  recommendedFutureBehavior: RecommendedFutureBehavior[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  metadata?: {
    projectName?: string;
    reviewDecision?: string;
  };
}

export interface HistoryLearningState {
  entries: HistoryLearningEntry[];
  lastUpdatedAt?: string;
}

export interface HistoryLearningGlobalSummary {
  totalEntries: number;
  completedCount: number;
  blockedCount: number;
  recurringPatterns: string[];
  topLearnings: string[];
  summaryText: string;
}

export interface HistoryLearningIntent {
  isHistoryLearning: boolean;
  projectId: string | null;
}

export const HISTORY_LEARNING_STORAGE_KEY = "gigi-os-v24-history-learning-loop";

export const HISTORY_LEARNING_DISCLAIMER =
  "Historique et apprentissages locaux uniquement — basés sur tes déclarations manuelles, sans vérification du repo ni sync cloud.";

export const HISTORY_STATUS_LABELS: Record<HistoryLearningEntryStatus, string> = {
  archived: "Archivé",
  completed: "Terminé",
  abandoned: "Abandonné",
  blocked: "Bloqué",
  needs_follow_up: "Suite nécessaire",
  unclear: "Incertain",
};

export const HISTORY_OUTCOME_LABELS: Record<HistoryLearningOutcome, string> = {
  success: "Succès",
  partial_success: "Succès partiel",
  failed: "Échec",
  abandoned: "Abandonné",
  blocked: "Bloqué",
  unclear: "Incertain",
};
