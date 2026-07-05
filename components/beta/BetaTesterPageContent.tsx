"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  BETA_FEEDBACK_PROMPTS,
  BETA_TESTER_EXPECTED,
  BETA_TESTER_LIMITS,
  BETA_TESTER_SCENARIOS,
  BETA_TESTER_STATUS,
} from "@/modules/publicEntry/betaTesterCopy";
import { BetaFeedbackPanel } from "@/components/beta/BetaFeedbackPanel";

export function BetaTesterPageContent() {
  return (
    <div className="gigi-page-shell animate-fade-in mx-auto max-w-[760px]">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Parcours bêta"
          meta="Tester Gigi en local — checklist, scénarios et retours sans envoi externe."
        />

        <div className="gigi-panel-raised mb-6 rounded-xl border border-indigo-500/25 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
            {BETA_TESTER_STATUS.label}
          </p>
          <p className="mt-2 text-[15px] font-medium text-text-primary">
            {BETA_TESTER_STATUS.value}
          </p>
          <p className="mt-1 text-[13px] text-text-muted">{BETA_TESTER_STATUS.version}</p>
        </div>

        <section className="gigi-panel mb-6 rounded-xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Checklist testeur — 8 scénarios
          </p>
          <ol className="mt-4 space-y-4">
            {BETA_TESTER_SCENARIOS.map((s) => (
              <li
                key={s.n}
                className="rounded-lg border border-border/50 bg-surface-2/15 px-4 py-3"
              >
                <p className="text-[14px] font-medium text-text-primary">
                  {s.n}. {s.title}
                </p>
                <p className="mt-1 text-[13px] text-text-secondary">
                  <span className="font-medium text-text-primary">Action : </span>
                  {s.action}
                </p>
                <p className="mt-1 text-[12.5px] text-text-muted">
                  <span className="font-medium">Observer : </span>
                  {s.observe}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="gigi-panel rounded-xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Ce qu&apos;on attend
            </p>
            <ul className="mt-3 space-y-1.5 text-[13px] text-text-secondary">
              {BETA_TESTER_EXPECTED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90">
              Limites connues
            </p>
            <ul className="mt-3 space-y-1.5 text-[13px] text-text-secondary">
              {BETA_TESTER_LIMITS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <section className="gigi-form-card rounded-xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft/80">
            Retour testeur bêta (local)
          </p>
          <p className="mt-2 text-[13px] text-text-secondary">
            Aucun envoi externe — stockage local uniquement (gigi-os-v09-beta-feedback).
          </p>
          <ul className="mt-3 space-y-1 text-[12.5px] text-text-muted">
            {BETA_FEEDBACK_PROMPTS.map((prompt) => (
              <li key={prompt}>· {prompt}</li>
            ))}
          </ul>
          <BetaFeedbackPanel defaultRoute="/beta" />
        </section>

        <div className="mt-6 flex flex-wrap gap-4 text-[13px]">
          <Link href="/" className="gigi-focus text-accent-soft hover:underline">
            Mission du jour →
          </Link>
          <Link href="/onboarding" className="gigi-focus text-text-muted hover:text-text-secondary">
            Démarrer
          </Link>
          <Link href="/landing" className="gigi-focus text-text-muted hover:text-text-secondary">
            Présentation
          </Link>
          <Link href="/feedback" className="gigi-focus text-text-muted hover:text-text-secondary">
            Feedback détaillé
          </Link>
        </div>
      </div>
    </div>
  );
}
