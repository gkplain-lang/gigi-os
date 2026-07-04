import type { DailyUseReadiness } from "./types";

import { PRODUCT_PROMISE } from "@/lib/branding";

export const V10_PROMISE = PRODUCT_PROMISE;

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
