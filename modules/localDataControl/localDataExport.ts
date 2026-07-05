import { BACKUP_KEY_PREFIX } from "@/modules/persistence/manualControls/constants";
import {
  findKeyDescriptor,
  GIGI_DEV_VERSION,
  isKnownExportableKey,
  listAllLocalStorageKeys,
  LOCAL_DATA_SCHEMA_VERSION,
} from "./localDataKeys";
import { formatExportFilename } from "./localDataFormatter";
import type { LocalDataExportPayload } from "./types";

function readExportableValue(key: string): unknown | null {
  if (typeof window === "undefined") return null;
  if (!isKnownExportableKey(key)) return null;

  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

export function buildLocalDataExport(): LocalDataExportPayload {
  const data: Record<string, unknown> = {};
  const keys: string[] = [];

  if (typeof window !== "undefined") {
    for (const key of listAllLocalStorageKeys()) {
      const descriptor = findKeyDescriptor(key);
      if (!descriptor?.exportable) continue;
      if (descriptor.keyPrefix && !key.startsWith(BACKUP_KEY_PREFIX)) continue;

      const value = readExportableValue(key);
      if (value === null && !localStorage.getItem(key)) continue;

      data[key] = value ?? localStorage.getItem(key);
      keys.push(key);
    }
  }

  return {
    schemaVersion: LOCAL_DATA_SCHEMA_VERSION,
    appVersion: GIGI_DEV_VERSION,
    exportedAt: new Date().toISOString(),
    source: "gigi-local-export",
    keys: keys.sort(),
    data,
  };
}

export function serializeLocalDataExport(pretty = true): string {
  const payload = buildLocalDataExport();
  return JSON.stringify(payload, null, pretty ? 2 : 0);
}

export function downloadLocalDataExport(): { ok: boolean; filename: string; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, filename: "", error: "Export impossible côté serveur." };
  }

  try {
    const filename = formatExportFilename();
    const json = serializeLocalDataExport(true);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    return { ok: true, filename };
  } catch {
    return { ok: false, filename: "", error: "Impossible de générer le fichier d'export." };
  }
}
