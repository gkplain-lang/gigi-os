import type { MissionDecision, MissionDecisionCandidate } from "./types";
import {
  MISSION_DECISION_DISCLAIMER,
  MISSION_DECISION_STATUS_LABELS,
} from "./types";

export function formatMissionDecisionForCopy(decision: MissionDecision): string {
  const selected = decision.candidates.find((c) => c.id === decision.selectedCandidateId);
  const top = selected ?? decision.candidates[0];

  const lines = [
    "# Mission Decision — Gigi V2.6",
    "",
    `Date : ${decision.date}`,
    `Décision : ${decision.status}`,
    MISSION_DECISION_STATUS_LABELS[decision.status],
    "",
  ];

  if (top) {
    lines.push(
      `Mission choisie : ${decision.finalUserChoice ?? top.title}`,
      `Score : ${top.score}/100`,
      `Confiance : ${top.confidence}%`,
      "",
      "Pourquoi cette mission :",
      ...(top.reasons.length > 0
        ? top.reasons.map((r) => `* ${r.label} — ${r.description}`)
        : ["* Score indicatif — peu de données locales."]),
      "",
      "Risques :",
      ...(top.risks.length > 0
        ? top.risks.map((r) => `* ${r.label} — ${r.description}`)
        : ["* Aucun risque majeur détecté localement."])
    );

    if (top.validationChecklist.length > 0) {
      lines.push("", "Checklist de validation :");
      top.validationChecklist.forEach((v) => lines.push(`* ${v}`));
    }
  }

  lines.push("", "Résumé :", decision.recommendationSummary);

  if (decision.userNote) {
    lines.push("", "Note utilisateur :", decision.userNote);
  }

  lines.push("", "Limite :", MISSION_DECISION_DISCLAIMER);

  return lines.join("\n");
}

export function formatMissionDecisionHistoryForCopy(decisions: MissionDecision[]): string {
  const lines = [
    "# Mission Decisions — Synthèse · Gigi V2.6",
    "",
    `${decisions.length} décision(s) locale(s)`,
    "",
  ];

  for (const d of decisions.slice(0, 10)) {
    const title =
      d.finalUserChoice ??
      d.candidates.find((c) => c.id === d.selectedCandidateId)?.title ??
      d.candidates[0]?.title ??
      "—";
    lines.push(
      `* ${d.date} — ${MISSION_DECISION_STATUS_LABELS[d.status]} — ${title}`
    );
  }

  lines.push("", "Limite :", MISSION_DECISION_DISCLAIMER);
  return lines.join("\n");
}

export function formatCandidateComparison(candidates: MissionDecisionCandidate[]): string {
  return candidates
    .map(
      (c, i) =>
        `${i + 1}. ${c.title} — ${c.score}/100 (conf. ${c.confidence}%) — ${c.metadata?.projectName ?? c.projectId ?? ""}`
    )
    .join("\n");
}
