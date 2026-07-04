export type ExecutionLogStatus =
  | "not_started"
  | "started"
  | "blocked"
  | "needs_fix"
  | "completed_manually"
  | "abandoned";

export type ExecutionLogEntryType =
  | "started"
  | "step_completed"
  | "test_passed"
  | "test_failed"
  | "blocked"
  | "note"
  | "fix_needed"
  | "manual_commit"
  | "completed_manually"
  | "abandoned";

export interface ExecutionLogEntry {
  id: string;
  type: ExecutionLogEntryType;
  title: string;
  description?: string;
  relatedStepId?: string;
  relatedTestId?: string;
  createdAt: string;
}

export interface ExecutionLog {
  id: string;
  executionPlanId: string;
  queuedActionId: string;
  projectId: string;
  projectName: string;
  status: ExecutionLogStatus;
  entries: ExecutionLogEntry[];
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
  finalReport?: string;
}

export interface ExecutionLogsState {
  logs: ExecutionLog[];
  lastUpdatedAt?: string;
}

export interface ExecutionLogSummary {
  status: ExecutionLogStatus;
  statusLabel: string;
  lastEntryTitle?: string;
  testsPassed: number;
  testsFailed: number;
  blockers: string[];
  recommendedNextStep: string;
  summaryText: string;
}

export interface ExecutionLogIntent {
  isExecutionLog: boolean;
  projectId: string | null;
}

export const EXECUTION_LOGS_STORAGE_KEY = "gigi-os-v21-execution-logs";

export const EXECUTION_LOG_STATUS_LABELS: Record<ExecutionLogStatus, string> = {
  not_started: "Pas commencé",
  started: "En cours",
  blocked: "Bloqué",
  needs_fix: "Correction nécessaire",
  completed_manually: "Terminé manuellement",
  abandoned: "Abandonné",
};

export const EXECUTION_LOG_ENTRY_LABELS: Record<ExecutionLogEntryType, string> = {
  started: "Démarré",
  step_completed: "Étape faite",
  test_passed: "Test OK",
  test_failed: "Test échoué",
  blocked: "Blocage",
  note: "Note",
  fix_needed: "Correction nécessaire",
  manual_commit: "Commit manuel",
  completed_manually: "Terminé manuellement",
  abandoned: "Abandonné",
};
