"use client";

import Link from "next/link";
import { BetaFeedbackPanel } from "@/components/beta/BetaFeedbackPanel";
import { V09_NO_AUTO_EXTERNAL_MESSAGE } from "@/modules/beta";

export default function FeedbackPage() {
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
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <p style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "#71767f" }}>
          Bêta privée
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>Feedback</h1>
        <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6, color: "#71767f" }}>
          Note une friction, un bug ou une idée pendant tes tests. Stockage local uniquement.
        </p>
        <p style={{ marginTop: 8, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V09_NO_AUTO_EXTERNAL_MESSAGE}
        </p>

        <BetaFeedbackPanel defaultRoute="/feedback" />

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/conversation" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
            /conversation →
          </Link>
          <Link href="/dev/beta" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
            Dev · Beta →
          </Link>
        </div>
      </div>
    </main>
  );
}
