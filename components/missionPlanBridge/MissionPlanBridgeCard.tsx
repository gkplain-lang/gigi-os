"use client";

import type { MissionPlanBridgeRecord } from "@/modules/missionPlanBridge";
import { MissionPlanBridgeSummaryCard } from "./MissionPlanBridgeSummaryCard";
import { MissionPlanBridgeActions } from "./MissionPlanBridgeActions";
import { cn } from "@/lib/utils";

interface MissionPlanBridgeCardProps {
  bridge: MissionPlanBridgeRecord;
  projectName: string;
  onBridgeChange: (next: MissionPlanBridgeRecord) => void;
  onArchive?: () => void;
  compact?: boolean;
  className?: string;
}

export function MissionPlanBridgeCard({
  bridge,
  projectName,
  onBridgeChange,
  onArchive,
  compact = false,
  className,
}: MissionPlanBridgeCardProps) {
  return (
    <article className={cn("space-y-3", className)}>
      <MissionPlanBridgeSummaryCard bridge={bridge} />
      {!compact && bridge.planDraft && (
        <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Plan proposé
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            {bridge.planDraft.steps.slice(0, 8).map((step) => (
              <li key={step.id} className="text-[12.5px] text-text-secondary">
                {step.title}
              </li>
            ))}
          </ol>
          {bridge.planDraft.steps.length > 8 && (
            <p className="mt-1 text-[11px] text-text-muted">
              + {bridge.planDraft.steps.length - 8} étape(s) supplémentaire(s)
            </p>
          )}
        </div>
      )}
      {!compact && bridge.risks.length > 0 && (
        <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Risques
          </p>
          <ul className="mt-2 space-y-1">
            {bridge.risks.slice(0, 4).map((r) => (
              <li key={r.id} className="text-[12.5px] text-text-secondary">
                {r.label} — {r.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      <MissionPlanBridgeActions
        bridge={bridge}
        projectName={projectName}
        onBridgeChange={onBridgeChange}
        onArchive={onArchive}
      />
    </article>
  );
}
