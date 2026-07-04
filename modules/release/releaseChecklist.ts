import type { ReleaseChecklistItem } from "./types";

export function buildReleaseChecklist(): ReleaseChecklistItem[] {
  return [
    {
      id: "build_ok",
      label: "Build production OK (npm run build)",
      category: "Stabilité",
      status: "manual",
      note: "Vérifier avant usage quotidien.",
    },
    {
      id: "mission_today",
      label: "Mission du jour disponible (/)",
      category: "Daily use",
      status: "pass",
      note: "MissionPageContent + execution loop V0.5.4.",
    },
    {
      id: "conversation",
      label: "Conversation disponible (/conversation)",
      category: "Daily use",
      status: "pass",
    },
    {
      id: "daily_review",
      label: "Revue quotidienne disponible",
      category: "Daily use",
      status: "pass",
      note: "Demander bilan du jour — V0.6.1 read-only.",
    },
    {
      id: "history",
      label: "Historique disponible (/history)",
      category: "Daily use",
      status: "pass",
    },
    {
      id: "projects",
      label: "Projets disponibles (/projects)",
      category: "Daily use",
      status: "pass",
    },
    {
      id: "memory",
      label: "Mémoire locale disponible (/memory)",
      category: "Daily use",
      status: "pass",
      note: "localStorage gigi-os-v03-state.",
    },
    {
      id: "feedback",
      label: "Feedback local disponible (/feedback)",
      category: "Daily use",
      status: "pass",
      note: "V0.9 — localStorage uniquement.",
    },
    {
      id: "local_fallback",
      label: "Fallback local sans OpenAI",
      category: "IA",
      status: "pass",
    },
    {
      id: "ai_optional",
      label: "IA optionnelle",
      category: "IA",
      status: "pass",
    },
    {
      id: "supabase_optional",
      label: "Supabase non obligatoire",
      category: "Persistance",
      status: "pass",
    },
    {
      id: "no_auto_external",
      label: "Aucune action externe automatique",
      category: "Sécurité",
      status: "pass",
    },
    {
      id: "actions_dry_run",
      label: "Actions dry-run (V0.6)",
      category: "Garde-fous",
      status: "pass",
    },
    {
      id: "automation_dry_run",
      label: "Automatisations dry-run (V0.7)",
      category: "Garde-fous",
      status: "pass",
    },
    {
      id: "integrations_dry_run",
      label: "Intégrations dry-run (V0.8)",
      category: "Garde-fous",
      status: "pass",
    },
    {
      id: "confirmation_ux",
      label: "Confirmation UX active (V0.6.2)",
      category: "Garde-fous",
      status: "pass",
    },
    {
      id: "dev_routes",
      label: "Routes dev disponibles",
      category: "Dev",
      status: "pass",
      note: "Inclut /dev/release.",
    },
    {
      id: "mission_loop_manual",
      label: "Mission execution loop validé manuellement",
      category: "Daily use",
      status: "manual",
      note: "Compléter / reporter / rejeter une mission.",
    },
  ];
}

export function countReleasePassed(items: ReleaseChecklistItem[]): number {
  return items.filter((i) => i.status === "pass").length;
}

export function countReleaseManual(items: ReleaseChecklistItem[]): number {
  return items.filter((i) => i.status === "manual").length;
}
