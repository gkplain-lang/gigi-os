"use client";

import type { CommandPack } from "@/modules/executionReadiness";
import {
  getEffectiveCommandPackStatus,
  getSandboxConnectorById,
  recordCommandCopied,
} from "@/modules/executionReadiness";
import { CommandPackStatusBadge } from "./CommandPackStatusBadge";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { CommandPackCommandList } from "./CommandPackCommandList";
import { CommandPackActions } from "./CommandPackActions";

interface CommandPackDetailProps {
  pack: CommandPack;
  onUpdated: () => void;
}

export function CommandPackDetail({ pack, onUpdated }: CommandPackDetailProps) {
  const connector = getSandboxConnectorById(pack.connectorId);
  const status = getEffectiveCommandPackStatus(pack);

  function handleCommandCopied(commandId: string) {
    recordCommandCopied(pack.id, commandId);
    onUpdated();
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/80">
          Pack de commandes · V4.3
        </p>
        <h2 className="mt-1 text-[18px] font-semibold text-text-primary">{pack.title}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{pack.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <ExecutionRiskBadge level={pack.riskLevel} />
        <CommandPackStatusBadge status={status} />
        <span className="rounded-md border border-border/50 px-2 py-0.5 text-[11px] text-text-muted">
          {connector?.label ?? pack.connectorId} · sandbox
        </span>
      </div>

      {pack.expiresAt && (
        <p className="text-[12px] text-amber-200/90">
          Expire le {new Date(pack.expiresAt).toLocaleString("fr-FR")} — pack non permanent
        </p>
      )}

      {pack.sourceManualPacketId && (
        <p className="text-[12px] text-text-muted">
          Source pont manuel : {pack.sourceManualPacketId.slice(0, 20)}…
        </p>
      )}

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Objectif humain
        </p>
        <p className="mt-2 text-[12.5px] text-text-secondary">{pack.humanGoal}</p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Hypothèses d&apos;environnement
        </p>
        <ul className="mt-2 list-inside list-disc text-[12.5px] text-text-secondary">
          {pack.environmentAssumptions.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Prérequis
        </p>
        <ul className="mt-2 list-inside list-disc text-[12.5px] text-text-secondary">
          {pack.prerequisites.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Checklist avant lancement
        </p>
        <ul className="mt-2 list-inside list-disc text-[12.5px] text-text-secondary">
          {pack.preflightChecklist.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <CommandPackCommandList commands={pack.commands} onCommandCopied={handleCommandCopied} />

      {pack.knownRisks.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Risques connus
          </p>
          <ul className="mt-2 list-inside list-disc text-[12.5px] text-red-200/80">
            {pack.knownRisks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {pack.rollbackCommands.length > 0 && (
        <CommandPackCommandList commands={pack.rollbackCommands} title="Rollback manuel" />
      )}

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Checklist après lancement
        </p>
        <ul className="mt-2 list-inside list-disc text-[12.5px] text-text-secondary">
          {pack.postRunChecklist.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Résultat attendu
        </p>
        <p className="mt-2 text-[12.5px] text-text-secondary">{pack.expectedOutcome}</p>
      </div>

      {pack.requiredSecretsNames.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Secrets requis (noms uniquement)
          </p>
          <ul className="mt-2 text-[12px] text-text-secondary">
            {pack.requiredSecretsNames.map((name) => (
              <li key={name}>· {name}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Journal local
        </p>
        <ul className="mt-2 space-y-2">
          {pack.auditTrail.map((entry) => (
            <li
              key={entry.id}
              className="rounded border border-border/30 px-3 py-2 text-[11.5px] text-text-muted"
            >
              <span className="text-text-secondary">{entry.type}</span> ·{" "}
              {new Date(entry.at).toLocaleString("fr-FR")} — {entry.message}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11.5px] italic text-amber-200/85">{pack.disclaimer}</p>

      <CommandPackActions pack={pack} onUpdated={onUpdated} />
    </div>
  );
}
