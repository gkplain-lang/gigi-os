export type ExecutionCapability =
  | "file_write"
  | "file_read"
  | "shell_command"
  | "git_operation"
  | "github_operation"
  | "n8n_workflow"
  | "browser_action"
  | "email_draft"
  | "calendar_draft"
  | "external_api"
  | "local_only"
  | "documentation_only";

export type ExecutionMode =
  | "dry_run"
  | "manual_handoff"
  | "approval_required"
  | "simulated"
  | "disabled";

export type ExecutionRiskLevel = "low" | "medium" | "high" | "critical" | "blocked";

export type ExecutionPermissionStatus =
  | "draft"
  | "needs_review"
  | "awaiting_user_approval"
  | "approved_for_dry_run"
  | "rejected"
  | "expired"
  | "simulated_only"
  | "blocked"
  | "archived";

export type ExecutionReadinessDecisionType =
  | "approve_dry_run"
  | "reject"
  | "request_more_context"
  | "mark_simulated_only"
  | "archive";

export interface ExecutionScope {
  id: string;
  label: string;
  description: string;
  capability: ExecutionCapability;
  allowedTargets: string[];
  forbiddenTargets: string[];
  requiresRollbackPlan: boolean;
  requiresHumanConfirmation: boolean;
  maxDurationMinutes?: number;
  expiresAt?: string;
}

export interface ExecutionReadinessAuditEntry {
  id: string;
  at: string;
  type: "created" | "decision" | "note" | "status_change";
  message: string;
  decision?: ExecutionReadinessDecisionType;
}

export interface ExecutionReadinessRequest {
  id: string;
  sourceActionId?: string;
  sourceLifecycleId?: string;
  sourceMissionId?: string;
  title: string;
  summary: string;
  requestedCapabilities: ExecutionCapability[];
  mode: ExecutionMode;
  riskLevel: ExecutionRiskLevel;
  permissionStatus: ExecutionPermissionStatus;
  scopes: ExecutionScope[];
  expectedChanges: string[];
  forbiddenChanges: string[];
  requiredChecks: string[];
  rollbackPlan: string[];
  evidenceRequired: string[];
  safetyNotes: string[];
  auditTrail: ExecutionReadinessAuditEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionReadinessDecision {
  requestId: string;
  decision: ExecutionReadinessDecisionType;
  reason: string;
  decidedAt: string;
}

export interface ExecutionReadinessState {
  requests: ExecutionReadinessRequest[];
  decisions: ExecutionReadinessDecision[];
  lastUpdatedAt?: string;
  version: number;
}

export interface ExecutionReadinessGlobalSummary {
  totalRequests: number;
  activeRequests: number;
  awaitingApproval: number;
  approvedDryRun: number;
  blockedCount: number;
  summaryText: string;
}

export interface ExecutionReadinessIntent {
  isExecutionReadiness: boolean;
  projectId: string | null;
}

export const EXECUTION_READINESS_STORAGE_KEY = "gigi-os-v40-execution-readiness";
export const EXECUTION_READINESS_VERSION = 1;

export const EXECUTION_READINESS_DISCLAIMER =
  "V4.0 — Gigi ne lance rien. Cette étape prépare seulement les permissions futures : dry-run, périmètre, risques et rollback. Aucune exécution réelle.";

export const EXECUTION_READINESS_V4_TAGLINE =
  "Gigi ne fait pas encore tout. Mais il devient capable de demander le droit d'agir.";
