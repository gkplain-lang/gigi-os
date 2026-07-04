import type { HistoryLearningEntry } from "./types";
import {
  HISTORY_LEARNING_DISCLAIMER,
  HISTORY_OUTCOME_LABELS,
  HISTORY_STATUS_LABELS,
} from "./types";

export function formatHistoryEntryForCopy(entry: HistoryLearningEntry): string {
  const lines = [
    "# History Entry — Gigi V2.4",
    "",
    `Titre : ${entry.title}`,
    `Statut : ${HISTORY_STATUS_LABELS[entry.status]}`,
    `Résultat : ${HISTORY_OUTCOME_LABELS[entry.outcome]}`,
    "",
    "Résumé :",
    entry.summary,
    "",
  ];

  if (entry.signals.length > 0) {
    lines.push("Signaux :", "");
    for (const s of entry.signals) {
      lines.push(`* ${s.label}${s.description ? ` — ${s.description}` : ""}`);
    }
    lines.push("");
  }

  if (entry.learnings.length > 0) {
    lines.push("Apprentissages :", "");
    for (const l of entry.learnings) {
      lines.push(`* ${l.title} : ${l.content}`);
    }
    lines.push("");
  }

  if (entry.recommendedFutureBehavior.length > 0) {
    lines.push("Recommandations futures :", "");
    for (const r of entry.recommendedFutureBehavior) {
      lines.push(`* ${r.label} — ${r.description}`);
    }
    lines.push("");
  }

  lines.push("Limite :", HISTORY_LEARNING_DISCLAIMER);
  return lines.join("\n");
}

export function formatGlobalHistorySummaryForCopy(
  entries: HistoryLearningEntry[],
  summaryText: string
): string {
  const lines = [
    "# Historique & apprentissage — Gigi V2.4",
    "",
    summaryText,
    "",
    `Entrées : ${entries.length}`,
    "",
  ];

  for (const entry of entries.slice(0, 10)) {
    lines.push(`## ${entry.title}`);
    lines.push(`Statut : ${HISTORY_STATUS_LABELS[entry.status]} · ${HISTORY_OUTCOME_LABELS[entry.outcome]}`);
    lines.push(entry.summary);
    lines.push("");
  }

  lines.push("Limite :", HISTORY_LEARNING_DISCLAIMER);
  return lines.join("\n");
}
