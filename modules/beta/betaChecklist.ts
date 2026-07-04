import type { BetaChecklistItem } from "./types";

/** Private beta readiness checklist — architectural guarantees + manual QA items. */
export function buildBetaChecklist(): BetaChecklistItem[] {
  return [
    {
      id: "build_ok",
      label: "Build production OK (npm run build)",
      category: "Stabilité",
      status: "manual",
      note: "Vérifier avant chaque release bêta.",
    },
    {
      id: "local_fallback",
      label: "Fallback local disponible sans OpenAI",
      category: "IA",
      status: "pass",
      note: "askAiBrain({ forceLocal: true }) — pipeline déterministe.",
    },
    {
      id: "local_memory",
      label: "Mémoire locale disponible (gigi-os-v03-state)",
      category: "Persistance",
      status: "pass",
      note: "localStorage source principale.",
    },
    {
      id: "supabase_optional",
      label: "Supabase non obligatoire",
      category: "Persistance",
      status: "pass",
      note: "App fonctionne sans Supabase configuré.",
    },
    {
      id: "ai_optional",
      label: "IA optionnelle",
      category: "IA",
      status: "pass",
      note: "Mode local_only si OPENAI non configuré côté serveur.",
    },
    {
      id: "no_exposed_keys",
      label: "Aucune clé IA exposée côté client",
      category: "Sécurité",
      status: "pass",
      note: "Pas de NEXT_PUBLIC pour clés OpenAI.",
    },
    {
      id: "actions_dry_run",
      label: "Actions agents — dry-run uniquement",
      category: "Agents",
      status: "pass",
      note: "V0.6 — exécution externe bloquée.",
    },
    {
      id: "automation_dry_run",
      label: "Automatisations — dry-run uniquement",
      category: "Automation",
      status: "pass",
      note: "V0.7 — n8n non branché, aucune programmation réelle.",
    },
    {
      id: "integrations_dry_run",
      label: "Intégrations — dry-run uniquement (GitHub alpha)",
      category: "Integrations",
      status: "pass",
      note: "V0.8 — aucune API GitHub, statut dry_run_only.",
    },
    {
      id: "restore_manual",
      label: "Restore Supabase — manuel seulement",
      category: "Persistance",
      status: "pass",
      note: "Dev controls — confirmation explicite requise.",
    },
    {
      id: "sync_manual",
      label: "Sync Supabase — manuel seulement",
      category: "Persistance",
      status: "pass",
      note: "Pas de sync automatique en V0.9.",
    },
    {
      id: "confirmation_required",
      label: "Confirmation obligatoire pour actions sensibles",
      category: "UX",
      status: "pass",
      note: "V0.6.2 — Action / Automation / Integration cards.",
    },
    {
      id: "dev_routes",
      label: "Routes dev disponibles",
      category: "Dev",
      status: "pass",
      note: "/dev/ai, agents, execution, daily-review, automation, integrations, beta.",
    },
    {
      id: "history_works",
      label: "Historique fonctionne",
      category: "Core",
      status: "manual",
      note: "Tester /history après missions complétées.",
    },
    {
      id: "daily_review",
      label: "Revue quotidienne fonctionne",
      category: "Core",
      status: "manual",
      note: "Demander bilan du jour dans /conversation.",
    },
    {
      id: "mission_execution",
      label: "Mission execution loop fonctionne",
      category: "Core",
      status: "manual",
      note: "Tester complétion / report / rejet dans /conversation.",
    },
  ];
}

export function countChecklistPassed(items: BetaChecklistItem[]): number {
  return items.filter((i) => i.status === "pass").length;
}

export function countChecklistManual(items: BetaChecklistItem[]): number {
  return items.filter((i) => i.status === "manual").length;
}
