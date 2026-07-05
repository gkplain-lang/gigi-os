import type {
  ExecutionReadinessDecision,
  ExecutionReadinessRequest,
  ExecutionReadinessState,
} from "./types";
import {
  EXECUTION_READINESS_STORAGE_KEY,
  EXECUTION_READINESS_VERSION,
} from "./types";

export function createEmptyExecutionReadinessState(): ExecutionReadinessState {
  return {
    requests: [],
    decisions: [],
    manualBridgePackets: [],
    commandPacks: [],
    localReviewSessions: [],
    version: EXECUTION_READINESS_VERSION,
  };
}

export function loadExecutionReadinessState(): ExecutionReadinessState {
  if (typeof window === "undefined") return createEmptyExecutionReadinessState();
  try {
    const raw = localStorage.getItem(EXECUTION_READINESS_STORAGE_KEY);
    if (!raw) return createEmptyExecutionReadinessState();
    const parsed = JSON.parse(raw) as ExecutionReadinessState;
    if (!parsed?.requests || !Array.isArray(parsed.requests)) {
      return createEmptyExecutionReadinessState();
    }
    return {
      ...createEmptyExecutionReadinessState(),
      ...parsed,
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      manualBridgePackets: Array.isArray(parsed.manualBridgePackets)
        ? parsed.manualBridgePackets
        : [],
      commandPacks: Array.isArray(parsed.commandPacks) ? parsed.commandPacks : [],
      localReviewSessions: Array.isArray(parsed.localReviewSessions)
        ? parsed.localReviewSessions
        : [],
      version: EXECUTION_READINESS_VERSION,
    };
  } catch {
    return createEmptyExecutionReadinessState();
  }
}

export function saveExecutionReadinessState(state: ExecutionReadinessState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXECUTION_READINESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function upsertExecutionReadinessRequest(
  request: ExecutionReadinessRequest
): ExecutionReadinessRequest {
  const state = loadExecutionReadinessState();
  const filtered = state.requests.filter((r) => r.id !== request.id);
  saveExecutionReadinessState({
    ...state,
    requests: [request, ...filtered],
    lastUpdatedAt: request.updatedAt,
    version: EXECUTION_READINESS_VERSION,
  });
  return request;
}

export function appendExecutionReadinessDecision(
  decision: ExecutionReadinessDecision
): ExecutionReadinessDecision {
  const state = loadExecutionReadinessState();
  saveExecutionReadinessState({
    ...state,
    decisions: [decision, ...state.decisions.filter((d) => d.requestId !== decision.requestId)],
    lastUpdatedAt: decision.decidedAt,
    version: EXECUTION_READINESS_VERSION,
  });
  return decision;
}

export function getExecutionReadinessRequestById(
  id: string
): ExecutionReadinessRequest | undefined {
  return loadExecutionReadinessState().requests.find((r) => r.id === id);
}

export function getRequestsByActionId(actionId: string): ExecutionReadinessRequest[] {
  return loadExecutionReadinessState().requests.filter(
    (r) => r.sourceActionId === actionId && r.permissionStatus !== "archived"
  );
}

export function listExecutionReadinessRequests(limit?: number): ExecutionReadinessRequest[] {
  const sorted = [...loadExecutionReadinessState().requests].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function listActiveExecutionReadinessRequests(limit?: number): ExecutionReadinessRequest[] {
  const active = listExecutionReadinessRequests().filter(
    (r) => !["archived", "rejected", "expired", "revoked"].includes(r.permissionStatus)
  );
  return limit ? active.slice(0, limit) : active;
}
