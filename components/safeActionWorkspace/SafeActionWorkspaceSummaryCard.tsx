"use client";

import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace";
import {
  SAFE_ACTION_WORKSPACE_DISCLAIMER,
  SAFE_ACTION_WORKSPACE_STATUS_LABELS,
} from "@/modules/safeActionWorkspace";
import { SafeActionWorkspaceReadinessBadge } from "./SafeActionWorkspaceReadinessBadge";
import { cn } from "@/lib/utils";

interface SafeActionWorkspaceSummaryCardProps {
  workspace: SafeActionWorkspace;
  className?: string;
}

export function SafeActionWorkspaceSummaryCard({
  workspace,
  className,
}: SafeActionWorkspaceSummaryCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-2/20 px-4 py-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Safe Action Workspace · V2.8
        </p>
        <SafeActionWorkspaceReadinessBadge readiness={workspace.readiness} />
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-text-muted">
          {SAFE_ACTION_WORKSPACE_STATUS_LABELS[workspace.status]}
        </span>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-text-primary">
        {workspace.title.replace(/^Workspace · /, "")}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{workspace.summary}</p>
      {workspace.metadata?.projectName && (
        <p className="mt-2 text-[12px] text-text-muted">
          Projet : {workspace.metadata.projectName}
        </p>
      )}
      <p className="mt-3 text-[11px] text-text-muted">{SAFE_ACTION_WORKSPACE_DISCLAIMER}</p>
    </div>
  );
}
