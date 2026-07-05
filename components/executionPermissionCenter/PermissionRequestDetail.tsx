"use client";

import type { ExecutionReadinessRequest } from "@/modules/executionReadiness";
import {
  EXECUTION_MODE_LABELS,
  EXECUTION_PERMISSION_STATUS_LABELS,
  formatCapabilitiesList,
  formatExpirationLabel,
  isSensitiveCapability,
  revokeLocalPermission,
} from "@/modules/executionReadiness";
import { ExecutionScopeList } from "@/components/executionReadiness/ExecutionScopeList";
import { ExecutionSafetyChecklist } from "@/components/executionReadiness/ExecutionSafetyChecklist";
import { ExecutionRollbackPlan } from "@/components/executionReadiness/ExecutionRollbackPlan";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { ExecutionPermissionActions } from "@/components/executionReadiness/ExecutionPermissionActions";
import { PermissionAuditJournal } from "./PermissionAuditJournal";
import { ManualBridgePermissionSection } from "@/components/manualBridge/ManualBridgePermissionSection";

interface PermissionRequestDetailProps {
  request: ExecutionReadinessRequest;
  onUpdated: () => void;
}

export function PermissionRequestDetail({ request, onUpdated }: PermissionRequestDetailProps) {
  const expirationLabel = formatExpirationLabel(request.dryRunExpiresAt);
  const canRevoke = ["approved_for_dry_run", "simulated_only", "awaiting_user_approval"].includes(
    request.permissionStatus
  );

  function handleRevoke() {
    revokeLocalPermission(
      request.id,
      "Révocation locale depuis le centre de permissions — simulation close."
    );
    onUpdated();
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/80">
          Détail permission locale
        </p>
        <h2 className="mt-1 text-[18px] font-semibold text-text-primary">
          {request.title.replace(/^Readiness · /, "")}
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{request.summary}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ExecutionRiskBadge level={request.riskLevel} />
        <span className="rounded-md border border-border/50 px-2 py-0.5 text-[11px] text-text-muted">
          {EXECUTION_PERMISSION_STATUS_LABELS[request.permissionStatus]}
        </span>
        <span className="rounded-md border border-border/50 px-2 py-0.5 text-[11px] text-text-muted">
          {EXECUTION_MODE_LABELS[request.mode]}
        </span>
      </div>

      {expirationLabel && (
        <p className="text-[12px] text-amber-200/90">{expirationLabel} — permission non permanente</p>
      )}

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Capacités demandées (préparation / simulation)
        </p>
        <ul className="mt-2 space-y-1 text-[12.5px] text-text-secondary">
          {request.requestedCapabilities.map((cap) => (
            <li key={cap}>
              · {formatCapabilitiesList([cap])}
              {isSensitiveCapability(cap) ? " — bloquée en exécution réelle V4.1" : ""}
            </li>
          ))}
        </ul>
      </div>

      <ExecutionScopeList scopes={request.scopes} />
      <ExecutionSafetyChecklist items={request.requiredChecks} title="Justification / contrôles" />
      <ExecutionRollbackPlan steps={request.rollbackPlan} />
      <ExecutionSafetyChecklist items={request.evidenceRequired} title="Preuve attendue" />

      <PermissionAuditJournal entries={request.auditTrail} />

      <ManualBridgePermissionSection request={request} onUpdated={onUpdated} />

      <ExecutionPermissionActions request={request} onUpdated={onUpdated} />

      {canRevoke && (
        <button
          type="button"
          onClick={handleRevoke}
          className="gigi-focus rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-2 text-[13px] text-red-200"
        >
          Révoquer localement
        </button>
      )}
    </div>
  );
}
