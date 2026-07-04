export type FollowUpActionType =
  | "fix"
  | "retry"
  | "new_action"
  | "finalize"
  | "document"
  | "archive"
  | "clarify"
  | "abandon";

export type FollowUpActionStatus = "proposed" | "selected" | "added_to_queue" | "dismissed";

export type FollowUpRiskLevel = "low" | "medium" | "high";

export interface FollowUpActionProposal {
  id: string;
  sourceReviewId: string;
  sourceExecutionLogId?: string;
  sourceExecutionPlanId?: string;
  sourceActionId?: string;
  type: FollowUpActionType;
  status: FollowUpActionStatus;
  title: string;
  objective: string;
  rationale: string;
  suggestedSteps: string[];
  validationChecklist: string[];
  expectedOutcome: string;
  riskLevel: FollowUpRiskLevel;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    projectId?: string;
    projectName?: string;
    reviewDecision?: string;
  };
}

export interface FollowUpActionsState {
  proposals: FollowUpActionProposal[];
  lastUpdatedAt?: string;
}

export interface FollowUpActionIntent {
  isFollowUpAction: boolean;
  projectId: string | null;
}

export const FOLLOW_UP_ACTIONS_STORAGE_KEY = "gigi-os-v23-followup-actions";

export const FOLLOW_UP_TYPE_LABELS: Record<FollowUpActionType, string> = {
  fix: "Action corrective",
  retry: "Relance d'exécution",
  new_action: "Nouvelle action de suivi",
  finalize: "Finalisation",
  document: "Documentation",
  archive: "Archivage",
  clarify: "Clarification",
  abandon: "Abandon documenté",
};

export const FOLLOW_UP_STATUS_LABELS: Record<FollowUpActionStatus, string> = {
  proposed: "Proposée",
  selected: "Retenue",
  added_to_queue: "Ajoutée à la file",
  dismissed: "Ignorée",
};

export const FOLLOW_UP_DISCLAIMER =
  "Propositions locales générées depuis la review V2.2 — Gigi ne vérifie pas le repo et n'exécute aucune commande.";
