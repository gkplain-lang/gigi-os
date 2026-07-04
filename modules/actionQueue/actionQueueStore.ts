import type { ActionQueueState } from "./types";
import { ACTION_QUEUE_STORAGE_KEY } from "./types";

export function createEmptyQueueState(): ActionQueueState {
  return { actions: [] };
}

export function loadActionQueueState(): ActionQueueState {
  if (typeof window === "undefined") return createEmptyQueueState();
  try {
    const raw = localStorage.getItem(ACTION_QUEUE_STORAGE_KEY);
    if (!raw) return createEmptyQueueState();
    const parsed = JSON.parse(raw) as ActionQueueState;
    if (!parsed || !Array.isArray(parsed.actions)) return createEmptyQueueState();
    return parsed;
  } catch {
    return createEmptyQueueState();
  }
}

export function saveActionQueueState(state: ActionQueueState): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(ACTION_QUEUE_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearActionQueueState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTION_QUEUE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
