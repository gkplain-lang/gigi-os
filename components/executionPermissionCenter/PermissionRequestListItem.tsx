"use client";

import type { ExecutionReadinessRequest } from "@/modules/executionReadiness";
import {
  EXECUTION_PERMISSION_STATUS_LABELS,
  formatCapabilitiesList,
} from "@/modules/executionReadiness";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { cn } from "@/lib/utils";

interface PermissionRequestListItemProps {
  request: ExecutionReadinessRequest;
  selected: boolean;
  onSelect: () => void;
}

export function PermissionRequestListItem({
  request,
  selected,
  onSelect,
}: PermissionRequestListItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "gigi-focus w-full rounded-xl border px-4 py-3 text-left transition-colors",
        selected
          ? "border-violet-500/40 bg-violet-500/10"
          : "border-border/50 bg-surface-2/10 hover:bg-surface-2/20"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[14px] font-medium text-text-primary">
          {request.title.replace(/^Readiness · /, "")}
        </p>
        <ExecutionRiskBadge level={request.riskLevel} />
      </div>
      <p className="mt-1 line-clamp-2 text-[12.5px] text-text-secondary">{request.summary}</p>
      <div className="mt-2 flex flex-wrap gap-1.5 text-[10.5px] text-text-muted">
        <span className="rounded border border-border/40 px-1.5 py-0.5">
          {EXECUTION_PERMISSION_STATUS_LABELS[request.permissionStatus]}
        </span>
        <span className="rounded border border-border/40 px-1.5 py-0.5">
          {formatCapabilitiesList(request.requestedCapabilities)}
        </span>
      </div>
    </button>
  );
}
