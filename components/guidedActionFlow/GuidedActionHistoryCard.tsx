"use client";

import Link from "next/link";
import {
  getRecentGuidedActionAudit,
  GUIDED_FLOW_AUDIT_LABELS,
} from "@/modules/executionExperience/guidedActionRecentAudit";
import { useIsClient } from "@/components/settings/useIsClient";

export function GuidedActionHistoryCard() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const events = getRecentGuidedActionAudit(6);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
        Actions guidées · V4.6
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Derniers événements de parcours guidé — local uniquement, statuts déclaratifs.
      </p>

      {events.length === 0 ? (
        <p className="mt-3 text-[12px] text-text-muted">
          Aucun parcours guidé —{" "}
          <Link href="/guided-actions" className="text-accent-soft hover:underline">
            créer un parcours
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((e) => (
            <li key={e.entryId} className="text-[12px] text-text-muted">
              <span className="text-text-secondary">{GUIDED_FLOW_AUDIT_LABELS[e.type]}</span>
              {" · "}
              {e.flowTitle.replace(/^Guidé · /, "")}
              {" · "}
              {e.message.slice(0, 60)}
              {e.message.length > 60 ? "…" : ""}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/guided-actions"
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Parcours guidés →
      </Link>
    </div>
  );
}
