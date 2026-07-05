"use client";

import { useCallback, useState } from "react";
import type { QueuedAction } from "@/modules/actionQueue/types";
import {
  createReadinessRequestFromAction,
  EXECUTION_READINESS_DISCLAIMER,
  EXECUTION_READINESS_V4_TAGLINE,
  getRequestsByActionId,
  listActiveExecutionReadinessRequests,
} from "@/modules/executionReadiness";
import { ExecutionReadinessCard } from "./ExecutionReadinessCard";
import { cn } from "@/lib/utils";

interface ExecutionReadinessPanelProps {
  primaryAction?: QueuedAction;
  className?: string;
  compact?: boolean;
}

export function ExecutionReadinessPanel({
  primaryAction,
  className,
  compact = false,
}: ExecutionReadinessPanelProps) {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  void tick;

  const actionRequests = primaryAction ? getRequestsByActionId(primaryAction.id) : [];
  const recentRequests =
    actionRequests.length > 0 ? actionRequests : listActiveExecutionReadinessRequests(compact ? 2 : 5);

  function handleCreateFromAction() {
    if (!primaryAction) return;
    createReadinessRequestFromAction({
      actionId: primaryAction.id,
      actionTitle: primaryAction.preparedAction.title,
      actionSummary: primaryAction.preparedAction.summary,
      preparedType: primaryAction.preparedAction.type,
      projectId: primaryAction.projectId,
    });
    refresh();
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-violet-500/30 bg-violet-500/[0.06] p-5 md:p-6",
        className
      )}
      aria-label="Préparation exécution contrôlée V4.0"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-200/90">
            Préparation exécution contrôlée · Gigi V4
          </p>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-text-secondary">
            {EXECUTION_READINESS_V4_TAGLINE}
          </p>
        </div>
        {primaryAction && actionRequests.length === 0 && (
          <button
            type="button"
            onClick={handleCreateFromAction}
            className="gigi-btn-primary gigi-focus shrink-0 rounded-lg px-3.5 py-2 text-[12.5px] font-medium"
          >
            Préparer depuis l&apos;action dominante
          </button>
        )}
      </div>

      <p className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-[12px] leading-relaxed text-amber-100/90">
        {EXECUTION_READINESS_DISCLAIMER}
      </p>

      {recentRequests.length === 0 ? (
        <p className="mt-4 text-[13px] text-text-muted">
          Aucune demande locale — crée-en une depuis l&apos;action dominante ou demande à Gigi «
          prépare l&apos;exécution ».
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {recentRequests.map((request) => (
            <ExecutionReadinessCard
              key={request.id}
              request={request}
              onUpdated={refresh}
              expanded={!compact}
            />
          ))}
        </div>
      )}
    </section>
  );
}
