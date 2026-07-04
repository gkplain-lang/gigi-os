import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import type { Mission } from "@/modules/missions/missionTypes";
import { getCatalogMission } from "@/modules/conversation/missionCatalog";
import {
  missionStatusToPhase,
  phaseToMissionStatus,
  type ExecutionPhase,
  type MissionExecutionHints,
  type MissionExecutionSnapshot,
} from "./types";

export function normalizeMissionStatus(status: string): Mission["status"] {
  return phaseToMissionStatus(missionStatusToPhase(status));
}

export function resolveMissionTasks(mission: Mission, hints?: MissionExecutionHints | null): string[] {
  if (hints?.tasks && hints.tasks.length > 0) {
    return hints.tasks.slice(0, 3);
  }
  if (mission.steps && mission.steps.length > 0) {
    return mission.steps.slice(0, 3);
  }
  const catalog = getCatalogMission(mission.id);
  if (catalog?.subtasks && catalog.subtasks.length > 0) {
    return catalog.subtasks.slice(0, 3);
  }
  return [
    `${mission.title.replace(/\.$/, "")} — première étape`,
    "Avancer 45 minutes sans distraction",
    "Noter où tu t'arrêtes",
  ];
}

export function buildExecutionSnapshot(state: GigiLocalState): MissionExecutionSnapshot {
  const { mission, executionHints, history } = state;
  const phase = missionStatusToPhase(mission.status);
  const tasks = resolveMissionTasks(mission, executionHints);
  const lastEvent = history[0] ?? null;

  return {
    phase,
    missionId: mission.id,
    missionTitle: mission.title,
    projectId: mission.projectId,
    projectName: mission.projectName,
    tasks,
    firstTask: tasks[0] ?? null,
    lastEventType: lastEvent?.type ?? null,
    lastNextStep: executionHints?.nextStep ?? lastEvent?.meta?.nextStep ?? null,
    canStart: phase === "proposed",
    canComplete: phase === "active",
  };
}

export function migrateExecutionState(state: GigiLocalState): GigiLocalState {
  return {
    ...state,
    mission: {
      ...state.mission,
      status: normalizeMissionStatus(state.mission.status),
      steps: state.mission.steps ?? state.executionHints?.tasks,
    },
    executionHints: state.executionHints ?? null,
    completedMissionIds: state.completedMissionIds ?? [],
    postponedMissionIds: state.postponedMissionIds ?? [],
    rejectedMissionIds: state.rejectedMissionIds ?? [],
  };
}

export function isActivePhase(phase: ExecutionPhase): boolean {
  return phase === "proposed" || phase === "active";
}
