import type { LocalSettings } from "./types";

export const LOCAL_SETTINGS_STORAGE_KEY = "gigi-os-v37-local-settings";

export const LOCAL_RESET_CONFIRMATION_PHRASE = "RESET GIGI LOCAL";

const DEFAULT_SETTINGS: LocalSettings = {
  uiDensity: "comfortable",
  safetyMode: "normal",
  showBetaHints: true,
  showSafetyReminders: true,
  lastOpenedSection: null,
  updatedAt: new Date(0).toISOString(),
};

function isLocalSettings(value: unknown): value is LocalSettings {
  if (!value || typeof value !== "object") return false;
  const v = value as LocalSettings;
  return (
    (v.uiDensity === "comfortable" || v.uiDensity === "compact") &&
    (v.safetyMode === "normal" || v.safetyMode === "strict") &&
    typeof v.showBetaHints === "boolean" &&
    typeof v.showSafetyReminders === "boolean"
  );
}

export function loadLocalSettings(): LocalSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };

  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as unknown;
    if (!isLocalSettings(parsed)) return { ...DEFAULT_SETTINGS };
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      lastOpenedSection:
        typeof parsed.lastOpenedSection === "string" ? parsed.lastOpenedSection : null,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveLocalSettings(settings: LocalSettings): void {
  if (typeof window === "undefined") return;
  const next: LocalSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_SETTINGS_STORAGE_KEY, JSON.stringify(next));
}

export function patchLocalSettings(patch: Partial<LocalSettings>): LocalSettings {
  const current = loadLocalSettings();
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  saveLocalSettings(next);
  return next;
}

export function resetLocalSettings(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_SETTINGS_STORAGE_KEY);
}

export function getDefaultLocalSettings(): LocalSettings {
  return { ...DEFAULT_SETTINGS };
}
