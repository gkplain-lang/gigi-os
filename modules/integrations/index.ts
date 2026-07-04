export type {
  IntegrationDryRunResult,
  IntegrationFoundationSummary,
  IntegrationId,
  IntegrationProposal,
  IntegrationStatus,
} from "./types";

export { AVAILABLE_INTEGRATIONS, INTEGRATION_LABELS } from "./integrationRegistry";

export {
  formatIntegrationStatusLabel,
  getIntegrationStatus,
} from "./integrationStatus";

export {
  V08_BLOCKED_REAL_MESSAGE,
  V08_NO_API_MESSAGE,
  assertIntegrationDryRunOnly,
  blockedReasonForGitHubForbidden,
  rejectsRealIntegrationExecution,
} from "./integrationSafety";

export { permissionsForIntegration, formatPermissionsList } from "./integrationPermissions";

export { confirmIntegrationDryRunLocally } from "./integrationDryRun";

export {
  applyIntegrationProposals,
  detectIntegrationProposals,
  type IntegrationDetectionResult,
} from "./integrationProposal";

export {
  buildExampleIntegrationProposal,
  formatIntegrationDevStatus,
  summarizeIntegrationFoundation,
} from "./integrationSummary";

export * from "./github";
