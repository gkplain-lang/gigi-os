export function summarizeDailyUseRefinement(): {
  version: string;
  focus: string[];
  unchanged: string[];
} {
  return {
    version: "1.3.0",
    focus: [
      "Wording plus court et actionnable",
      "Empty states plus utiles",
      "Feedback intégré au shell principal",
      "CTA mission clarifiés",
      "Mode simulation mieux expliqué",
    ],
    unchanged: [
      "Palette V1.2.1",
      "Routes et logique produit",
      "Garde-fous dry-run",
      "localStorage principal",
      "Aucune intégration externe",
    ],
  };
}
