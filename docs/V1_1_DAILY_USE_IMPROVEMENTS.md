# Gigi OS — V1.1 Daily Use Improvements

> Polish UX pour l'usage quotidien — **sans nouveaux pouvoirs externes**.

Version: `1.1.0` (en cours)  
Status: Implemented  
Branch: `v1.1-daily-use-improvements`  
Base: `v1.0.0` — Daily Use Release

---

## 1. Objectif V1.1

Rendre Gigi **plus claire, plus agréable et plus fiable** au quotidien.

**Promesse inchangée :** « Ouvre Gigi. Sache quoi faire. Exécute. »

V1.1 = polish et stabilité. Pas de nouvelle architecture lourde.

---

## 2. Améliorations UX

| Zone | Amélioration |
|------|--------------|
| `/` (`DailyUseStrip`) | Prochaine action mise en avant, badge simulation, CTA « Parler à Gigi » plus visible |
| `/conversation` | Textes plus naturels, bilan du jour via `?ask=`, note simulation |
| `/`, sidebar | Indication « Simulation — rien n'est envoyé dehors » |
| `/feedback` | Wording simplifié, lien dev retiré, retours vers accueil et conversation |
| `/history` | État vide avec lien vers la mission |
| `/brain`, `/projects` | Meta descriptions simplifiées |
| Module central | `modules/dailyUse/` — textes et signaux d'usage quotidien |

---

## 3. Module `modules/dailyUse/`

```text
types.ts           — types hints, empty states, guardrails
dailyUseCopy.ts    — textes UI centralisés
dailyUseHints.ts   — prochaine action, meta mission, liens bilan
dailyUseSummary.ts — résumé strip depuis la mission
index.ts
```

---

## 4. Ce qui n'a pas changé

- Navigation principale et design global
- Garde-fous dry-run (V0.6 → V1.0)
- Fallback local sans OpenAI
- localStorage source principale (`gigi-os-v03-state`)
- Feedback local (`gigi-os-v09-beta-feedback`)
- Aucune intégration réelle, n8n, GitHub API, Gmail, Calendar
- Aucune sync / restore Supabase automatique
- Aucun paiement ni landing publique

---

## 5. Garde-fous conservés

Identiques à V1.0 :

- `dryRunOnly: true`
- `n8nConnected: false`
- `externalActionsDisabled: true`
- `autoSyncDisabled` / `autoRestoreDisabled: true`
- `localStoragePrimary: true`

Message utilisateur : **« Mode simulation : aucune action externe automatique. »**

---

## 6. Protocole de test manuel

1. `npm run build`
2. `/` → strip avec prochaine action + badge simulation
3. « Bilan du jour » → `/conversation?ask=…` lance la revue
4. `/conversation` → chips et placeholder naturels
5. `/history` vide → message + lien accueil
6. `/feedback` → enregistrement local, pas de lien dev
7. `/dev/release` → checklist V1.0 intacte
8. Fallback local sans OpenAI
9. `.env.local` hors git

---

## 7. Après V1.1

- Merger dans `main`, tag `v1.1.0`
- Collecter feedbacks locaux
- Branche suivante : `v2.0-saas-foundation` ou itérations V1.2 selon retours

---

## 8. Contraintes permanentes

- Pas de modification `.env.local`
- Pas de `NEXT_PUBLIC_*` pour clés IA
- Pas d'exposition de clés
