"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActionFlowEmptyStateProps {
  title: string;
  description: string;
  className?: string;
}

export function ActionFlowEmptyState({ title, description, className }: ActionFlowEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border/60 bg-surface/30 px-5 py-6 text-center",
        className
      )}
    >
      <p className="text-[15px] font-semibold text-text-primary">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-text-muted">
        {description}
      </p>
      <Link
        href="/#mission-decision"
        className="gigi-btn-secondary gigi-focus mt-4 inline-flex rounded-lg px-4 py-2 text-[13px] font-medium"
      >
        Décider la mission
      </Link>
    </div>
  );
}
