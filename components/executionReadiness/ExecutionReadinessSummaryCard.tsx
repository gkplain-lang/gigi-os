"use client";

import Link from "next/link";
import type { ExecutionReadinessGlobalSummary } from "@/modules/executionReadiness";
import {
  EXECUTION_READINESS_V4_TAGLINE,
  EXECUTION_READINESS_V41_DISCLAIMER,
} from "@/modules/executionReadiness";

interface ExecutionReadinessSummaryCardProps {
  summary: ExecutionReadinessGlobalSummary;
  className?: string;
}

export function ExecutionReadinessSummaryCard({
  summary,
  className,
}: ExecutionReadinessSummaryCardProps) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/80">
        Centre de permissions · V4.1
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{summary.summaryText}</p>
      {summary.totalRequests > 0 && (
        <p className="mt-2 text-[12px] text-text-muted">
          {summary.activeRequests} active(s) · {summary.awaitingApproval} en attente ·{" "}
          {summary.approvedDryRun} dry-run · {summary.expiredCount} expirée(s) ·{" "}
          {summary.revokedCount} révoquée(s)
        </p>
      )}
      <p className="mt-2 text-[11.5px] italic text-text-muted">{EXECUTION_READINESS_V41_DISCLAIMER}</p>
      <p className="mt-1 text-[11px] text-text-muted">{EXECUTION_READINESS_V4_TAGLINE}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link
          href="/permissions"
          className="inline-flex text-[12.5px] font-medium text-accent-soft underline-offset-2 hover:underline"
        >
          Centre de permissions →
        </Link>
        <Link
          href="/actions"
          className="inline-flex text-[12.5px] font-medium text-text-muted underline-offset-2 hover:text-text-secondary hover:underline"
        >
          /actions →
        </Link>
      </div>
    </div>
  );
}
