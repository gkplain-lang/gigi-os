import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import type { CommandPackCategory } from "./commandPackTypes";
import { generateCommandPackSummary } from "./commandPackSummary";
import {
  commandPackPolicyNotes,
  getCommandPackDisclaimer,
} from "./commandPackPolicy";
import {
  createCommandPackFromTemplate,
  listCommandPacks,
  updateCommandPackStatus,
} from "./commandPackBuilder";
import { COMMAND_PACK_TEMPLATES } from "./commandPackTemplates";
import { generateManualBridgeSummary } from "./manualBridgeSummary";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const COMMAND_PACK_KEYWORDS = [
  "pack de commandes",
  "command pack",
  "pack commandes",
  "preparer un pack",
  "prépare un pack",
  "preparer les commandes git",
  "prépare les commandes git",
  "preparer les commandes pour github",
  "prépare les commandes pour github",
  "fais-moi un pack n8n",
  "pack n8n",
  "donne-moi les commandes a copier",
  "donne-moi les commandes à copier",
  "je veux lancer moi-meme",
  "je veux lancer moi-même",
  "marque ce pack",
  "marque le pack",
  "exporte le pack",
  "quels packs sont prets",
  "quels packs sont prêts",
  "commandes a copier",
  "commandes à copier",
  "lancement humain",
];

export interface CommandPackIntent {
  isCommandPack: boolean;
}

export function detectCommandPackIntent(objective: string): CommandPackIntent {
  const norm = normalize(objective);
  const isCommandPack = COMMAND_PACK_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isCommandPack };
}

function templateFromObjective(norm: string): CommandPackCategory | null {
  if (/git(?!hub)/.test(norm) || norm.includes("git local")) return "git_local";
  if (/github|pull request|pr/.test(norm)) return "github_pr";
  if (/n8n/.test(norm)) return "n8n_workflow";
  if (/navigateur|browser/.test(norm)) return "browser_checklist";
  if (/fichier|file edit|edition/.test(norm)) return "file_edit";
  if (/email|mail/.test(norm)) return "email_draft";
  return null;
}

export function buildCommandPackConversationResponse(objective: string): GigiConversationResponse {
  const norm = normalize(objective);
  const summary = generateCommandPackSummary();
  const bridgeSummary = generateManualBridgeSummary();
  const hints = [
    ...commandPackPolicyNotes(),
    "Ouvre /command-packs pour le panel complet.",
  ];

  if (/exporte.*pack|export.*pack/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Export pack commandes · V4.3",
      listen:
        "Tu peux exporter les packs en JSON ou Markdown localement — aucun envoi réseau, aucun secret inclus.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: getCommandPackDisclaimer(),
      finalMessage: "Utilise les boutons d'export sur /command-packs.",
    };
  }

  if (/marque.*pack|marque.*lance/.test(norm)) {
    const latest = listCommandPacks(1)[0];
    if (latest) {
      updateCommandPackStatus(
        latest.id,
        "marked_run_by_human",
        "Marqué via conversation — Gigi ne vérifie pas l'exécution réelle."
      );
    }
    return {
      intent: "execution_readiness",
      intentLabel: "Pack marqué · V4.3",
      listen: latest
        ? `J'ai marqué localement « ${latest.title} » comme lancé par l'humain — statut déclaratif uniquement.`
        : "Aucun pack à marquer — crée-en un sur /command-packs.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: getCommandPackDisclaimer(),
      finalMessage: "Consulte /command-packs pour le détail.",
    };
  }

  if (/quels packs|packs prets|packs prêts/.test(norm)) {
    const ready = summary.readyForReview;
    return {
      intent: "execution_readiness",
      intentLabel: "Packs prêts · V4.3",
      listen:
        ready > 0
          ? `${ready} pack(s) prêt(s) à relire — commandes à copier, lancement humain.`
          : "Aucun pack prêt à relire — prépare-en un depuis /command-packs ou un paquet pont manuel.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: getCommandPackDisclaimer(),
      finalMessage: "Ouvre /command-packs pour relire et copier les commandes.",
    };
  }

  const templateId = templateFromObjective(norm);
  if (templateId || /prepar|prépar|pack|commande/.test(norm)) {
    const pack = templateId
      ? createCommandPackFromTemplate(templateId)
      : createCommandPackFromTemplate("git_local");
    return {
      intent: "execution_readiness",
      intentLabel: "Pack de commandes · V4.3",
      listen: pack
        ? `Pack préparé : « ${pack.title} » — relis, copie et lance toi-même. Aucune exécution Gigi.`
        : "Impossible de créer le pack — réessaie depuis /command-packs.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessRequestTitle: pack?.title,
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: getCommandPackDisclaimer(),
      finalMessage: "Ouvre /command-packs pour copier les commandes ligne par ligne.",
    };
  }

  const templateList = COMMAND_PACK_TEMPLATES.map((t) => t.title).join(" · ");
  return {
    intent: "execution_readiness",
    intentLabel: "Packs de commandes · V4.3",
    listen:
      "En V4.3 je prépare des packs de commandes structurés — texte à copier, validation humaine, aucune exécution réelle.",
    needsClarification: false,
    executionReadinessSummaryText: `${summary.summaryText} · ${bridgeSummary.summaryText}`,
    executionReadinessGuidance: [...hints, `Modèles : ${templateList}`],
    executionReadinessBlockedMessage: getCommandPackDisclaimer(),
    finalMessage: "Dis « prépare un pack de commandes » ou ouvre /command-packs.",
  };
}
