"use client";

import Link from "next/link";
import {
  getRecentMissionReviewAudit,
  MISSION_REVIEW_AUDIT_LABELS,
} from "@/modules/missionReview";
import { useIsClient } from "@/components/settings/useIsClient";

export function MissionReviewHistoryCard() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const events = getRecentMissionReviewAudit(6);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
        Revue de mission · V4.8
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Derniers événements de revue — local uniquement, statuts déclaratifs.
      </p>

      {events.length === 0 ? (
        <p className="mt-3 text-[12px] text-text-muted">
          Aucune revue —{" "}
          <Link href="/mission-review" className="text-accent-soft hover:underline">
            faire la revue de mission
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((e) => (
            <li key={e.entryId} className="text-[12px] text-text-muted">
              <span className="text-text-secondary">{MISSION_REVIEW_AUDIT_LABELS[e.type]}</span>
              {" · "}
              {e.missionTitle}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/mission-review"
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Revue de mission →
      </Link>
    </div>
  );
}
