"use client";

import { useState } from "react";
import type { ClosedLoopLifecycle } from "@/modules/closedLoopLifecycle";
import { addLifecycleUserNote } from "@/modules/closedLoopLifecycle";
import { ClosedLoopLifecycleSummaryCard } from "./ClosedLoopLifecycleSummaryCard";
import { ClosedLoopLifecycleTimeline } from "./ClosedLoopLifecycleTimeline";
import { ClosedLoopLifecycleNextSteps } from "./ClosedLoopLifecycleNextSteps";
import { ClosedLoopLifecycleActions } from "./ClosedLoopLifecycleActions";
import { cn } from "@/lib/utils";

interface ClosedLoopLifecycleCardProps {
  lifecycle: ClosedLoopLifecycle;
  onLifecycleChange: (next: ClosedLoopLifecycle) => void;
  onArchive?: () => void;
  className?: string;
}

export function ClosedLoopLifecycleCard({
  lifecycle,
  onLifecycleChange,
  onArchive,
  className,
}: ClosedLoopLifecycleCardProps) {
  const [note, setNote] = useState("");

  const handleAddNote = () => {
    const next = addLifecycleUserNote(lifecycle.id, note);
    if (next) {
      onLifecycleChange(next);
      setNote("");
    }
  };

  return (
    <article className={cn("space-y-4", className)}>
      <ClosedLoopLifecycleSummaryCard lifecycle={lifecycle} />
      <ClosedLoopLifecycleTimeline lifecycle={lifecycle} />
      <ClosedLoopLifecycleNextSteps lifecycle={lifecycle} />

      {(lifecycle.risks.length > 0 || lifecycle.learnings.length > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          {lifecycle.risks.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90">
                Risques
              </p>
              <ul className="mt-2 space-y-1.5">
                {lifecycle.risks.map((r) => (
                  <li key={r.id} className="text-[12.5px] text-text-secondary">
                    <span className="font-medium text-text-primary">{r.label}</span> — {r.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {lifecycle.learnings.length > 0 && (
            <div className="gigi-panel rounded-xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Apprentissages
              </p>
              <ul className="mt-2 space-y-1.5">
                {lifecycle.learnings.map((l) => (
                  <li key={l.id} className="text-[12.5px] text-text-secondary">
                    <span className="font-medium text-text-primary">{l.label}</span> — {l.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ClosedLoopLifecycleActions
        lifecycle={lifecycle}
        onLifecycleChange={onLifecycleChange}
        onArchive={onArchive}
      />

      {lifecycle.userNotes.length > 0 && (
        <ul className="space-y-1 text-[12.5px] text-text-secondary">
          {lifecycle.userNotes.map((n, i) => (
            <li key={`${i}-${n.slice(0, 12)}`}>* {n}</li>
          ))}
        </ul>
      )}

      <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Note cycle
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="gigi-focus mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px]"
          placeholder="Observation sur ce cycle…"
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
