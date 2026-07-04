import type { Project } from "@/modules/projects/projectTypes";

export interface ProjectMissionSuggestion {
  id: string;
  projectId: string;
  title: string;
  description: string;
  impact: number;
  effort: number;
  urgency: number;
  recommended: boolean;
  reason: string;
  suggestedTasks?: string[];
}

export interface ProjectRecommendedAction {
  action: string;
  whyNow: string;
  canIgnore: string;
}

export interface ProjectDetailSummary {
  score: number;
  whyItMatters: string;
  whyToday: string;
  whyNotToday?: string;
  recommendedAction: ProjectRecommendedAction;
}

export interface ProjectDetailContext {
  project: Project;
  summary: ProjectDetailSummary;
  missions: ProjectMissionSuggestion[];
  isMissionProject: boolean;
}
