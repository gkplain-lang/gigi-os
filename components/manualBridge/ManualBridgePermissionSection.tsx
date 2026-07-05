"use client";

import Link from "next/link";
import type { ExecutionReadinessRequest } from "@/modules/executionReadiness";
import { createManualPacketFromRequest } from "@/modules/executionReadiness";

interface ManualBridgePermissionSectionProps {
  request: ExecutionReadinessRequest;
  onUpdated?: () => void;
}

export function ManualBridgePermissionSection({
  request,
  onUpdated,
}: ManualBridgePermissionSectionProps) {
  const canPrepare = ["approved_for_dry_run", "awaiting_user_approval", "needs_review", "draft"].includes(
    request.permissionStatus
  );

  function handlePrepare() {
    createManualPacketFromRequest(request.id);
    onUpdated?.();
  }

  return (
    <div className="mt-4 rounded-lg border border-indigo-500/25 bg-indigo-500/5 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/80">
        Pont manuel lié · V4.2
      </p>
      <p className="mt-1 text-[12.5px] text-text-secondary">
        Prépare un paquet d&apos;exécution manuelle — texte à copier, aucune exécution réelle.
      </p>
      {canPrepare ? (
        <button
          type="button"
          onClick={handlePrepare}
          className="gigi-btn-primary gigi-focus mt-3 rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Préparer un paquet manuel
        </button>
      ) : (
        <p className="mt-2 text-[12px] text-text-muted">
          Statut non compatible — consulte le{" "}
          <Link href="/manual-bridge" className="text-accent-soft hover:underline">
            pont manuel
          </Link>
          .
        </p>
      )}
      <Link
        href="/manual-bridge"
        className="gigi-focus mt-2 inline-flex text-[12px] font-medium text-accent-soft hover:underline"
      >
        Ouvrir /manual-bridge →
      </Link>
    </div>
  );
}
