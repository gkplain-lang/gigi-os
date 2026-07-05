import type { ClosedLoopLifecycle } from "./types";
import {
  CLOSED_LOOP_LIFECYCLE_DISCLAIMER,
  CLOSED_LOOP_LIFECYCLE_HEALTH_LABELS,
  CLOSED_LOOP_LIFECYCLE_STAGE_LABELS,
  CLOSED_LOOP_LIFECYCLE_STATUS_LABELS,
} from "./types";

export function formatClosedLoopLifecycleForCopy(lifecycle: ClosedLoopLifecycle): string {
  const lines: string[] = [
    "# Closed Loop Action Lifecycle — Gigi V2.11",
    "",
    `Cycle : ${lifecycle.title.replace(/^Cycle · /, "")}`,
    `Statut : ${CLOSED_LOOP_LIFECYCLE_STATUS_LABELS[lifecycle.status]}`,
    `Santé : ${CLOSED_LOOP_LIFECYCLE_HEALTH_LABELS[lifecycle.health]}`,
    "",
    "Résumé :",
    lifecycle.summary,
    "",
  ];

  if (lifecycle.completedStages.length) {
    lines.push("Étapes complétées :", "");
    lifecycle.completedStages.forEach((s) => lines.push(`* ${CLOSED_LOOP_LIFECYCLE_STAGE_LABELS[s]}`));
    lines.push("");
  }

  if (lifecycle.missingStages.length) {
    lines.push("Étapes manquantes :", "");
    lifecycle.missingStages.forEach((s) => lines.push(`* ${CLOSED_LOOP_LIFECYCLE_STAGE_LABELS[s]}`));
    lines.push("");
  }

  if (lifecycle.nextSteps.length) {
    lines.push("Prochaines étapes recommandées :", "");
    lifecycle.nextSteps.forEach((s) => lines.push(`* ${s.label} — ${s.reason}`));
    lines.push("");
  }

  if (lifecycle.risks.length) {
    lines.push("Risques :", "");
    lifecycle.risks.forEach((r) => lines.push(`* ${r.label} — ${r.description}`));
    lines.push("");
  }

  if (lifecycle.learnings.length) {
    lines.push("Apprentissages :", "");
    lifecycle.learnings.forEach((l) => lines.push(`* ${l.label} — ${l.description}`));
    lines.push("");
  }

  lines.push(
    "Limite :",
    "Ce cycle est basé uniquement sur les données locales et déclaratives de Gigi.",
    "Aucune vérification Git, GitHub, fichier ou build n'est effectuée.",
    "",
    CLOSED_LOOP_LIFECYCLE_DISCLAIMER
  );

  return lines.join("\n");
}

export function formatNextStepsForCopy(lifecycle: ClosedLoopLifecycle): string {
  if (lifecycle.nextSteps.length === 0) return "Aucune prochaine étape recommandée.";
  return lifecycle.nextSteps
    .map((s, i) => `${i + 1}. ${s.label}\n   ${s.description}\n   (${s.reason})`)
    .join("\n\n");
}
