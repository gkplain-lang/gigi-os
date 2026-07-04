import { mockProjects } from "@/data/mockProjects";
import { mockHistory } from "@/data/mockHistory";
import {
  DEFAULT_MISSION_ID,
  MISSION_CATALOG,
  catalogToMission,
} from "../conversation/missionCatalog";
import type { GigiLocalState } from "./gigiStateTypes";

export function createInitialState(): GigiLocalState {
  const projects = mockProjects.map((p) => ({ ...p }));

  const defaultCatalogMission =
    MISSION_CATALOG.find((m) => m.id === DEFAULT_MISSION_ID) ?? MISSION_CATALOG[0];
  const mission = catalogToMission(defaultCatalogMission);

  return {
    mission,
    projects,
    history: mockHistory.map((h) => ({ ...h })),
    completedMissionIds: [],
    postponedMissionIds: [],
    rejectedMissionIds: [],
  };
}
