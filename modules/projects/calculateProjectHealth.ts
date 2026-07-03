import type { Project, ProjectHealth } from "./projectTypes";

export function calculateProjectHealth(project: Project): ProjectHealth {
  if (project.status === "paused") return "paused";
  if (!project.nextAction?.trim()) return "unclear";
  if (project.blocker) return "blocked";
  if (project.progress >= 90) return "ready_to_launch";
  return "healthy";
}
