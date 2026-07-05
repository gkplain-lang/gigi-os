"use client";

import { useState } from "react";
import { Archive, Check, Copy, FileText, GitBranch, ClipboardList } from "lucide-react";
import type { ExecutionReportIntake } from "@/modules/executionReportIntake";
import {
  applyProposedLogEntries,
  generateProposedReview,
  getCopyableIntakeText,
  getCopyableNormalizedReport,
  getCopyableParsedSummary,
  markLinkedHandoffReportReceived,
} from "@/modules/executionReportIntake";
import { cn } from "@/lib/utils";

interface ExecutionReportIntakeActionsProps {
  intake: ExecutionReportIntake;
  onIntakeChange: (next: ExecutionReportIntake) => void;
  onHandoffMarked?: () => void;
  onArchive?: () => void;
  className?: string;
}

export function ExecutionReportIntakeActions({
  intake,
  onIntakeChange,
  onHandoffMarked,
  onArchive,
  className,
}: ExecutionReportIntakeActionsProps) {
  const [copied, setCopied] = useState<"all" | "summary" | "normalized" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canApply =
    intake.proposedLogEntries.length > 0 &&
    !["applied_to_log", "review_generated", "archived"].includes(intake.status);
  const canReview = intake.status === "applied_to_log";
  const canMarkHandoff = Boolean(intake.sourceHandoffId) && intake.status !== "archived";

  const handleCopy = async (kind: "all" | "summary" | "normalized") => {
    const text =
      kind === "all"
        ? getCopyableIntakeText(intake.id)
        : kind === "summary"
          ? getCopyableParsedSummary(intake.id)
          : getCopyableNormalizedReport(intake.id);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleApplyLog = () => {
    setError(null);
    const result = applyProposedLogEntries(intake.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.intake) {
      onIntakeChange(result.intake);
      setMessage("Entrées appliquées au journal V2.1 — ajout uniquement, sans écrasement.");
    }
  };

  const handleGenerateReview = () => {
    setError(null);
    const result = generateProposedReview(intake.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.intake) {
      onIntakeChange(result.intake);
      setMessage("Review V2.2 générée localement — basée sur le log, sans vérif repo.");
    }
  };

  const handleMarkHandoff = () => {
    markLinkedHandoffReportReceived(intake.id);
    onHandoffMarked?.();
    setMessage("Handoff V2.9 marqué « rapport reçu » — action manuelle uniquement.");
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
          Copier analyse
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("summary")}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied === "summary" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <FileText className="h-3.5 w-3.5" />}
          Résumé parsé
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("normalized")}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied === "normalized" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <ClipboardList className="h-3.5 w-3.5" />}
          Rapport normalisé
        </button>
        {canApply && (
          <button
            type="button"
            onClick={handleApplyLog}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] ring-1 ring-sky-400/40"
          >
            <GitBranch className="h-3.5 w-3.5" />
            Appliquer au log V2.1
          </button>
        )}
        {canReview && (
          <button
            type="button"
            onClick={handleGenerateReview}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            Générer review V2.2
          </button>
        )}
        {canMarkHandoff && (
          <button
            type="button"
            onClick={handleMarkHandoff}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            <Check className="h-3.5 w-3.5" />
            Marquer handoff reçu
          </button>
        )}
        {onArchive && (
          <button
            type="button"
            onClick={onArchive}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] text-text-muted"
          >
            <Archive className="h-3.5 w-3.5" />
            Archiver
          </button>
        )}
      </div>
      {message && <p className="text-[11.5px] text-emerald-300/90">{message}</p>}
      {error && <p className="text-[11.5px] text-amber-200/90">{error}</p>}
      <p className="text-[11px] text-text-muted">
        Analyse déclarative uniquement — Gigi ne vérifie pas Git, GitHub, les fichiers ou le build.
      </p>
    </div>
  );
}
