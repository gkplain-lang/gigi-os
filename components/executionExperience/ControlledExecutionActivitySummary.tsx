"use client";

import Link from "next/link";
import {
  getRecentCommandPackAudit,
  getRecentLocalReviewAudit,
  listRecentManualBridgeAuditEvents,
  listRecentPermissionAuditEvents,
} from "@/modules/executionReadiness";
import { useIsClient } from "@/components/settings/useIsClient";
import { ExecutionRouteEmptyHint } from "./ExecutionRouteEmptyHint";

export function ControlledExecutionActivitySummary() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const permissionEvents = listRecentPermissionAuditEvents(2);
  const bridgeEvents = listRecentManualBridgeAuditEvents(2);
  const packEvents = getRecentCommandPackAudit(2);
  const reviewEvents = getRecentLocalReviewAudit(2);

  const total =
    permissionEvents.length + bridgeEvents.length + packEvents.length + reviewEvents.length;

  return (
    <section className="gigi-panel-raised mb-4 rounded-xl p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
        Activité d&apos;exécution contrôlée · V4.5
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Derniers événements locaux V4 — permissions, pont manuel, packs, revues. Statuts
        déclaratifs uniquement.
      </p>

      {total === 0 ? (
        <div className="mt-4">
          <ExecutionRouteEmptyHint
            message="Aucune activité V4 enregistrée. Prépare une action, un pack ou une revue pour voir l'historique ici."
            nextSteps={[
              { label: "Ouvrir Actions", href: "/actions" },
              { label: "Préparer des commandes", href: "/command-packs" },
              { label: "Revue locale", href: "/local-review" },
            ]}
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {permissionEvents.map((e) => (
            <li key={`p-${e.entryId}`} className="text-[12px] text-text-muted">
              <span className="text-text-secondary">Permission</span> · {e.message}
            </li>
          ))}
          {bridgeEvents.map((e) => (
            <li key={`b-${e.entryId}`} className="text-[12px] text-text-muted">
              <span className="text-text-secondary">Pont manuel</span> · {e.packetTitle}
            </li>
          ))}
          {packEvents.map((e) => (
            <li key={`cp-${e.entryId}`} className="text-[12px] text-text-muted">
              <span className="text-text-secondary">Pack</span> · {e.packTitle}
            </li>
          ))}
          {reviewEvents.map((e) => (
            <li key={`lr-${e.entryId}`} className="text-[12px] text-text-muted">
              <span className="text-text-secondary">Revue</span> · {e.sessionTitle}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/actions"
        className="gigi-focus mt-4 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Centre d&apos;action →
      </Link>
    </section>
  );
}
