"use client";

import type { ExecutionReadinessRequest } from "@/modules/executionReadiness";
import {
  EXECUTION_MODE_LABELS,
  EXECUTION_PERMISSION_STATUS_LABELS,
  formatCapabilitiesList,
} from "@/modules/executionReadiness";
import { ExecutionRiskBadge } from "./ExecutionRiskBadge";
import { ExecutionScopeList } from "./ExecutionScopeList";
import { ExecutionSafetyChecklist } from "./ExecutionSafetyChecklist";
import { ExecutionRollbackPlan } from "./ExecutionRollbackPlan";
import { ExecutionPermissionActions } from "./ExecutionPermissionActions";

interface ExecutionReadinessCardProps {
  request: ExecutionReadinessRequest;
  onUpdated?: () => void;
  expanded?: boolean;
}

export function ExecutionReadinessCard({
  request,
  onUpdated,
  expanded = false,
}: ExecutionReadinessCardProps) {
  return (
    <article className="rounded-xl border border-violet-500/25 bg-violet-500/5 p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/80">
            Préparation exécution · V4.0
          </p>
          <h3 className="mt-1 text-[15px] font-semibold text-text-primary">
            {request.title.replace(/^Readiness · /, "")}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{request.summary}</p>
        </div>
        <ExecutionRiskBadge level={request.riskLevel} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-text-muted">
        <span className="rounded-md border border-border/50 px-2 py-0.5">
          {EXECUTION_PERMISSION_STATUS_LABELS[request.permissionStatus]}
        </span>
        <span className="rounded-md border border-border/50 px-2 py-0.5">
          {EXECUTION_MODE_LABELS[request.mode]}
        </span>
        <span className="rounded-md border border-border/50 px-2 py-0.5">
          {formatCapabilitiesList(request.requestedCapabilities)}
        </span>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-border/40 pt-4">
          <ExecutionScopeList scopes={request.scopes} />
          <ExecutionSafetyChecklist items={request.requiredChecks} title="Contrôles requis" />
          <ExecutionSafetyChecklist items={request.evidenceRequired} title="Preuve attendue" />
          <ExecutionRollbackPlan steps={request.rollbackPlan} />
          {request.safetyNotes.length > 0 && (
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2">
              {request.safetyNotes.slice(0, 4).map((note) => (
                <p key={note} className="text-[11.5px] leading-relaxed text-amber-100/90">
                  {note}
                </p>
              ))}
            </div>
          )}
          {request.auditTrail.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Audit trail local
              </p>
              <ul className="mt-2 space-y-1">
                {request.auditTrail.slice(0, 5).map((entry) => (
                  <li key={entry.id} className="text-[11px] text-text-muted">
                    {entry.at.slice(0, 16).replace("T", " ")} — {entry.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <ExecutionPermissionActions request={request} onUpdated={onUpdated} />
      </div>
    </article>
  );
}
