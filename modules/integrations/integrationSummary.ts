import { detectIntegrationProposals } from "./integrationProposal";
import { AVAILABLE_INTEGRATIONS } from "./integrationRegistry";
import { getIntegrationStatus } from "./integrationStatus";
import { V08_NO_API_MESSAGE } from "./integrationSafety";
import type { IntegrationFoundationSummary } from "./types";

export function buildExampleIntegrationProposal() {
  const detection = detectIntegrationProposals("Gigi, prépare une branche GitHub pour V0.8");
  return detection.proposals[0]!;
}

export function summarizeIntegrationFoundation(): IntegrationFoundationSummary {
  return {
    version: "0.8.0",
    dryRunOnly: true,
    externalApiCallsBlocked: true,
    githubStatus: getIntegrationStatus("github"),
    availableIntegrations: [...AVAILABLE_INTEGRATIONS],
    exampleProposal: buildExampleIntegrationProposal(),
  };
}

export function formatIntegrationDevStatus(): string {
  return V08_NO_API_MESSAGE;
}
