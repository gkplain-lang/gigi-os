"use client";

import Link from "next/link";
import { BetaFeedbackPanel } from "@/components/beta/BetaFeedbackPanel";
import {
  betaChecklistScore,
  buildBetaChecklist,
  FORBIDDEN_V09_REAL_ACTIONS,
  formatModuleStatusLabel,
  getBetaGuardrails,
  KNOWN_BETA_RISKS,
  NEXT_BETA_VALIDATIONS,
  summarizeBetaReadiness,
  V09_NO_AUTO_EXTERNAL_MESSAGE,
  V09_PHASE_LABEL,
} from "@/modules/beta";

const panelStyle = {
  marginTop: 16,
  border: "1px solid #2a2f38",
  background: "#171a20",
  borderRadius: 12,
  padding: 20,
} as const;

function checklistStatusColor(status: string): string {
  if (status === "pass") return "#9bb59f";
  if (status === "manual") return "#d4a574";
  return "#71767f";
}

export function BetaDevPanel() {
  const summary = summarizeBetaReadiness();
  const score = betaChecklistScore();
  const guardrails = getBetaGuardrails();
  const checklist = buildBetaChecklist();

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
          Statut bêta privée V0.9
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Version</dt>
            <dd>{summary.version}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Phase</dt>
            <dd>{V09_PHASE_LABEL}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Checklist auto</dt>
            <dd>
              {score.passed} pass · {score.manual} manuel · {score.total} total
            </dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Feedbacks locaux</dt>
            <dd>{summary.feedbackCount}</dd>
          </div>
        </dl>
        <p style={{ marginTop: 12, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V09_NO_AUTO_EXTERNAL_MESSAGE}
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
          <li>Actions externes désactivées : {guardrails.externalActionsDisabled ? "Oui" : "Non"}</li>
          <li>Dry-run only : {guardrails.dryRunOnly ? "Oui" : "Non"}</li>
          <li>n8n branché : {guardrails.n8nConnected ? "Oui" : "Non"}</li>
          <li>Intégrations réelles : {guardrails.realIntegrationsDisabled ? "Désactivées" : "Actives"}</li>
          <li>Sync auto Supabase : {guardrails.autoSyncDisabled ? "Non" : "Oui"}</li>
          <li>Restore auto Supabase : {guardrails.autoRestoreDisabled ? "Non" : "Oui"}</li>
          <li>Confirmation obligatoire : {guardrails.confirmationRequired ? "Oui" : "Non"}</li>
          <li>localStorage principal : {guardrails.localStoragePrimary ? "Oui" : "Non"}</li>
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
          Checklist bêta
        </p>
        <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 0, listStyle: "none" }}>
          {checklist.map((item) => (
            <li key={item.id} style={{ marginBottom: 8, color: "#a1a1aa" }}>
              <span style={{ color: checklistStatusColor(item.status), marginRight: 8 }}>
                [{item.status}]
              </span>
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
          Modules clés
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {summary.moduleHealth.map((m) => (
            <li key={m.module}>
              {m.module} (v{m.version}) — {formatModuleStatusLabel(m.status)} — {m.note}
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
          {summary.criticalRoutes.map((r) => (
            <li key={r.path}>
              <Link href={r.path} style={{ color: "#9b9ba1", textDecoration: "none" }}>
                {r.path}
              </Link>{" "}
              — {r.label} ({r.role})
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
          Interdit en V0.9
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {FORBIDDEN_V09_REAL_ACTIONS.map((item) => (
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
          {KNOWN_BETA_RISKS.map((risk) => (
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
          Prochaines validations
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {NEXT_BETA_VALIDATIONS.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </div>

      <BetaFeedbackPanel compact />

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/feedback" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          /feedback →
        </Link>
        <Link href="/dev/ai" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · AI →
        </Link>
        <Link href="/conversation" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          /conversation →
        </Link>
      </div>
    </>
  );
}
