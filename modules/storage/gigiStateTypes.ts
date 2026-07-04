import type { HistoryEvent } from "../history/historyTypes";
import type { Mission } from "../missions/missionTypes";
import type { Project } from "../projects/projectTypes";
import type { MissionExecutionHints } from "../missionExecution/types";

export interface GigiLocalState {
  mission: Mission;
  projects: Project[];
  history: HistoryEvent[];
  completedMissionIds: string[];
  postponedMissionIds: string[];
  rejectedMissionIds: string[];
  /** V0.5.4 — tasks / nextStep from last Gigi recommendation */
  executionHints?: MissionExecutionHints | null;
}

export const STORAGE_KEY = "gigi-os-v03-state";
