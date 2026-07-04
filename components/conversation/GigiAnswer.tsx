"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { GigiOrb } from "@/components/ui/GigiOrb";

interface GigiAnswerProps {
  response: GigiConversationResponse;
  onChoice: (prompt: string) => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{children}</p>
  );
}

function ActionProposalsSection({ response }: { response: GigiConversationResponse }) {
  if (!response.actionProposals?.length) return null;

  return (
    <div className="gigi-panel mt-3 rounded-xl p-4">
      <Label>Action proposée (dry-run)</Label>
      {response.actionProposals.map((proposal) => (
        <div
          key={proposal.id}
          className="mt-2.5 rounded-lg border border-border bg-surface/50 p-3"
        >
          <p className="text-[13.5px] font-medium text-text-primary">{proposal.title}</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-text-muted">{proposal.description}</p>
          <p className="mt-2 text-[12px] text-text-muted/80">
            Risque : {proposal.riskLevel} · Dry-run uniquement
          </p>
          {proposal.blockedReason && (
            <p className="mt-2 text-[12.5px] leading-relaxed text-amber-200/90">
              {proposal.blockedReason}
            </p>
          )}
          {response.agentBlockedMessage && proposal.blockedReason && (
            <p className="mt-1.5 text-[12px] font-medium text-text-secondary">
              {response.agentBlockedMessage}
            </p>
          )}
        </div>
      ))}
      <p className="mt-2.5 text-[11px] text-text-muted/70">V0.6 — aucune action externe exécutée.</p>
    </div>
  );
}

export function GigiAnswer({ response, onChoice }: GigiAnswerProps) {
  const [showNotNow, setShowNotNow] = useState(false);

  return (
    <div className="animate-fade-in flex gap-3">
      <GigiOrb size="sm" className="mt-1" />

      <div className="min-w-0 flex-1">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          <span className="text-[11.5px] font-medium text-text-secondary">
            {response.intentLabel}
          </span>
        </div>
        <p className="mt-2.5 text-[15px] leading-relaxed text-text-primary">{response.listen}</p>

        {response.needsClarification ? (
          <div className="gigi-panel mt-3 rounded-xl p-4">
            <p className="text-[14px] leading-relaxed text-text-secondary">
              {response.clarificationQuestion}
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {response.choices?.map((choice) => (
                <button
                  key={choice.label}
                  type="button"
                  onClick={() => onChoice(choice.prompt)}
                  className="gigi-chip gigi-focus rounded-lg px-3.5 py-2 text-[13.5px]"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        ) : !response.mission ? (
          <>
            <div className="gigi-panel mt-3 rounded-xl p-4">
              {response.alternative && (
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  Si tu veux quand même avancer :{" "}
                  <span className="text-text-muted">{response.alternative.projectName}</span> —{" "}
                  {response.alternative.missionTitle}
                </p>
              )}
              {response.finalMessage && (
                <p className="mt-3 text-[15px] font-medium text-text-primary">
                  {response.finalMessage}
                </p>
              )}
            </div>
            <ActionProposalsSection response={response} />
          </>
        ) : (
          <div className="gigi-panel mt-3 divide-y divide-border overflow-hidden rounded-xl">
            <div className="p-4">
              <Label>Priorité · {response.priorityProjectName}</Label>
              <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                {response.missionTitle}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-muted">{response.why}</p>
            </div>

            {response.tasks && response.tasks.length > 0 && (
              <div className="p-4">
                <Label>Tes 3 tâches</Label>
                <ul className="mt-2.5 space-y-2">
                  {response.tasks.map((task, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(response.alternative || response.warning || response.nextStep) && (
              <div className="p-4">
                {response.alternative && (
                  <>
                    <Label>Alternative</Label>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="text-text-muted">{response.alternative.projectName}</span> —{" "}
                      {response.alternative.missionTitle}
                    </p>
                  </>
                )}
                {response.warning && (
                  <p className="mt-2.5 text-[13px] leading-relaxed text-text-muted">
                    <span className="font-medium text-text-secondary">Risque : </span>
                    {response.warning}
                  </p>
                )}
                {response.nextStep && (
                  <p className="mt-2.5 text-[13px] leading-relaxed text-text-secondary">
                    <span className="font-medium text-text-muted">Prochaine étape : </span>
                    {response.nextStep}
                  </p>
                )}
              </div>
            )}

            {response.notNow && response.notNow.length > 0 && (
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => setShowNotNow((v) => !v)}
                  className="gigi-focus flex items-center gap-1.5 rounded text-[11px] font-medium uppercase tracking-wider text-text-muted hover:text-text-secondary"
                >
                  Pourquoi pas les autres ?
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showNotNow ? "rotate-180" : ""}`} />
                </button>
                {showNotNow && (
                  <ul className="mt-2.5 space-y-1.5">
                    {response.notNow.map((item) => (
                      <li key={item.projectName} className="text-[13px] leading-relaxed text-text-muted">
                        <span className="text-text-secondary">{item.projectName}</span> — {item.reason}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {response.actionProposals && response.actionProposals.length > 0 && (
              <div className="p-4">
                <Label>Action proposée (dry-run)</Label>
                {response.actionProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="mt-2.5 rounded-lg border border-border bg-surface/50 p-3"
                  >
                    <p className="text-[13.5px] font-medium text-text-primary">{proposal.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-text-muted">
                      {proposal.description}
                    </p>
                    <p className="mt-2 text-[12px] text-text-muted/80">
                      Risque : {proposal.riskLevel} · Dry-run uniquement
                    </p>
                    {proposal.blockedReason && (
                      <p className="mt-2 text-[12.5px] leading-relaxed text-amber-200/90">
                        {proposal.blockedReason}
                      </p>
                    )}
                    {response.agentBlockedMessage && proposal.blockedReason && (
                      <p className="mt-1.5 text-[12px] font-medium text-text-secondary">
                        {response.agentBlockedMessage}
                      </p>
                    )}
                  </div>
                ))}
                <p className="mt-2.5 text-[11px] text-text-muted/70">
                  V0.6 — aucune action externe exécutée.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
