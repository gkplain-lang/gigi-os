import { PRODUCT_NAME, PRODUCT_TAGLINE } from "./branding";

export const NAV_ITEMS = [
  { href: "/", label: "Mission", icon: "target" as const },
  { href: "/conversation", label: "Gigi", icon: "message" as const },
  { href: "/projects", label: "Projets", icon: "layers" as const },
  { href: "/actions", label: "Actions", icon: "actions" as const },
  { href: "/brain", label: "Décision", icon: "brain" as const },
  { href: "/history", label: "Historique", icon: "clock" as const },
] as const;

/** Entrée produit V3.5 — liens sidebar footer */
export const DISCOVERY_NAV_ITEMS = [
  { href: "/landing", label: "Présentation" },
  { href: "/onboarding", label: "Démarrer" },
  { href: "/beta", label: "Bêta" },
] as const;

export const APP_NAME = PRODUCT_NAME;
export const APP_TAGLINE = PRODUCT_TAGLINE;

export const PAGE_META = {
  "/": {
    title: "Mission",
    subtitle: "La seule chose qui compte aujourd'hui.",
  },
  "/conversation": {
    title: "Gigi",
    subtitle: "Dis-moi ton objectif. Je choisis pour toi.",
  },
  "/projects": {
    title: "Projets",
    subtitle: "Pour te situer — Gigi a déjà tranché.",
  },
  "/actions": {
    title: "Actions à valider",
    subtitle: "Actions préparées par Gigi — aucune exécution automatique.",
  },
  "/brain": {
    title: "Décision",
    subtitle: "Gigi t'explique son choix.",
  },
  "/history": {
    title: "Historique",
    subtitle: "Gigi garde en mémoire les décisions importantes.",
  },
  "/settings": {
    title: "Réglages",
    subtitle: "Données locales, export, import et préférences — sous ton contrôle.",
  },
  "/permissions": {
    title: "Centre de permissions d'exécution",
    subtitle: "Permissions locales et simulées — dry-run, validation humaine. Aucune exécution réelle.",
  },
  "/manual-bridge": {
    title: "Pont manuel d'exécution",
    subtitle: "Paquets d'exécution manuelle — sandbox connecteurs, validation humaine. Aucune exécution réelle.",
  },
  "/command-packs": {
    title: "Packs de commandes",
    subtitle: "Commandes structurées à copier — lancement humain, validation locale. Aucune exécution réelle.",
  },
} as const;
