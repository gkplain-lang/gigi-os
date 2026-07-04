import type { MissionStatus } from "@/modules/missions/missionTypes";

/** V0.5.4 execution phases — maps to existing MissionStatus values */
export type ExecutionPhase = "proposed" | "active" | "completed" | "postponed" | "dismissed";

export type MissionExecutionAction =
  | "start"
  | "complete"
  | "postpone"
  | "dismiss"
  | "apply"
  | "prepare_next";

export interface MissionExecutionHints {
  tasks?: string[];
  nextStep?: string | null;
  reason?: string | null;
  appliedAt?: string;
}

export interface MissionExecutionSnapshot {
  phase: ExecutionPhase;
  missionId: string;
  missionTitle: string;
  projectId: string;
  projectName: string;
  tasks: string[];
  firstTask: string | null;
  lastEventType: string | null;
  lastNextStep: string | null;
  canStart: boolean;
  canComplete: boolean;
}

export interface ExecutionDevSummary {
  activeMissionTitle: string | null;
  activeProjectId: string | null;
  phase: ExecutionPhase;
  lastEventTitle: string | null;
  lastEventType: string | null;
  lastNextStep: string | null;
  completedCount: number;
  postponedCount: number;
  dismissedCount: number;
}

const STATUS_TO_PHASE: Record<MissionStatus, ExecutionPhase> = {
  recommended: "proposed",
  in_progress: "active",
  completed: "completed",
  postponed: "postponed",
  rejected_for_now: "dismissed",
};

const PHASE_TO_STATUS: Record<ExecutionPhase, MissionStatus> = {
  proposed: "recommended",
  active: "in_progress",
  completed: "completed",
  postponed: "postponed",
  dismissed: "rejected_for_now",
};

export function missionStatusToPhase(status: string): ExecutionPhase {
  if (status in STATUS_TO_PHASE) {
    return STATUS_TO_PHASE[status as MissionStatus];
  }
  if (status === "started") return "active";
  if (status === "rejected") return "dismissed";
  return "proposed";
}

export function phaseToMissionStatus(phase: ExecutionPhase): MissionStatus {
  return PHASE_TO_STATUS[phase];
}

export { STATUS_TO_PHASE, PHASE_TO_STATUS };
