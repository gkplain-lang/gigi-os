"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useGigi } from "@/components/providers/GigiProvider";
import {
  askAiBrain,
  detectRequestedProject,
  fetchAiAvailability,
  type AiBrainResponse,
} from "@/modules/ai";
import { AI_SAFETY_RULES_SUMMARY } from "@/modules/ai/safety";

const IS_PROD = process.env.NODE_ENV === "production";

const TEST_PHRASES = [
  "Que faire dans Buildy Crafts aujourd'hui ?",
  "Je veux avancer la bibliothèque Buildy Crafts",
  "Je veux gagner 500 €/mois rapidement",
  "Que dois-je faire aujourd'hui ?",
  "Que faire dans Linko aujourd'hui ?",
];

function modeLabel(mode: AiBrainResponse["mode"]): string {
  switch (mode) {
    case "ai_assisted":
      return "IA assistée";
    case "ai_unavailable":
      return "Fallback local (IA indisponible ou corrigée)";
    default:
      return "Fallback local";
  }
}

export function DevAiPanel() {
  const { state, isHydrated } = useGigi();
  const [status, setStatus] = useState<Awaited<ReturnType<typeof fetchAiAvailability>> | null>(
    null
  );
  const [input, setInput] = useState("Que faire dans Buildy Crafts aujourd'hui ?");
  const [result, setResult] = useState<AiBrainResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectedIntent = detectRequestedProject(input);

  useEffect(() => {
    void fetchAiAvailability().then(setStatus);
  }, []);

  const runTest = useCallback(async () => {
    if (!isHydrated) return;
    setBusy(true);
    setError(null);

    const response = await askAiBrain({
      userMessage: input,
      currentMission: state.mission,
      projects: state.projects,
      history: state.history.map((h) => ({
        title: h.title,
        type: h.type,
        date: h.date,
      })),
      completedMissionIds: state.completedMissionIds,
      postponedMissionIds: state.postponedMissionIds,
      rejectedMissionIds: state.rejectedMissionIds,
    });

    setResult(response);
    setBusy(false);
  }, [input, isHydrated, state]);

  return (
    <>
      <div
        style={{
          marginTop: 20,
          border: "1px solid #2a2f38",
          background: "#171a20",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Configuration IA (serveur)
        </p>
        <dl style={{ fontSize: 14, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>IA configurée</dt>
            <dd>{status?.isConfigured ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Provider</dt>
            <dd>{status?.provider ?? "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Modèle</dt>
            <dd>{status?.model ?? "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 160 }}>Disponibilité</dt>
            <dd>{status?.availability ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #2a2f38",
          background: "#171a20",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Tester cerveau IA
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #2a2f38",
            background: "#0f1115",
            color: "#f4f4f5",
            borderRadius: 8,
            padding: 10,
            fontSize: 14,
          }}
        />
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {TEST_PHRASES.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => setInput(phrase)}
              style={{
                border: "1px solid #2a2f38",
                background: "#0f1115",
                color: "#71767f",
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {phrase.slice(0, 36)}
              {phrase.length > 36 ? "…" : ""}
            </button>
          ))}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: "#71767f" }}>
          Intention détectée :{" "}
          <span style={{ color: "#a1a1aa" }}>
            {detectedIntent.intentLock ?? "globale"} ·{" "}
            {detectedIntent.requestedProjectId ?? "aucun projet verrouillé"}
          </span>
        </p>
        <button
          type="button"
          onClick={() => void runTest()}
          disabled={busy || !isHydrated}
          style={{
            marginTop: 12,
            border: "1px solid rgba(142,167,194,0.4)",
            background: "rgba(142,167,194,0.14)",
            color: "#f4f4f5",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 14,
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? "Test…" : "Tester cerveau IA"}
        </button>
        {error && <p style={{ marginTop: 10, fontSize: 13, color: "#c98f8f" }}>{error}</p>}
      </div>

      {result && (
        <div
          style={{
            marginTop: 16,
            border: "1px solid #2a2f38",
            background: "#171a20",
            borderRadius: 12,
            padding: 20,
            fontSize: 13,
            lineHeight: 1.7,
            color: "#a1a1aa",
          }}
        >
          <p>
            Mode : <span style={{ color: "#f4f4f5" }}>{modeLabel(result.mode)}</span> ({result.mode})
            · Provider : {result.provider}
          </p>
          <p>
            requestedProjectId :{" "}
            <span style={{ color: "#f4f4f5" }}>{result.requestedProjectId ?? "—"}</span>
          </p>
          <p>
            Project mismatch :{" "}
            <span style={{ color: "#f4f4f5" }}>
              {result.projectMismatchDetected ? "oui" : "non"}
            </span>
          </p>
          {result.fallbackReason && (
            <p>
              fallbackReason : <span style={{ color: "#f4f4f5" }}>{result.fallbackReason}</span>
            </p>
          )}
          <p>
            Intent : <span style={{ color: "#f4f4f5" }}>{result.intent}</span>
          </p>
          <p>
            Sécurité : {result.safety.level}
            {result.safety.requiresConfirmation ? " · confirmation requise" : ""}
          </p>
          <p style={{ marginTop: 8 }}>{result.message}</p>
          {result.recommendedMission && (
            <p style={{ marginTop: 8 }}>
              Mission : {result.recommendedMission.title} ({result.recommendedMission.projectId})
            </p>
          )}
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            {AI_SAFETY_RULES_SUMMARY.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/dev/supabase" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Supabase →
        </Link>
        <Link href="/dev/sync" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Sync →
        </Link>
        <Link href="/dev/persistence" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Persistence →
        </Link>
        <Link href="/dev/controls" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Controls →
        </Link>
        {!IS_PROD && (
          <Link href="/memory" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
            /memory →
          </Link>
        )}
      </div>
    </>
  );
}
