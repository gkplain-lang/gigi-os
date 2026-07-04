"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { HistoryTimeline } from "@/components/history/HistoryTimeline";
import { useGigi } from "@/components/providers/GigiProvider";
import { REFINED_PAGE_META } from "@/modules/dailyUseRefinement";

export function HistoryPageContent() {
  const { state, isHydrated } = useGigi();

  if (!isHydrated) return null;

  return (
    <div className="gigi-page-shell animate-fade-in mx-auto max-w-[760px]">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader title="Historique" meta={REFINED_PAGE_META.history} />
        <div className="gigi-panel-raised rounded-xl p-5 md:p-6">
          <HistoryTimeline events={state.history} />
        </div>
      </div>
    </div>
  );
}
