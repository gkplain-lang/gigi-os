export type {
  ActionConfirmationRecord,
  ConfirmationStatus,
  ConfirmationUxSummary,
  ConfirmationViewModel,
} from "./types";

export {
  applyConfirmationDefaults,
  cancelConfirmation,
  canConfirmDryRun,
  confirmDryRunLocally,
  expireConfirmation,
  getBlockedDisplayMessage,
  getInitialConfirmationStatus,
  isConfirmationTerminal,
} from "./confirmationState";

export {
  buildConfirmationViewModel,
  confirmationStatusLabel,
  CONFIRMATION_STATUS_LABELS,
  V062_NO_EXTERNAL_MESSAGE,
  V062_REAL_BLOCKED_MESSAGE,
} from "./confirmationCopy";

export {
  assertConfirmationSafe,
  canTransitionToConfirmed,
  rejectsRealExecution,
} from "./confirmationSafety";

export {
  formatConfirmationDevStatus,
  summarizeConfirmationUx,
} from "./confirmationSummary";
