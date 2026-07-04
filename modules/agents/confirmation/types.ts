import type { ActionProposal, ConfirmationStatus, DryRunResult } from "../types";

export type { ConfirmationStatus };

export interface ActionConfirmationRecord {
  proposalId: string;
  status: ConfirmationStatus;
  confirmedAt?: string;
  simulation?: DryRunResult;
  simulationMessage?: string;
}

export interface ConfirmationViewModel {
  proposal: ActionProposal;
  status: ConfirmationStatus;
  projectLabel: string;
  why: string;
  willDo: string[];
  willNotDo: string[];
  dryRunLabel: string;
  confirmationRequired: boolean;
  realExecutionBlocked: boolean;
  blockedReason?: string;
  footerMessage: string;
}

export interface ConfirmationUxSummary {
  confirmationUxActive: true;
  realExecutionDisabled: true;
  exampleProposal: ActionProposal;
  exampleStatus: ConfirmationStatus;
  confirmableDryRunActions: string[];
  blockedActions: string[];
  autonomyLevel: string;
}
