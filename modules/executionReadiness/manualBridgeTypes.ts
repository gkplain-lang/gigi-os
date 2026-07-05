import type { ExecutionCapability, ExecutionRiskLevel } from "./types";

export type SandboxConnectorId =
  | "shell"
  | "file_write"
  | "git"
  | "github"
  | "n8n"
  | "browser"
  | "email"
  | "calendar"
  | "external_api";

export type SandboxConnectorStatus = "blocked" | "sandbox_only" | "manual_bridge_only";

export interface SandboxConnectorDefinition {
  id: SandboxConnectorId;
  label: string;
  description: string;
  status: SandboxConnectorStatus;
  capability: ExecutionCapability;
  riskLevel: ExecutionRiskLevel;
  requiredPermissionScope: string;
  preparableTaskExamples: string[];
  limitations: string[];
  disclaimer: string;
}

export type ManualExecutionPacketStatus =
  | "draft"
  | "ready_for_human_review"
  | "copied_by_human"
  | "marked_done_by_human"
  | "cancelled"
  | "expired";

export type ManualBridgeAuditEventType =
  | "manual_packet_created"
  | "copied_by_human"
  | "marked_done_by_human"
  | "cancelled"
  | "expired"
  | "status_change";

export interface ManualBridgeAuditEntry {
  id: string;
  at: string;
  type: ManualBridgeAuditEventType;
  message: string;
  status?: ManualExecutionPacketStatus;
}

export interface ManualExecutionPacket {
  id: string;
  title: string;
  connectorId: SandboxConnectorId;
  capability: ExecutionCapability;
  status: ManualExecutionPacketStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  sourceRequestId?: string;
  riskLevel: ExecutionRiskLevel;
  humanGoal: string;
  preflightChecklist: string[];
  manualSteps: string[];
  copyableCommands: string[];
  copyableInstructions: string[];
  requiredSecretsNames: string[];
  rollbackPlan: string[];
  expectedOutcome: string;
  auditTrail: ManualBridgeAuditEntry[];
  disclaimer: string;
}

export interface ManualBridgeGlobalSummary {
  totalPackets: number;
  readyForReview: number;
  copiedByHuman: number;
  markedDone: number;
  expired: number;
  cancelled: number;
  blockedConnectors: number;
  summaryText: string;
}

export const MANUAL_BRIDGE_PACKET_TTL_DAYS = 7;

export const MANUAL_PACKET_STATUS_LABELS: Record<ManualExecutionPacketStatus, string> = {
  draft: "Brouillon",
  ready_for_human_review: "Revue humaine",
  copied_by_human: "Copié (humain)",
  marked_done_by_human: "Fait (humain)",
  cancelled: "Annulé",
  expired: "Expiré",
};

export const EXECUTION_READINESS_V42_DISCLAIMER =
  "V4.2 — Pont manuel et sandbox connecteurs. Paquets d'exécution à copier et valider toi-même — aucune exécution réelle, connecteurs non actifs, aucun secret stocké.";
