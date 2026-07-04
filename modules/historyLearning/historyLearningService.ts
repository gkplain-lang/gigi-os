import type { ExecutionLog } from "@/modules/executionLogs/types";
import type { ExecutionReview } from "@/modules/executionReviews/types";
import type { FollowUpActionProposal } from "@/modules/followUpActions/types";
import {
  buildEntryFromFollowUp,
  buildEntryFromLog,
  buildEntryFromReview,
  createEntryId,
} from "./historyLearningEngine";
import {
  formatGlobalHistorySummaryForCopy,
  formatHistoryEntryForCopy,
} from "./historyLearningFormatter";
import {
  HISTORY_LEARNING_EMPTY_SUMMARY,
  HISTORY_LEARNING_GUIDANCE,
} from "./historyLearningSummary";
import {
  archiveHistoryEntry,
  getHistoryEntryById,
  listHistoryEntries,
  upsertHistoryEntry,
} from "./historyLearningStore";
import type {
  HistoryLearningEntry,
  HistoryLearningGlobalSummary,
  HistoryLearningIntent,
  HistoryLearningNote,
} from "./types";
import { HISTORY_LEARNING_DISCLAIMER } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProjectId(norm: string): string | null {
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/gigi ?os|gigios|(^|\W)gigi(\W|$)/.test(norm)) return "gigi-os";
  return null;
}

const HISTORY_LEARNING_KEYWORDS = [
  "archive ca",
  "archive ça",
  "mets ca dans l historique",
  "mets ça dans l'historique",
  "qu est ce qu on a appris",
  "qu'est-ce qu'on a appris",
  "resume l historique",
  "résume l'historique",
  "garde une trace",
  "transforme ca en apprentissage",
  "transforme ça en apprentissage",
  "qu est ce qui bloque souvent",
  "bloque souvent",
  "historique d apprentissage",
  "learning loop",
  "boucle d apprentissage",
];

export function detectHistoryLearningIntent(objective: string): HistoryLearningIntent {
  const norm = normalize(objective);
  const isHistoryLearning = HISTORY_LEARNING_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isHistoryLearning, projectId: detectProjectId(norm) };
}

function finalizeEntry(
  partial: Omit<HistoryLearningEntry, "id" | "createdAt" | "updatedAt">
): HistoryLearningEntry {
  const timestamp = new Date().toISOString();
  return upsertHistoryEntry({
    id: createEntryId(),
    ...partial,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export function createHistoryEntryFromReview(
  review: ExecutionReview,
  log?: ExecutionLog,
  followUps?: FollowUpActionProposal[]
): HistoryLearningEntry {
  return finalizeEntry(buildEntryFromReview(review, log, followUps));
}

export function createHistoryEntryFromLog(log: ExecutionLog): HistoryLearningEntry {
  return finalizeEntry(buildEntryFromLog(log));
}

export function createHistoryEntryFromFollowUp(proposal: FollowUpActionProposal): HistoryLearningEntry {
  return finalizeEntry(buildEntryFromFollowUp(proposal));
}

export function createManualHistoryEntry(title: string, summary: string): HistoryLearningEntry {
  const timestamp = new Date().toISOString();
  const note: HistoryLearningNote = {
    id: `hlnote-${Date.now()}`,
    title,
    content: summary,
    createdAt: timestamp,
  };
  const signal = {
    id: `hlsig-learning_note-${Date.now()}`,
    type: "learning_note" as const,
    label: title,
    description: summary,
    severity: "info" as const,
    createdAt: timestamp,
  };
  return finalizeEntry({
    title,
    summary,
    status: "unclear",
    outcome: "unclear",
    source: "manual",
    signals: [signal],
    learnings: [note],
    recommendedFutureBehavior: [],
  });
}

function toPreviewEntry(
  partial: Omit<HistoryLearningEntry, "id" | "createdAt" | "updatedAt">
): HistoryLearningEntry {
  const timestamp = new Date().toISOString();
  return { id: "preview", ...partial, createdAt: timestamp, updatedAt: timestamp };
}

export function previewHistoryEntryFromReview(
  review: ExecutionReview,
  log?: ExecutionLog,
  followUps?: FollowUpActionProposal[]
): HistoryLearningEntry {
  return toPreviewEntry(buildEntryFromReview(review, log, followUps));
}

export function previewHistoryEntryFromFollowUp(
  proposal: FollowUpActionProposal
): HistoryLearningEntry {
  return toPreviewEntry(buildEntryFromFollowUp(proposal));
}

export function addLearningNoteToEntry(
  entryId: string,
  title: string,
  content: string
): HistoryLearningEntry | undefined {
  const entry = getHistoryEntryById(entryId);
  if (!entry) return undefined;

  const note: HistoryLearningNote = {
    id: `hlnote-${Date.now()}`,
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  const signal = {
    id: `hlsig-learning_note-${Date.now()}`,
    type: "learning_note" as const,
    label: title,
    description: content,
    severity: "info" as const,
    createdAt: note.createdAt,
  };

  return upsertHistoryEntry({
    ...entry,
    learnings: [note, ...entry.learnings],
    signals: [signal, ...entry.signals],
    updatedAt: new Date().toISOString(),
  });
}

export function archiveHistoryEntryById(id: string): HistoryLearningEntry | undefined {
  return archiveHistoryEntry(id);
}

export function generateGlobalSummary(projectId?: string): HistoryLearningGlobalSummary {
  const entries = listHistoryEntries(projectId ? { projectId } : undefined);

  if (entries.length === 0) {
    return {
      totalEntries: 0,
      completedCount: 0,
      blockedCount: 0,
      recurringPatterns: [],
      topLearnings: [],
      summaryText: HISTORY_LEARNING_EMPTY_SUMMARY,
    };
  }

  const completedCount = entries.filter(
    (e) => e.status === "completed" || e.outcome === "success"
  ).length;
  const blockedCount = entries.filter(
    (e) => e.status === "blocked" || e.outcome === "blocked"
  ).length;

  const recurringPatterns = entries
    .flatMap((e) => e.signals.filter((s) => s.type === "recurring_pattern"))
    .map((s) => s.label);

  const topLearnings = entries
    .flatMap((e) => e.learnings.map((l) => l.content))
    .slice(0, 5);

  const parts = [
    `${entries.length} entrée(s) locale(s)`,
    `${completedCount} terminée(s)`,
    blockedCount > 0 ? `${blockedCount} bloquée(s)` : null,
    recurringPatterns.length > 0 ? `${recurringPatterns.length} motif(s) récurrent(s)` : null,
  ].filter(Boolean);

  return {
    totalEntries: entries.length,
    completedCount,
    blockedCount,
    recurringPatterns,
    topLearnings,
    summaryText: parts.join(", ") + ".",
  };
}

export function getCopyableEntryText(entry: HistoryLearningEntry): string {
  return formatHistoryEntryForCopy(entry);
}

export function getCopyableGlobalSummaryText(projectId?: string): string {
  const entries = listHistoryEntries(projectId ? { projectId } : undefined);
  const summary = generateGlobalSummary(projectId);
  return formatGlobalHistorySummaryForCopy(entries, summary.summaryText);
}

export function buildHistoryLearningGuidanceHints(objective: string): string[] {
  const hints = [
    "Ouvre /history pour voir la boucle d'apprentissage locale.",
    "Depuis /actions, après une review, clique « Archiver dans l'historique ».",
    "Ajoute une note d'apprentissage manuelle si tu veux capturer une leçon.",
  ];
  if (/archive|trace|historique/.test(objective.toLowerCase())) {
    hints.push("L'archivage ne supprime pas l'action source — trace additive uniquement.");
  }
  if (/appris|apprentissage|bloque/.test(objective.toLowerCase())) {
    hints.push("Les motifs récurrents sont détectés localement à partir des signaux passés.");
  }
  return hints;
}

export {
  listHistoryEntries,
  getHistoryEntryById,
  HISTORY_LEARNING_DISCLAIMER,
  HISTORY_LEARNING_GUIDANCE,
};
