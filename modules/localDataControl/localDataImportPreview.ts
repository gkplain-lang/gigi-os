import { findKeyDescriptor, isKnownExportableKey, listAllLocalStorageKeys } from "./localDataKeys";
import type { LocalDataExportPayload, LocalImportPreview, LocalResetResult } from "./types";

function isExportPayload(value: unknown): value is LocalDataExportPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as LocalDataExportPayload;
  return (
    v.schemaVersion === "3.7" &&
    typeof v.appVersion === "string" &&
    typeof v.exportedAt === "string" &&
    v.source === "gigi-local-export" &&
    Array.isArray(v.keys) &&
    typeof v.data === "object" &&
    v.data !== null
  );
}

export function parseImportJson(raw: string): { ok: true; payload: unknown } | { ok: false; error: string } {
  try {
    const payload = JSON.parse(raw) as unknown;
    return { ok: true, payload };
  } catch {
    return { ok: false, error: "JSON invalide — vérifie le format du fichier." };
  }
}

export function previewLocalDataImport(raw: string): LocalImportPreview {
  const parsed = parseImportJson(raw);
  if (!parsed.ok) {
    return {
      valid: false,
      sourceVersion: null,
      keysFound: [],
      keysKnown: [],
      keysUnknown: [],
      keysThatWouldChange: [],
      warnings: [],
      blockedReasons: [parsed.error],
    };
  }

  const payload = parsed.payload;

  if (!isExportPayload(payload)) {
    return {
      valid: false,
      sourceVersion: null,
      keysFound: [],
      keysKnown: [],
      keysUnknown: [],
      keysThatWouldChange: [],
      warnings: ["Le fichier ne correspond pas au schéma d'export Gigi V3.7."],
      blockedReasons: ["Schéma non reconnu — import bloqué par défaut."],
    };
  }

  const keysFound = Object.keys(payload.data).sort();
  const keysKnown = keysFound.filter((k) => isKnownExportableKey(k));
  const keysUnknown = keysFound.filter((k) => !findKeyDescriptor(k));
  const keysNonExportable = keysFound.filter((k) => {
    const d = findKeyDescriptor(k);
    return d !== null && !d.exportable;
  });

  const warnings: string[] = [];
  const blockedReasons: string[] = [];

  if (keysUnknown.length > 0) {
    blockedReasons.push(
      `${keysUnknown.length} clé(s) inconnue(s) — import bloqué tant qu'elles sont présentes.`
    );
  }

  if (keysNonExportable.length > 0) {
    blockedReasons.push(
      `${keysNonExportable.length} clé(s) non exportables — retirées de l'import.`
    );
  }

  if (typeof window !== "undefined") {
    const existing = listAllLocalStorageKeys();
    const wouldChange = keysKnown.filter((k) => existing.includes(k));
    if (wouldChange.length > 0) {
      warnings.push(
        `${wouldChange.length} clé(s) existante(s) seraient écrasées après confirmation explicite.`
      );
    }
  }

  warnings.push("Aucun import automatique — confirmation utilisateur requise.");

  const keysThatWouldChange =
    typeof window !== "undefined"
      ? keysKnown.filter((k) => listAllLocalStorageKeys().includes(k))
      : keysKnown;

  const valid = blockedReasons.length === 0 && keysKnown.length > 0;

  return {
    valid,
    sourceVersion: payload.appVersion,
    keysFound,
    keysKnown,
    keysUnknown,
    keysThatWouldChange,
    warnings,
    blockedReasons,
  };
}

export function applyLocalDataImport(
  raw: string,
  options: { allowOverwrite: boolean }
): LocalResetResult {
  const preview = previewLocalDataImport(raw);
  if (!preview.valid) {
    return {
      ok: false,
      message: preview.blockedReasons[0] ?? "Import bloqué.",
      keysRemoved: [],
    };
  }

  const parsed = parseImportJson(raw);
  if (!parsed.ok || !isExportPayload(parsed.payload)) {
    return { ok: false, message: "Payload invalide.", keysRemoved: [] };
  }

  if (typeof window === "undefined") {
    return { ok: false, message: "Import impossible côté serveur.", keysRemoved: [] };
  }

  const applied: string[] = [];

  for (const key of preview.keysKnown) {
    if (preview.keysThatWouldChange.includes(key) && !options.allowOverwrite) {
      continue;
    }

    const value = parsed.payload.data[key];
    if (value === undefined) continue;

    try {
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
      applied.push(key);
    } catch {
      return {
        ok: false,
        message: `Impossible d'écrire la clé ${key}.`,
        keysRemoved: applied,
      };
    }
  }

  if (applied.length === 0) {
    return {
      ok: false,
      message: "Aucune clé importée — vérifie la confirmation d'écrasement.",
      keysRemoved: [],
    };
  }

  return {
    ok: true,
    message: `${applied.length} clé(s) importée(s) localement. Recharge la page pour voir les changements.`,
    keysRemoved: applied,
  };
}
