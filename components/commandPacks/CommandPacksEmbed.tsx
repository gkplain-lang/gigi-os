"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  generateCommandPackSummary,
  listCommandPacks,
  syncExpiredCommandPacks,
} from "@/modules/executionReadiness";
import { CommandPackBadges } from "./CommandPackBadges";
import { CommandPackList } from "./CommandPackList";
import { useIsClient } from "@/components/settings/useIsClient";
import { cn } from "@/lib/utils";

const EMBED_LIMIT = 3;

export function CommandPacksEmbed({ className }: { className?: string }) {
  const isClient = useIsClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { summary, packs } = useMemo(() => {
    if (!isClient) return { summary: null, packs: [] };
    syncExpiredCommandPacks();
    return {
      summary: generateCommandPackSummary(),
      packs: listCommandPacks(EMBED_LIMIT),
    };
  }, [isClient]);

  if (!isClient || !summary) return null;

  return (
    <section
      className={cn(
        "gigi-panel-raised mb-6 rounded-xl border border-violet-500/25 p-5 md:p-6",
        className
      )}
      aria-label="Packs de commandes V4.3"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-200/90">
            Packs de commandes · V4.3
          </p>
          <p className="mt-1 max-w-2xl text-[13px] text-text-secondary">{summary.summaryText}</p>
        </div>
        <Link
          href="/command-packs"
          className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Panel complet →
        </Link>
      </div>
      <CommandPackBadges className="mt-3" />
      {summary.readyForReview > 0 && (
        <p className="mt-3 text-[12.5px] font-medium text-violet-200/90">
          {summary.readyForReview} pack(s) prêt(s) à relire
        </p>
      )}
      <div className="mt-4">
        <CommandPackList packs={packs} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </section>
  );
}
