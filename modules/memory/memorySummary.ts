import { createLocalSnapshotSummary } from "@/modules/persistence/localSnapshot";
import { createRemoteSnapshotSummary } from "@/modules/persistence/remoteSnapshot";
import { evaluatePersistenceStrategy } from "@/modules/persistence/persistenceStrategy";
import { isSupabaseConfigured } from "@/modules/supabase/client";
import { loadRemoteSnapshot, syncLocalStateToSupabase, type SyncResult } from "@/modules/supabase/sync";
import type { MemoryBackupCounts } from "./types";

export function formatMemoryBackupDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function countsFromSyncResult(result: SyncResult): MemoryBackupCounts {
  return {
    projects: result.syncedProjects,
    missions: result.syncedMissions,
    history: result.syncedHistoryEvents,
  };
}

export function syncResultToPersistedResult(
  status: SyncResult["status"]
): SyncResult["status"] | null {
  if (status === "idle" || status === "syncing" || status === "anonymous" || status === "not_configured") {
    return null;
  }
  return status;
}

export async function fetchRemoteSummaryForMemory(userId?: string) {
  if (!isSupabaseConfigured()) {
    return { ok: false as const, error: "Supabase non configuré." };
  }

  const result = await loadRemoteSnapshot();
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }

  const remoteSummary = createRemoteSnapshotSummary(result.snapshot);
  return {
    ok: true as const,
    remoteSummary,
    snapshot: result.snapshot,
    userId,
  };
}

export function evaluateMemoryConflict(
  localState: Parameters<typeof createLocalSnapshotSummary>[0],
  remoteSummary: ReturnType<typeof createRemoteSnapshotSummary>,
  authStatus: Parameters<typeof evaluatePersistenceStrategy>[0]["authStatus"]
) {
  const localSummary = createLocalSnapshotSummary(localState);
  const diagnostic = evaluatePersistenceStrategy({
    authStatus,
    isSupabaseConfigured: isSupabaseConfigured(),
    localSummary,
    remoteSummary,
    remoteSnapshotLoaded: true,
  });

  return {
    hasConflict: diagnostic.hasConflict,
    mode: diagnostic.hasConflict ? ("connected_conflict" as const) : null,
    diagnostic,
  };
}
