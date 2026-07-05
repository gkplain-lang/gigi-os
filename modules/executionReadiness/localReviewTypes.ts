import type { ExecutionRiskLevel } from "./types";

export type LocalReviewType =
  | "terminal_output"
  | "github_response"
  | "n8n_log"
  | "browser_note"
  | "email_note"
  | "generic";

export type LocalReviewInputType =
  | "terminal_output"
  | "log"
  | "api_response"
  | "browser_note"
  | "email_note"
  | "freeform";

export type LocalReviewSessionStatus =
  | "draft"
  | "awaiting_user_input"
  | "review_ready"
  | "likely_success"
  | "needs_attention"
  | "likely_failed"
  | "inconclusive"
  | "cancelled"
  | "archived";

export type LocalReviewConfidence = "low" | "medium" | "high";

export type LocalReviewAuditEventType =
  | "review_session_created"
  | "input_saved_by_human"
  | "local_review_analyzed"
  | "sensitive_pattern_detected"
  | "marked_inconclusive"
  | "archived"
  | "status_change";

export interface LocalReviewAuditEntry {
  id: string;
  at: string;
  type: LocalReviewAuditEventType;
  message: string;
  status?: LocalReviewSessionStatus;
}

export interface LocalReviewInput {
  id: string;
  createdAt: string;
  inputType: LocalReviewInputType;
  label: string;
  rawText: string;
  redactionWarnings: string[];
  detectedSensitivePatterns: string[];
  userConfirmedNoSecrets?: boolean;
}

export interface LocalReviewSignalReport {
  successSignals: string[];
  warningSignals: string[];
  errorSignals: string[];
  detectedSignals: string[];
}

export interface LocalReviewSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sourceCommandPackId?: string;
  sourceCommandId?: string;
  reviewType: LocalReviewType;
  status: LocalReviewSessionStatus;
  confidence: LocalReviewConfidence;
  userProvidedInput: string;
  sanitizedPreview: string;
  inputs: LocalReviewInput[];
  detectedSignals: string[];
  successSignals: string[];
  warningSignals: string[];
  errorSignals: string[];
  humanChecks: string[];
  recommendedNextSteps: string[];
  riskLevel: ExecutionRiskLevel;
  hasSensitivePatternAlert: boolean;
  auditTrail: LocalReviewAuditEntry[];
  disclaimer: string;
}

export interface LocalReviewGlobalSummary {
  totalSessions: number;
  awaitingInput: number;
  likelySuccess: number;
  needsAttention: number;
  likelyFailed: number;
  inconclusive: number;
  sensitiveAlerts: number;
  summaryText: string;
}

export const LOCAL_REVIEW_STATUS_LABELS: Record<LocalReviewSessionStatus, string> = {
  draft: "Brouillon",
  awaiting_user_input: "En attente de résultat",
  review_ready: "Prête à analyser",
  likely_success: "Succès probable",
  needs_attention: "Attention requise",
  likely_failed: "Échec probable",
  inconclusive: "Inconclusif",
  cancelled: "Annulée",
  archived: "Archivée",
};

export const EXECUTION_READINESS_V44_DISCLAIMER =
  "V4.4 — Revue locale sur texte collé uniquement. Gigi ne lit pas ton terminal, n'inspecte pas tes fichiers et ne vérifie aucun système. Statuts probables — contrôle humain obligatoire.";
