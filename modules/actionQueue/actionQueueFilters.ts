import type { ActionQueueFilter, QueuedAction, QueuedActionStatus } from "./types";

export function filterQueuedActions(
  actions: QueuedAction[],
  filter: ActionQueueFilter
): QueuedAction[] {
  return actions.filter((action) => {
    if (filter.projectId && action.projectId !== filter.projectId) return false;
    if (filter.status && filter.status !== "all" && action.status !== filter.status) return false;
    if (filter.type && action.preparedAction.type !== filter.type) return false;
    return true;
  });
}

export function sortQueuedActions(actions: QueuedAction[]): QueuedAction[] {
  return [...actions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function countByStatus(actions: QueuedAction[]): Record<QueuedActionStatus | "all", number> {
  const counts: Record<QueuedActionStatus | "all", number> = {
    all: actions.length,
    pending_review: 0,
    approved: 0,
    rejected: 0,
    needs_revision: 0,
    copied: 0,
  };
  for (const a of actions) {
    counts[a.status]++;
  }
  return counts;
}

export function uniqueProjectIds(actions: QueuedAction[]): { id: string; name: string }[] {
  const seen = new Map<string, string>();
  for (const a of actions) {
    if (!seen.has(a.projectId)) seen.set(a.projectId, a.projectName);
  }
  return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
}
