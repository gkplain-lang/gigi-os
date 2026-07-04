export type ActionPlanEffort = "low" | "medium" | "high";

export type PreparedActionType =
  | "cursor_prompt"
  | "file_draft"
  | "branch_plan"
  | "checklist"
  | "research_plan"
  | "content_plan"
  | "manual_task";

export interface ActionPlanStep {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime?: string;
  doneDefinition?: string;
}

export interface ActionPlanDeliverable {
  id: string;
  title: string;
  description: string;
}

export interface ActionPlanRisk {
  id: string;
  risk: string;
  mitigation: string;
}

export interface PreparedActionPreview {
  id: string;
  label: string;
  type: PreparedActionType;
  description: string;
  requiresConfirmation: true;
  dryRunOnly: true;
}

export interface ActionPlan {
  id: string;
  projectId: string;
  missionId?: string;
  title: string;
  summary: string;
  whyNow: string;
  expectedOutcome: string;
  steps: ActionPlanStep[];
  deliverables: ActionPlanDeliverable[];
  risks: ActionPlanRisk[];
  validationRequired: string[];
  possibleFutureActions: PreparedActionPreview[];
  effort: ActionPlanEffort;
  confidence: number;
}

export interface ActionPlanBuildInput {
  projectId: string;
  projectName: string;
  missionId?: string;
  missionTitle?: string;
  missionReason?: string;
}

export interface ActionPlanIntent {
  isActionPlan: boolean;
  projectId: string | null;
  missionId: string | null;
}
