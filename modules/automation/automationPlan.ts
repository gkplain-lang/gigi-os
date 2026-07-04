import { DRY_RUN_AUTOMATION_LABELS } from "./automationRegistry";
import type { AutomationProposal, AutomationType, TriggerType } from "./types";

const PLAN_STEPS: Partial<Record<AutomationType, string[]>> = {
  daily_review_reminder: [
    "Définir déclencheur : chaque matin (simulation)",
    "Lire état local et historique récent",
    "Produire bilan + mission du jour (dry-run)",
    "Aucune notification externe envoyée",
  ],
  weekly_project_review: [
    "Planifier revue hebdomadaire (simulation)",
    "Analyser projets actifs et stale",
    "Générer checklist de priorités",
    "Utilisateur valide manuellement",
  ],
  buildy_crafts_library_update_plan: [
    "Lister assets à mettre à jour",
    "Proposer calendrier hebdomadaire (simulation)",
    "Checklist validation locale",
    "Aucune modification externe",
  ],
  n8n_agent_plan: [
    "Documenter déclencheur manuel",
    "Lister étapes workflow sans connexion n8n",
    "Définir garde-fous V0.8+",
    "Plan uniquement — n8n non branché",
  ],
  project_stale_check: [
    "Scanner projets sans activité récente",
    "Produire alerte locale (simulation)",
    "Suggérer mission de rattrapage",
    "Pas de surveillance externe",
  ],
  content_publication_plan: [
    "Documenter la demande de publication auto",
    "Proposer workflow manuel alternatif",
    "Bloquer exécution réelle V0.7",
  ],
  publish_video: [
    "Plan publication manuelle documenté",
    "Aucune API vidéo appelée",
    "Confirmation utilisateur requise pour V0.8+",
  ],
};

export function buildAutomationSteps(
  type: AutomationType,
  triggerDescription: string
): string[] {
  const base = PLAN_STEPS[type] ?? [
    "Analyser la demande d'automatisation",
    `Déclencheur simulé : ${triggerDescription}`,
    "Produire plan dry-run local",
    "Attendre confirmation — aucune exécution",
  ];
  return base;
}

export function buildExpectedOutcome(type: AutomationType): string {
  const label =
    DRY_RUN_AUTOMATION_LABELS[type as keyof typeof DRY_RUN_AUTOMATION_LABELS] ?? type;
  return `[Dry-run plan] ${label} — plan documenté localement, zéro exécution automatique.`;
}

export function inferTriggerType(message: string): TriggerType {
  const norm = message.toLowerCase();
  if (/tous les matins|chaque matin|tous les jours|chaque jour|hebdo|semaine|mensuel/.test(norm)) {
    return "schedule";
  }
  if (/quand|si |dès que|surveille|alerte/.test(norm)) {
    return "condition";
  }
  if (/arrive|événement|event/.test(norm)) {
    return "event";
  }
  return "manual";
}

export function describeTrigger(type: TriggerType, message: string): string {
  switch (type) {
    case "schedule":
      return "Fréquence planifiée (simulation — non programmée en V0.7)";
    case "condition":
      return "Condition déclenchée (simulation — non surveillée en V0.7)";
    case "event":
      return "Événement externe (simulation — non écouté en V0.7)";
    default:
      return "Déclenchement manuel uniquement";
  }
}

export function blockedActionsForType(type: AutomationType): string[] {
  return [
    "Exécution n8n",
    "Appels Gmail / Calendar",
    "GitHub API / push / merge",
    "Sync / restore Supabase",
    "Publication ou envoi automatique",
  ];
}
