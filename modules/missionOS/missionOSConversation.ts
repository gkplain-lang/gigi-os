import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { buildMissionOSGuidanceHints, buildMissionOSViewModel } from "./missionOSViewModel";
import {
  formatMissionOSForCopy,
  formatMissionOSShortSummary,
  formatReadinessLabel,
} from "./missionOSFormatter";
import { MISSION_OS_SAFETY_NOTE, MISSION_OS_PHASE_LABELS } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MISSION_OS_KEYWORDS = [
  "qu est ce que je fais maintenant",
  "qu'est-ce que je fais maintenant",
  "quelle est ma prochaine action",
  "ou j en suis",
  "où j'en suis",
  "pilote la mission",
  "ouvre le cycle",
  "mission du jour",
  "je suis perdu",
  "resume le flow",
  "résume le flow",
  "closed loop mission",
  "pilotage mission",
  "prochaine etape",
  "prochaine étape",
];

export interface MissionOSIntent {
  isMissionOS: boolean;
}

export function detectMissionOSIntent(objective: string): MissionOSIntent {
  const norm = normalize(objective);
  const isMissionOS = MISSION_OS_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isMissionOS };
}

export interface MissionOSConversationInput {
  missionTitle: string;
  missionSummary?: string;
  missionId?: string;
  projectId?: string;
  missionStatus?: string;
}

export function buildMissionOSConversationResponse(
  objective: string,
  input: MissionOSConversationInput
): GigiConversationResponse {
  const vm = buildMissionOSViewModel(input);

  return {
    intent: "mission_os",
    intentLabel: `Pilotage mission · ${MISSION_OS_PHASE_LABELS[vm.currentPhase]}`,
    listen: formatMissionOSShortSummary(vm),
    needsClarification: false,
    missionTitle: vm.currentMissionTitle,
    why: vm.reasons[0],
    nextStep: vm.nextActionLabel,
    finalMessage: "Une action. Aucun bruit. Tout reste manuel.",
    missionOSGuidance: buildMissionOSGuidanceHints(),
    missionOSSummaryText: formatMissionOSForCopy(vm),
    missionOSPhaseLabel: MISSION_OS_PHASE_LABELS[vm.currentPhase],
    missionOSStepLabel: vm.currentStepLabel,
    missionOSNextActionLabel: vm.nextActionLabel,
    missionOSNextActionRoute: vm.nextActionRoute,
    missionOSReadinessLabel: formatReadinessLabel(vm),
    missionOSBlockedMessage: MISSION_OS_SAFETY_NOTE,
    priorityProjectName: input.projectId,
  };
}
