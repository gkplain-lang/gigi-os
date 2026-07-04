"use client";

import { useState } from "react";
import type { AutomationProposal } from "@/modules/automation/types";
import {
  confirmAutomationDryRunLocally,
  formatPermissionsList,
  V07_NO_EXECUTION_MESSAGE,
} from "@/modules/automation";
import { confirmationStatusLabel } from "@/modules/agents/confirmation";
import type { ConfirmationStatus } from "@/modules/agents/types";

interface AutomationProposalCardProps {
  proposal: AutomationProposal;
}

export function AutomationProposalCard({ proposal }: AutomationProposalCardProps) {
  const [status, setStatus] = useState<ConfirmationStatus>(
    proposal.confirmationStatus ?? (proposal.blockedReason ? "blocked" : "pending_confirmation")
  );
  const [showRisks, setShowRisks] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  const canPrepare = status === "pending_confirmation" || status === "blocked";

  const handlePrepare = () => {
    const result = confirmAutomationDryRunLocally(proposal);
    setStatus("confirmed_dry_run");
    setSimulationMessage(result.summary);
  };

  const handleCancel = () => {
    setStatus("cancelled");
    setSimulationMessage(null);
  };

  return (
    <div className="mt-2.5 rounded-lg border border-border bg-surface/50 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[13.5px] font-medium text-text-primary">{proposal.title}</p>
        <span className="rounded-md border border-border px-2 py-0.5 text-[10.5px] uppercase tracking-wide text-text-muted">
          {confirmationStatusLabel(status)}
        </span>
      </div>

      <p className="mt-1 text-[12.5px] leading-relaxed text-text-muted">{proposal.description}</p>

      <dl className="mt-2.5 space-y-1 text-[12px] text-text-muted/90">
        <div className="flex gap-2">
          <dt className="shrink-0 text-text-muted">Déclencheur</dt>
          <dd className="text-text-secondary">{proposal.triggerDescription}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-text-muted">Type</dt>
          <dd className="text-text-secondary">{proposal.triggerType}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-text-muted">Permissions</dt>
          <dd className="text-text-secondary">{formatPermissionsList(proposal.requiredPermissions)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-text-muted">Risque</dt>
          <dd className="text-text-secondary">{proposal.riskLevel}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-text-muted">Résultat attendu</dt>
          <dd className="text-text-secondary">{proposal.expectedOutcome}</dd>
        </div>
      </dl>

      {showRisks && (
        <div className="mt-2.5 rounded-md border border-border/80 bg-surface/30 p-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Étapes du plan</p>
          <ul className="mt-1 space-y-0.5 text-[12px] text-text-secondary">
            {proposal.steps.map((step) => (
              <li key={step}>· {step}</li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Ne sera PAS fait
          </p>
          <ul className="mt-1 space-y-0.5 text-[12px] text-text-muted">
            {proposal.blockedActions.map((a) => (
              <li key={a}>· {a}</li>
            ))}
          </ul>
        </div>
      )}

      {proposal.blockedReason && (
        <p className="mt-2 text-[12.5px] leading-relaxed text-amber-200/90">{proposal.blockedReason}</p>
      )}

      {simulationMessage && status === "confirmed_dry_run" && (
        <p className="mt-2 rounded-md border border-[rgba(155,181,159,0.35)] bg-[rgba(155,181,159,0.1)] px-2.5 py-2 text-[12.5px] text-text-secondary">
          {simulationMessage}
        </p>
      )}

      {status === "cancelled" && (
        <p className="mt-2 text-[12.5px] text-text-muted">Automatisation annulée — aucun plan exécuté.</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {canPrepare && (
          <button
            type="button"
            onClick={handlePrepare}
            className="gigi-chip gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            {proposal.blockedReason ? "Préparer le plan" : "Préparer en dry-run"}
          </button>
        )}
        {(status === "pending_confirmation" || status === "blocked") && (
          <button
            type="button"
            onClick={handleCancel}
            className="gigi-chip gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            Annuler
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowRisks((v) => !v)}
          className="gigi-chip gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {showRisks ? "Masquer les risques" : "Voir les risques"}
        </button>
      </div>

      <p className="mt-2.5 text-[11px] text-text-muted/70">{V07_NO_EXECUTION_MESSAGE}</p>
    </div>
  );
}
