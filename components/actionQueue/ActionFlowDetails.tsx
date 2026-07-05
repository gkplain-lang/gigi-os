"use client";

import type { ReactNode } from "react";
import type { ActionFlowGroupedAction } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface ActionFlowDetailsProps {
  groupedActions: ActionFlowGroupedAction[];
  advancedSlot: ReactNode;
  className?: string;
}

export function ActionFlowDetails({
  groupedActions,
  advancedSlot,
  className,
}: ActionFlowDetailsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {groupedActions.length > 0 && (
        <details className="gigi-panel rounded-xl">
          <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-medium text-text-secondary [&::-webkit-details-marker]:hidden">
            File complète ({groupedActions.length} action
            {groupedActions.length > 1 ? "s" : ""})
          </summary>
          <ul className="border-t border-border/40 px-4 py-3 space-y-2">
            {groupedActions.map((item) => (
              <li key={item.actionId}>
                <a
                  href={`#action-${item.actionId}`}
                  className="block rounded-lg border border-border/40 px-3 py-2 transition hover:border-indigo-400/30 hover:bg-indigo-500/5"
                >
                  <p className="text-[13px] font-medium text-text-primary">{item.title}</p>
                  <p className="mt-0.5 text-[11px] text-text-muted">
                    {item.projectName} · {item.statusLabel} · {item.stageLabel}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}

      <details className="gigi-panel rounded-xl" id="advanced-details">
        <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-medium text-text-secondary [&::-webkit-details-marker]:hidden">
          Modules avancés — plans, espace sécurisé, passation, rapport, cycle
        </summary>
        <div className="border-t border-border/40 px-4 py-4 space-y-3">{advancedSlot}</div>
      </details>
    </div>
  );
}
