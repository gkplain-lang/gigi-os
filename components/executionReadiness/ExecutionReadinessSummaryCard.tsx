"use client";

import Link from "next/link";
import type { ExecutionReadinessGlobalSummary } from "@/modules/executionReadiness";
import { EXECUTION_READINESS_V4_TAGLINE } from "@/modules/executionReadiness";

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
        Préparation exécution contrôlée · V4.0
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{summary.summaryText}</p>
      {summary.totalRequests > 0 && (
        <p className="mt-2 text-[12px] text-text-muted">
          {summary.activeRequests} active(s) · {summary.awaitingApproval} en attente ·{" "}
          {summary.approvedDryRun} dry-run approuvé(s)
        </p>
      )}
      <p className="mt-2 text-[11.5px] italic text-text-muted">{EXECUTION_READINESS_V4_TAGLINE}</p>
      <Link
        href="/actions"
        className="mt-3 inline-flex text-[12.5px] font-medium text-accent-soft underline-offset-2 hover:underline"
      >
        Voir sur /actions →
      </Link>
    </div>
  );
}
