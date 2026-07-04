import type { ExecutionReview } from "./types";
import { EXECUTION_REVIEW_DECISION_LABELS, EXECUTION_REVIEW_DISCLAIMER } from "./types";

export function formatExecutionReviewForCopy(review: ExecutionReview): string {
  const lines = [
    "# Execution Review — Gigi V2.2",
    "",
    `Décision recommandée : ${EXECUTION_REVIEW_DECISION_LABELS[review.decision]}`,
    `Confiance : ${review.confidence}%`,
    "",
    "Résumé :",
    review.summary,
    "",
  ];

  if (review.findings.length > 0) {
    lines.push("Constats :", "");
    for (const f of review.findings) {
      lines.push(`* ${f.title}${f.description ? ` — ${f.description}` : ""}`);
    }
    lines.push("");
  }

  if (review.validationChecklist.length > 0) {
    lines.push("Checklist :", "");
    for (const v of review.validationChecklist) {
      lines.push(`* ${v.required ? "[ ]" : "( )"} ${v.label}`);
    }
    lines.push("");
  }

  if (review.recommendedNextActions.length > 0) {
    lines.push("Prochaines actions :", "");
    for (const a of review.recommendedNextActions) {
      lines.push(`* ${a.label} — ${a.description}`);
      if (a.nextStepHint) lines.push(`  → ${a.nextStepHint}`);
    }
    lines.push("");
  }

  lines.push("Limite :", EXECUTION_REVIEW_DISCLAIMER);

  return lines.join("\n");
}
