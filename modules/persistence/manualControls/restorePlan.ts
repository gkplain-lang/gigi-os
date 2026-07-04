import type { RemoteSnapshot } from "@/modules/supabase/sync";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import { createLocalSnapshotSummary } from "../localSnapshot";
import { createRemoteSnapshotSummary } from "../remoteSnapshot";
import { detectPersistenceConflict } from "../conflictDetection";
import { RESTORE_CONFIRMATION_PHRASE } from "./constants";
import { validateRemoteSnapshotMapping } from "./remoteToLocalMappers";
import type { RestorePlan, RestoreRiskLevel } from "./types";

function computeRiskLevel(
  hasLocalData: boolean,
  hasRemoteData: boolean,
  hasConflict: boolean,
  mappingComplete: boolean
): RestoreRiskLevel {
  if (!mappingComplete) return "high";
  if (!hasLocalData && hasRemoteData) return "low";
  if (hasConflict) return "high";
  if (hasLocalData && hasRemoteData) return "medium";
  return "low";
}

/**
 * Builds a restore plan without modifying any data.
 */
export function createRestorePlan(
  localState: GigiLocalState,
  remoteSnapshot: RemoteSnapshot,
  userId: string
): RestorePlan {
  const localSummary = createLocalSnapshotSummary(localState);
  const remoteSummary = createRemoteSnapshotSummary(remoteSnapshot);
  const mapping = validateRemoteSnapshotMapping(remoteSnapshot, userId);
  const conflict = detectPersistenceConflict(localSummary, remoteSummary);

  const hasLocalData =
    localSummary.projectsCount > 0 ||
    localSummary.missionsCount > 0 ||
    localSummary.historyEventsCount > 0;
  const hasRemoteData =
    remoteSummary.projectsCount > 0 ||
    remoteSummary.missionsCount > 0 ||
    remoteSummary.historyEventsCount > 0;

  const warnings: string[] = [];

  if (!mapping.complete) {
    warnings.push("Mapping remote → local incomplet. Restauration bloquée.");
    warnings.push(...mapping.errors);
  }

  if (hasLocalData && hasRemoteData) {
    warnings.push(
      "La restauration remplacera entièrement gigi-os-v03-state par les données Supabase."
    );
  }

  if (conflict.hasConflict) {
    warnings.push(
      "Conflit détecté entre local et Supabase. Vérifie le plan avant de confirmer."
    );
  }

  warnings.push("Un backup local sera créé automatiquement avant toute écriture.");
  warnings.push("Recharge l'app après restauration pour appliquer le nouvel état.");

  const riskLevel = computeRiskLevel(
    hasLocalData,
    hasRemoteData,
    conflict.hasConflict,
    mapping.complete
  );

  return {
    localSummary,
    remoteSummary,
    riskLevel,
    warnings,
    willReplaceLocalState: hasRemoteData,
    backupRequired: true,
    confirmationPhrase: RESTORE_CONFIRMATION_PHRASE,
    mappingComplete: mapping.complete,
    preview: {
      projectsLocal: localSummary.projectsCount,
      projectsRemote: remoteSummary.projectsCount,
      missionsLocal: localSummary.missionsCount,
      missionsRemote: remoteSummary.missionsCount,
      historyLocal: localSummary.historyEventsCount,
      historyRemote: remoteSummary.historyEventsCount,
      mappingComplete: mapping.complete,
      mappingErrors: mapping.errors,
    },
  };
}

export const RESTORE_RISK_LABELS: Record<RestoreRiskLevel, string> = {
  low: "Faible",
  medium: "Moyen",
  high: "Élevé",
};
