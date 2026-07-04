# Gigi OS — V1.4 Onboarding & First Run

> Guider la première ouverture : de « je ne sais pas quoi faire » à « Gigi me propose une mission ».

Version: `1.4.0` (target)  
Status: Implemented  
Branch: `v1.4-onboarding-first-run`

---

## 1. Objectif V1.4

Créer une expérience de **première ouverture claire et utile**, sans transformer Gigi en SaaS.

L'utilisateur doit comprendre :

- ce qu'est Gigi (une mission prioritaire par jour, pas une todo-list) ;
- comment Gigi choisit la mission ;
- comment confirmer ses projets et objectifs ;
- comment obtenir sa première mission ;
- que tout reste en **simulation / dry-run** côté actions externes.

**Promesse :** « Ouvre Aegis. Parle à Gigi. Exécute. »

---

## 2. Étapes d'onboarding

| # | Étape | Contenu |
|---|--------|---------|
| 1 | **Welcome** | Tagline, promesse, différence vs todo-list, logique de scoring |
| 2 | **Projects** | Sélection : Gigi OS, Buildy Crafts, Buildy Clear, Linko, autre |
| 3 | **Goals** | Objectif principal (temps, projet, offre, revenu, idées, autre) |
| 4 | **Work style** | Style préféré : courte, profonde, rapide, stratégique |
| 5 | **First mission** | Génération locale ou lien vers `/conversation?ask=...` |

Route : **`/onboarding`**

---

## 3. Stockage local

- Champ optionnel `onboarding` dans `GigiLocalState` (`gigi-os-v03-state`)
- **Pas** de nouvelle clé localStorage principale
- **Pas** de Supabase auto sync / restore
- **Migration douce** : utilisateurs existants (V1.3 et avant) → onboarding auto-complété
- **Premier lancement** (clé absente) → état minimal + onboarding incomplet

---

## 4. Intégration UI

| Zone | Comportement |
|------|--------------|
| `/` | Bandeau discret « Configurer Gigi en 2 minutes » si onboarding incomplet |
| Sidebar | Lien « Premiers pas » si incomplet — masqué une fois terminé |
| `/conversation?ask=` | Compatible — prompt prérempli depuis l'étape 5 |
| `/dev/onboarding` | Diagnostic, état, reset local onboarding |

---

## 5. Ce qui n'a pas changé

- Palette V1.2.1 / V1.3
- Design system (`gigi-panel`, accent indigo)
- Garde-fous dry-run
- localStorage source principale
- Fallback local sans OpenAI
- Pages daily use existantes

---

## 6. Ce qui n'est PAS dans V1.4

```text
SaaS multi-user
Paiement / Stripe
Landing publique
Compte obligatoire
n8n, GitHub API, Gmail, Calendar
Sync / restore Supabase automatique
Agents réels
Exposition de clés API
```

---

## 7. Module

```
modules/onboarding/
  types.ts
  onboardingSteps.ts
  onboardingCopy.ts
  onboardingDefaults.ts
  onboardingState.ts
  onboardingSummary.ts
  index.ts
```

---

## 8. Tests manuels

- [ ] `npm run build` OK
- [ ] `/onboarding` — parcours complet 5 étapes
- [ ] Reset onboarding via `/dev/onboarding` → bandeau réapparaît sur `/`
- [ ] Onboarding terminé → bandeau et lien sidebar masqués
- [ ] « Générer ma première mission » → mission sur `/` (decision engine local)
- [ ] « Demander à Gigi » → `/conversation?ask=...` avec prompt contextualisé
- [ ] `/conversation?ask=` existant (bilan quotidien) inchangé
- [ ] Utilisateur V1.3 existant → pas de bandeau (migration auto-complete)
- [ ] `/projects`, `/brain`, `/history`, `/feedback`, `/memory` OK
- [ ] `/dev/release`, `/dev/onboarding` OK
- [ ] `.env.local` absent du git status
- [ ] Aucune clé exposée côté client

---

## 9. Garde-fous conservés

- Mode simulation explicite dans le wizard
- Première mission via `explainDecisionFromProjects` / `buildMissionFromProject` — local
- Aucune action externe réelle
- Reset onboarding local uniquement (dev panel)

---

*Gigi OS V1.4 — Onboarding & First Run*
