import { detectActionProposals } from "../actionProposal";
import {
  formatAutonomyLabel,
  listAllowedActionLabels,
  listForbiddenActionLabels,
  summarizeAgentFoundation,
} from "../actionSummary";
import { applyConfirmationDefaults } from "./confirmationState";
import { buildConfirmationViewModel, confirmationStatusLabel } from "./confirmationCopy";
import type { ConfirmationUxSummary } from "./types";

export function summarizeConfirmationUx(userMessage?: string): ConfirmationUxSummary {
  const foundation = summarizeAgentFoundation();
  const detection = userMessage
    ? detectActionProposals(userMessage)
    : detectActionProposals("Gigi, update la bibliothèque Buildy Crafts");

  const raw = detection.proposals[0] ?? foundation.exampleProposal;
  const exampleProposal = applyConfirmationDefaults(raw);
  const view = buildConfirmationViewModel(exampleProposal);

  return {
    confirmationUxActive: true,
    realExecutionDisabled: true,
    exampleProposal,
    exampleStatus: view.status,
    confirmableDryRunActions: listAllowedActionLabels(),
    blockedActions: listForbiddenActionLabels(),
    autonomyLevel: formatAutonomyLabel(),
  };
}

export function formatConfirmationDevStatus(status: ConfirmationUxSummary["exampleStatus"]): string {
  return confirmationStatusLabel(status);
}
