import type { ProjectStatus } from "@/modules/projects/projectTypes";

export type ProjectCommandStatus =
  | "active"
  | "waiting_action"
  | "blocked"
  | "needs_clarification"
  | "learning_ready"
  | "no_next_step"
  | "archived";

export type ProjectPriorityLevel = "high" | "medium" | "low" | "unclear";

export type ProjectCommandFilterId =
  | "all"
  | "active"
  | "with_action"
  | "blocked"
  | "needs_clarification"
  | "archived";

export interface ProjectCommandFilter {
  id: ProjectCommandFilterId;
  label: string;
}

export interface ProjectCommandCard {
  projectId: string;
  projectName: string;
  summary: string;
  projectStatus: ProjectStatus;
  status: ProjectCommandStatus;
  statusLabel: string;
  priority: ProjectPriorityLevel;
  priorityLabel: string;
  nextMissionTitle?: string;
  nextMissionReason?: string;
  activeActionTitle?: string;
  activeActionRoute?: string;
  learningSummary?: string;
  blockerLabel?: string;
  lastActivityLabel?: string;
  primaryCtaLabel: string;
  primaryCtaRoute: string;
  secondaryCtaLabel?: string;
  secondaryCtaRoute?: string;
  score: number;
  isMissionProjectToday: boolean;
}

export interface ProjectsCommandViewModel {
  totalProjects: number;
  activeProjects: number;
  blockedProjects: number;
  projectsWithActions: number;
  projectsWithNextMission: number;
  recommendedProject?: ProjectCommandCard;
  projectCards: ProjectCommandCard[];
  filters: ProjectCommandFilter[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  safetyNote: string;
  updatedAt: string;
}

export interface ProjectsCommandBuildInput {
  projects: import("@/modules/projects/projectTypes").Project[];
  missionProjectId?: string;
  missionTitle?: string;
}

export interface ProjectsCommandIntent {
  isProjectsCommand: boolean;
  projectId: string | null;
}

export const PROJECTS_COMMAND_SAFETY_NOTE =
  "Synthèse locale uniquement — Gigi ne crée pas de projet, n'accepte pas de mission et n'exécute aucune action automatiquement.";

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriorityLevel, string> = {
  high: "Priorité haute",
  medium: "Priorité moyenne",
  low: "Priorité basse",
  unclear: "Priorité à clarifier",
};

export const PROJECT_COMMAND_STATUS_LABELS: Record<ProjectCommandStatus, string> = {
  active: "Projet actif",
  waiting_action: "Action en cours",
  blocked: "À débloquer",
  needs_clarification: "À clarifier",
  learning_ready: "Apprentissage récent",
  no_next_step: "En pause",
  archived: "Archivé",
};
