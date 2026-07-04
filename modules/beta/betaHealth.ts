import type { ModuleHealthEntry } from "./types";

export function getKeyModulesHealth(): ModuleHealthEntry[] {
  return [
    {
      module: "Mission Execution",
      version: "0.5.4",
      status: "ready",
      note: "Boucle complétion / report / rejet — local only.",
    },
    {
      module: "Agents Foundation",
      version: "0.6",
      status: "dry_run_only",
      note: "Action Proposals — aucune exécution externe.",
    },
    {
      module: "Daily Review",
      version: "0.6.1",
      status: "read_only",
      note: "Snapshot read-only, pas de sync.",
    },
    {
      module: "Action Confirmation UX",
      version: "0.6.2",
      status: "ready",
      note: "Confirmation locale dry-run.",
    },
    {
      module: "Automation Preparation",
      version: "0.7",
      status: "dry_run_only",
      note: "Plans uniquement — n8n non branché.",
    },
    {
      module: "Integrations Alpha",
      version: "0.8",
      status: "dry_run_only",
      note: "GitHub plans — API désactivée.",
    },
    {
      module: "AI Brain",
      version: "0.5+",
      status: "optional",
      note: "OpenAI optionnel, fallback local obligatoire.",
    },
    {
      module: "Supabase",
      version: "0.4.x",
      status: "optional",
      note: "Auth/sync optionnels — localStorage principal.",
    },
  ];
}

export function formatModuleStatusLabel(
  status: ModuleHealthEntry["status"]
): string {
  switch (status) {
    case "ready":
      return "Prêt";
    case "dry_run_only":
      return "Dry-run only";
    case "read_only":
      return "Read-only";
    case "optional":
      return "Optionnel";
    default:
      return status;
  }
}
