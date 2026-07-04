export type {
  OnboardingGoalId,
  OnboardingState,
  OnboardingStepDefinition,
  OnboardingStepId,
  WorkStyleId,
} from "./types";

export {
  ONBOARDING_STEPS,
  ONBOARDING_STEP_ORDER,
  getNextStepId,
  getPreviousStepId,
  getStepDefinition,
} from "./onboardingSteps";

export {
  V14_PHASE_LABEL,
  ONBOARDING_PROMISE,
  ONBOARDING_TAGLINE,
  ONBOARDING_NOT_TODO,
  ONBOARDING_MISSION_LOGIC,
  ONBOARDING_SIMULATION_NOTE,
  ONBOARDING_BANNER,
  SIDEBAR_ONBOARDING_LABEL,
  GOAL_OPTIONS,
  WORK_STYLE_OPTIONS,
  buildFirstMissionConversationPrompt,
  getOnboardingConversationHref,
} from "./onboardingCopy";

export {
  SUGGESTED_PROJECT_IDS,
  SUGGESTED_PROJECT_LABELS,
  getSuggestedProjectTemplates,
  createCustomProject,
  buildProjectsFromOnboardingSelection,
} from "./onboardingDefaults";

export {
  PLACEHOLDER_MISSION,
  createOnboardingState,
  createLegacyCompletedOnboarding,
  createCompletedOnboardingFromDemo,
  migrateOnboardingState,
  isOnboardingComplete,
  canAdvanceFromStep,
  advanceOnboardingStep,
  goBackOnboardingStep,
  updateOnboardingProjects,
  updateOnboardingGoal,
  updateOnboardingWorkStyle,
  generateFirstMissionForState,
  completeOnboarding,
  resetOnboardingState,
} from "./onboardingState";

export {
  mergeMissingStarterProjects,
  restoreStarterProjectsState,
  STARTER_PROJECTS_RESTORE_HINT,
  ONBOARDING_RESET_HINT,
  type RestoreStarterProjectsResult,
} from "./starterProjectsRestore";

export { ONBOARDING_GUARDRAILS, summarizeOnboarding } from "./onboardingSummary";
