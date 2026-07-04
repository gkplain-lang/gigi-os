import type { IntegrationDryRunResult, IntegrationProposal } from "./types";
import { simulateGitHubDryRun } from "./github/githubDryRun";
import { assertIntegrationDryRunOnly } from "./integrationSafety";

export function confirmIntegrationDryRunLocally(
  proposal: IntegrationProposal
): IntegrationDryRunResult {
  assertIntegrationDryRunOnly(proposal.dryRunOnly);

  if (proposal.integrationId === "github" && proposal.githubAction) {
    return simulateGitHubDryRun(proposal);
  }

  return {
    proposalId: proposal.id,
    integrationId: proposal.integrationId,
    dryRun: true,
    executed: false,
    simulatedSteps: proposal.planSteps,
    summary: proposal.expectedOutcome,
  };
}
