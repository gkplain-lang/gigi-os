"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ActionFlowViewModel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface ActionFlowPrimaryCardProps {
  viewModel: ActionFlowViewModel;
  className?: string;
}

export function ActionFlowPrimaryCard({ viewModel, className }: ActionFlowPrimaryCardProps) {
  const hasPrimary = Boolean(viewModel.primaryActionId);

  return (
    <section
      className={cn(
        "rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-transparent p-5 md:p-6",
        className
      )}
      aria-labelledby="action-flow-primary-title"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
        Action à faire maintenant
      </p>

      <h2 id="action-flow-primary-title" className="mt-2 text-[18px] font-semibold text-text-primary">
        {viewModel.primaryActionTitle}
      </h2>

      {viewModel.primaryActionSummary && (
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          {viewModel.primaryActionSummary}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-indigo-400/40 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-medium text-indigo-100">
          {viewModel.activeStageLabel}
        </span>
        <span className="rounded-full border border-border/50 px-2.5 py-0.5 text-[11px] text-text-muted">
          {viewModel.activeStatusLabel}
        </span>
        {viewModel.progressPercent > 0 && (
          <span className="rounded-full border border-border/50 px-2.5 py-0.5 text-[11px] text-text-muted">
            {viewModel.progressPercent}% du cycle
          </span>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-border/40 bg-surface/40 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Pourquoi cette action
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
          {viewModel.whyThisAction}
        </p>
      </div>

      {viewModel.blockers.length > 0 && (
        <ul className="mt-3 space-y-1 text-[12px] text-amber-200/90">
          {viewModel.blockers.map((b) => (
            <li key={b}>⚠ {b}</li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={viewModel.primaryCtaRoute}
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium"
        >
          {viewModel.primaryCtaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {viewModel.secondaryCtaLabel && viewModel.secondaryCtaRoute && (
          <Link
            href={viewModel.secondaryCtaRoute}
            className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-4 py-2.5 text-[13px] font-medium"
          >
            {viewModel.secondaryCtaLabel}
          </Link>
        )}
      </div>

      {!hasPrimary && viewModel.emptyStateTitle && (
        <p className="mt-3 text-[12px] text-text-muted">
          Aucune action prioritaire — utilise les détails avancés ou décide ta mission.
        </p>
      )}
    </section>
  );
}
