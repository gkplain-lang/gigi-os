import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { buildMissionLearningViewModel } from "./missionOSLearningLoop";
import { MISSION_OS_SAFETY_NOTE_V31 } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const LEARNING_KEYWORDS = [
  "qu est ce que gigi a appris",
  "quest ce que gigi a appris",
  "on a appris quoi",
  "c est quoi la suite",
  "c'est quoi la suite",
  "quelle prochaine mission",
  "est ce que c est fini",
  "est-ce que c'est fini",
  "est ce qu il faut corriger",
  "est-ce qu'il faut corriger",
  "qu est ce qui bloque",
  "qu'est-ce qui bloque",
  "resume l historique",
  "résume l'historique",
  "prochaine etape apres le rapport",
  "prochaine étape après le rapport",
  "apprentissage recent",
  "apprentissage récent",
  "gigi a appris",
  "la suite",
  "mission suivante",
];

export interface MissionLearningIntent {
  isMissionLearning: boolean;
}

export function detectMissionLearningIntent(objective: string): MissionLearningIntent {
  const norm = normalize(objective);
  const isMissionLearning = LEARNING_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isMissionLearning };
}

export interface MissionLearningConversationInput {
  projectId?: string;
  completedMissionIds?: string[];
}

export function buildMissionLearningConversationResponse(
  input: MissionLearningConversationInput = {}
): GigiConversationResponse {
  const vm = buildMissionLearningViewModel(input);

  return {
    intent: "mission_os",
    intentLabel: "Apprentissage & suite · V3.3",
    listen: `Résultat : ${vm.whatHappened} Apprentissage : ${vm.whatGigiLearned.slice(0, 120)}`,
    needsClarification: false,
    missionTitle: vm.recommendedNextMissionTitle ?? "Suite à définir",
    why: vm.whatGigiLearned,
    nextStep: vm.recommendedNextActionLabel,
    finalMessage: "Rien n'est automatique — tu choisis la mission et l'action.",
    missionOSGuidance: [
      `Ce que ça change : ${vm.whatChanged}`,
      vm.riskOrBlocker ? `Blocage : ${vm.riskOrBlocker}` : "",
      `Recommandation : ${vm.recommendationKindLabel}`,
      vm.safetyNote,
    ].filter(Boolean),
    missionOSPhaseLabel: vm.outcomeLabel,
    missionOSStepLabel: vm.recommendationKindLabel,
    missionOSNextActionLabel: vm.recommendedNextActionLabel,
    missionOSNextActionRoute: vm.recommendedNextActionRoute,
    missionOSReadinessLabel: vm.confidenceLabel,
    missionOSBlockedMessage: MISSION_OS_SAFETY_NOTE_V31,
    priorityProjectName: input.projectId,
  };
}
