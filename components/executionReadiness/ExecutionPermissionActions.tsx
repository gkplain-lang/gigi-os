"use client";

import type {
  ExecutionReadinessDecisionType,
  ExecutionReadinessRequest,
} from "@/modules/executionReadiness";
import { EXECUTION_DECISION_LABELS } from "@/modules/executionReadiness";
import { applyExecutionReadinessDecision } from "@/modules/executionReadiness";

interface ExecutionPermissionActionsProps {
  request: ExecutionReadinessRequest;
  onUpdated?: () => void;
  compact?: boolean;
}

const DECISIONS: ExecutionReadinessDecisionType[] = [
  "approve_dry_run",
  "reject",
  "request_more_context",
  "mark_simulated_only",
  "archive",
];

const DECISION_REASONS: Record<ExecutionReadinessDecisionType, string> = {
  approve_dry_run: "Dry-run approuvé localement — aucune exécution réelle.",
  reject: "Demande refusée par l'utilisateur.",
  request_more_context: "Plus de contexte demandé avant validation.",
  mark_simulated_only: "Marquée simulation seule — V4.0.",
  archive: "Demande archivée localement.",
};

export function ExecutionPermissionActions({
  request,
  onUpdated,
  compact = false,
}: ExecutionPermissionActionsProps) {
  if (["archived", "rejected"].includes(request.permissionStatus)) {
    return (
      <p className="text-[12px] text-text-muted">
        Demande {request.permissionStatus === "archived" ? "archivée" : "refusée"} — aucune action
        automatique.
      </p>
    );
  }

  function handleDecision(decision: ExecutionReadinessDecisionType) {
    applyExecutionReadinessDecision(request.id, decision, DECISION_REASONS[decision]);
    onUpdated?.();
  }

  return (
    <div className={compact ? "flex flex-wrap gap-2" : "space-y-2"}>
      {!compact && (
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Décision locale — ne lance rien
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {DECISIONS.map((decision) => (
          <button
            key={decision}
            type="button"
            onClick={() => handleDecision(decision)}
            className={
              decision === "approve_dry_run"
                ? "gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
                : decision === "reject"
                  ? "gigi-btn-secondary gigi-focus rounded-lg border-red-500/30 px-3 py-1.5 text-[12px] text-red-200/90"
                  : "gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
            }
          >
            {EXECUTION_DECISION_LABELS[decision]}
          </button>
        ))}
      </div>
    </div>
  );
}
