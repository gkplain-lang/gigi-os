export type DailyMissionReviewStatus =
  | "draft"
  | "ready_for_review"
  | "reviewed"
  | "continued"
  | "pivoted"
  | "completed_by_human"
  | "cancelled";

export type OutcomeStatus =
  | "completed"
  | "partially_done"
  | "blocked"
  | "skipped"
  | "unclear";

export type NextDecision =
  | "continue_same_mission"
  | "convert_to_guided_flow"
  | "choose_new_mission"
  | "pause_project"
  | "mark_complete"
  | "clarify_next_step";

export type MissionReviewSource = "daily_mission" | "guided_flow" | "manual" | "template";

export type MissionReviewAuditType =
  | "mission_review_created"
  | "mission_review_updated"
  | "mission_review_completed_by_human"
  | "mission_review_continued"
  | "mission_review_pivoted"
  | "mission_review_cancelled";

export interface MissionReviewAuditEntry {
  id: string;
  at: string;
  type: MissionReviewAuditType;
  message: string;
}

export interface DailyMissionReview {
  id: string;
  dailyPriorityMissionId?: string;
  missionCandidateId?: string;
  linkedGuidedFlowId?: string;
  projectId?: string;
  projectName?: string;
  title: string;
  missionTitle: string;
  reviewDate: string;
  status: DailyMissionReviewStatus;
  outcomeStatus: OutcomeStatus;
  progressLevel: number;
  completedByHuman: boolean;
  whatWasDone: string;
  blockers: string;
  learnings: string;
  nextDecision: NextDecision;
  nextMissionCandidateId?: string;
  recommendedNextAction: string;
  focusScore: number;
  createdAt: string;
  updatedAt: string;
  source: MissionReviewSource;
  auditTrail: MissionReviewAuditEntry[];
}

export interface MissionExecutionReflection {
  id: string;
  reviewId: string;
  title: string;
  summary: string;
  signal: string;
  recommendation: string;
  reason: string;
  createdAt: string;
}

export interface MissionReviewGlobalSummary {
  totalReviews: number;
  activeReviews: number;
  lastDecision?: NextDecision;
  completedByHumanCount: number;
  summaryText: string;
}

export interface MissionReviewTemplateDefinition {
  id: string;
  title: string;
  outcomeStatus: OutcomeStatus;
  nextDecision: NextDecision;
  signal: string;
  defaultWhatWasDone?: string;
  defaultBlockers?: string;
  defaultLearnings?: string;
}

export const REVIEW_STATUS_LABELS: Record<DailyMissionReviewStatus, string> = {
  draft: "Brouillon",
  ready_for_review: "Prête à revoir",
  reviewed: "Revu",
  continued: "Continuer",
  pivoted: "Pivoter",
  completed_by_human: "Terminée (humain)",
  cancelled: "Annulée",
};

export const OUTCOME_STATUS_LABELS: Record<OutcomeStatus, string> = {
  completed: "Terminée",
  partially_done: "Partielle",
  blocked: "Bloquée",
  skipped: "Passée",
  unclear: "Floue",
};

export const NEXT_DECISION_LABELS: Record<NextDecision, string> = {
  continue_same_mission: "Continuer la même mission",
  convert_to_guided_flow: "Convertir en parcours guidé",
  choose_new_mission: "Choisir une nouvelle mission",
  pause_project: "Mettre en pause",
  mark_complete: "Marquer terminée",
  clarify_next_step: "Clarifier la prochaine étape",
};
