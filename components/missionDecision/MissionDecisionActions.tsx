"use client";

import Link from "next/link";
import { Check, Copy, MessageCircle, ClipboardList, X, Clock, HelpCircle } from "lucide-react";
import type { MissionDecision, MissionDecisionCandidate } from "@/modules/missionDecision";
import { getProjectPlanHref, getMissionPlanAskHref } from "@/modules/actionPlans";
import { getConversationAskHref } from "@/modules/dailyUse/dailyUseHints";
import { cn } from "@/lib/utils";

interface MissionDecisionActionsProps {
  decision: MissionDecision;
  selectedCandidate?: MissionDecisionCandidate;
  onAccept: () => void;
  onReject: () => void;
  onPostpone: () => void;
  onClarify: () => void;
  onCopy: () => void;
  onConvertedToPlan?: () => void;
  copied?: boolean;
  className?: string;
}

export function MissionDecisionActions({
  decision,
  selectedCandidate,
  onAccept,
  onReject,
  onPostpone,
  onClarify,
  onCopy,
  onConvertedToPlan,
  copied = false,
  className,
}: MissionDecisionActionsProps) {
  const candidate =
    selectedCandidate ??
    decision.candidates.find((c) => c.id === decision.selectedCandidateId) ??
    decision.candidates[0];

  const projectId = candidate?.projectId;
  const missionId = candidate?.missionId;
  const projectName = candidate?.metadata?.projectName ?? projectId ?? "projet";
  const planHref = projectId
    ? getProjectPlanHref(projectId, missionId)
    : undefined;
  const askHref = candidate
    ? getConversationAskHref(
        `Gigi, est-ce que je devrais choisir « ${candidate.title} » pour ${projectName} aujourd'hui ?`
      )
    : undefined;
  const planAskHref = candidate && projectId
    ? getMissionPlanAskHref(projectName, candidate.title)
    : undefined;

  const decided = ["accepted", "rejected", "postponed", "converted_to_plan"].includes(
    decision.status
  );

  return (
    <div className={cn("space-y-3", className)}>
      {!decided && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAccept}
            disabled={!candidate}
            className="gigi-btn-primary gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] font-medium disabled:opacity-40"
          >
            <Check className="h-3.5 w-3.5" />
            Accepter
          </button>
          <button
            type="button"
            onClick={onReject}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            <X className="h-3.5 w-3.5" />
            Refuser
          </button>
          <button
            type="button"
            onClick={onPostpone}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            <Clock className="h-3.5 w-3.5" />
            Reporter
          </button>
          <button
            type="button"
            onClick={onClarify}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            À clarifier
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={onCopy}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px]"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          Copier
        </button>
        {planHref && (
          <Link
            href={planHref}
            onClick={onConvertedToPlan}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px]"
          >
            <ClipboardList className="h-3 w-3" />
            Transformer en plan
          </Link>
        )}
        {planAskHref && (
          <Link
            href={planAskHref}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px]"
          >
            <MessageCircle className="h-3 w-3" />
            Préparer via conversation
          </Link>
        )}
        {askHref && (
          <Link
            href={askHref}
            className="gigi-focus text-[11.5px] text-accent-soft underline"
          >
            Demander à Gigi
          </Link>
        )}
      </div>
      <p className="text-[11px] text-text-muted">
        Aucune action approuvée ni exécutée automatiquement — liens de préparation uniquement.
      </p>
    </div>
  );
}
