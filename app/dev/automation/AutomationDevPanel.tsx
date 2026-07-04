"use client";

import Link from "next/link";
import {
  DRY_RUN_AUTOMATION_LABELS,
  FORBIDDEN_AUTOMATION_LABELS,
  V07_NO_EXECUTION_MESSAGE,
  V07_BLOCKED_REAL_MESSAGE,
  confirmAutomationDryRunLocally,
  formatPermissionsList,
  summarizeAutomationFoundation,
} from "@/modules/automation";
import { confirmationStatusLabel } from "@/modules/agents/confirmation";

const panelStyle = {
  marginTop: 16,
  border: "1px solid #2a2f38",
  background: "#171a20",
  borderRadius: 12,
  padding: 20,
} as const;

export function AutomationDevPanel() {
  const summary = summarizeAutomationFoundation();
  const example = summary.exampleProposal;
  const dryRun = confirmAutomationDryRunLocally(example);

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
          Statut V0.7
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Version</dt>
            <dd>{summary.version}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Dry-run only</dt>
            <dd>{summary.dryRunOnly ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>n8n branché</dt>
            <dd>{summary.n8nConnected ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Exécution externe</dt>
            <dd>{summary.externalExecutionBlocked ? "Bloquée" : "Autorisée"}</dd>
          </div>
        </dl>
        <p style={{ marginTop: 12, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V07_NO_EXECUTION_MESSAGE}
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
          Automatisations disponibles (dry-run)
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {Object.values(DRY_RUN_AUTOMATION_LABELS).map((label) => (
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
          Automatisations interdites en exécution réelle
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {Object.values(FORBIDDEN_AUTOMATION_LABELS).map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        <p style={{ marginTop: 12, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V07_BLOCKED_REAL_MESSAGE}
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
          Exemple Automation Proposal
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Titre</dt>
            <dd>{example.title}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Type</dt>
            <dd>{example.automationType}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Déclencheur</dt>
            <dd>{example.triggerDescription}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Permissions</dt>
            <dd>{formatPermissionsList(example.requiredPermissions)}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Risque</dt>
            <dd>{example.riskLevel}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Statut</dt>
            <dd>{confirmationStatusLabel(example.confirmationStatus ?? "pending_confirmation")}</dd>
          </div>
        </dl>
        <p style={{ marginTop: 12, fontSize: 12, color: "#9b9ba1" }}>
          Simulation dry-run : {dryRun.summary}
        </p>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/dev/agents" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Agents →
        </Link>
        <Link href="/dev/ai" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · AI →
        </Link>
        <Link href="/dev/daily-review" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Daily Review →
        </Link>
        <Link href="/dev/execution" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Execution →
        </Link>
        <Link href="/conversation" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          /conversation →
        </Link>
      </div>
    </>
  );
}
