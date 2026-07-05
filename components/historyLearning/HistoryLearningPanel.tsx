"use client";

import { useCallback, useState } from "react";
import type { HistoryLearningEntry } from "@/modules/historyLearning";
import {
  HISTORY_LEARNING_DISCLAIMER,
  archiveHistoryEntryById,
  createManualHistoryEntry,
  generateGlobalSummary,
  getCopyableEntryText,
  getCopyableGlobalSummaryText,
  listHistoryEntries,
} from "@/modules/historyLearning";
import { HistoryLearningEntryCard } from "./HistoryLearningEntryCard";
import { HistoryLearningSummaryCard } from "./HistoryLearningSummaryCard";
import { cn } from "@/lib/utils";

interface HistoryLearningPanelProps {
  className?: string;
}

export function HistoryLearningPanel({ className }: HistoryLearningPanelProps) {
  const [entries, setEntries] = useState<HistoryLearningEntry[]>(() => listHistoryEntries());
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [copiedGlobal, setCopiedGlobal] = useState(false);

  const summary = generateGlobalSummary();

  const refresh = useCallback(() => {
    setEntries(listHistoryEntries());
  }, []);

  const handleArchive = useCallback(
    (id: string) => {
      archiveHistoryEntryById(id);
      refresh();
    },
    [refresh]
  );

  const handleCopyEntry = useCallback(async (entry: HistoryLearningEntry) => {
    try {
      await navigator.clipboard.writeText(getCopyableEntryText(entry));
    } catch {
      /* fallback */
    }
  }, []);

  const handleCopyGlobal = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getCopyableGlobalSummaryText());
      setCopiedGlobal(true);
      window.setTimeout(() => setCopiedGlobal(false), 2000);
    } catch {
      /* fallback */
    }
  }, []);

  const handleAddManualNote = useCallback(() => {
    const title = noteTitle.trim() || "Note d'apprentissage";
    const content = noteContent.trim();
    if (!content) return;

    createManualHistoryEntry(title, content);
    setNoteTitle("");
    setNoteContent("");
    refresh();
  }, [noteTitle, noteContent, refresh]);

  return (
    <section className={cn("space-y-4", className)}>
      <HistoryLearningSummaryCard
        summary={summary}
        onCopyGlobal={handleCopyGlobal}
      />
      {copiedGlobal && (
        <p className="text-[12px] text-emerald-400/90">Synthèse globale copiée.</p>
      )}

      <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Note d&apos;apprentissage manuelle
        </p>
        <div className="mt-2 space-y-2">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Titre (optionnel)"
            className="gigi-focus w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px]"
          />
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Ex. Toujours vérifier le build avant de marquer terminé"
            rows={2}
            className="gigi-focus w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px]"
          />
          <button
            type="button"
            onClick={handleAddManualNote}
            disabled={!noteContent.trim()}
            className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] font-medium disabled:opacity-40"
          >
            Ajouter une note
          </button>
        </div>
        <p className="mt-2 text-[11px] text-text-muted">{HISTORY_LEARNING_DISCLAIMER}</p>
      </div>

      {entries.length > 0 ? (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <HistoryLearningEntryCard
                entry={entry}
                onArchive={handleArchive}
                onCopy={(e) => void handleCopyEntry(e)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-[13px] text-text-muted">
          Aucune entrée — archive une review depuis /actions pour commencer.
        </p>
      )}
    </section>
  );
}
