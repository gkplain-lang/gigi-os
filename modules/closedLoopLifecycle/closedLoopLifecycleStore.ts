import type { ClosedLoopLifecycle, ClosedLoopLifecycleState } from "./types";
import {
  CLOSED_LOOP_LIFECYCLE_STORAGE_KEY,
  CLOSED_LOOP_LIFECYCLE_VERSION,
} from "./types";

export function createEmptyClosedLoopLifecycleState(): ClosedLoopLifecycleState {
  return { lifecycles: [], version: CLOSED_LOOP_LIFECYCLE_VERSION };
}

export function loadClosedLoopLifecycleState(): ClosedLoopLifecycleState {
  if (typeof window === "undefined") return createEmptyClosedLoopLifecycleState();
  try {
    const raw = localStorage.getItem(CLOSED_LOOP_LIFECYCLE_STORAGE_KEY);
    if (!raw) return createEmptyClosedLoopLifecycleState();
    const parsed = JSON.parse(raw) as ClosedLoopLifecycleState;
    if (!parsed?.lifecycles || !Array.isArray(parsed.lifecycles)) {
      return createEmptyClosedLoopLifecycleState();
    }
    return {
      ...createEmptyClosedLoopLifecycleState(),
      ...parsed,
      version: CLOSED_LOOP_LIFECYCLE_VERSION,
    };
  } catch {
    return createEmptyClosedLoopLifecycleState();
  }
}

export function saveClosedLoopLifecycleState(state: ClosedLoopLifecycleState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLOSED_LOOP_LIFECYCLE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function upsertClosedLoopLifecycle(lifecycle: ClosedLoopLifecycle): ClosedLoopLifecycle {
  const state = loadClosedLoopLifecycleState();
  const filtered = state.lifecycles.filter((l) => l.id !== lifecycle.id);
  saveClosedLoopLifecycleState({
    lifecycles: [lifecycle, ...filtered],
    lastUpdatedAt: lifecycle.updatedAt,
    version: CLOSED_LOOP_LIFECYCLE_VERSION,
  });
  return lifecycle;
}

export function getClosedLoopLifecycleById(id: string): ClosedLoopLifecycle | undefined {
  return loadClosedLoopLifecycleState().lifecycles.find((l) => l.id === id);
}

export function getLifecyclesByActionId(actionId: string): ClosedLoopLifecycle[] {
  return loadClosedLoopLifecycleState().lifecycles.filter(
    (l) => l.actionId === actionId && l.status !== "archived"
  );
}

export function getLifecyclesByWorkspaceId(workspaceId: string): ClosedLoopLifecycle[] {
  return loadClosedLoopLifecycleState().lifecycles.filter(
    (l) => l.workspaceId === workspaceId && l.status !== "archived"
  );
}

export function getLifecyclesByHandoffId(handoffId: string): ClosedLoopLifecycle[] {
  return loadClosedLoopLifecycleState().lifecycles.filter(
    (l) => l.handoffId === handoffId && l.status !== "archived"
  );
}

export function getLifecyclesByReportIntakeId(intakeId: string): ClosedLoopLifecycle[] {
  return loadClosedLoopLifecycleState().lifecycles.filter(
    (l) => l.reportIntakeId === intakeId && l.status !== "archived"
  );
}

export function listClosedLoopLifecycles(limit?: number): ClosedLoopLifecycle[] {
  const sorted = [...loadClosedLoopLifecycleState().lifecycles].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function archiveClosedLoopLifecycle(id: string): ClosedLoopLifecycle | undefined {
  const lifecycle = getClosedLoopLifecycleById(id);
  if (!lifecycle) return undefined;
  const timestamp = new Date().toISOString();
  return upsertClosedLoopLifecycle({
    ...lifecycle,
    status: "archived",
    archivedAt: timestamp,
    updatedAt: timestamp,
  });
}
