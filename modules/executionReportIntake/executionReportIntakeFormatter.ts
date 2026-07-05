import type { ExecutionReportIntake } from "./types";
import {
  EXECUTION_REPORT_INTAKE_DECISION_LABELS,
  EXECUTION_REPORT_INTAKE_DISCLAIMER,
  EXECUTION_REPORT_INTAKE_REPORTER_LABELS,
  EXECUTION_REPORT_INTAKE_SOURCE_LABELS,
  EXECUTION_REPORT_INTAKE_STATUS_LABELS,
} from "./types";
import { buildParsedSummaryText } from "./executionReportIntakeEngine";

export function formatExecutionReportIntakeForCopy(intake: ExecutionReportIntake): string {
  const p = intake.parsedReport;
  const lines: string[] = [
    "# Execution Report Intake — Gigi V2.10",
    "",
    `Source : ${EXECUTION_REPORT_INTAKE_SOURCE_LABELS[intake.source]}`,
    `Reporter : ${EXECUTION_REPORT_INTAKE_REPORTER_LABELS[intake.reporter]}`,
    `Statut : ${EXECUTION_REPORT_INTAKE_STATUS_LABELS[intake.status]}`,
    `Décision locale : ${EXECUTION_REPORT_INTAKE_DECISION_LABELS[intake.decision]}`,
    `Confiance : ${intake.confidence}%`,
    "",
    "Résumé :",
    buildParsedSummaryText(intake),
    "",
  ];

  if (p.filesModified.length) {
    lines.push("Fichiers modifiés déclarés :", "");
    p.filesModified.forEach((f) => lines.push(`* ${f}`));
    lines.push("");
  }

  if (p.commandsRunManually.length) {
    lines.push("Commandes déclarées :", "");
    p.commandsRunManually.forEach((c) => lines.push(`* ${c}`));
    lines.push("");
  }

  if (p.testResults.length) {
    lines.push("Tests :", "");
    p.testResults.forEach((t) => lines.push(`* ${t}`));
    lines.push("");
  }

  if (p.blockers.length) {
    lines.push("Blocages :", "");
    p.blockers.forEach((b) => lines.push(`* ${b}`));
    lines.push("");
  }

  if (intake.proposedLogEntries.length) {
    lines.push("Entrées de log proposées :", "");
    intake.proposedLogEntries.forEach((e) => lines.push(`* [${e.type}] ${e.message}`));
    lines.push("");
  }

  if (intake.warnings.length) {
    lines.push("Warnings :", "");
    intake.warnings.forEach((w) => lines.push(`* ${w.label} — ${w.description}`));
    lines.push("");
  }

  if (intake.proposedReviewSummary) {
    lines.push("Review proposée :", intake.proposedReviewSummary, "");
  }

  lines.push(
    "Limite :",
    "Cette analyse est basée uniquement sur le rapport collé par l'utilisateur.",
    "Gigi ne vérifie pas Git, GitHub, les fichiers ou le build.",
    "",
    EXECUTION_REPORT_INTAKE_DISCLAIMER
  );

  return lines.join("\n");
}

export function formatParsedSummaryForCopy(intake: ExecutionReportIntake): string {
  return buildParsedSummaryText(intake);
}

export function formatNormalizedReportForCopy(intake: ExecutionReportIntake): string {
  const p = intake.parsedReport;
  return [
    "Rapport d'exécution normalisé (Gigi V2.10)",
    "",
    `Action exécutée : ${p.actionExecuted ?? "—"}`,
    `Date : ${p.executionDate ?? "—"}`,
    `Outil utilisé : ${p.toolUsed ?? EXECUTION_REPORT_INTAKE_REPORTER_LABELS[intake.reporter]}`,
    "",
    "Fichiers modifiés :",
    ...p.filesModified.map((f) => `* ${f}`),
    "",
    "Étapes réalisées :",
    ...p.stepsCompleted.map((s) => `* ${s}`),
    "",
    "Commandes lancées manuellement :",
    ...p.commandsRunManually.map((c) => `* ${c}`),
    "",
    "Tests lancés :",
    ...p.testsRun.map((t) => `* ${t}`),
    "",
    "Résultat des tests :",
    ...p.testResults.map((t) => `* ${t}`),
    "",
    "Blocages :",
    ...p.blockers.map((b) => `* ${b}`),
    "",
    "Corrections nécessaires :",
    ...p.fixesNeeded.map((f) => `* ${f}`),
    "",
    `Commit réalisé ? ${p.commitPerformed === undefined ? "—" : p.commitPerformed ? "oui" : "non"}`,
    `Hash commit : ${p.commitHash ?? "—"}`,
    "",
    `Rapport final : ${p.finalSummary ?? "—"}`,
    `Prochaine étape : ${p.nextStepRecommendation ?? "—"}`,
  ].join("\n");
}
