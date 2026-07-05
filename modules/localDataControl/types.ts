export type LocalDataRiskLevel = "low" | "medium" | "high" | "critical";

export type LocalDataCategory =
  | "core"
  | "backup"
  | "memory"
  | "feedback"
  | "execution"
  | "mission"
  | "settings"
  | "optional";

export interface LocalDataKeyDescriptor {
  key: string;
  label: string;
  description: string;
  ownerModule: string;
  version: string;
  category: LocalDataCategory;
  riskLevel: LocalDataRiskLevel;
  exportable: boolean;
  resettable: boolean;
  dangerousToReset: boolean;
  /** Prefix match for dynamic keys (e.g. backups) */
  keyPrefix?: boolean;
}

export interface LocalDataRecordSummary {
  key: string;
  exists: boolean;
  sizeBytes: number;
  itemCount?: number;
  lastUpdatedLabel?: string;
  exportable: boolean;
  resettable: boolean;
  riskLabel: string;
  label: string;
  description: string;
  ownerModule: string;
  category: LocalDataCategory;
}

export interface LocalDataSnapshot {
  generatedAt: string;
  appVersion: string;
  keys: LocalDataRecordSummary[];
  totalSizeBytes: number;
  presentCount: number;
  exportableCount: number;
}

export interface LocalDataExportPayload {
  schemaVersion: "3.7";
  appVersion: string;
  exportedAt: string;
  source: "gigi-local-export";
  keys: string[];
  data: Record<string, unknown>;
}

export interface LocalImportPreview {
  valid: boolean;
  sourceVersion: string | null;
  keysFound: string[];
  keysKnown: string[];
  keysUnknown: string[];
  keysThatWouldChange: string[];
  warnings: string[];
  blockedReasons: string[];
}

export type UiDensity = "comfortable" | "compact";
export type SafetyMode = "normal" | "strict";

export interface LocalSettings {
  uiDensity: UiDensity;
  safetyMode: SafetyMode;
  showBetaHints: boolean;
  showSafetyReminders: boolean;
  lastOpenedSection: string | null;
  updatedAt: string;
}

export type LocalResetTarget =
  | "beta_feedback"
  | "local_settings"
  | "memory_status"
  | "onboarding_ui"
  | "action_queue"
  | "all_known";

export interface LocalResetOption {
  id: LocalResetTarget;
  label: string;
  description: string;
  confirmationLevel: "simple" | "strong" | "ultra";
  keysAffected: string[];
}

export interface LocalResetResult {
  ok: boolean;
  message: string;
  keysRemoved: string[];
}
