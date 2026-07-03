import type { Project } from "../projects/projectTypes";
import type { Mission } from "./missionTypes";

export function createMissionFromNextAction(project: Project): Mission {
  return {
    id: `mission-${project.id}`,
    title: project.nextAction,
    projectId: project.id,
    projectName: project.name,
    reason: `${project.name} needs attention: ${project.nextAction}`,
    estimatedDuration: "45 minutes",
    expectedImpact: "Moyen",
    confidence: 70,
    status: "recommended",
  };
}
