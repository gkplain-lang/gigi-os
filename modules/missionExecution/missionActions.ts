import { askGigi } from "@/modules/conversation/conversationBrain";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";
import type { Mission } from "@/modules/missions/missionTypes";
import {
  createMissionExecutionEvent,
  prependHistoryEvent,
} from "./executionEvents";
import { resolveMissionTasks } from "./executionState";
import type { MissionExecutionHints } from "./types";

function withMissionSteps(mission: Mission, hints?: MissionExecutionHints | null): Mission {
  const tasks = resolveMissionTasks(mission, hints);
  return {
    ...mission,
    status: "recommended",
    steps: tasks,
  };
}

export function applyRecommendedMissionState(
  prev: GigiLocalState,
  mission: Mission,
  hints?: MissionExecutionHints | null
): GigiLocalState {
  const nextMission = withMissionSteps(mission, hints);
  const event = createMissionExecutionEvent({
    action: "apply",
    mission: nextMission,
    reason: hints?.reason ?? mission.reason,
    nextStep: hints?.nextStep,
  });

  return {
    ...prev,
    mission: nextMission,
    executionHints: hints
      ? {
          tasks: hints.tasks ?? nextMission.steps,
          nextStep: hints.nextStep ?? null,
          reason: hints.reason ?? null,
          appliedAt: new Date().toISOString(),
        }
      : {
          tasks: nextMission.steps,
          nextStep: null,
          reason: mission.reason,
          appliedAt: new Date().toISOString(),
        },
    history: prependHistoryEvent(prev.history, event),
  };
}

export function applyStartMissionState(prev: GigiLocalState): GigiLocalState {
  const event = createMissionExecutionEvent({
    action: "start",
    mission: prev.mission,
    reason: prev.executionHints?.reason ?? prev.mission.reason,
    nextStep: prev.executionHints?.nextStep,
  });

  return {
    ...prev,
    mission: { ...prev.mission, status: "in_progress" },
    history: prependHistoryEvent(prev.history, event),
  };
}

export function applyCompleteMissionState(prev: GigiLocalState): GigiLocalState {
  const nextStep = prev.executionHints?.nextStep ?? null;
  const alreadyCompleted = prev.completedMissionIds.includes(prev.mission.id);

  const event = createMissionExecutionEvent({
    action: "complete",
    mission: prev.mission,
    reason: prev.mission.reason,
    nextStep,
  });

  return {
    ...prev,
    mission: { ...prev.mission, status: "completed" },
    completedMissionIds: alreadyCompleted
      ? prev.completedMissionIds
      : [...prev.completedMissionIds, prev.mission.id],
    history: prependHistoryEvent(prev.history, event),
  };
}

export function applyPostponeMissionState(
  prev: GigiLocalState,
  reason?: string
): GigiLocalState {
  const event = createMissionExecutionEvent({
    action: "postpone",
    mission: prev.mission,
    reason: reason ?? "Reportée pour plus tard.",
  });

  return {
    ...prev,
    mission: { ...prev.mission, status: "postponed" },
    postponedMissionIds: prev.postponedMissionIds.includes(prev.mission.id)
      ? prev.postponedMissionIds
      : [...prev.postponedMissionIds, prev.mission.id],
    history: prependHistoryEvent(prev.history, event),
  };
}

export function applyDismissMissionState(
  prev: GigiLocalState,
  reason?: string
): GigiLocalState {
  const event = createMissionExecutionEvent({
    action: "dismiss",
    mission: prev.mission,
    reason: reason ?? "Pas maintenant.",
  });

  return {
    ...prev,
    mission: { ...prev.mission, status: "rejected_for_now" },
    rejectedMissionIds: prev.rejectedMissionIds.includes(prev.mission.id)
      ? prev.rejectedMissionIds
      : [...prev.rejectedMissionIds, prev.mission.id],
    history: prependHistoryEvent(prev.history, event),
  };
}

export function applyPrepareNextMissionState(prev: GigiLocalState): {
  state: GigiLocalState;
  applied: boolean;
} {
  const res = askGigi("Quelle est la prochaine mission ?", prev.projects, {
    completedMissionIds: prev.completedMissionIds,
  });

  if (!res.mission) {
    return { state: prev, applied: false };
  }

  const hints: MissionExecutionHints = {
    tasks: res.tasks,
    nextStep: res.nextStep ?? null,
    reason: res.why ?? null,
  };

  const nextMission = withMissionSteps(res.mission, hints);
  const event = createMissionExecutionEvent({
    action: "prepare_next",
    mission: nextMission,
    reason: hints.reason,
    nextStep: hints.nextStep,
  });

  return {
    state: {
      ...prev,
      mission: nextMission,
      executionHints: {
        tasks: nextMission.steps,
        nextStep: hints.nextStep ?? null,
        reason: hints.reason ?? null,
        appliedAt: new Date().toISOString(),
      },
      history: prependHistoryEvent(prev.history, event),
    },
    applied: true,
  };
}
