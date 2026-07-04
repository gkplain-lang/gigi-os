# Gigi OS — V1.0 Daily Use Release

> Stabiliser Gigi OS pour un usage quotidien réel — **sans nouveaux pouvoirs externes**.

Version: `1.0.0`  
Status: Implemented  
Branch: `v1.0-daily-use-release`

---

## 1. Objectif V1.0

Rendre Gigi OS **fiable, claire et utilisable chaque jour**.

**Promesse :** « Ouvre Gigi. Sache quoi faire. Exécute. »

V1.0 ne branche **pas** d'intégrations réelles, n8n, ni agents autonomes.

---

## 2. Ce que V1.0 signifie

- Mission du jour claire dès l'ouverture (`/`)
- Conversation, brain, projets, historique, mémoire stables
- Revue quotidienne read-only (V0.6.1)
- Mission execution loop (V0.5.4)
- Feedback local (`/feedback`)
- Garde-fous dry-run conservés (V0.6 → V0.8)
- Checklist et diagnostic `/dev/release`

---

## 3. Ce que V1.0 ne signifie pas

- Pas de produit public / landing / paiement
- Pas de GitHub API, Gmail, Calendar
- Pas de n8n ni agents réels
- Pas de sync / restore Supabase automatique
- Pas de nouvelles intégrations réelles
- Pas de refonte design globale

---

## 4. Module `modules/release/`

```text
types.ts
releaseChecklist.ts    — 18 items daily use
releaseHealth.ts       — modules critiques
routeHealth.ts         — routes user + dev
dailyUseReadiness.ts     — promesse V1.0
releaseRisks.ts        — risques, interdictions
releaseSummary.ts        — résumé dev
index.ts
```

---

## 5. Checklist daily use

| Catégorie | Exemples |
|-----------|----------|
| Daily use | mission, conversation, review, history, feedback |
| IA | fallback local, IA optionnelle |
| Garde-fous | actions/automation/integrations dry-run, confirmation UX |
| Stabilité | build OK (manuel), mission loop (manuel) |

Voir `/dev/release` pour la liste complète.

---

## 6. UX daily use (léger)

- **`DailyUseStrip`** sur `/` : mission actuelle, liens conversation / bilan / feedback
- Lien discret **Feedback bêta** dans la sidebar
- Aucun changement de navigation principale

---

## 7. Protocole de test manuel

1. `npm run build`
2. Ouvrir `/` → mission + strip visible
3. `/conversation` → demander mission ou bilan du jour
4. Compléter / reporter / rejeter une mission
5. `/history` → événement enregistré
6. `/feedback` → ajouter une note locale
7. `/dev/release` → checklist et garde-fous
8. Fallback local sans OpenAI (`forceLocal`)
9. Vérifier `.env.local` hors git

---

## 8. Garde-fous actifs

Identiques à V0.9 :

- `dryRunOnly: true`
- `n8nConnected: false`
- `externalActionsDisabled: true`
- `autoSyncDisabled` / `autoRestoreDisabled: true`
- `localStoragePrimary: true`

---

## 9. Risques connus

- OpenAI absent → fallback local
- Supabase absent → pas de cloud
- Feedback non synchronisé entre appareils
- Intégrations = plans dry-run uniquement

---

## 10. Après V1.0

- Collecter feedbacks locaux régulièrement
- Prioriser clarté UX sur nouveaux pouvoirs
- Intégrations réelles **opt-in** uniquement, avec confirmation
- **V1.1** : améliorations UX daily use — voir [V1_1_DAILY_USE_IMPROVEMENTS.md](./V1_1_DAILY_USE_IMPROVEMENTS.md)
- V2.0+ : fondation SaaS

---

## 11. Contraintes permanentes

- `gigi-os-v03-state` source principale
- Pas de modification `.env.local`
- Pas de `NEXT_PUBLIC_*` pour clés IA
