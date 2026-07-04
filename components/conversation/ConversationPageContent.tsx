"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useGigi } from "@/components/providers/GigiProvider";
import { GigiMessage } from "@/components/ui/GigiMessage";
import { askGigi } from "@/modules/conversation/conversationBrain";
import type {
  ConversationContext,
  ConversationExchange,
} from "@/modules/conversation/conversationTypes";
import { GigiAnswer } from "./GigiAnswer";
import { cn } from "@/lib/utils";

const PROMPT_CHIPS = [
  "Que faire dans Buildy Crafts aujourd'hui ?",
  "Je veux gagner 500 €/mois rapidement",
  "Quel projet dois-je ignorer aujourd'hui ?",
  "Quelle mission est prioritaire maintenant ?",
];

export function ConversationPageContent() {
  const { state, isHydrated, applyRecommendedMission } = useGigi();
  const [input, setInput] = useState("");
  const [exchanges, setExchanges] = useState<ConversationExchange[]>([]);

  if (!isHydrated) return null;

  const ask = (objective: string, contextOverride?: ConversationContext) => {
    const trimmed = objective.trim();
    if (!trimmed) return;

    const context: ConversationContext = {
      currentMissionId: state.mission.id,
      currentProjectId: state.mission.projectId,
      completedMissionIds: state.completedMissionIds,
      ...contextOverride,
    };

    const response = askGigi(trimmed, state.projects, context);
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
  };

  const handleApply = (exchange: ConversationExchange) => {
    if (!exchange.response.mission) return;
    applyRecommendedMission(exchange.response.mission);
    setExchanges((prev) =>
      prev.map((x) => (x.id === exchange.id ? { ...x, applied: true } : x))
    );
  };

  const handleAlternative = (exchange: ConversationExchange) => {
    ask("Propose autre chose", {
      excludeMissionId: exchange.response.mission?.id,
      excludeProjectId: exchange.response.mission?.projectId,
      completedMissionIds: state.completedMissionIds,
    });
  };

  return (
    <div className="animate-fade-in">
      <section className="mb-10 md:mb-12">
        <GigiMessage
          primary="Dis-moi ce que tu veux atteindre."
          secondary="Je regarde tes projets et je choisis une mission claire pour toi."
        />
      </section>

      {exchanges.length === 0 && (
        <div className="mb-10 flex flex-wrap gap-2.5">
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => ask(chip)}
              className="rounded-full bg-[rgba(20,28,26,0.55)] px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-[rgba(28,38,35,0.7)] hover:text-text-primary"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-12">
        {exchanges.map((exchange) => (
          <div key={exchange.id} className="space-y-8">
            <div className="flex justify-end">
              <p className="max-w-lg rounded-[22px] rounded-tr-md bg-[rgba(184,115,51,0.12)] px-5 py-3.5 text-[15px] leading-relaxed text-text-primary">
                {exchange.objective}
              </p>
            </div>
            <GigiAnswer
              response={exchange.response}
              applied={exchange.applied}
              onApply={() => handleApply(exchange)}
              onAlternative={() => handleAlternative(exchange)}
              onChoice={(prompt) => ask(prompt)}
            />
          </div>
        ))}
      </div>

      {exchanges.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2.5">
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => ask(chip)}
              className="rounded-full bg-[rgba(20,28,26,0.45)] px-4 py-2 text-[13px] text-text-muted transition-colors hover:bg-[rgba(28,38,35,0.7)] hover:text-text-secondary"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10">
        <div
          className={cn(
            "flex items-end gap-2 rounded-[24px] bg-[rgba(16,22,20,0.6)] p-2 pl-5",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-md"
          )}
        >
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
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={() => ask(input)}
            disabled={!input.trim()}
            aria-label="Envoyer à Gigi"
            className="gigi-cta flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] text-text-primary disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
        <p className="mt-3 px-1 text-[13px] text-text-muted">
          Gigi réfléchit en local, à partir de tes projets. Aucune donnée ne quitte ton appareil.
        </p>
      </div>
    </div>
  );
}
