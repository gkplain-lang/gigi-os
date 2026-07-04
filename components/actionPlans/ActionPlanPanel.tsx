import type { ActionPlan } from "@/modules/actionPlans";
import { ActionPlanFutureActions } from "@/components/actionPlans/ActionPlanFutureActions";
import { cn } from "@/lib/utils";

const EFFORT_LABEL = { low: "Faible", medium: "Moyen", high: "Élevé" } as const;

interface ActionPlanPanelProps {
  plan: ActionPlan;
  projectName?: string;
  initialPrepareId?: string | null;
  compact?: boolean;
  className?: string;
}

export function ActionPlanPanel({
  plan,
  projectName = plan.projectId,
  initialPrepareId,
  compact = false,
  className,
}: ActionPlanPanelProps) {
  return (
    <section className={cn("gigi-command-card overflow-hidden", className)}>
      <div className="border-b border-border px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="gigi-mission-control-label">Plan d&apos;action</p>
          <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200/90">
            Dry-run · préparation uniquement
          </span>
          <span className="ml-auto text-[11px] tabular-nums text-text-muted">
            {EFFORT_LABEL[plan.effort]} · confiance {Math.round(plan.confidence * 100)}%
          </span>
        </div>
        <h2 className={cn("mt-2 font-semibold text-text-primary", compact ? "text-[15px]" : "text-[17px]")}>
          {plan.title}
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">{plan.summary}</p>
      </div>

      <div className="space-y-4 px-4 py-4 md:px-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface-2/40 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft/80">
              Pourquoi maintenant
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{plan.whyNow}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-2/40 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft/80">
              Résultat attendu
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">{plan.expectedOutcome}</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Étapes</p>
          <ol className="mt-3 space-y-3">
            {plan.steps.map((step) => (
              <li key={step.id} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(124,140,255,0.35)] bg-[rgba(124,140,255,0.08)] text-[11px] font-semibold tabular-nums text-accent-soft">
                  {step.order}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-text-primary">{step.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-text-secondary">{step.description}</p>
                  {(step.estimatedTime || step.doneDefinition) && (
                    <p className="mt-1 text-[11.5px] text-text-muted">
                      {step.estimatedTime && <span>{step.estimatedTime}</span>}
                      {step.estimatedTime && step.doneDefinition && " · "}
                      {step.doneDefinition && <span>Fini quand : {step.doneDefinition}</span>}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {plan.deliverables.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Livrables</p>
            <ul className="mt-2 space-y-2">
              {plan.deliverables.map((d) => (
                <li
                  key={d.id}
                  className="rounded-lg border border-border bg-surface-2/30 px-3 py-2.5 text-[13px]"
                >
                  <span className="font-medium text-text-primary">{d.title}</span>
                  <span className="mt-0.5 block text-text-muted">{d.description}</span>
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

        {plan.possibleFutureActions.length > 0 && (
          <ActionPlanFutureActions
            plan={plan}
            projectName={projectName}
            initialPrepareId={initialPrepareId}
          />
        )}

        {plan.validationRequired.length > 0 && (
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
              Validation requise
            </p>
            <ul className="mt-2 space-y-1">
              {plan.validationRequired.map((v) => (
                <li key={v} className="flex gap-2 text-[12.5px] text-text-secondary">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/70" aria-hidden />
                  {v}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11.5px] text-text-muted">
              Je ne fais aucune action réelle sans validation.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
