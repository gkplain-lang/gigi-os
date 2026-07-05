"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  generateManualBridgeSummary,
  listManualExecutionPackets,
  syncExpiredManualBridgePackets,
} from "@/modules/executionReadiness";
import { ManualBridgeBadges } from "./ManualBridgeBadges";
import { ManualBridgePacketList } from "./ManualBridgePacketList";
import { useIsClient } from "@/components/settings/useIsClient";
import { cn } from "@/lib/utils";

const EMBED_LIMIT = 3;

export function ManualBridgeEmbed({ className }: { className?: string }) {
  const isClient = useIsClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { summary, packets } = useMemo(() => {
    if (!isClient) return { summary: null, packets: [] };
    syncExpiredManualBridgePackets();
    return {
      summary: generateManualBridgeSummary(),
      packets: listManualExecutionPackets(EMBED_LIMIT),
    };
  }, [isClient]);

  if (!isClient || !summary) return null;

  return (
    <section
      className={cn(
        "gigi-panel-raised mb-6 rounded-xl border border-indigo-500/25 p-5 md:p-6",
        className
      )}
      aria-label="Pont manuel V4.2"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200/90">
            Pont manuel · V4.2
          </p>
          <p className="mt-1 max-w-2xl text-[13px] text-text-secondary">
            {summary.summaryText}
          </p>
        </div>
        <Link
          href="/manual-bridge"
          className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Panel complet →
        </Link>
      </div>
      <ManualBridgeBadges className="mt-3" />
      {summary.readyForReview > 0 && (
        <p className="mt-3 text-[12.5px] font-medium text-violet-200/90">
          {summary.readyForReview} paquet(s) prêt(s) pour revue humaine
        </p>
      )}
      <div className="mt-4">
        <ManualBridgePacketList
          packets={packets}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </section>
  );
}
