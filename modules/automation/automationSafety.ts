import type { AutomationType } from "./types";
import { isForbiddenAutomation } from "./automationRegistry";

export const V07_NO_EXECUTION_MESSAGE =
  "V0.7 — aucune automatisation réelle ne sera exécutée. n8n non branché.";

export const V07_BLOCKED_REAL_MESSAGE =
  "Je peux préparer le plan d'automatisation, mais je ne peux pas l'exécuter automatiquement en V0.7.";

export function assertAutomationDryRunOnly(automationType: AutomationType): void {
  if (isForbiddenAutomation(automationType)) {
    throw new Error(`Real automation blocked for ${automationType} in V0.7`);
  }
}

export function blockedReasonForForbidden(automationType: AutomationType): string {
  return `Automatisation réelle « ${automationType} » interdite en V0.7. ${V07_BLOCKED_REAL_MESSAGE}`;
}

export function rejectsRealExecution(): true {
  return true;
}
