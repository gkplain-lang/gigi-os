import { saveState } from "@/modules/storage/localStorage";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import type { RemoteSnapshot } from "@/modules/supabase/sync";
import { BACKUP_KEY_PREFIX, RESTORE_CONFIRMATION_PHRASE } from "./constants";
import { createLocalStateBackup } from "./localBackup";
import { mapRemoteSnapshotToLocalState } from "./remoteToLocalMappers";
import type { RestorePlan, RestoreResult } from "./types";

export interface RestoreLocalFromRemoteParams {
  remoteSnapshot: RemoteSnapshot;
  restorePlan: RestorePlan;
  confirmationInput: string;
  currentState: GigiLocalState;
  userId: string;
}

/**
 * Manual restore from Supabase → localStorage. Dev-only, requires explicit confirmation.
 * Never deletes Supabase data or local backups.
 */
export function restoreLocalFromRemoteSnapshot(
  params: RestoreLocalFromRemoteParams
): RestoreResult {
  const { remoteSnapshot, restorePlan, confirmationInput, currentState, userId } =
    params;

  if (confirmationInput.trim() !== RESTORE_CONFIRMATION_PHRASE) {
    return {
      status: "blocked",
      message: "Phrase de confirmation incorrecte. Restauration annulée.",
      backupCreated: false,
      backupKey: null,
      restoredAt: null,
      errors: ["confirmation_phrase_mismatch"],
    };
  }

  if (!restorePlan.mappingComplete) {
    return {
      status: "blocked",
      message: "Mapping incomplet. Restauration bloquée.",
      backupCreated: false,
      backupKey: null,
      restoredAt: null,
      errors: restorePlan.preview.mappingErrors,
    };
  }

  const mapped = mapRemoteSnapshotToLocalState(remoteSnapshot, userId);
  if (!mapped.ok) {
    return {
      status: "blocked",
      message: "Impossible de mapper le snapshot Supabase vers l'état local.",
      backupCreated: false,
      backupKey: null,
      restoredAt: null,
      errors: mapped.errors,
    };
  }

  const backupResult = createLocalStateBackup(
    currentState,
    "pre_restore_from_supabase",
    "pre_restore"
  );

  if (!backupResult.ok || !backupResult.backup) {
    return {
      status: "blocked",
      message:
        backupResult.error ??
        "Backup local impossible. Restauration bloquée pour protéger vos données.",
      backupCreated: false,
      backupKey: null,
      restoredAt: null,
      errors: [backupResult.error ?? "backup_failed"],
    };
  }

  const backupKey = `${BACKUP_KEY_PREFIX}${backupResult.backup.id}`;

  try {
    saveState(mapped.state);

    return {
      status: "success",
      message:
        "État local restauré depuis Supabase. Recharge l'app pour appliquer l'état restauré.",
      backupCreated: true,
      backupKey,
      restoredAt: new Date().toISOString(),
      errors: [],
    };
  } catch {
    return {
      status: "error",
      message:
        "Backup créé mais écriture de l'état restauré échouée. Le backup est conservé.",
      backupCreated: true,
      backupKey,
      restoredAt: null,
      errors: ["save_state_failed"],
    };
  }
}
