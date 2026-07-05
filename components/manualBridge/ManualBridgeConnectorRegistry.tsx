"use client";

import { getSandboxConnectorRegistry } from "@/modules/executionReadiness";
import { EXECUTION_RISK_LABELS } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

export function ManualBridgeConnectorRegistry({ className }: { className?: string }) {
  const connectors = getSandboxConnectorRegistry();

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Registry connecteurs sandbox — non actifs
      </p>
      {connectors.map((c) => (
        <div
          key={c.id}
          className="rounded-xl border border-border/40 bg-surface-2/10 px-4 py-3"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[14px] font-medium text-text-primary">{c.label}</p>
            <span className="text-[10px] uppercase tracking-wider text-amber-200/90">
              {c.status.replace(/_/g, " ")} · connecteur non actif
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-text-secondary">{c.description}</p>
          <p className="mt-1 text-[11px] text-text-muted">
            Risque · {EXECUTION_RISK_LABELS[c.riskLevel]} · {c.requiredPermissionScope}
          </p>
          <p className="mt-2 text-[11.5px] text-text-muted">
            Préparable : {c.preparableTaskExamples.join(" · ")}
          </p>
          <p className="mt-1 text-[11px] italic text-amber-200/80">{c.disclaimer}</p>
        </div>
      ))}
    </div>
  );
}
