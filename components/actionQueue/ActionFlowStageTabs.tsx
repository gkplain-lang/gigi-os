"use client";

import type { ActionFlowStageItem } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface ActionFlowStageTabsProps {
  stageItems: ActionFlowStageItem[];
  activeStepId: string;
  className?: string;
}

const STEP_ORDER = [
  "decision",
  "validation",
  "preparation",
  "handoff",
  "report",
  "cycle",
] as const;

const STAGE_TO_STEP: Record<string, (typeof STEP_ORDER)[number]> = {
  decide: "decision",
  validate: "validation",
  prepare: "preparation",
  handoff: "handoff",
  report: "report",
  cycle: "cycle",
};

interface TabItem {
  id: (typeof STEP_ORDER)[number];
  label: string;
  count: number;
  isActive: boolean;
}

function toTabs(stageItems: ActionFlowStageItem[]): TabItem[] {
  return STEP_ORDER.map((stepId) => {
    const match = stageItems.find((s) => STAGE_TO_STEP[s.stage] === stepId);
    return {
      id: stepId,
      label: match?.label ?? stepId,
      count: match?.count ?? 0,
      isActive: match?.isActive ?? false,
    };
  });
}

export function ActionFlowStageTabs({
  stageItems,
  activeStepId,
  className,
}: ActionFlowStageTabsProps) {
  const tabs = toTabs(stageItems);
  const activeIndex = tabs.findIndex((t) => t.id === activeStepId);

  return (
    <nav aria-label="Étapes du flux d'action" className={cn("mt-5", className)}>
      <ol className="flex flex-wrap gap-2">
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeStepId || tab.isActive;
          const isDone = activeIndex >= 0 && idx < activeIndex;
          return (
            <li
              key={tab.id}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                isActive && "border-indigo-400/50 bg-indigo-500/20 text-indigo-100",
                isDone && !isActive && "border-emerald-500/30 text-emerald-200/80",
                !isActive && !isDone && "border-border/50 text-text-muted"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 opacity-70">({tab.count})</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
