"use client";

import type { CommandPackCommand } from "@/modules/executionReadiness";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";

interface CommandPackCommandCardProps {
  command: CommandPackCommand;
  onCopied?: (commandId: string) => void;
}

export function CommandPackCommandCard({ command, onCopied }: CommandPackCommandCardProps) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command.commandText);
      onCopied?.(command.id);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-lg border border-border/40 bg-surface-2/10 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[13px] font-medium text-text-primary">{command.label}</p>
          {command.requiresHumanEdit && (
            <p className="mt-0.5 text-[11px] text-amber-200/90">
              Édition humaine requise avant copie
            </p>
          )}
        </div>
        <ExecutionRiskBadge level={command.riskLevel} />
      </div>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded border border-border/30 bg-black/20 p-3 text-[12px] text-text-secondary">
        {command.commandText}
      </pre>
      <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">{command.explanation}</p>
      {command.placeholders.length > 0 && (
        <p className="mt-2 text-[11.5px] text-text-muted">
          Placeholders : {command.placeholders.join(", ")}
        </p>
      )}
      {command.expectedOutput && (
        <p className="mt-1 text-[11.5px] text-text-muted">Sortie attendue : {command.expectedOutput}</p>
      )}
      {command.failureSigns && (
        <p className="mt-1 text-[11.5px] text-red-200/80">Signes d&apos;échec : {command.failureSigns}</p>
      )}
      {command.rollbackHint && (
        <p className="mt-1 text-[11.5px] text-amber-200/85">Rollback : {command.rollbackHint}</p>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="gigi-btn-secondary gigi-focus mt-3 rounded-lg px-3 py-1.5 text-[12px] font-medium"
      >
        Copier la commande
      </button>
    </div>
  );
}
