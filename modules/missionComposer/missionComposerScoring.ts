import type { ProjectMissionCandidate } from "./missionComposerTypes";

const IMPACT_WEIGHT = { low: 1, medium: 2, high: 3 } as const;
const URGENCY_WEIGHT = { low: 1, medium: 2, high: 3 } as const;
const EFFORT_PENALTY = { low: 0, medium: 1, high: 2 } as const;

export function scoreMissionCandidate(input: {
  urgency: ProjectMissionCandidate["urgency"];
  impact: ProjectMissionCandidate["impact"];
  effort: ProjectMissionCandidate["effort"];
}): number {
  const base = IMPACT_WEIGHT[input.impact] * 10 + URGENCY_WEIGHT[input.urgency] * 5;
  const penalty = EFFORT_PENALTY[input.effort] * 3;
  return Math.max(10, Math.min(100, base - penalty + 40));
}

export function compareMissionCandidates(a: ProjectMissionCandidate, b: ProjectMissionCandidate): number {
  return b.priorityScore - a.priorityScore;
}
