"use client";

import type { ManualExecutionPacket } from "@/modules/executionReadiness";
import { getEffectivePacketStatus, getSandboxConnectorById } from "@/modules/executionReadiness";
import { ManualBridgeStatusBadge } from "./ManualBridgeStatusBadge";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { cn } from "@/lib/utils";

interface ManualBridgePacketListProps {
  packets: ManualExecutionPacket[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ManualBridgePacketList({
  packets,
  selectedId,
  onSelect,
}: ManualBridgePacketListProps) {
  if (packets.length === 0) {
    return (
      <p className="rounded-lg border border-border/40 px-4 py-8 text-center text-[13px] text-text-muted">
        Aucun paquet — prépare-en un depuis une permission ou ce panel.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {packets.map((packet) => {
        const status = getEffectivePacketStatus(packet);
        const connector = getSandboxConnectorById(packet.connectorId);
        return (
          <button
            key={packet.id}
            type="button"
            onClick={() => onSelect(packet.id)}
            className={cn(
              "gigi-focus w-full rounded-xl border px-4 py-3 text-left transition-colors",
              selectedId === packet.id
                ? "border-indigo-500/40 bg-indigo-500/10"
                : "border-border/50 bg-surface-2/10 hover:bg-surface-2/20"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[14px] font-medium text-text-primary">{packet.title}</p>
              <ExecutionRiskBadge level={packet.riskLevel} />
            </div>
            <p className="mt-1 text-[12px] text-text-muted">
              {connector?.label ?? packet.connectorId} · {packet.updatedAt.slice(0, 10)}
            </p>
            <div className="mt-2">
              <ManualBridgeStatusBadge status={status} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
