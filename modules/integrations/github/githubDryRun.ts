import type { IntegrationProposal } from "../types";
import type { IntegrationDryRunResult } from "../types";
import {
  buildGitHubExpectedOutcome,
  buildGitHubPlanSteps,
} from "./githubActions";

export function simulateGitHubDryRun(proposal: IntegrationProposal): IntegrationDryRunResult {
  const action = proposal.githubAction ?? "prepare_branch_plan";
  const steps = buildGitHubPlanSteps(action, { userMessage: proposal.description });

  return {
    proposalId: proposal.id,
    integrationId: "github",
    dryRun: true,
    executed: false,
    simulatedSteps: steps,
    summary: buildGitHubExpectedOutcome(action),
  };
}
