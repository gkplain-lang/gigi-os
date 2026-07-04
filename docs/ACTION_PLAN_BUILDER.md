# V1.7 — Action Plan Builder

> **Voici exactement comment on l'exécute.**

Version: `1.7`  
Status: Implemented (local-only, dry-run)  
Product: **Gigi** (produit + assistant)

---

## 1. Objectif

Passer de « Voici une mission possible » à **« Voici exactement comment on l'exécute »**.

Gigi produit des plans d'action structurés :
- clairs et priorisés ;
- découpés en étapes numérotées ;
- avec livrables, risques et effort ;
- avec actions futures préparables (dry-run) ;
- avec validation explicite requise.

**V1.7 ne exécute rien.** Préparation uniquement.

---

## 2. Module `modules/actionPlans/`

```
modules/actionPlans/
├── types.ts                 # ActionPlan, steps, deliverables, risks, …
├── actionPlanRules.ts       # Plans locaux par missionId
├── actionPlanBuilder.ts     # buildActionPlan, detectActionPlanIntent
├── actionPlanSummary.ts     # effort, confidence, messages dry-run
├── actionPlanFormatter.ts   # formatage texte
└── index.ts
```

### Type `ActionPlan`

- `title`, `summary`, `whyNow`, `expectedOutcome`
- `steps[]` — ordre, description, temps estimé, définition of done
- `deliverables[]`, `risks[]`
- `validationRequired[]`
- `possibleFutureActions[]` — toujours `dryRunOnly: true`, `requiresConfirmation: true`
- `effort`: low | medium | high
- `confidence`: 0–1

---

## 3. Génération locale

Catalogues par `missionId` pour :
- Buildy Clear (page de vente, offre, …)
- Buildy Crafts (charpente, matériaux, …)
- Gigi OS (moteur mission, actions contrôlées)
- Linko (fiche artisan, claim flow)
- 1 Millimètre, Le Dernier Souvenir

**Fallback générique** si pas de règle :
1. Clarifier l'objectif
2. Identifier le livrable
3. Réduire le scope
4. Étapes depuis `suggestedTasks` de la mission

Aucun appel IA. Aucun réseau.

---

## 4. Intégration UI

### Page projet `/projects/[projectId]`

- Section **Plan d'action** (mission recommandée par défaut)
- Query param `?plan=missionId` pour une mission spécifique
- Bouton **Préparer le plan** sur chaque carte mission

### Conversation `/conversation?ask=...`

Détection locale des intentions :
- « avance [projet] »
- « prépare un plan »
- « plan d'action »
- « transforme cette mission en plan »
- « exécuter » / « aide-moi à exécuter »

Réponse structurée avec `ActionPlanPanel` + rappel dry-run.

---

## 5. Actions préparables (dry-run)

Section « Ce que Gigi pourra préparer ensuite » :

| Type | Exemple |
|------|---------|
| `cursor_prompt` | Prompt Cursor pour réécrire une section |
| `checklist` | Checklist tunnel ou import DATA |
| `branch_plan` | Plan de branche Git (sans création) |
| `file_draft` | Brouillon markdown (sans écriture) |
| `content_plan` | Plan de contenu |
| `research_plan` | Liste de recherche |
| `manual_task` | Tâche manuelle documentée |

Chaque action affiche : **validation requise**, **dry-run only**.

---

## 6. Limites V1.7

- Aucune exécution réelle (fichiers, Git, agents, n8n)
- Aucune modification localStorage
- Aucune sync Supabase
- Plans statiques / règles locales — pas de génération IA obligatoire
- Pas d'application automatique de mission

---

## 7. Prochaines étapes — V1.8 Controlled Actions

- Appliquer une action préparée **avec confirmation explicite**
- Audit trail des actions proposées vs exécutées
- Lien plan → mission du jour avec accord utilisateur

---

## 8. Fichiers clés

| Fichier | Rôle |
|---------|------|
| `modules/actionPlans/*` | Module plan d'action |
| `components/actionPlans/ActionPlanPanel.tsx` | UI plan (projet + conversation) |
| `components/projects/ProjectDetailPageContent.tsx` | Section plan + query param |
| `components/projects/ProjectMissionCard.tsx` | Bouton « Préparer le plan » |
| `modules/conversation/conversationBrain.ts` | Détection intention plan |
