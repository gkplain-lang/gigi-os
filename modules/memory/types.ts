import type { DataSummary } from "@/modules/persistence/types";
import type { SyncResult } from "@/modules/supabase/sync";

export type MemoryMode =
  | "local_only"
  | "local_anonymous"
  | "connected_not_backed_up"
  | "connected_backup_available"
  | "connected_recently_backed_up"
  | "connected_conflict"
  | "supabase_error"
  | "supabase_not_configured";

export type MemoryBackupState = "idle" | "saving" | "success" | "error";

export interface MemoryBackupCounts {
  projects: number;
  missions: number;
  history: number;
}

export interface MemoryPersistedState {
  lastBackupAt: string | null;
  lastBackupResult: SyncResult["status"] | null;
  lastBackupCounts: MemoryBackupCounts | null;
  lastRemoteSnapshotAt: string | null;
  lastKnownMode: MemoryMode | null;
}

export interface MemoryStatus {
  mode: MemoryMode;
  label: string;
  message: string;
  canBackup: boolean;
  canOpenAuth: boolean;
  canOpenDevTools: boolean;
  lastBackupAt: string | null;
  localSummary: DataSummary | null;
  remoteSummary?: DataSummary | null;
  warning?: string;
  error?: string;
}

export const DEFAULT_MEMORY_PERSISTED: MemoryPersistedState = {
  lastBackupAt: null,
  lastBackupResult: null,
  lastBackupCounts: null,
  lastRemoteSnapshotAt: null,
  lastKnownMode: null,
};
