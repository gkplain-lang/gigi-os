"use client";

import Link from "next/link";
import { OnboardingDevPanel } from "./OnboardingDevPanel";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevOnboardingPage() {
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
          Dev · Onboarding
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
          V1.4 Onboarding & First Run
        </h1>
        <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6, color: "#71767f" }}>
          État onboarding, données locales et reset — localStorage only, aucune action externe.
        </p>

        <OnboardingDevPanel />

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/onboarding" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
            /onboarding →
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
            Mission du jour →
          </Link>
          <Link href="/dev/release" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
            Dev · Release →
          </Link>
          <Link href="/dev/beta" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
            Dev · Beta →
          </Link>
        </div>
      </div>
    </main>
  );
}
