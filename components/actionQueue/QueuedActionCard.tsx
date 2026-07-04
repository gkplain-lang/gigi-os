"use client";

import { useCallback, useState } from "react";
import { Check, ChevronDown, Copy, RotateCcw, X } from "lucide-react";
import type { QueuedAction } from "@/modules/actionQueue";
import { QUEUED_STATUS_LABELS, VALIDATION_CENTER_NOTE } from "@/modules/actionQueue";
import { PREPARED_ACTION_TYPE_LABELS } from "@/modules/preparedActions";
import { formatPreparedActionForCopy } from "@/modules/preparedActions";
import { PreparedActionPanel } from "@/components/preparedActions/PreparedActionPanel";
import { useActionQueue } from "@/components/providers/ActionQueueProvider";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<QueuedAction["status"], string> = {
  pending_review: "border-amber-500/35 bg-amber-500/10 text-amber-200/90",
  approved: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300/90",
  rejected: "border-red-500/30 bg-red-500/10 text-red-300/80",
  needs_revision: "border-sky-500/30 bg-sky-500/10 text-sky-200/90",
  copied: "border-[rgba(124,140,255,0.35)] bg-[rgba(124,140,255,0.1)] text-accent-soft",
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

interface QueuedActionCardProps {
  action: QueuedAction;
}

export function QueuedActionCard({ action }: QueuedActionCardProps) {
  const { setStatus } = useActionQueue();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatPreparedActionForCopy(action.preparedAction));
      setCopied(true);
      setStatus(action.id, "copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* text selectable in expanded panel */
    }
  }, [action, setStatus]);

  return (
    <article className="gigi-project-card rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
              {PREPARED_ACTION_TYPE_LABELS[action.preparedAction.type]}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                STATUS_STYLE[action.status]
              )}
            >
              {QUEUED_STATUS_LABELS[action.status]}
            </span>
            <span className="text-[11px] text-text-muted">{action.projectName}</span>
          </div>
          <h3 className="mt-2 text-[15px] font-semibold text-text-primary">
            {action.preparedAction.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
            {action.preparedAction.summary}
          </p>
          <p className="mt-2 text-[11px] text-text-muted">Ajouté {formatDate(action.createdAt)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {expanded ? "Masquer" : "Ouvrir"}
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
        </button>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          Copier
        </button>
        {action.status === "pending_review" && (
          <>
            <button
              type="button"
              onClick={() => setStatus(action.id, "approved")}
              className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
            >
              Valider
            </button>
            <button
              type="button"
              onClick={() => setStatus(action.id, "rejected")}
              className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] text-red-300/90"
            >
              <X className="h-3.5 w-3.5" />
              Rejeter
            </button>
            <button
              type="button"
              onClick={() => setStatus(action.id, "needs_revision")}
              className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              À retravailler
            </button>
          </>
        )}
        {(action.status === "approved" ||
          action.status === "rejected" ||
          action.status === "needs_revision") && (
          <button
            type="button"
            onClick={() => setStatus(action.id, "pending_review")}
            className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            Remettre à valider
          </button>
        )}
      </div>

      <p className="mt-2 text-[11px] text-text-muted">{VALIDATION_CENTER_NOTE}</p>

      {expanded && (
        <div className="mt-4">
          <PreparedActionPanel action={action.preparedAction} />
        </div>
      )}
    </article>
  );
}
