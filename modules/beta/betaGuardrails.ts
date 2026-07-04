import type { BetaGuardrailsSummary, CriticalRoute } from "./types";

export const V09_NO_AUTO_EXTERNAL_MESSAGE =
  "V0.9 — bêta privée : aucune action externe automatique. Tout reste dry-run ou manuel.";

export const V09_PHASE_LABEL = "Bêta privée — usage testeurs invités uniquement";

export const FORBIDDEN_V09_REAL_ACTIONS = [
  "Exécution agent réelle",
  "Workflow n8n",
  "Appel GitHub API",
  "git commit / push / merge applicatif",
  "Gmail / Calendar",
  "Sync Supabase automatique",
  "Restore Supabase automatique",
  "Paiement / billing",
  "Landing page publique",
] as const;

export function getBetaGuardrails(): BetaGuardrailsSummary {
  return {
    externalActionsDisabled: true,
    dryRunOnly: true,
    n8nConnected: false,
    realIntegrationsDisabled: true,
    autoSyncDisabled: true,
    autoRestoreDisabled: true,
    confirmationRequired: true,
    localStoragePrimary: true,
  };
}

export function getCriticalRoutes(): CriticalRoute[] {
  return [
    { path: "/", label: "Accueil", role: "user" },
    { path: "/conversation", label: "Conversation Gigi", role: "user" },
    { path: "/brain", label: "Brain", role: "user" },
    { path: "/projects", label: "Projets", role: "user" },
    { path: "/history", label: "Historique", role: "user" },
    { path: "/memory", label: "Mémoire", role: "user" },
    { path: "/feedback", label: "Feedback bêta", role: "user" },
    { path: "/dev/ai", label: "Dev · AI", role: "dev" },
    { path: "/dev/execution", label: "Dev · Execution", role: "dev" },
    { path: "/dev/agents", label: "Dev · Agents", role: "dev" },
    { path: "/dev/daily-review", label: "Dev · Daily Review", role: "dev" },
    { path: "/dev/automation", label: "Dev · Automation", role: "dev" },
    { path: "/dev/integrations", label: "Dev · Integrations", role: "dev" },
    { path: "/dev/beta", label: "Dev · Beta", role: "dev" },
  ];
}

export const KNOWN_BETA_RISKS = [
  "OpenAI non configuré → réponses 100 % fallback local (comportement attendu).",
  "Supabase absent → pas de sync cloud (comportement attendu).",
  "Feedback stocké uniquement en localStorage — pas de backup cross-device.",
  "Intégrations GitHub = plans dry-run — pas de lecture repo réelle.",
  "Automatisations = intentions documentées — pas de cron ni webhook.",
] as const;

export const NEXT_BETA_VALIDATIONS = [
  "Tester onboarding complet avec un testeur invité.",
  "Valider 3 missions complétées de suite sans confusion UX.",
  "Collecter 5 feedbacks locaux minimum pendant la bêta.",
  "Vérifier /conversation sur mobile (layout basique).",
  "Confirmer qu'aucune clé n'apparaît dans le réseau (DevTools).",
  "Préparer V1.0 — daily use release après retours bêta.",
] as const;
