export type MissionOSPhase =
  | "mission"
  | "preparation"
  | "manual_execution"
  | "report_return"
  | "learning"
  | "next_mission";

export type MissionOSReadiness =
  | "ready"
  | "needs_user_decision"
  | "needs_preparation"
  | "waiting_for_manual_execution"
  | "waiting_for_report"
  | "needs_review"
  | "needs_follow_up"
  | "learning_ready"
  | "unclear";

export type MissionOSNextActionKind =
  | "decide_mission"
  | "prepare_plan"
  | "validate_action"
  | "open_workspace"
  | "create_handoff"
  | "paste_report"
  | "apply_report"
  | "generate_review"
  | "create_follow_up"
  | "archive_learning"
  | "choose_next_mission"
  | "clarify";

export interface MissionOSViewModel {
  currentMissionTitle: string;
  currentMissionSummary: string;
  currentPhase: MissionOSPhase;
  readiness: MissionOSReadiness;
  progressPercent: number;
  currentStepLabel: string;
  currentStepDescription: string;
  nextActionLabel: string;
  nextActionRoute: string;
  nextActionKind: MissionOSNextActionKind;
  activeLifecycleId?: string;
  activeActionId?: string;
  activeProjectId?: string;
  safetyNote: string;
  learningSummary?: string;
  reasons: string[];
  risks: string[];
  updatedAt: string;
}

export interface MissionOSBuildInput {
  missionTitle: string;
  missionSummary?: string;
  missionId?: string;
  projectId?: string;
  missionStatus?: string;
}

export const MISSION_OS_SAFETY_NOTE =
  "Gigi ne vérifie pas le repo et n'exécute rien. Tu restes maître de chaque validation.";

export const MISSION_OS_PHASE_LABELS: Record<MissionOSPhase, string> = {
  mission: "Mission",
  preparation: "Préparation",
  manual_execution: "Exécution manuelle",
  report_return: "Retour d'exécution",
  learning: "Apprentissage",
  next_mission: "Suite",
};

export const MISSION_OS_READINESS_LABELS: Record<MissionOSReadiness, string> = {
  ready: "Prêt",
  needs_user_decision: "Décision attendue",
  needs_preparation: "Préparation en cours",
  waiting_for_manual_execution: "Exécution manuelle attendue",
  waiting_for_report: "Rapport attendu",
  needs_review: "Review à faire",
  needs_follow_up: "Suivi à préparer",
  learning_ready: "Apprentissage disponible",
  unclear: "Statut à clarifier",
};
