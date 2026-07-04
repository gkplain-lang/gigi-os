import type { DailyUseReadiness } from "./types";

export const V10_PROMISE = "Ouvre Gigi. Sache quoi faire. Exécute.";

export const V10_NO_AUTO_EXTERNAL_MESSAGE =
  "V1.0 — usage quotidien : aucune action externe automatique. Garde-fous dry-run conservés.";

export const V10_PHASE_LABEL = "Daily Use Release — usage quotidien stable";

export function getDailyUseReadiness(): DailyUseReadiness {
  return {
    promise: V10_PROMISE,
    missionAvailable: true,
    conversationAvailable: true,
    dailyReviewAvailable: true,
    feedbackAvailable: true,
  };
}
