"use client";

import { useCallback, useMemo, useState } from "react";
import type { ExecutionPlan } from "@/modules/executionPlans";
import { markPlanCompletedManually } from "@/modules/executionPlans";
import type { ExecutionLog } from "@/modules/executionLogs";
import {
  EXECUTION_LOG_ENTRY_LABELS,
  EXECUTION_LOG_MANUAL_DISCLAIMER,
  EXECUTION_LOG_STATUS_LABELS,
  addLogNote,
  formatExecutionLogForCopy,
  getOrCreateExecutionLog,
  markFixNeeded,
  markLogAbandoned,
  markLogBlocked,
  markLogCompletedManually,
  markLogStarted,
  markManualCommit,
  markStepCompleted,
  markTestFailed,
  markTestPassed,
  summarizeExecutionLog,
} from "@/modules/executionLogs";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

const STATUS_STYLE: Record<ExecutionLog["status"], string> = {
  not_started: "border-border bg-surface-2/40 text-text-muted",
  started: "border-sky-500/35 bg-sky-500/10 text-sky-200/90",
  blocked: "border-red-500/30 bg-red-500/10 text-red-300/80",
  needs_fix: "border-amber-500/35 bg-amber-500/10 text-amber-200/90",
  completed_manually: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300/90",
  abandoned: "border-border bg-surface-2/40 text-text-muted",
};

const ENTRY_STYLE: Record<string, string> = {
  started: "text-sky-200/90",
  step_completed: "text-emerald-300/90",
  test_passed: "text-emerald-300/90",
  test_failed: "text-red-300/80",
  blocked: "text-red-300/80",
  note: "text-text-secondary",
  fix_needed: "text-amber-200/90",
  manual_commit: "text-accent-soft",
  completed_manually: "text-emerald-300/90",
  abandoned: "text-text-muted",
};

function formatTime(iso: string): string {
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

interface ExecutionLogPanelProps {
  plan: ExecutionPlan;
  initialLog?: ExecutionLog;
  onLogChange?: (log: ExecutionLog) => void;
  onPlanCompleted?: (planId: string) => void;
  className?: string;
}

export function ExecutionLogPanel({
  plan,
  initialLog,
  onLogChange,
  onPlanCompleted,
  className,
}: ExecutionLogPanelProps) {
  const [log, setLog] = useState<ExecutionLog>(() =>
    initialLog ?? getOrCreateExecutionLog(plan)
  );
  const [noteText, setNoteText] = useState("");
  const [finalReport, setFinalReport] = useState(log.finalReport ?? "");
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => summarizeExecutionLog(log, plan), [log, plan]);
  const isTerminal = log.status === "completed_manually" || log.status === "abandoned";

  const updateLog = useCallback(
    (next: ExecutionLog) => {
      setLog(next);
      onLogChange?.(next);
    },
    [onLogChange]
  );

  const handleAddNote = useCallback(() => {
    const next = addLogNote(log, noteText);
    updateLog(next);
    setNoteText("");
  }, [log, noteText, updateLog]);

  const handleComplete = useCallback(() => {
    const next = markLogCompletedManually(log, finalReport || undefined);
    updateLog(next);
    markPlanCompletedManually(plan.id);
    onPlanCompleted?.(plan.id);
  }, [log, finalReport, plan.id, updateLog, onPlanCompleted]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatExecutionLogForCopy(log));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  }, [log]);

  return (
    <section
      className={cn(
        "rounded-xl border border-[rgba(124,140,255,0.2)] bg-[rgba(124,140,255,0.03)]",
        className
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Suivi manuel
          </p>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              STATUS_STYLE[log.status]
            )}
          >
            {EXECUTION_LOG_STATUS_LABELS[log.status]}
          </span>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-amber-200/90">
          {EXECUTION_LOG_MANUAL_DISCLAIMER}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{summary.summaryText}</p>
      </div>

      <div className="space-y-4 px-4 py-4">
        {!isTerminal && (
          <div className="flex flex-wrap gap-2">
            {log.status === "not_started" && (
              <button
                type="button"
                onClick={() => updateLog(markLogStarted(log))}
                className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
              >
                Marquer comme commencé
              </button>
            )}
            <button
              type="button"
              onClick={() => updateLog(markTestPassed(log, "build", "Build OK"))}
              className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
            >
              Build OK
            </button>
            <button
              type="button"
              onClick={() => updateLog(markTestFailed(log, "build", "Build", "Échec déclaré manuellement"))}
              className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] text-red-300/90"
            >
              Build échoué
            </button>
            <button
              type="button"
              onClick={() => updateLog(markTestPassed(log, "ui", "UI vérifiée"))}
              className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
            >
              UI vérifiée
            </button>
            <button
              type="button"
              onClick={() => updateLog(markManualCommit(log))}
              className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
            >
              Commit manuel
            </button>
            <button
              type="button"
              onClick={() => updateLog(markLogBlocked(log))}
              className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
            >
              Signaler blocage
            </button>
            <button
              type="button"
              onClick={() => updateLog(markFixNeeded(log))}
              className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
            >
              Correction nécessaire
            </button>
          </div>
        )}

        {plan.steps.length > 0 && !isTerminal && log.status !== "not_started" && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Marquer une étape faite
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {plan.steps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => updateLog(markStepCompleted(log, step.id, step.title))}
                  className="gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]"
                >
                  {step.order}. {step.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {plan.tests.length > 0 && !isTerminal && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Tests du plan
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {plan.tests.map((test) => (
                <span key={test.id} className="inline-flex gap-1">
                  <button
                    type="button"
                    onClick={() => updateLog(markTestPassed(log, test.id, test.label))}
                    className="gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]"
                  >
                    OK · {test.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateLog(markTestFailed(log, test.id, test.label))}
                    className="gigi-btn gigi-focus rounded-lg px-2 py-1 text-[11px] text-red-300/90"
                  >
                    KO
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {!isTerminal && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Note</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ex. Cursor a modifié 3 fichiers, diff relu"
                className="gigi-focus min-w-[200px] flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted/60"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && noteText.trim()) handleAddNote();
                }}
              />
              <button
                type="button"
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] disabled:opacity-40"
              >
                Ajouter une note
              </button>
            </div>
          </div>
        )}

        {!isTerminal && (
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/80">
              Terminer manuellement
            </p>
            <textarea
              value={finalReport}
              onChange={(e) => setFinalReport(e.target.value)}
              placeholder="Rapport final optionnel — ce qui a été fait, fichiers modifiés, tests..."
              rows={3}
              className="gigi-focus mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted/60"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleComplete}
                className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
              >
                Terminé manuellement
              </button>
              <button
                type="button"
                onClick={() => updateLog(markLogAbandoned(log))}
                className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] text-text-muted"
              >
                Abandonner
              </button>
            </div>
          </div>
        )}

        {log.entries.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Timeline
            </p>
            <ul className="mt-3 space-y-2">
              {log.entries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-lg border border-border bg-surface-2/30 px-3 py-2.5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wide",
                        ENTRY_STYLE[entry.type] ?? "text-text-muted"
                      )}
                    >
                      {EXECUTION_LOG_ENTRY_LABELS[entry.type]}
                    </span>
                    <span className="text-[11px] text-text-muted">{formatTime(entry.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-[13px] font-medium text-text-primary">{entry.title}</p>
                  {entry.description && (
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-text-secondary">
                      {entry.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {log.finalReport && (
          <div className="rounded-lg border border-border bg-surface-2/40 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Rapport final
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-text-secondary">
              {log.finalReport}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleCopy()}
          className="gigi-btn gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Journal copié
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copier le journal
            </>
          )}
        </button>
      </div>
    </section>
  );
}
