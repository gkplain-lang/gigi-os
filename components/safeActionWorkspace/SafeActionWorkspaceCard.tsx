"use client";

import { useCallback, useState } from "react";
import { Archive, Check, Copy, Package, RefreshCw } from "lucide-react";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace";
import {
  addUserNote,
  archiveSafeActionWorkspace,
  getCopyableChecklistText,
  getCopyableWorkspaceText,
  getCursorContextText,
  refreshWorkspace,
  toggleChecklistItem,
} from "@/modules/safeActionWorkspace";
import { SafeActionWorkspaceSummaryCard } from "./SafeActionWorkspaceSummaryCard";
import { SafeActionWorkspaceChecklist } from "./SafeActionWorkspaceChecklist";
import { SafeActionWorkspaceTimeline } from "./SafeActionWorkspaceTimeline";
import { cn } from "@/lib/utils";
import { ManualExecutionHandoffPanelFromWorkspace } from "@/components/manualExecutionHandoff/ManualExecutionHandoffCard";

interface SafeActionWorkspaceCardProps {
  workspace: SafeActionWorkspace;
  onWorkspaceChange: (next: SafeActionWorkspace) => void;
  onArchive?: () => void;
  className?: string;
}

export function SafeActionWorkspaceCard({
  workspace,
  onWorkspaceChange,
  onArchive,
  className,
}: SafeActionWorkspaceCardProps) {
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState<"all" | "checklist" | "cursor" | null>(null);
  const [showHandoff, setShowHandoff] = useState(false);

  const handleRefresh = useCallback(() => {
    const next = refreshWorkspace(workspace.id);
    if (next) onWorkspaceChange(next);
  }, [workspace.id, onWorkspaceChange]);

  const handleToggle = useCallback(
    (itemId: string, completed: boolean) => {
      const next = toggleChecklistItem(workspace.id, itemId, completed);
      if (next) onWorkspaceChange(next);
    },
    [workspace.id, onWorkspaceChange]
  );

  const handleAddNote = useCallback(() => {
    const trimmed = note.trim();
    if (!trimmed) return;
    const next = addUserNote(workspace.id, trimmed);
    if (next) {
      onWorkspaceChange(next);
      setNote("");
    }
  }, [note, workspace.id, onWorkspaceChange]);

  const handleCopy = useCallback(
    async (kind: "all" | "checklist" | "cursor") => {
      const text =
        kind === "all"
          ? getCopyableWorkspaceText(workspace.id)
          : kind === "checklist"
            ? getCopyableChecklistText(workspace.id)
            : getCursorContextText(workspace.id);
      try {
        await navigator.clipboard.writeText(text);
        setCopied(kind);
        window.setTimeout(() => setCopied(null), 2000);
      } catch {
        /* ignore */
      }
    },
    [workspace.id]
  );

  const handleArchive = useCallback(() => {
    archiveSafeActionWorkspace(workspace.id);
    onArchive?.();
  }, [workspace.id, onArchive]);

  return (
    <article className={cn("space-y-4", className)}>
      <SafeActionWorkspaceSummaryCard workspace={workspace} />

      {workspace.risks.length > 0 && (
        <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Risques
          </p>
          <ul className="mt-2 space-y-1.5">
            {workspace.risks.map((r) => (
              <li key={r.id} className="text-[12.5px] text-text-secondary">
                <span className="font-medium text-text-primary">{r.label}</span>
                <span className="text-text-muted"> ({r.level})</span> — {r.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {workspace.prerequisites.length > 0 && (
        <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Prérequis
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {workspace.prerequisites.map((p) => (
              <li key={p} className="text-[12.5px] text-text-secondary">
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Checklist avant exécution manuelle
        </p>
        <SafeActionWorkspaceChecklist
          items={workspace.validationChecklist}
          onToggle={handleToggle}
          className="mt-3"
        />
      </div>

      {workspace.manualNextSteps.length > 0 && (
        <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Étapes manuelles suggérées
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            {workspace.manualNextSteps.map((step, i) => (
              <li key={`step-${i}`} className="text-[12.5px] text-text-secondary">
                {step.replace(/^\d+\.\s*/, "")}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Contexte agrégé
        </p>
        <SafeActionWorkspaceTimeline sections={workspace.sections} />
      </div>

      {workspace.userNotes.length > 0 && (
        <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Notes utilisateur
          </p>
          <ul className="mt-2 space-y-1">
            {workspace.userNotes.map((n) => (
              <li key={n.id} className="text-[12.5px] text-text-secondary">
                {n.content}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
        <label
          htmlFor={`workspace-note-${workspace.id}`}
          className="text-[10px] font-semibold uppercase tracking-wider text-text-muted"
        >
          Ajouter une note
        </label>
        <textarea
          id={`workspace-note-${workspace.id}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Contexte, blocage, décision…"
          className="gigi-focus mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px]"
        />
        <button
          type="button"
          onClick={handleAddNote}
          disabled={!note.trim()}
          className="gigi-btn gigi-focus mt-2 rounded-lg px-3 py-1.5 text-[12.5px] disabled:opacity-40"
        >
          Enregistrer la note
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleRefresh}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Actualiser
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("all")}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied === "all" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          Copier workspace
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("checklist")}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied === "checklist" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          Copier checklist
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("cursor")}
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
        >
          {copied === "cursor" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Contexte Cursor
        </button>
        <button
          type="button"
          onClick={() => setShowHandoff((v) => !v)}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          <Package className="h-3.5 w-3.5" />
          {showHandoff ? "Masquer handoff" : "Créer handoff"}
        </button>
        {onArchive && (
          <button
            type="button"
            onClick={handleArchive}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] text-text-muted"
          >
            <Archive className="h-3.5 w-3.5" />
            Archiver
          </button>
        )}
      </div>

      {showHandoff && (
        <ManualExecutionHandoffPanelFromWorkspace
          workspace={workspace}
          onClose={() => setShowHandoff(false)}
          className="mt-4"
        />
      )}
    </article>
  );
}
