"use client";

import type { SafeActionWorkspaceReadiness } from "@/modules/safeActionWorkspace";
import { SAFE_ACTION_WORKSPACE_READINESS_LABELS } from "@/modules/safeActionWorkspace";
import { cn } from "@/lib/utils";

const READINESS_STYLE: Record<SafeActionWorkspaceReadiness, string> = {
  ready: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300/90",
  missing_context: "border-amber-500/35 bg-amber-500/10 text-amber-200/90",
  risky: "border-orange-500/35 bg-orange-500/10 text-orange-200/90",
  blocked: "border-red-500/35 bg-red-500/10 text-red-300/90",
  unclear: "border-violet-500/35 bg-violet-500/10 text-violet-200/90",
};

interface SafeActionWorkspaceReadinessBadgeProps {
  readiness: SafeActionWorkspaceReadiness;
  className?: string;
}

export function SafeActionWorkspaceReadinessBadge({
  readiness,
  className,
}: SafeActionWorkspaceReadinessBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        READINESS_STYLE[readiness],
        className
      )}
    >
      {SAFE_ACTION_WORKSPACE_READINESS_LABELS[readiness]}
    </span>
  );
}
