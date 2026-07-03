import type { HistoryEvent } from "../history/historyTypes";
import type { Mission } from "../missions/missionTypes";
import type { Project } from "../projects/projectTypes";

export interface GigiLocalState {
  mission: Mission;
  projects: Project[];
  history: HistoryEvent[];
  completedMissionIds: string[];
  postponedMissionIds: string[];
  rejectedMissionIds: string[];
}

export const STORAGE_KEY = "gigi-os-v03-state";
