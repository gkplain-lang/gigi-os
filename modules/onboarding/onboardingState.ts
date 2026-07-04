import type { Mission } from "@/modules/missions/missionTypes";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import {
  buildMissionFromProject,
  selectBestProject,
} from "@/modules/decision-engine/runDecisionEngine";
import { buildProjectsFromOnboardingSelection } from "./onboardingDefaults";
import { getNextStepId, getPreviousStepId } from "./onboardingSteps";
import type { OnboardingGoalId, OnboardingState, OnboardingStepId, WorkStyleId } from "./types";

export const PLACEHOLDER_MISSION: Mission = {
  id: "onboarding-pending",
  title: "Configure Gigi pour obtenir ta première mission.",
  projectId: "pending",
  projectName: "—",
  reason: "Termine la configuration pour que Gigi choisisse ta priorité du jour.",
  estimatedDuration: "—",
  expectedImpact: "Moyen",
  confidence: 0,
  status: "recommended",
};

export function createOnboardingState(): OnboardingState {
  return {
    completedAt: null,
    currentStep: "welcome",
    completedSteps: [],
    selectedProjectIds: ["gigi-os"],
    customProjectNames: [],
    primaryGoal: null,
    customGoal: undefined,
    workStyle: null,
    firstMissionGenerated: false,
  };
}

export function createLegacyCompletedOnboarding(state: GigiLocalState): OnboardingState {
  return {
    completedAt: new Date().toISOString(),
    currentStep: "first_mission",
    completedSteps: ["welcome", "projects", "goals", "work_style", "first_mission"],
    selectedProjectIds: state.projects.map((p) => p.id),
    customProjectNames: [],
    primaryGoal: "advance_project",
    workStyle: "strategic",
    firstMissionGenerated: true,
  };
}

export function createCompletedOnboardingFromDemo(): OnboardingState {
  return {
    completedAt: new Date().toISOString(),
    currentStep: "first_mission",
    completedSteps: ["welcome", "projects", "goals", "work_style", "first_mission"],
    selectedProjectIds: ["gigi-os", "buildy-clear", "buildy-crafts"],
    customProjectNames: [],
    primaryGoal: "advance_project",
    workStyle: "strategic",
    firstMissionGenerated: true,
  };
}

function normalizeOnboarding(onboarding: OnboardingState): OnboardingState {
  return {
    ...createOnboardingState(),
    ...onboarding,
    completedSteps: onboarding.completedSteps ?? [],
    selectedProjectIds: onboarding.selectedProjectIds ?? [],
    customProjectNames: onboarding.customProjectNames ?? [],
  };
}

export function migrateOnboardingState(state: GigiLocalState): GigiLocalState {
  if (state.onboarding?.completedAt) {
    return { ...state, onboarding: normalizeOnboarding(state.onboarding) };
  }

  if (!state.onboarding) {
    return {
      ...state,
      onboarding: createLegacyCompletedOnboarding(state),
    };
  }

  return { ...state, onboarding: normalizeOnboarding(state.onboarding) };
}

export function isOnboardingComplete(state: GigiLocalState): boolean {
  return !!state.onboarding?.completedAt;
}

export function canAdvanceFromStep(
  onboarding: OnboardingState,
  stepId: OnboardingStepId
): boolean {
  switch (stepId) {
    case "welcome":
      return true;
    case "projects":
      return (
        onboarding.selectedProjectIds.length > 0 ||
        onboarding.customProjectNames.some((n) => n.trim().length > 0)
      );
    case "goals":
      if (onboarding.primaryGoal === "other") {
        return !!onboarding.customGoal?.trim();
      }
      return onboarding.primaryGoal !== null;
    case "work_style":
      return onboarding.workStyle !== null;
    case "first_mission":
      return true;
    default:
      return false;
  }
}

function markStepCompleted(
  onboarding: OnboardingState,
  stepId: OnboardingStepId
): OnboardingState {
  const completedSteps = onboarding.completedSteps.includes(stepId)
    ? onboarding.completedSteps
    : [...onboarding.completedSteps, stepId];
  return { ...onboarding, completedSteps };
}

export function advanceOnboardingStep(state: GigiLocalState): GigiLocalState {
  const onboarding = state.onboarding ?? createOnboardingState();
  const current = onboarding.currentStep;

  if (!canAdvanceFromStep(onboarding, current)) return state;

  const nextStep = getNextStepId(current);
  let nextOnboarding = markStepCompleted(onboarding, current);

  if (current === "projects") {
    const projects = buildProjectsFromOnboardingSelection(
      nextOnboarding.selectedProjectIds,
      nextOnboarding.customProjectNames
    );
    return {
      ...state,
      projects,
      onboarding: {
        ...nextOnboarding,
        currentStep: nextStep ?? current,
      },
    };
  }

  if (nextStep) {
    nextOnboarding = { ...nextOnboarding, currentStep: nextStep };
  }

  return { ...state, onboarding: nextOnboarding };
}

export function goBackOnboardingStep(state: GigiLocalState): GigiLocalState {
  const onboarding = state.onboarding ?? createOnboardingState();
  const prev = getPreviousStepId(onboarding.currentStep);
  if (!prev) return state;
  return {
    ...state,
    onboarding: { ...onboarding, currentStep: prev },
  };
}

export function updateOnboardingProjects(
  state: GigiLocalState,
  selectedProjectIds: string[],
  customProjectNames: string[]
): GigiLocalState {
  const onboarding = state.onboarding ?? createOnboardingState();
  return {
    ...state,
    onboarding: {
      ...onboarding,
      selectedProjectIds,
      customProjectNames,
    },
  };
}

export function updateOnboardingGoal(
  state: GigiLocalState,
  primaryGoal: OnboardingGoalId | null,
  customGoal?: string
): GigiLocalState {
  const onboarding = state.onboarding ?? createOnboardingState();
  return {
    ...state,
    onboarding: {
      ...onboarding,
      primaryGoal,
      customGoal,
    },
  };
}

export function updateOnboardingWorkStyle(
  state: GigiLocalState,
  workStyle: WorkStyleId | null
): GigiLocalState {
  const onboarding = state.onboarding ?? createOnboardingState();
  return {
    ...state,
    onboarding: { ...onboarding, workStyle },
  };
}

export function generateFirstMissionForState(state: GigiLocalState): Mission | null {
  const activeProjects = state.projects.filter((p) => p.status === "active");
  if (activeProjects.length === 0) return null;

  const winner = selectBestProject(activeProjects);
  if (!winner) return null;

  const project = activeProjects.find((p) => p.id === winner.projectId);
  if (!project) return null;

  return buildMissionFromProject(project, winner.score);
}

export function completeOnboarding(
  state: GigiLocalState,
  options?: { firstMissionGenerated?: boolean }
): GigiLocalState {
  const onboarding = state.onboarding ?? createOnboardingState();
  const completedSteps = ONBOARDING_ALL_STEPS.filter(
    (s) => onboarding.completedSteps.includes(s) || s === onboarding.currentStep
  );

  return {
    ...state,
    onboarding: {
      ...onboarding,
      completedAt: new Date().toISOString(),
      currentStep: "first_mission",
      completedSteps: Array.from(new Set([...completedSteps, "first_mission"])),
      firstMissionGenerated: options?.firstMissionGenerated ?? onboarding.firstMissionGenerated,
    },
  };
}

const ONBOARDING_ALL_STEPS: OnboardingStepId[] = [
  "welcome",
  "projects",
  "goals",
  "work_style",
  "first_mission",
];

export function resetOnboardingState(state: GigiLocalState): GigiLocalState {
  const hasRealMission = state.mission.id !== PLACEHOLDER_MISSION.id;

  return {
    ...state,
    mission: hasRealMission ? state.mission : PLACEHOLDER_MISSION,
    onboarding: createOnboardingState(),
  };
}
