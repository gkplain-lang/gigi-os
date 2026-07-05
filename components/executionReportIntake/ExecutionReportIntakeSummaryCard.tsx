"use client";

import type { ExecutionReportIntake } from "@/modules/executionReportIntake";
import {
  EXECUTION_REPORT_INTAKE_DECISION_LABELS,
  EXECUTION_REPORT_INTAKE_DISCLAIMER,
  EXECUTION_REPORT_INTAKE_REPORTER_LABELS,
  EXECUTION_REPORT_INTAKE_STATUS_LABELS,
} from "@/modules/executionReportIntake";
import { cn } from "@/lib/utils";

interface ExecutionReportIntakeSummaryCardProps {
  intake: ExecutionReportIntake;
  className?: string;
}

export function ExecutionReportIntakeSummaryCard({
  intake,
  className,
}: ExecutionReportIntakeSummaryCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-2/20 px-4 py-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Execution Report Intake · V2.10
        </p>
        <span className="rounded-full border border-[rgba(56,189,248,0.35)] bg-[rgba(56,189,248,0.1)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-200/90">
          {EXECUTION_REPORT_INTAKE_REPORTER_LABELS[intake.reporter]}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-text-muted">
          {EXECUTION_REPORT_INTAKE_STATUS_LABELS[intake.status]}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-text-muted">
          {EXECUTION_REPORT_INTAKE_DECISION_LABELS[intake.decision]}
        </span>
        <span className="text-[10px] tabular-nums text-text-muted">{intake.confidence}% confiance</span>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-text-primary">
        {intake.title.replace(/^Intake · /, "")}
      </p>
      <p className="mt-3 text-[11px] text-text-muted">{EXECUTION_REPORT_INTAKE_DISCLAIMER}</p>
    </div>
  );
}
