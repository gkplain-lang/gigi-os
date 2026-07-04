import type { ActionPlanEffort } from "./types";

export function effortFromScore(score: number): ActionPlanEffort {
  if (score <= 3) return "low";
  if (score <= 6) return "medium";
  return "high";
}

export function confidenceForPlan(hasRule: boolean, missionRecommended?: boolean): number {
  if (hasRule && missionRecommended) return 0.88;
  if (hasRule) return 0.82;
  return 0.58;
}

export const ACTION_PLAN_DRY_RUN_MESSAGE =
  "Je ne fais aucune action réelle sans validation. Ce plan est une préparation locale uniquement.";

export const VALIDATION_DEFAULTS = [
  "Aucune modification de fichier sans ton accord explicite",
  "Aucune branche Git créée automatiquement",
  "Aucun appel externe ou agent lancé",
];

export const PREPARED_ACTION_LABELS: Record<string, string> = {
  cursor_prompt: "Prompt Cursor",
  file_draft: "Brouillon de fichier",
  branch_plan: "Plan de branche Git",
  checklist: "Checklist",
  research_plan: "Plan de recherche",
  content_plan: "Plan de contenu",
  manual_task: "Tâche manuelle",
};
