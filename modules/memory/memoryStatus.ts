import type { AuthStatus } from "@/modules/supabase/types";
import { createLocalSnapshotSummary, summaryHasData } from "@/modules/persistence/localSnapshot";
import type { DataSummary } from "@/modules/persistence/types";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import { RECENT_BACKUP_MS } from "./constants";
import type { MemoryMode, MemoryPersistedState, MemoryStatus } from "./types";

const MODE_LABELS: Record<MemoryMode, string> = {
  local_only: "Local",
  local_anonymous: "Local",
  connected_not_backed_up: "Connecté",
  connected_backup_available: "Sauvegardé",
  connected_recently_backed_up: "Sauvegardé",
  connected_conflict: "Écart détecté",
  supabase_error: "Erreur mémoire",
  supabase_not_configured: "Local",
};

function isRecentBackup(lastBackupAt: string | null): boolean {
  if (!lastBackupAt) return false;
  const ts = Date.parse(lastBackupAt);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < RECENT_BACKUP_MS;
}

function resolveAuthenticatedMode(
  persisted: MemoryPersistedState,
  hasConflict: boolean
): MemoryMode {
  if (hasConflict || persisted.lastKnownMode === "connected_conflict") {
    return "connected_conflict";
  }

  if (
    persisted.lastBackupResult === "success" &&
    isRecentBackup(persisted.lastBackupAt)
  ) {
    return "connected_recently_backed_up";
  }

  if (persisted.lastBackupAt && persisted.lastBackupResult === "success") {
    return "connected_backup_available";
  }

  return "connected_not_backed_up";
}

function messageForMode(mode: MemoryMode): string {
  switch (mode) {
    case "local_anonymous":
      return "Mémoire locale. Connecte-toi pour sauvegarder.";
    case "local_only":
      return "Gigi fonctionne en local. Gigi continue de fonctionner en local.";
    case "connected_not_backed_up":
      return "Mémoire connectée. Sauvegarde distante disponible.";
    case "connected_backup_available":
    case "connected_recently_backed_up":
      return "Mémoire sauvegardée. Gigi continue de fonctionner en local.";
    case "connected_conflict":
      return "Écart local/Supabase détecté. Revue manuelle recommandée.";
    case "supabase_error":
      return "Mémoire distante indisponible. Le local reste actif.";
    case "supabase_not_configured":
      return "Mémoire locale uniquement. Gigi continue de fonctionner en local.";
    default:
      return "Gigi continue de fonctionner en local.";
  }
}

export interface ComputeMemoryStatusParams {
  authStatus: AuthStatus;
  isSupabaseConfigured: boolean;
  localState: GigiLocalState | null;
  isHydrated: boolean;
  persisted: MemoryPersistedState;
  remoteSummary?: DataSummary | null;
  hasConflict?: boolean;
  errorMessage?: string | null;
}

export function computeMemoryStatus(params: ComputeMemoryStatusParams): MemoryStatus {
  const {
    authStatus,
    isSupabaseConfigured: configured,
    localState,
    isHydrated,
    persisted,
    remoteSummary = null,
    hasConflict = false,
    errorMessage = null,
  } = params;

  const localSummary =
    isHydrated && localState ? createLocalSnapshotSummary(localState) : null;
  const hasLocalData = localSummary ? summaryHasData(localSummary) : false;

  let mode: MemoryMode;
  let warning: string | undefined;
  let error: string | undefined;

  if (!configured) {
    mode = "supabase_not_configured";
  } else if (authStatus === "error") {
    mode = "supabase_error";
    error = errorMessage ?? "Erreur mémoire distante.";
  } else if (authStatus === "loading") {
    mode = "local_only";
  } else if (authStatus === "anonymous") {
    mode = "local_anonymous";
  } else if (authStatus === "not_configured") {
    mode = "supabase_not_configured";
  } else {
    mode = resolveAuthenticatedMode(persisted, hasConflict);
  }

  if (mode === "connected_conflict") {
    warning = "Consulte /dev/persistence pour comparer local et Supabase.";
  }

  const canBackup =
    configured &&
    authStatus === "authenticated" &&
    hasLocalData &&
    mode !== "supabase_error";

  const canOpenAuth = configured && authStatus === "anonymous";

  return {
    mode,
    label: MODE_LABELS[mode],
    message: messageForMode(mode),
    canBackup,
    canOpenAuth,
    canOpenDevTools: true,
    lastBackupAt: persisted.lastBackupAt,
    localSummary,
    remoteSummary: remoteSummary ?? undefined,
    warning,
    error,
  };
}

export { MODE_LABELS as MEMORY_MODE_LABELS };
