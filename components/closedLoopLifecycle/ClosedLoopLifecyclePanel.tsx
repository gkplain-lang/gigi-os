"use client";

import { useCallback, useMemo, useState } from "react";
import type { QueuedAction } from "@/modules/actionQueue";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace";
import type { ManualExecutionHandoff } from "@/modules/manualExecutionHandoff";
import type { ExecutionReportIntake } from "@/modules/executionReportIntake";
import type { ClosedLoopLifecycle } from "@/modules/closedLoopLifecycle";
import {
  archiveLifecycle,
  createLifecycleFromAction,
  createLifecycleFromHandoff,
  createLifecycleFromIntake,
  createLifecycleFromWorkspace,
  CLOSED_LOOP_LIFECYCLE_DISCLAIMER,
  getExistingLifecycleForAction,
  getLifecyclesByHandoffId,
  getLifecyclesByReportIntakeId,
  getLifecyclesByWorkspaceId,
  recalculateLifecycle,
} from "@/modules/closedLoopLifecycle";
import { ClosedLoopLifecycleCard } from "./ClosedLoopLifecycleCard";
import { cn } from "@/lib/utils";

interface ClosedLoopLifecyclePanelProps {
  action?: QueuedAction;
  workspace?: SafeActionWorkspace;
  handoff?: ManualExecutionHandoff;
  intake?: ExecutionReportIntake;
  onClose?: () => void;
  className?: string;
}

export function ClosedLoopLifecyclePanel({
  action,
  workspace,
  handoff,
  intake,
  onClose,
  className,
}: ClosedLoopLifecyclePanelProps) {
  const existingLifecycle = useMemo(() => {
    if (action) return getExistingLifecycleForAction(action.id);
    if (workspace) return getLifecyclesByWorkspaceId(workspace.id)[0];
    if (handoff) return getLifecyclesByHandoffId(handoff.id)[0];
    if (intake) return getLifecyclesByReportIntakeId(intake.id)[0];
    return undefined;
  }, [action, workspace, handoff, intake]);

  const [lifecycle, setLifecycle] = useState<ClosedLoopLifecycle | undefined>(existingLifecycle);

  const handleCreate = useCallback(() => {
    let created: ClosedLoopLifecycle;
    if (action) created = createLifecycleFromAction(action);
    else if (workspace) created = createLifecycleFromWorkspace(workspace);
    else if (handoff) created = createLifecycleFromHandoff(handoff);
    else if (intake) created = createLifecycleFromIntake(intake);
    else return;
    setLifecycle(created);
  }, [action, workspace, handoff, intake]);

  const handleRecalculate = useCallback(() => {
    if (!lifecycle) return;
    const next = recalculateLifecycle(lifecycle.id);
    if (next) setLifecycle(next);
  }, [lifecycle]);

  const handleArchive = useCallback(() => {
    if (lifecycle) archiveLifecycle(lifecycle.id);
    setLifecycle(undefined);
    onClose?.();
  }, [lifecycle, onClose]);

  const panelId = action
    ? `lifecycle-action-${action.id}`
    : workspace
      ? `lifecycle-workspace-${workspace.id}`
      : handoff
        ? `lifecycle-handoff-${handoff.id}`
        : intake
          ? `lifecycle-intake-${intake.id}`
          : "lifecycle";

  return (
    <section
      id={panelId}
      className={cn(
        "rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
        Closed Loop Action Lifecycle · V2.11
      </p>
      <p className="mt-1 text-[13px] text-text-secondary">
        Vue cycle complet — agrégation locale sans vérification repo.
      </p>

      {!lifecycle ? (
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleCreate}
            className="gigi-btn-primary gigi-focus rounded-lg px-4 py-2 text-[13px] font-medium"
          >
            Ouvrir cycle complet
          </button>
          <p className="text-[11px] text-text-muted">{CLOSED_LOOP_LIFECYCLE_DISCLAIMER}</p>
        </div>
      ) : (
        <div className="mt-4">
          <ClosedLoopLifecycleCard
            lifecycle={lifecycle}
            onLifecycleChange={setLifecycle}
            onArchive={handleArchive}
          />
          <button
            type="button"
            onClick={handleRecalculate}
            className="gigi-btn gigi-focus mt-3 rounded-lg px-3 py-1.5 text-[12px] text-text-muted"
          >
            Rafraîchir depuis données locales
          </button>
        </div>
      )}
    </section>
  );
}
