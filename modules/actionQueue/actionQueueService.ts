import type {
  ActionQueueState,
  EnqueuePreparedActionInput,
  QueuedAction,
  QueuedActionStatus,
} from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function generateQueuedActionId(): string {
  return `qa-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function enqueuePreparedAction(
  state: ActionQueueState,
  input: EnqueuePreparedActionInput
): ActionQueueState {
  const timestamp = nowIso();
  const queued: QueuedAction = {
    id: generateQueuedActionId(),
    projectId: input.projectId,
    projectName: input.projectName,
    sourcePlanId: input.sourcePlanId,
    sourceActionId: input.sourceActionId,
    preparedAction: input.preparedAction,
    status: "pending_review",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  return {
    actions: [queued, ...state.actions],
    lastUpdatedAt: timestamp,
  };
}

export function updateQueuedActionStatus(
  state: ActionQueueState,
  actionId: string,
  status: QueuedActionStatus,
  note?: string
): ActionQueueState {
  const timestamp = nowIso();
  return {
    actions: state.actions.map((a) =>
      a.id === actionId
        ? {
            ...a,
            status,
            updatedAt: timestamp,
            reviewedAt:
              status === "approved" || status === "rejected" || status === "needs_revision"
                ? timestamp
                : a.reviewedAt,
            note: note ?? a.note,
          }
        : a
    ),
    lastUpdatedAt: timestamp,
  };
}

export function removeQueuedAction(state: ActionQueueState, actionId: string): ActionQueueState {
  const timestamp = nowIso();
  return {
    actions: state.actions.filter((a) => a.id !== actionId),
    lastUpdatedAt: timestamp,
  };
}

export function enqueueManyPreparedActions(
  state: ActionQueueState,
  inputs: EnqueuePreparedActionInput[]
): ActionQueueState {
  return inputs.reduce((s, input) => enqueuePreparedAction(s, input), state);
}
