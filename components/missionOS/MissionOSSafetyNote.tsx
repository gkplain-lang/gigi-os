"use client";

import type { MissionOSViewModel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionOSSafetyNoteProps {
  note?: string;
  className?: string;
}

export function MissionOSSafetyNote({ note, className }: MissionOSSafetyNoteProps) {
  return (
    <p
      className={cn(
        "rounded-lg border border-sky-500/20 bg-sky-500/5 px-3 py-2.5 text-[12px] leading-relaxed text-text-muted",
        className
      )}
    >
      <span className="font-medium text-sky-200/90">Sécurité · </span>
      {note}
    </p>
  );
}

interface MissionOSSafetyNoteFromVMProps {
  viewModel: MissionOSViewModel;
  className?: string;
}

export function MissionOSSafetyNoteFromVM({ viewModel, className }: MissionOSSafetyNoteFromVMProps) {
  return <MissionOSSafetyNote note={viewModel.safetyNote} className={className} />;
}
