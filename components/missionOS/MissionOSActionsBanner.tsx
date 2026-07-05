"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMissionOSViewModel, formatReadinessLabel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionOSActionsBannerProps {
  className?: string;
}

export function MissionOSActionsBanner({ className }: MissionOSActionsBannerProps) {
  const viewModel = useMemo(
    () =>
      buildMissionOSViewModel({
        missionTitle: "Actions en cours",
        missionSummary: "Vue V3 — priorité à l'étape la plus importante du cycle.",
      }),
    []
  );

  return (
    <section
      className={cn(
        "mb-5 rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4 md:p-5",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
        Vue V3 · Closed Loop Mission OS
      </p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-text-primary">
            {viewModel.currentStepLabel}
          </p>
          <p className="mt-1 text-[12.5px] text-text-muted">
            {formatReadinessLabel(viewModel)} · {viewModel.progressPercent}% du cycle
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
            {viewModel.currentStepDescription}
          </p>
        </div>
        <Link
          href={viewModel.primaryCtaRoute}
          className="gigi-btn-primary gigi-focus inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          {viewModel.primaryCtaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="mt-3 text-[11px] text-text-muted">
        Filtres utiles : À valider · En exécution manuelle · Retour à traiter · Cycle à fermer
      </p>
    </section>
  );
}
