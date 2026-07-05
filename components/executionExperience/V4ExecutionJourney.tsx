"use client";

import Link from "next/link";
import { V4_EXECUTION_JOURNEY_STEPS } from "@/modules/executionExperience/executionExperienceConstants";
import { cn } from "@/lib/utils";

export function V4ExecutionJourney({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <section
      className={cn(
        "rounded-xl border border-indigo-500/25 bg-indigo-500/[0.04] p-5",
        className
      )}
      aria-label="Parcours d'exécution contrôlée"
    >
      <h2 className="text-[15px] font-semibold text-text-primary">
        Le parcours d&apos;exécution contrôlée
      </h2>
      <p className="mt-1 text-[12.5px] text-text-muted">
        Local uniquement — aucune exécution réelle à aucune étape.
      </p>

      <ol className={cn("mt-4 space-y-3", compact && "sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0")}>
        {V4_EXECUTION_JOURNEY_STEPS.map((step) => (
          <li
            key={step.step}
            className="flex gap-3 rounded-lg border border-border/30 bg-surface-2/10 px-3 py-2.5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[12px] font-bold text-indigo-200/90">
              {step.step}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={step.href}
                  className="gigi-focus text-[13px] font-medium text-accent-soft hover:underline"
                >
                  {step.title}
                </Link>
                <span className="rounded border border-border/40 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-text-muted">
                  {step.badge}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-text-secondary">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
