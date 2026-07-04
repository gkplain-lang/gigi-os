"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import type { ExecutionLog } from "@/modules/executionLogs";
import type { ExecutionPlan } from "@/modules/executionPlans";
import type { ExecutionReview } from "@/modules/executionReviews";
import {
  EXECUTION_REVIEW_DECISION_LABELS,
  EXECUTION_REVIEW_DISCLAIMER,
  createReviewFromLog,
  formatExecutionReviewForCopy,
  getLatestReviewForLog,
  regenerateReview,
} from "@/modules/executionReviews";
import { cn } from "@/lib/utils";
import { FollowUpActionPanel } from "@/components/followUpActions/FollowUpActionPanel";

const DECISION_STYLE: Record<ExecutionReview["decision"], string> = {
  completed_confirmed: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300/90",
  needs_fix: "border-red-500/30 bg-red-500/10 text-red-300/80",
  needs_retry: "border-amber-500/35 bg-amber-500/10 text-amber-200/90",
  needs_new_action: "border-sky-500/35 bg-sky-500/10 text-sky-200/90",
  abandoned_confirmed: "border-border bg-surface-2/40 text-text-muted",
  unclear: "border-amber-500/25 bg-amber-500/5 text-amber-200/80",
};

const SEVERITY_STYLE: Record<string, string> = {
  info: "text-text-secondary",
  warning: "text-amber-200/90",
  critical: "text-red-300/80",
  success: "text-emerald-300/90",
};

interface ExecutionReviewPanelProps {
  log: ExecutionLog;
  plan?: ExecutionPlan;
  prominent?: boolean;
  className?: string;
}

export function ExecutionReviewPanel({
  log,
  plan,
  prominent = false,
  className,
}: ExecutionReviewPanelProps) {
  const [review, setReview] = useState<ExecutionReview | null>(
    () => getLatestReviewForLog(log.id) ?? null
  );
  const [copied, setCopied] = useState(false);

  const isEmpty = log.status === "not_started" && log.entries.length === 0;
  const showProminent =
    prominent ||
    log.status === "completed_manually" ||
    log.status === "blocked" ||
    log.status === "needs_fix" ||
    log.status === "abandoned";

  const logSignature = useMemo(
    () => `${log.updatedAt}-${log.entries.length}-${log.status}`,
    [log.updatedAt, log.entries.length, log.status]
  );

  const isStale = review && review.sourceLogEntryCount !== log.entries.length;

  const handleGenerate = useCallback(() => {
    const next = createReviewFromLog(log, plan);
    setReview(next);
  }, [log, plan]);

  const handleRegenerate = useCallback(() => {
    const next = regenerateReview(log, plan);
    setReview(next);
  }, [log, plan]);

  const handleCopy = useCallback(async () => {
    if (!review) return;
    try {
      await navigator.clipboard.writeText(formatExecutionReviewForCopy(review));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  }, [review]);

  if (isEmpty) {
    return (
      <section
        className={cn(
          "rounded-xl border border-dashed border-border bg-surface-2/20 px-4 py-4",
          className
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Review d&apos;exécution
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          Commence le suivi manuel pour générer une review locale.
        </p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-xl border",
        showProminent
          ? "border-[rgba(124,140,255,0.35)] bg-[rgba(124,140,255,0.06)]"
          : "border-border bg-surface-2/20",
        className
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent-soft" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Review d&apos;exécution · V2.2
          </p>
          {review && (
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                DECISION_STYLE[review.decision]
              )}
            >
              {EXECUTION_REVIEW_DECISION_LABELS[review.decision]}
            </span>
          )}
          {review && (
            <span className="ml-auto text-[11px] tabular-nums text-text-muted">
              Confiance {review.confidence}%
            </span>
          )}
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-amber-200/90">
          {EXECUTION_REVIEW_DISCLAIMER}
        </p>
      </div>

      <div className="space-y-4 px-4 py-4">
        {!review ? (
          <button
            type="button"
            onClick={handleGenerate}
            className="gigi-btn-primary gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Générer la review
          </button>
        ) : (
          <>
            {isStale && (
              <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-[12px] text-amber-200/90">
                Le journal a changé depuis la dernière review — régénère pour mettre à jour.
              </p>
            )}

            <p className="text-[13.5px] leading-relaxed text-text-secondary">{review.summary}</p>

            {review.findings.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Constats
                </p>
                <ul className="mt-2 space-y-2">
                  {review.findings.map((f) => (
                    <li
                      key={f.id}
                      className="rounded-lg border border-border bg-surface-2/30 px-3 py-2.5 text-[13px]"
                    >
                      <span className={cn("font-medium", SEVERITY_STYLE[f.severity])}>
                        {f.title}
                      </span>
                      <span className="mt-0.5 block text-text-muted">{f.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.validationChecklist.length > 0 && (
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
                  Checklist de validation
                </p>
                <ul className="mt-2 space-y-1.5">
                  {review.validationChecklist.map((v) => (
                    <li key={v.id} className="flex gap-2 text-[13px] text-text-secondary">
                      <span>{v.required ? "☐" : "○"}</span>
                      {v.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.recommendedNextActions.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Prochaines actions recommandées
                </p>
                <ul className="mt-2 space-y-2">
                  {review.recommendedNextActions.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-lg border border-border bg-surface-2/30 px-3 py-2.5 text-[13px]"
                    >
                      <span className="font-medium text-text-primary">{a.label}</span>
                      <span className="mt-0.5 block text-text-muted">{a.description}</span>
                      {a.nextStepHint && (
                        <span className="mt-1 block text-[11.5px] text-accent-soft/90">
                          → {a.nextStepHint}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={handleRegenerate}
                className="gigi-btn gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px]"
                title={`Journal: ${logSignature}`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Régénérer
              </button>
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="gigi-btn gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Review copiée
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copier la review
                  </>
                )}
              </button>
            </div>

            {review && <FollowUpActionPanel review={review} />}
          </>
        )}
      </div>
    </section>
  );
}
