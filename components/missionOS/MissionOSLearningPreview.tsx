"use client";

import Link from "next/link";
import type { MissionOSViewModel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionOSLearningPreviewProps {
  viewModel: MissionOSViewModel;
  className?: string;
}

export function MissionOSLearningPreview({ viewModel, className }: MissionOSLearningPreviewProps) {
  if (!viewModel.learningSummary) return null;

  return (
    <div className={cn("rounded-xl border border-violet-500/25 bg-violet-500/5 p-4", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
        Apprentissage local
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
        {viewModel.learningSummary}
      </p>
      <Link
        href="/history"
        className="gigi-focus mt-3 inline-block text-[12.5px] text-accent-soft underline-offset-2 hover:underline"
      >
        Voir l&apos;historique et archiver
      </Link>
    </div>
  );
}
