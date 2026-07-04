import type { ActionPlan, ActionPlanStep } from "./types";

export function formatActionPlanStepsText(steps: ActionPlanStep[]): string[] {
  return steps.map((s) => `${s.order}. ${s.title} — ${s.description}`);
}

export function formatActionPlanSummary(plan: ActionPlan): string {
  const stepLines = plan.steps.map((s) => `${s.order}. ${s.title}`).join("\n");
  const deliverableLines = plan.deliverables.map((d) => `• ${d.title}`).join("\n");
  return [
    plan.title,
    plan.summary,
    "",
    "Étapes :",
    stepLines,
    "",
    "Livrables :",
    deliverableLines,
  ].join("\n");
}

export function formatDeliverablesList(plan: ActionPlan): string[] {
  return plan.deliverables.map((d) => d.title);
}
