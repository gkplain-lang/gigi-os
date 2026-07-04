import { collectLocalMissions } from "@/modules/supabase/sync";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import { BACKUP_KEY_PREFIX, BACKUPS_INDEX_KEY } from "./constants";
import type { BackupCreationResult, BackupIndexEntry, LocalBackup } from "./types";

function formatBackupTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("-");
}

function readIndex(): BackupIndexEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BACKUPS_INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BackupIndexEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIndex(entries: BackupIndexEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BACKUPS_INDEX_KEY, JSON.stringify(entries));
}

function countsFromState(state: GigiLocalState) {
  return {
    projectsCount: state.projects.length,
    missionsCount: collectLocalMissions(state).length,
    historyEventsCount: state.history.length,
  };
}

/**
 * Saves a full copy of local state. Does not modify the active state key.
 */
export function createLocalStateBackup(
  currentState: GigiLocalState,
  reason: string,
  source: LocalBackup["source"] = "manual"
): BackupCreationResult {
  if (typeof window === "undefined") {
    return { ok: false, error: "Backup impossible côté serveur." };
  }

  try {
    const now = new Date();
    const id = formatBackupTimestamp(now);
    const backupKey = `${BACKUP_KEY_PREFIX}${id}`;
    const counts = countsFromState(currentState);

    const backup: LocalBackup = {
      id,
      createdAt: now.toISOString(),
      previousState: JSON.parse(JSON.stringify(currentState)) as GigiLocalState,
      source,
      metadata: {
        ...counts,
        reason,
      },
    };

    localStorage.setItem(backupKey, JSON.stringify(backup));

    const entry: BackupIndexEntry = {
      id,
      backupKey,
      createdAt: backup.createdAt,
      ...counts,
      reason,
    };

    const index = readIndex();
    index.unshift(entry);
    writeIndex(index.slice(0, 50));

    return { ok: true, backup };
  } catch {
    return { ok: false, error: "Impossible d'écrire le backup dans localStorage." };
  }
}

export function listBackupIndex(): BackupIndexEntry[] {
  return readIndex();
}

export function getLatestBackupEntry(): BackupIndexEntry | null {
  const index = readIndex();
  return index[0] ?? null;
}

export function loadBackupByKey(backupKey: string): LocalBackup | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(backupKey);
    if (!raw) return null;
    return JSON.parse(raw) as LocalBackup;
  } catch {
    return null;
  }
}
