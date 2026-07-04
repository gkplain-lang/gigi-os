import { buildReleaseChecklist, countReleaseManual, countReleasePassed } from "./releaseChecklist";
import { getDailyUseReadiness, V10_NO_AUTO_EXTERNAL_MESSAGE, V10_PROMISE } from "./dailyUseReadiness";
import { getReleaseModuleHealth } from "./releaseHealth";
import {
  getReleaseGuardrails,
  KNOWN_V10_RISKS,
  MANUAL_V10_VALIDATIONS,
} from "./releaseRisks";
import { getCriticalRouteHealth } from "./routeHealth";
import type { ReleaseReadinessSummary } from "./types";

export function summarizeReleaseReadiness(): ReleaseReadinessSummary {
  const checklist = buildReleaseChecklist();
  return {
    version: "1.0.0",
    phase: "daily_use",
    promise: V10_PROMISE,
    guardrails: getReleaseGuardrails(),
    dailyUse: getDailyUseReadiness(),
    checklist,
    routes: getCriticalRouteHealth(),
    modules: getReleaseModuleHealth(),
    knownRisks: [...KNOWN_V10_RISKS],
    manualValidations: [...MANUAL_V10_VALIDATIONS],
  };
}

export function formatReleaseDevStatus(): string {
  return V10_NO_AUTO_EXTERNAL_MESSAGE;
}

export function releaseChecklistScore(): { passed: number; manual: number; total: number } {
  const checklist = buildReleaseChecklist();
  return {
    passed: countReleasePassed(checklist),
    manual: countReleaseManual(checklist),
    total: checklist.length,
  };
}

export { V10_PROMISE, V10_NO_AUTO_EXTERNAL_MESSAGE };
