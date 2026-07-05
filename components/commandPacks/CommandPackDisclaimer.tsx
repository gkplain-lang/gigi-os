"use client";

import { EXECUTION_READINESS_V43_DISCLAIMER } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

export function CommandPackDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-[11.5px] italic text-amber-200/85", className)}>
      {EXECUTION_READINESS_V43_DISCLAIMER}
    </p>
  );
}
