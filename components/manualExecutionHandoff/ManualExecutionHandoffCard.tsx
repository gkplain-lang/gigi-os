"use client";

import { useCallback, useState } from "react";
import type { ManualExecutionHandoff, ManualExecutionHandoffTarget } from "@/modules/manualExecutionHandoff";
import {
  addHandoffUserNote,
  archiveManualExecutionHandoff,
  createHandoffFromWorkspace,
  MANUAL_EXECUTION_HANDOFF_TARGET_LABELS,
  updateHandoffTarget,
} from "@/modules/manualExecutionHandoff";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace";
import { ManualExecutionHandoffSummaryCard } from "./ManualExecutionHandoffSummaryCard";
import { ManualExecutionHandoffPreview } from "./ManualExecutionHandoffPreview";
import { ManualExecutionHandoffActions } from "./ManualExecutionHandoffActions";
import { cn } from "@/lib/utils";

const TARGETS: ManualExecutionHandoffTarget[] = ["cursor", "human", "self", "generic"];

interface ManualExecutionHandoffCardProps {
  handoff: ManualExecutionHandoff;
  onHandoffChange: (next: ManualExecutionHandoff) => void;
  onTargetChange?: (target: ManualExecutionHandoffTarget) => void;
  onArchive?: () => void;
  className?: string;
}

export function ManualExecutionHandoffCard({
  handoff,
  onHandoffChange,
  onTargetChange,
  onArchive,
  className,
}: ManualExecutionHandoffCardProps) {
  const [note, setNote] = useState("");

  const handleTarget = (target: ManualExecutionHandoffTarget) => {
    onTargetChange?.(target);
    const next = updateHandoffTarget(handoff.id, target);
    if (next) onHandoffChange(next);
  };

  const handleAddNote = () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    const next = addHandoffUserNote(handoff.id, trimmed);
    if (next) {
      onHandoffChange(next);
      setNote("");
    }
  };

  return (
    <article className={cn("space-y-4", className)}>
      <ManualExecutionHandoffSummaryCard handoff={handoff} />

      <div className="flex flex-wrap gap-2">
        {TARGETS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTarget(t)}
            className={cn(
              "gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]",
              handoff.target === t && "ring-1 ring-accent-soft"
            )}
          >
            {MANUAL_EXECUTION_HANDOFF_TARGET_LABELS[t]}
          </button>
        ))}
      </div>

      <ManualExecutionHandoffPreview handoff={handoff} />

      <ManualExecutionHandoffActions
        handoff={handoff}
        onHandoffChange={onHandoffChange}
        onArchive={onArchive}
      />

      {handoff.userNotes.length > 0 && (
        <ul className="space-y-1 text-[12.5px] text-text-secondary">
          {handoff.userNotes.map((n, i) => (
            <li key={`${i}-${n.slice(0, 12)}`}>* {n}</li>
          ))}
        </ul>
      )}

      <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Note handoff
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="gigi-focus mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px]"
          placeholder="Instructions supplémentaires…"
        />
        <button
          type="button"
          onClick={handleAddNote}
          disabled={!note.trim()}
          className="gigi-btn gigi-focus mt-2 rounded-lg px-3 py-1.5 text-[12.5px] disabled:opacity-40"
        >
          Ajouter
        </button>
      </div>
    </article>
  );
}

interface ManualExecutionHandoffPanelFromWorkspaceProps {
  workspace: SafeActionWorkspace;
  onClose?: () => void;
  className?: string;
}

export function ManualExecutionHandoffPanelFromWorkspace({
  workspace,
  onClose,
  className,
}: ManualExecutionHandoffPanelFromWorkspaceProps) {
  const [handoff, setHandoff] = useState<ManualExecutionHandoff | undefined>();
  const [target, setTarget] = useState<ManualExecutionHandoffTarget>("cursor");

  const handleCreate = useCallback(() => {
    const created = createHandoffFromWorkspace(workspace, target);
    setHandoff(created);
  }, [workspace, target]);

  const handleArchive = useCallback(() => {
    if (handoff) archiveManualExecutionHandoff(handoff.id);
    setHandoff(undefined);
    onClose?.();
  }, [handoff, onClose]);

  return (
    <section
      id={`manual-handoff-${workspace.id}`}
      className={cn(
        "rounded-xl border border-violet-500/25 bg-violet-500/5 p-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
        Manual Execution Handoff · V2.9
      </p>
      <p className="mt-1 text-[13px] text-text-secondary">
        Paquet de passation copiable — Gigi n&apos;envoie et n&apos;exécute rien.
      </p>

      {!handoff ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {TARGETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTarget(t)}
                className={cn(
                  "gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]",
                  target === t && "ring-1 ring-violet-300/50"
                )}
              >
                {MANUAL_EXECUTION_HANDOFF_TARGET_LABELS[t]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="gigi-btn-primary gigi-focus rounded-lg px-4 py-2 text-[13px] font-medium"
          >
            Créer handoff
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <ManualExecutionHandoffCard
            handoff={handoff}
            onHandoffChange={setHandoff}
            onTargetChange={(t) => {
              setTarget(t);
              const created = createHandoffFromWorkspace(workspace, t);
              setHandoff(created);
            }}
            onArchive={handleArchive}
          />
        </div>
      )}
    </section>
  );
}
