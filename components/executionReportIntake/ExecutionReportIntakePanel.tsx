"use client";

import { useCallback, useMemo, useState } from "react";
import type { QueuedAction } from "@/modules/actionQueue";
import type { ManualExecutionHandoff } from "@/modules/manualExecutionHandoff";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace";
import type { ExecutionReportIntake, ExecutionReportIntakeReporter } from "@/modules/executionReportIntake";
import {
  archiveIntake,
  createIntakeFromHandoff,
  createIntakeFromQueuedAction,
  createIntakeFromWorkspace,
  EXECUTION_REPORT_INTAKE_DISCLAIMER,
  EXECUTION_REPORT_INTAKE_REPORTER_LABELS,
  getIntakesBySourceHandoffId,
  getIntakesBySourceActionId,
  parseIntakeRawReport,
} from "@/modules/executionReportIntake";
import { getManualExecutionHandoffById } from "@/modules/manualExecutionHandoff/manualExecutionHandoffStore";
import { ExecutionReportIntakeCard } from "./ExecutionReportIntakeCard";
import { cn } from "@/lib/utils";

const REPORTERS: ExecutionReportIntakeReporter[] = ["cursor", "human", "self", "generic"];

interface ExecutionReportIntakePanelProps {
  handoff?: ManualExecutionHandoff;
  workspace?: SafeActionWorkspace;
  action?: QueuedAction;
  onClose?: () => void;
  onHandoffChange?: (next: ManualExecutionHandoff) => void;
  className?: string;
}

export function ExecutionReportIntakePanel({
  handoff,
  workspace,
  action,
  onClose,
  onHandoffChange,
  className,
}: ExecutionReportIntakePanelProps) {
  const existingIntake = useMemo(() => {
    if (handoff) return getIntakesBySourceHandoffId(handoff.id)[0];
    if (action) return getIntakesBySourceActionId(action.id)[0];
    return undefined;
  }, [handoff, action]);

  const [intake, setIntake] = useState<ExecutionReportIntake | undefined>(existingIntake);
  const [rawReport, setRawReport] = useState(existingIntake?.rawReport ?? "");
  const [reporter, setReporter] = useState<ExecutionReportIntakeReporter>(
    existingIntake?.reporter ?? (handoff?.target === "cursor" ? "cursor" : "unknown")
  );

  const handleCreate = useCallback(() => {
    let created: ExecutionReportIntake;
    if (handoff) created = createIntakeFromHandoff(handoff, reporter);
    else if (workspace) created = createIntakeFromWorkspace(workspace, reporter);
    else if (action) created = createIntakeFromQueuedAction(action, reporter);
    else return;
    setIntake(created);
  }, [handoff, workspace, action, reporter]);

  const handleParse = useCallback(() => {
    if (!intake) return;
    const trimmed = rawReport.trim();
    if (!trimmed) return;
    const parsed = parseIntakeRawReport(intake.id, trimmed);
    if (parsed) setIntake(parsed);
  }, [intake, rawReport]);

  const handleArchive = useCallback(() => {
    if (intake) archiveIntake(intake.id);
    setIntake(undefined);
    setRawReport("");
    onClose?.();
  }, [intake, onClose]);

  const panelId = handoff
    ? `report-intake-handoff-${handoff.id}`
    : action
      ? `report-intake-action-${action.id}`
      : workspace
        ? `report-intake-workspace-${workspace.id}`
        : "report-intake";

  return (
    <section
      id={panelId}
      className={cn(
        "rounded-xl border border-sky-500/25 bg-sky-500/5 p-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-200/90">
        Execution Report Intake · V2.10
      </p>
      <p className="mt-1 text-[13px] text-text-secondary">
        Colle le rapport reçu — Gigi parse localement sans vérifier le repo.
      </p>

      {!intake ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {REPORTERS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReporter(r)}
                className={cn(
                  "gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]",
                  reporter === r && "ring-1 ring-sky-300/50"
                )}
              >
                {EXECUTION_REPORT_INTAKE_REPORTER_LABELS[r]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="gigi-btn-primary gigi-focus rounded-lg px-4 py-2 text-[13px] font-medium"
          >
            Importer rapport
          </button>
          <p className="text-[11px] text-text-muted">{EXECUTION_REPORT_INTAKE_DISCLAIMER}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
            <label
              htmlFor={`${panelId}-raw`}
              className="text-[10px] font-semibold uppercase tracking-wider text-text-muted"
            >
              Rapport brut
            </label>
            <textarea
              id={`${panelId}-raw`}
              value={rawReport}
              onChange={(e) => setRawReport(e.target.value)}
              rows={8}
              className="gigi-focus mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[12.5px] leading-relaxed"
              placeholder="Colle ici le rapport d'exécution reçu de Cursor, d'un humain ou de toi-même…"
            />
            <button
              type="button"
              onClick={handleParse}
              disabled={!rawReport.trim()}
              className="gigi-btn-primary gigi-focus mt-2 rounded-lg px-4 py-2 text-[13px] font-medium disabled:opacity-40"
            >
              Parser le rapport
            </button>
          </div>

          {intake.rawReport.trim() && (
            <ExecutionReportIntakeCard
              intake={intake}
              onIntakeChange={setIntake}
              onReporterChange={setReporter}
              onHandoffMarked={() => {
                if (handoff?.id) {
                  const updated = getManualExecutionHandoffById(handoff.id);
                  if (updated) onHandoffChange?.(updated);
                }
              }}
              onArchive={handleArchive}
            />
          )}
        </div>
      )}
    </section>
  );
}
