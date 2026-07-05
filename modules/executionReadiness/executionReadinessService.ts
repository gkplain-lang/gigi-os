import type { PreparedActionType } from "@/modules/preparedActions/types";
import type {
  ExecutionCapability,
  ExecutionReadinessAuditEntry,
  ExecutionReadinessDecisionType,
  ExecutionReadinessRequest,
  ExecutionScope,
} from "./types";
import {
  defaultModeForCapability,
  policySafetyNotes,
  resolveInitialPermissionStatus,
  statusAfterDecision,
} from "./executionReadinessPolicy";
import { assessRiskLevel, riskRationale } from "./executionReadinessRisk";
import {
  appendExecutionReadinessDecision,
  getExecutionReadinessRequestById,
  getRequestsByActionId,
  upsertExecutionReadinessRequest,
} from "./executionReadinessStore";
import { applyDryRunApprovalTimestamps } from "./permissionCenterExpiration";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function audit(
  type: ExecutionReadinessAuditEntry["type"],
  message: string,
  decision?: ExecutionReadinessDecisionType
): ExecutionReadinessAuditEntry {
  return { id: newId("audit"), at: nowIso(), type, message, decision };
}

const CAPABILITY_BY_PREPARED_TYPE: Record<PreparedActionType, ExecutionCapability[]> = {
  cursor_prompt: ["documentation_only", "local_only", "file_read"],
  checklist: ["documentation_only", "local_only"],
  file_draft: ["documentation_only", "local_only", "file_write"],
  branch_plan: ["documentation_only", "git_operation"],
  pr_plan: ["documentation_only", "github_operation", "git_operation"],
  content_plan: ["documentation_only", "local_only"],
  research_plan: ["documentation_only", "local_only", "browser_action"],
  collaborator_brief: ["documentation_only", "email_draft"],
  manual_task: ["documentation_only", "local_only"],
};

export function inferCapabilitiesFromPreparedType(
  type: PreparedActionType
): ExecutionCapability[] {
  return CAPABILITY_BY_PREPARED_TYPE[type] ?? ["documentation_only", "local_only"];
}

function buildScopeForCapability(capability: ExecutionCapability): ExecutionScope {
  const baseForbidden = [
    "secrets",
    "tokens",
    ".env",
    "credentials",
    "production",
    "suppression de données",
  ];
  const allowedByCap: Record<ExecutionCapability, string[]> = {
    documentation_only: ["notes locales", "checklist Gigi", "copie manuelle"],
    local_only: ["localStorage Gigi", "état UI", "brouillon local"],
    file_read: ["fichiers listés dans le plan", "README", "docs/"],
    file_write: ["aucun en V4.0 — simulation uniquement"],
    shell_command: ["aucun en V4.0 — simulation uniquement"],
    git_operation: ["aucun en V4.0 — simulation uniquement"],
    github_operation: ["aucun en V4.0 — simulation uniquement"],
    n8n_workflow: ["aucun en V4.0 — simulation uniquement"],
    browser_action: ["aucun en V4.0 — simulation uniquement"],
    email_draft: ["brouillon texte local uniquement"],
    calendar_draft: ["brouillon texte local uniquement"],
    external_api: ["aucun en V4.0 — simulation uniquement"],
  };

  return {
    id: newId("scope"),
    label: capability,
    description: `Périmètre préparatoire pour ${capability} — dry-run V4.0`,
    capability,
    allowedTargets: allowedByCap[capability],
    forbiddenTargets: baseForbidden,
    requiresRollbackPlan: !["documentation_only", "local_only"].includes(capability),
    requiresHumanConfirmation: capability !== "documentation_only",
  };
}

export interface CreateReadinessFromActionInput {
  actionId: string;
  actionTitle: string;
  actionSummary: string;
  preparedType: PreparedActionType;
  projectId?: string;
  missionId?: string;
  lifecycleId?: string;
}

export function createReadinessRequestFromAction(
  input: CreateReadinessFromActionInput
): ExecutionReadinessRequest {
  const existing = getRequestsByActionId(input.actionId).find(
    (r) => r.permissionStatus !== "archived" && r.permissionStatus !== "rejected"
  );
  if (existing) return existing;

  const capabilities = inferCapabilitiesFromPreparedType(input.preparedType);
  const riskLevel = assessRiskLevel(capabilities);
  const timestamp = nowIso();
  const scopes = capabilities.map(buildScopeForCapability);
  const riskNotes = riskRationale(capabilities, riskLevel);

  const request: ExecutionReadinessRequest = {
    id: newId("readiness"),
    sourceActionId: input.actionId,
    sourceLifecycleId: input.lifecycleId,
    sourceMissionId: input.missionId,
    title: `Readiness · ${input.actionTitle}`,
    summary: input.actionSummary,
    requestedCapabilities: capabilities,
    mode: capabilities.some((c) => defaultModeForCapability(c) === "approval_required")
      ? "approval_required"
      : "dry_run",
    riskLevel,
    permissionStatus: resolveInitialPermissionStatus(capabilities, riskLevel),
    scopes,
    expectedChanges: [
      "Décrire ce qui changerait si l'exécution était autorisée plus tard",
      "Lister les fichiers ou ressources concernés (simulation)",
    ],
    forbiddenChanges: [
      "Écriture fichier réelle",
      "Commande shell réelle",
      "Appel GitHub / n8n / API externe",
      "Modification .env ou secrets",
    ],
    requiredChecks: [
      "Comprendre le périmètre autorisé vs interdit",
      "Valider le plan de rollback",
      "Confirmer que V4.0 ne lance rien",
    ],
    rollbackPlan: [
      "Annuler la demande localement (Refuser ou Archiver)",
      "Revenir à l'exécution manuelle hors Gigi",
      "Documenter le résultat dans le rapport d'exécution",
    ],
    evidenceRequired: [
      "Capture ou note du résultat manuel",
      "Confirmation explicite avant toute future exécution réelle (V4.1+)",
    ],
    safetyNotes: [...policySafetyNotes(), ...riskNotes],
    auditTrail: [
      audit("created", `Demande préparée depuis l'action « ${input.actionTitle} »`),
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return upsertExecutionReadinessRequest(request);
}

export function applyExecutionReadinessDecision(
  requestId: string,
  decision: ExecutionReadinessDecisionType,
  reason: string
): ExecutionReadinessRequest | undefined {
  const request = getExecutionReadinessRequestById(requestId);
  if (!request) return undefined;

  const timestamp = nowIso();
  const nextStatus = statusAfterDecision(decision);

  appendExecutionReadinessDecision({
    requestId,
    decision,
    reason,
    decidedAt: timestamp,
  });

  const updatedBase: ExecutionReadinessRequest = {
    ...request,
    permissionStatus: nextStatus,
    mode: decision === "approve_dry_run" ? "dry_run" : request.mode,
    updatedAt: timestamp,
    auditTrail: [
      audit("decision", reason, decision),
      ...request.auditTrail,
    ],
  };

  const updated =
    decision === "approve_dry_run"
      ? applyDryRunApprovalTimestamps(updatedBase, timestamp)
      : decision === "revoke"
        ? { ...updatedBase, revokedAt: timestamp }
        : updatedBase;

  return upsertExecutionReadinessRequest(updated);
}

export function createDraftReadinessRequest(title: string, summary: string): ExecutionReadinessRequest {
  const capabilities: ExecutionCapability[] = ["documentation_only", "local_only"];
  const riskLevel = assessRiskLevel(capabilities);
  const timestamp = nowIso();

  const request: ExecutionReadinessRequest = {
    id: newId("readiness"),
    title,
    summary,
    requestedCapabilities: capabilities,
    mode: "dry_run",
    riskLevel,
    permissionStatus: "draft",
    scopes: capabilities.map(buildScopeForCapability),
    expectedChanges: ["À préciser par l'utilisateur"],
    forbiddenChanges: ["Exécution réelle", "Appels externes", "Secrets"],
    requiredChecks: ["Lire la policy V4", "Confirmer le périmètre"],
    rollbackPlan: ["Archiver la demande", "Continuer en manuel"],
    evidenceRequired: ["Note locale du résultat"],
    safetyNotes: policySafetyNotes(),
    auditTrail: [audit("created", "Demande brouillon créée manuellement")],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return upsertExecutionReadinessRequest(request);
}
