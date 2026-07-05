"use client";

import Link from "next/link";
import type { LocalReviewSession } from "@/modules/executionReadiness";
import { saveReviewInput } from "@/modules/executionReadiness";
import { LocalReviewStatusBadge } from "./LocalReviewStatusBadge";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { LocalReviewInputBox } from "./LocalReviewInputBox";
import { LocalReviewSignalReport } from "./LocalReviewSignalReport";
import { LocalReviewActions } from "./LocalReviewActions";

export function LocalReviewSessionDetail({
  session,
  onUpdated,
}: {
  session: LocalReviewSession;
  onUpdated: () => void;
}) {
  function handleSaveInput(text: string, confirmedNoSecrets: boolean) {
    saveReviewInput(session.id, text, "Résultat collé", confirmedNoSecrets);
    onUpdated();
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-200/80">
          Revue locale · V4.4
        </p>
        <h2 className="mt-1 text-[18px] font-semibold text-text-primary">{session.title}</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <LocalReviewStatusBadge status={session.status} />
        <ExecutionRiskBadge level={session.riskLevel} />
        <span className="rounded-md border border-border/50 px-2 py-0.5 text-[11px] text-text-muted">
          confiance {session.confidence} · statut probable
        </span>
      </div>

      {session.sourceCommandPackId && (
        <p className="text-[12px] text-text-muted">
          Source pack :{" "}
          <Link
            href={`/command-packs?pack=${session.sourceCommandPackId}`}
            className="text-accent-soft hover:underline"
          >
            {session.sourceCommandPackId.slice(0, 20)}…
          </Link>
        </p>
      )}

      <LocalReviewInputBox onSave={handleSaveInput} disabled={session.status === "archived"} />

      {session.sanitizedPreview && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Aperçu (sanitisé)
          </p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded border border-border/30 bg-black/20 p-3 text-[12px] text-text-secondary">
            {session.sanitizedPreview}
          </pre>
        </div>
      )}

      <LocalReviewSignalReport session={session} />

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Vérifications humaines
        </p>
        <ul className="mt-2 list-inside list-disc text-[12.5px] text-text-secondary">
          {session.humanChecks.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Prochaines étapes recommandées
        </p>
        <ul className="mt-2 list-inside list-disc text-[12.5px] text-text-secondary">
          {session.recommendedNextSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Journal local
        </p>
        <ul className="mt-2 space-y-2">
          {session.auditTrail.map((entry) => (
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

      <p className="text-[11.5px] italic text-amber-200/85">{session.disclaimer}</p>

      <LocalReviewActions session={session} onUpdated={onUpdated} />
    </div>
  );
}
