"use client";

import { useCallback, useState } from "react";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import {
  loadRemoteSnapshot,
  syncLocalStateToSupabase,
  type RemoteSnapshot,
  type SyncResult,
  type SyncStatus,
} from "@/modules/supabase/sync";

export function useSupabaseSync() {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  const [lastSnapshot, setLastSnapshot] = useState<RemoteSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const syncNow = useCallback(async (localState: GigiLocalState) => {
    setStatus("syncing");
    setError(null);

    const result = await syncLocalStateToSupabase(localState);
    setLastResult(result);
    setStatus(result.status);
    if (result.status === "error" || result.status === "partial_success") {
      setError(result.errors[0] ?? result.message);
    } else {
      setError(null);
    }

    return result;
  }, []);

  const loadSnapshot = useCallback(async () => {
    setStatus("syncing");
    setError(null);

    const result = await loadRemoteSnapshot();

    if (result.ok) {
      setLastSnapshot(result.snapshot);
      setStatus("success");
      setError(null);
      return result.snapshot;
    }

    setStatus(result.status);
    setError(result.error);
    return null;
  }, []);

  const resetStatus = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return {
    status,
    lastResult,
    lastSnapshot,
    error,
    syncNow,
    loadSnapshot,
    resetStatus,
  };
}
