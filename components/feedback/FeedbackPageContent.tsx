"use client";

import Link from "next/link";
import { BetaFeedbackPanel } from "@/components/beta/BetaFeedbackPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { BETA_FEEDBACK_PROMPTS } from "@/modules/publicEntry/betaTesterCopy";
import {
  REFINED_EMPTY_STATES,
  REFINED_PAGE_META,
  SIDEBAR_LINK_LABELS,
  SIMULATION_NOTE,
} from "@/modules/dailyUseRefinement";

export function FeedbackPageContent() {
  return (
    <div className="gigi-page-shell animate-fade-in mx-auto max-w-lg">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader title="Feedback" meta={REFINED_PAGE_META.feedback} />

        <p className="mb-4 text-[12px] leading-relaxed text-text-secondary italic">
          {SIMULATION_NOTE.pageHint}
        </p>

        <div className="gigi-panel mb-4 rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Retour testeur bêta
          </p>
          <p className="mt-2 text-[13px] text-text-secondary">
            Tes retours restent sur cet appareil — aucun envoi API, aucune sync cloud.
          </p>
          <ul className="mt-3 space-y-1 text-[12.5px] text-text-muted">
            {BETA_FEEDBACK_PROMPTS.map((prompt) => (
              <li key={prompt}>· {prompt}</li>
            ))}
          </ul>
          <Link
            href="/beta"
            className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
          >
            Checklist bêta complète →
          </Link>
        </div>

        <div className="gigi-form-card rounded-xl p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-soft/80">
            {REFINED_EMPTY_STATES.feedback.title}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
            {REFINED_EMPTY_STATES.feedback.body}
          </p>
          <BetaFeedbackPanel defaultRoute="/feedback" />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Link
            href="/"
            className="gigi-focus text-[13px] text-text-secondary hover:text-accent-soft"
          >
            ← Retour à l&apos;accueil
          </Link>
          <Link
            href="/conversation"
            className="gigi-focus text-[13px] text-text-secondary hover:text-accent-soft"
          >
            ← {SIDEBAR_LINK_LABELS.talkToGigi}
          </Link>
        </div>
      </div>
    </div>
  );
}
