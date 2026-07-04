import type { Mission } from "@/modules/missions/missionTypes";
import type { DailyUseStripSummary } from "./types";
import { getNextActionHint, missionStatusToPhase } from "./dailyUseHints";
import { DAILY_REVIEW_PROMPT } from "./dailyUseCopy";

export function buildDailyUseStripSummary(mission: Mission): DailyUseStripSummary {
  return {
    missionTitle: mission.title,
    projectName: mission.projectName,
    phase: missionStatusToPhase(mission.status),
    nextAction: getNextActionHint(mission.status),
    reviewPrompt: DAILY_REVIEW_PROMPT,
  };
}
