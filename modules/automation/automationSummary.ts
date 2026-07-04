import { detectAutomationProposals } from "./automationProposal";
import { DRY_RUN_AUTOMATIONS, FORBIDDEN_REAL_AUTOMATIONS } from "./automationRegistry";
import { V07_NO_EXECUTION_MESSAGE } from "./automationSafety";
import type { AutomationFoundationSummary, AutomationProposal } from "./types";

export function buildExampleAutomationProposal(): AutomationProposal {
  const detection = detectAutomationProposals(
    "Gigi, automatise la revue du jour tous les matins"
  );
  return detection.proposals[0]!;
}

export function summarizeAutomationFoundation(): AutomationFoundationSummary {
  return {
    version: "0.7.0",
    dryRunOnly: true,
    n8nConnected: false,
    externalExecutionBlocked: true,
    availableAutomations: [...DRY_RUN_AUTOMATIONS],
    forbiddenAutomations: [...FORBIDDEN_REAL_AUTOMATIONS],
    exampleProposal: buildExampleAutomationProposal(),
  };
}

export function formatAutomationDevStatus(): string {
  return V07_NO_EXECUTION_MESSAGE;
}

export function listDryRunAutomationLabels(): string[] {
  return DRY_RUN_AUTOMATIONS.map((t) => t.replace(/_/g, " "));
}

export function listForbiddenAutomationLabels(): string[] {
  return FORBIDDEN_REAL_AUTOMATIONS.map((t) => t.replace(/_/g, " "));
}
