"use client";

import type { LocalReviewSession } from "@/modules/executionReadiness";
import { LocalReviewStatusBadge } from "./LocalReviewStatusBadge";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { cn } from "@/lib/utils";

export function LocalReviewSessionList({
  sessions,
  selectedId,
  onSelect,
  className,
}: {
  sessions: LocalReviewSession[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}) {
  if (sessions.length === 0) {
    return (
      <p className="text-[12.5px] text-text-muted">
        Aucune revue — crée-en une ou associe-la à un pack de commandes.
      </p>
    );
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {sessions.map((session) => {
        const isSelected = session.id === selectedId;
        return (
          <li key={session.id}>
            <button
              type="button"
              onClick={() => onSelect(session.id)}
              className={cn(
                "gigi-focus w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                isSelected
                  ? "border-teal-500/50 bg-teal-500/10"
                  : "border-border/40 bg-surface-2/10 hover:border-border/60"
              )}
            >
              <p className="text-[13px] font-medium text-text-primary">{session.title}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <LocalReviewStatusBadge status={session.status} />
                <ExecutionRiskBadge level={session.riskLevel} />
                <span className="text-[11px] text-text-muted">
                  confiance {session.confidence}
                </span>
                {session.hasSensitivePatternAlert && (
                  <span className="text-[11px] text-amber-200/90">alerte secret</span>
                )}
                <span className="text-[11px] text-text-muted">
                  {new Date(session.updatedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
