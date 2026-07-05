"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MissionOSViewModel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionCommandCTAProps {
  viewModel: MissionOSViewModel;
  className?: string;
}

export function MissionCommandCTA({ viewModel, className }: MissionCommandCTAProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-emerald-500/35 bg-gradient-to-br from-emerald-500/10 to-indigo-500/5 p-5",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
        Action à faire maintenant
      </p>
      <p className="mt-2 text-[17px] font-bold text-text-primary">{viewModel.primaryCtaLabel}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
        {viewModel.currentStepDescription}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={viewModel.primaryCtaRoute}
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[14px] font-semibold"
        >
          {viewModel.primaryCtaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
        {viewModel.secondaryCtaLabel && viewModel.secondaryCtaRoute && (
          <Link
            href={viewModel.secondaryCtaRoute}
            className="gigi-btn gigi-focus inline-flex items-center rounded-lg px-4 py-3 text-[13px]"
          >
            {viewModel.secondaryCtaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
