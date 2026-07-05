"use client";

import type { MissionPlanBridgeRecord } from "@/modules/missionPlanBridge";
import {
  MISSION_PLAN_BRIDGE_DISCLAIMER,
  MISSION_PLAN_BRIDGE_STATUS_LABELS,
} from "@/modules/missionPlanBridge";
import { cn } from "@/lib/utils";

interface MissionPlanBridgeSummaryCardProps {
  bridge: MissionPlanBridgeRecord;
  className?: string;
}

export function MissionPlanBridgeSummaryCard({
  bridge,
  className,
}: MissionPlanBridgeSummaryCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-2/20 px-4 py-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Bridge mission → plan · V2.7
        </p>
        <span className="rounded-full border border-[rgba(124,140,255,0.35)] bg-[rgba(124,140,255,0.1)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
          {MISSION_PLAN_BRIDGE_STATUS_LABELS[bridge.status]}
        </span>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-text-primary">{bridge.missionTitle}</p>
      {bridge.missionDescription && (
        <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
          {bridge.missionDescription}
        </p>
      )}
      {bridge.planDraft && (
        <p className="mt-2 text-[12.5px] text-text-muted">
          Plan : {bridge.planDraft.steps.length} étape(s) proposée(s)
        </p>
      )}
      <p className="mt-3 text-[11px] text-text-muted">{MISSION_PLAN_BRIDGE_DISCLAIMER}</p>
    </div>
  );
}
