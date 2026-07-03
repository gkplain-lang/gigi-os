import type { Project } from "../projects/projectTypes";

export interface ProjectRawScores {
  businessImpact: number;
  alignment: number;
  completionProximity: number;
  urgency: number;
  clarity: number;
  effortEfficiency: number;
  riskOfDelay: number;
}

export function deriveScoresFromProject(project: Project): ProjectRawScores {
  const completionProximity = Math.min(10, Math.ceil(project.progress / 10));
  const effortEfficiency = Math.max(1, Math.min(10, 11 - project.estimatedEffort));
  const riskOfDelay = Math.max(
    1,
    Math.min(10, Math.round(project.urgency * (1 - project.progress / 100) + 2))
  );

  return {
    businessImpact: project.businessPotential,
    alignment: project.strategicValue,
    completionProximity,
    urgency: project.urgency,
    clarity: project.clarity,
    effortEfficiency,
    riskOfDelay,
  };
}

export function getStatusPenalty(project: Project): number {
  if (project.status === "paused") return 0.35;
  if (project.status === "future") return 0.2;
  if (project.status === "archived") return 0;
  return 1;
}
