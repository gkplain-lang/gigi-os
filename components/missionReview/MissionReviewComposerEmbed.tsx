"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  getLatestMissionReview,
  createReviewFromDailyMission,
} from "@/modules/missionReview";
import { getActiveDailyPriorityMission } from "@/modules/missionComposer";
import { useIsClient } from "@/components/settings/useIsClient";
import { DailyMissionReviewCard } from "./DailyMissionReviewCard";

export function MissionReviewComposerEmbed() {
  const isClient = useIsClient();
  const router = useRouter();
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const daily = useMemo(() => {
    if (!isClient) return undefined;
    void revision;
    return getActiveDailyPriorityMission();
  }, [isClient, revision]);

  const latest = useMemo(() => {
    if (!isClient) return undefined;
    void revision;
    return getLatestMissionReview();
  }, [isClient, revision]);

  if (!isClient) return null;

  function handleCreateReview() {
    const review = createReviewFromDailyMission();
    refresh();
    if (review) router.push(`/mission-review?review=${review.id}`);
    else router.push("/mission-review");
  }

  return (
    <section className="mb-6 rounded-xl border border-violet-500/20 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
        Revue de mission · V4.8
      </p>
      {daily ? (
        <p className="mt-2 text-[13px] text-text-secondary">
          Mission du jour active — fais le bilan local avant la décision suivante.
        </p>
      ) : (
        <p className="mt-2 text-[12px] text-text-muted">Aucune mission du jour à revoir.</p>
      )}
      {latest && (
        <div className="mt-3">
          <DailyMissionReviewCard review={latest} compact />
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {daily && (
          <button
            type="button"
            onClick={handleCreateReview}
            className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
          >
            Créer une revue
          </button>
        )}
        <Link
          href="/mission-review"
          className="gigi-focus text-[12px] text-accent-soft hover:underline"
        >
          Revue de mission →
        </Link>
      </div>
    </section>
  );
}
