export type PreparedActionType =
  | "cursor_prompt"
  | "checklist"
  | "file_draft"
  | "branch_plan"
  | "pr_plan"
  | "content_plan"
  | "research_plan"
  | "collaborator_brief"
  | "manual_task";

export interface PreparedAction {
  id: string;
  projectId: string;
  actionPlanId?: string;
  sourceActionId?: string;
  type: PreparedActionType;
  title: string;
  summary: string;
  body: string;
  copyLabel: string;
  target?: string;
  relatedFiles?: string[];
  commands?: string[];
  safetyNotes: string[];
  validationRequired: string[];
  dryRunOnly: true;
  requiresConfirmation: true;
}

export interface PreparedActionBuildInput {
  projectId: string;
  projectName: string;
  type: PreparedActionType;
  actionPlanId?: string;
  sourceActionId?: string;
  planTitle?: string;
  planSummary?: string;
  missionId?: string;
}

export interface PreparedActionIntent {
  isPreparedAction: boolean;
  projectId: string | null;
  type: PreparedActionType | null;
  sourceActionId: string | null;
}

export const PREPARED_ACTION_TYPE_LABELS: Record<PreparedActionType, string> = {
  cursor_prompt: "Prompt Cursor",
  checklist: "Checklist",
  file_draft: "Brouillon de fichier",
  branch_plan: "Plan de branche Git",
  pr_plan: "Plan de PR",
  content_plan: "Plan de contenu",
  research_plan: "Plan de recherche",
  collaborator_brief: "Brief collaborateur",
  manual_task: "Tâche manuelle",
};
