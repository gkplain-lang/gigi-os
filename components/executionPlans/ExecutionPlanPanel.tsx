"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ExecutionPlan } from "@/modules/executionPlans";
import {
  EXECUTION_DRY_RUN_MESSAGE,
  EXECUTION_FINAL_CONFIRMATION,
  EXECUTION_MODE_LABELS,
  EXECUTION_STATUS_LABELS,
  formatExecutionPlanForCopy,
} from "@/modules/executionPlans";
import { ExecutionLogPanel } from "@/components/executionLogs/ExecutionLogPanel";
import { cn } from "@/lib/utils";

const ACTOR_LABELS: Record<ExecutionPlan["steps"][0]["actor"], string> = {
  user: "Toi",
  cursor: "Cursor",
  gigi_future: "Gigi (futur)",
};

const RISK_STYLE: Record<"low" | "medium" | "high", string> = {
  low: "text-emerald-300/90",
  medium: "text-amber-200/90",
  high: "text-red-300/80",
};

interface ExecutionPlanPanelProps {
  plan: ExecutionPlan;
  compact?: boolean;
  className?: string;
  onMarkCompleted?: (planId: string) => void;
  showManualTracking?: boolean;
}

function CopyableCommand({ command, description }: { command: string; description: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* text is selectable */
    }
  }, [command]);

  return (
    <div className="rounded-lg border border-border bg-surface-2/40 px-3 py-2.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <code className="break-all text-[12.5px] text-accent-soft">{command}</code>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="gigi-btn gigi-focus inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px]"
          title="Copier la commande — ne l'exécute pas"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              Copié
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copier
            </>
          )}
        </button>
      </div>
      <p className="mt-1 text-[11.5px] text-text-muted">{description}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-amber-200/70">
        Manuel uniquement — Gigi ne lance jamais cette commande
      </p>
    </div>
  );
}

export function ExecutionPlanPanel({
  plan,
  compact = false,
  className,
  onMarkCompleted,
  showManualTracking = true,
}: ExecutionPlanPanelProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatExecutionPlanForCopy(plan));
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      /* fallback */
    }
  }, [plan]);

  return (
    <section className={cn("gigi-command-card overflow-hidden border-[rgba(124,140,255,0.25)]", className)}>
      <div className="border-b border-border px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-200/90">
            Exécution guidée · aucune action automatique
          </span>
          <span className="rounded bg-surface-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
            {EXECUTION_MODE_LABELS[plan.executionMode]}
          </span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-text-muted">
            {EXECUTION_STATUS_LABELS[plan.status]}
          </span>
        </div>
        <h3 className={cn("mt-2 font-semibold text-text-primary", compact ? "text-[15px]" : "text-[17px]")}>
          {plan.title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{plan.summary}</p>
        <p className="mt-2 text-[12px] text-text-muted">
          Projet : <span className="text-text-secondary">{plan.projectName}</span>
        </p>
      </div>

      <div className="space-y-4 px-4 py-4 md:px-5">
        <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2.5 text-[12.5px] leading-relaxed text-amber-200/90">
          {EXECUTION_DRY_RUN_MESSAGE}
        </p>

        <div className="rounded-lg border border-border bg-surface-2/40 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft/80">Objectif</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">{plan.objective}</p>
        </div>

        {plan.prerequisites.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Prérequis</p>
            <ul className="mt-2 space-y-2">
              {plan.prerequisites.map((p) => (
                <li key={p.id} className="text-[13px] leading-relaxed text-text-secondary">
                  <span className="font-medium text-text-primary">{p.label}</span>
                  <span className="mt-0.5 block text-text-muted">{p.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.targetFiles.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Fichiers probables
            </p>
            <ul className="mt-2 space-y-2">
              {plan.targetFiles.map((f) => (
                <li
                  key={f.path}
                  className="rounded-lg border border-border bg-surface-2/30 px-3 py-2 text-[13px]"
                >
                  <code className="text-accent-soft">{f.path}</code>
                  <span className="mt-0.5 block text-text-muted">{f.reason}</span>
                  <span className={cn("mt-0.5 block text-[11px] font-medium", RISK_STYLE[f.riskLevel])}>
                    Risque {f.riskLevel}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Étapes</p>
          <ol className="mt-3 space-y-3">
            {plan.steps.map((step) => (
              <li key={step.id} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(124,140,255,0.35)] bg-[rgba(124,140,255,0.08)] text-[11px] font-semibold tabular-nums text-accent-soft">
                  {step.order}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-medium text-text-primary">{step.title}</p>
                    <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-muted">
                      {ACTOR_LABELS[step.actor]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-text-secondary">{step.description}</p>
                  <p className="mt-1 text-[11.5px] text-text-muted">Fini quand : {step.doneDefinition}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {plan.commands.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Commandes théoriques (copier-coller)
            </p>
            <div className="mt-2 space-y-2">
              {plan.commands.map((cmd) => (
                <CopyableCommand key={cmd.id} command={cmd.command} description={cmd.description} />
              ))}
            </div>
          </div>
        )}

        {plan.tests.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Tests</p>
            <ul className="mt-2 space-y-2">
              {plan.tests.map((t) => (
                <li key={t.id} className="text-[13px] leading-relaxed text-text-secondary">
                  <span className="font-medium text-text-primary">{t.label}</span>
                  {t.command && (
                    <code className="ml-1 text-[12px] text-accent-soft">({t.command})</code>
                  )}
                  <span className="mt-0.5 block text-text-muted">{t.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.risks.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Risques</p>
            <ul className="mt-2 space-y-2">
              {plan.risks.map((r) => (
                <li key={r.id} className="text-[13px] leading-relaxed">
                  <span className="font-medium text-text-secondary">{r.risk}</span>
                  <span className="mt-0.5 block text-text-muted">→ {r.mitigation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.rollbackPlan.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Rollback</p>
            <ul className="mt-2 space-y-2">
              {plan.rollbackPlan.map((r) => (
                <li key={r.id} className="rounded-lg border border-border bg-surface-2/30 px-3 py-2.5 text-[13px]">
                  <span className="font-medium text-text-primary">{r.title}</span>
                  <span className="mt-0.5 block text-text-muted">{r.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.validationChecklist.length > 0 && (
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
              Checklist de validation
            </p>
            <ul className="mt-2 space-y-1.5">
              {plan.validationChecklist.map((v) => (
                <li key={v.id} className="flex gap-2 text-[13px] text-text-secondary">
                  <span className="text-text-muted">{v.required ? "☐" : "○"}</span>
                  {v.label}
                  {!v.required && (
                    <span className="text-[11px] text-text-muted">(optionnel)</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-amber-200/70">{EXECUTION_FINAL_CONFIRMATION}</p>
          </div>
        )}

        {plan.expectedReport.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Rapport attendu
            </p>
            <ul className="mt-2 space-y-1.5">
              {plan.expectedReport.map((item, i) => (
                <li key={i} className="flex gap-2 text-[13px] text-text-secondary">
                  <span className="text-text-muted">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.safetyNotes.length > 0 && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-300/80">
              Notes sécurité
            </p>
            <ul className="mt-2 space-y-1">
              {plan.safetyNotes.map((note, i) => (
                <li key={i} className="text-[12.5px] leading-relaxed text-text-secondary">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showManualTracking && (
          <ExecutionLogPanel
            plan={plan}
            onPlanCompleted={onMarkCompleted}
          />
        )}

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleCopyAll()}
            className="gigi-btn gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            {copiedAll ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Plan copié
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copier le plan complet
              </>
            )}
          </button>
          {onMarkCompleted && !showManualTracking && plan.status !== "completed_manually" && (
            <button
              type="button"
              onClick={() => onMarkCompleted(plan.id)}
              className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
            >
              Marquer terminé manuellement
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
