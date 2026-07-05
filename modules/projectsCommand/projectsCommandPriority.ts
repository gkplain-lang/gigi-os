import type { Project } from "@/modules/projects/projectTypes";
import { computeProjectScore } from "@/modules/projectMissions";
import type { ProjectCommandCard, ProjectPriorityLevel } from "./types";

export function mapProjectPriority(project: Project): ProjectPriorityLevel {
  if (project.clarity <= 4) return "unclear";
  if (project.priority === "critical" || project.priority === "high") return "high";
  if (project.priority === "medium") return "medium";
  return "low";
}

export function scoreProjectForRecommendation(
  card: ProjectCommandCard,
  missionProjectId?: string
): number {
  let score = card.score;
  if (card.isMissionProjectToday) score += 25;
  if (card.status === "waiting_action") score += 15;
  if (card.status === "blocked") score += 12;
  if (card.status === "active") score += 8;
  if (card.status === "learning_ready") score += 5;
  if (missionProjectId && card.projectId === missionProjectId) score += 20;
  if (card.blockerLabel) score += 10;
  return score;
}

export function pickRecommendedProject(
  cards: ProjectCommandCard[],
  missionProjectId?: string
): ProjectCommandCard | undefined {
  const eligible = cards.filter((c) => c.status !== "archived" && c.status !== "no_next_step");
  if (eligible.length === 0) return cards[0];
  return [...eligible].sort(
    (a, b) =>
      scoreProjectForRecommendation(b, missionProjectId) -
      scoreProjectForRecommendation(a, missionProjectId)
  )[0];
}

export function projectBaseScore(project: Project): number {
  return computeProjectScore(project);
}
