"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useGigi } from "@/components/providers/GigiProvider";
import { isSupabaseConfigured } from "@/modules/supabase/client";
import { loadRemoteSnapshot, type RemoteSnapshot } from "@/modules/supabase/sync";
import { createLocalSnapshotSummary } from "./localSnapshot";
import { createRemoteSnapshotSummary } from "./remoteSnapshot";
import { evaluatePersistenceStrategy } from "./persistenceStrategy";
import type { DataSummary, PersistenceDiagnostic } from "./types";

export function usePersistenceDiagnostic() {
  const { status: authStatus } = useAuth();
  const { state, isHydrated } = useGigi();

  const [remoteSummary, setRemoteSummary] = useState<DataSummary | null>(null);
  const [remoteSnapshot, setRemoteSnapshot] = useState<RemoteSnapshot | null>(null);
  const [remoteSnapshotLoaded, setRemoteSnapshotLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localSummary = useMemo(
    () => (isHydrated ? createLocalSnapshotSummary(state) : null),
    [state, isHydrated]
  );

  const refreshRemoteSnapshot = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await loadRemoteSnapshot();

    if (result.ok) {
      const summary = createRemoteSnapshotSummary(result.snapshot);
      setRemoteSummary(summary);
      setRemoteSnapshot(result.snapshot);
      setRemoteSnapshotLoaded(true);
      setLoading(false);
      return summary;
    }

    setError(result.error);
    setRemoteSnapshotLoaded(false);
    setLoading(false);
    return null;
  }, []);

  const diagnostic: PersistenceDiagnostic | null = useMemo(() => {
    if (!localSummary) return null;

    return evaluatePersistenceStrategy({
      authStatus,
      isSupabaseConfigured: isSupabaseConfigured(),
      localSummary,
      remoteSummary,
      remoteSnapshotLoaded,
      loadError: error,
    });
  }, [authStatus, localSummary, remoteSummary, remoteSnapshotLoaded, error]);

  return {
    diagnostic,
    localSummary,
    remoteSummary,
    remoteSnapshot,
    refreshRemoteSnapshot,
    loading,
    error,
    isHydrated,
    remoteSnapshotLoaded,
  };
}
