"use client";

import Link from "next/link";
import { BetaFeedbackPanel } from "@/components/beta/BetaFeedbackPanel";
import { FEEDBACK_PAGE, V11_NO_AUTO_EXTERNAL_MESSAGE } from "@/modules/dailyUse";

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
          {FEEDBACK_PAGE.eyebrow}
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>{FEEDBACK_PAGE.title}</h1>
        <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6, color: "#71767f" }}>
          {FEEDBACK_PAGE.intro}
        </p>
        <p style={{ marginTop: 8, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V11_NO_AUTO_EXTERNAL_MESSAGE}
        </p>

        <BetaFeedbackPanel defaultRoute="/feedback" />

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
            {FEEDBACK_PAGE.backLinks.home} →
          </Link>
          <Link href="/conversation" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
            {FEEDBACK_PAGE.backLinks.conversation} →
          </Link>
        </div>
      </div>
    </main>
  );
}
