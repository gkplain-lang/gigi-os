import { buildBetaChecklist, countChecklistPassed, countChecklistManual } from "./betaChecklist";
import { countBetaFeedback } from "./betaFeedback";
import {
  getBetaGuardrails,
  getCriticalRoutes,
  KNOWN_BETA_RISKS,
  NEXT_BETA_VALIDATIONS,
  V09_NO_AUTO_EXTERNAL_MESSAGE,
  V09_PHASE_LABEL,
} from "./betaGuardrails";
import { getKeyModulesHealth } from "./betaHealth";
import type { BetaReadinessSummary } from "./types";

export function summarizeBetaReadiness(): BetaReadinessSummary {
  const checklist = buildBetaChecklist();
  return {
    version: "0.9.0",
    phase: "private_beta",
    guardrails: getBetaGuardrails(),
    checklist,
    moduleHealth: getKeyModulesHealth(),
    criticalRoutes: getCriticalRoutes(),
    knownRisks: [...KNOWN_BETA_RISKS],
    nextValidations: [...NEXT_BETA_VALIDATIONS],
    feedbackCount: countBetaFeedback(),
  };
}

export function formatBetaDevStatus(): string {
  return V09_NO_AUTO_EXTERNAL_MESSAGE;
}

export function betaChecklistScore(): { passed: number; manual: number; total: number } {
  const checklist = buildBetaChecklist();
  return {
    passed: countChecklistPassed(checklist),
    manual: countChecklistManual(checklist),
    total: checklist.length,
  };
}

export { V09_PHASE_LABEL, V09_NO_AUTO_EXTERNAL_MESSAGE };
