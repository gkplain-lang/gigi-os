"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  generateLocalReviewSummary,
  listLocalReviewSessions,
} from "@/modules/executionReadiness";
import { LocalReviewBadges } from "./LocalReviewBadges";
import { LocalReviewSessionList } from "./LocalReviewSessionList";
import { useIsClient } from "@/components/settings/useIsClient";
import { cn } from "@/lib/utils";

const EMBED_LIMIT = 3;

export function LocalReviewEmbed({ className }: { className?: string }) {
  const isClient = useIsClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { summary, sessions } = useMemo(() => {
    if (!isClient) return { summary: null, sessions: [] };
    return {
      summary: generateLocalReviewSummary(),
      sessions: listLocalReviewSessions(EMBED_LIMIT),
    };
  }, [isClient]);

  if (!isClient || !summary) return null;

  return (
    <section
      className={cn(
        "gigi-panel-raised mb-6 rounded-xl border border-teal-500/25 p-5 md:p-6",
        className
      )}
      aria-label="Revue locale V4.4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200/90">
            Revue locale · V4.4
          </p>
          <p className="mt-1 max-w-2xl text-[13px] text-text-secondary">{summary.summaryText}</p>
        </div>
        <Link
          href="/local-review"
          className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Panel complet →
        </Link>
      </div>
      <LocalReviewBadges className="mt-3" />
      {(summary.awaitingInput > 0 || summary.needsAttention > 0) && (
        <p className="mt-3 text-[12.5px] font-medium text-amber-200/90">
          {summary.awaitingInput} en attente · {summary.needsAttention} attention requise
        </p>
      )}
      <div className="mt-4">
        <LocalReviewSessionList
          sessions={sessions}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </section>
  );
}
