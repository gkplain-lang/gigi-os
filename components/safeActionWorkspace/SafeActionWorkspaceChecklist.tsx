"use client";

import type { SafeActionWorkspaceChecklistItem } from "@/modules/safeActionWorkspace";
import { cn } from "@/lib/utils";

interface SafeActionWorkspaceChecklistProps {
  items: SafeActionWorkspaceChecklistItem[];
  onToggle: (itemId: string, completed: boolean) => void;
  className?: string;
}

export function SafeActionWorkspaceChecklist({
  items,
  onToggle,
  className,
}: SafeActionWorkspaceChecklistProps) {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <label className="flex cursor-pointer items-start gap-2 text-[13px] text-text-secondary">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) => onToggle(item.id, e.target.checked)}
              className="gigi-focus mt-0.5 rounded border-border"
            />
            <span className={cn(item.completed && "text-text-muted line-through")}>
              {item.label}
              {item.required && (
                <span className="ml-1 text-[10px] uppercase text-accent-soft">requis</span>
              )}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
