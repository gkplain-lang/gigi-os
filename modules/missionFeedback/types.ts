export type MissionFeedbackSignalType =
  | "unblocker"
  | "recurring_blocker"
  | "too_vague"
  | "often_abandoned"
  | "often_completed"
  | "needs_smaller_scope"
  | "needs_clearer_validation"
  | "high_impact"
  | "low_impact"
  | "follow_up_required"
  | "documentation_needed"
  | "test_required"
  | "manual_review_required";

export type MissionFeedbackSignalSeverity = "info" | "positive" | "warning" | "critical";

export type MissionFeedbackSource =
  | "history_learning"
  | "execution_review"
  | "follow_up_action"
  | "manual"
  | "inferred";

export type MissionRecommendationDecision =
  | "strongly_recommended"
  | "recommended"
  | "neutral"
  | "not_recommended"
  | "needs_clarification";

export type ManualMissionFeedbackSentiment =
  | "useful"
  | "not_useful"
  | "too_big"
  | "too_vague"
  | "blocked"
  | "completed";

export interface MissionFeedbackSignal {
  id: string;
  type: MissionFeedbackSignalType;
  severity: MissionFeedbackSignalSeverity;
  source: MissionFeedbackSource;
  label: string;
  description: string;
  projectId?: string;
  missionId?: string;
  relatedHistoryEntryId?: string;
  relatedActionId?: string;
  confidence: number;
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface MissionRecommendationScore {
  missionId: string;
  projectId?: string;
  score: number;
  decision: MissionRecommendationDecision;
  reasons: string[];
  risks: string[];
  suggestedRefinement?: string;
  confidence: number;
  updatedAt: string;
}

export interface ManualMissionFeedback {
  id: string;
  missionId?: string;
  projectId?: string;
  note: string;
  sentiment: ManualMissionFeedbackSentiment;
  createdAt: string;
}

export interface MissionFeedbackState {
  signals: MissionFeedbackSignal[];
  scores: MissionRecommendationScore[];
  manualFeedback: ManualMissionFeedback[];
  generatedAt?: string;
  version: number;
}

export interface MissionFeedbackGlobalSummary {
  totalSignals: number;
  totalScores: number;
  topRecommendedMissionId?: string;
  topRecommendedTitle?: string;
  recurringBlockers: string[];
  summaryText: string;
}

export interface MissionFeedbackIntent {
  isMissionFeedback: boolean;
  projectId: string | null;
}

export interface ScoreableMission {
  missionId: string;
  projectId: string;
  title: string;
}

export const MISSION_FEEDBACK_STORAGE_KEY = "gigi-os-v25-mission-feedback-loop";
export const MISSION_FEEDBACK_VERSION = 1;

export const MISSION_FEEDBACK_DISCLAIMER =
  "Feedback mission local uniquement — basé sur l'historique V2.4 et tes déclarations manuelles, sans vérification du repo ni sync cloud.";

export const MISSION_DECISION_LABELS: Record<MissionRecommendationDecision, string> = {
  strongly_recommended: "Fortement recommandée",
  recommended: "Recommandée",
  neutral: "Neutre",
  needs_clarification: "À clarifier",
  not_recommended: "Non recommandée",
};

export const MANUAL_SENTIMENT_LABELS: Record<ManualMissionFeedbackSentiment, string> = {
  useful: "Utile",
  not_useful: "Peu utile",
  too_big: "Trop grande",
  too_vague: "Trop floue",
  blocked: "Bloquée",
  completed: "Terminée",
};
