"use client";

import type { ExecutionReadinessAuditEntry } from "@/modules/executionReadiness";
import { EXECUTION_DECISION_LABELS } from "@/modules/executionReadiness";

interface PermissionAuditJournalProps {
  entries: ExecutionReadinessAuditEntry[];
}

const TYPE_LABELS: Record<ExecutionReadinessAuditEntry["type"], string> = {
  created: "Créée",
  decision: "Décision",
  note: "Note",
  status_change: "Statut",
  expired: "Expirée",
  revoked: "Révoquée",
};

export function PermissionAuditJournal({ entries }: PermissionAuditJournalProps) {
  if (entries.length === 0) {
    return (
      <p className="text-[12px] text-text-muted">Aucune entrée dans le journal d&apos;audit local.</p>
    );
  }

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Journal d&apos;audit local
      </p>
      <ol className="mt-3 space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="rounded-lg border border-border/40 bg-surface-2/10 px-3 py-2 text-[12px]"
          >
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-text-muted">
              <span>{TYPE_LABELS[entry.type]}</span>
              <span>{entry.at.slice(0, 16).replace("T", " ")}</span>
              {entry.decision && (
                <span className="text-violet-200/80">
                  {EXECUTION_DECISION_LABELS[entry.decision]}
                </span>
              )}
            </div>
            <p className="mt-1 text-text-secondary">{entry.message}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
