export type SafeActionWorkspaceStatus =
  | "draft"
  | "ready"
  | "in_review"
  | "blocked"
  | "needs_context"
  | "manually_running"
  | "completed_manually"
  | "archived";

export type SafeActionWorkspaceSource =
  | "action_queue"
  | "prepared_action"
  | "execution_plan"
  | "follow_up_action"
  | "mission_plan_bridge"
  | "manual";

export type SafeActionWorkspaceReadiness =
  | "ready"
  | "missing_context"
  | "risky"
  | "blocked"
  | "unclear";

export type SafeActionWorkspaceSectionType =
  | "action_summary"
  | "mission_context"
  | "project_context"
  | "execution_plan"
  | "execution_logs"
  | "execution_review"
  | "follow_ups"
  | "history"
  | "risks"
  | "prerequisites"
  | "validation_checklist"
  | "manual_steps"
  | "notes"
  | "safety";

export type SafeActionWorkspaceRiskLevel = "low" | "medium" | "high" | "critical";

export interface SafeActionWorkspaceSection {
  id: string;
  type: SafeActionWorkspaceSectionType;
  title: string;
  content: string;
  status: "available" | "partial" | "missing";
  relatedId?: string;
  createdAt: string;
}

export interface SafeActionWorkspaceRisk {
  id: string;
  level: SafeActionWorkspaceRiskLevel;
  label: string;
  description: string;
  mitigation?: string;
  relatedId?: string;
}

export interface SafeActionWorkspaceChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  description?: string;
  relatedId?: string;
}

export interface SafeActionWorkspaceNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface SafeActionWorkspace {
  id: string;
  title: string;
  status: SafeActionWorkspaceStatus;
  source: SafeActionWorkspaceSource;
  readiness: SafeActionWorkspaceReadiness;
  actionId?: string;
  preparedActionId?: string;
  executionPlanId?: string;
  executionLogId?: string;
  executionReviewId?: string;
  followUpActionIds?: string[];
  historyEntryIds?: string[];
  missionDecisionId?: string;
  missionPlanBridgeId?: string;
  projectId?: string;
  missionId?: string;
  summary: string;
  sections: SafeActionWorkspaceSection[];
  risks: SafeActionWorkspaceRisk[];
  prerequisites: string[];
  validationChecklist: SafeActionWorkspaceChecklistItem[];
  manualNextSteps: string[];
  safetyNotes: string[];
  userNotes: SafeActionWorkspaceNote[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  metadata?: Record<string, string>;
}

export interface SafeActionWorkspaceState {
  workspaces: SafeActionWorkspace[];
  lastUpdatedAt?: string;
  version: number;
}

export interface SafeActionWorkspaceGlobalSummary {
  totalWorkspaces: number;
  readyCount: number;
  blockedCount: number;
  recentTitle?: string;
  summaryText: string;
}

export interface SafeActionWorkspaceIntent {
  isSafeActionWorkspace: boolean;
  projectId: string | null;
}

export const SAFE_ACTION_WORKSPACE_STORAGE_KEY = "gigi-os-v28-safe-action-workspaces";
export const SAFE_ACTION_WORKSPACE_VERSION = 1;
export const SAFE_ACTION_WORKSPACE_ID_PREFIX = "sawspace-";

export const SAFE_ACTION_WORKSPACE_DISCLAIMER =
  "Ce workspace est local. Gigi ne lance aucune commande, ne vérifie pas GitHub et ne modifie aucun fichier externe.";

export const SAFE_ACTION_WORKSPACE_STATUS_LABELS: Record<SafeActionWorkspaceStatus, string> = {
  draft: "Brouillon",
  ready: "Prêt",
  in_review: "En revue",
  blocked: "Bloqué",
  needs_context: "Contexte manquant",
  manually_running: "Exécution manuelle",
  completed_manually: "Terminé manuellement",
  archived: "Archivé",
};

export const SAFE_ACTION_WORKSPACE_READINESS_LABELS: Record<
  SafeActionWorkspaceReadiness,
  string
> = {
  ready: "Prêt",
  missing_context: "Contexte manquant",
  risky: "Risqué",
  blocked: "Bloqué",
  unclear: "Ambigu",
};

export const DEFAULT_SAFETY_CHECKLIST: Omit<
  SafeActionWorkspaceChecklistItem,
  "id" | "completed"
>[] = [
  { label: "Objectif compris", required: true },
  { label: "Périmètre limité", required: true },
  { label: "Risques relus", required: true },
  { label: "Plan relu", required: true },
  { label: "Commandes non exécutées par Gigi", required: true },
  { label: "Exécution manuelle uniquement", required: true },
  { label: "Résultat à logger après exécution", required: true },
  { label: "Review à générer après exécution", required: false },
];
