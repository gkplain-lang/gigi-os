"use client";

import Link from "next/link";
import { useGigi } from "@/components/providers/GigiProvider";
import { summarizeExecution, buildExecutionSnapshot } from "@/modules/missionExecution";

const panelStyle = {
  marginTop: 16,
  border: "1px solid #2a2f38",
  background: "#171a20",
  borderRadius: 12,
  padding: 20,
} as const;

export function ExecutionDevPanel() {
  const { state, isHydrated, execution } = useGigi();

  if (!isHydrated) {
    return <p style={{ fontSize: 13, color: "#71767f" }}>Chargement état local…</p>;
  }

  const summary = summarizeExecution(state);
  const snapshot = buildExecutionSnapshot(state);

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
          État d&apos;exécution mission
        </p>
        <dl style={{ fontSize: 13, lineHeight: 1.8, color: "#a1a1aa" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Phase</dt>
            <dd>{summary.phase}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Mission active</dt>
            <dd>{summary.activeMissionTitle ?? "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Projet</dt>
            <dd>{summary.activeProjectId ?? "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Première tâche</dt>
            <dd>{snapshot.firstTask ?? "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Dernier événement</dt>
            <dd>{summary.lastEventType ?? "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Dernière nextStep</dt>
            <dd>{summary.lastNextStep ?? "—"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Terminées / reportées / dismiss</dt>
            <dd>
              {summary.completedCount} / {summary.postponedCount} / {summary.dismissedCount}
            </dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Peut démarrer</dt>
            <dd>{execution.canStart ? "Oui" : "Non"}</dd>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#71767f", minWidth: 180 }}>Peut terminer</dt>
            <dd>{execution.canComplete ? "Oui" : "Non"}</dd>
          </div>
        </dl>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/dev/ai" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Dev · AI →
        </Link>
        <Link href="/" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          Mission du jour →
        </Link>
        <Link href="/history" style={{ fontSize: 13, color: "#71767f", textDecoration: "none" }}>
          /history →
        </Link>
      </div>
    </>
  );
}
