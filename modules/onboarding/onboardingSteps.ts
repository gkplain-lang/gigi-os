import type { OnboardingStepDefinition, OnboardingStepId } from "./types";

export const ONBOARDING_STEPS: OnboardingStepDefinition[] = [
  {
    id: "welcome",
    order: 1,
    title: "Bienvenue",
    subtitle: "Comprendre Gigi en une minute",
  },
  {
    id: "projects",
    order: 2,
    title: "Projets",
    subtitle: "Ce sur quoi tu travailles vraiment",
  },
  {
    id: "goals",
    order: 3,
    title: "Objectif",
    subtitle: "Ta priorité principale",
  },
  {
    id: "work_style",
    order: 4,
    title: "Style",
    subtitle: "Comment tu préfères avancer",
  },
  {
    id: "first_mission",
    order: 5,
    title: "Première mission",
    subtitle: "Ta priorité du jour",
  },
];

export const ONBOARDING_STEP_ORDER: OnboardingStepId[] = ONBOARDING_STEPS.map((s) => s.id);

export function getStepDefinition(stepId: OnboardingStepId): OnboardingStepDefinition {
  return ONBOARDING_STEPS.find((s) => s.id === stepId) ?? ONBOARDING_STEPS[0];
}

export function getNextStepId(current: OnboardingStepId): OnboardingStepId | null {
  const idx = ONBOARDING_STEP_ORDER.indexOf(current);
  if (idx < 0 || idx >= ONBOARDING_STEP_ORDER.length - 1) return null;
  return ONBOARDING_STEP_ORDER[idx + 1];
}

export function getPreviousStepId(current: OnboardingStepId): OnboardingStepId | null {
  const idx = ONBOARDING_STEP_ORDER.indexOf(current);
  if (idx <= 0) return null;
  return ONBOARDING_STEP_ORDER[idx - 1];
}
