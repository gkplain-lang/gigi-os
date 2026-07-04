"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Archive, BookOpen, Copy, Check } from "lucide-react";
import type { ExecutionLog } from "@/modules/executionLogs";
import type { ExecutionReview } from "@/modules/executionReviews";
import type { FollowUpActionProposal } from "@/modules/followUpActions";
import { getFollowUpProposalsForReview } from "@/modules/followUpActions";
import {
  createHistoryEntryFromFollowUp,
  createHistoryEntryFromReview,
  getCopyableEntryText,
  previewHistoryEntryFromFollowUp,
  previewHistoryEntryFromReview,
} from "@/modules/historyLearning";

interface HistoryLearningQuickActionsProps {
  review?: ExecutionReview;
  log?: ExecutionLog;
  followUp?: FollowUpActionProposal;
  className?: string;
}

export function HistoryLearningQuickActions({
  review,
  log,
  followUp,
  className,
}: HistoryLearningQuickActionsProps) {
  const [archived, setArchived] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleArchive = useCallback(() => {
    if (followUp) {
      createHistoryEntryFromFollowUp(followUp);
    } else if (review) {
      const followUps = getFollowUpProposalsForReview(review.id);
      createHistoryEntryFromReview(review, log, followUps);
    }
    setArchived(true);
  }, [review, log, followUp]);

  const handleCopy = useCallback(async () => {
    if (!review && !followUp) return;
    let text = "";
    if (followUp) {
      text = getCopyableEntryText(previewHistoryEntryFromFollowUp(followUp));
    } else if (review) {
      const followUps = getFollowUpProposalsForReview(review.id);
      text = getCopyableEntryText(previewHistoryEntryFromReview(review, log, followUps));
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  }, [review, log, followUp]);

  if (!review && !followUp) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      <button
        type="button"
        onClick={handleArchive}
        disabled={archived}
        className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] disabled:opacity-70"
      >
        <Archive className="h-3 w-3" />
        {archived ? "Archivé dans l'historique" : "Archiver dans l'historique"}
      </button>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px]"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        Copier synthèse
      </button>
      <Link
        href="/history"
        className="gigi-focus inline-flex items-center gap-1 text-[11.5px] text-accent-soft underline"
      >
        <BookOpen className="h-3 w-3" />
        Voir /history
      </Link>
    </div>
  );
}
