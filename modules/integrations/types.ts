import type { ActionRiskLevel, ConfirmationStatus } from "@/modules/agents/types";
import type { GitHubDryRunActionType, GitHubForbiddenActionType } from "./github/types";

export type IntegrationId = "github";

export type IntegrationStatus =
  | "not_configured"
  | "dry_run_only"
  | "ready_for_confirmation"
  | "disabled"
  | "blocked";

export interface IntegrationProposal {
  id: string;
  integrationId: IntegrationId;
  title: string;
  description: string;
  status: IntegrationStatus;
  githubAction?: GitHubDryRunActionType;
  githubForbiddenAction?: GitHubForbiddenActionType;
  requiredPermissions: string[];
  riskLevel: ActionRiskLevel;
  dryRunOnly: true;
  confirmationRequired: true;
  expectedOutcome: string;
  planSteps: string[];
  wouldDo: string[];
  willNotDo: string[];
  blockedReason?: string;
  confirmationStatus?: ConfirmationStatus;
  isRecurring?: boolean;
  triggerDescription?: string;
  createdAt: string;
}

export interface IntegrationDryRunResult {
  proposalId: string;
  integrationId: IntegrationId;
  dryRun: true;
  executed: false;
  simulatedSteps: string[];
  summary: string;
}

export interface IntegrationFoundationSummary {
  version: "0.8.0";
  dryRunOnly: true;
  externalApiCallsBlocked: true;
  githubStatus: IntegrationStatus;
  availableIntegrations: IntegrationId[];
  exampleProposal: IntegrationProposal;
}
