"use client";

import type { ManualExecutionPacket } from "@/modules/executionReadiness";
import { getSandboxConnectorById } from "@/modules/executionReadiness";
import { ManualBridgeStatusBadge } from "./ManualBridgeStatusBadge";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { ManualBridgePacketActions } from "./ManualBridgePacketActions";

interface ManualBridgePacketDetailProps {
  packet: ManualExecutionPacket;
  onUpdated: () => void;
}

function CopyBlock({ label, text }: { label: string; text: string }) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-lg border border-border/40 bg-surface-2/10 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="gigi-focus text-[11px] font-medium text-accent-soft hover:underline"
        >
          Copier l&apos;instruction
        </button>
      </div>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[12px] text-text-secondary">
        {text}
      </pre>
    </div>
  );
}

export function ManualBridgePacketDetail({ packet, onUpdated }: ManualBridgePacketDetailProps) {
  const connector = getSandboxConnectorById(packet.connectorId);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/80">
          Paquet d&apos;exécution manuelle
        </p>
        <h2 className="mt-1 text-[18px] font-semibold text-text-primary">{packet.title}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{packet.humanGoal}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <ExecutionRiskBadge level={packet.riskLevel} />
        <ManualBridgeStatusBadge status={packet.status} />
        <span className="rounded-md border border-border/50 px-2 py-0.5 text-[11px] text-text-muted">
          {connector?.label ?? packet.connectorId} · connecteur non actif
        </span>
      </div>

      {packet.expiresAt && (
        <p className="text-[12px] text-amber-200/90">
          Expire le {new Date(packet.expiresAt).toLocaleString("fr-FR")} — paquet non permanent
        </p>
      )}

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Checklist pré-vol
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-[12.5px] text-text-secondary">
          {packet.preflightChecklist.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Étapes manuelles
        </p>
        <ol className="mt-2 space-y-1.5 text-[12.5px] text-text-secondary">
          {packet.manualSteps.map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-medium text-accent-soft">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {packet.copyableCommands.map((cmd, i) => (
        <CopyBlock key={`cmd-${i}`} label={`Commande / texte copiable ${i + 1}`} text={cmd} />
      ))}

      {packet.copyableInstructions.length > 0 && (
        <CopyBlock
          label="Instructions"
          text={packet.copyableInstructions.join("\n\n")}
        />
      )}

      {packet.requiredSecretsNames.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Secrets requis (noms uniquement — jamais stockés dans Gigi)
          </p>
          <ul className="mt-2 text-[12px] text-text-secondary">
            {packet.requiredSecretsNames.map((name) => (
              <li key={name}>· {name}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Rollback
        </p>
        <ul className="mt-2 list-inside list-disc text-[12.5px] text-text-secondary">
          {packet.rollbackPlan.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Résultat attendu
        </p>
        <p className="mt-2 text-[12.5px] text-text-secondary">{packet.expectedOutcome}</p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Journal local
        </p>
        <ul className="mt-2 space-y-2">
          {packet.auditTrail.map((entry) => (
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

      <p className="text-[11.5px] italic text-amber-200/85">{packet.disclaimer}</p>

      <ManualBridgePacketActions packet={packet} onUpdated={onUpdated} />
    </div>
  );
}
