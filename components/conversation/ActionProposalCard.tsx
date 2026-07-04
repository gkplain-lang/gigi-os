"use client";

import { useState } from "react";
import type { ActionProposal } from "@/modules/agents/types";
import {
  buildConfirmationViewModel,
  canConfirmDryRun,
  cancelConfirmation,
  confirmDryRunLocally,
  confirmationStatusLabel,
  V062_NO_EXTERNAL_MESSAGE,
} from "@/modules/agents/confirmation";

interface ActionProposalCardProps {
  proposal: ActionProposal;
  agentBlockedMessage?: string;
}

export function ActionProposalCard({ proposal, agentBlockedMessage }: ActionProposalCardProps) {
  const [status, setStatus] = useState(
    proposal.confirmationStatus ?? (proposal.blockedReason ? "blocked" : "pending_confirmation")
  );
  const [showRisks, setShowRisks] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  const view = buildConfirmationViewModel(proposal, status);
  const canPrepare = canConfirmDryRun(status);

  const handlePrepareDryRun = () => {
    const record = confirmDryRunLocally(proposal);
    setStatus("confirmed_dry_run");
    setSimulationMessage(record.simulationMessage ?? record.simulation?.summary ?? null);
  };

  const handleCancel = () => {
    cancelConfirmation(proposal.id);
    setStatus("cancelled");
    setSimulationMessage(null);
  };

  return (
    <div className="mt-2.5 rounded-lg border border-border bg-surface/50 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[13.5px] font-medium text-text-primary">{view.proposal.title}</p>
        <span className="rounded-md border border-border px-2 py-0.5 text-[10.5px] uppercase tracking-wide text-text-muted">
          {confirmationStatusLabel(status)}
        </span>
      </div>

      <p className="mt-1 text-[12.5px] leading-relaxed text-text-muted">{view.why}</p>

      <dl className="mt-2.5 space-y-1 text-[12px] text-text-muted/90">
        <div className="flex gap-2">
          <dt className="shrink-0 text-text-muted">Projet</dt>
          <dd className="text-text-secondary">{view.projectLabel}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-text-muted">Résultat attendu</dt>
          <dd className="text-text-secondary">{view.proposal.expectedOutcome}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-text-muted">Risque</dt>
          <dd className="text-text-secondary">{view.proposal.riskLevel}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-text-muted">Statut</dt>
          <dd className="text-text-secondary">{view.dryRunLabel}</dd>
        </div>
        {view.confirmationRequired && (
          <div className="flex gap-2">
            <dt className="shrink-0 text-text-muted">Confirmation</dt>
            <dd className="text-text-secondary">Requise (dry-run uniquement)</dd>
          </div>
        )}
      </dl>

      {showRisks && (
        <div className="mt-2.5 rounded-md border border-border/80 bg-surface/30 p-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Ce qui sera fait
          </p>
          <ul className="mt-1 space-y-0.5 text-[12px] text-text-secondary">
            {view.willDo.map((line) => (
              <li key={line}>· {line}</li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">
            Ce qui ne sera PAS fait
          </p>
          <ul className="mt-1 space-y-0.5 text-[12px] text-text-muted">
            {view.willNotDo.map((line) => (
              <li key={line}>· {line}</li>
            ))}
          </ul>
        </div>
      )}

      {view.blockedReason && (
        <p className="mt-2 text-[12.5px] leading-relaxed text-amber-200/90">{view.blockedReason}</p>
      )}
      {agentBlockedMessage && view.blockedReason && (
        <p className="mt-1.5 text-[12px] font-medium text-text-secondary">{agentBlockedMessage}</p>
      )}

      {simulationMessage && status === "confirmed_dry_run" && (
        <p className="mt-2 rounded-md border border-[rgba(155,181,159,0.35)] bg-[rgba(155,181,159,0.1)] px-2.5 py-2 text-[12.5px] text-text-secondary">
          {simulationMessage}
        </p>
      )}

      {status === "cancelled" && (
        <p className="mt-2 text-[12.5px] text-text-muted">Proposition annulée — aucune action lancée.</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
            {canPrepare && (
          <button
            type="button"
            onClick={handlePrepareDryRun}
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

      <p className="mt-2.5 text-[11px] text-text-muted/70">{V062_NO_EXTERNAL_MESSAGE}</p>
    </div>
  );
}
