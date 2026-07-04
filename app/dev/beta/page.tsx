"use client";

import { BetaDevPanel } from "./BetaDevPanel";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevBetaPage() {
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
          Dev · Beta
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
          Préparation bêta privée V0.9
        </h1>
        <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6, color: "#71767f" }}>
          Checklist, garde-fous et feedback local — aucune action externe automatique.
        </p>

        <BetaDevPanel />
      </div>
    </main>
  );
}
