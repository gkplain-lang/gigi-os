import { BACKUP_KEY_PREFIX } from "@/modules/persistence/manualControls/constants";
import {
  findKeyDescriptor,
  GIGI_DEV_VERSION,
  KNOWN_LOCAL_DATA_KEYS,
  listAllLocalStorageKeys,
} from "./localDataKeys";
import { formatRiskLabel } from "./localDataFormatter";
import type { LocalDataRecordSummary, LocalDataSnapshot } from "./types";

function estimateItemCount(key: string, raw: string): number | undefined {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (Array.isArray(parsed)) return parsed.length;
    for (const field of ["actions", "entries", "items", "feedback", "projects", "history"]) {
      const value = parsed[field];
      if (Array.isArray(value)) return value.length;
    }
    if (parsed.previousState && typeof parsed.previousState === "object") return 1;
  } catch {
    return undefined;
  }
  return undefined;
}

function summarizeKey(key: string, raw: string | null): LocalDataRecordSummary {
  const descriptor =
    findKeyDescriptor(key) ??
    ({
      key,
      label: key,
      description: "Clé non cataloguée — traitée avec prudence.",
      ownerModule: "unknown",
      version: "?",
      category: "optional",
      riskLevel: "high",
      exportable: false,
      resettable: false,
      dangerousToReset: true,
    } as const);

  const sizeBytes = raw ? new Blob([raw]).size : 0;

  return {
    key,
    exists: raw !== null,
    sizeBytes,
    itemCount: raw ? estimateItemCount(key, raw) : undefined,
    exportable: descriptor.exportable,
    resettable: descriptor.resettable,
    riskLabel: formatRiskLabel(descriptor.riskLevel),
    label: descriptor.label,
    description: descriptor.description,
    ownerModule: descriptor.ownerModule,
    category: descriptor.category,
  };
}

export function inspectLocalStorageKey(key: string): LocalDataRecordSummary {
  if (typeof window === "undefined") {
    return summarizeKey(key, null);
  }
  return summarizeKey(key, localStorage.getItem(key));
}

export function buildLocalDataSnapshot(): LocalDataSnapshot {
  if (typeof window === "undefined") {
    return {
      generatedAt: new Date().toISOString(),
      appVersion: GIGI_DEV_VERSION,
      keys: [],
      totalSizeBytes: 0,
      presentCount: 0,
      exportableCount: 0,
    };
  }

  const presentKeys = listAllLocalStorageKeys();
  const catalogKeys = KNOWN_LOCAL_DATA_KEYS.filter((d) => !d.keyPrefix).map((d) => d.key);
  const backupKeys = presentKeys.filter((k) => k.startsWith(BACKUP_KEY_PREFIX));

  const keysToSummarize = Array.from(
    new Set([...catalogKeys, ...backupKeys, ...presentKeys.filter((k) => k.startsWith("gigi-os-"))])
  ).sort();

  const keys = keysToSummarize.map((key) =>
    summarizeKey(key, localStorage.getItem(key))
  );

  const present = keys.filter((k) => k.exists);
  const totalSizeBytes = present.reduce((sum, k) => sum + k.sizeBytes, 0);

  return {
    generatedAt: new Date().toISOString(),
    appVersion: GIGI_DEV_VERSION,
    keys,
    totalSizeBytes,
    presentCount: present.length,
    exportableCount: present.filter((k) => k.exportable).length,
  };
}

export function listUnknownGigiKeys(): string[] {
  return listAllLocalStorageKeys().filter((key) => {
    if (!key.startsWith("gigi-os-")) return false;
    return findKeyDescriptor(key) === null;
  });
}
