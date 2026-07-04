import type { ExecutionLog, ExecutionLogsState } from "./types";
import { EXECUTION_LOGS_STORAGE_KEY } from "./types";

export function createEmptyLogsState(): ExecutionLogsState {
  return { logs: [] };
}

export function loadExecutionLogsState(): ExecutionLogsState {
  if (typeof window === "undefined") return createEmptyLogsState();
  try {
    const raw = localStorage.getItem(EXECUTION_LOGS_STORAGE_KEY);
    if (!raw) return createEmptyLogsState();
    const parsed = JSON.parse(raw) as ExecutionLogsState;
    if (!parsed?.logs || !Array.isArray(parsed.logs)) return createEmptyLogsState();
    return parsed;
  } catch {
    return createEmptyLogsState();
  }
}

export function saveExecutionLogsState(state: ExecutionLogsState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXECUTION_LOGS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function upsertExecutionLog(log: ExecutionLog): ExecutionLog {
  const state = loadExecutionLogsState();
  const filtered = state.logs.filter(
    (l) => l.executionPlanId !== log.executionPlanId && l.queuedActionId !== log.queuedActionId
  );
  const next: ExecutionLogsState = {
    logs: [log, ...filtered],
    lastUpdatedAt: log.updatedAt,
  };
  saveExecutionLogsState(next);
  return log;
}

export function getExecutionLogByPlanId(executionPlanId: string): ExecutionLog | undefined {
  return loadExecutionLogsState().logs.find((l) => l.executionPlanId === executionPlanId);
}

export function getExecutionLogByQueuedActionId(queuedActionId: string): ExecutionLog | undefined {
  return loadExecutionLogsState().logs.find((l) => l.queuedActionId === queuedActionId);
}
