"use client";

import { useState } from "react";
import type { CommandPackCategory } from "@/modules/executionReadiness";
import {
  COMMAND_PACK_TEMPLATES,
  createCommandPackFromTemplate,
} from "@/modules/executionReadiness";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";

interface CommandPackTemplateGalleryProps {
  onCreated: (packId: string) => void;
}

export function CommandPackTemplateGallery({ onCreated }: CommandPackTemplateGalleryProps) {
  const [previewId, setPreviewId] = useState<CommandPackCategory | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const preview = previewId
    ? COMMAND_PACK_TEMPLATES.find((t) => t.id === previewId)
    : null;

  function handlePrepare(templateId: CommandPackCategory) {
    const pack = createCommandPackFromTemplate(templateId);
    if (pack) {
      setMsg(`Pack préparé : ${pack.title}`);
      onCreated(pack.id);
    } else {
      setMsg("Impossible de préparer le pack.");
    }
  }

  return (
    <section className="mb-8">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Modèles disponibles
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COMMAND_PACK_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="rounded-lg border border-border/40 bg-surface-2/10 p-4"
          >
            <p className="text-[13px] font-medium text-text-primary">{template.title}</p>
            <p className="mt-1 text-[12px] text-text-secondary">{template.description}</p>
            <div className="mt-2">
              <ExecutionRiskBadge level={template.riskLevel} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePrepare(template.id)}
                className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
              >
                Préparer ce pack
              </button>
              <button
                type="button"
                onClick={() => setPreviewId(template.id === previewId ? null : template.id)}
                className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
              >
                Voir le modèle
              </button>
            </div>
          </div>
        ))}
      </div>
      {preview && (
        <div className="mt-4 rounded-lg border border-indigo-500/25 bg-indigo-500/5 p-4">
          <p className="text-[12px] font-medium text-text-primary">{preview.title}</p>
          <p className="mt-1 text-[12px] text-text-secondary">{preview.humanGoal}</p>
          <p className="mt-2 text-[11.5px] text-text-muted">
            {preview.commands.length} commande(s) · {preview.preflightChecklist.length} item(s)
            pré-vol
          </p>
        </div>
      )}
      {msg && <p className="mt-3 text-[11.5px] text-text-muted">{msg}</p>}
    </section>
  );
}
