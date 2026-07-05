"use client";

import type { ManualExecutionHandoff } from "@/modules/manualExecutionHandoff";
import { cn } from "@/lib/utils";

interface ManualExecutionHandoffPreviewProps {
  handoff: ManualExecutionHandoff;
  className?: string;
}

export function ManualExecutionHandoffPreview({
  handoff,
  className,
}: ManualExecutionHandoffPreviewProps) {
  return (
    <div className={cn("max-h-80 overflow-y-auto rounded-lg border border-border bg-surface px-3 py-2", className)}>
      {handoff.sections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div key={section.id} className="mb-3 last:mb-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {section.title}
            </p>
            <pre className="mt-1 whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-text-secondary">
              {section.content}
            </pre>
          </div>
        ))}
    </div>
  );
}
