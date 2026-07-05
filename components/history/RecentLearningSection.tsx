"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  buildMissionLearningViewModel,
  getRecentLearningSignals,
} from "@/modules/missionOS";

export function RecentLearningSection() {
  const viewModel = useMemo(() => buildMissionLearningViewModel(), []);
  const signals = useMemo(() => getRecentLearningSignals(5), []);

  return (
    <section className="gigi-panel-raised mb-6 rounded-xl p-5 md:p-6" aria-label="Apprentissage récent">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
        Apprentissage récent · V3.3
      </p>
      <p className="mt-2 text-[15px] font-semibold text-text-primary">{viewModel.whatGigiLearned}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{viewModel.whatChanged}</p>

      {signals.length > 0 && (
        <ul className="mt-4 space-y-2">
          {signals.map((s) => (
            <li
              key={`${s.label}-${s.description.slice(0, 20)}`}
              className="rounded-lg border border-border/40 px-3 py-2 text-[12.5px]"
            >
              <span className="font-medium text-text-primary">{s.label}</span>
              <span className="text-text-muted"> — {s.description}</span>
            </li>
          ))}
        </ul>
      )}

      {viewModel.recommendedNextMissionTitle && (
        <div className="mt-4 rounded-lg border border-indigo-500/25 bg-indigo-500/5 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
            Suite recommandée
          </p>
          <p className="mt-1 text-[14px] font-medium text-text-primary">
            {viewModel.recommendedNextMissionTitle}
          </p>
          {viewModel.recommendedNextMissionReason && (
            <p className="mt-1 text-[12px] text-text-muted">
              {viewModel.recommendedNextMissionReason}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/"
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          Mission du jour
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/actions"
          className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          Flux d&apos;action
        </Link>
      </div>

      <p className="mt-3 text-[11px] text-text-muted">{viewModel.safetyNote}</p>
    </section>
  );
}
