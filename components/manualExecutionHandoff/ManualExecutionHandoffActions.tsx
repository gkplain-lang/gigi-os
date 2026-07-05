"use client";

import { useState } from "react";
import { Archive, Check, Copy, Send, Clock, FileText } from "lucide-react";
import type { ManualExecutionHandoff } from "@/modules/manualExecutionHandoff";
import {
  getCopyableCursorPrompt,
  getCopyableExpectedReport,
  getCopyableHandoffChecklist,
  getCopyableHandoffText,
  markHandoffCopied,
  markHandoffHandedOff,
  markHandoffReportReceived,
  markHandoffWaitingForReport,
} from "@/modules/manualExecutionHandoff";
import { cn } from "@/lib/utils";

interface ManualExecutionHandoffActionsProps {
  handoff: ManualExecutionHandoff;
  onHandoffChange: (next: ManualExecutionHandoff) => void;
  onArchive?: () => void;
  className?: string;
}

export function ManualExecutionHandoffActions({
  handoff,
  onHandoffChange,
  onArchive,
  className,
}: ManualExecutionHandoffActionsProps) {
  const [copied, setCopied] = useState<"all" | "cursor" | "checklist" | "report" | null>(null);

  const handleCopy = async (kind: "all" | "cursor" | "checklist" | "report") => {
    const text =
      kind === "all"
        ? getCopyableHandoffText(handoff.id)
        : kind === "cursor"
          ? getCopyableCursorPrompt(handoff.id)
          : kind === "checklist"
            ? getCopyableHandoffChecklist(handoff.id)
            : getCopyableExpectedReport(handoff.id);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      const next = markHandoffCopied(handoff.id);
      if (next) onHandoffChange(next);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleHandedOff = () => {
    const next = markHandoffHandedOff(handoff.id);
    if (next) onHandoffChange(next);
  };

  const handleWaiting = () => {
    const next = markHandoffWaitingForReport(handoff.id);
    if (next) onHandoffChange(next);
  };

  const handleReportReceived = () => {
    const next = markHandoffReportReceived(handoff.id);
    if (next) onHandoffChange(next);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleCopy("all")}
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
        >
          {copied === "all" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Copier handoff
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("cursor")}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied === "cursor" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          Prompt Cursor
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("checklist")}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied === "checklist" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          Checklist
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("report")}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied === "report" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <FileText className="h-3.5 w-3.5" />}
          Template rapport
        </button>
        <button
          type="button"
          onClick={handleHandedOff}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          <Send className="h-3.5 w-3.5" />
          Passé à l&apos;exécutant
        </button>
        <button
          type="button"
          onClick={handleWaiting}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          <Clock className="h-3.5 w-3.5" />
          Attente rapport
        </button>
        <button
          type="button"
          onClick={handleReportReceived}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          <Check className="h-3.5 w-3.5" />
          Rapport reçu
        </button>
        {onArchive && (
          <button
            type="button"
            onClick={onArchive}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] text-text-muted"
          >
            <Archive className="h-3 w-3" />
            Archiver
          </button>
        )}
      </div>
      <p className="text-[11px] text-text-muted">
        Copie manuelle uniquement — Gigi n&apos;envoie rien à Cursor ni à un service externe.
      </p>
    </div>
  );
}
