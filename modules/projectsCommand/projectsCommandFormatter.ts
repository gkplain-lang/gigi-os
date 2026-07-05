import {
  PROJECT_COMMAND_STATUS_LABELS,
  PROJECT_PRIORITY_LABELS,
  type ProjectCommandStatus,
  type ProjectPriorityLevel,
} from "./types";

export function formatProjectCommandStatus(status: ProjectCommandStatus): string {
  return PROJECT_COMMAND_STATUS_LABELS[status];
}

export function formatProjectPriorityLevel(level: ProjectPriorityLevel): string {
  return PROJECT_PRIORITY_LABELS[level];
}

export function formatProjectsCommandSummary(vm: {
  totalProjects: number;
  activeProjects: number;
  blockedProjects: number;
  projectsWithActions: number;
  projectsWithNextMission: number;
}): string {
  return `${vm.totalProjects} projet(s) · ${vm.activeProjects} actif(s) · ${vm.projectsWithActions} avec action · ${vm.projectsWithNextMission} avec mission possible · ${vm.blockedProjects} bloqué(s)`;
}
