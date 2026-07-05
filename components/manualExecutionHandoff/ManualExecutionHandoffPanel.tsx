"use client";

import { useCallback, useMemo, useState } from "react";
import type { QueuedAction } from "@/modules/actionQueue";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace";
import { getSafeActionWorkspaceByActionId } from "@/modules/safeActionWorkspace";
import {
  createHandoffFromQueuedAction,
  getHandoffsBySourceActionId,
  type ManualExecutionHandoff,
  type ManualExecutionHandoffTarget,
  MANUAL_EXECUTION_HANDOFF_DISCLAIMER,
  MANUAL_EXECUTION_HANDOFF_TARGET_LABELS,
  archiveManualExecutionHandoff,
} from "@/modules/manualExecutionHandoff";
import { ManualExecutionHandoffCard, ManualExecutionHandoffPanelFromWorkspace } from "./ManualExecutionHandoffCard";
import { cn } from "@/lib/utils";

const TARGETS: ManualExecutionHandoffTarget[] = ["cursor", "human", "self", "generic"];

interface ManualExecutionHandoffPanelProps {
  action: QueuedAction;
  workspace?: SafeActionWorkspace;
  onClose?: () => void;
  className?: string;
}

export function ManualExecutionHandoffPanel({
  action,
  workspace: workspaceProp,
  onClose,
  className,
}: ManualExecutionHandoffPanelProps) {
  const workspace = workspaceProp ?? getSafeActionWorkspaceByActionId(action.id);
  const existingHandoff = useMemo(
    () => getHandoffsBySourceActionId(action.id)[0],
    [action.id]
  );
  const [handoff, setHandoff] = useState<ManualExecutionHandoff | undefined>(existingHandoff);
  const [target, setTarget] = useState<ManualExecutionHandoffTarget>("cursor");
  const [showFromWorkspace, setShowFromWorkspace] = useState(false);

  const canCreate = ["pending_review", "approved", "copied"].includes(action.status);

  const handleCreate = useCallback(() => {
    if (workspace) {
      setShowFromWorkspace(true);
      return;
    }
    const created = createHandoffFromQueuedAction(action, target);
    setHandoff(created);
  }, [action, target, workspace]);

  const handleArchive = useCallback(() => {
    if (handoff) archiveManualExecutionHandoff(handoff.id);
    setHandoff(undefined);
    setShowFromWorkspace(false);
    onClose?.();
  }, [handoff, onClose]);

  if (!canCreate && !handoff && !workspace) return null;

  if (showFromWorkspace && workspace) {
    return (
      <ManualExecutionHandoffPanelFromWorkspace
        workspace={workspace}
        onClose={() => {
          setShowFromWorkspace(false);
          onClose?.();
        }}
        className={className}
      />
    );
  }

  return (
    <section
      id={`manual-handoff-action-${action.id}`}
      className={cn(
        "rounded-xl border border-violet-500/25 bg-violet-500/5 p-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
        Manual Execution Handoff · V2.9
      </p>

      {!handoff ? (
        <div className="mt-4 space-y-3">
          {!workspace && (
            <div className="flex flex-wrap gap-2">
              {TARGETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTarget(t)}
                  className={cn(
                    "gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]",
                    target === t && "ring-1 ring-violet-300/50"
                  )}
                >
                  {MANUAL_EXECUTION_HANDOFF_TARGET_LABELS[t]}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={handleCreate}
            className="gigi-btn-primary gigi-focus rounded-lg px-4 py-2 text-[13px] font-medium"
          >
            {workspace ? "Créer handoff depuis workspace" : "Créer handoff"}
          </button>
          <p className="text-[11px] text-text-muted">{MANUAL_EXECUTION_HANDOFF_DISCLAIMER}</p>
        </div>
      ) : (
        <div className="mt-4">
          <ManualExecutionHandoffCard
            handoff={handoff}
            onHandoffChange={setHandoff}
            onArchive={handleArchive}
          />
        </div>
      )}
    </section>
  );
}
