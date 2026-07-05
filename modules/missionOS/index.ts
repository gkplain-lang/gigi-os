export type {
  MissionOSPhase,
  MissionOSReadiness,
  MissionOSNextActionKind,
  MissionOSViewModel,
  MissionOSBuildInput,
} from "./types";

export {
  MISSION_OS_SAFETY_NOTE,
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

export {
  detectMissionOSIntent,
  buildMissionOSConversationResponse,
} from "./missionOSConversation";

export const MISSION_OS_UX_LABELS = {
  bridge: "Passage mission → plan",
  workspace: "Espace d'action sécurisé",
  handoff: "Passation Cursor / humain",
  intake: "Rapport d'exécution",
  lifecycle: "Cycle complet",
  executionPlan: "Plan d'exécution",
  validate: "À valider",
} as const;
