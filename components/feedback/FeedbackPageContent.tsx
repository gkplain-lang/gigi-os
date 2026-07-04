"use client";

import Link from "next/link";
import { BetaFeedbackPanel } from "@/components/beta/BetaFeedbackPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  REFINED_EMPTY_STATES,
  REFINED_PAGE_META,
  SIDEBAR_LINK_LABELS,
  SIMULATION_NOTE,
} from "@/modules/dailyUseRefinement";

export function FeedbackPageContent() {
  return (
    <div className="animate-fade-in mx-auto max-w-lg">
      <PageHeader title="Feedback" meta={REFINED_PAGE_META.feedback} />

      <p className="mb-4 text-[12px] leading-relaxed text-text-muted italic">
        {SIMULATION_NOTE.pageHint}
      </p>

      <div className="gigi-panel rounded-xl p-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
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
          className="gigi-focus text-[13px] text-text-muted hover:text-text-secondary"
        >
          ← Retour à l&apos;accueil
        </Link>
        <Link
          href="/conversation"
          className="gigi-focus text-[13px] text-text-muted hover:text-text-secondary"
        >
          ← {SIDEBAR_LINK_LABELS.talkToGigi}
        </Link>
      </div>
    </div>
  );
}
