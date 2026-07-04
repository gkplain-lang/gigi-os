"use client";

import Link from "next/link";
import {
  formatAutonomyLabel,
  listAllowedActionLabels,
  listForbiddenActionLabels,
  summarizeAgentFoundation,
  executeActionDryRun,
  V06_BLOCKED_MESSAGE,
} from "@/modules/agents";
import {
  buildConfirmationViewModel,
  confirmationStatusLabel,
  summarizeConfirmationUx,
  V062_REAL_BLOCKED_MESSAGE,
} from "@/modules/agents/confirmation";

const panelStyle = {
  marginTop: 16,
  border: "1px solid #2a2f38",
  background: "#171a20",
  borderRadius: 12,
  padding: 20,
} as const;

export function AgentsDevPanel() {
  const summary = summarizeAgentFoundation();
  const confirmUx = summarizeConfirmationUx();
  const dryRun = executeActionDryRun(summary.exampleProposal);
  const confirmView = buildConfirmationViewModel(confirmUx.exampleProposal);

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
          Autonomie active
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Niveau max V0.6</dt>
            <dd>{summary.maxAutonomyLevel}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Libellé</dt>
            <dd>{formatAutonomyLabel()}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Dry-run only</dt>
            <dd>{summary.dryRunOnly ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Exécution externe</dt>
            <dd>{summary.externalExecutionBlocked ? "Bloquée" : "Autorisée"}</dd>
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
          Actions autorisées (dry-run)
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {listAllowedActionLabels().map((label) => (
            <li key={label}>{label}</li>
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
          Actions bloquées en réel
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {listForbiddenActionLabels().map((label) => (
            <li key={label}>{label}</li>
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
          Confirmation UX (V0.6.2)
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>UX active</dt>
            <dd>{confirmUx.confirmationUxActive ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Exécution réelle</dt>
            <dd>{confirmUx.realExecutionDisabled ? "Désactivée" : "Activée"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>État exemple</dt>
            <dd>{confirmationStatusLabel(confirmUx.exampleStatus)}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Confirmation requise</dt>
            <dd>{confirmUx.exampleProposal.confirmationRequired ? "Oui" : "Non"}</dd>
          </div>
        </dl>
        <p style={{ marginTop: 12, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V062_REAL_BLOCKED_MESSAGE}
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
          Dernier proposal exemple
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Titre</dt>
            <dd>{confirmUx.exampleProposal.title}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Projet</dt>
            <dd>{confirmView.projectLabel}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Type</dt>
            <dd>{confirmUx.exampleProposal.actionType}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Risque</dt>
            <dd>{confirmUx.exampleProposal.riskLevel}</dd>
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
          Exemple Action Proposal (dry-run)
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Titre</dt>
            <dd>{summary.exampleProposal.title}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Type</dt>
            <dd>{summary.exampleProposal.actionType}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Risque</dt>
            <dd>{summary.exampleProposal.riskLevel}</dd>
          </div>
          <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
            <dt style={{ color: "#71767f" }}>Dry-run</dt>
            <dd>{dryRun.summary}</dd>
          </div>
        </dl>
        <p style={{ marginTop: 12, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V06_BLOCKED_MESSAGE}
        </p>
        <p style={{ marginTop: 8, fontSize: 12, color: "#9b9ba1" }}>
          Aucune action externe exécutée — pas de Gmail, Calendar, GitHub, n8n, Supabase sync/restore.
        </p>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/dev/ai" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · AI →
        </Link>
        <Link href="/dev/execution" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Execution →
        </Link>
        <Link href="/dev/daily-review" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Daily Review →
        </Link>
        <Link href="/dev/automation" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Automation →
        </Link>
        <Link href="/dev/integrations" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Integrations →
        </Link>
        <Link href="/dev/beta" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Beta →
        </Link>
        <Link href="/dev/release" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Release →
        </Link>
        <Link href="/conversation" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          /conversation →
        </Link>
      </div>
    </>
  );
}
