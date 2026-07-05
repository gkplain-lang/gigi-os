"use client";

import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionFlowSafetyNoteProps {
  note: string;
  className?: string;
}

export function ActionFlowSafetyNote({ note, className }: ActionFlowSafetyNoteProps) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-[12.5px] leading-relaxed text-text-secondary",
        className
      )}
    >
      <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300/80" aria-hidden />
      {note}
    </p>
  );
}
