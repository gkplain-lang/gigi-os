import type {
  ExecutionCapability,
  ExecutionMode,
  ExecutionPermissionStatus,
  ExecutionRiskLevel,
} from "./types";

/** Capabilities always allowed in dry-run / simulation in V4.0 */
export const DRY_RUN_ALWAYS_CAPABILITIES: ExecutionCapability[] = [
  "documentation_only",
  "local_only",
];

/** Capabilities that require explicit user approval even for dry-run prep */
export const APPROVAL_REQUIRED_CAPABILITIES: ExecutionCapability[] = [
  "file_write",
  "file_read",
  "shell_command",
  "git_operation",
  "github_operation",
  "n8n_workflow",
  "browser_action",
  "email_draft",
  "calendar_draft",
  "external_api",
];

/** Real execution blocked entirely in V4.0 */
export const BLOCKED_REAL_EXECUTION_CAPABILITIES: ExecutionCapability[] = [
  "shell_command",
  "file_write",
  "git_operation",
  "github_operation",
  "n8n_workflow",
  "browser_action",
  "email_draft",
  "calendar_draft",
  "external_api",
];

export const BLOCKED_REAL_EXECUTION_PATTERNS = [
  "vraie exécution shell",
  "écriture fichier depuis l'app",
  "appel GitHub réel",
  "appel n8n réel",
  "appel API externe réel",
  "action email/calendar réelle",
  "suppression de données",
  "action irréversible",
  "accès secret/token",
] as const;

export function defaultModeForCapability(capability: ExecutionCapability): ExecutionMode {
  if (DRY_RUN_ALWAYS_CAPABILITIES.includes(capability)) return "dry_run";
  if (APPROVAL_REQUIRED_CAPABILITIES.includes(capability)) return "approval_required";
  return "disabled";
}

export function isRealExecutionBlocked(capability: ExecutionCapability): boolean {
  void capability;
  return true;
}

export function resolveInitialPermissionStatus(
  capabilities: ExecutionCapability[],
  riskLevel: ExecutionRiskLevel
): ExecutionPermissionStatus {
  if (riskLevel === "blocked" || riskLevel === "critical") return "blocked";
  if (capabilities.some((c) => APPROVAL_REQUIRED_CAPABILITIES.includes(c))) {
    return "needs_review";
  }
  return "draft";
}

export function statusAfterDecision(
  decision: import("./types").ExecutionReadinessDecisionType
): ExecutionPermissionStatus {
  switch (decision) {
    case "approve_dry_run":
      return "approved_for_dry_run";
    case "reject":
      return "rejected";
    case "request_more_context":
      return "awaiting_user_approval";
    case "mark_simulated_only":
      return "simulated_only";
    case "archive":
      return "archived";
    case "revoke":
      return "revoked";
    default:
      return "needs_review";
  }
}

export function policySafetyNotes(): string[] {
  return [
    "V4.0 ne lance aucune commande, n'appelle aucun service externe et n'écrit aucun fichier.",
    "« Approuver dry-run » autorise uniquement la simulation locale — pas l'exécution réelle.",
    "Les connecteurs réels (GitHub, n8n, email, calendrier) viendront plus tard, connecteur par connecteur.",
    "Aucune autorisation permanente n'est créée : chaque demande reste locale et révocable.",
  ];
}
