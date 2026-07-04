import { mockProjects } from "@/data/mockProjects";
import { mockHistory } from "@/data/mockHistory";
import {
  DEFAULT_MISSION_ID,
  MISSION_CATALOG,
  catalogToMission,
} from "../conversation/missionCatalog";
import {
  createCompletedOnboardingFromDemo,
  createOnboardingState,
  PLACEHOLDER_MISSION,
} from "../onboarding/onboardingState";
import type { GigiLocalState } from "./gigiStateTypes";

export function createFirstRunState(): GigiLocalState {
  return {
    mission: PLACEHOLDER_MISSION,
    projects: [],
    history: [],
    completedMissionIds: [],
    postponedMissionIds: [],
    rejectedMissionIds: [],
    executionHints: null,
    onboarding: createOnboardingState(),
  };
}

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
    executionHints: null,
    onboarding: createCompletedOnboardingFromDemo(),
  };
}
