import type { MissionReviewTemplateDefinition } from "./missionReviewTypes";

export const MISSION_REVIEW_TEMPLATES: MissionReviewTemplateDefinition[] = [
  {
    id: "mission-completed",
    title: "Mission terminée",
    outcomeStatus: "completed",
    nextDecision: "mark_complete",
    signal: "Focus gagné — mission du jour bouclée.",
    defaultWhatWasDone: "Mission accomplie selon mon évaluation locale.",
    defaultLearnings: "Clarté sur la prochaine priorité demain.",
  },
  {
    id: "partially-advanced",
    title: "Mission partiellement avancée",
    outcomeStatus: "partially_done",
    nextDecision: "continue_same_mission",
    signal: "Progression incomplète — continuer demain.",
    defaultWhatWasDone: "Avancement partiel sur la mission du jour.",
    defaultBlockers: "Temps ou contexte insuffisant.",
  },
  {
    id: "mission-blocked",
    title: "Mission bloquée",
    outcomeStatus: "blocked",
    nextDecision: "clarify_next_step",
    signal: "Blocage à résoudre avant de continuer.",
    defaultBlockers: "Dépendance ou décision manquante.",
  },
  {
    id: "mission-unclear",
    title: "Mission trop floue",
    outcomeStatus: "unclear",
    nextDecision: "choose_new_mission",
    signal: "Manque de clarté — repartir du composer.",
    defaultLearnings: "Besoin d'une mission plus précise.",
  },
  {
    id: "convert-guided",
    title: "Mission à convertir en parcours guidé",
    outcomeStatus: "partially_done",
    nextDecision: "convert_to_guided_flow",
    signal: "Action structurée nécessaire via parcours V4.6.",
    defaultWhatWasDone: "Intention claire, exécution à structurer.",
  },
];

export function getMissionReviewTemplate(id: string): MissionReviewTemplateDefinition | undefined {
  return MISSION_REVIEW_TEMPLATES.find((t) => t.id === id);
}

/** Suggestions UI-only — non persistées automatiquement. */
export function getStaticReviewSuggestions(): MissionReviewTemplateDefinition[] {
  return MISSION_REVIEW_TEMPLATES.slice(0, 3);
}
