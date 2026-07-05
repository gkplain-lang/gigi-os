import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { generateManualBridgeSummary } from "./manualBridgeSummary";
import { getSandboxConnectorRegistry } from "./manualBridgeRegistry";
import { manualBridgePolicyNotes, getManualBridgeDisclaimer } from "./manualBridgePolicy";
import {
  createManualExecutionPacket,
  listManualExecutionPackets,
  updateManualExecutionPacketStatus,
} from "./manualBridgePackets";
import { generateGlobalExecutionReadinessSummary } from "./executionReadinessSummary";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MANUAL_BRIDGE_KEYWORDS = [
  "paquet manuel",
  "manual bridge",
  "pont manuel",
  "preparer un paquet",
  "prépare un paquet",
  "preparer les etapes",
  "prépare les étapes",
  "preparer les commandes",
  "prépare les commandes",
  "ne les lance pas",
  "connecteurs disponibles",
  "quels connecteurs",
  "sandbox connecteur",
  "manual execution packet",
  "exporte le paquet",
  "marque ce paquet",
  "marque le paquet",
  "peux tu lancer n8n",
  "peux-tu lancer n8n",
  "preparer github",
  "prépare github",
];

export interface ManualBridgeIntent {
  isManualBridge: boolean;
}

export function detectManualBridgeIntent(objective: string): ManualBridgeIntent {
  const norm = normalize(objective);
  const isManualBridge = MANUAL_BRIDGE_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isManualBridge };
}

export function buildManualBridgeConversationResponse(objective: string): GigiConversationResponse {
  const norm = normalize(objective);
  const summary = generateManualBridgeSummary();
  const permissionSummary = generateGlobalExecutionReadinessSummary();
  const connectors = getSandboxConnectorRegistry();
  const hints = [
    ...manualBridgePolicyNotes(),
    "Ouvre /manual-bridge pour le panel complet.",
  ];

  if (/exporte.*paquet|export.*packet/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Export pont manuel · V4.2",
      listen:
        "Tu peux exporter les paquets en JSON localement — aucun envoi réseau, aucun secret inclus.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: getManualBridgeDisclaimer(),
      finalMessage: "Utilise le bouton « Exporter JSON » sur /manual-bridge.",
    };
  }

  if (/marque.*paquet|marque.*fait/.test(norm)) {
    const latest = listManualExecutionPackets(1)[0];
    if (latest) {
      updateManualExecutionPacketStatus(
        latest.id,
        "marked_done_by_human",
        "Marqué via conversation — Gigi ne vérifie pas l'exécution réelle."
      );
    }
    return {
      intent: "execution_readiness",
      intentLabel: "Paquet marqué · V4.2",
      listen:
        latest
          ? `J'ai marqué localement « ${latest.title} » comme fait par l'humain — aucune vérification réelle.`
          : "Aucun paquet à marquer — crée-en un sur /manual-bridge.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: getManualBridgeDisclaimer(),
      finalMessage: "Consulte /manual-bridge pour le détail.",
    };
  }

  if (/n8n|github|shell|connecteur|disponible/.test(norm)) {
    const connectorList = connectors
      .map((c) => `${c.label} (${c.status}) — ${c.riskLevel}`)
      .join(" · ");
    return {
      intent: "execution_readiness",
      intentLabel: "Connecteurs sandbox · V4.2",
      listen:
        "Tous les connecteurs restent non actifs. Gigi peut préparer des paquets manuels — tu lances toi-même.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: [...hints, connectorList],
      executionReadinessBlockedMessage: getManualBridgeDisclaimer(),
      finalMessage: "Aucun connecteur réel en V4.2 — sandbox et pont manuel uniquement.",
    };
  }

  if (/prepar|prépar|paquet|commande|etape|étape/.test(norm)) {
    const packet = createManualExecutionPacket({});
    return {
      intent: "execution_readiness",
      intentLabel: "Paquet manuel · V4.2",
      listen: packet
        ? `Paquet manuel préparé : « ${packet.title} » — copie les instructions, aucune exécution réelle.`
        : "Impossible de créer le paquet — réessaie depuis /manual-bridge.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessRequestTitle: packet?.title,
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: getManualBridgeDisclaimer(),
      finalMessage: "Ouvre /manual-bridge pour copier les étapes et valider humainement.",
    };
  }

  return {
    intent: "execution_readiness",
    intentLabel: "Pont manuel · V4.2",
    listen:
      "En V4.2 je prépare des paquets d'exécution manuelle — sandbox connecteurs, validation humaine, aucune exécution réelle.",
    needsClarification: false,
    executionReadinessSummaryText: `${summary.summaryText} · ${permissionSummary.summaryText}`,
    executionReadinessGuidance: hints,
    executionReadinessBlockedMessage: getManualBridgeDisclaimer(),
    finalMessage: "Dis « prépare un paquet manuel » ou ouvre /manual-bridge.",
  };
}
