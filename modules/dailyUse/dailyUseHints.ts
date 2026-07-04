import type { MissionStatus } from "@/modules/missions/missionTypes";
import type { DailyUseMissionPhase, DailyUseNextAction } from "./types";
import { DAILY_REVIEW_PROMPT, PAGE_META } from "./dailyUseCopy";

export function missionStatusToPhase(status: MissionStatus): DailyUseMissionPhase {
  if (status === "in_progress") return "in_progress";
  if (status === "completed") return "completed";
  if (status === "postponed" || status === "rejected_for_now") return "resting";
  return "recommended";
}

export function getNextActionHint(status: MissionStatus): DailyUseNextAction {
  switch (status) {
    case "in_progress":
      return {
        label: "Prochaine étape",
        hint: "Coche tes tâches ou termine la mission quand c'est fait.",
        emphasis: "primary",
      };
    case "recommended":
      return {
        label: "À faire maintenant",
        hint: "Démarre la mission ou parle à Gigi si tu veux ajuster.",
        emphasis: "primary",
      };
    case "completed":
      return {
        label: "Suite",
        hint: "Demande la prochaine mission ou fais ton bilan du jour.",
        emphasis: "secondary",
      };
    case "postponed":
    case "rejected_for_now":
      return {
        label: "Reprendre",
        hint: "Parle à Gigi pour une autre priorité — rien n'est perdu.",
        emphasis: "secondary",
      };
    default:
      return {
        label: "Prochaine action",
        hint: "Parle à Gigi pour la suite.",
        emphasis: "neutral",
      };
  }
}

export function getMissionPageMeta(status: MissionStatus): string {
  const phase = missionStatusToPhase(status);
  return PAGE_META.mission[phase];
}

export function getDailyReviewHref(): string {
  const encoded = encodeURIComponent(DAILY_REVIEW_PROMPT);
  return `/conversation?ask=${encoded}`;
}

export function getConversationAskHref(prompt: string): string {
  return `/conversation?ask=${encodeURIComponent(prompt)}`;
}
