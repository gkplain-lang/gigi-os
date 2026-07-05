"use client";

import Link from "next/link";
import type { GuidedProjectActionFlow } from "@/modules/executionExperience/guidedActionTypes";
import { GUIDED_ACTION_CATEGORY_LABELS } from "@/modules/executionExperience/guidedActionTypes";
import { GuidedActionFlowStepper } from "./GuidedActionFlowStepper";
import { GuidedActionFlowActions } from "./GuidedActionFlowActions";
import { GuidedActionStatusBadge } from "./GuidedActionStatusBadge";
import { GuidedActionDisclaimer } from "./GuidedActionDisclaimer";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";

interface GuidedActionFlowDetailProps {
  flow: GuidedProjectActionFlow;
  onUpdated: () => void;
}

export function GuidedActionFlowDetail({ flow, onUpdated }: GuidedActionFlowDetailProps) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[16px] font-semibold text-text-primary">{flow.title}</h3>
          <GuidedActionStatusBadge status={flow.status} />
        </div>
        <p className="mt-2 text-[13px] text-text-secondary">{flow.description}</p>
        <dl className="mt-3 grid gap-2 text-[12px] sm:grid-cols-2">
          <div>
            <dt className="text-text-muted">Objectif</dt>
            <dd className="text-text-primary">{flow.actionGoal}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Catégorie</dt>
            <dd className="text-text-primary">{GUIDED_ACTION_CATEGORY_LABELS[flow.actionCategory]}</dd>
          </div>
          {flow.projectName && (
            <div>
              <dt className="text-text-muted">Projet</dt>
              <dd className="text-text-primary">{flow.projectName}</dd>
            </div>
          )}
          <div>
            <dt className="text-text-muted">Risque</dt>
            <dd>
              <ExecutionRiskBadge level={flow.riskLevel} />
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Parcours étape par étape
        </p>
        <GuidedActionFlowStepper flow={flow} />
      </div>

      {(flow.linkedRequestId ||
        flow.linkedManualPacketId ||
        flow.linkedCommandPackId ||
        flow.linkedReviewSessionId) && (
        <div className="rounded-lg border border-border/40 bg-surface-2/10 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Liens locaux
          </p>
          <ul className="mt-2 space-y-1 text-[12px]">
            {flow.linkedRequestId && (
              <li>
                <Link href="/actions" className="text-accent-soft hover:underline">
                  Demande · {flow.linkedRequestId.slice(0, 12)}…
                </Link>
              </li>
            )}
            {flow.linkedManualPacketId && (
              <li>
                <Link href="/manual-bridge" className="text-accent-soft hover:underline">
                  Pont · {flow.linkedManualPacketId.slice(0, 12)}…
                </Link>
              </li>
            )}
            {flow.linkedCommandPackId && (
              <li>
                <Link href={`/command-packs?pack=${flow.linkedCommandPackId}`} className="text-accent-soft hover:underline">
                  Pack · {flow.linkedCommandPackId.slice(0, 12)}…
                </Link>
              </li>
            )}
            {flow.linkedReviewSessionId && (
              <li>
                <Link href={`/local-review?session=${flow.linkedReviewSessionId}`} className="text-accent-soft hover:underline">
                  Revue · {flow.linkedReviewSessionId.slice(0, 12)}…
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      <GuidedActionFlowActions flow={flow} onUpdated={onUpdated} />

      {flow.auditTrail.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Journal local
          </p>
          <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-[11px] text-text-muted">
            {flow.auditTrail.slice(0, 8).map((e) => (
              <li key={e.id}>
                {e.at.slice(0, 16).replace("T", " ")} · {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <GuidedActionDisclaimer />
    </div>
  );
}
