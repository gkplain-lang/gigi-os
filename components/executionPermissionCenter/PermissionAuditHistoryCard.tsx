"use client";

import Link from "next/link";
import {
  PERMISSION_AUDIT_EVENT_LABELS,
  listRecentPermissionAuditEvents,
} from "@/modules/executionReadiness";
import { useIsClient } from "@/components/settings/useIsClient";

interface PermissionAuditHistoryCardProps {
  limit?: number;
  className?: string;
}

function formatAuditAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PermissionAuditHistoryCard({
  limit = 6,
  className,
}: PermissionAuditHistoryCardProps) {
  const isClient = useIsClient();
  if (!isClient) return null;

  const events = listRecentPermissionAuditEvents(limit);

  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/80">
        Journal permissions · V4.1
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
        Derniers événements du journal local — simulation uniquement, aucune exécution réelle.
      </p>
      {events.length === 0 ? (
        <p className="mt-3 text-[12.5px] text-text-muted">
          Aucun événement — crée une demande sur{" "}
          <Link href="/actions" className="text-accent-soft hover:underline">
            /actions
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {events.map((event) => (
            <li
              key={`${event.requestId}-${event.entryId}`}
              className="rounded-lg border border-border/40 bg-surface-2/10 px-3 py-2 text-[12.5px]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-text-primary">
                  {PERMISSION_AUDIT_EVENT_LABELS[event.type] ?? event.type}
                </span>
                <span className="text-[11px] text-text-muted">{formatAuditAt(event.at)}</span>
              </div>
              <p className="mt-0.5 text-text-secondary">
                {event.requestTitle.replace(/^Readiness · /, "")}
              </p>
              <p className="mt-0.5 text-[11.5px] text-text-muted">{event.message}</p>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/permissions"
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft underline-offset-2 hover:underline"
      >
        Ouvrir le centre de permissions →
      </Link>
    </div>
  );
}
