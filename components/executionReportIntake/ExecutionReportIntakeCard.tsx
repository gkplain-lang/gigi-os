"use client";

import { useState } from "react";
import type { ExecutionReportIntake, ExecutionReportIntakeReporter } from "@/modules/executionReportIntake";
import {
  addIntakeUserNote,
  EXECUTION_REPORT_INTAKE_REPORTER_LABELS,
  upsertExecutionReportIntake,
} from "@/modules/executionReportIntake";
import { ExecutionReportIntakeSummaryCard } from "./ExecutionReportIntakeSummaryCard";
import { ExecutionReportIntakePreview } from "./ExecutionReportIntakePreview";
import { ExecutionReportIntakeActions } from "./ExecutionReportIntakeActions";
import { cn } from "@/lib/utils";

const REPORTERS: ExecutionReportIntakeReporter[] = ["cursor", "human", "self", "generic", "unknown"];

interface ExecutionReportIntakeCardProps {
  intake: ExecutionReportIntake;
  onIntakeChange: (next: ExecutionReportIntake) => void;
  onReporterChange?: (reporter: ExecutionReportIntakeReporter) => void;
  onHandoffMarked?: () => void;
  onArchive?: () => void;
  className?: string;
}

export function ExecutionReportIntakeCard({
  intake,
  onIntakeChange,
  onReporterChange,
  onHandoffMarked,
  onArchive,
  className,
}: ExecutionReportIntakeCardProps) {
  const [note, setNote] = useState("");

  const handleReporter = (reporter: ExecutionReportIntakeReporter) => {
    onReporterChange?.(reporter);
    const next = upsertExecutionReportIntake({
      ...intake,
      reporter,
      updatedAt: new Date().toISOString(),
    });
    onIntakeChange(next);
  };

  const handleAddNote = () => {
    const next = addIntakeUserNote(intake.id, note);
    if (next) {
      onIntakeChange(next);
      setNote("");
    }
  };

  return (
    <article className={cn("space-y-4", className)}>
      <ExecutionReportIntakeSummaryCard intake={intake} />

      <div className="flex flex-wrap gap-2">
        {REPORTERS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleReporter(r)}
            className={cn(
              "gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]",
              intake.reporter === r && "ring-1 ring-sky-300/50"
            )}
          >
            {EXECUTION_REPORT_INTAKE_REPORTER_LABELS[r]}
          </button>
        ))}
      </div>

      <ExecutionReportIntakePreview intake={intake} />

      <ExecutionReportIntakeActions
        intake={intake}
        onIntakeChange={onIntakeChange}
        onHandoffMarked={onHandoffMarked}
        onArchive={onArchive}
      />

      {intake.userNotes.length > 0 && (
        <ul className="space-y-1 text-[12.5px] text-text-secondary">
          {intake.userNotes.map((n, i) => (
            <li key={`${i}-${n.slice(0, 12)}`}>* {n}</li>
          ))}
        </ul>
      )}

      <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Note intake
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="gigi-focus mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px]"
          placeholder="Commentaire sur le rapport reçu…"
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
