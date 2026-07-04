# V1.8 — Controlled Action Preparation

> **Voici les actions préparées que tu peux valider ou copier-coller.**

Version: `1.8`  
Status: Implemented (local-only, dry-run)  
Product: **Gigi** (produit + assistant)

---

## 1. Objectif

Passer de « Voici le plan » à **« Voici les actions préparées prêtes à valider »**.

Quand un plan d'action contient des actions futures préparables, Gigi génère des **artefacts locaux** — sans exécution réelle.

---

## 2. Module `modules/preparedActions/`

```
modules/preparedActions/
├── types.ts                    # PreparedAction, types d'artefacts
├── preparedActionRules.ts      # Builders par type + contexte projet
├── preparedActionBuilder.ts    # build, detect intent, hrefs
├── preparedActionFormatter.ts  # format copy
├── preparedActionSummary.ts    # messages dry-run, validation
└── index.ts
```

### Type `PreparedAction`

- `type` : cursor_prompt, checklist, file_draft, branch_plan, pr_plan, content_plan, research_plan, collaborator_brief, manual_task
- `title`, `summary`, `body` (copiable)
- `relatedFiles`, `commands` (suggestions manuelles)
- `safetyNotes`, `validationRequired`
- `dryRunOnly: true`, `requiresConfirmation: true`

---

## 3. Artefacts supportés

| Type | Contenu généré |
|------|----------------|
| **cursor_prompt** | Prompt Cursor complet : contexte, règles, fichiers, étapes, tests, rapport |
| **checklist** | Avant / pendant / après / validation |
| **branch_plan** | Nom de branche, fichiers, commandes git théoriques, commit message |
| **file_draft** | Brouillon markdown, emplacement suggéré |
| **content_plan** | Angle, structure, livrables, CTA |
| **research_plan** | Liste DATA / recherche |
| **collaborator_brief** | Mission, contexte, critères de réussite |
| **pr_plan** | Modèle PR (summary, test plan) |
| **manual_task** | Tâche manuelle structurée |

Tout reste **local** et **dry-run**.

---

## 4. Intégration UI

### Page projet `/projects/[projectId]?plan=...&prepare=...`

- Section plan V1.7 inchangée
- Bouton **Préparer** sur chaque action future
- Panneau inline `PreparedActionPanel` avec copie
- Query param `prepare=sourceActionId` pour deep-link

### Conversation

Détection : « prompt Cursor », « checklist », « branche », « prépare l'action », etc.

Réponse avec `PreparedActionPanel` + plan associé (repliable).

---

## 5. Limites V1.8

- **Aucune exécution** : pas de Git, pas de fichiers, pas d'agents
- **Aucun appel externe** ou IA obligatoire
- **Aucune persistance** des actions préparées
- **Aucune sync Supabase**
- localStorage keys inchangées

---

## 6. Prochaines étapes — V1.9+

- Appliquer une action préparée **avec confirmation explicite**
- Historique des actions préparées / validées
- Lien plan → action → mission du jour

---

## 7. Fichiers clés

| Fichier | Rôle |
|---------|------|
| `modules/preparedActions/*` | Module actions préparées |
| `components/preparedActions/PreparedActionPanel.tsx` | UI artefact copiable |
| `components/actionPlans/ActionPlanFutureActions.tsx` | Boutons Préparer |
| `modules/conversation/conversationBrain.ts` | Intent `prepared_action` |
