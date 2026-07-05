import type { ExecutionRiskLevel } from "@/modules/executionReadiness";
import { EXECUTION_RISK_LABELS } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

const RISK_STYLES: Record<ExecutionRiskLevel, string> = {
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  high: "border-orange-500/35 bg-orange-500/10 text-orange-100",
  critical: "border-red-500/35 bg-red-500/15 text-red-100",
  blocked: "border-red-600/40 bg-red-600/15 text-red-200",
};

interface ExecutionRiskBadgeProps {
  level: ExecutionRiskLevel;
  className?: string;
}

export function ExecutionRiskBadge({ level, className }: ExecutionRiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        RISK_STYLES[level],
        className
      )}
    >
      Risque {EXECUTION_RISK_LABELS[level]}
    </span>
  );
}
