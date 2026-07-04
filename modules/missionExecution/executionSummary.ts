import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import { buildExecutionSnapshot } from "./executionState";
import type { ExecutionDevSummary } from "./types";

export function summarizeExecution(state: GigiLocalState): ExecutionDevSummary {
  const snapshot = buildExecutionSnapshot(state);
  const lastEvent = state.history[0] ?? null;

  return {
    activeMissionTitle: snapshot.missionTitle,
    activeProjectId: snapshot.projectId,
    phase: snapshot.phase,
    lastEventTitle: lastEvent?.title ?? null,
    lastEventType: lastEvent?.type ?? null,
    lastNextStep: snapshot.lastNextStep,
    completedCount: state.completedMissionIds.length,
    postponedCount: state.postponedMissionIds.length,
    dismissedCount: state.rejectedMissionIds.length,
  };
}

export { buildExecutionSnapshot };
