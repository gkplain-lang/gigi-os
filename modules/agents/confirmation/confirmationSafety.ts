import { isForbiddenRealAction } from "../actionRegistry";
import { assertNoExternalExecution } from "../actionSafety";
import type { ActionProposal } from "../types";
import type { ConfirmationStatus } from "./types";

export function assertConfirmationSafe(proposal: ActionProposal): void {
  if (isForbiddenRealAction(proposal.actionType)) {
    assertNoExternalExecution(proposal.actionType);
  }
  if (!proposal.dryRunOnly) {
    throw new Error("V0.6.2: only dry-run confirmations allowed");
  }
}

export function canTransitionToConfirmed(status: ConfirmationStatus): boolean {
  return status === "pending_confirmation";
}

export function rejectsRealExecution(): true {
  return true;
}
