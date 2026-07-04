export type {
  ActionProposal,
  ActionRiskLevel,
  AgentActionType,
  AgentFoundationSummary,
  DryRunActionType,
  DryRunResult,
  ForbiddenRealActionType,
} from "./types";

export {
  ACTIVE_MAX_AUTONOMY_LEVEL,
  AUTONOMY_LEVEL_LABELS,
  AUTONOMY_LEVEL_ORDER,
  isAutonomyLevelAllowed,
  type AutonomyLevel,
} from "./autonomyLevels";

export {
  DRY_RUN_ACTIONS,
  DRY_RUN_ACTION_LABELS,
  FORBIDDEN_ACTION_LABELS,
  FORBIDDEN_REAL_ACTIONS,
  isDryRunAction,
  isForbiddenRealAction,
} from "./actionRegistry";

export { GIGI_AGENT_PROFILE } from "./agentRegistry";

export {
  V06_BLOCKED_MESSAGE,
  assertNoExternalExecution,
  blockedReasonForForbidden,
  canPrepareAction,
  isRealExecutionForbidden,
} from "./actionSafety";

export { executeActionDryRun } from "./actionDryRun";

export {
  applyAgentProposals,
  detectActionProposals,
  type ActionDetectionResult,
} from "./actionProposal";

export {
  buildExampleProposal,
  formatAutonomyLabel,
  listAllowedActionLabels,
  listForbiddenActionLabels,
  summarizeAgentFoundation,
} from "./actionSummary";

export type { ConfirmationStatus } from "./types";

export {
  applyConfirmationDefaults,
  buildConfirmationViewModel,
  cancelConfirmation,
  confirmDryRunLocally,
  confirmationStatusLabel,
  summarizeConfirmationUx,
  V062_NO_EXTERNAL_MESSAGE,
  V062_REAL_BLOCKED_MESSAGE,
} from "./confirmation";
