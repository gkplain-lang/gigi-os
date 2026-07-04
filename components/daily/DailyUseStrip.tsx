"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, MessageSquare, Sun } from "lucide-react";
import { useGigi } from "@/components/providers/GigiProvider";
import {
  buildDailyUseStripSummary,
  DAILY_USE_GUARDRAILS,
  getDailyReviewHref,
  V11_PROMISE,
} from "@/modules/dailyUse";
import { cn } from "@/lib/utils";

export function DailyUseStrip() {
  const { state, isHydrated } = useGigi();

  if (!isHydrated) return null;

  const summary = buildDailyUseStripSummary(state.mission);
  const { nextAction } = summary;
  const isPrimary = nextAction.emphasis === "primary";

  return (
    <div className="gigi-panel mb-4 rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Aujourd&apos;hui · {summary.projectName}
        </p>
        <span
          className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10.5px] text-text-muted"
          title={DAILY_USE_GUARDRAILS.long}
        >
          {DAILY_USE_GUARDRAILS.short}
        </span>
      </div>

      <p className="mt-2 text-[15px] font-semibold leading-snug text-text-primary">
        {summary.missionTitle}
      </p>

      <div
        className={cn(
          "mt-3 rounded-lg border px-3 py-2.5",
          isPrimary
            ? "border-[rgba(142,167,194,0.35)] bg-accent-dim/40"
            : "border-border bg-surface/60"
        )}
      >
        <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          {nextAction.label}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{nextAction.hint}</p>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <Link
          href="/conversation"
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          Parler à Gigi
          <ArrowRight className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </Link>
        <Link
          href={getDailyReviewHref()}
          className="gigi-chip gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          <Sun className="h-3.5 w-3.5" aria-hidden />
          Bilan du jour
        </Link>
        <Link
          href="/feedback"
          className="gigi-chip gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] text-text-muted"
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          Donner un avis
        </Link>
      </div>

      <p className="mt-3 text-[11px] italic text-text-muted/75">{V11_PROMISE}</p>
    </div>
  );
}
