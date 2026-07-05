export type {
  ExecutionReportIntakeStatus,
  ExecutionReportIntakeSource,
  ExecutionReportIntakeReporter,
  ExecutionReportIntakeDecision,
  ExecutionReportIntakeSectionType,
  ExecutionReportIntakeWarningType,
  ExecutionReportIntakeSeverity,
  ParsedExecutionReport,
  ProposedLogEntry,
  ExecutionReportIntakeWarning,
  ExecutionReportIntakeSection,
  ExecutionReportIntake,
  ExecutionReportIntakeState,
  ExecutionReportIntakeGlobalSummary,
  ExecutionReportIntakeIntent,
} from "./types";

export {
  EXECUTION_REPORT_INTAKE_STORAGE_KEY,
  EXECUTION_REPORT_INTAKE_VERSION,
  EXECUTION_REPORT_INTAKE_ID_PREFIX,
  EXECUTION_REPORT_INTAKE_DISCLAIMER,
  EXECUTION_REPORT_INTAKE_STATUS_LABELS,
  EXECUTION_REPORT_INTAKE_SOURCE_LABELS,
  EXECUTION_REPORT_INTAKE_REPORTER_LABELS,
  EXECUTION_REPORT_INTAKE_DECISION_LABELS,
} from "./types";

export {
  EXECUTION_REPORT_INTAKE_EMPTY_SUMMARY,
  EXECUTION_REPORT_INTAKE_GUIDANCE,
  buildExecutionReportIntakeGuidanceHints,
} from "./executionReportIntakeSummary";

export {
  loadExecutionReportIntakeState,
  upsertExecutionReportIntake,
  getExecutionReportIntakeById,
  getIntakesBySourceHandoffId,
  getIntakesBySourceWorkspaceId,
  getIntakesBySourceActionId,
  listExecutionReportIntakes,
  archiveExecutionReportIntake,
} from "./executionReportIntakeStore";

export { parseExecutionReportText } from "./executionReportIntakeParser";

export {
  buildProposedLogEntries,
  buildParsedSummaryText,
  buildProposedReviewSummary,
} from "./executionReportIntakeEngine";

export {
  formatExecutionReportIntakeForCopy,
  formatParsedSummaryForCopy,
  formatNormalizedReportForCopy,
} from "./executionReportIntakeFormatter";

export {
  detectExecutionReportIntakeIntent,
  createIntakeFromHandoff,
  createIntakeFromWorkspace,
  createIntakeFromQueuedAction,
  parseIntakeRawReport,
  applyProposedLogEntries,
  generateProposedReview,
  markLinkedHandoffReportReceived,
  addIntakeUserNote,
  archiveIntake,
  getCopyableIntakeText,
  getCopyableParsedSummary,
  getCopyableNormalizedReport,
  generateGlobalIntakeSummary,
} from "./executionReportIntakeService";
