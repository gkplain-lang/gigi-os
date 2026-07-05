# V2.7 — Mission-to-Plan Decision Bridge

> **De « mission acceptée » à « plan et action préparés » — local, manuel, sans exécution.**

Version: `2.7`  
Status: Implemented (local bridge only)  
Product: **Gigi**

---

## 1. Objectif

Créer un **pont local** entre une mission acceptée dans le centre de décision V2.6 et les systèmes existants :

- plan d'action V1.7
- action préparée V1.8
- file de validation V1.9 (`pending_review` uniquement)
- conversation contextualisée

Gigi **prépare la suite**, mais **n'exécute rien**.

---

## 2. Décision V2.6 vs Bridge V2.7

| V2.6 Mission Decision | V2.7 Mission-to-Plan Bridge |
|----------------------|----------------------------|
| Compare et **choisit** une mission | **Transforme** une mission acceptée en plan |
| Statuts : accepted, rejected, etc. | Statuts : plan_generated, added_to_queue, etc. |
| Clé `gigi-os-v26-mission-decision-center` | Clé `gigi-os-v27-mission-plan-bridge` |
| Centre sur `/` | Panneau sous décision acceptée + fiche projet |

---

## 3. Stockage

Clé localStorage : **`gigi-os-v27-mission-plan-bridge`**

Structure : `{ bridges, lastUpdatedAt, version }`

---

## 4. Sources du bridge

| Source | Description |
|--------|-------------|
| `mission_decision` | Depuis une décision V2.6 acceptée |
| `mission_candidate` | (réservé) |
| `project_mission` | (réservé) |
| `manual` | Fallback synthétique |

---

## 5. Statuts du bridge

| Statut | Signification |
|--------|---------------|
| `draft` | Brouillon initial |
| `ready` | Bridge créé, prêt à générer |
| `plan_generated` | Plan d'action proposé |
| `prepared_action_generated` | Action préparée proposée |
| `added_to_queue` | Ajout manuel à la file V1.9 |
| `conversation_opened` | Deep-link conversation utilisé |
| `cancelled` | Annulé |
| `archived` | Archivé |

---

## 6. Outputs possibles

| Type | Description |
|------|-------------|
| `action_plan` | Plan V1.7 généré localement |
| `prepared_action` | Action V1.8 proposée |
| `queue_item` | Entrée file V1.9 |
| `conversation_prompt` | Prompt pour `/conversation?ask=...` |
| `manual_task` | Tâche manuelle suggérée |

---

## 7. Plan draft

Le plan reprend :

- titre et description de la mission acceptée
- raisons, risques et checklist de la candidate V2.6
- étapes via `buildActionPlanForProject` si possible
- sinon plan synthétique avec étapes de clôture (log, review, archive)

Exemple :

```text
1. Identifier le fichier concerné.
2. Lire l'erreur TypeScript exacte.
3. Corriger le typage sans changer le périmètre.
4. Relancer le build manuellement.
5. Ajouter le résultat au journal d'exécution.
6. Générer une review V2.2.
7. Archiver l'apprentissage si terminé.
```

---

## 8. Prepared action draft

Générée via `buildPreparedActionForProject` — type `manual_task` par défaut.

- `dryRunOnly: true`
- `requiresConfirmation: true`
- `sourceActionId` préfixé `mpbridge-` pour traçabilité dans `/actions`

---

## 9. Ajout manuel à la queue

- **Uniquement** au clic utilisateur sur « Ajouter à la file »
- Statut forcé **`pending_review`** (API V1.9 existante)
- **Jamais** `approved` automatiquement
- **Jamais** exécuté

---

## 10. Conversation prompt

Exemple :

```text
Gigi, transforme cette mission acceptée en plan d'action détaillé : [titre].
Contexte : [raisons]. Risques : [risques]. Checklist : [checklist].
Reste en préparation uniquement, sans exécution.
```

Deep-link : `/conversation?ask=...`

Intent conversation : `mission_plan_bridge`

---

## 11. Limites de sécurité

- Pas d'exécution réelle
- Pas d'appel externe (GitHub, Supabase, n8n)
- Pas de modification de fichiers externes
- Pas de création de branche Git
- Pas d'approbation automatique d'action
- Pas de sync cloud

---

## 12. Exemple de bridge copiable

```markdown
# Mission-to-Plan Bridge — Gigi V2.7

Mission acceptée :
Corriger le build après erreur TypeScript

Objectif :
Transformer cette mission en plan d'action clair, validable et sans exécution automatique.

Plan proposé :
1. Identifier l'erreur.
2. Corriger le fichier ciblé.
...

Limite :
Ce bridge prépare la suite localement. Gigi ne lance aucune commande...
```

---

## 13. Ce que Gigi ne fait PAS

- N'accepte pas une mission automatiquement
- N'approuve pas une action dans la file
- N'exécute pas un plan
- Ne bypass pas la file V1.9
- Ne modifie pas `.env.local`
- Ne synchronise pas les décisions

---

## 14. UI

| Route | Intégration |
|-------|-------------|
| `/` | Panneau bridge sous décision acceptée (MissionDecisionCenter) |
| `/projects/[id]` | Bridge si mission acceptée pour ce projet |
| `/actions` | Badge « Origine · Bridge V2.7 » |
| `/history` | Liste des bridges récents |
| `/conversation` | Intent `mission_plan_bridge` |

---

## 15. Suite produit

**V2.8 — Safe Action Workspace** (planned) : espace sécurisé autour d'une action validée (contexte, plan, risques, logs, review, follow-ups, checklist avant exécution manuelle).

Voir [ROADMAP.md](./ROADMAP.md).
