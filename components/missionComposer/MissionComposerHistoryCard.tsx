"use client";

import Link from "next/link";
import {
  getRecentMissionComposerAudit,
  MISSION_COMPOSER_AUDIT_LABELS,
} from "@/modules/missionComposer";
import { useIsClient } from "@/components/settings/useIsClient";

export function MissionComposerHistoryCard() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const events = getRecentMissionComposerAudit(6);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
        Mission Composer · V4.7
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Derniers événements mission-first — local uniquement, statuts déclaratifs.
      </p>

      {events.length === 0 ? (
        <p className="mt-3 text-[12px] text-text-muted">
          Aucun événement —{" "}
          <Link href="/mission-composer" className="text-accent-soft hover:underline">
            composer une mission
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((e) => (
            <li key={e.entryId} className="text-[12px] text-text-muted">
              <span className="text-text-secondary">{MISSION_COMPOSER_AUDIT_LABELS[e.type]}</span>
              {" · "}
              {e.title}
              {e.projectName ? ` · ${e.projectName}` : ""}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/mission-composer"
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Mission du jour →
      </Link>
    </div>
  );
}
