"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, ListPlus, RefreshCw, Sparkles, X } from "lucide-react";
import type { ExecutionReview } from "@/modules/executionReviews";
import type { FollowUpActionProposal } from "@/modules/followUpActions";
import {
  FOLLOW_UP_DISCLAIMER,
  FOLLOW_UP_STATUS_LABELS,
  FOLLOW_UP_TYPE_LABELS,
  createFollowUpProposalsFromReview,
  formatAllFollowUpProposalsForCopy,
  formatFollowUpProposalForCopy,
  getFollowUpProposalsForReview,
  proposalToPreparedAction,
  regenerateFollowUpProposals,
  updateFollowUpProposalStatus,
} from "@/modules/followUpActions";
import { useActionQueue } from "@/components/providers/ActionQueueProvider";
import { cn } from "@/lib/utils";

const RISK_STYLE: Record<FollowUpActionProposal["riskLevel"], string> = {
  low: "text-emerald-300/90",
  medium: "text-amber-200/90",
  high: "text-red-300/80",
};

interface FollowUpActionPanelProps {
  review: ExecutionReview;
  className?: string;
}

export function FollowUpActionPanel({ review, className }: FollowUpActionPanelProps) {
  const { addToQueue } = useActionQueue();
  const [proposals, setProposals] = useState<FollowUpActionProposal[]>(() =>
    getFollowUpProposalsForReview(review.id)
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const isStale = useMemo(
    () =>
      proposals.length > 0 &&
      proposals[0]?.metadata?.reviewDecision !== review.decision,
    [proposals, review.decision]
  );

  const refreshFromStore = useCallback(
    (next: FollowUpActionProposal[]) => {
      setProposals(next);
    },
    []
  );

  const handleGenerate = useCallback(() => {
    refreshFromStore(createFollowUpProposalsFromReview(review));
  }, [review, refreshFromStore]);

  const handleRegenerate = useCallback(() => {
    refreshFromStore(regenerateFollowUpProposals(review));
  }, [review, refreshFromStore]);

  const handleSelect = useCallback(
    (id: string) => {
      const updated = updateFollowUpProposalStatus(id, "selected");
      if (updated) {
        setProposals((prev) => prev.map((p) => (p.id === id ? updated : p)));
      }
    },
    []
  );

  const handleDismiss = useCallback((id: string) => {
    const updated = updateFollowUpProposalStatus(id, "dismissed");
    if (updated) {
      setProposals((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  }, []);

  const handleAddToQueue = useCallback(
    (proposal: FollowUpActionProposal) => {
      const projectId = proposal.metadata?.projectId ?? review.metadata?.projectId ?? "gigi-os";
      const projectName = proposal.metadata?.projectName ?? review.metadata?.projectName ?? projectId;
      const prepared = proposalToPreparedAction(proposal);
      const ok = addToQueue({
        preparedAction: prepared,
        projectId,
        projectName,
        sourceActionId: proposal.sourceActionId,
      });
      if (ok) {
        const updated = updateFollowUpProposalStatus(proposal.id, "added_to_queue");
        if (updated) {
          setProposals((prev) => prev.map((p) => (p.id === proposal.id ? updated : p)));
        }
      }
    },
    [addToQueue, review.metadata]
  );

  const handleCopyOne = useCallback(async (proposal: FollowUpActionProposal) => {
    try {
      await navigator.clipboard.writeText(formatFollowUpProposalForCopy(proposal));
      setCopiedId(proposal.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* fallback */
    }
  }, []);

  const handleCopyAll = useCallback(async () => {
    const active = proposals.filter((p) => p.status !== "dismissed");
    if (!active.length) return;
    try {
      await navigator.clipboard.writeText(formatAllFollowUpProposalsForCopy(active));
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      /* fallback */
    }
  }, [proposals]);

  const visible = proposals.filter((p) => p.status !== "dismissed");

  return (
    <section
      className={cn(
        "mt-4 rounded-xl border border-[rgba(124,140,255,0.2)] bg-[rgba(124,140,255,0.03)]",
        className
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent-soft" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Actions de suivi · V2.3
          </p>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-amber-200/90">{FOLLOW_UP_DISCLAIMER}</p>
      </div>

      <div className="space-y-4 px-4 py-4">
        {proposals.length === 0 ? (
          <button
            type="button"
            onClick={handleGenerate}
            className="gigi-btn-primary gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Générer les actions de suivi
          </button>
        ) : (
          <>
            {isStale && (
              <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-[12px] text-amber-200/90">
                La review a changé — régénère les propositions pour les aligner.
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleRegenerate}
                className="gigi-btn gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Régénérer
              </button>
              {visible.length > 0 && (
                <button
                  type="button"
                  onClick={() => void handleCopyAll()}
                  className="gigi-btn gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px]"
                >
                  {copiedAll ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Tout copié
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copier toutes
                    </>
                  )}
                </button>
              )}
            </div>

            <ul className="space-y-3">
              {visible.map((proposal) => (
                <li
                  key={proposal.id}
                  className={cn(
                    "rounded-lg border bg-surface-2/30 px-3 py-3",
                    proposal.status === "selected" && "border-accent/40",
                    proposal.status === "added_to_queue" && "border-emerald-500/30"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
                      {FOLLOW_UP_TYPE_LABELS[proposal.type]}
                    </span>
                    <span className={cn("text-[10px] font-medium uppercase", RISK_STYLE[proposal.riskLevel])}>
                      Risque {proposal.riskLevel}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {FOLLOW_UP_STATUS_LABELS[proposal.status]}
                    </span>
                  </div>
                  <h4 className="mt-2 text-[14px] font-medium text-text-primary">{proposal.title}</h4>
                  <p className="mt-1 text-[13px] text-text-secondary">{proposal.objective}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-text-muted">
                    {proposal.rationale}
                  </p>
                  {proposal.suggestedSteps.length > 0 && (
                    <ol className="mt-2 space-y-1 pl-4 text-[12px] text-text-secondary">
                      {proposal.suggestedSteps.map((step, i) => (
                        <li key={i} className="list-decimal">
                          {step}
                        </li>
                      ))}
                    </ol>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelect(proposal.id)}
                      className="gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]"
                    >
                      Retenir
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopyOne(proposal)}
                      className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px]"
                    >
                      {copiedId === proposal.id ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      Copier
                    </button>
                    {proposal.status !== "added_to_queue" && (
                      <button
                        type="button"
                        onClick={() => handleAddToQueue(proposal)}
                        className="gigi-btn-primary gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-medium"
                      >
                        <ListPlus className="h-3 w-3" />
                        Ajouter à valider
                      </button>
                    )}
                    {proposal.status === "added_to_queue" && (
                      <Link
                        href="/actions"
                        className="gigi-focus text-[11.5px] text-emerald-400/90 underline"
                      >
                        Voir la file
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDismiss(proposal.id)}
                      className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] text-text-muted"
                    >
                      <X className="h-3 w-3" />
                      Ignorer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
