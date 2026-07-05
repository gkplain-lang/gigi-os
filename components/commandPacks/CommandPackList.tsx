"use client";

import type { CommandPack } from "@/modules/executionReadiness";
import {
  getEffectiveCommandPackStatus,
  getSandboxConnectorById,
} from "@/modules/executionReadiness";
import { CommandPackStatusBadge } from "./CommandPackStatusBadge";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { cn } from "@/lib/utils";

import { ExecutionRouteEmptyHint } from "@/components/executionExperience/ExecutionRouteEmptyHint";

interface CommandPackListProps {
  packs: CommandPack[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

export function CommandPackList({
  packs,
  selectedId,
  onSelect,
  className,
}: CommandPackListProps) {
  if (packs.length === 0) {
    return (
      <ExecutionRouteEmptyHint
        message="Rien ici pour l'instant. Essaie de préparer une action depuis /actions, puis transforme-la en pack de commandes."
        nextSteps={[
          { label: "Ouvrir Actions", href: "/actions" },
          { label: "Pont manuel", href: "/manual-bridge" },
          { label: "Modèles sandbox (ci-dessus)", href: "/command-packs" },
        ]}
      />
    );
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {packs.map((pack) => {
        const status = getEffectiveCommandPackStatus(pack);
        const connector = getSandboxConnectorById(pack.connectorId);
        const isSelected = pack.id === selectedId;
        return (
          <li key={pack.id}>
            <button
              type="button"
              onClick={() => onSelect(pack.id)}
              className={cn(
                "gigi-focus w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                isSelected
                  ? "border-indigo-500/50 bg-indigo-500/10"
                  : "border-border/40 bg-surface-2/10 hover:border-border/60"
              )}
            >
              <p className="text-[13px] font-medium text-text-primary">{pack.title}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <ExecutionRiskBadge level={pack.riskLevel} />
                <CommandPackStatusBadge status={status} />
                <span className="text-[11px] text-text-muted">
                  {connector?.label ?? pack.connectorId}
                </span>
                <span className="text-[11px] text-text-muted">
                  {new Date(pack.updatedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
