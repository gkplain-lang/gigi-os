import type { LocalDataRiskLevel } from "./types";

export function formatRiskLabel(level: LocalDataRiskLevel): string {
  switch (level) {
    case "low":
      return "Faible";
    case "medium":
      return "Modéré";
    case "high":
      return "Élevé";
    case "critical":
      return "Critique";
  }
}

export function formatCategoryLabel(category: string): string {
  switch (category) {
    case "core":
      return "Cœur";
    case "backup":
      return "Backup";
    case "memory":
      return "Mémoire";
    case "feedback":
      return "Feedback";
    case "execution":
      return "Exécution";
    case "mission":
      return "Mission";
    case "settings":
      return "Réglages";
    case "optional":
      return "Optionnel";
    default:
      return category;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 o";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}

export function formatExportFilename(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `gigi-local-export-v3-7-${y}-${m}-${d}.json`;
}

export function formatConfirmationLevelLabel(level: "simple" | "strong" | "ultra"): string {
  switch (level) {
    case "simple":
      return "Confirmation simple";
    case "strong":
      return "Confirmation forte";
    case "ultra":
      return "Ultra-confirmation";
  }
}
