"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ListPlus, MessageCircle, ClipboardList, Archive } from "lucide-react";
import type { MissionPlanBridgeRecord } from "@/modules/missionPlanBridge";
import {
  MISSION_PLAN_BRIDGE_ID_PREFIX,
  generatePlanDraft,
  generatePreparedActionDraft,
  getCopyableBridgeText,
  markBridgeAddedToQueue,
  markBridgeConversationOpened,
} from "@/modules/missionPlanBridge";
import { loadActionQueueState } from "@/modules/actionQueue";
import { getConversationAskHref } from "@/modules/dailyUse/dailyUseHints";
import { useActionQueue } from "@/components/providers/ActionQueueProvider";
import { formatPreparedActionForCopy } from "@/modules/preparedActions";
import { cn } from "@/lib/utils";

interface MissionPlanBridgeActionsProps {
  bridge: MissionPlanBridgeRecord;
  projectName: string;
  onBridgeChange: (next: MissionPlanBridgeRecord) => void;
  onArchive?: () => void;
  className?: string;
}

export function MissionPlanBridgeActions({
  bridge,
  projectName,
  onBridgeChange,
  onArchive,
  className,
}: MissionPlanBridgeActionsProps) {
  const { addToQueue } = useActionQueue();
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [copiedAction, setCopiedAction] = useState(false);
  const [copiedBridge, setCopiedBridge] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [queued, setQueued] = useState(Boolean(bridge.queueItemId));

  const conversationHref = bridge.conversationPrompt
    ? getConversationAskHref(bridge.conversationPrompt)
    : undefined;

  const handleGeneratePlan = () => {
    const next = generatePlanDraft(bridge.id);
    if (next) onBridgeChange(next);
  };

  const handleGeneratePrepared = () => {
    const next = generatePreparedActionDraft(bridge.id);
    if (next) onBridgeChange(next);
  };

  const handleCopyPlan = async () => {
    if (!bridge.planDraft) return;
    const text = bridge.planDraft.steps.map((s) => `${s.order}. ${s.title}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPlan(true);
      window.setTimeout(() => setCopiedPlan(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleCopyPrepared = async () => {
    if (!bridge.preparedActionDraft) return;
    try {
      await navigator.clipboard.writeText(
        formatPreparedActionForCopy(bridge.preparedActionDraft)
      );
      setCopiedAction(true);
      window.setTimeout(() => setCopiedAction(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleCopyPrompt = async () => {
    if (!bridge.conversationPrompt) return;
    try {
      await navigator.clipboard.writeText(bridge.conversationPrompt);
      setCopiedPrompt(true);
      window.setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleCopyBridge = async () => {
    try {
      await navigator.clipboard.writeText(getCopyableBridgeText(bridge.id));
      setCopiedBridge(true);
      window.setTimeout(() => setCopiedBridge(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleAddToQueue = () => {
    if (!bridge.preparedActionDraft || !bridge.projectId || queued) return;
    const ok = addToQueue({
      preparedAction: bridge.preparedActionDraft,
      projectId: bridge.projectId,
      projectName,
      sourcePlanId: bridge.planDraft?.id,
      sourceActionId: `${MISSION_PLAN_BRIDGE_ID_PREFIX}${bridge.id}`,
    });
    if (ok) {
      const latestId = loadActionQueueState().actions[0]?.id;
      if (latestId) {
        const next = markBridgeAddedToQueue(bridge.id, latestId);
        if (next) onBridgeChange(next);
      }
      setQueued(true);
    }
  };

  const handleOpenConversation = () => {
    const next = markBridgeConversationOpened(bridge.id);
    if (next) onBridgeChange(next);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleGeneratePlan}
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
        >
          <ClipboardList className="h-3.5 w-3.5" />
          Générer le plan
        </button>
        <button
          type="button"
          onClick={handleGeneratePrepared}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          Préparer l&apos;action
        </button>
        {bridge.planDraft && (
          <button
            type="button"
            onClick={() => void handleCopyPlan()}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px]"
          >
            {copiedPlan ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            Copier le plan
          </button>
        )}
        {bridge.preparedActionDraft && (
          <button
            type="button"
            onClick={() => void handleCopyPrepared()}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px]"
          >
            {copiedAction ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            Copier l&apos;action
          </button>
        )}
        {bridge.conversationPrompt && (
          <button
            type="button"
            onClick={() => void handleCopyPrompt()}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px]"
          >
            {copiedPrompt ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            Copier le prompt
          </button>
        )}
        <button
          type="button"
          onClick={() => void handleCopyBridge()}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px]"
        >
          {copiedBridge ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          Copier le bridge
        </button>
        {bridge.preparedActionDraft && bridge.projectId && (
          <button
            type="button"
            onClick={handleAddToQueue}
            disabled={queued}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] disabled:opacity-70"
          >
            <ListPlus className="h-3.5 w-3.5" />
            {queued ? "Ajouté (pending_review)" : "Ajouter à la file"}
          </button>
        )}
        {conversationHref && (
          <Link
            href={conversationHref}
            onClick={handleOpenConversation}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Ouvrir conversation
          </Link>
        )}
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
        Ajout queue manuel · pending_review uniquement · aucune exécution automatique.
      </p>
    </div>
  );
}
