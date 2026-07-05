"use client";

import type { ExecutionReportIntake } from "@/modules/executionReportIntake";
import { cn } from "@/lib/utils";

interface ExecutionReportIntakePreviewProps {
  intake: ExecutionReportIntake;
  className?: string;
}

export function ExecutionReportIntakePreview({
  intake,
  className,
}: ExecutionReportIntakePreviewProps) {
  const p = intake.parsedReport;

  const blocks: { label: string; items: string[] }[] = [
    { label: "Fichiers modifiés déclarés", items: p.filesModified },
    { label: "Étapes réalisées", items: p.stepsCompleted },
    { label: "Commandes déclarées", items: p.commandsRunManually },
    { label: "Tests", items: p.testResults.length ? p.testResults : p.testsRun },
    { label: "Blocages", items: p.blockers },
    { label: "Corrections nécessaires", items: p.fixesNeeded },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {p.finalSummary && (
        <div className="gigi-panel rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Rapport final déclaré
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">{p.finalSummary}</p>
        </div>
      )}

      {blocks.map(
        (block) =>
          block.items.length > 0 && (
            <div key={block.label} className="gigi-panel rounded-xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {block.label}
              </p>
              <ul className="mt-2 space-y-1">
                {block.items.map((item, i) => (
                  <li key={`${block.label}-${i}`} className="text-[13px] text-text-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
      )}

      {intake.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90">
            Warnings
          </p>
          <ul className="mt-2 space-y-2">
            {intake.warnings.map((w) => (
              <li key={w.id} className="text-[12.5px] text-text-secondary">
                <span className="font-medium text-text-primary">{w.label}</span>
                {" — "}
                {w.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {intake.proposedLogEntries.length > 0 && (
        <div className="gigi-panel rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Entrées de log proposées (V2.1)
          </p>
          <ul className="mt-2 space-y-1.5">
            {intake.proposedLogEntries.map((e) => (
              <li key={e.id} className="text-[12.5px] text-text-secondary">
                <span className="font-mono text-[11px] text-accent-soft">[{e.type}]</span> {e.message}
                <span className="ml-1 text-[10px] text-text-muted">({e.confidence}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {intake.proposedReviewSummary && (
        <div className="gigi-panel rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Review proposée (V2.2)
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
            {intake.proposedReviewSummary}
          </p>
        </div>
      )}
    </div>
  );
}
