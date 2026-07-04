import { getConversationAskHref } from "@/modules/dailyUse/dailyUseHints";
import type { Project } from "@/modules/projects/projectTypes";
import { getMissionSeedsForProject } from "./projectMissionRules";
import { getProjectDetailSummary } from "./projectMissionSummary";
import type { ProjectDetailContext, ProjectMissionSuggestion } from "./types";

export function getProjectMissionSuggestions(projectId: string): ProjectMissionSuggestion[] {
  return getMissionSeedsForProject(projectId);
}

export function getRecommendedMission(
  missions: ProjectMissionSuggestion[]
): ProjectMissionSuggestion | undefined {
  return missions.find((m) => m.recommended) ?? missions[0];
}

export function buildProjectDetailContext(
  project: Project,
  options?: { isMissionProject?: boolean }
): ProjectDetailContext {
  const missions = getProjectMissionSuggestions(project.id);
  const summary = getProjectDetailSummary(project, options);
  return {
    project,
    summary,
    missions,
    isMissionProject: options?.isMissionProject ?? false,
  };
}

export function getProjectAskGigiHref(project: Project): string {
  return getConversationAskHref(
    `Gigi, quelle mission est prioritaire pour le projet ${project.name} aujourd'hui ?`
  );
}

export function getMissionAskGigiHref(project: Project, mission: ProjectMissionSuggestion): string {
  return getConversationAskHref(
    `Gigi, est-ce que je devrais choisir la mission « ${mission.title} » pour ${project.name} aujourd'hui ?`
  );
}

export function getMissionPrepareHref(project: Project, mission: ProjectMissionSuggestion): string {
  return getConversationAskHref(
    `Gigi, prépare la mission « ${mission.title} » pour le projet ${project.name} comme prochaine priorité.`
  );
}
