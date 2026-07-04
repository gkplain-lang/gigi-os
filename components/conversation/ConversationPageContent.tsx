"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, Check, RefreshCw } from "lucide-react";
import { useGigi } from "@/components/providers/GigiProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { AiEngineBadge } from "@/components/ai/AiEngineBadge";
import { askAiBrain, aiBrainToGigiResponse, tryBuildAiMemoryContext, useAiAvailability } from "@/modules/ai";
import type { AiBrainMode } from "@/modules/ai";
import { useMemoryStatus } from "@/modules/memory";
import type {
  ConversationContext,
  ConversationExchange,
} from "@/modules/conversation/conversationTypes";
import { GigiAnswer } from "./GigiAnswer";

const PROMPT_CHIPS = [
  "Que faire dans Buildy Crafts aujourd'hui ?",
  "Je veux gagner 500 €/mois rapidement",
  "Quel projet dois-je ignorer aujourd'hui ?",
  "Quelle mission est prioritaire maintenant ?",
];

export function ConversationPageContent() {
  const { state, isHydrated, applyRecommendedMission } = useGigi();
  const { isAiConfigured } = useAiAvailability();
  const { memoryStatus } = useMemoryStatus();
  const [input, setInput] = useState("");
  const [exchanges, setExchanges] = useState<ConversationExchange[]>([]);
  const [brainMode, setBrainMode] = useState<AiBrainMode>("local_only");
  const [asking, setAsking] = useState(false);

  if (!isHydrated) return null;

  const ask = async (objective: string, contextOverride?: ConversationContext) => {
    const trimmed = objective.trim();
    if (!trimmed || asking) return;

    const context: ConversationContext = {
      currentMissionId: state.mission.id,
      currentProjectId: state.mission.projectId,
      completedMissionIds: state.completedMissionIds,
      ...contextOverride,
    };

    setAsking(true);

    const memoryContext = tryBuildAiMemoryContext({
      localState: state,
      memoryStatus,
    });

    const aiResult = await askAiBrain(
      {
        userMessage: trimmed,
        currentMission: state.mission,
        projects: state.projects,
        history: state.history.map((h) => ({
          title: h.title,
          type: h.type,
          date: h.date,
        })),
        memoryStatus: {
          mode: memoryStatus.mode,
          label: memoryStatus.label,
          lastBackupAt: memoryStatus.lastBackupAt,
        },
        completedMissionIds: state.completedMissionIds,
        postponedMissionIds: state.postponedMissionIds,
        rejectedMissionIds: state.rejectedMissionIds,
        conversationContext: context,
        memoryContext,
      },
      { preferLocal: !isAiConfigured }
    );

    setBrainMode(aiResult.mode);
    const response = aiBrainToGigiResponse(aiResult);

    setExchanges((prev) => [
      ...prev,
      {
        id: `x-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        objective: trimmed,
        response,
        applied: false,
      },
    ]);
    setInput("");
    setAsking(false);
  };

  const latest = exchanges[exchanges.length - 1];

  const applyLatest = () => {
    if (!latest?.response.mission) return;
    applyRecommendedMission(latest.response.mission, {
      tasks: latest.response.tasks,
      nextStep: latest.response.nextStep ?? null,
      reason: latest.response.why ?? null,
    });
    setExchanges((prev) =>
      prev.map((x) => (x.id === latest.id ? { ...x, applied: true } : x))
    );
  };

  const alternativeLatest = () => {
    if (!latest) return;
    void ask("Propose autre chose", {
      excludeMissionId: latest.response.mission?.id,
      excludeProjectId: latest.response.mission?.projectId,
    });
  };

  const proposalPanel = (
    <div className="gigi-panel rounded-xl p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
        Mission proposée
      </p>
      {latest?.response.mission ? (
        <>
          <p className="mt-2 text-[13px] text-text-muted">
            {latest.response.priorityProjectName}
          </p>
          <p className="mt-1 text-[15px] font-medium text-text-primary">
            {latest.response.mission.title}
          </p>

          {latest.applied ? (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[rgba(155,181,159,0.4)] bg-[rgba(155,181,159,0.12)] px-3 py-2.5 text-[13.5px] text-text-secondary">
              <Check className="h-4 w-4 text-ok" strokeWidth={2.4} />
              Mission appliquée
              <Link href="/" className="ml-auto text-accent-soft hover:underline">
                Voir
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {latest.response.tasks?.[0] && (
                <p className="text-[12.5px] leading-relaxed text-text-muted">
                  Première tâche :{" "}
                  <span className="text-text-secondary">{latest.response.tasks[0]}</span>
                </p>
              )}
              <p className="text-[11.5px] text-text-muted/80">
                Appliquer enregistre la mission et ses tâches en local. Tu pourras la démarrer
                puis la terminer depuis l&apos;accueil.
              </p>
              <button
                type="button"
                onClick={applyLatest}
                className="gigi-btn-primary gigi-focus w-full rounded-lg px-4 py-2.5 text-[14px] font-medium"
              >
                Appliquer cette mission
              </button>
              <button
                type="button"
                onClick={alternativeLatest}
                className="gigi-btn gigi-focus inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Propose autre chose
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="mt-2 text-[13.5px] leading-relaxed text-text-muted">
          Pose un objectif à Gigi. Il lit tes projets et te propose une seule mission claire, avec
          ses raisons.
        </p>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gigi"
        meta="Ton assistant de décision. Dis-lui où tu veux aller."
        right={<AiEngineBadge mode={brainMode} />}
      />

      <div className="grid gap-5 lg:grid-cols-3 lg:items-start">
        {/* Conversation column */}
        <div className="lg:col-span-2">
          {exchanges.length === 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => void ask(chip)}
                  className="gigi-chip gigi-focus rounded-lg px-3.5 py-2 text-[13.5px]"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-8">
            {exchanges.map((exchange) => (
              <div key={exchange.id} className="space-y-4">
                <div className="flex justify-end">
                  <p className="max-w-lg rounded-xl rounded-tr-sm border border-border bg-surface px-4 py-2.5 text-[14px] leading-relaxed text-text-primary">
                    {exchange.objective}
                  </p>
                </div>
                <GigiAnswer response={exchange.response} onChoice={(p) => ask(p)} />
              </div>
            ))}
          </div>

          {/* Mobile actions for latest proposal */}
          {latest?.response.mission && !latest.applied && (
            <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
              <button
                type="button"
                onClick={applyLatest}
                className="gigi-btn-primary gigi-focus rounded-lg px-4 py-2.5 text-[14px] font-medium"
              >
                Appliquer cette mission
              </button>
              <button
                type="button"
                onClick={alternativeLatest}
                className="gigi-btn gigi-focus inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Propose autre chose
              </button>
            </div>
          )}

          {/* Input */}
          <div className="mt-6">
            <div className="gigi-input flex items-end gap-2 rounded-xl p-2 pl-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                rows={1}
                placeholder="Que faire dans Buildy Crafts aujourd'hui ?"
                className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent py-2 text-[14.5px] text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void ask(input)}
                disabled={!input.trim() || asking}
                aria-label="Envoyer à Gigi"
                className="gigi-btn-primary gigi-focus flex h-9 w-9 shrink-0 items-center justify-center rounded-lg disabled:opacity-40"
              >
                <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.4} />
              </button>
            </div>
            {exchanges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {PROMPT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => void ask(chip)}
                    className="gigi-chip gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right proposal panel (desktop) */}
        <div className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-8">{proposalPanel}</div>
        </div>
      </div>
    </div>
  );
}
