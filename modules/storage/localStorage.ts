import type { GigiLocalState } from "./gigiStateTypes";
import { STORAGE_KEY } from "./gigiStateTypes";
import { createInitialState, createFirstRunState } from "./initialState";
import { refreshHistoryGroups } from "../history/historyUtils";
import { migrateExecutionState } from "../missionExecution/executionState";
import { migrateOnboardingState } from "../onboarding/onboardingState";

function migrateState(state: GigiLocalState): GigiLocalState {
  const withHistory = {
    ...state,
    history: refreshHistoryGroups(state.history ?? []),
  };
  const withExecution = migrateExecutionState(withHistory);
  return migrateOnboardingState(withExecution);
}

export function loadState(): GigiLocalState {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return migrateState(createFirstRunState());

    const parsed = JSON.parse(raw) as GigiLocalState;
    return migrateState(parsed);
  } catch {
    return createInitialState();
  }
}

export function saveState(state: GigiLocalState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function resetToInitialState(): GigiLocalState {
  clearState();
  return createInitialState();
}
