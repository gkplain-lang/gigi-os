"use client";

import { ExecutionDevPanel } from "./ExecutionDevPanel";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevExecutionPage() {
  if (IS_PROD) {
    return (
      <div style={{ padding: "2rem", color: "#a1a1aa", fontFamily: "system-ui" }}>
        Page de développement indisponible en production.
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f1115",
        color: "#f4f4f5",
        fontFamily: "system-ui, sans-serif",
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "#71767f" }}>
          Dev · Execution
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
          Boucle d&apos;exécution mission
        </h1>
        <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6, color: "#71767f" }}>
          Diagnostic local — aucune sync, aucun agent, aucune clé exposée.
        </p>

        <ExecutionDevPanel />
      </div>
    </main>
  );
}
