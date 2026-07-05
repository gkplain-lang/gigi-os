"use client";

import type { SafeActionWorkspaceSection } from "@/modules/safeActionWorkspace";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<SafeActionWorkspaceSection["status"], string> = {
  available: "bg-emerald-400",
  partial: "bg-amber-400",
  missing: "bg-text-muted",
};

interface SafeActionWorkspaceTimelineProps {
  sections: SafeActionWorkspaceSection[];
  className?: string;
}

export function SafeActionWorkspaceTimeline({
  sections,
  className,
}: SafeActionWorkspaceTimelineProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {sections.map((section) => (
        <article
          key={section.id}
          className="rounded-lg border border-border bg-surface-2/20 px-3 py-2.5"
        >
          <div className="flex items-center gap-2">
            <span
              className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[section.status])}
              aria-hidden
            />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {section.title}
            </p>
          </div>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-[12.5px] leading-relaxed text-text-secondary">
            {section.content}
          </pre>
        </article>
      ))}
    </div>
  );
}
