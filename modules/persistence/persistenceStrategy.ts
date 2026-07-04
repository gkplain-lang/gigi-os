import { detectPersistenceConflict } from "./conflictDetection";
import { summaryHasData } from "./localSnapshot";
import type {
  EvaluatePersistenceStrategyParams,
  PersistenceDiagnostic,
  PersistenceMode,
  PersistenceRecommendation,
} from "./types";

const MODE_LABELS: Record<PersistenceMode, string> = {
  local_only: "Local uniquement — aucune donnée détectée.",
  remote_available: "Données Supabase disponibles — local vide.",
  remote_backup: "Local et Supabase coexistent — sauvegarde possible.",
  remote_conflict: "Écart local / Supabase — revue manuelle recommandée.",
  remote_empty: "Données locales présentes — Supabase vide.",
  not_authenticated: "Mode anonyme — persistance locale uniquement.",
  supabase_not_configured: "Supabase non configuré — mode local.",
  error: "Erreur de diagnostic — les données locales sont protégées.",
};

function buildDiagnostic(
  mode: PersistenceMode,
  recommendation: PersistenceRecommendation,
  params: EvaluatePersistenceStrategyParams,
  overrides: Partial<PersistenceDiagnostic> = {}
): PersistenceDiagnostic {
  const { localSummary, remoteSummary = null } = params;
  const hasLocalData = summaryHasData(localSummary);
  const hasRemoteData = remoteSummary ? summaryHasData(remoteSummary) : false;
  const conflict = remoteSummary
    ? detectPersistenceConflict(localSummary, remoteSummary)
    : { hasConflict: false, conflictType: null };

  const configured = params.isSupabaseConfigured;
  const authenticated = params.authStatus === "authenticated";

  return {
    mode,
    recommendation,
    message: overrides.message ?? MODE_LABELS[mode],
    localSummary,
    remoteSummary,
    hasLocalData,
    hasRemoteData,
    hasConflict: conflict.hasConflict,
    conflictType: conflict.conflictType,
    canBackup: configured && authenticated && hasLocalData,
    canRestore: configured && authenticated && hasRemoteData && Boolean(remoteSummary),
    lastLocalActivityAt: localSummary.lastActivityAt,
    lastRemoteActivityAt: remoteSummary?.lastActivityAt ?? null,
    warnings: overrides.warnings ?? [],
    ...overrides,
  };
}

/**
 * Evaluates persistence strategy without applying any changes.
 * Default posture: never overwrite local data automatically.
 */
export function evaluatePersistenceStrategy(
  params: EvaluatePersistenceStrategyParams
): PersistenceDiagnostic {
  const {
    authStatus,
    isSupabaseConfigured: configured,
    localSummary,
    remoteSummary = null,
    remoteSnapshotLoaded = remoteSummary !== null,
    loadError,
  } = params;

  const hasLocalData = summaryHasData(localSummary);
  const warnings: string[] = [];

  if (!configured) {
    return buildDiagnostic("supabase_not_configured", "do_nothing", params, {
      message:
        "Supabase n'est pas configuré. Gigi continue en localStorage sans cloud.",
    });
  }

  if (authStatus === "loading") {
    warnings.push("Authentification en cours de chargement.");
    return buildDiagnostic("not_authenticated", "keep_local", params, {
      message: "Chargement de l'authentification — localStorage reste actif.",
      warnings,
    });
  }

  if (authStatus === "error" || loadError) {
    return buildDiagnostic("error", "keep_local", params, {
      message:
        loadError ??
        "Impossible de diagnostiquer Supabase. Les données locales ne sont pas modifiées.",
      warnings,
    });
  }

  if (authStatus === "anonymous") {
    return buildDiagnostic("not_authenticated", "keep_local", params, {
      message:
        "Utilisateur anonyme. localStorage (gigi-os-v03-state) reste la source principale.",
    });
  }

  if (authStatus === "not_configured") {
    return buildDiagnostic("supabase_not_configured", "do_nothing", params);
  }

  // Authenticated
  if (!remoteSnapshotLoaded) {
    warnings.push(
      "Snapshot Supabase non chargé. Chargez-le pour comparer local et distant."
    );

    if (hasLocalData) {
      return buildDiagnostic("remote_backup", "do_nothing", params, {
        message:
          "Connecté avec données locales. Chargez le snapshot Supabase avant toute décision.",
        warnings,
      });
    }

    return buildDiagnostic("local_only", "do_nothing", params, {
      message: "Connecté sans données locales ni snapshot distant chargé.",
      warnings,
    });
  }

  const conflict = detectPersistenceConflict(localSummary, remoteSummary);
  const hasRemoteData = remoteSummary ? summaryHasData(remoteSummary) : false;

  if (hasLocalData && !hasRemoteData) {
    return buildDiagnostic("remote_empty", "backup_local_to_remote", params, {
      message:
        "Données locales présentes, Supabase vide. Sauvegarde manuelle recommandée (/dev/sync).",
      warnings,
    });
  }

  if (!hasLocalData && hasRemoteData) {
    return buildDiagnostic("remote_available", "offer_remote_restore", params, {
      message:
        "Supabase contient des données, local vide. Restauration manuelle prévue en V0.4.6+ — rien n'est appliqué automatiquement.",
      warnings,
    });
  }

  if (!hasLocalData && !hasRemoteData) {
    return buildDiagnostic("local_only", "do_nothing", params, {
      message: "Aucune donnée locale ni distante détectée.",
      warnings,
    });
  }

  if (conflict.conflictType === "local_newer" || conflict.conflictType === "remote_newer") {
    return buildDiagnostic("remote_conflict", "manual_review", params, {
      message:
        "Local et Supabase divergent (horodatages différents). Aucune fusion automatique — revue manuelle requise.",
      warnings,
    });
  }

  if (conflict.hasConflict) {
    return buildDiagnostic("remote_conflict", "manual_review", params, {
      message:
        "Local et Supabase contiennent des données qui ne correspondent pas. Revue manuelle recommandée.",
      warnings,
    });
  }

  if (conflict.conflictType === "both_have_data") {
    const localAt = localSummary.lastActivityAt;
    const remoteAt = remoteSummary?.lastActivityAt ?? null;

    if (localAt && remoteAt && localAt >= remoteAt) {
      return buildDiagnostic("remote_backup", "backup_local_to_remote", params, {
        message:
          "Local et Supabase semblent alignés ; le local est à jour ou plus récent. Sauvegarde manuelle possible.",
        warnings,
      });
    }

    return buildDiagnostic("remote_backup", "do_nothing", params, {
      message:
        "Local et Supabase semblent cohérents. Aucune action automatique nécessaire.",
      warnings,
    });
  }

  return buildDiagnostic("remote_backup", "do_nothing", params, {
    message: "Données présentes des deux côtés. Stratégie conservatrice : ne rien écraser.",
    warnings,
  });
}

export const PERSISTENCE_MODE_LABELS = MODE_LABELS;

export const RECOMMENDATION_LABELS: Record<
  import("./types").PersistenceRecommendation,
  string
> = {
  keep_local: "Conserver le local",
  backup_local_to_remote: "Sauvegarder local → Supabase (manuel)",
  offer_remote_restore: "Restauration distante proposée (manuel, futur)",
  manual_review: "Revue manuelle requise",
  do_nothing: "Aucune action",
};
