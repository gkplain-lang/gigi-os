import type { AutomationDryRunResult, AutomationProposal, AutomationType } from "./types";
import { isForbiddenAutomation } from "./automationRegistry";
import { blockedReasonForForbidden } from "./automationSafety";

export function executeAutomationDryRun(proposal: AutomationProposal): AutomationDryRunResult {
  return {
    proposalId: proposal.id,
    automationType: proposal.automationType,
    dryRun: true,
    executed: false,
    simulatedSteps: proposal.steps,
    summary: proposal.expectedOutcome,
  };
}

export function simulateForbiddenAutomationPlan(
  proposal: AutomationProposal
): AutomationDryRunResult {
  return {
    proposalId: proposal.id,
    automationType: proposal.automationType,
    dryRun: true,
    executed: false,
    simulatedSteps: [
      "Documenter la demande bloquée",
      "Proposer alternative manuelle",
      "Confirmer : V0.7 dry-run uniquement",
    ],
    summary: `[Dry-run plan] ${proposal.title} — exécution réelle bloquée.`,
  };
}

export function simulateAutomationDryRun(proposal: AutomationProposal): AutomationDryRunResult {
  if (isForbiddenAutomation(proposal.automationType)) {
    return simulateForbiddenAutomationPlan(proposal);
  }
  return executeAutomationDryRun(proposal);
}

export function confirmAutomationDryRunLocally(
  proposal: AutomationProposal
): AutomationDryRunResult {
  if (!proposal.dryRunOnly) {
    throw new Error("V0.7: only dry-run automation allowed");
  }
  return simulateAutomationDryRun(proposal);
}
