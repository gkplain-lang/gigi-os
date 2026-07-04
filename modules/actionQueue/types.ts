import type { PreparedAction } from "@/modules/preparedActions/types";

export type QueuedActionStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_revision"
  | "copied";

export interface QueuedAction {
  id: string;
  projectId: string;
  projectName: string;
  sourcePlanId?: string;
  sourceActionId?: string;
  preparedAction: PreparedAction;
  status: QueuedActionStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  note?: string;
}

export interface ActionQueueState {
  actions: QueuedAction[];
  lastUpdatedAt?: string;
}

export interface ActionQueueFilter {
  projectId?: string;
  status?: QueuedActionStatus | "all";
  type?: PreparedAction["type"];
}

export interface EnqueuePreparedActionInput {
  preparedAction: PreparedAction;
  projectId: string;
  projectName: string;
  sourcePlanId?: string;
  sourceActionId?: string;
}

export const ACTION_QUEUE_STORAGE_KEY = "gigi-os-v19-action-queue";

export const QUEUED_STATUS_LABELS: Record<QueuedActionStatus, string> = {
  pending_review: "À valider",
  approved: "Validée",
  rejected: "Rejetée",
  needs_revision: "À retravailler",
  copied: "Copiée",
};
