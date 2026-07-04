# Gigi OS — V1.3 Daily Use Refinement

> Affiner l'usage quotidien sur la base V1.2.1 — clarté, textes, empty states, cohérence.

Version: `1.3.0` (en cours)  
Status: Implemented  
Branch: `v1.3-daily-use-refinement`  
Base: `v1.2.1` — Accent Dim Fix

---

## 1. Objectif V1.3

Améliorer la **clarté quotidienne** sans nouveaux pouvoirs ni refonte visuelle.

**Promesse inchangée :** « Ouvre Gigi. Sache quoi faire. Exécute. »

V1.3 = polish UX ciblé. Pas de nouvelle architecture lourde.

---

## 2. Améliorations UX

| Zone | Amélioration |
|------|--------------|
| `/` | Labels « Maintenant », simulation plus claire, CTA mission raccourcis |
| `/conversation` | Bannière empty state, libellés apply raccourcis, meta affinée |
| `/feedback` | Intégré au shell principal (PageHeader + gigi-panel) |
| `/history` | Empty state plus actionnable |
| `/brain`, `/projects`, `/memory` | Meta descriptions plus courtes |
| Sidebar | Mode simulation reformulé, lien feedback cohérent |
| Feedback panel | Message quand aucune entrée enregistrée |

---

## 3. Module `modules/dailyUseRefinement/`

```text
types.ts
dailyLabels.ts      — meta pages, CTA mission, simulation, conversation
emptyStates.ts      — empty states affinés
refinementSummary.ts
index.ts
```

Le module `modules/dailyUse/` (V1.1) reste la base — V1.3 affine par-dessus.

---

## 4. Ce qui n'a pas changé

- Palette V1.2.1 (indigo / cyan)
- Design global et cartes
- Routes et logique produit
- Garde-fous dry-run (V0.6 → V1.2)
- Fallback local sans OpenAI
- localStorage source principale
- Aucune intégration externe, n8n, paiement, landing

---

## 5. Garde-fous conservés

Identiques à V1.2.1 :

- `dryRunOnly: true`
- `n8nConnected: false`
- `externalActionsDisabled: true`
- `autoSyncDisabled` / `autoRestoreDisabled: true`
- `localStoragePrimary: true`

Message simulation : **« Mode simulation · local uniquement »**

---

## 6. Protocole de test manuel

1. `npm run build`
2. `/` → bloc « Maintenant », CTA « Démarrer » / « Mission terminée »
3. `/conversation` → bannière empty state + chips
4. `/feedback` → layout cohérent avec le reste de l'app
5. `/history` vide → lien vers mission
6. `/dev/release` → checklist intacte
7. Fallback local sans OpenAI
8. `.env.local` hors git

---

## 7. Après V1.3

- Merger dans `main`, tag `v1.3.0`
- Collecter feedbacks locaux
- Branche suivante : `v2.0-saas-foundation` ou itérations V1.4

---

## 8. Contraintes permanentes

- Pas de modification `.env.local`
- Pas de `NEXT_PUBLIC_*` pour clés IA
- Pas d'exposition de clés
