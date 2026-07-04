import type { ModuleHealthEntry } from "./types";

export function getReleaseModuleHealth(): ModuleHealthEntry[] {
  return [
    { module: "Mission du jour", version: "1.0", role: "core", note: "Promesse daily use — /" },
    { module: "Conversation", version: "1.0", role: "core", note: "Parler à Gigi — /conversation" },
    { module: "Daily Review", version: "0.6.1", role: "core", note: "Bilan read-only" },
    { module: "Mission Execution", version: "0.5.4", role: "core", note: "Complétion / report / rejet" },
    { module: "Historique", version: "1.0", role: "core", note: "/history" },
    { module: "Feedback local", version: "0.9", role: "core", note: "/feedback" },
    { module: "Agents", version: "0.6", role: "dry_run", note: "Dry-run only" },
    { module: "Automation", version: "0.7", role: "dry_run", note: "Dry-run only" },
    { module: "Integrations", version: "0.8", role: "dry_run", note: "GitHub plans only" },
    { module: "AI Brain", version: "0.5+", role: "optional", note: "Fallback local obligatoire" },
    { module: "Supabase", version: "0.4.x", role: "optional", note: "Non requis" },
  ];
}

export function formatReleaseModuleRole(role: ModuleHealthEntry["role"]): string {
  switch (role) {
    case "core":
      return "Core daily use";
    case "dry_run":
      return "Dry-run";
    case "optional":
      return "Optionnel";
    default:
      return role;
  }
}
