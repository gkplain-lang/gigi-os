"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { PreparedAction } from "@/modules/preparedActions";
import { PREPARED_ACTION_TYPE_LABELS } from "@/modules/preparedActions";
import { formatPreparedActionForCopy } from "@/modules/preparedActions";
import { AddToQueueButton } from "@/components/preparedActions/AddToQueueButton";
import { cn } from "@/lib/utils";

interface PreparedActionPanelProps {
  action: PreparedAction;
  projectName?: string;
  sourcePlanId?: string;
  sourceActionId?: string;
  showQueueButton?: boolean;
  className?: string;
}

export function PreparedActionPanel({
  action,
  projectName,
  sourcePlanId,
  sourceActionId,
  showQueueButton = true,
  className,
}: PreparedActionPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = formatPreparedActionForCopy(action);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: text is selectable in the pre block */
    }
  }, [action]);

  return (
    <section className={cn("gigi-command-card overflow-hidden border-[rgba(124,140,255,0.25)]", className)}>
      <div className="border-b border-border px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
            {PREPARED_ACTION_TYPE_LABELS[action.type]}
          </span>
          <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200/90">
            Dry-run · prêt à valider
          </span>
        </div>
        <h3 className="mt-2 text-[16px] font-semibold text-text-primary">{action.title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{action.summary}</p>
        {action.target && (
          <p className="mt-1.5 text-[12px] text-text-muted">
            Objectif : <span className="text-text-secondary">{action.target}</span>
          </p>
        )}
      </div>

      <div className="space-y-4 px-4 py-4 md:px-5">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Contenu prêt à coller
            </p>
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="gigi-btn gigi-focus inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  {action.copyLabel}
                </>
              )}
            </button>
          </div>
          <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-surface-2/60 p-3 text-[12px] leading-relaxed whitespace-pre-wrap text-text-secondary select-all">
            {action.body}
          </pre>
        </div>

        {action.relatedFiles && action.relatedFiles.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Fichiers probables
            </p>
            <ul className="mt-2 space-y-1">
              {action.relatedFiles.map((f) => (
                <li key={f} className="font-mono text-[12px] text-text-secondary">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {action.commands && action.commands.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Commandes suggérées (manuelles)
            </p>
            <ul className="mt-2 space-y-1">
              {action.commands.map((c) => (
                <li key={c} className="font-mono text-[11.5px] text-text-muted">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {action.safetyNotes.length > 0 && (
          <div className="rounded-lg border border-border bg-surface-2/30 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Garde-fous</p>
            <ul className="mt-2 space-y-1">
              {action.safetyNotes.map((note) => (
                <li key={note} className="flex gap-2 text-[12.5px] text-text-secondary">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/70" aria-hidden />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
            Validation requise
          </p>
          <ul className="mt-2 space-y-1">
            {action.validationRequired.map((v) => (
              <li key={v} className="flex gap-2 text-[12.5px] text-text-secondary">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/70" aria-hidden />
                {v}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11.5px] text-text-muted">
            Gigi n&apos;exécute rien — copie, valide, puis agis toi-même.
          </p>
        </div>

        {showQueueButton && projectName && (
          <AddToQueueButton
            preparedAction={action}
            projectId={action.projectId}
            projectName={projectName}
            sourcePlanId={sourcePlanId}
            sourceActionId={sourceActionId}
          />
        )}
      </div>
    </section>
  );
}
