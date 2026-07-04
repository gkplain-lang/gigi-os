import {
  BETA_FEEDBACK_STORAGE_KEY,
  type BetaFeedbackEntry,
  type BetaFeedbackType,
} from "./types";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): BetaFeedbackEntry[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(BETA_FEEDBACK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BetaFeedbackEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: BetaFeedbackEntry[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(BETA_FEEDBACK_STORAGE_KEY, JSON.stringify(entries));
}

function newId(): string {
  return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const BETA_FEEDBACK_TYPE_LABELS: Record<BetaFeedbackType, string> = {
  bug: "Bug",
  friction: "Friction UX",
  idea: "Idée",
  bad_decision: "Mauvaise décision Gigi",
  other: "Autre",
};

export function listBetaFeedback(): BetaFeedbackEntry[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addBetaFeedback(input: {
  type: BetaFeedbackType;
  text: string;
  route?: string;
  module?: string;
  missionId?: string;
}): BetaFeedbackEntry {
  const trimmed = input.text.trim();
  if (!trimmed) {
    throw new Error("Le feedback ne peut pas être vide.");
  }

  const entry: BetaFeedbackEntry = {
    id: newId(),
    type: input.type,
    text: trimmed,
    route: input.route?.trim() || undefined,
    module: input.module?.trim() || undefined,
    missionId: input.missionId?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const all = readAll();
  all.unshift(entry);
  writeAll(all);
  return entry;
}

export function deleteBetaFeedback(id: string): boolean {
  const all = readAll();
  const next = all.filter((e) => e.id !== id);
  if (next.length === all.length) return false;
  writeAll(next);
  return true;
}

export function countBetaFeedback(): number {
  return readAll().length;
}

/** Read-only export for dev diagnostics — never sent externally. */
export function exportBetaFeedbackLocal(): BetaFeedbackEntry[] {
  return listBetaFeedback();
}
