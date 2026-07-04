"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useGigi } from "@/components/providers/GigiProvider";
import { isSupabaseConfigured } from "@/modules/supabase/client";
import { loadRemoteSnapshot, type RemoteSnapshot } from "@/modules/supabase/sync";
import { createLocalSnapshotSummary } from "../localSnapshot";
import { createRemoteSnapshotSummary } from "../remoteSnapshot";
import { createLocalStateBackup, getLatestBackupEntry, listBackupIndex } from "./localBackup";
import { createRestorePlan } from "./restorePlan";
import { restoreLocalFromRemoteSnapshot } from "./restoreLocalFromRemote";
import type {
  BackupIndexEntry,
  ManualControlStatus,
  RestorePlan,
  RestoreResult,
} from "./types";

export function useManualControls() {
  const { status: authStatus, user } = useAuth();
  const { state, isHydrated } = useGigi();

  const [status, setStatus] = useState<ManualControlStatus>("idle");
  const [remoteSnapshot, setRemoteSnapshot] = useState<RemoteSnapshot | null>(null);
  const [restorePlan, setRestorePlan] = useState<RestorePlan | null>(null);
  const [lastBackupId, setLastBackupId] = useState<string | null>(null);
  const [lastRestoreResult, setLastRestoreResult] = useState<RestoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backupIndex, setBackupIndex] = useState<BackupIndexEntry[]>([]);

  const refreshBackupIndex = useCallback(() => {
    setBackupIndex(listBackupIndex());
  }, []);

  const localSummary = useMemo(
    () => (isHydrated ? createLocalSnapshotSummary(state) : null),
    [state, isHydrated]
  );

  const remoteSummary = useMemo(
    () => (remoteSnapshot ? createRemoteSnapshotSummary(remoteSnapshot) : null),
    [remoteSnapshot]
  );

  const loadRemote = useCallback(async () => {
    setStatus("loading_remote");
    setError(null);

    const result = await loadRemoteSnapshot();
    if (result.ok) {
      setRemoteSnapshot(result.snapshot);
      setRestorePlan(null);
      setStatus("idle");
      return result.snapshot;
    }

    setError(result.error);
    setStatus("error");
    return null;
  }, []);

  const createBackup = useCallback(() => {
    if (!isHydrated) {
      setError("État local non hydraté.");
      setStatus("error");
      return null;
    }

    setStatus("creating_backup");
    setError(null);

    const result = createLocalStateBackup(state, "manual_dev_controls");
    refreshBackupIndex();

    if (result.ok && result.backup) {
      setLastBackupId(result.backup.id);
      setStatus("success");
      return result.backup;
    }

    setError(result.error ?? "Backup impossible.");
    setStatus("error");
    return null;
  }, [state, isHydrated, refreshBackupIndex]);

  const prepareRestorePlan = useCallback(() => {
    if (!isHydrated || !remoteSnapshot || !user?.id) {
      setError("Snapshot remote ou utilisateur manquant.");
      setStatus("blocked");
      return null;
    }

    setError(null);
    const plan = createRestorePlan(state, remoteSnapshot, user.id);
    setRestorePlan(plan);
    setStatus(plan.mappingComplete ? "ready_to_restore" : "blocked");
    return plan;
  }, [state, remoteSnapshot, user?.id, isHydrated]);

  const executeRestore = useCallback(
    (confirmationInput: string) => {
      if (!isHydrated || !remoteSnapshot || !restorePlan || !user?.id) {
        const blocked: RestoreResult = {
          status: "blocked",
          message: "Restauration bloquée — prérequis manquants.",
          backupCreated: false,
          backupKey: null,
          restoredAt: null,
          errors: ["missing_prerequisites"],
        };
        setLastRestoreResult(blocked);
        setStatus("blocked");
        return blocked;
      }

      if (authStatus !== "authenticated" || !isSupabaseConfigured()) {
        const blocked: RestoreResult = {
          status: "blocked",
          message: "Authentification ou Supabase requis.",
          backupCreated: false,
          backupKey: null,
          restoredAt: null,
          errors: ["auth_or_config"],
        };
        setLastRestoreResult(blocked);
        setStatus("blocked");
        return blocked;
      }

      setStatus("restoring");
      setError(null);

      const result = restoreLocalFromRemoteSnapshot({
        remoteSnapshot,
        restorePlan,
        confirmationInput,
        currentState: state,
        userId: user.id,
      });

      setLastRestoreResult(result);
      refreshBackupIndex();

      if (result.status === "success") {
        setStatus("success");
        if (result.backupKey) {
          setLastBackupId(result.backupKey.replace("gigi-os-v03-backup-", ""));
        }
      } else {
        setError(result.message);
        setStatus(result.status);
      }

      return result;
    },
    [
      isHydrated,
      remoteSnapshot,
      restorePlan,
      user?.id,
      authStatus,
      state,
      refreshBackupIndex,
    ]
  );

  return {
    status,
    authStatus,
    user,
    localSummary,
    remoteSummary,
    remoteSnapshot,
    restorePlan,
    lastBackupId,
    lastRestoreResult,
    error,
    backupIndex,
    latestBackup: getLatestBackupEntry(),
    isHydrated,
    refreshBackupIndex,
    loadRemote,
    createBackup,
    prepareRestorePlan,
    executeRestore,
  };
}
