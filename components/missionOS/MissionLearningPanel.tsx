"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { MissionLearningViewModel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionLearningPanelProps {
  viewModel: MissionLearningViewModel;
  className?: string;
  /** Affiche uniquement l'essentiel ; détails en replié */
  collapsible?: boolean;
}

export function MissionLearningPanel({
  viewModel,
  className,
  collapsible = true,
}: MissionLearningPanelProps) {
  const detailsBody = (
    <>
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Dernier résultat
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
            {viewModel.whatHappened}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Ce que Gigi en tire
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-text-primary">
            {viewModel.whatGigiLearned}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Ce que ça change
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
            {viewModel.whatChanged}
          </p>
        </div>
      </div>

      {viewModel.signalLabels.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {viewModel.signalLabels.slice(0, 4).map((label) => (
            <li
              key={label}
              className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] text-text-muted"
            >
              {label}
            </li>
          ))}
        </ul>
      )}

      {viewModel.riskOrBlocker && (
        <p className="mt-3 text-[12px] text-amber-200/90">⚠ {viewModel.riskOrBlocker}</p>
      )}
    </>
  );

  return (
    <section
      className={cn(
        "rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5 md:p-6",
        className
      )}
      aria-labelledby="mission-learning-title"
    >
      <div className="flex items-start gap-2">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/90" aria-hidden />
        <div className="min-w-0 flex-1">
          <p
            id="mission-learning-title"
            className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90"
          >
            {viewModel.title}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-text-primary">
            {viewModel.whatGigiLearned}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-100/90">
          {viewModel.outcomeLabel}
        </span>
      </div>

      {collapsible ? (
        <details className="mt-4 rounded-lg border border-border/40 bg-surface/20">
          <summary className="cursor-pointer px-4 py-2.5 text-[13px] font-medium text-text-secondary">
            Détails de l&apos;apprentissage
          </summary>
          <div className="border-t border-border/40 px-4 py-3">{detailsBody}</div>
        </details>
      ) : (
        <div className="mt-4">{detailsBody}</div>
      )}

      {(viewModel.recommendedNextMissionTitle || viewModel.recommendationKindLabel) && (
        <div className="mt-4 rounded-lg border border-emerald-500/20 bg-surface/30 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/80">
            {viewModel.recommendationKindLabel}
          </p>
          {viewModel.recommendedNextMissionTitle && (
            <p className="mt-1 text-[14px] font-semibold text-text-primary">
              {viewModel.recommendedNextMissionTitle}
            </p>
          )}
          {viewModel.recommendedNextMissionReason && (
            <p className="mt-1 text-[12.5px] text-text-muted">
              {viewModel.recommendedNextMissionReason}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={viewModel.recommendedNextActionRoute}
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          {viewModel.recommendedNextActionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/history"
          className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          Voir l&apos;historique
        </Link>
      </div>

      <p className="mt-3 text-[11px] text-text-muted">{viewModel.safetyNote}</p>
    </section>
  );
}
