"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, RefreshCw } from "lucide-react";
import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { GigiOrb } from "@/components/ui/GigiOrb";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface GigiAnswerProps {
  response: GigiConversationResponse;
  applied: boolean;
  onApply: () => void;
  onAlternative: () => void;
  onChoice: (prompt: string) => void;
}

export function GigiAnswer({
  response,
  applied,
  onApply,
  onAlternative,
  onChoice,
}: GigiAnswerProps) {
  const [showNotNow, setShowNotNow] = useState(false);

  return (
    <div className="animate-fade-in flex gap-4">
      <GigiOrb size="md" className="mt-1" />

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium uppercase tracking-wide text-copper-soft">
          {response.intentLabel}
        </p>
        <p className="mt-2 text-lg leading-relaxed text-text-secondary">{response.listen}</p>

        {response.needsClarification ? (
          <div className="mt-6">
            <p className="text-base leading-relaxed text-text-primary">
              {response.clarificationQuestion}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {response.choices?.map((choice) => (
                <button
                  key={choice.label}
                  type="button"
                  onClick={() => onChoice(choice.prompt)}
                  className="rounded-full bg-[rgba(20,28,26,0.6)] px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-[rgba(28,38,35,0.75)] hover:text-text-primary"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        ) : !response.mission ? (
          <div className="mt-6">
            {response.alternative && (
              <p className="text-[15px] leading-relaxed text-text-secondary">
                Si tu veux quand même avancer :{" "}
                <span className="text-text-muted">{response.alternative.projectName}</span> —{" "}
                {response.alternative.missionTitle}
              </p>
            )}
            {response.finalMessage && (
              <p className="mt-6 font-display text-xl font-medium text-text-primary">
                {response.finalMessage}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="mt-7">
              <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted">
                Priorité du jour
              </p>
              <p className="mt-2 font-display text-2xl font-medium text-text-primary md:text-3xl">
                {response.priorityProjectName}
              </p>
            </div>

            <div className="mt-7">
              <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted">
                Mission recommandée
              </p>
              <p className="mt-2 text-lg text-text-primary">{response.missionTitle}</p>
            </div>

            <div className="mt-7">
              <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted">
                Pourquoi
              </p>
              <p className="mt-2 text-base leading-relaxed text-text-secondary">{response.why}</p>
            </div>

            <div className="mt-7">
              <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted">
                Tes 3 tâches
              </p>
              <ul className="mt-3 space-y-2.5">
                {response.tasks?.map((task, i) => (
                  <li key={i} className="flex gap-3 text-base text-text-secondary">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-copper-soft"
                      aria-hidden
                    />
                    {task}
                  </li>
                ))}
              </ul>
            </div>

            {response.alternative && (
              <div className="mt-7">
                <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted">
                  Alternative possible
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                  <span className="text-text-muted">{response.alternative.projectName}</span> —{" "}
                  {response.alternative.missionTitle}
                </p>
              </div>
            )}

            {response.warning && (
              <p className="mt-7 text-[15px] leading-relaxed text-text-muted">{response.warning}</p>
            )}

            {response.notNow && response.notNow.length > 0 && (
              <div className="mt-7">
                <button
                  type="button"
                  onClick={() => setShowNotNow((v) => !v)}
                  className="text-[13px] font-medium uppercase tracking-wide text-text-muted transition-colors hover:text-text-secondary"
                >
                  {showNotNow ? "Masquer" : "Pourquoi pas maintenant ?"}
                </button>
                {showNotNow && (
                  <ul className="mt-3 space-y-2">
                    {response.notNow.map((item) => (
                      <li
                        key={item.projectName}
                        className="text-[15px] leading-relaxed text-text-muted"
                      >
                        <span className="text-text-secondary">{item.projectName}</span> — {item.reason}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {response.finalMessage && (
              <p className="mt-8 font-display text-xl font-medium text-text-primary">
                {response.finalMessage}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {applied ? (
                <div className="flex flex-wrap items-center gap-3 text-[15px] text-text-secondary">
                  <span className="inline-flex items-center gap-2 text-copper-soft">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Mission appliquée
                  </span>
                  <Link
                    href="/"
                    className="underline-offset-4 transition-colors hover:text-text-primary hover:underline"
                  >
                    Aller à la mission
                  </Link>
                </div>
              ) : (
                <>
                  <PrimaryButton onClick={onApply}>Appliquer cette mission</PrimaryButton>
                  <button
                    type="button"
                    onClick={onAlternative}
                    className="inline-flex items-center gap-2 rounded-[20px] bg-[rgba(20,28,26,0.6)] px-5 py-3 text-[15px] text-text-secondary transition-colors hover:bg-[rgba(28,38,35,0.7)] hover:text-text-primary"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Propose autre chose
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
