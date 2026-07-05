"use client";

import { useCallback, useMemo, useState } from "react";
import type { MissionDecision } from "@/modules/missionDecision";
import type { MissionPlanBridgeRecord } from "@/modules/missionPlanBridge";
import {
  archiveMissionPlanBridge,
  createBridgeFromDecision,
  getAcceptedCandidateFromDecision,
  getBridgesByMissionDecisionId,
  getBridgesByProjectId,
  MISSION_PLAN_BRIDGE_DISCLAIMER,
} from "@/modules/missionPlanBridge";
import { PROJECT_NAMES } from "@/modules/conversation/missionCatalog";
import { MissionPlanBridgeCard } from "./MissionPlanBridgeCard";
import { cn } from "@/lib/utils";

interface MissionPlanBridgePanelProps {
  decision?: MissionDecision;
  projectId?: string;
  missionTitle?: string;
  className?: string;
}

export function MissionPlanBridgePanel({
  decision,
  projectId,
  missionTitle,
  className,
}: MissionPlanBridgePanelProps) {
  const acceptedCandidate = decision
    ? getAcceptedCandidateFromDecision(decision)
    : undefined;

  const initialBridge = useMemo(() => {
    if (decision && ["accepted", "converted_to_plan"].includes(decision.status)) {
      const existing = getBridgesByMissionDecisionId(decision.id).find(
        (b) => b.status !== "archived"
      );
      return existing;
    }
    if (projectId) {
      return getBridgesByProjectId(projectId).find((b) => b.status !== "archived");
    }
    return undefined;
  }, [decision, projectId]);

  const [bridge, setBridge] = useState<MissionPlanBridgeRecord | undefined>(initialBridge);

  const projectName =
    acceptedCandidate?.metadata?.projectName ??
    (bridge?.projectId
      ? PROJECT_NAMES[bridge.projectId as keyof typeof PROJECT_NAMES] ?? bridge.projectId
      : projectId
        ? PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES] ?? projectId
        : "projet");

  const canCreate =
    decision &&
    ["accepted", "converted_to_plan"].includes(decision.status) &&
    acceptedCandidate &&
    !bridge;

  const handleCreateBridge = useCallback(() => {
    if (!decision) return;
    const created = createBridgeFromDecision(decision);
    if (created) setBridge(created);
  }, [decision]);

  const handleArchive = useCallback(() => {
    if (!bridge) return;
    const archived = archiveMissionPlanBridge(bridge.id);
    if (archived) setBridge(undefined);
  }, [bridge]);

  if (!decision && !projectId && !bridge) return null;

  if (!bridge && !canCreate) {
    if (!decision || !["accepted", "converted_to_plan"].includes(decision.status)) {
      return null;
    }
  }

  return (
    <section
      id="mission-plan-bridge"
      className={cn(
        "rounded-xl border border-[rgba(124,140,255,0.28)] bg-[rgba(124,140,255,0.04)] p-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
        Mission → Plan · V2.7
      </p>
      <p className="mt-1 text-[13px] text-text-secondary">
        {missionTitle ?? acceptedCandidate?.title ?? "Transforme une mission acceptée en plan d'action."}
      </p>

      {canCreate && (
        <div className="mt-4 space-y-3">
          <p className="text-[12.5px] text-text-muted">
            Mission acceptée détectée — crée un bridge local pour proposer plan, action et file de validation.
          </p>
          <button
            type="button"
            onClick={handleCreateBridge}
            className="gigi-btn-primary gigi-focus rounded-lg px-4 py-2 text-[13px] font-medium"
          >
            Transformer en plan
          </button>
        </div>
      )}

      {bridge && (
        <div className="mt-4">
          <MissionPlanBridgeCard
            bridge={bridge}
            projectName={projectName}
            onBridgeChange={setBridge}
            onArchive={handleArchive}
          />
        </div>
      )}

      <p className="mt-3 text-[11px] text-text-muted">{MISSION_PLAN_BRIDGE_DISCLAIMER}</p>
    </section>
  );
}
