import type { MissionDecision, MissionDecisionState } from "./types";
import { MISSION_DECISION_STORAGE_KEY, MISSION_DECISION_VERSION } from "./types";

export function createEmptyMissionDecisionState(): MissionDecisionState {
  return { decisions: [], version: MISSION_DECISION_VERSION };
}

export function loadMissionDecisionState(): MissionDecisionState {
  if (typeof window === "undefined") return createEmptyMissionDecisionState();
  try {
    const raw = localStorage.getItem(MISSION_DECISION_STORAGE_KEY);
    if (!raw) return createEmptyMissionDecisionState();
    const parsed = JSON.parse(raw) as MissionDecisionState;
    if (!parsed?.decisions || !Array.isArray(parsed.decisions)) {
      return createEmptyMissionDecisionState();
    }
    return {
      ...createEmptyMissionDecisionState(),
      ...parsed,
      version: MISSION_DECISION_VERSION,
    };
  } catch {
    return createEmptyMissionDecisionState();
  }
}

export function saveMissionDecisionState(state: MissionDecisionState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MISSION_DECISION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function upsertMissionDecision(decision: MissionDecision): MissionDecision {
  const state = loadMissionDecisionState();
  const filtered = state.decisions.filter((d) => d.id !== decision.id);
  const next: MissionDecisionState = {
    decisions: [decision, ...filtered],
    currentDecisionId: decision.id,
    generatedAt: decision.updatedAt,
    version: MISSION_DECISION_VERSION,
  };
  saveMissionDecisionState(next);
  return decision;
}

export function getMissionDecisionById(id: string): MissionDecision | undefined {
  return loadMissionDecisionState().decisions.find((d) => d.id === id);
}

export function getCurrentMissionDecision(): MissionDecision | undefined {
  const state = loadMissionDecisionState();
  if (state.currentDecisionId) {
    return state.decisions.find((d) => d.id === state.currentDecisionId);
  }
  return state.decisions[0];
}

export function getTodayMissionDecision(dateStr?: string): MissionDecision | undefined {
  const date = dateStr ?? new Date().toISOString().slice(0, 10);
  return loadMissionDecisionState().decisions.find((d) => d.date === date);
}

export function listMissionDecisions(limit?: number): MissionDecision[] {
  const sorted = [...loadMissionDecisionState().decisions].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function archiveMissionDecision(id: string): MissionDecision | undefined {
  const decision = getMissionDecisionById(id);
  if (!decision) return undefined;
  const timestamp = new Date().toISOString();
  return upsertMissionDecision({
    ...decision,
    status: "archived",
    updatedAt: timestamp,
  });
}
