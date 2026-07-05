import type { SafeActionWorkspace, SafeActionWorkspaceState } from "./types";
import {
  SAFE_ACTION_WORKSPACE_STORAGE_KEY,
  SAFE_ACTION_WORKSPACE_VERSION,
} from "./types";

export function createEmptySafeActionWorkspaceState(): SafeActionWorkspaceState {
  return { workspaces: [], version: SAFE_ACTION_WORKSPACE_VERSION };
}

export function loadSafeActionWorkspaceState(): SafeActionWorkspaceState {
  if (typeof window === "undefined") return createEmptySafeActionWorkspaceState();
  try {
    const raw = localStorage.getItem(SAFE_ACTION_WORKSPACE_STORAGE_KEY);
    if (!raw) return createEmptySafeActionWorkspaceState();
    const parsed = JSON.parse(raw) as SafeActionWorkspaceState;
    if (!parsed?.workspaces || !Array.isArray(parsed.workspaces)) {
      return createEmptySafeActionWorkspaceState();
    }
    return {
      ...createEmptySafeActionWorkspaceState(),
      ...parsed,
      version: SAFE_ACTION_WORKSPACE_VERSION,
    };
  } catch {
    return createEmptySafeActionWorkspaceState();
  }
}

export function saveSafeActionWorkspaceState(state: SafeActionWorkspaceState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAFE_ACTION_WORKSPACE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function upsertSafeActionWorkspace(workspace: SafeActionWorkspace): SafeActionWorkspace {
  const state = loadSafeActionWorkspaceState();
  const filtered = state.workspaces.filter((w) => w.id !== workspace.id);
  saveSafeActionWorkspaceState({
    workspaces: [workspace, ...filtered],
    lastUpdatedAt: workspace.updatedAt,
    version: SAFE_ACTION_WORKSPACE_VERSION,
  });
  return workspace;
}

export function getSafeActionWorkspaceById(id: string): SafeActionWorkspace | undefined {
  return loadSafeActionWorkspaceState().workspaces.find((w) => w.id === id);
}

export function getSafeActionWorkspaceByActionId(
  actionId: string
): SafeActionWorkspace | undefined {
  return loadSafeActionWorkspaceState().workspaces.find(
    (w) => w.actionId === actionId && w.status !== "archived"
  );
}

export function listSafeActionWorkspaces(limit?: number): SafeActionWorkspace[] {
  const sorted = [...loadSafeActionWorkspaceState().workspaces].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getWorkspacesByProjectId(projectId: string): SafeActionWorkspace[] {
  return loadSafeActionWorkspaceState().workspaces.filter((w) => w.projectId === projectId);
}

export function archiveSafeActionWorkspace(id: string): SafeActionWorkspace | undefined {
  const workspace = getSafeActionWorkspaceById(id);
  if (!workspace) return undefined;
  const timestamp = new Date().toISOString();
  return upsertSafeActionWorkspace({
    ...workspace,
    status: "archived",
    archivedAt: timestamp,
    updatedAt: timestamp,
  });
}
