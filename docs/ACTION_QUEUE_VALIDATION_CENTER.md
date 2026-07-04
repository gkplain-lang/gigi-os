# V1.9 — Action Queue & Validation Center

> **Voici la file des actions préparées que tu peux valider.**

Version: `1.9`  
Status: Implemented (local-only)  
Product: **Gigi** (produit + assistant)

---

## 1. Objectif

Passer de « Voici une action préparée » à **« Voici la file des actions préparées que tu peux valider »**.

Centre de validation local pour relire, copier et marquer le statut des actions — **sans exécution réelle**.

---

## 2. Module `modules/actionQueue/`

```
modules/actionQueue/
├── types.ts
├── actionQueueStore.ts      # localStorage gigi-os-v19-action-queue
├── actionQueueService.ts    # enqueue, update status
├── actionQueueFilters.ts
└── index.ts
```

### Type `QueuedAction`

- `preparedAction` — artefact V1.8 complet
- `status` : `pending_review` | `approved` | `rejected` | `needs_revision` | `copied`
- `projectId`, `projectName`, `sourcePlanId?`, `sourceActionId?`
- `createdAt`, `updatedAt`, `reviewedAt?`, `note?`

---

## 3. Stockage local

| Clé | Usage |
|-----|--------|
| **`gigi-os-v19-action-queue`** | File d'actions à valider |

**Clés existantes non modifiées :**
- `gigi-os-v03-state`
- `gigi-os-v03-backup-*`
- `gigi-os-v03-backups-index`
- `gigi-os-v04-memory-status`
- `gigi-os-v09-beta-feedback`

- try/catch sur read/write
- fallback état vide si indisponible
- aucune sync Supabase

---

## 4. Page `/actions`

- Liste des actions en file
- Filtres : statut (toutes, à valider, validées, rejetées, à retravailler)
- Filtre projet si plusieurs projets
- Cartes avec : type, projet, titre, résumé, statut, date
- Actions : Ouvrir, Copier, Valider, Rejeter, À retravailler
- **Valider ne lance aucune action** — marquage local uniquement

---

## 5. Intégrations

| Emplacement | Comportement |
|-------------|--------------|
| `PreparedActionPanel` | Bouton « Ajouter à la file de validation » |
| `ActionPlanFutureActions` | « Ajouter à la file » (bulk) + bouton par action |
| Conversation | Bouton ajouter sur `PreparedActionPanel` |
| Navigation | Lien **Actions** après Projets |

Ajout **uniquement sur clic utilisateur** — jamais automatique.

---

## 6. Statuts

| Statut | Label | Transitions |
|--------|-------|-------------|
| `pending_review` | À valider | → approved, rejected, needs_revision, copied |
| `approved` | Validée | → pending_review |
| `rejected` | Rejetée | → pending_review |
| `needs_revision` | À retravailler | → pending_review |
| `copied` | Copiée | (via bouton Copier) |

---

## 7. Limites V1.9

- Aucune exécution (Git, fichiers, agents, n8n)
- Aucun appel externe
- Aucune sync Supabase
- Validation = marquage local seulement

---

## 8. Prochaines étapes — V2.0 Controlled Execution

- Exécuter une action **approuvée** avec confirmation explicite
- Audit trail validation → exécution
- Lien file → mission du jour

---

## 9. Fichiers clés

| Fichier | Rôle |
|---------|------|
| `app/actions/page.tsx` | Route validation center |
| `components/actionQueue/*` | UI file |
| `components/providers/ActionQueueProvider.tsx` | Context + persistence |
| `components/preparedActions/AddToQueueButton.tsx` | Ajout à la file |
