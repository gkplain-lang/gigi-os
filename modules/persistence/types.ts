import type { AuthStatus } from "@/modules/supabase/types";
import type { SyncResult } from "@/modules/supabase/sync";

export type PersistenceMode =
  | "local_only"
  | "remote_available"
  | "remote_backup"
  | "remote_conflict"
  | "remote_empty"
  | "not_authenticated"
  | "supabase_not_configured"
  | "error";

export type PersistenceRecommendation =
  | "keep_local"
  | "backup_local_to_remote"
  | "offer_remote_restore"
  | "manual_review"
  | "do_nothing";

export type ConflictType =
  | "local_newer"
  | "remote_newer"
  | "both_have_data"
  | "remote_empty_local_exists"
  | "local_empty_remote_exists"
  | "unknown";

export type DataSource = "local" | "remote";

export interface DataSummary {
  projectsCount: number;
  missionsCount: number;
  historyEventsCount: number;
  lastActivityAt: string | null;
  source: DataSource;
}

export interface PersistenceDiagnostic {
  mode: PersistenceMode;
  recommendation: PersistenceRecommendation;
  message: string;
  localSummary: DataSummary;
  remoteSummary: DataSummary | null;
  hasLocalData: boolean;
  hasRemoteData: boolean;
  hasConflict: boolean;
  conflictType: ConflictType | null;
  canBackup: boolean;
  canRestore: boolean;
  lastLocalActivityAt: string | null;
  lastRemoteActivityAt: string | null;
  warnings: string[];
}

export interface EvaluatePersistenceStrategyParams {
  authStatus: AuthStatus;
  isSupabaseConfigured: boolean;
  localSummary: DataSummary;
  remoteSummary?: DataSummary | null;
  remoteSnapshotLoaded?: boolean;
  lastSyncResult?: SyncResult | null;
  loadError?: string | null;
}
