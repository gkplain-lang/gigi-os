export type BetaChecklistStatus = "pass" | "info" | "manual";

export type BetaFeedbackType =
  | "bug"
  | "friction"
  | "idea"
  | "bad_decision"
  | "other";

export interface BetaChecklistItem {
  id: string;
  label: string;
  category: string;
  status: BetaChecklistStatus;
  note?: string;
}

export interface ModuleHealthEntry {
  module: string;
  version: string;
  status: "ready" | "dry_run_only" | "read_only" | "optional";
  note: string;
}

export interface CriticalRoute {
  path: string;
  label: string;
  role: "user" | "dev";
}

export interface BetaGuardrailsSummary {
  externalActionsDisabled: true;
  dryRunOnly: true;
  n8nConnected: false;
  realIntegrationsDisabled: true;
  autoSyncDisabled: true;
  autoRestoreDisabled: true;
  confirmationRequired: true;
  localStoragePrimary: true;
}

export interface BetaFeedbackEntry {
  id: string;
  type: BetaFeedbackType;
  text: string;
  route?: string;
  module?: string;
  missionId?: string;
  createdAt: string;
}

export interface BetaReadinessSummary {
  version: "0.9.0";
  phase: "private_beta";
  guardrails: BetaGuardrailsSummary;
  checklist: BetaChecklistItem[];
  moduleHealth: ModuleHealthEntry[];
  criticalRoutes: CriticalRoute[];
  knownRisks: string[];
  nextValidations: string[];
  feedbackCount: number;
}

export const BETA_FEEDBACK_STORAGE_KEY = "gigi-os-v09-beta-feedback";
