import type { MissionStatus } from "@/modules/missions/missionTypes";
import type { DailyUseNextAction } from "@/modules/dailyUse/types";
import type { MissionActionLabels, SimulationNote } from "./types";

export const V13_PHASE_LABEL = "V1.3 — affinage usage quotidien";

export const SIMULATION_NOTE: SimulationNote = {
  short: "Mode simulation · local uniquement",
  long: "Aucune action externe réelle. Automatisations et intégrations restent en simulation.",
  pageHint: "Tout reste sur cet appareil — rien n'est envoyé automatiquement.",
};

export const REFINED_PAGE_META = {
  mission: {
    recommended: "Ta priorité du jour — le reste attend.",
    in_progress: "Une étape à la fois. Valide quand c'est fait.",
    completed: "Bien joué. Gigi peut proposer la suite.",
    resting: "Reprends quand tu veux, ou demande une autre priorité.",
  },
  conversation: "Dis où tu veux aller — Gigi te propose une seule mission.",
  brain: "Comprends pourquoi cette mission a été choisie.",
  projects: "Tes projets — la mission du jour est déjà sélectionnée.",
  history: "Ton activité récente avec Gigi.",
  memory: "Local d'abord. Sauvegarde cloud optionnelle, manuelle.",
  feedback: "Note une friction ou une idée — stockage local uniquement.",
} as const;

export const MISSION_ACTION_LABELS: MissionActionLabels = {
  start: "Démarrer",
  complete: "Mission terminée",
  postpone: "Reporter",
  reject: "Pas maintenant",
  inProgressHint: "Quand c'est fait, valide ici.",
  recommendedHint: "Une mission, une focus.",
};

export const SIDEBAR_LINK_LABELS = {
  talkToGigi: "Parler à Gigi",
  seeDecision: "Voir la décision",
  giveFeedback: "Donner un avis",
} as const;

export const CONVERSATION_LABELS = {
  applyMission: "Appliquer sur l'accueil",
  applyHint: "La mission apparaît sur l'accueil — démarre-la quand tu es prêt.",
  proposalTitle: "Mission proposée",
  emptyBanner: "Choisis une suggestion ou écris ta question.",
} as const;

export function getRefinedMissionPageMeta(status: MissionStatus): string {
  if (status === "in_progress") return REFINED_PAGE_META.mission.in_progress;
  if (status === "completed") return REFINED_PAGE_META.mission.completed;
  if (status === "postponed" || status === "rejected_for_now") {
    return REFINED_PAGE_META.mission.resting;
  }
  return REFINED_PAGE_META.mission.recommended;
}

export function getRefinedNextActionHint(status: MissionStatus): DailyUseNextAction {
  switch (status) {
    case "in_progress":
      return {
        label: "Maintenant",
        hint: "Avance sur tes tâches, puis valide la mission.",
        emphasis: "primary",
      };
    case "recommended":
      return {
        label: "Maintenant",
        hint: "Appuie sur Démarrer — ou parle à Gigi pour ajuster.",
        emphasis: "primary",
      };
    case "completed":
      return {
        label: "Ensuite",
        hint: "Bilan du jour ou prochaine mission via Gigi.",
        emphasis: "secondary",
      };
    case "postponed":
    case "rejected_for_now":
      return {
        label: "Reprendre",
        hint: "Demande une nouvelle priorité à Gigi.",
        emphasis: "secondary",
      };
    default:
      return {
        label: "Prochaine action",
        hint: "Parle à Gigi pour la suite.",
        emphasis: "neutral",
      };
  }
}
