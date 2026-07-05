"use client";

import Link from "next/link";
import {
  EXECUTION_PERMISSION_STATUS_LABELS,
  listActiveExecutionReadinessRequests,
} from "@/modules/executionReadiness";
import { ExecutionRiskBadge } from "./ExecutionRiskBadge";

export function ExecutionReadinessHomeHint() {
  const active = listActiveExecutionReadinessRequests(1);
  const top = active[0];

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] px-4 py-3">
      <p className="text-[12px] leading-relaxed text-text-secondary">
        <span className="font-medium text-violet-200/90">Gigi V4 · </span>
        Certaines actions pourront bientôt demander une permission d&apos;exécution contrôlée.
        {top ? (
          <>
            {" "}
            Demande active :{" "}
            <span className="text-text-primary">{top.title.replace(/^Readiness · /, "")}</span>
            {" · "}
            {EXECUTION_PERMISSION_STATUS_LABELS[top.permissionStatus]}
            {" · "}
            <ExecutionRiskBadge level={top.riskLevel} className="ml-1 align-middle" />
          </>
        ) : (
          " Aucune demande active pour l'instant."
        )}
      </p>
      <Link
        href="/actions"
        className="mt-2 inline-flex text-[12px] font-medium text-accent-soft underline-offset-2 hover:underline"
      >
        Préparation exécution sur /actions →
      </Link>
    </div>
  );
}
