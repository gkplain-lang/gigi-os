export type OnboardingStepId =
  | "welcome"
  | "projects"
  | "goals"
  | "work_style"
  | "first_mission";

export type OnboardingGoalId =
  | "save_time"
  | "advance_project"
  | "launch_offer"
  | "create_revenue"
  | "structure_ideas"
  | "other";

export type WorkStyleId = "short" | "deep" | "fast" | "strategic";

export interface OnboardingState {
  completedAt: string | null;
  currentStep: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  selectedProjectIds: string[];
  customProjectNames: string[];
  primaryGoal: OnboardingGoalId | null;
  customGoal?: string;
  workStyle: WorkStyleId | null;
  firstMissionGenerated: boolean;
}

export interface OnboardingStepDefinition {
  id: OnboardingStepId;
  order: number;
  title: string;
  subtitle: string;
}
