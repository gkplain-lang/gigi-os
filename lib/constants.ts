export const NAV_ITEMS = [
  { href: "/", label: "Mission", icon: "target" as const },
  { href: "/conversation", label: "Gigi", icon: "message" as const },
  { href: "/projects", label: "Projets", icon: "layers" as const },
  { href: "/brain", label: "Décision", icon: "brain" as const },
  { href: "/history", label: "Historique", icon: "clock" as const },
] as const;

export const APP_NAME = "Gigi OS";
export const APP_TAGLINE = "Une action. Aucun bruit.";

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
  "/brain": {
    title: "Décision",
    subtitle: "Gigi t'explique son choix.",
  },
  "/history": {
    title: "Historique",
    subtitle: "Gigi garde en mémoire les décisions importantes.",
  },
} as const;
