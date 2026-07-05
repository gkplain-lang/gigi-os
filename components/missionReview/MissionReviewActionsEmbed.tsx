"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getLatestMissionReview } from "@/modules/missionReview";
import { getActiveDailyPriorityMission } from "@/modules/missionComposer";
import { useIsClient } from "@/components/settings/useIsClient";
import { DailyMissionReviewCard } from "./DailyMissionReviewCard";

export function MissionReviewActionsEmbed() {
  const isClient = useIsClient();

  const latest = useMemo(() => {
    if (!isClient) return undefined;
    return getLatestMissionReview();
  }, [isClient]);

  const daily = useMemo(() => {
    if (!isClient) return undefined;
    return getActiveDailyPriorityMission();
  }, [isClient]);

  if (!isClient) return null;

  if (!latest && !daily) {
    return (
      <section className="gigi-panel mb-6 rounded-xl border border-violet-500/20 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
          Revue de mission · V4.8
        </p>
        <p className="mt-2 text-[13px] text-text-secondary">
          Aucune mission à revoir — compose d&apos;abord une mission du jour.
        </p>
        <Link
          href="/mission-review"
          className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
        >
          Revue de mission →
        </Link>
      </section>
    );
  }

  return (
    <section className="mb-6 space-y-3">
      {latest ? (
        <DailyMissionReviewCard review={latest} compact />
      ) : daily ? (
        <p className="text-[13px] text-text-secondary">
          Mission à revoir : <span className="font-medium">{daily.title}</span>
        </p>
      ) : null}
      <Link
        href="/mission-review"
        className="gigi-focus inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Faire la revue de mission →
      </Link>
    </section>
  );
}
