export type MissionDecisionStatus =
  | "draft"
  | "recommended"
  | "accepted"
  | "rejected"
  | "postponed"
  | "needs_clarification"
  | "converted_to_plan"
  | "archived";

export type MissionDecisionCandidateSource =
  | "project_mission"
  | "recommended_mission"
  | "action_queue"
  | "follow_up_action"
  | "manual"
  | "inferred";

export type MissionDecisionOutcome =
  | "accepted"
  | "rejected"
  | "postponed"
  | "clarified"
  | "converted"
  | "no_decision";

export type MissionDecisionReasonType =
  | "high_score"
  | "unblocker"
  | "urgent"
  | "low_risk"
  | "clear_validation"
  | "recurring_blocker"
  | "too_vague"
  | "too_large"
  | "missing_context"
  | "high_impact"
  | "follow_up_required"
  | "user_preference"
  | "manual_reason";

export type MissionDecisionSeverity = "info" | "positive" | "warning" | "critical";

export interface MissionDecisionReason {
  id: string;
  type: MissionDecisionReasonType;
  label: string;
  description: string;
  weight: number;
  severity: MissionDecisionSeverity;
  relatedSignalId?: string;
}

export interface MissionDecisionRisk {
  id: string;
  label: string;
  description: string;
  severity: MissionDecisionSeverity;
  mitigation?: string;
}

export interface MissionDecisionCandidate {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  missionId?: string;
  source: MissionDecisionCandidateSource;
  score: number;
  confidence: number;
  reasons: MissionDecisionReason[];
  risks: MissionDecisionRisk[];
  expectedImpact?: string;
  suggestedScope?: string;
  validationChecklist: string[];
  feedbackScoreId?: string;
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface MissionDecision {
  id: string;
  date: string;
  status: MissionDecisionStatus;
  selectedCandidateId?: string;
  candidates: MissionDecisionCandidate[];
  recommendationSummary: string;
  finalUserChoice?: string;
  userNote?: string;
  createdAt: string;
  updatedAt: string;
  decidedAt?: string;
  metadata?: Record<string, string>;
}

export interface MissionDecisionState {
  decisions: MissionDecision[];
  currentDecisionId?: string;
  generatedAt?: string;
  version: number;
}

export interface MissionDecisionGlobalSummary {
  totalDecisions: number;
  acceptedCount: number;
  recentChoice?: string;
  summaryText: string;
}

export interface MissionDecisionIntent {
  isMissionDecision: boolean;
  projectId: string | null;
}

export const MISSION_DECISION_STORAGE_KEY = "gigi-os-v26-mission-decision-center";
export const MISSION_DECISION_VERSION = 1;

export const MISSION_DECISION_DISCLAIMER =
  "Centre de décision local — Gigi recommande depuis tes données déclarées. Tu décides, sans vérification du repo ni sync cloud.";

export const MISSION_DECISION_STATUS_LABELS: Record<MissionDecisionStatus, string> = {
  draft: "Brouillon",
  recommended: "Recommandée",
  accepted: "Acceptée",
  rejected: "Refusée",
  postponed: "Reportée",
  needs_clarification: "À clarifier",
  converted_to_plan: "Convertie en plan",
  archived: "Archivée",
};
