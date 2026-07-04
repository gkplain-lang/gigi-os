import type { PreparedActionType } from "@/modules/preparedActions/types";

export type ExecutionMode = "manual_guided" | "cursor_guided" | "future_automated";

export type ExecutionPlanStatus =
  | "draft"
  | "ready_for_manual_execution"
  | "blocked"
  | "completed_manually";

export interface ExecutionPrerequisite {
  id: string;
  label: string;
  description: string;
}

export interface ExecutionTargetFile {
  path: string;
  reason: string;
  riskLevel: "low" | "medium" | "high";
}

export interface ExecutionStep {
  id: string;
  order: number;
  title: string;
  description: string;
  actor: "user" | "cursor" | "gigi_future";
  doneDefinition: string;
}

export interface ExecutionCommand {
  id: string;
  command: string;
  description: string;
  runBy: "user_manual_only";
  required: boolean;
}

export interface ExecutionTest {
  id: string;
  label: string;
  command?: string;
  description: string;
}

export interface ExecutionRisk {
  id: string;
  risk: string;
  mitigation: string;
}

export interface ExecutionRollbackStep {
  id: string;
  title: string;
  description: string;
}

export interface ExecutionValidationItem {
  id: string;
  label: string;
  required: boolean;
}

export interface ExecutionPlan {
  id: string;
  queuedActionId: string;
  projectId: string;
  projectName: string;
  title: string;
  summary: string;
  executionMode: ExecutionMode;
  status: ExecutionPlanStatus;
  objective: string;
  prerequisites: ExecutionPrerequisite[];
  targetFiles: ExecutionTargetFile[];
  steps: ExecutionStep[];
  commands: ExecutionCommand[];
  tests: ExecutionTest[];
  risks: ExecutionRisk[];
  rollbackPlan: ExecutionRollbackStep[];
  validationChecklist: ExecutionValidationItem[];
  expectedReport: string[];
  safetyNotes: string[];
  createdAt: string;
  updatedAt: string;
  dryRunOnly: true;
  requiresFinalConfirmation: true;
}

export interface ExecutionPlanBuildInput {
  queuedActionId: string;
  projectId: string;
  projectName: string;
  preparedActionType: PreparedActionType;
  preparedActionTitle: string;
  preparedActionSummary: string;
  preparedActionBody: string;
  relatedFiles?: string[];
  suggestedCommands?: string[];
}

export interface ExecutionPlanIntent {
  isExecutionPlan: boolean;
  projectId: string | null;
}

export const EXECUTION_PLANS_STORAGE_KEY = "gigi-os-v20-execution-plans";

export interface ExecutionPlansState {
  plans: ExecutionPlan[];
  lastUpdatedAt?: string;
}

export const EXECUTION_MODE_LABELS: Record<ExecutionMode, string> = {
  manual_guided: "Exécution manuelle guidée",
  cursor_guided: "Exécution guidée Cursor",
  future_automated: "Automatisation future (V2.2+)",
};

export const EXECUTION_STATUS_LABELS: Record<ExecutionPlanStatus, string> = {
  draft: "Brouillon",
  ready_for_manual_execution: "Prêt pour exécution manuelle",
  blocked: "Bloqué",
  completed_manually: "Terminé manuellement",
};
