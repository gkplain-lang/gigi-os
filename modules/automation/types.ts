import type { ActionRiskLevel } from "@/modules/agents/types";
import type { ConfirmationStatus } from "@/modules/agents/types";

/** Dry-run automation types — plan only in V0.7 */
export type DryRunAutomationType =
  | "daily_review_reminder"
  | "weekly_project_review"
  | "buildy_crafts_library_update_plan"
  | "buildy_clear_launch_checklist"
  | "gigi_os_git_branch_plan"
  | "n8n_agent_plan"
  | "content_publication_plan"
  | "supabase_backup_plan"
  | "project_stale_check"
  | "tomorrow_mission_preparation";

/** Real execution forbidden in V0.7 — plan dry-run only */
export type ForbiddenRealAutomationType =
  | "send_email"
  | "publish_video"
  | "push_to_github"
  | "merge_branch"
  | "run_n8n_workflow"
  | "sync_supabase"
  | "restore_supabase"
  | "delete_data"
  | "spend_money"
  | "call_external_api"
  | "modify_calendar";

export type AutomationType = DryRunAutomationType | ForbiddenRealAutomationType;

export type TriggerType = "manual" | "schedule" | "condition" | "event";

export interface AutomationProposal {
  id: string;
  title: string;
  description: string;
  automationType: AutomationType;
  projectId?: string;
  missionId?: string;
  triggerType: TriggerType;
  triggerDescription: string;
  requiredPermissions: string[];
  riskLevel: ActionRiskLevel;
  dryRunOnly: true;
  confirmationRequired: true;
  expectedOutcome: string;
  steps: string[];
  blockedActions: string[];
  createdAt: string;
  confirmationStatus?: ConfirmationStatus;
  blockedReason?: string;
}

export interface AutomationDryRunResult {
  proposalId: string;
  automationType: AutomationType;
  dryRun: true;
  executed: false;
  simulatedSteps: string[];
  summary: string;
}

export interface AutomationFoundationSummary {
  version: "0.7.0";
  dryRunOnly: true;
  n8nConnected: false;
  externalExecutionBlocked: true;
  availableAutomations: DryRunAutomationType[];
  forbiddenAutomations: ForbiddenRealAutomationType[];
  exampleProposal: AutomationProposal;
}

export interface AutomationIntentRecord {
  id: string;
  proposalId: string;
  automationType: AutomationType;
  userMessage: string;
  status: ConfirmationStatus;
  createdAt: string;
}
