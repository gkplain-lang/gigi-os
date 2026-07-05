"use client";

import Link from "next/link";
import type { MissionLearningViewModel } from "@/modules/missionOS";

interface ProjectDetailLearningProps {
  viewModel: MissionLearningViewModel;
}

export function ProjectDetailLearning({ viewModel }: ProjectDetailLearningProps) {
  if (!viewModel.hasLearning) {
    return (
      <section className="gigi-command-card mb-5 p-5">
        <p className="gigi-mission-control-label">Apprentissage projet</p>
        <p className="mt-2 text-[13px] text-text-muted">
          Pas encore d&apos;apprentissage local pour ce projet — exécute, rapporte, puis consulte{" "}
          <Link href="/history" className="text-accent-soft hover:underline">
            /history
          </Link>
          .
        </p>
      </section>
    );
  }

  return (
    <section className="gigi-command-card mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
      <p className="gigi-mission-control-label text-emerald-200/90">Apprentissage projet</p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-text-primary">
        {viewModel.whatGigiLearned}
      </p>
      {viewModel.riskOrBlocker && (
        <p className="mt-2 text-[12px] text-amber-200/90">{viewModel.riskOrBlocker}</p>
      )}
      {viewModel.recommendedNextMissionTitle && (
        <p className="mt-3 text-[13px] text-text-secondary">
          Suite ·{" "}
          <Link
            href={viewModel.recommendedNextMissionRoute}
            className="font-medium text-accent-soft hover:underline"
          >
            {viewModel.recommendedNextMissionTitle}
          </Link>
        </p>
      )}
      <Link
        href="/history"
        className="gigi-focus mt-3 inline-flex text-[12.5px] text-text-muted hover:text-text-secondary"
      >
        Historique complet →
      </Link>
    </section>
  );
}
