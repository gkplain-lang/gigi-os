export type {
  ExecutionLog,
  ExecutionLogEntry,
  ExecutionLogEntryType,
  ExecutionLogStatus,
  ExecutionLogsState,
  ExecutionLogSummary,
  ExecutionLogIntent,
} from "./types";

export {
  EXECUTION_LOGS_STORAGE_KEY,
  EXECUTION_LOG_STATUS_LABELS,
  EXECUTION_LOG_ENTRY_LABELS,
} from "./types";

export {
  EXECUTION_LOG_MANUAL_DISCLAIMER,
  EXECUTION_LOG_GUIDANCE_MESSAGE,
  EXECUTION_LOG_EMPTY_SUMMARY,
} from "./executionLogSummary";

export {
  loadExecutionLogsState,
  saveExecutionLogsState,
  upsertExecutionLog,
  getExecutionLogByPlanId,
  getExecutionLogByQueuedActionId,
} from "./executionLogStore";

export {
  detectExecutionLogIntent,
  createExecutionLogForPlan,
  getOrCreateExecutionLog,
  markLogStarted,
  addLogNote,
  markStepCompleted,
  markTestPassed,
  markTestFailed,
  markLogBlocked,
  markFixNeeded,
  markManualCommit,
  markLogCompletedManually,
  markLogAbandoned,
  summarizeExecutionLog,
} from "./executionLogService";

export { formatExecutionLogForCopy } from "./executionLogFormatter";
