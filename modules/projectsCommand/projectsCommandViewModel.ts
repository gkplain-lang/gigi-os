import { loadActionQueueState } from "@/modules/actionQueue/actionQueueStore";
import type { QueuedAction } from "@/modules/actionQueue/types";
import { PROJECT_CONTEXT_LABELS } from "@/data/projectLabels";
import { buildMissionLearningViewModel } from "@/modules/missionOS/missionOSLearningLoop";
import {
  getProjectMissionSuggestions,
  getRecommendedMission,
  computeProjectScore,
} from "@/modules/projectMissions";
import type { Project } from "@/modules/projects/projectTypes";
import { mapProjectPriority, pickRecommendedProject } from "./projectsCommandPriority";
import {
  PROJECT_COMMAND_STATUS_LABELS,
  PROJECTS_COMMAND_SAFETY_NOTE,
  type ProjectCommandCard,
  type ProjectCommandFilter,
  type ProjectCommandStatus,
  type ProjectsCommandBuildInput,
  type ProjectsCommandViewModel,
} from "./types";

const FILTERS: ProjectCommandFilter[] = [
  { id: "all", label: "Tous" },
  { id: "active", label: "Actifs" },
  { id: "with_action", label: "Avec action" },
  { id: "blocked", label: "Bloqués" },
  { id: "needs_clarification", label: "À clarifier" },
  { id: "archived", label: "Archivés" },
];

function nowIso(): string {
  return new Date().toISOString();
}

function pickActiveActionForProject(projectId: string): QueuedAction | undefined {
  const actions = loadActionQueueState().actions.filter(
    (a) =>
      a.projectId === projectId &&
      !["rejected"].includes(a.status)
  );
  if (actions.length === 0) return undefined;
  const approved = actions.find((a) => a.status === "approved");
  if (approved) return approved;
  return [...actions].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
}

function deriveCommandStatus(
  project: Project,
  hasAction: boolean,
  hasLearning: boolean
): ProjectCommandStatus {
  if (project.status === "archived") return "archived";
  if (project.status === "paused" || project.status === "postponed" || project.status === "future") {
    return "no_next_step";
  }
  if (project.blocker) return "blocked";
  if (hasAction) return "waiting_action";
  if (project.clarity <= 4) return "needs_clarification";
  if (hasLearning) return "learning_ready";
  if (project.status === "active") return "active";
  return "no_next_step";
}

function buildProjectCommandCard(
  project: Project,
  missionProjectId?: string,
  missionTitle?: string
): ProjectCommandCard {
  const missions = getProjectMissionSuggestions(project.id);
  const recommended = getRecommendedMission(missions);
  const activeAction = pickActiveActionForProject(project.id);
  const learning = buildMissionLearningViewModel({ projectId: project.id });
  const hasLearning = learning.hasLearning;
  const status = deriveCommandStatus(project, Boolean(activeAction), hasLearning);
  const priority = mapProjectPriority(project);
  const isMissionProjectToday = missionProjectId === project.id;
  const summary =
    PROJECT_CONTEXT_LABELS[project.id] ?? project.description ?? project.nextAction;

  const learningSnippet = hasLearning
    ? learning.whatGigiLearned.slice(0, 120)
    : undefined;

  let lastActivityLabel: string | undefined;
  if (activeAction) {
    lastActivityLabel = `Action · ${activeAction.updatedAt.slice(0, 10)}`;
  }

  return {
    projectId: project.id,
    projectName: project.name,
    summary,
    projectStatus: project.status,
    status,
    statusLabel: PROJECT_COMMAND_STATUS_LABELS[status],
    priority,
    priorityLabel: priority === "high" ? "Haute" : priority === "medium" ? "Moyenne" : priority === "low" ? "Basse" : "À clarifier",
    nextMissionTitle: isMissionProjectToday
      ? missionTitle ?? recommended?.title
      : recommended?.title,
    nextMissionReason: recommended?.reason,
    activeActionTitle: activeAction?.preparedAction.title,
    activeActionRoute: activeAction ? "/actions" : undefined,
    learningSummary: learningSnippet,
    blockerLabel: project.blocker,
    lastActivityLabel,
    primaryCtaLabel: "Ouvrir le projet",
    primaryCtaRoute: `/projects/${project.id}`,
    secondaryCtaLabel: activeAction ? "Voir l'action" : recommended ? "Voir missions" : undefined,
    secondaryCtaRoute: activeAction
      ? "/actions"
      : recommended
        ? `/projects/${project.id}#missions`
        : undefined,
    score: computeProjectScore(project),
    isMissionProjectToday,
  };
}

export function buildProjectsCommandViewModel(
  input: ProjectsCommandBuildInput
): ProjectsCommandViewModel {
  const { projects, missionProjectId, missionTitle } = input;
  const projectCards = projects.map((p) =>
    buildProjectCommandCard(p, missionProjectId, missionTitle)
  );

  const activeProjects = projectCards.filter(
    (c) => c.projectStatus === "active" && c.status !== "archived"
  ).length;
  const blockedProjects = projectCards.filter((c) => c.status === "blocked").length;
  const projectsWithActions = projectCards.filter((c) => Boolean(c.activeActionTitle)).length;
  const projectsWithNextMission = projectCards.filter((c) => Boolean(c.nextMissionTitle)).length;
  const recommendedProject = pickRecommendedProject(projectCards, missionProjectId);

  let emptyStateTitle: string | undefined;
  let emptyStateDescription: string | undefined;
  if (projects.length === 0) {
    emptyStateTitle = "Aucun projet configuré";
    emptyStateDescription =
      "Ajoute tes projets via l'onboarding pour que Gigi puisse prioriser.";
  }

  return {
    totalProjects: projects.length,
    activeProjects,
    blockedProjects,
    projectsWithActions,
    projectsWithNextMission,
    recommendedProject,
    projectCards: [...projectCards].sort(
      (a, b) =>
        (b.isMissionProjectToday ? 1 : 0) - (a.isMissionProjectToday ? 1 : 0) ||
        b.score - a.score
    ),
    filters: FILTERS,
    emptyStateTitle,
    emptyStateDescription,
    safetyNote: PROJECTS_COMMAND_SAFETY_NOTE,
    updatedAt: nowIso(),
  };
}

export function filterProjectCommandCards(
  cards: ProjectCommandCard[],
  filterId: ProjectCommandFilter["id"]
): ProjectCommandCard[] {
  switch (filterId) {
    case "active":
      return cards.filter(
        (c) => c.projectStatus === "active" && c.status !== "archived"
      );
    case "with_action":
      return cards.filter((c) => Boolean(c.activeActionTitle));
    case "blocked":
      return cards.filter((c) => c.status === "blocked");
    case "needs_clarification":
      return cards.filter((c) => c.status === "needs_clarification");
    case "archived":
      return cards.filter(
        (c) => c.status === "archived" || c.projectStatus === "archived"
      );
    default:
      return cards;
  }
}

export function getProjectCommandCardById(
  vm: ProjectsCommandViewModel,
  projectId: string
): ProjectCommandCard | undefined {
  return vm.projectCards.find((c) => c.projectId === projectId);
}
