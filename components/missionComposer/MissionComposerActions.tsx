"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  getActiveDailyPriorityMission,
  updateDailyPriorityMissionStatus,
  convertMissionToGuidedActionFlow,
} from "@/modules/missionComposer";
import { useIsClient } from "@/components/settings/useIsClient";
import { DailyPriorityMissionCard } from "./DailyPriorityMissionCard";

export function MissionComposerActions() {
  const isClient = useIsClient();
  const router = useRouter();
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const daily = useMemo(() => {
    if (!isClient) return undefined;
    void revision;
    return getActiveDailyPriorityMission();
  }, [isClient, revision]);

  if (!isClient) return null;

  if (!daily) {
    return (
      <section className="gigi-panel mb-6 rounded-xl border border-emerald-500/20 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
          Mission du jour · V4.7
        </p>
        <p className="mt-2 text-[13px] text-text-secondary">
          Aucune mission prioritaire — compose-en une pour réduire la dispersion.
        </p>
        <Link
          href="/mission-composer"
          className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
        >
          Composer la mission du jour →
        </Link>
      </section>
    );
  }

  function handleComplete() {
    updateDailyPriorityMissionStatus(daily!.id, "completed_by_human");
    refresh();
  }

  function handleConvert() {
    const result = convertMissionToGuidedActionFlow(undefined, daily!.id);
    refresh();
    if (result?.flow) router.push(`/guided-actions?flow=${result.flow.id}`);
  }

  return (
    <section className="mb-6 space-y-3">
      <DailyPriorityMissionCard mission={daily} compact />
      <div className="flex flex-wrap gap-2 px-1">
        {daily.status !== "converted_to_guided_flow" && (
          <button
            type="button"
            onClick={handleConvert}
            className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
          >
            Transformer en parcours guidé
          </button>
        )}
        {daily.status !== "completed_by_human" && (
          <button
            type="button"
            onClick={handleComplete}
            className="gigi-focus rounded-lg border border-border/40 px-3 py-1.5 text-[12px] text-text-muted hover:text-text-secondary"
          >
            Marquer terminée (humain)
          </button>
        )}
      </div>
    </section>
  );
}
