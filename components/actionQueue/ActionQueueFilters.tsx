"use client";

import type { ActionQueueFilter, QueuedActionStatus } from "@/modules/actionQueue";
import { QUEUED_STATUS_LABELS } from "@/modules/actionQueue";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { value: ActionQueueFilter["status"]; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "pending_review", label: QUEUED_STATUS_LABELS.pending_review },
  { value: "approved", label: QUEUED_STATUS_LABELS.approved },
  { value: "rejected", label: QUEUED_STATUS_LABELS.rejected },
  { value: "needs_revision", label: QUEUED_STATUS_LABELS.needs_revision },
];

interface ActionQueueFiltersProps {
  filter: ActionQueueFilter;
  onChange: (filter: ActionQueueFilter) => void;
  projects: { id: string; name: string }[];
  counts: Record<QueuedActionStatus | "all", number>;
}

export function ActionQueueFilters({
  filter,
  onChange,
  projects,
  counts,
}: ActionQueueFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value ?? "all"}
            type="button"
            onClick={() => onChange({ ...filter, status: value })}
            className={cn(
              "gigi-focus rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              (filter.status ?? "all") === value
                ? "bg-[rgba(124,140,255,0.2)] text-text-primary shadow-[inset_0_0_0_1px_rgba(124,140,255,0.35)]"
                : "bg-surface-2/60 text-text-muted hover:text-text-secondary"
            )}
          >
            {label}
            <span className="ml-1.5 tabular-nums text-text-muted">{counts[value ?? "all"]}</span>
          </button>
        ))}
      </div>

      {projects.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Projet
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...filter, projectId: undefined })}
            className={cn(
              "gigi-focus rounded-lg px-2.5 py-1 text-[12px]",
              !filter.projectId ? "text-accent-soft" : "text-text-muted hover:text-text-secondary"
            )}
          >
            Tous
          </button>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange({ ...filter, projectId: p.id })}
              className={cn(
                "gigi-focus rounded-lg px-2.5 py-1 text-[12px]",
                filter.projectId === p.id
                  ? "text-accent-soft"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
