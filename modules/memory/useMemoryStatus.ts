"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useGigi } from "@/components/providers/GigiProvider";
import { isSupabaseConfigured } from "@/modules/supabase/client";
import { syncLocalStateToSupabase, type SyncResult } from "@/modules/supabase/sync";
import type { DataSummary } from "@/modules/persistence/types";
import { readMemoryPersistedState, writeMemoryPersistedState } from "./memoryPersist";
import { computeMemoryStatus } from "./memoryStatus";
import {
  countsFromSyncResult,
  evaluateMemoryConflict,
  fetchRemoteSummaryForMemory,
  syncResultToPersistedResult,
} from "./memorySummary";
import type { MemoryBackupState, MemoryMode, MemoryPersistedState, MemoryStatus } from "./types";
import { DEFAULT_MEMORY_PERSISTED } from "./types";

export function useMemoryStatus() {
  const { status: authStatus, errorMessage: authError } = useAuth();
  const { state, isHydrated } = useGigi();

  const [persisted, setPersisted] = useState<MemoryPersistedState>(() => ({
    ...DEFAULT_MEMORY_PERSISTED,
  }));
  const [backupState, setBackupState] = useState<MemoryBackupState>("idle");
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remoteSummary, setRemoteSummary] = useState<DataSummary | null>(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setPersisted(readMemoryPersistedState());
  }, [isHydrated]);

  const memoryStatus: MemoryStatus = useMemo(
    () =>
      computeMemoryStatus({
        authStatus,
        isSupabaseConfigured: isSupabaseConfigured(),
        localState: state,
        isHydrated,
        persisted,
        remoteSummary,
        hasConflict,
        errorMessage: authError ?? error,
      }),
    [authStatus, state, isHydrated, persisted, remoteSummary, hasConflict, authError, error]
  );

  const refreshMemoryStatus = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    const currentPersisted = readMemoryPersistedState();
    setPersisted(currentPersisted);

    if (
      !isSupabaseConfigured() ||
      authStatus !== "authenticated" ||
      !isHydrated
    ) {
      setRefreshing(false);
      return null;
    }

    const remote = await fetchRemoteSummaryForMemory();
    if (!remote.ok) {
      setError(remote.error);
      writeMemoryPersistedState({ lastKnownMode: "supabase_error" as MemoryMode });
      setPersisted(readMemoryPersistedState());
      setRefreshing(false);
      return null;
    }

    setRemoteSummary(remote.remoteSummary);

    const conflict = evaluateMemoryConflict(state, remote.remoteSummary, authStatus);
    setHasConflict(conflict.hasConflict);

    const nextMode: MemoryMode = conflict.hasConflict
      ? "connected_conflict"
      : currentPersisted.lastKnownMode ?? "connected_not_backed_up";

    const updated = writeMemoryPersistedState({
      lastRemoteSnapshotAt: new Date().toISOString(),
      lastKnownMode: nextMode,
    });
    setPersisted(updated);
    setRefreshing(false);

    return computeMemoryStatus({
      authStatus,
      isSupabaseConfigured: true,
      localState: state,
      isHydrated,
      persisted: updated,
      remoteSummary: remote.remoteSummary,
      hasConflict: conflict.hasConflict,
    });
  }, [authStatus, state, isHydrated]);

  const backupNow = useCallback(async () => {
    if (!isHydrated) {
      setError("État local non prêt.");
      setBackupState("error");
      return null;
    }

    if (authStatus !== "authenticated") {
      setError("Connecte-toi pour sauvegarder vers Supabase.");
      setBackupState("error");
      return null;
    }

    if (!isSupabaseConfigured()) {
      setError("Supabase non configuré.");
      setBackupState("error");
      return null;
    }

    setBackupState("saving");
    setError(null);

    const result = await syncLocalStateToSupabase(state);
    setLastResult(result);

    const backupResultStatus = syncResultToPersistedResult(result.status);
    const isSuccess = result.status === "success" || result.status === "partial_success";

    if (isSuccess) {
      const updated = writeMemoryPersistedState({
        lastBackupAt: new Date().toISOString(),
        lastBackupResult: backupResultStatus,
        lastBackupCounts: countsFromSyncResult(result),
        lastKnownMode: "connected_recently_backed_up",
      });
      setPersisted(updated);
      setHasConflict(false);
      setBackupState("success");
      return result;
    }

    setError(result.message);
    writeMemoryPersistedState({
      lastBackupResult: backupResultStatus,
      lastKnownMode: "supabase_error",
    });
    setPersisted(readMemoryPersistedState());
    setBackupState("error");
    return result;
  }, [state, isHydrated, authStatus]);

  return {
    memoryStatus,
    backupState,
    lastResult,
    error,
    refreshing,
    persisted,
    backupNow,
    refreshMemoryStatus,
  };
}
