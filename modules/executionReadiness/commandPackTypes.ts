import type { ExecutionRiskLevel } from "./types";
import type { SandboxConnectorId } from "./manualBridgeTypes";

export type CommandPackCategory =
  | "git_local"
  | "github_pr"
  | "n8n_workflow"
  | "browser_checklist"
  | "file_edit"
  | "email_draft"
  | "custom";

export type CommandPackStatus =
  | "draft"
  | "ready_for_review"
  | "copied_by_human"
  | "marked_run_by_human"
  | "marked_success_by_human"
  | "marked_failed_by_human"
  | "cancelled"
  | "expired";

export type CommandPackAuditEventType =
  | "command_pack_created"
  | "command_copied_by_human"
  | "marked_run_by_human"
  | "marked_success_by_human"
  | "marked_failed_by_human"
  | "cancelled"
  | "expired"
  | "status_change";

export interface CommandPackAuditEntry {
  id: string;
  at: string;
  type: CommandPackAuditEventType;
  message: string;
  status?: CommandPackStatus;
}

export interface CommandPackCommand {
  id: string;
  label: string;
  commandText: string;
  explanation: string;
  riskLevel: ExecutionRiskLevel;
  requiresHumanEdit: boolean;
  placeholders: string[];
  expectedOutput?: string;
  failureSigns?: string;
  rollbackHint?: string;
}

export interface CommandPack {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  sourceManualPacketId?: string;
  sourceRequestId?: string;
  connectorId: SandboxConnectorId;
  category: CommandPackCategory;
  status: CommandPackStatus;
  riskLevel: ExecutionRiskLevel;
  humanGoal: string;
  environmentAssumptions: string[];
  prerequisites: string[];
  commands: CommandPackCommand[];
  preflightChecklist: string[];
  postRunChecklist: string[];
  rollbackCommands: CommandPackCommand[];
  expectedOutcome: string;
  knownRisks: string[];
  requiredSecretsNames: string[];
  auditTrail: CommandPackAuditEntry[];
  disclaimer: string;
}

export interface CommandPackGlobalSummary {
  totalPacks: number;
  readyForReview: number;
  copiedByHuman: number;
  markedRun: number;
  markedSuccess: number;
  markedFailed: number;
  expired: number;
  cancelled: number;
  summaryText: string;
}

export interface CommandPackTemplateDefinition {
  id: CommandPackCategory;
  title: string;
  description: string;
  connectorId: SandboxConnectorId;
  riskLevel: ExecutionRiskLevel;
  humanGoal: string;
  environmentAssumptions: string[];
  prerequisites: string[];
  commands: Omit<CommandPackCommand, "id">[];
  preflightChecklist: string[];
  postRunChecklist: string[];
  rollbackCommands: Omit<CommandPackCommand, "id">[];
  expectedOutcome: string;
  knownRisks: string[];
  requiredSecretsNames: string[];
}

export const COMMAND_PACK_TTL_DAYS = 7;

export const COMMAND_PACK_STATUS_LABELS: Record<CommandPackStatus, string> = {
  draft: "Brouillon",
  ready_for_review: "Prêt à relire",
  copied_by_human: "Copié (humain)",
  marked_run_by_human: "Lancé (humain)",
  marked_success_by_human: "Succès déclaré",
  marked_failed_by_human: "Échec déclaré",
  cancelled: "Annulé",
  expired: "Expiré",
};

export const EXECUTION_READINESS_V43_DISCLAIMER =
  "V4.3 — Packs de commandes à copier et lancer toi-même. Aucune exécution réelle, secrets jamais stockés, statuts déclaratifs uniquement.";
