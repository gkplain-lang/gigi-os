import { ACTION_QUEUE_STORAGE_KEY } from "@/modules/actionQueue/types";
import { BETA_FEEDBACK_STORAGE_KEY } from "@/modules/beta/types";
import { MEMORY_STATUS_KEY } from "@/modules/memory/constants";
import { BACKUP_KEY_PREFIX, BACKUPS_INDEX_KEY } from "@/modules/persistence/manualControls/constants";
import { STORAGE_KEY } from "@/modules/storage/gigiStateTypes";
import { findKeyDescriptor, listAllLocalStorageKeys } from "./localDataKeys";
import {
  LOCAL_RESET_CONFIRMATION_PHRASE,
  LOCAL_SETTINGS_STORAGE_KEY,
  resetLocalSettings,
} from "./localSettingsStore";
import type { LocalResetOption, LocalResetResult, LocalResetTarget } from "./types";

export { LOCAL_RESET_CONFIRMATION_PHRASE };

export const LOCAL_RESET_OPTIONS: LocalResetOption[] = [
  {
    id: "beta_feedback",
    label: "Réinitialiser les retours bêta",
    description: "Supprime gigi-os-v09-beta-feedback uniquement.",
    confirmationLevel: "simple",
    keysAffected: [BETA_FEEDBACK_STORAGE_KEY],
  },
  {
    id: "local_settings",
    label: "Réinitialiser les préférences V3.7",
    description: "Remet densité UI et mode prudence aux valeurs par défaut.",
    confirmationLevel: "simple",
    keysAffected: [LOCAL_SETTINGS_STORAGE_KEY],
  },
  {
    id: "memory_status",
    label: "Réinitialiser le statut mémoire",
    description: "Supprime gigi-os-v04-memory-status.",
    confirmationLevel: "simple",
    keysAffected: [MEMORY_STATUS_KEY],
  },
  {
    id: "onboarding_ui",
    label: "Réinitialiser l'UI onboarding (si clé dédiée)",
    description: "Supprime gigi-os-v35-onboarding-state si présente.",
    confirmationLevel: "simple",
    keysAffected: ["gigi-os-v35-onboarding-state"],
  },
  {
    id: "action_queue",
    label: "Réinitialiser la file d'actions",
    description: "Supprime gigi-os-v19-action-queue — actions préparées perdues.",
    confirmationLevel: "strong",
    keysAffected: [ACTION_QUEUE_STORAGE_KEY],
  },
  {
    id: "all_known",
    label: "Réinitialiser toutes les données locales connues",
    description:
      "Supprime toutes les clés gigi-os-* cataloguées, y compris gigi-os-v03-state et backups.",
    confirmationLevel: "ultra",
    keysAffected: ["gigi-os-* (catalogue)"],
  },
];

function removeKeys(keys: string[]): string[] {
  if (typeof window === "undefined") return [];
  const removed: string[] = [];
  for (const key of keys) {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      removed.push(key);
    }
  }
  return removed;
}

function collectAllKnownKeys(): string[] {
  const keys = listAllLocalStorageKeys().filter((key) => {
    if (!key.startsWith("gigi-os-")) return false;
    const descriptor = findKeyDescriptor(key);
    return descriptor?.resettable ?? false;
  });
  return keys;
}

export function executeLocalReset(
  target: LocalResetTarget,
  confirmationPhrase?: string
): LocalResetResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Reset impossible côté serveur.", keysRemoved: [] };
  }

  const option = LOCAL_RESET_OPTIONS.find((o) => o.id === target);
  if (!option) {
    return { ok: false, message: "Option de reset inconnue.", keysRemoved: [] };
  }

  if (option.confirmationLevel === "ultra") {
    if (confirmationPhrase !== LOCAL_RESET_CONFIRMATION_PHRASE) {
      return {
        ok: false,
        message: `Phrase requise : ${LOCAL_RESET_CONFIRMATION_PHRASE}`,
        keysRemoved: [],
      };
    }
  }

  if (option.confirmationLevel === "strong" && !confirmationPhrase?.trim()) {
    return {
      ok: false,
      message: "Confirmation textuelle requise pour ce reset.",
      keysRemoved: [],
    };
  }

  if (target === "local_settings") {
    resetLocalSettings();
    return {
      ok: true,
      message: "Préférences V3.7 réinitialisées.",
      keysRemoved: [LOCAL_SETTINGS_STORAGE_KEY],
    };
  }

  if (target === "all_known") {
    const keys = collectAllKnownKeys();
    const backupKeys = listAllLocalStorageKeys().filter((k) => k.startsWith(BACKUP_KEY_PREFIX));
    const allKeys = Array.from(new Set([...keys, ...backupKeys, BACKUPS_INDEX_KEY]));
    const removed = removeKeys(allKeys);
    resetLocalSettings();
    return {
      ok: true,
      message: `${removed.length} clé(s) supprimée(s). Recharge la page pour repartir proprement.`,
      keysRemoved: removed,
    };
  }

  const removed = removeKeys(option.keysAffected);
  return {
    ok: removed.length > 0,
    message:
      removed.length > 0
        ? `${removed.length} clé(s) supprimée(s) : ${removed.join(", ")}`
        : "Aucune clé présente à supprimer.",
    keysRemoved: removed,
  };
}

export function getResetOption(target: LocalResetTarget): LocalResetOption | undefined {
  return LOCAL_RESET_OPTIONS.find((o) => o.id === target);
}

/** Keys that would be wiped in ultra reset — for display only */
export function previewUltraResetKeys(): string[] {
  return collectAllKnownKeys();
}

export function isCoreStateKey(key: string): boolean {
  return key === STORAGE_KEY;
}
