"use client";

import Link from "next/link";
import {
  LOCAL_REVIEW_AUDIT_EVENT_LABELS,
  getRecentLocalReviewAudit,
} from "@/modules/executionReadiness";
import { useIsClient } from "@/components/settings/useIsClient";

export function LocalReviewHistoryCard() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const events = getRecentLocalReviewAudit(6);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-200/80">
        Journal revue locale · V4.4
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Derniers événements — analyse locale, aucune vérification réelle.
      </p>
      {events.length === 0 ? (
        <p className="mt-3 text-[12.5px] text-text-muted">
          Aucun événement — crée une revue sur{" "}
          <Link href="/local-review" className="text-accent-soft hover:underline">
            /local-review
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((e) => (
            <li
              key={`${e.sessionId}-${e.entryId}`}
              className="rounded-lg border border-border/40 bg-surface-2/10 px-3 py-2 text-[12.5px]"
            >
              <span className="font-medium text-text-primary">
                {LOCAL_REVIEW_AUDIT_EVENT_LABELS[e.type] ?? e.type}
              </span>
              <span className="text-text-muted"> · {e.sessionTitle}</span>
              <p className="mt-0.5 text-[11.5px] text-text-muted">{e.message}</p>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/local-review"
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Revue locale →
      </Link>
    </div>
  );
}
