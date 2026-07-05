export type {
  MissionOSPhase,
  MissionOSReadiness,
  MissionOSNextActionKind,
  MissionOSViewModel,
  MissionOSBuildInput,
  MissionOSTimelineItem,
} from "./types";

export {
  MISSION_OS_SAFETY_NOTE,
  MISSION_OS_SAFETY_NOTE_V31,
  MISSION_OS_PHASE_LABELS,
  MISSION_OS_READINESS_LABELS,
} from "./types";

export {
  computeProgressPercent,
  phaseFromNextStepType,
  MISSION_OS_PHASE_ORDER,
  phaseIndex,
} from "./missionOSProgress";

export {
  mapNextStepTypeToKind,
  readinessFromLifecycleStatus,
} from "./missionOSNextStep";

export {
  formatMissionOSForCopy,
  formatMissionOSShortSummary,
  formatReadinessLabel,
} from "./missionOSFormatter";

export {
  buildMissionOSViewModel,
  buildMissionOSViewModelForAction,
  buildMissionOSGuidanceHints,
} from "./missionOSViewModel";

export { enrichMissionOSCommandCenter } from "./missionOSCommandCenter";

export { mapViewModelToActionFlowStep, mapStageToFlowStepId } from "./missionOSActionFlow";
export type {
  ActionFlowStepId,
  ActionFlowStage,
  ActionFlowItemStatus,
} from "./missionOSActionFlow";
export {
  ACTION_FLOW_STAGES,
  ACTION_FLOW_STAGE_LABELS,
  ACTION_FLOW_STATUS_LABELS,
} from "./missionOSActionFlow";

export {
  buildActionFlowViewModel,
  pickPrimaryActionForFlow,
} from "./missionOSActionFlowViewModel";
export type {
  ActionFlowViewModel,
  ActionFlowStageItem,
  ActionFlowGroupedAction,
} from "./missionOSActionFlowViewModel";

export {
  detectMissionOSIntent,
  buildMissionOSConversationResponse,
} from "./missionOSConversation";

export type {
  MissionLearningSignal,
  MissionLearningViewModel,
  NextMissionRecommendationKind,
} from "./missionOSLearningTypes";
export {
  MISSION_LEARNING_SIGNAL_LABELS,
  NEXT_MISSION_KIND_LABELS,
  MISSION_LEARNING_SAFETY_NOTE,
} from "./missionOSLearningTypes";

export {
  buildMissionLearningViewModel,
  getRecentLearningSignals,
} from "./missionOSLearningLoop";
export type { BuildMissionLearningInput } from "./missionOSLearningLoop";

export {
  detectMissionLearningIntent,
  buildMissionLearningConversationResponse,
} from "./missionOSLearningConversation";

export { resolveNextMissionRecommendation } from "./missionOSNextMission";
export type { NextMissionRecommendation } from "./missionOSNextMission";

export const MISSION_OS_UX_LABELS = {
  bridge: "Passage mission → plan",
  workspace: "Espace d'action sécurisé",
  handoff: "Passation Cursor / humain",
  intake: "Rapport d'exécution",
  lifecycle: "Cycle complet",
  executionPlan: "Plan d'exécution",
  validate: "À valider",
} as const;
