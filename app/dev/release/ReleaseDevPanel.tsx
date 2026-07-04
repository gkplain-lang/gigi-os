"use client";

import Link from "next/link";
import {
  buildReleaseChecklist,
  FORBIDDEN_V10_REAL_ACTIONS,
  formatReleaseModuleRole,
  getReleaseGuardrails,
  KNOWN_V10_RISKS,
  MANUAL_V10_VALIDATIONS,
  releaseChecklistScore,
  summarizeReleaseReadiness,
  V10_NOT_INCLUDED,
  V10_NO_AUTO_EXTERNAL_MESSAGE,
  V10_PHASE_LABEL,
  V10_PROMISE,
} from "@/modules/release";

const panelStyle = {
  marginTop: 16,
  border: "1px solid #2a2f38",
  background: "#171a20",
  borderRadius: 12,
  padding: 20,
} as const;

function statusColor(status: string): string {
  if (status === "pass") return "#9bb59f";
  if (status === "manual") return "#d4a574";
  return "#71767f";
}

export function ReleaseDevPanel() {
  const summary = summarizeReleaseReadiness();
  const score = releaseChecklistScore();
  const guardrails = getReleaseGuardrails();
  const checklist = buildReleaseChecklist();

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
          Statut V1.0 Daily Use
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Version</dt>
            <dd>{summary.version}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Phase</dt>
            <dd>{V10_PHASE_LABEL}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Promesse</dt>
            <dd>{V10_PROMISE}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Checklist</dt>
            <dd>
              {score.passed} pass · {score.manual} manuel · {score.total} total
            </dd>
          </div>
        </dl>
        <p style={{ marginTop: 12, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V10_NO_AUTO_EXTERNAL_MESSAGE}
        </p>
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
          Garde-fous actifs
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          <li>Actions externes : {guardrails.externalActionsDisabled ? "désactivées" : "actives"}</li>
          <li>Dry-run only : {guardrails.dryRunOnly ? "oui" : "non"}</li>
          <li>n8n : {guardrails.n8nConnected ? "branché" : "non branché"}</li>
          <li>Sync auto Supabase : {guardrails.autoSyncDisabled ? "non" : "oui"}</li>
          <li>Confirmation obligatoire : {guardrails.confirmationRequired ? "oui" : "non"}</li>
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
          Checklist daily use
        </p>
        <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 0, listStyle: "none" }}>
          {checklist.map((item) => (
            <li key={item.id} style={{ marginBottom: 8, color: "#a1a1aa" }}>
              <span style={{ color: statusColor(item.status), marginRight: 8 }}>[{item.status}]</span>
              {item.label}
              {item.note && (
                <span style={{ display: "block", fontSize: 11, color: "#71767f", marginTop: 2 }}>
                  {item.note}
                </span>
              )}
            </li>
          ))}
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
          Modules critiques
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {summary.modules.map((m) => (
            <li key={m.module}>
              {m.module} — {formatReleaseModuleRole(m.role)} — {m.note}
            </li>
          ))}
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
          Routes critiques
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {summary.routes.map((r) => (
            <li key={r.path}>
              <Link href={r.path} style={{ color: "#9b9ba1", textDecoration: "none" }}>
                {r.path}
              </Link>{" "}
              — {r.label}
            </li>
          ))}
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
          V1.0 ne signifie pas
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {V10_NOT_INCLUDED.map((item) => (
            <li key={item}>{item}</li>
          ))}
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
          Interdit
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {FORBIDDEN_V10_REAL_ACTIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
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
          Risques connus
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {KNOWN_V10_RISKS.map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
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
          Validations manuelles
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {MANUAL_V10_VALIDATIONS.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Mission du jour →
        </Link>
        <Link href="/feedback" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          /feedback →
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
