import type { OnboardingGoalId, OnboardingState, WorkStyleId } from "./types";
import { getConversationAskHref } from "@/modules/dailyUse/dailyUseHints";

export const V14_PHASE_LABEL = "V1.4 — onboarding & first run";

export const ONBOARDING_PROMISE = "Ouvre Gigi. Sache quoi faire. Exécute.";

export const ONBOARDING_TAGLINE =
  "Gigi choisit chaque jour une mission prioritaire pour réduire la dispersion.";

export const ONBOARDING_NOT_TODO =
  "Gigi n'est pas une todo-list. Une seule mission compte — le reste attend.";

export const ONBOARDING_MISSION_LOGIC =
  "Gigi score tes projets actifs (urgence, clarté, impact) et te propose la meilleure action du moment.";

export const ONBOARDING_SIMULATION_NOTE =
  "Mode simulation · local uniquement. Aucune action externe réelle.";

export const ONBOARDING_BANNER = {
  title: "Configurer Gigi en 2 minutes",
  body: "Ajoute tes projets et obtiens ta première mission prioritaire.",
  cta: "Commencer",
} as const;

export const SIDEBAR_ONBOARDING_LABEL = "Premiers pas";

export const GOAL_OPTIONS: { id: OnboardingGoalId; label: string; hint: string }[] = [
  { id: "save_time", label: "Gagner du temps", hint: "Moins de dispersion, plus de focus." },
  { id: "advance_project", label: "Avancer un projet", hint: "Faire bouger ce qui compte." },
  { id: "launch_offer", label: "Lancer une offre", hint: "Passer de l'idée au lancement." },
  { id: "create_revenue", label: "Créer du revenu", hint: "Prioriser ce qui rapproche du cash." },
  { id: "structure_ideas", label: "Structurer mes idées", hint: "Clarifier avant d'agir." },
  { id: "other", label: "Autre", hint: "Tu précises toi-même." },
];

export const WORK_STYLE_OPTIONS: { id: WorkStyleId; label: string; hint: string }[] = [
  { id: "short", label: "Courte", hint: "15–30 min, une action nette." },
  { id: "deep", label: "Profonde", hint: "1–2 h de focus sans interruption." },
  { id: "fast", label: "Rapide", hint: "Petites victoires, momentum immédiat." },
  { id: "strategic", label: "Stratégique", hint: "Décisions structurantes, pas le bruit." },
];

const GOAL_LABELS: Record<OnboardingGoalId, string> = Object.fromEntries(
  GOAL_OPTIONS.map((o) => [o.id, o.label])
) as Record<OnboardingGoalId, string>;

const WORK_STYLE_LABELS: Record<WorkStyleId, string> = Object.fromEntries(
  WORK_STYLE_OPTIONS.map((o) => [o.id, o.label])
) as Record<WorkStyleId, string>;

export function buildFirstMissionConversationPrompt(onboarding: OnboardingState): string {
  const goal =
    onboarding.primaryGoal === "other" && onboarding.customGoal?.trim()
      ? onboarding.customGoal.trim()
      : onboarding.primaryGoal
        ? GOAL_LABELS[onboarding.primaryGoal]
        : "avancer sur mes projets";

  const style = onboarding.workStyle ? WORK_STYLE_LABELS[onboarding.workStyle] : "équilibré";

  return `Gigi, propose ma première mission à partir de mes projets et objectifs. Mon objectif principal : ${goal}. Style de mission préféré : ${style}.`;
}

export function getOnboardingConversationHref(onboarding: OnboardingState): string {
  return getConversationAskHref(buildFirstMissionConversationPrompt(onboarding));
}
