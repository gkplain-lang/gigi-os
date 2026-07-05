"use client";

import {
  PERMISSION_CENTER_FILTER_LABELS,
  type PermissionCenterFilterId,
} from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

interface PermissionCenterFiltersProps {
  filter: PermissionCenterFilterId;
  counts: Record<PermissionCenterFilterId, number>;
  onChange: (filter: PermissionCenterFilterId) => void;
  className?: string;
}

const FILTER_ORDER: PermissionCenterFilterId[] = [
  "all",
  "awaiting",
  "approved_dry_run",
  "rejected",
  "expired",
  "blocked",
  "revoked",
];

export function PermissionCenterFilters({
  filter,
  counts,
  onChange,
  className,
}: PermissionCenterFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {FILTER_ORDER.map((id) => {
        const active = filter === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "gigi-focus rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
              active
                ? "border-violet-500/40 bg-violet-500/15 text-text-primary"
                : "border-border/50 text-text-muted hover:text-text-secondary"
            )}
          >
            {PERMISSION_CENTER_FILTER_LABELS[id]}
            <span className="ml-1.5 tabular-nums text-[11px] opacity-70">({counts[id]})</span>
          </button>
        );
      })}
    </div>
  );
}
