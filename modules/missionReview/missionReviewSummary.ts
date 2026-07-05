import { listDailyMissionReviews } from "./missionReviewBuilder";
import type { MissionReviewGlobalSummary } from "./missionReviewTypes";
import { NEXT_DECISION_LABELS } from "./missionReviewTypes";

export function generateMissionReviewSummary(): MissionReviewGlobalSummary {
  const all = listDailyMissionReviews();
  const active = all.filter(
    (r) => !["cancelled", "completed_by_human"].includes(r.status)
  );
  const completedByHumanCount = all.filter(
    (r) => r.status === "completed_by_human" || r.completedByHuman
  ).length;
  const latest = all[0];

  let summaryText: string;
  if (latest) {
    summaryText = `Dernière revue : « ${latest.missionTitle} » — ${
      latest.recommendedNextAction || NEXT_DECISION_LABELS[latest.nextDecision]
    }.`;
  } else if (active.length > 0) {
    summaryText = `${active.length} revue(s) en cours — fais le bilan local de ta mission du jour.`;
  } else {
    summaryText =
      "Aucune revue de mission — crée-en une après ta mission du jour pour choisir la décision suivante.";
  }

  return {
    totalReviews: all.length,
    activeReviews: active.length,
    lastDecision: latest?.nextDecision,
    completedByHumanCount,
    summaryText,
  };
}
