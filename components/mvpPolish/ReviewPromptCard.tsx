"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { getActiveDailyPriorityMission } from "@/modules/missionComposer";
import { getLatestMissionReview, createReviewFromDailyMission } from "@/modules/missionReview";
import { useIsClient } from "@/components/settings/useIsClient";
import { MVPStatusPill } from "./MVPStatusPill";

export function ReviewPromptCard({ className }: { className?: string }) {
  const isClient = useIsClient();
  const router = useRouter();

  const daily = useMemo(() => {
    if (!isClient) return undefined;
    return getActiveDailyPriorityMission();
  }, [isClient]);

  const latest = useMemo(() => {
    if (!isClient) return undefined;
    return getLatestMissionReview();
  }, [isClient]);

  if (!isClient) return null;
  if (!daily && !latest) return null;

  function handleCreateReview() {
    const review = createReviewFromDailyMission();
    if (review) router.push(`/mission-review?review=${review.id}`);
    else router.push("/mission-review");
  }

  return (
    <section
      className={`rounded-xl border border-violet-500/25 bg-violet-500/[0.05] p-5 ${className ?? ""}`}
      aria-label="Revue et décision suivante"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
          Revue & décision suivante
        </p>
        {latest && <MVPStatusPill label="Dernière décision prête" tone="success" />}
      </div>

      {latest ? (
        <p className="mt-2 text-[13px] text-text-secondary">
          Décision suivante :{" "}
          <span className="font-medium text-accent-soft">{latest.recommendedNextAction}</span>
        </p>
      ) : (
        <p className="mt-2 text-[13px] text-text-secondary">
          Fais le bilan de « {daily?.title} » puis choisis la décision suivante — local uniquement.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {daily && (
          <button
            type="button"
            onClick={handleCreateReview}
            className="gigi-focus inline-flex rounded-lg bg-violet-500/15 px-4 py-2 text-[12.5px] font-medium text-violet-100 hover:bg-violet-500/25"
          >
            Faire la revue →
          </button>
        )}
        <Link
          href="/mission-review"
          className="gigi-focus inline-flex items-center text-[12.5px] font-medium text-text-muted underline-offset-2 hover:text-text-secondary hover:underline"
        >
          Voir les revues
        </Link>
      </div>
    </section>
  );
}
