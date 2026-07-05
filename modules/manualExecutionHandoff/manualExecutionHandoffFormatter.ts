import type { ManualExecutionHandoff } from "./types";
import {
  MANUAL_EXECUTION_HANDOFF_DISCLAIMER,
  MANUAL_EXECUTION_HANDOFF_STATUS_LABELS,
  MANUAL_EXECUTION_HANDOFF_TARGET_LABELS,
} from "./types";

function sectionContent(handoff: ManualExecutionHandoff, type: string): string | undefined {
  return handoff.sections.find((s) => s.type === type)?.content;
}

export function formatManualExecutionHandoffForCopy(handoff: ManualExecutionHandoff): string {
  const actionTitle = handoff.title.replace(/^Handoff · /, "");

  const lines = [
    "# Manual Execution Handoff — Gigi V2.9",
    "",
    `Cible : ${MANUAL_EXECUTION_HANDOFF_TARGET_LABELS[handoff.target]}`,
    `Statut : ${MANUAL_EXECUTION_HANDOFF_STATUS_LABELS[handoff.status]}`,
    "",
    "Action :",
    actionTitle,
    "",
    "Objectif :",
    handoff.objective,
    "",
    "Périmètre :",
    "",
    ...handoff.scope.split(" · ").map((s) => (s.startsWith("*") ? s : `* ${s}`)),
    "",
    "Contexte :",
    "",
    handoff.contextSummary
      .split(" · ")
      .map((s) => `* ${s}`)
      .join("\n"),
    "",
    "Règles de sécurité :",
    "",
    ...(sectionContent(handoff, "safety_rules")?.split("\n") ?? []),
    "",
  ];

  const steps = sectionContent(handoff, "manual_steps");
  if (steps) {
    lines.push("Étapes :", "", steps, "");
  }

  const tests = sectionContent(handoff, "tests");
  if (tests) {
    lines.push("Tests :", "", tests, "");
  }

  const commands = sectionContent(handoff, "theoretical_commands");
  if (commands) {
    lines.push("Commandes théoriques :", "", commands, "");
  }

  const rollback = sectionContent(handoff, "rollback");
  if (rollback) {
    lines.push("Rollback :", "", rollback, "");
  }

  if (handoff.risks.length > 0) {
    lines.push("Risques :", "");
    handoff.risks.forEach((r) => lines.push(`* ${r.label} — ${r.description}`));
    lines.push("");
  }

  lines.push("Checklist :", "");
  handoff.checklist.forEach((c) => {
    lines.push(`${c.completed ? "[x]" : "[ ]"} ${c.label}`);
  });

  lines.push("", "Rapport attendu :", handoff.expectedReportTemplate, "", "Limite :", MANUAL_EXECUTION_HANDOFF_DISCLAIMER);

  return lines.join("\n");
}

export function formatCursorPromptForCopy(handoff: ManualExecutionHandoff): string {
  return handoff.cursorPrompt ?? formatManualExecutionHandoffForCopy(handoff);
}

export function formatChecklistHandoffForCopy(handoff: ManualExecutionHandoff): string {
  const lines = [
    "# Checklist handoff — Gigi V2.9",
    "",
    handoff.title.replace(/^Handoff · /, ""),
    "",
  ];
  handoff.checklist.forEach((c) => {
    lines.push(`${c.completed ? "[x]" : "[ ]"} ${c.label}`);
  });
  lines.push("", MANUAL_EXECUTION_HANDOFF_DISCLAIMER);
  return lines.join("\n");
}

export function formatExpectedReportForCopy(handoff: ManualExecutionHandoff): string {
  return handoff.expectedReportTemplate;
}

export function formatHandoffListForCopy(handoffs: ManualExecutionHandoff[]): string {
  const lines = [
    "# Manual Execution Handoffs — Synthèse · Gigi V2.9",
    "",
    `${handoffs.length} handoff(s) local(aux)`,
    "",
  ];
  for (const h of handoffs.slice(0, 10)) {
    lines.push(
      `* ${h.title.replace(/^Handoff · /, "")} — ${MANUAL_EXECUTION_HANDOFF_TARGET_LABELS[h.target]} — ${MANUAL_EXECUTION_HANDOFF_STATUS_LABELS[h.status]}`
    );
  }
  lines.push("", "Limite :", MANUAL_EXECUTION_HANDOFF_DISCLAIMER);
  return lines.join("\n");
}
