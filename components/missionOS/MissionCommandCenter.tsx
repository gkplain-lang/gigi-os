"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { MissionOSBuildInput } from "@/modules/missionOS";
import { buildMissionOSViewModel } from "@/modules/missionOS";
import { MissionCommandCTA } from "./MissionCommandCTA";
import { MissionCommandTimeline } from "./MissionCommandTimeline";
import { MissionOSProgress } from "./MissionOSProgress";
import { MissionOSSafetyNoteFromVM } from "./MissionOSSafetyNote";
import { cn } from "@/lib/utils";

interface MissionCommandCenterProps {
  input: MissionOSBuildInput;
  className?: string;
  /** Contenu repliable — ex. MissionDecisionCenter */
  decisionSlot?: React.ReactNode;
}

export function MissionCommandCenter({
  input,
  className,
  decisionSlot,
}: MissionCommandCenterProps) {
  const viewModel = useMemo(() => buildMissionOSViewModel(input), [input]);

  return (
    <section
      className={cn(
        "gigi-panel-raised overflow-hidden rounded-2xl border border-indigo-500/30 shadow-[0_0_40px_-12px_rgba(99,102,241,0.35)]",
        className
      )}
    >
      <div className="border-b border-indigo-500/20 bg-indigo-500/10 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-indigo-400/40 bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-100">
            Mission du jour · Gigi V3
          </span>
          {viewModel.priorityLabel && (
            <span className="text-[11px] text-text-muted">{viewModel.priorityLabel}</span>
          )}
          {viewModel.confidenceLabel && (
            <span className="text-[11px] text-accent-soft">{viewModel.confidenceLabel}</span>
          )}
        </div>
        <h2 className="mt-2 font-display text-[22px] font-bold tracking-tight text-text-primary md:text-[26px]">
          {viewModel.currentMissionTitle}
        </h2>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-text-secondary">
          {viewModel.currentMissionSummary}
        </p>
        {input.projectId && input.projectName && (
          <Link
            href={`/projects/${input.projectId}`}
            className="gigi-focus mt-2 inline-flex text-[12.5px] font-medium text-accent-soft underline-offset-2 hover:underline"
          >
            Projet · {input.projectName} →
          </Link>
        )}
      </div>

      <div className="space-y-4 p-5 md:p-6">
        {viewModel.emptyStateTitle && (
          <div className="rounded-lg border border-dashed border-border/70 bg-surface-2/20 px-4 py-3">
            <p className="text-[14px] font-medium text-text-primary">{viewModel.emptyStateTitle}</p>
            {viewModel.emptyStateDescription && (
              <p className="mt-1 text-[13px] text-text-muted">{viewModel.emptyStateDescription}</p>
            )}
          </div>
        )}

        <div className="rounded-xl border border-[rgba(124,140,255,0.25)] bg-[rgba(124,140,255,0.06)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
            Pourquoi cette action
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-text-primary">
            {viewModel.primaryReason}
          </p>
          {viewModel.blockerLabel && (
            <p className="mt-2 text-[12.5px] text-amber-200/90">
              Blocage possible : {viewModel.blockerLabel}
            </p>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
              Étape actuelle
            </p>
            <p className="mt-1.5 text-[16px] font-semibold text-text-primary">
              {viewModel.currentStepLabel}
            </p>
            <p className="mt-1 text-[12px] text-text-muted">{viewModel.commandSubtitle}</p>
            <div className="mt-4">
              <MissionOSProgress viewModel={viewModel} />
            </div>
          </div>
          <MissionCommandCTA viewModel={viewModel} />
        </div>

        <MissionCommandTimeline viewModel={viewModel} />

        <MissionOSSafetyNoteFromVM viewModel={viewModel} />

        {decisionSlot && (
          <details id="mission-decision" className="group rounded-xl border border-border/50">
            <summary className="gigi-focus cursor-pointer list-none px-4 py-3 text-[13px] font-medium text-text-secondary marker:content-none [&::-webkit-details-marker]:hidden">
              Comparer les missions ·{" "}
              <span className="text-text-muted group-open:hidden">(afficher)</span>
              <span className="hidden text-text-muted group-open:inline">(masquer)</span>
            </summary>
            <div className="border-t border-border/40 p-4">{decisionSlot}</div>
          </details>
        )}
      </div>
    </section>
  );
}
