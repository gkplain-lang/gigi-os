"use client";

import Link from "next/link";
import {
  GITHUB_DRY_RUN_LABELS,
  GITHUB_FORBIDDEN_LABELS,
  V08_BLOCKED_REAL_MESSAGE,
  V08_NO_API_MESSAGE,
  confirmIntegrationDryRunLocally,
  formatIntegrationStatusLabel,
  formatPermissionsList,
  summarizeGitHubAlpha,
  summarizeIntegrationFoundation,
} from "@/modules/integrations";
import { confirmationStatusLabel } from "@/modules/agents/confirmation";

const panelStyle = {
  marginTop: 16,
  border: "1px solid #2a2f38",
  background: "#171a20",
  borderRadius: 12,
  padding: 20,
} as const;

export function IntegrationsDevPanel() {
  const summary = summarizeIntegrationFoundation();
  const github = summarizeGitHubAlpha();
  const example = summary.exampleProposal;
  const dryRun = confirmIntegrationDryRunLocally(example);

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
          Statut global V0.8
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
            <dt style={{ color: "#71767f", minWidth: 180 }}>Appels API externes</dt>
            <dd>{summary.externalApiCallsBlocked ? "Bloqués" : "Autorisés"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Intégrations</dt>
            <dd>{summary.availableIntegrations.join(", ")}</dd>
          </div>
        </dl>
        <p style={{ marginTop: 12, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V08_NO_API_MESSAGE}
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
          GitHub — statut
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Statut</dt>
            <dd>{formatIntegrationStatusLabel(github.status)}</dd>
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
          Actions GitHub dry-run
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {Object.values(GITHUB_DRY_RUN_LABELS).map((label) => (
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
          Actions GitHub bloquées en réel
        </p>
        <ul style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, paddingLeft: 18 }}>
          {Object.values(GITHUB_FORBIDDEN_LABELS).map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        <p style={{ marginTop: 12, fontSize: 12, color: "#71767f", fontStyle: "italic" }}>
          {V08_BLOCKED_REAL_MESSAGE}
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
          Exemple de plan GitHub
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Titre</dt>
            <dd>{example.title}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Action</dt>
            <dd>{example.githubAction}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 140 }}>Permissions</dt>
            <dd>{formatPermissionsList(example.requiredPermissions)}</dd>
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
        <Link href="/dev/automation" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · Automation →
        </Link>
        <Link href="/dev/ai" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · AI →
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
