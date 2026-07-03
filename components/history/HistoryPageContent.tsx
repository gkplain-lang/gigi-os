"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { HistoryTimeline } from "@/components/history/HistoryTimeline";
import { useGigi } from "@/components/providers/GigiProvider";

export function HistoryPageContent() {
  const { state, isHydrated } = useGigi();

  if (!isHydrated) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader
        title="Historique"
        subtitle="Gigi garde en mémoire ce qui a compté — les décisions, et ce qui a été mis en pause."
      />
      <HistoryTimeline events={state.history} />
    </div>
  );
}
