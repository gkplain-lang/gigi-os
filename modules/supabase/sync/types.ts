import type {
  HistoryEventRow,
  MissionRow,
  ProjectRow,
} from "../types";

export type SyncStatus =
  | "idle"
  | "not_configured"
  | "anonymous"
  | "syncing"
  | "success"
  | "partial_success"
  | "error";

export type SyncDirection =
  | "local_to_remote"
  | "remote_to_local"
  | "diagnostic_only";

export type TableSyncState = "pending" | "success" | "rls_blocked" | "error";

export type SyncTableName = "projects" | "missions" | "history_events";

export interface TableSyncDetail {
  table: SyncTableName;
  state: TableSyncState;
  rowsAttempted: number;
  rowsSynced: number;
  code?: string;
  message?: string;
}

export interface SyncResult {
  status: SyncStatus;
  message: string;
  syncedProjects: number;
  syncedMissions: number;
  syncedHistoryEvents: number;
  errors: string[];
  userId?: string;
  tableDetails: TableSyncDetail[];
}

export interface RemoteSnapshot {
  projects: ProjectRow[];
  missions: MissionRow[];
  historyEvents: HistoryEventRow[];
  lastSyncedAt: string | null;
}

export type RepositoryErrorHint =
  | "rls"
  | "permission"
  | "constraint"
  | "network"
  | "unknown";

export interface RepositoryResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: string;
  count?: number;
  table?: SyncTableName;
  hint?: RepositoryErrorHint;
}
