"use client";

import { useCallback, useMemo, useState } from "react";
import type { QueuedAction } from "@/modules/actionQueue";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace";
import {
  createWorkspaceFromQueuedAction,
  getSafeActionWorkspaceByActionId,
  SAFE_ACTION_WORKSPACE_DISCLAIMER,
} from "@/modules/safeActionWorkspace";
import { SafeActionWorkspaceCard } from "./SafeActionWorkspaceCard";
import { cn } from "@/lib/utils";

interface SafeActionWorkspacePanelProps {
  action: QueuedAction;
  onClose?: () => void;
  className?: string;
}

export function SafeActionWorkspacePanel({
  action,
  onClose,
  className,
}: SafeActionWorkspacePanelProps) {
  const initial = useMemo(
    () => getSafeActionWorkspaceByActionId(action.id),
    [action.id]
  );
  const [workspace, setWorkspace] = useState<SafeActionWorkspace | undefined>(initial);
  const [opened, setOpened] = useState(Boolean(initial));

  const canOpen = ["pending_review", "approved", "copied"].includes(action.status);

  const handleOpen = useCallback(() => {
    const created = createWorkspaceFromQueuedAction(action);
    setWorkspace(created);
    setOpened(true);
  }, [action]);

  const handleArchive = useCallback(() => {
    setWorkspace(undefined);
    setOpened(false);
    onClose?.();
  }, [onClose]);

  if (!canOpen && !opened) return null;

  return (
    <section
      id={`safe-action-workspace-${action.id}`}
      className={cn(
        "rounded-xl border border-[rgba(124,140,255,0.28)] bg-[rgba(124,140,255,0.04)] p-4",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
            Safe Action Workspace · V2.8
          </p>
          <p className="mt-1 text-[13px] text-text-secondary">
            Poste de pilotage local — agrège le contexte avant exécution manuelle.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="gigi-focus text-[12px] text-text-muted underline"
          >
            Fermer
          </button>
        )}
      </div>

      {!opened ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleOpen}
            className="gigi-btn-primary gigi-focus rounded-lg px-4 py-2 text-[13px] font-medium"
          >
            Ouvrir workspace
          </button>
          <p className="mt-2 text-[11px] text-text-muted">{SAFE_ACTION_WORKSPACE_DISCLAIMER}</p>
        </div>
      ) : (
        workspace && (
          <div className="mt-4">
            <SafeActionWorkspaceCard
              workspace={workspace}
              onWorkspaceChange={setWorkspace}
              onArchive={handleArchive}
            />
          </div>
        )
      )}
    </section>
  );
}
