import type { ExecutionLogEntryType } from "@/modules/executionLogs/types";

export type ExecutionReportIntakeStatus =
  | "draft"
  | "parsed"
  | "needs_review"
  | "ready_to_apply"
  | "applied_to_log"
  | "review_generated"
  | "archived"
  | "cancelled";

export type ExecutionReportIntakeSource =
  | "manual_execution_handoff"
  | "safe_action_workspace"
  | "action_queue"
  | "execution_plan"
  | "manual"
  | "unknown";

export type ExecutionReportIntakeReporter =
  | "cursor"
  | "human"
  | "self"
  | "generic"
  | "unknown";

export type ExecutionReportIntakeDecision =
  | "completed"
  | "partially_completed"
  | "blocked"
  | "needs_fix"
  | "tests_failed"
  | "tests_passed"
  | "unclear"
  | "abandoned";

export type ExecutionReportIntakeSectionType =
  | "raw_report"
  | "parsed_summary"
  | "files_modified"
  | "steps_completed"
  | "commands_run"
  | "tests_run"
  | "test_results"
  | "blockers"
  | "fixes_needed"
  | "manual_commit"
  | "final_report"
  | "next_steps"
  | "proposed_log_entries"
  | "proposed_review";

export type ExecutionReportIntakeWarningType =
  | "missing_tests"
  | "missing_files"
  | "missing_final_summary"
  | "contradictory_status"
  | "unclear_commit"
  | "unverified_claim"
  | "blocked_but_marked_done"
  | "tests_failed_but_completed"
  | "no_action_reference";

export type ExecutionReportIntakeSeverity = "info" | "warning" | "critical" | "success";

export interface ParsedExecutionReport {
  actionExecuted?: string;
  executionDate?: string;
  toolUsed?: string;
  filesModified: string[];
  stepsCompleted: string[];
  commandsRunManually: string[];
  testsRun: string[];
  testResults: string[];
  blockers: string[];
  fixesNeeded: string[];
  commitPerformed?: boolean;
  commitHash?: string;
  finalSummary?: string;
  nextStepRecommendation?: string;
  uncertainties: string[];
}

export interface ProposedLogEntry {
  id: string;
  type: ExecutionLogEntryType;
  message: string;
  confidence: number;
  sourceText?: string;
  createdAt: string;
}

export interface ExecutionReportIntakeWarning {
  id: string;
  type: ExecutionReportIntakeWarningType;
  label: string;
  description: string;
  severity: ExecutionReportIntakeSeverity;
}

export interface ExecutionReportIntakeSection {
  id: string;
  type: ExecutionReportIntakeSectionType;
  title: string;
  content: string;
  order: number;
}

export interface ExecutionReportIntake {
  id: string;
  title: string;
  status: ExecutionReportIntakeStatus;
  source: ExecutionReportIntakeSource;
  reporter: ExecutionReportIntakeReporter;
  decision: ExecutionReportIntakeDecision;
  rawReport: string;
  sourceHandoffId?: string;
  sourceWorkspaceId?: string;
  sourceActionId?: string;
  sourceExecutionPlanId?: string;
  sourceExecutionLogId?: string;
  sourceExecutionReviewId?: string;
  projectId?: string;
  missionId?: string;
  parsedReport: ParsedExecutionReport;
  proposedLogEntries: ProposedLogEntry[];
  proposedReviewSummary?: string;
  confidence: number;
  warnings: ExecutionReportIntakeWarning[];
  userNotes: string[];
  createdAt: string;
  updatedAt: string;
  appliedAt?: string;
  archivedAt?: string;
  metadata?: Record<string, string>;
}

export interface ExecutionReportIntakeState {
  intakes: ExecutionReportIntake[];
  lastUpdatedAt?: string;
  version: string;
}

export interface ExecutionReportIntakeGlobalSummary {
  totalIntakes: number;
  parsedCount: number;
  appliedCount: number;
  reviewGeneratedCount: number;
  summaryText: string;
}

export interface ExecutionReportIntakeIntent {
  isExecutionReportIntake: boolean;
  projectId: string | null;
}

export const EXECUTION_REPORT_INTAKE_STORAGE_KEY = "gigi-os-v210-execution-report-intake";
export const EXECUTION_REPORT_INTAKE_VERSION = "2.10";
export const EXECUTION_REPORT_INTAKE_ID_PREFIX = "exintake-";

export const EXECUTION_REPORT_INTAKE_DISCLAIMER =
  "Gigi analyse le texte collé localement. Aucune vérification Git, GitHub, fichiers ou build. Application au log uniquement sur clic utilisateur.";

export const EXECUTION_REPORT_INTAKE_STATUS_LABELS: Record<
  ExecutionReportIntakeStatus,
  string
> = {
  draft: "Brouillon",
  parsed: "Parsé",
  needs_review: "À relire",
  ready_to_apply: "Prêt à appliquer",
  applied_to_log: "Appliqué au log",
  review_generated: "Review générée",
  archived: "Archivé",
  cancelled: "Annulé",
};

export const EXECUTION_REPORT_INTAKE_SOURCE_LABELS: Record<
  ExecutionReportIntakeSource,
  string
> = {
  manual_execution_handoff: "Handoff V2.9",
  safe_action_workspace: "Workspace V2.8",
  action_queue: "File d'actions V1.9",
  execution_plan: "Plan V2.0",
  manual: "Manuel",
  unknown: "Inconnu",
};

export const EXECUTION_REPORT_INTAKE_REPORTER_LABELS: Record<
  ExecutionReportIntakeReporter,
  string
> = {
  cursor: "Cursor",
  human: "Humain",
  self: "Moi",
  generic: "Générique",
  unknown: "Inconnu",
};

export const EXECUTION_REPORT_INTAKE_DECISION_LABELS: Record<
  ExecutionReportIntakeDecision,
  string
> = {
  completed: "Terminé",
  partially_completed: "Partiellement terminé",
  blocked: "Bloqué",
  needs_fix: "Correction nécessaire",
  tests_failed: "Tests échoués",
  tests_passed: "Tests OK",
  unclear: "Peu clair",
  abandoned: "Abandonné",
};
