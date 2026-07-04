export type ReleaseChecklistStatus = "pass" | "info" | "manual";

export interface ReleaseChecklistItem {
  id: string;
  label: string;
  category: string;
  status: ReleaseChecklistStatus;
  note?: string;
}

export interface RouteHealthEntry {
  path: string;
  label: string;
  role: "user" | "dev";
  available: true;
}

export interface ModuleHealthEntry {
  module: string;
  version: string;
  role: "core" | "dry_run" | "optional";
  note: string;
}

export interface ReleaseGuardrailsSummary {
  externalActionsDisabled: true;
  dryRunOnly: true;
  n8nConnected: false;
  realIntegrationsDisabled: true;
  autoSyncDisabled: true;
  autoRestoreDisabled: true;
  confirmationRequired: true;
  localStoragePrimary: true;
}

export interface DailyUseReadiness {
  promise: string;
  missionAvailable: true;
  conversationAvailable: true;
  dailyReviewAvailable: true;
  feedbackAvailable: true;
}

export interface ReleaseReadinessSummary {
  version: "1.0.0";
  phase: "daily_use";
  promise: string;
  guardrails: ReleaseGuardrailsSummary;
  dailyUse: DailyUseReadiness;
  checklist: ReleaseChecklistItem[];
  routes: RouteHealthEntry[];
  modules: ModuleHealthEntry[];
  knownRisks: string[];
  manualValidations: string[];
}
