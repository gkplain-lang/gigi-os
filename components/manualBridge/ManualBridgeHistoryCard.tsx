"use client";

import Link from "next/link";
import {
  MANUAL_BRIDGE_AUDIT_EVENT_LABELS,
  listRecentManualBridgeAuditEvents,
} from "@/modules/executionReadiness";
import { useIsClient } from "@/components/settings/useIsClient";

export function ManualBridgeHistoryCard() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const events = listRecentManualBridgeAuditEvents(6);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/80">
        Journal du pont manuel · V4.2
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Derniers événements locaux — sandbox, aucune exécution réelle.
      </p>
      {events.length === 0 ? (
        <p className="mt-3 text-[12.5px] text-text-muted">
          Aucun événement — prépare un paquet sur{" "}
          <Link href="/manual-bridge" className="text-accent-soft hover:underline">
            /manual-bridge
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((e) => (
            <li
              key={`${e.packetId}-${e.entryId}`}
              className="rounded-lg border border-border/40 bg-surface-2/10 px-3 py-2 text-[12.5px]"
            >
              <span className="font-medium text-text-primary">
                {MANUAL_BRIDGE_AUDIT_EVENT_LABELS[e.type] ?? e.type}
              </span>
              <span className="text-text-muted"> · {e.packetTitle}</span>
              <p className="mt-0.5 text-[11.5px] text-text-muted">{e.message}</p>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/manual-bridge"
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Pont manuel →
      </Link>
    </div>
  );
}
