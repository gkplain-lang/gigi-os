import type { MissionRecommendationScore } from "./types";
import { MISSION_DECISION_LABELS, MISSION_FEEDBACK_DISCLAIMER } from "./types";

export function formatMissionFeedbackForCopy(
  missionTitle: string,
  score: MissionRecommendationScore
): string {
  const lines = [
    "# Mission Feedback — Gigi V2.5",
    "",
    `Mission : ${missionTitle}`,
    `Décision : ${score.decision}`,
    `Score : ${score.score}/100`,
    `Confiance : ${score.confidence}%`,
    "",
    "Pourquoi :",
    ...(score.reasons.length > 0
      ? score.reasons.map((r) => `* ${r}`)
      : ["* Peu de données locales — score indicatif."]),
    "",
    "Risques :",
    ...(score.risks.length > 0
      ? score.risks.map((r) => `* ${r}`)
      : ["* Aucun risque majeur détecté localement."]),
  ];

  if (score.suggestedRefinement) {
    lines.push("", "Clarification suggérée :", score.suggestedRefinement);
  }

  lines.push("", "Limite :", MISSION_FEEDBACK_DISCLAIMER);

  return lines.join("\n");
}

export function formatGlobalMissionFeedbackForCopy(
  summaryText: string,
  topScores: MissionRecommendationScore[],
  missionTitles: Record<string, string>
): string {
  const lines = [
    "# Mission Feedback — Synthèse globale · Gigi V2.5",
    "",
    summaryText,
    "",
  ];

  if (topScores.length > 0) {
    lines.push("Top missions (score local) :", "");
    for (const s of topScores.slice(0, 5)) {
      const title = missionTitles[s.missionId] ?? s.missionId;
      lines.push(
        `* ${title} — ${MISSION_DECISION_LABELS[s.decision]} (${s.score}/100)`
      );
    }
  }

  lines.push("", "Limite :", MISSION_FEEDBACK_DISCLAIMER);
  return lines.join("\n");
}
