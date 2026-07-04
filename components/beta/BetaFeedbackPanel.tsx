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

  const panelStyle = compact
    ? { marginTop: 12 }
    : { marginTop: 16, border: "1px solid #2a2f38", background: "#171a20", borderRadius: 12, padding: 20 };

  return (
    <div style={panelStyle}>
      {!compact && (
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Feedback bêta (local)
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label style={{ fontSize: 12, color: "#71767f" }}>
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BetaFeedbackType)}
            style={{
              display: "block",
              marginTop: 4,
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #2a2f38",
              background: "#0f1115",
              color: "#f4f4f5",
              fontSize: 13,
            }}
          >
            {(Object.keys(BETA_FEEDBACK_TYPE_LABELS) as BetaFeedbackType[]).map((key) => (
              <option key={key} value={key}>
                {BETA_FEEDBACK_TYPE_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontSize: 12, color: "#71767f" }}>
          Description
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={3}
            placeholder="Décris la friction, le bug ou l'idée…"
            style={{
              display: "block",
              marginTop: 4,
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #2a2f38",
              background: "#0f1115",
              color: "#f4f4f5",
              fontSize: 13,
              resize: "vertical",
            }}
          />
        </label>

        {!compact && (
          <>
            <label style={{ fontSize: 12, color: "#71767f" }}>
              Route (optionnel)
              <input
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder="/conversation"
                style={{
                  display: "block",
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #2a2f38",
                  background: "#0f1115",
                  color: "#f4f4f5",
                  fontSize: 13,
                }}
              />
            </label>
            <label style={{ fontSize: 12, color: "#71767f" }}>
              Module (optionnel)
              <input
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="agents, automation…"
                style={{
                  display: "block",
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #2a2f38",
                  background: "#0f1115",
                  color: "#f4f4f5",
                  fontSize: 13,
                }}
              />
            </label>
            <label style={{ fontSize: 12, color: "#71767f" }}>
              Mission ID (optionnel)
              <input
                value={missionId}
                onChange={(e) => setMissionId(e.target.value)}
                style={{
                  display: "block",
                  marginTop: 4,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #2a2f38",
                  background: "#0f1115",
                  color: "#f4f4f5",
                  fontSize: 13,
                }}
              />
            </label>
          </>
        )}

        <button
          type="submit"
          style={{
            alignSelf: "flex-start",
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #3f3f46",
            background: "#27272a",
            color: "#f4f4f5",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Enregistrer localement
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 10, fontSize: 12, color: "#9b9ba1" }}>{message}</p>
      )}

      <p style={{ marginTop: 12, fontSize: 11, color: "#71767f", fontStyle: "italic" }}>
        Stockage localStorage uniquement — pas de Supabase, pas d&apos;API externe.
      </p>

      {entries.length === 0 && (
        <p style={{ marginTop: 12, fontSize: 13, color: "#71767f", lineHeight: 1.5 }}>
          {REFINED_EMPTY_STATES.feedbackEntries.body}
        </p>
      )}

      {entries.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#71767f" }}>
            Entrées ({entries.length})
          </p>
          <ul style={{ marginTop: 8, padding: 0, listStyle: "none" }}>
            {entries.slice(0, compact ? 5 : 20).map((entry) => (
              <li
                key={entry.id}
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #2a2f38",
                  background: "#0f1115",
                  fontSize: 12,
                  color: "#a1a1aa",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ color: "#71767f" }}>
                    {BETA_FEEDBACK_TYPE_LABELS[entry.type]} ·{" "}
                    {new Date(entry.createdAt).toLocaleString("fr-FR")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#71767f",
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                  >
                    Supprimer
                  </button>
                </div>
                <p style={{ marginTop: 6, color: "#e4e4e7" }}>{entry.text}</p>
                {(entry.route || entry.module) && (
                  <p style={{ marginTop: 4, fontSize: 11, color: "#71767f" }}>
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
