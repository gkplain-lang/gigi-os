"use client";

import type { CommandPackCommand } from "@/modules/executionReadiness";
import { CommandPackCommandCard } from "./CommandPackCommandCard";

interface CommandPackCommandListProps {
  commands: CommandPackCommand[];
  onCommandCopied?: (commandId: string) => void;
  title?: string;
}

export function CommandPackCommandList({
  commands,
  onCommandCopied,
  title = "Commandes à copier",
}: CommandPackCommandListProps) {
  if (commands.length === 0) {
    return (
      <p className="text-[12.5px] text-text-muted">Aucune commande dans ce pack.</p>
    );
  }

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </p>
      <div className="mt-3 space-y-3">
        {commands.map((cmd) => (
          <CommandPackCommandCard key={cmd.id} command={cmd} onCopied={onCommandCopied} />
        ))}
      </div>
    </div>
  );
}
