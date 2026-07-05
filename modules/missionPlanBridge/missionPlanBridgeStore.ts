import type { MissionPlanBridgeRecord, MissionPlanBridgeState } from "./types";
import { MISSION_PLAN_BRIDGE_STORAGE_KEY, MISSION_PLAN_BRIDGE_VERSION } from "./types";

export function createEmptyMissionPlanBridgeState(): MissionPlanBridgeState {
  return { bridges: [], version: MISSION_PLAN_BRIDGE_VERSION };
}

export function loadMissionPlanBridgeState(): MissionPlanBridgeState {
  if (typeof window === "undefined") return createEmptyMissionPlanBridgeState();
  try {
    const raw = localStorage.getItem(MISSION_PLAN_BRIDGE_STORAGE_KEY);
    if (!raw) return createEmptyMissionPlanBridgeState();
    const parsed = JSON.parse(raw) as MissionPlanBridgeState;
    if (!parsed?.bridges || !Array.isArray(parsed.bridges)) {
      return createEmptyMissionPlanBridgeState();
    }
    return {
      ...createEmptyMissionPlanBridgeState(),
      ...parsed,
      version: MISSION_PLAN_BRIDGE_VERSION,
    };
  } catch {
    return createEmptyMissionPlanBridgeState();
  }
}

export function saveMissionPlanBridgeState(state: MissionPlanBridgeState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MISSION_PLAN_BRIDGE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function upsertMissionPlanBridge(record: MissionPlanBridgeRecord): MissionPlanBridgeRecord {
  const state = loadMissionPlanBridgeState();
  const filtered = state.bridges.filter((b) => b.id !== record.id);
  saveMissionPlanBridgeState({
    bridges: [record, ...filtered],
    lastUpdatedAt: record.updatedAt,
    version: MISSION_PLAN_BRIDGE_VERSION,
  });
  return record;
}

export function getMissionPlanBridgeById(id: string): MissionPlanBridgeRecord | undefined {
  return loadMissionPlanBridgeState().bridges.find((b) => b.id === id);
}

export function listMissionPlanBridges(limit?: number): MissionPlanBridgeRecord[] {
  const sorted = [...loadMissionPlanBridgeState().bridges].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getBridgesByMissionDecisionId(
  missionDecisionId: string
): MissionPlanBridgeRecord[] {
  return loadMissionPlanBridgeState().bridges.filter(
    (b) => b.missionDecisionId === missionDecisionId
  );
}

export function getBridgesByProjectId(projectId: string): MissionPlanBridgeRecord[] {
  return loadMissionPlanBridgeState().bridges.filter((b) => b.projectId === projectId);
}

export function archiveMissionPlanBridge(id: string): MissionPlanBridgeRecord | undefined {
  const record = getMissionPlanBridgeById(id);
  if (!record) return undefined;
  const timestamp = new Date().toISOString();
  return upsertMissionPlanBridge({
    ...record,
    status: "archived",
    archivedAt: timestamp,
    updatedAt: timestamp,
  });
}
