import type { AutonomyLevel } from "./autonomyLevels";

export type ActionRiskLevel = "low" | "medium" | "high";

/** Dry-run action types allowed in V0.6 (prepare only). */
export type DryRunActionType =
  | "prepare_github_branch"
  | "prepare_github_commit"
  | "prepare_n8n_agent_plan"
  | "prepare_buildy_crafts_library_update"
  | "prepare_supabase_backup_plan"
  | "prepare_tomorrow_mission"
  | "prepare_project_review";

/** Real execution types — always blocked in V0.6. */
export type ForbiddenRealActionType =
  | "send_email"
  | "modify_calendar"
  | "push_to_github"
  | "merge_branch"
  | "run_n8n_workflow"
  | "sync_supabase"
  | "restore_supabase"
  | "delete_data"
  | "publish_content"
  | "spend_money"
  | "call_external_api";

export type AgentActionType = DryRunActionType | ForbiddenRealActionType;

export type ConfirmationStatus =
  | "pending_confirmation"
  | "confirmed_dry_run"
  | "blocked"
  | "expired"
  | "cancelled";

export interface ActionProposal {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  missionId?: string;
  actionType: AgentActionType;
  riskLevel: ActionRiskLevel;
  autonomyLevelRequired: AutonomyLevel;
  dryRunOnly: boolean;
  confirmationRequired: boolean;
  expectedOutcome: string;
  blockedReason?: string;
  createdAt: string;
  /** V0.6.2 — confirmation UX status */
  confirmationStatus?: ConfirmationStatus;
}

export interface DryRunResult {
  proposalId: string;
  actionType: AgentActionType;
  dryRun: true;
  executed: false;
  simulatedSteps: string[];
  summary: string;
}

export interface AgentFoundationSummary {
  activeAutonomyLevel: AutonomyLevel;
  maxAutonomyLevel: AutonomyLevel;
  allowedDryRunActions: DryRunActionType[];
  forbiddenRealActions: ForbiddenRealActionType[];
  exampleProposal: ActionProposal;
  dryRunOnly: true;
  externalExecutionBlocked: true;
}
