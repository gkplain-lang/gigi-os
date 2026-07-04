import type { ExecutionPlan } from "./types";

export function formatExecutionPlanForCopy(plan: ExecutionPlan): string {
  const lines = [
    `# Plan d'exécution — ${plan.title}`,
    "",
    plan.summary,
    "",
    `Objectif : ${plan.objective}`,
    `Mode : ${plan.executionMode}`,
    "",
    "## Prérequis",
    ...plan.prerequisites.map((p) => `- ${p.label}: ${p.description}`),
    "",
    "## Étapes",
    ...plan.steps.map((s) => `${s.order}. [${s.actor}] ${s.title} — ${s.description}`),
    "",
    "## Commandes (manuelles uniquement)",
    ...plan.commands.map((c) => `- \`${c.command}\` — ${c.description}`),
    "",
    "## Tests",
    ...plan.tests.map((t) => `- ${t.label}${t.command ? `: \`${t.command}\`` : ""}`),
    "",
    "## Rollback",
    ...plan.rollbackPlan.map((r) => `- ${r.title}: ${r.description}`),
    "",
    "## Validation",
    ...plan.validationChecklist.map((v) => `- [ ] ${v.label}`),
    "",
    "## Rapport attendu",
    ...plan.expectedReport.map((r) => `- ${r}`),
  ];
  return lines.join("\n");
}
