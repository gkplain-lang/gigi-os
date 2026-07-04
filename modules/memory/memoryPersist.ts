import { MEMORY_STATUS_KEY } from "./constants";
import { DEFAULT_MEMORY_PERSISTED, type MemoryPersistedState } from "./types";

export function readMemoryPersistedState(): MemoryPersistedState {
  if (typeof window === "undefined") return { ...DEFAULT_MEMORY_PERSISTED };

  try {
    const raw = localStorage.getItem(MEMORY_STATUS_KEY);
    if (!raw) return { ...DEFAULT_MEMORY_PERSISTED };
    const parsed = JSON.parse(raw) as Partial<MemoryPersistedState>;
    return {
      lastBackupAt: parsed.lastBackupAt ?? null,
      lastBackupResult: parsed.lastBackupResult ?? null,
      lastBackupCounts: parsed.lastBackupCounts ?? null,
      lastRemoteSnapshotAt: parsed.lastRemoteSnapshotAt ?? null,
      lastKnownMode: parsed.lastKnownMode ?? null,
    };
  } catch {
    return { ...DEFAULT_MEMORY_PERSISTED };
  }
}

export function writeMemoryPersistedState(partial: Partial<MemoryPersistedState>): MemoryPersistedState {
  const next: MemoryPersistedState = {
    ...readMemoryPersistedState(),
    ...partial,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(MEMORY_STATUS_KEY, JSON.stringify(next));
  }

  return next;
}

export function clearMemoryPersistedState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MEMORY_STATUS_KEY);
}
