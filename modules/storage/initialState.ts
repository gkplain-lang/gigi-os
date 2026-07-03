import { mockProjects } from "@/data/mockProjects";
import { mockMissions } from "@/data/mockMissions";
import { mockHistory } from "@/data/mockHistory";
import { explainDecisionFromProjects } from "../decision-engine/runDecisionEngine";
import type { GigiLocalState } from "./gigiStateTypes";

export function createInitialState(): GigiLocalState {
  const projects = mockProjects.map((p) => ({ ...p }));
  const decision = explainDecisionFromProjects(projects);

  const mission = {
    ...mockMissions[0],
    status: "recommended" as const,
    confidence: decision.finalScore,
  };

  return {
    mission,
    projects,
    history: mockHistory.map((h) => ({ ...h })),
    completedMissionIds: [],
    postponedMissionIds: [],
    rejectedMissionIds: [],
  };
}
