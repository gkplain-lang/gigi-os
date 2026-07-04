import type { HistoryEvent, HistoryEventType } from "@/modules/history/historyTypes";
import { createHistoryEntry } from "@/modules/history/historyUtils";
import type { Mission } from "@/modules/missions/missionTypes";
import type { MissionExecutionAction } from "./types";

const ACTION_TO_EVENT: Record<MissionExecutionAction, HistoryEventType> = {
  start: "mission_started",
  complete: "mission_completed",
  postpone: "mission_postponed",
  dismiss: "mission_rejected",
  apply: "decision_created",
  prepare_next: "decision_created",
};

const ACTION_LABELS: Record<MissionExecutionAction, string> = {
  start: "Mission démarrée",
  complete: "Mission terminée",
  postpone: "Mission reportée",
  dismiss: "Pas maintenant",
  apply: "Mission recommandée",
  prepare_next: "Prochaine mission préparée",
};

export interface MissionExecutionEventInput {
  action: MissionExecutionAction;
  mission: Mission;
  reason?: string | null;
  nextStep?: string | null;
}

export function createMissionExecutionEvent(input: MissionExecutionEventInput): HistoryEvent {
  const { action, mission, reason, nextStep } = input;
  const titleBase = ACTION_LABELS[action];
  const missionLabel = mission.title.replace(/\.$/, "");

  let title = titleBase;
  let description: string | undefined;

  switch (action) {
    case "start":
      title = `${titleBase} : ${missionLabel}.`;
      description = reason ?? `Projet ${mission.projectName}.`;
      break;
    case "complete":
      title = `${titleBase} : ${missionLabel}.`;
      description = nextStep ? `Suite : ${nextStep}` : reason ?? `Projet ${mission.projectName}.`;
      break;
    case "postpone":
      title = `${titleBase} : ${missionLabel}.`;
      description = reason ?? "Reportée pour plus tard.";
      break;
    case "dismiss":
      title = `${titleBase} : ${missionLabel}.`;
      description = reason ?? "Refusée pour l'instant.";
      break;
    case "apply":
      title = `Gigi a recommandé : ${missionLabel}.`;
      description = reason ?? mission.reason;
      break;
    case "prepare_next":
      title = `Gigi a recommandé : ${missionLabel}.`;
      description = nextStep ?? reason ?? "Prochaine mission préparée.";
      break;
  }

  const event = createHistoryEntry(ACTION_TO_EVENT[action], title, description);

  return {
    ...event,
    meta: {
      missionId: mission.id,
      projectId: mission.projectId,
      projectName: mission.projectName,
      reason: reason ?? undefined,
      nextStep: nextStep ?? undefined,
    },
  };
}

export function prependHistoryEvent(
  history: HistoryEvent[],
  event: HistoryEvent
): HistoryEvent[] {
  return [event, ...history];
}
