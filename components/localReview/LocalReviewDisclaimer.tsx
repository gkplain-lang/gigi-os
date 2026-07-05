"use client";

import { EXECUTION_READINESS_V44_DISCLAIMER } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

export function LocalReviewDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-[11.5px] italic text-amber-200/85", className)}>
      {EXECUTION_READINESS_V44_DISCLAIMER}
    </p>
  );
}
