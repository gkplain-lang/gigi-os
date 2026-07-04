"use client";

import Link from "next/link";
import { useGigi } from "@/components/providers/GigiProvider";
import {
  buildDailyReviewSnapshot,
  summarizeDailyReview,
} from "@/modules/dailyReview";

const panelStyle = {
  marginTop: 16,
  border: "1px solid #2a2f38",
  background: "#171a20",
  borderRadius: 12,
  padding: 20,
} as const;

export function DailyReviewDevPanel() {
  const { state, isHydrated } = useGigi();

  if (!isHydrated) {
    return <p style={{ fontSize: 13, color: "#71767f" }}>Chargement état local…</p>;
  }

  const snapshot = buildDailyReviewSnapshot(state);
  const summary = summarizeDailyReview(state);

  return (
    <>
      <div style={panelStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Revue quotidienne (read-only)
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Date</dt>
            <dd>{snapshot.date}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Mission actuelle</dt>
            <dd>{snapshot.currentMission.title}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Phase</dt>
            <dd>{snapshot.currentMission.phase}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Mission active</dt>
            <dd>{snapshot.activeMission?.title ?? "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Focus suggéré</dt>
            <dd>{summary.suggestedFocus}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Confiance</dt>
            <dd>{summary.confidenceScore}</dd>
          </div>
          <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
            <dt style={{ color: "#71767f" }}>Bilan court</dt>
            <dd>{summary.shortSummary}</dd>
          </div>
        </dl>
      </div>

      <div style={panelStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Événements récents ({snapshot.recentHistoryEvents.length})
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {snapshot.recentHistoryEvents.length === 0 ? (
            <li>Aucun événement récent</li>
          ) : (
            snapshot.recentHistoryEvents.map((e) => (
              <li key={e.id}>
                [{e.group}] {e.title}
              </li>
            ))
          )}
        </ul>
      </div>

      <div style={panelStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Projets stale ({snapshot.staleProjects.length})
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {snapshot.staleProjects.length === 0 ? (
            <li>Aucun projet stale détecté</li>
          ) : (
            snapshot.staleProjects.map((p) => (
              <li key={p.projectId}>
                {p.projectName} — {p.reason}
              </li>
            ))
          )}
        </ul>
      </div>

      <div style={panelStyle}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#71767f",
            marginBottom: 12,
          }}
        >
          Blocages ({snapshot.possibleBlockers.length})
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {snapshot.possibleBlockers.length === 0 ? (
            <li>Aucun blocage détecté</li>
          ) : (
            snapshot.possibleBlockers.map((b, i) => (
              <li key={i}>
                [{b.severity}] {b.message}
              </li>
            ))
          )}
        </ul>
        <p style={{ marginTop: 12, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          Read-only — aucune sync, aucun restore, aucun agent externe.
        </p>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/dev/ai" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · AI →
        </Link>
        <Link href="/dev/execution" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Execution →
        </Link>
        <Link href="/dev/agents" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Agents →
        </Link>
        <Link href="/dev/automation" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Automation →
        </Link>
        <Link href="/dev/beta" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Beta →
        </Link>
        <Link href="/conversation" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          /conversation →
        </Link>
      </div>
    </>
  );
}
