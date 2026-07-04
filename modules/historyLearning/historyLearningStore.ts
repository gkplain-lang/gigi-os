import type { HistoryLearningEntry, HistoryLearningState } from "./types";
import { HISTORY_LEARNING_STORAGE_KEY } from "./types";

export function createEmptyHistoryLearningState(): HistoryLearningState {
  return { entries: [] };
}

export function loadHistoryLearningState(): HistoryLearningState {
  if (typeof window === "undefined") return createEmptyHistoryLearningState();
  try {
    const raw = localStorage.getItem(HISTORY_LEARNING_STORAGE_KEY);
    if (!raw) return createEmptyHistoryLearningState();
    const parsed = JSON.parse(raw) as HistoryLearningState;
    if (!parsed?.entries || !Array.isArray(parsed.entries)) return createEmptyHistoryLearningState();
    return parsed;
  } catch {
    return createEmptyHistoryLearningState();
  }
}

export function saveHistoryLearningState(state: HistoryLearningState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_LEARNING_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function upsertHistoryEntry(entry: HistoryLearningEntry): HistoryLearningEntry {
  const state = loadHistoryLearningState();
  const filtered = state.entries.filter((e) => e.id !== entry.id);
  const next: HistoryLearningState = {
    entries: [entry, ...filtered],
    lastUpdatedAt: entry.updatedAt,
  };
  saveHistoryLearningState(next);
  return entry;
}

export function getHistoryEntryById(id: string): HistoryLearningEntry | undefined {
  return loadHistoryLearningState().entries.find((e) => e.id === id);
}

export function listHistoryEntries(filters?: {
  projectId?: string;
  status?: HistoryLearningEntry["status"];
  outcome?: HistoryLearningEntry["outcome"];
}): HistoryLearningEntry[] {
  let entries = loadHistoryLearningState().entries;
  if (filters?.projectId) {
    entries = entries.filter((e) => e.projectId === filters.projectId);
  }
  if (filters?.status) {
    entries = entries.filter((e) => e.status === filters.status);
  }
  if (filters?.outcome) {
    entries = entries.filter((e) => e.outcome === filters.outcome);
  }
  return entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function archiveHistoryEntry(id: string): HistoryLearningEntry | undefined {
  const entry = getHistoryEntryById(id);
  if (!entry) return undefined;
  const timestamp = new Date().toISOString();
  return upsertHistoryEntry({
    ...entry,
    status: "archived",
    archivedAt: timestamp,
    updatedAt: timestamp,
  });
}

export function deleteHistoryEntry(id: string): void {
  const state = loadHistoryLearningState();
  saveHistoryLearningState({
    entries: state.entries.filter((e) => e.id !== id),
    lastUpdatedAt: new Date().toISOString(),
  });
}
