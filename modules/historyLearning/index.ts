export type {
  HistoryLearningEntry,
  HistoryLearningEntryStatus,
  HistoryLearningEntrySource,
  HistoryLearningOutcome,
  HistoryLearningSignal,
  HistoryLearningSignalType,
  HistoryLearningNote,
  RecommendedFutureBehavior,
  HistoryLearningSeverity,
  HistoryLearningState,
  HistoryLearningGlobalSummary,
  HistoryLearningIntent,
} from "./types";

export {
  HISTORY_LEARNING_STORAGE_KEY,
  HISTORY_LEARNING_DISCLAIMER,
  HISTORY_STATUS_LABELS,
  HISTORY_OUTCOME_LABELS,
} from "./types";

export {
  HISTORY_LEARNING_EMPTY_SUMMARY,
  HISTORY_LEARNING_GUIDANCE,
} from "./historyLearningSummary";

export {
  loadHistoryLearningState,
  saveHistoryLearningState,
  upsertHistoryEntry,
  getHistoryEntryById,
  listHistoryEntries,
  archiveHistoryEntry,
  deleteHistoryEntry,
} from "./historyLearningStore";

export {
  buildSignalsFromSources,
  buildLearningsFromSignals,
  buildRecommendedBehaviors,
  buildEntryFromReview,
  buildEntryFromLog,
  buildEntryFromFollowUp,
} from "./historyLearningEngine";

export {
  formatHistoryEntryForCopy,
  formatGlobalHistorySummaryForCopy,
} from "./historyLearningFormatter";

export {
  detectHistoryLearningIntent,
  createHistoryEntryFromReview,
  createHistoryEntryFromLog,
  createHistoryEntryFromFollowUp,
  createManualHistoryEntry,
  addLearningNoteToEntry,
  archiveHistoryEntryById,
  generateGlobalSummary,
  getCopyableEntryText,
  getCopyableGlobalSummaryText,
  buildHistoryLearningGuidanceHints,
  previewHistoryEntryFromReview,
  previewHistoryEntryFromFollowUp,
} from "./historyLearningService";
