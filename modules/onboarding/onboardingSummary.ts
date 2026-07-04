import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import { ONBOARDING_STEPS } from "./onboardingSteps";
import { GOAL_OPTIONS, ONBOARDING_PROMISE, ONBOARDING_TAGLINE, V14_PHASE_LABEL, WORK_STYLE_OPTIONS } from "./onboardingCopy";
import { isOnboardingComplete } from "./onboardingState";
import type { OnboardingGoalId, WorkStyleId } from "./types";

export const ONBOARDING_GUARDRAILS = [
  "localStorage uniquement — pas de Supabase auto",
  "Aucune intégration réelle (n8n, GitHub, Gmail, Calendar)",
  "Garde-fous dry-run conservés",
  "Pas de SaaS, pas de paiement, pas de landing publique",
  "Fallback local si OpenAI indisponible",
] as const;

export function summarizeOnboarding(state: GigiLocalState) {
  const onboarding = state.onboarding;
  const complete = isOnboardingComplete(state);

  const goalLabel =
    onboarding?.primaryGoal === "other"
      ? onboarding.customGoal ?? "Autre"
      : GOAL_OPTIONS.find((g) => g.id === onboarding?.primaryGoal)?.label ?? "—";

  const styleLabel =
    WORK_STYLE_OPTIONS.find((s) => s.id === onboarding?.workStyle)?.label ?? "—";

  return {
    version: "1.4.0",
    phase: V14_PHASE_LABEL,
    promise: ONBOARDING_PROMISE,
    tagline: ONBOARDING_TAGLINE,
    stepCount: ONBOARDING_STEPS.length,
    isComplete: complete,
    currentStep: onboarding?.currentStep ?? "welcome",
    completedSteps: onboarding?.completedSteps ?? [],
    completedAt: onboarding?.completedAt ?? null,
    selectedProjectIds: onboarding?.selectedProjectIds ?? [],
    customProjectNames: onboarding?.customProjectNames ?? [],
    projectCount: state.projects.length,
    primaryGoal: (onboarding?.primaryGoal ?? null) as OnboardingGoalId | null,
    goalLabel,
    workStyle: (onboarding?.workStyle ?? null) as WorkStyleId | null,
    styleLabel,
    firstMissionGenerated: onboarding?.firstMissionGenerated ?? false,
    guardrails: ONBOARDING_GUARDRAILS,
  };
}
