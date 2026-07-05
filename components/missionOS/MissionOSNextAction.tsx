"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MissionOSViewModel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionOSNextActionProps {
  viewModel: MissionOSViewModel;
  className?: string;
  compact?: boolean;
}

export function MissionOSNextAction({ viewModel, className, compact }: MissionOSNextActionProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
        Prochaine action
      </p>
      <p className="mt-1.5 text-[15px] font-semibold text-text-primary">
        {viewModel.nextActionLabel}
      </p>
      {!compact && viewModel.risks.length > 0 && (
        <p className="mt-2 text-[12px] text-amber-200/90">
          Attention : {viewModel.risks[0]}
        </p>
      )}
      <Link
        href={viewModel.nextActionRoute}
        className="gigi-btn-primary gigi-focus mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13.5px] font-medium"
      >
        {viewModel.nextActionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
