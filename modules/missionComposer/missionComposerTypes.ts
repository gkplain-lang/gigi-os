import type { ExecutionRiskLevel } from "@/modules/executionReadiness/types";

export type MissionCandidateStatus =
  | "suggested"
  | "shortlisted"
  | "selected_for_today"
  | "converted_to_guided_flow"
  | "dismissed"
  | "archived";

export type DailyPriorityMissionStatus =
  | "selected"
  | "in_progress"
  | "converted_to_guided_flow"
  | "completed_by_human"
  | "cancelled";

export type MissionCandidateSource = "template" | "project" | "manual" | "composer";

export type MissionCategory =
  | "focus"
  | "execution"
  | "planning"
  | "code"
  | "review"
  | "strategy";

export type MissionComposerAuditType =
  | "mission_candidate_created"
  | "daily_priority_selected"
  | "mission_converted_to_guided_flow"
  | "daily_priority_completed_by_human"
  | "daily_priority_cancelled"
  | "mission_candidate_status_change";

export interface MissionComposerAuditEntry {
  id: string;
  at: string;
  type: MissionComposerAuditType;
  message: string;
}

export interface ProjectMissionCandidate {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  outcome: string;
  reason: string;
  priorityScore: number;
  urgency: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  effort: "low" | "medium" | "high";
  riskLevel: ExecutionRiskLevel;
  category: MissionCategory;
  suggestedGuidedActionTemplateId?: string;
  suggestedRoute: string;
  createdAt: string;
  updatedAt: string;
  source: MissionCandidateSource;
  status: MissionCandidateStatus;
  auditTrail: MissionComposerAuditEntry[];
}

export interface DailyPriorityMission {
  id: string;
  missionCandidateId: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  outcome: string;
  selectedReason: string;
  selectedAt: string;
  status: DailyPriorityMissionStatus;
  linkedGuidedFlowId?: string;
  auditTrail: MissionComposerAuditEntry[];
}

export interface MissionComposerGlobalSummary {
  totalCandidates: number;
  activeCandidates: number;
  hasDailyMission: boolean;
  dailyMissionTitle?: string;
  convertedCount: number;
  summaryText: string;
}

export interface MissionComposerTemplateDefinition {
  id: string;
  title: string;
  description: string;
  outcome: string;
  reason: string;
  category: MissionCategory;
  urgency: ProjectMissionCandidate["urgency"];
  impact: ProjectMissionCandidate["impact"];
  effort: ProjectMissionCandidate["effort"];
  riskLevel: ExecutionRiskLevel;
  suggestedGuidedActionTemplateId?: string;
  suggestedRoute: string;
}

export const MISSION_CANDIDATE_STATUS_LABELS: Record<MissionCandidateStatus, string> = {
  suggested: "Suggérée",
  shortlisted: "Présélectionnée",
  selected_for_today: "Mission du jour",
  converted_to_guided_flow: "→ Parcours guidé",
  dismissed: "Écartée",
  archived: "Archivée",
};

export const DAILY_MISSION_STATUS_LABELS: Record<DailyPriorityMissionStatus, string> = {
  selected: "Choisie",
  in_progress: "En cours",
  converted_to_guided_flow: "Parcours guidé",
  completed_by_human: "Terminée (humain)",
  cancelled: "Annulée",
};

export const MISSION_CATEGORY_LABELS: Record<MissionCategory, string> = {
  focus: "Focus",
  execution: "Exécution préparée",
  planning: "Planification",
  code: "Code",
  review: "Revue",
  strategy: "Stratégie",
};
