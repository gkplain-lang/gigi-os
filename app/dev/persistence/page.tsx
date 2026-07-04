"use client";

import { DevPersistencePanel } from "./DevPersistencePanel";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevPersistencePage() {
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
          Dev · Persistence
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
          Stratégie de persistance
        </h1>

        <DevPersistencePanel />

        <p style={{ marginTop: 18, fontSize: 13, lineHeight: 1.6, color: "#71767f" }}>
          V0.4.5 analyse la stratégie de persistance. Aucune donnée n&apos;est restaurée ou
          écrasée automatiquement. localStorage reste la source principale (
          <code style={{ color: "#a1a1aa" }}>gigi-os-v03-state</code>).
        </p>
      </div>
    </main>
  );
}
