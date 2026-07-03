import type { GigiLocalState } from "./gigiStateTypes";
import { STORAGE_KEY } from "./gigiStateTypes";
import { createInitialState } from "./initialState";
import { refreshHistoryGroups } from "../history/historyUtils";
import type { MissionStatus } from "../missions/missionTypes";

function migrateMissionStatus(status: string): MissionStatus {
  if (status === "started") return "in_progress";
  if (status === "rejected") return "rejected_for_now";
  return status as MissionStatus;
}

function migrateState(state: GigiLocalState): GigiLocalState {
  return {
    ...state,
    mission: {
      ...state.mission,
      status: migrateMissionStatus(state.mission.status),
    },
    completedMissionIds: state.completedMissionIds ?? [],
    postponedMissionIds: state.postponedMissionIds ?? [],
    rejectedMissionIds: state.rejectedMissionIds ?? [],
    history: refreshHistoryGroups(state.history ?? []),
  };
}

export function loadState(): GigiLocalState {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();

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
