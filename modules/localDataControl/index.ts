export type {
  LocalDataCategory,
  LocalDataExportPayload,
  LocalDataKeyDescriptor,
  LocalDataRecordSummary,
  LocalDataRiskLevel,
  LocalDataSnapshot,
  LocalImportPreview,
  LocalResetOption,
  LocalResetResult,
  LocalResetTarget,
  LocalSettings,
  SafetyMode,
  UiDensity,
} from "./types";

export {
  GIGI_DEV_VERSION,
  GIGI_RELEASE_VERSION,
  KNOWN_LOCAL_DATA_KEYS,
  LOCAL_DATA_SCHEMA_VERSION,
  findKeyDescriptor,
  isKnownExportableKey,
  listAllLocalStorageKeys,
} from "./localDataKeys";

export {
  buildLocalDataSnapshot,
  inspectLocalStorageKey,
  listUnknownGigiKeys,
} from "./localDataInspector";

export {
  buildLocalDataExport,
  downloadLocalDataExport,
  serializeLocalDataExport,
} from "./localDataExport";

export {
  applyLocalDataImport,
  parseImportJson,
  previewLocalDataImport,
} from "./localDataImportPreview";

export {
  LOCAL_RESET_CONFIRMATION_PHRASE,
  LOCAL_RESET_OPTIONS,
  executeLocalReset,
  getResetOption,
  isCoreStateKey,
  previewUltraResetKeys,
} from "./localDataReset";

export {
  LOCAL_SETTINGS_STORAGE_KEY,
  getDefaultLocalSettings,
  loadLocalSettings,
  patchLocalSettings,
  resetLocalSettings,
  saveLocalSettings,
} from "./localSettingsStore";

export {
  formatBytes,
  formatCategoryLabel,
  formatConfirmationLevelLabel,
  formatExportFilename,
  formatRiskLabel,
} from "./localDataFormatter";

export const LOCAL_DATA_SAFETY_LIMITS = [
  "Gigi n'exécute rien automatiquement.",
  "Aucune sync cloud depuis /settings.",
  "Aucun connecteur réel (GitHub, Gmail, n8n, etc.).",
  "Aucun paiement ni checkout.",
  "Aucune action sans validation manuelle.",
  "Import et reset uniquement sur action explicite.",
] as const;

export const LOCAL_DATA_USEFUL_LINKS = [
  { href: "/onboarding", label: "Démarrer avec Gigi" },
  { href: "/beta", label: "Parcours bêta" },
  { href: "/feedback", label: "Feedback local" },
  { href: "/landing", label: "Présentation" },
  { href: "/memory", label: "Mémoire locale" },
] as const;
