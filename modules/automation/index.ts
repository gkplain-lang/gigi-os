export type {
  AutomationDryRunResult,
  AutomationFoundationSummary,
  AutomationIntentRecord,
  AutomationProposal,
  AutomationType,
  DryRunAutomationType,
  ForbiddenRealAutomationType,
  TriggerType,
} from "./types";

export {
  DRY_RUN_AUTOMATIONS,
  DRY_RUN_AUTOMATION_LABELS,
  FORBIDDEN_AUTOMATION_LABELS,
  FORBIDDEN_REAL_AUTOMATIONS,
  isDryRunAutomation,
  isForbiddenAutomation,
} from "./automationRegistry";

export {
  V07_BLOCKED_REAL_MESSAGE,
  V07_NO_EXECUTION_MESSAGE,
  assertAutomationDryRunOnly,
  blockedReasonForForbidden,
  rejectsRealExecution,
} from "./automationSafety";

export { permissionsForAutomation, formatPermissionsList } from "./automationPermissions";

export {
  buildAutomationSteps,
  buildExpectedOutcome,
  describeTrigger,
  inferTriggerType,
  blockedActionsForType,
} from "./automationPlan";

export { isAutomationIntent, supersedesActionProposal } from "./automationIntent";

export {
  applyAutomationProposals,
  detectAutomationProposals,
  type AutomationDetectionResult,
} from "./automationProposal";

export {
  confirmAutomationDryRunLocally,
  executeAutomationDryRun,
  simulateAutomationDryRun,
  simulateForbiddenAutomationPlan,
} from "./automationDryRun";

export {
  buildExampleAutomationProposal,
  formatAutomationDevStatus,
  listDryRunAutomationLabels,
  listForbiddenAutomationLabels,
  summarizeAutomationFoundation,
} from "./automationSummary";
