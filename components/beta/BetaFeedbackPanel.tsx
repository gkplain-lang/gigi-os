"use client";

import { useCallback, useState } from "react";
import {
  addBetaFeedback,
  BETA_FEEDBACK_TYPE_LABELS,
  deleteBetaFeedback,
  listBetaFeedback,
  type BetaFeedbackType,
} from "@/modules/beta";
import { REFINED_EMPTY_STATES } from "@/modules/dailyUseRefinement";

interface BetaFeedbackPanelProps {
  /** Pre-fill route context */
  defaultRoute?: string;
  compact?: boolean;
}

export function BetaFeedbackPanel({ defaultRoute, compact }: BetaFeedbackPanelProps) {
  const [type, setType] = useState<BetaFeedbackType>("friction");
  const [text, setText] = useState("");
  const [route, setRoute] = useState(defaultRoute ?? "");
  const [moduleName, setModuleName] = useState("");
  const [missionId, setMissionId] = useState("");
  const [entries, setEntries] = useState(() => listBetaFeedback());
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setEntries(listBetaFeedback());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addBetaFeedback({
        type,
        text,
        route: route || undefined,
        module: moduleName || undefined,
        missionId: missionId || undefined,
      });
      setText("");
      setMessage("Feedback enregistré localement — aucun envoi externe.");
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleDelete = (id: string) => {
    deleteBetaFeedback(id);
    refresh();
  };

  const panelClass = compact ? "mt-3" : "mt-4";

  const fieldClass = compact
    ? undefined
    : "gigi-field";

  return (
    <div className={panelClass}>
      {!compact && (
        <p className="gigi-dev-label mb-3">Feedback bêta (local)</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <label className={compact ? undefined : "gigi-field-label"}>
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BetaFeedbackType)}
            className={fieldClass}
            style={compact ? {
              display: "block", marginTop: 4, width: "100%", padding: "8px 10px",
              borderRadius: 8, border: "1px solid #2a2f38", background: "#0f1115",
              color: "#f4f4f5", fontSize: 13,
            } : undefined}
          >
            {(Object.keys(BETA_FEEDBACK_TYPE_LABELS) as BetaFeedbackType[]).map((key) => (
              <option key={key} value={key}>
                {BETA_FEEDBACK_TYPE_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <label className={compact ? undefined : "gigi-field-label"}>
          Description
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={3}
            placeholder="Décris la friction, le bug ou l'idée…"
            className={fieldClass}
            style={compact ? {
              display: "block", marginTop: 4, width: "100%", padding: "8px 10px",
              borderRadius: 8, border: "1px solid #2a2f38", background: "#0f1115",
              color: "#f4f4f5", fontSize: 13, resize: "vertical",
            } : { resize: "vertical" }}
          />
        </label>

        {!compact && (
          <>
            <label className="gigi-field-label">
              Route (optionnel)
              <input
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder="/conversation"
                className="gigi-field"
              />
            </label>
            <label className="gigi-field-label">
              Module (optionnel)
              <input
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="agents, automation…"
                className="gigi-field"
              />
            </label>
            <label className="gigi-field-label">
              Mission ID (optionnel)
              <input
                value={missionId}
                onChange={(e) => setMissionId(e.target.value)}
                className="gigi-field"
              />
            </label>
          </>
        )}

        <button
          type="submit"
          className={compact ? undefined : "gigi-btn-primary gigi-focus self-start rounded-lg px-4 py-2 text-[13px] font-medium"}
          style={compact ? {
            alignSelf: "flex-start", padding: "8px 14px", borderRadius: 8,
            border: "1px solid #3f3f46", background: "#27272a", color: "#f4f4f5",
            fontSize: 13, cursor: "pointer",
          } : undefined}
        >
          Enregistrer localement
        </button>
      </form>

      {message && (
        <p className={`mt-2.5 text-[12px] ${compact ? "" : "text-ok"}`} style={compact ? { color: "#9b9ba1" } : undefined}>
          {message}
        </p>
      )}

      <p className="mt-3 text-[11px] italic text-text-secondary">
        Stockage localStorage uniquement — pas de Supabase, pas d&apos;API externe.
      </p>

      {entries.length === 0 && (
        <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">
          {REFINED_EMPTY_STATES.feedbackEntries.body}
        </p>
      )}

      {entries.length > 0 && (
        <div className="mt-4">
          <p className="gigi-dev-label">Entrées ({entries.length})</p>
          <ul className="mt-2 list-none space-y-2 p-0">
            {entries.slice(0, compact ? 5 : 20).map((entry) => (
              <li
                key={entry.id}
                className={compact ? undefined : "gigi-panel-subtle rounded-lg p-2.5 text-[12px] text-text-secondary"}
                style={compact ? {
                  marginTop: 8, padding: 10, borderRadius: 8, border: "1px solid #2a2f38",
                  background: "#0f1115", fontSize: 12, color: "#a1a1aa",
                } : undefined}
              >
                <div className="flex justify-between gap-2">
                  <span className="text-text-muted">
                    {BETA_FEEDBACK_TYPE_LABELS[entry.type]} ·{" "}
                    {new Date(entry.createdAt).toLocaleString("fr-FR")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="text-[11px] text-text-muted transition-colors hover:text-text-secondary"
                    style={compact ? { background: "none", border: "none", cursor: "pointer" } : undefined}
                  >
                    Supprimer
                  </button>
                </div>
                <p className="mt-1.5 text-text-primary">{entry.text}</p>
                {(entry.route || entry.module) && (
                  <p className="mt-1 text-[11px] text-text-muted">
                    {[entry.route, entry.module].filter(Boolean).join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
