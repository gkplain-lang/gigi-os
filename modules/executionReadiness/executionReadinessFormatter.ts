import type {
  ExecutionCapability,
  ExecutionMode,
  ExecutionPermissionStatus,
  ExecutionReadinessDecisionType,
  ExecutionRiskLevel,
} from "./types";

export const EXECUTION_CAPABILITY_LABELS: Record<ExecutionCapability, string> = {
  file_write: "Écriture fichier",
  file_read: "Lecture fichier",
  shell_command: "Commande shell",
  git_operation: "Opération Git",
  github_operation: "GitHub",
  n8n_workflow: "Workflow n8n",
  browser_action: "Action navigateur",
  email_draft: "Brouillon email",
  calendar_draft: "Brouillon calendrier",
  external_api: "API externe",
  local_only: "Local uniquement",
  documentation_only: "Documentation",
};

export const EXECUTION_MODE_LABELS: Record<ExecutionMode, string> = {
  dry_run: "Dry-run",
  manual_handoff: "Passation manuelle",
  approval_required: "Approbation requise",
  simulated: "Simulation",
  disabled: "Désactivé",
};

export const EXECUTION_RISK_LABELS: Record<ExecutionRiskLevel, string> = {
  low: "Faible",
  medium: "Modéré",
  high: "Élevé",
  critical: "Critique",
  blocked: "Bloqué",
};

export const EXECUTION_PERMISSION_STATUS_LABELS: Record<ExecutionPermissionStatus, string> = {
  draft: "Brouillon",
  needs_review: "À revoir",
  awaiting_user_approval: "En attente de toi",
  approved_for_dry_run: "Dry-run approuvé",
  rejected: "Refusée",
  expired: "Expirée",
  simulated_only: "Simulation seule",
  blocked: "Bloquée",
  archived: "Archivée",
};

export const EXECUTION_DECISION_LABELS: Record<ExecutionReadinessDecisionType, string> = {
  approve_dry_run: "Approuver dry-run",
  reject: "Refuser",
  request_more_context: "Demander plus de contexte",
  mark_simulated_only: "Simulation seulement",
  archive: "Archiver",
};

export function formatCapabilitiesList(capabilities: ExecutionCapability[]): string {
  return capabilities.map((c) => EXECUTION_CAPABILITY_LABELS[c]).join(" · ");
}

export function formatExecutionReadinessForCopy(
  request: import("./types").ExecutionReadinessRequest
): string {
  const lines = [
    `# ${request.title}`,
    "",
    request.summary,
    "",
    `Risque : ${EXECUTION_RISK_LABELS[request.riskLevel]}`,
    `Statut : ${EXECUTION_PERMISSION_STATUS_LABELS[request.permissionStatus]}`,
    `Mode : ${EXECUTION_MODE_LABELS[request.mode]}`,
    "",
    "## Capacités demandées",
    ...request.requestedCapabilities.map((c) => `- ${EXECUTION_CAPABILITY_LABELS[c]}`),
    "",
    "## Changements attendus (simulation)",
    ...request.expectedChanges.map((c) => `- ${c}`),
    "",
    "## Interdit",
    ...request.forbiddenChanges.map((c) => `- ${c}`),
    "",
    "## Rollback",
    ...request.rollbackPlan.map((c) => `- ${c}`),
    "",
    "V4.0 — aucune exécution réelle.",
  ];
  return lines.join("\n");
}
