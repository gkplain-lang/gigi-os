# V2.0 — Controlled Execution Bridge

> **De « action validée » à « voici exactement comment l'exécuter sans casser le projet ».**

Version: `2.0`  
Status: Implemented (local, dry-run only)  
Product: **Gigi**  
Tag cible: `v2.0.0`

---

## 1. Objectif

V2.0 crée le pont entre une action **validée** dans `/actions` (V1.9) et un **plan d'exécution sécurisé** généré localement.

L'utilisateur passe de :

```text
« Cette action est validée »
```

à :

```text
« Voici exactement comment l'exécuter sans casser le projet »
```

---

## 2. Ce que V2.0 fait

```text
Génère un ExecutionPlan local depuis une QueuedAction au statut approved
Règles par type PreparedAction (cursor_prompt, checklist, branch_plan, pr_plan, content_plan, file_draft, fallback)
Page /actions : bouton « Préparer l'exécution » pour actions validées
Panneau ExecutionPlanPanel : objectif, étapes, commandes copiables, tests, risques, rollback, checklist
Conversation : intent execution_plan (« prépare l'exécution », « plan d'exécution », etc.)
Stockage optionnel léger : gigi-os-v20-execution-plans
```

### Module

```text
modules/executionPlans/
  types.ts
  executionPlanRules.ts
  executionPlanBuilder.ts
  executionPlanFormatter.ts
  executionPlanSummary.ts
  index.ts

components/executionPlans/
  ExecutionPlanPanel.tsx
```

### Types principaux

- `ExecutionPlan` — plan complet avec `dryRunOnly: true` et `requiresFinalConfirmation: true`
- `ExecutionStep` — étape ordonnée avec acteur (`user` | `cursor` | `gigi_future`)
- `ExecutionCommand` — commande **texte copiable**, `runBy: "user_manual_only"`
- Statuts plan : `draft` | `ready_for_manual_execution` | `blocked` | `completed_manually`

### Règles par type d'action

| Type | Mode | Contenu du plan |
|------|------|-----------------|
| `cursor_prompt` | `cursor_guided` | Ouvrir Cursor → coller prompt → diff → build → UI → commit si validé |
| `checklist` | `manual_guided` | Suivre checklist → cocher → noter blocages → revenir dans Gigi |
| `branch_plan` | `manual_guided` | Branche proposée, commandes git théoriques, build, commit, push manuel |
| `pr_plan` | `manual_guided` | Titre PR, description, checklist, risques |
| `content_plan` | `manual_guided` | Rédiger contenu, vérifier angle/CTA, publication manuelle |
| `file_draft` | `manual_guided` | Relire brouillon, copier, intégrer, tester |
| fallback | `manual_guided` | Clarifier → exécuter → tester → rapporter |

---

## 3. Ce que V2.0 ne fait PAS

```text
❌ Exécuter l'action réellement
❌ Modifier des fichiers réels
❌ Créer une branche Git réelle
❌ Lancer une commande depuis l'app
❌ Appeler GitHub, Supabase, n8n
❌ Changer le statut queue en « exécutée » automatiquement
❌ Sync / restore cloud
❌ Paiement, landing, branding
```

Les commandes affichées dans `ExecutionPlanPanel` sont **copiables uniquement** — jamais exécutées par Gigi.

---

## 4. Intégration /actions

### Action validée (`approved`)

- Bouton **« Préparer l'exécution »** (ou **« Voir le plan d'exécution »** si déjà généré)
- Génère un `ExecutionPlan` inline
- Affiche `ExecutionPlanPanel` sous la carte
- Sauvegarde optionnelle dans `gigi-os-v20-execution-plans`

### Action non validée

Message affiché :

```text
Valide cette action dans /actions avant de préparer son exécution.
```

Aucun bouton d'exécution.

---

## 5. Stockage local

| Clé | Usage |
|-----|--------|
| `gigi-os-v19-action-queue` | File V1.9 — **inchangée** |
| `gigi-os-v20-execution-plans` | Plans d'exécution générés (optionnel, léger) |

Clés **interdites** à modifier : `gigi-os-v03-*`, `gigi-os-v04-memory-status`, `gigi-os-v09-beta-feedback`.

`modules/storage` : **non modifié**.

---

## 6. Intégration conversation

Phrases détectées (intent `execution_plan`) :

- « prépare l'exécution »
- « plan d'exécution »
- « comment j'exécute cette action »
- « lance l'action validée »
- « qu'est-ce que je fais maintenant avec cette action »

Réponse Gigi :

1. Je ne lance rien automatiquement
2. Voici le plan d'exécution sécurisé (si action validée trouvée)
3. Sinon : message pour valider d'abord dans `/actions`

Gigi **ne prétend jamais** avoir exécuté l'action.

---

## 7. Statuts

### Queue (V1.9 — inchangé)

`pending_review` | `approved` | `rejected` | `needs_revision` | `copied`

Pas de statut « executed » réel en V2.0.

### Plan d'exécution (V2.0)

`draft` | `ready_for_manual_execution` | `blocked` | `completed_manually`

`completed_manually` = l'utilisateur marque manuellement qu'il a fini — **pas** une exécution automatique.

---

## 8. Liens futurs

| Version | Objectif |
|---------|----------|
| **V2.1 — Execution Logs** | Journaliser ce qui a été fait manuellement après exécution |
| **V2.2 — Cursor/Git Workflow Assistant** | Assistant guidé Cursor + Git (toujours contrôlé) |
| **V2.3+ — Multi-user SaaS** | Produit multi-utilisateurs (roadmap produit séparée) |

---

## 9. Exemples

### Cursor — Buildy Clear (page de vente)

Action validée : *Prompt Cursor — améliorer la page de vente Buildy Clear*

Plan généré :

- **Objectif** : Exécuter via Cursor
- **Étapes** : Ouvrir Cursor → coller prompt → relire diff → `npm run build` → vérif UI → commit si validé
- **Commandes** : `npm run build`, `git status`, `git diff` (copier-coller)
- **Tests** : build + parcours utilisateur
- **Risques** : scope élargi par Cursor → rappeler diff minimal
- **Rollback** : `git checkout --`, abandonner branche

### Branch plan — Gigi OS

- **Objectif** : Créer branche pour la feature
- **Commandes théoriques** : `git checkout main`, `git pull`, `git checkout -b feat/...`, `npm run build`
- **Aucune commande exécutée par Gigi**

---

## 10. Critères d'acceptation

- [x] Module `executionPlans` créé avec types et règles
- [x] `/actions` : bouton exécution uniquement si `approved`
- [x] `ExecutionPlanPanel` complet
- [x] Conversation intent `execution_plan`
- [x] Clé v20 documentée, anciennes clés intactes
- [x] `npm run build` OK
- [x] Aucun appel externe, aucune commande lancée

Voir aussi : [ACTION_QUEUE_VALIDATION_CENTER.md](./ACTION_QUEUE_VALIDATION_CENTER.md), [CONTROLLED_ACTION_PREPARATION.md](./CONTROLLED_ACTION_PREPARATION.md).
