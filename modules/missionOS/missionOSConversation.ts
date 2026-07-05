import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { buildMissionOSGuidanceHints, buildMissionOSViewModel } from "./missionOSViewModel";
import { buildActionFlowViewModel } from "./missionOSActionFlowViewModel";
import {
  formatMissionOSForCopy,
  formatReadinessLabel,
} from "./missionOSFormatter";
import { MISSION_OS_SAFETY_NOTE_V31 } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MISSION_OS_KEYWORDS = [
  "qu est ce que je fais maintenant",
  "qu'est-ce que je fais maintenant",
  "je fais quoi",
  "quelle est ma prochaine action",
  "prochaine action",
  "ou j en suis",
  "où j'en suis",
  "pilote la mission",
  "ouvre le cycle",
  "mission du jour",
  "je suis perdu",
  "resume le flow",
  "résume le flow",
  "resume mon cycle",
  "résume mon cycle",
  "closed loop mission",
  "pilotage mission",
  "prochaine etape",
  "prochaine étape",
  "command center",
  "ou est l action",
  "où est l'action",
  "je dois cliquer ou",
  "je dois cliquer où",
  "ou cliquer",
  "où cliquer",
  "je suis dans les actions",
  "valider quoi",
  "rapport ou",
  "rapport où",
  "cycle ou",
  "cycle où",
  "passation cursor",
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
  projectName?: string;
  missionStatus?: string;
  missionConfidence?: number;
  missionImpact?: string;
}

export function buildMissionOSConversationResponse(
  objective: string,
  input: MissionOSConversationInput
): GigiConversationResponse {
  const vm = buildMissionOSViewModel(input);
  const flow = buildActionFlowViewModel();
  const norm = normalize(objective);
  const actionOriented = [
    "ou est l action",
    "je dois cliquer",
    "je suis dans les actions",
    "valider quoi",
    "rapport ou",
    "rapport où",
    "cycle ou",
    "cycle où",
    "passation cursor",
  ].some((k) => norm.includes(normalize(k)));

  const nextLabel = actionOriented && flow.primaryActionId ? flow.primaryCtaLabel : vm.primaryCtaLabel;
  const listenExtra = actionOriented
    ? ` Va sur /actions — ${flow.activeStageLabel} : ${flow.primaryCtaLabel}.`
    : "";

  return {
    intent: "mission_os",
    intentLabel: "Pilotage · Gigi V3",
    listen: `Mission : ${vm.currentMissionTitle}. Étape : ${flow.activeStageLabel}. Action : ${nextLabel}.${listenExtra}`,
    needsClarification: false,
    missionTitle: vm.currentMissionTitle,
    why: actionOriented ? flow.whyThisAction : vm.primaryReason,
    nextStep: nextLabel,
    finalMessage: "Une action. Aucun bruit. Tout reste manuel.",
    missionOSGuidance: [
      ...buildMissionOSGuidanceHints(),
      actionOriented ? "Ouvre /actions pour le bouton principal et les détails avancés." : "",
    ].filter(Boolean),
    missionOSSummaryText: formatMissionOSForCopy(vm),
    missionOSPhaseLabel: flow.activeStageLabel,
    missionOSStepLabel: flow.activeStatusLabel,
    missionOSNextActionLabel: nextLabel,
    missionOSNextActionRoute: actionOriented ? flow.primaryCtaRoute : vm.primaryCtaRoute,
    missionOSReadinessLabel: formatReadinessLabel(vm),
    missionOSBlockedMessage: MISSION_OS_SAFETY_NOTE_V31,
    priorityProjectName: input.projectId,
  };
}
