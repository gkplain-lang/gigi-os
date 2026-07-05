import type { ManualExecutionHandoff, ManualExecutionHandoffState } from "./types";
import {
  MANUAL_EXECUTION_HANDOFF_STORAGE_KEY,
  MANUAL_EXECUTION_HANDOFF_VERSION,
} from "./types";

export function createEmptyManualExecutionHandoffState(): ManualExecutionHandoffState {
  return { handoffs: [], version: MANUAL_EXECUTION_HANDOFF_VERSION };
}

export function loadManualExecutionHandoffState(): ManualExecutionHandoffState {
  if (typeof window === "undefined") return createEmptyManualExecutionHandoffState();
  try {
    const raw = localStorage.getItem(MANUAL_EXECUTION_HANDOFF_STORAGE_KEY);
    if (!raw) return createEmptyManualExecutionHandoffState();
    const parsed = JSON.parse(raw) as ManualExecutionHandoffState;
    if (!parsed?.handoffs || !Array.isArray(parsed.handoffs)) {
      return createEmptyManualExecutionHandoffState();
    }
    return {
      ...createEmptyManualExecutionHandoffState(),
      ...parsed,
      version: MANUAL_EXECUTION_HANDOFF_VERSION,
    };
  } catch {
    return createEmptyManualExecutionHandoffState();
  }
}

export function saveManualExecutionHandoffState(state: ManualExecutionHandoffState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MANUAL_EXECUTION_HANDOFF_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function upsertManualExecutionHandoff(
  handoff: ManualExecutionHandoff
): ManualExecutionHandoff {
  const state = loadManualExecutionHandoffState();
  const filtered = state.handoffs.filter((h) => h.id !== handoff.id);
  saveManualExecutionHandoffState({
    handoffs: [handoff, ...filtered],
    lastUpdatedAt: handoff.updatedAt,
    version: MANUAL_EXECUTION_HANDOFF_VERSION,
  });
  return handoff;
}

export function getManualExecutionHandoffById(
  id: string
): ManualExecutionHandoff | undefined {
  return loadManualExecutionHandoffState().handoffs.find((h) => h.id === id);
}

export function getHandoffsBySourceWorkspaceId(
  workspaceId: string
): ManualExecutionHandoff[] {
  return loadManualExecutionHandoffState().handoffs.filter(
    (h) => h.sourceWorkspaceId === workspaceId && h.status !== "archived"
  );
}

export function getHandoffsBySourceActionId(actionId: string): ManualExecutionHandoff[] {
  return loadManualExecutionHandoffState().handoffs.filter(
    (h) => h.sourceActionId === actionId && h.status !== "archived"
  );
}

export function listManualExecutionHandoffs(limit?: number): ManualExecutionHandoff[] {
  const sorted = [...loadManualExecutionHandoffState().handoffs].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function archiveManualExecutionHandoff(
  id: string
): ManualExecutionHandoff | undefined {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return undefined;
  const timestamp = new Date().toISOString();
  return upsertManualExecutionHandoff({
    ...handoff,
    status: "archived",
    archivedAt: timestamp,
    updatedAt: timestamp,
  });
}
