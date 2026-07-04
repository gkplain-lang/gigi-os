import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import type { DataSummary } from "../types";

export type ManualControlStatus =
  | "idle"
  | "loading_remote"
  | "creating_backup"
  | "ready_to_restore"
  | "restoring"
  | "success"
  | "error"
  | "blocked";

export type RestoreRiskLevel = "low" | "medium" | "high";

export interface RestorePreview {
  projectsLocal: number;
  projectsRemote: number;
  missionsLocal: number;
  missionsRemote: number;
  historyLocal: number;
  historyRemote: number;
  mappingComplete: boolean;
  mappingErrors: string[];
}

export interface RestorePlan {
  localSummary: DataSummary;
  remoteSummary: DataSummary;
  riskLevel: RestoreRiskLevel;
  warnings: string[];
  willReplaceLocalState: boolean;
  backupRequired: true;
  confirmationPhrase: string;
  preview: RestorePreview;
  mappingComplete: boolean;
}

export interface RestoreResult {
  status: ManualControlStatus;
  message: string;
  backupCreated: boolean;
  backupKey: string | null;
  restoredAt: string | null;
  errors: string[];
}

export interface LocalBackup {
  id: string;
  createdAt: string;
  previousState: GigiLocalState;
  source: "manual" | "pre_restore";
  metadata: {
    projectsCount: number;
    missionsCount: number;
    historyEventsCount: number;
    reason: string;
  };
}

export interface BackupIndexEntry {
  id: string;
  backupKey: string;
  createdAt: string;
  projectsCount: number;
  missionsCount: number;
  historyEventsCount: number;
  reason: string;
}

export interface BackupCreationResult {
  ok: boolean;
  backup?: LocalBackup;
  error?: string;
}

export interface MappingValidationResult {
  complete: boolean;
  errors: string[];
  unresolvedProjectIds: string[];
  unresolvedMissionIds: string[];
}
