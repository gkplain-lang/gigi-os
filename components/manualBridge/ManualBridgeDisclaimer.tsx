"use client";

import { getManualBridgeDisclaimer } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

export function ManualBridgeDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-[12px] leading-relaxed text-amber-100/90",
        className
      )}
    >
      {getManualBridgeDisclaimer()}
    </p>
  );
}
