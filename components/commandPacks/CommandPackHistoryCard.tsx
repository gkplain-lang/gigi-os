"use client";

import Link from "next/link";
import {
  COMMAND_PACK_AUDIT_EVENT_LABELS,
  getRecentCommandPackAudit,
} from "@/modules/executionReadiness";
import { useIsClient } from "@/components/settings/useIsClient";

export function CommandPackHistoryCard() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const events = getRecentCommandPackAudit(6);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/80">
        Journal des packs de commandes · V4.3
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Derniers événements locaux — statuts déclaratifs, aucune exécution réelle.
      </p>
      {events.length === 0 ? (
        <p className="mt-3 text-[12.5px] text-text-muted">
          Aucun événement — prépare un pack sur{" "}
          <Link href="/command-packs" className="text-accent-soft hover:underline">
            /command-packs
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((e) => (
            <li
              key={`${e.packId}-${e.entryId}`}
              className="rounded-lg border border-border/40 bg-surface-2/10 px-3 py-2 text-[12.5px]"
            >
              <span className="font-medium text-text-primary">
                {COMMAND_PACK_AUDIT_EVENT_LABELS[e.type] ?? e.type}
              </span>
              <span className="text-text-muted"> · {e.packTitle}</span>
              <p className="mt-0.5 text-[11.5px] text-text-muted">{e.message}</p>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/command-packs"
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Packs de commandes →
      </Link>
    </div>
  );
}
