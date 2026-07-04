import { V062_NO_EXTERNAL_MESSAGE, V062_REAL_BLOCKED_MESSAGE } from "./confirmationCopy";
import { simulateActionDryRun } from "../actionDryRun";
import type { ActionProposal } from "../types";
import type { ActionConfirmationRecord, ConfirmationStatus } from "./types";

export function getInitialConfirmationStatus(proposal: ActionProposal): ConfirmationStatus {
  if (proposal.confirmationStatus) return proposal.confirmationStatus;
  if (proposal.blockedReason) return "blocked";
  return "pending_confirmation";
}

export function applyConfirmationDefaults(proposal: ActionProposal): ActionProposal {
  const status = getInitialConfirmationStatus(proposal);
  return {
    ...proposal,
    confirmationRequired: true,
    confirmationStatus: status,
    dryRunOnly: true,
  };
}

export function confirmDryRunLocally(proposal: ActionProposal): ActionConfirmationRecord {
  if (!proposal.dryRunOnly) {
    throw new Error("V0.6.2: only dry-run confirmations allowed");
  }
  const simulation = simulateActionDryRun(proposal);
  return {
    proposalId: proposal.id,
    status: "confirmed_dry_run",
    confirmedAt: new Date().toISOString(),
    simulation,
    simulationMessage: `${simulation.summary} ${V062_NO_EXTERNAL_MESSAGE}`,
  };
}

export function cancelConfirmation(proposalId: string): ActionConfirmationRecord {
  return {
    proposalId,
    status: "cancelled",
  };
}

export function expireConfirmation(proposalId: string): ActionConfirmationRecord {
  return {
    proposalId,
    status: "expired",
  };
}

export function isConfirmationTerminal(status: ConfirmationStatus): boolean {
  return status === "confirmed_dry_run" || status === "cancelled" || status === "expired";
}

export function canConfirmDryRun(status: ConfirmationStatus): boolean {
  return status === "pending_confirmation" || status === "blocked";
}

export function getBlockedDisplayMessage(): string {
  return V062_REAL_BLOCKED_MESSAGE;
}
