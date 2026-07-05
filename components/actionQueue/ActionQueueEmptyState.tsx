import { ClipboardList } from "lucide-react";
import { ExecutionRouteEmptyHint } from "@/components/executionExperience/ExecutionRouteEmptyHint";

interface ActionQueueEmptyStateProps {
  filterActive?: boolean;
}

export function ActionQueueEmptyState({ filterActive }: ActionQueueEmptyStateProps) {
  return (
    <div className="gigi-empty-state rounded-xl px-6 py-12 text-center">
      <ClipboardList className="mx-auto h-10 w-10 text-text-muted/50" strokeWidth={1.5} />
      <p className="mt-4 text-[15px] font-semibold text-text-primary">
        {filterActive ? "Aucune action pour ce filtre" : "Aucune action dans la file"}
      </p>
      <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-text-secondary">
        {filterActive
          ? "Essaie un autre statut ou projet."
          : "Prépare une action depuis un plan projet ou la conversation, puis ajoute-la à la file."}
      </p>
      {!filterActive && (
        <div className="mx-auto mt-5 max-w-lg text-left">
          <ExecutionRouteEmptyHint
            message="Prépare une action depuis un plan projet ou la conversation, puis explore le parcours V4."
            nextSteps={[
              { label: "Voir mes projets", href: "/projects" },
              { label: "Centre d'action V4", href: "/actions" },
              { label: "Packs commandes", href: "/command-packs" },
            ]}
          />
        </div>
      )}
    </div>
  );
}
