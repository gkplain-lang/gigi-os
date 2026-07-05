# V2.8 — Safe Action Workspace

> **Un poste de pilotage local autour d'une action — sans exécution, sans vérification repo.**

Version: `2.8`  
Status: Implemented (local aggregation only)  
Product: **Gigi**

---

## 1. Objectif

Centraliser **tout le contexte local** autour d'une action (file V1.9, plan V2.0, log V2.1, review V2.2, follow-ups V2.3, historique V2.4, bridge V2.7) pour préparer une **exécution manuelle sûre**.

Gigi **n'exécute rien** et **ne vérifie pas** Git, le build ou GitHub.

---

## 2. Plan d'exécution V2.0 vs Workspace V2.8

| V2.0 Execution Plan | V2.8 Safe Action Workspace |
|---------------------|----------------------------|
| Plan d'exécution sécurisé pour une action validée | **Vue agrégée** de toute la chaîne produit |
| Étapes, commandes théoriques, tests | + log, review, follow-ups, historique, bridge |
| Créé depuis action `approved` | Accessible depuis `pending_review` ou `approved` |
| Clé `gigi-os-v20-execution-plans` | Clé `gigi-os-v28-safe-action-workspaces` |

---

## 3. Stockage

Clé localStorage : **`gigi-os-v28-safe-action-workspaces`**

Structure : `{ workspaces, lastUpdatedAt, version }`

---

## 4. Sources

| Source | Description |
|--------|-------------|
| `action_queue` | Action dans la file V1.9 |
| `prepared_action` | Action préparée V1.8 |
| `execution_plan` | Plan V2.0 déjà généré |
| `follow_up_action` | (réservé) |
| `mission_plan_bridge` | Action issue d'un bridge V2.7 |
| `manual` | Fallback |

---

## 5. Statuts workspace

| Statut | Signification |
|--------|---------------|
| `draft` | Brouillon |
| `ready` | Prêt à préparer |
| `in_review` | Action en pending_review |
| `blocked` | Blocage signalé localement |
| `needs_context` | Contexte incomplet |
| `manually_running` | Log « started » |
| `completed_manually` | Terminé manuellement |
| `archived` | Archivé |

---

## 6. Readiness (indicatif)

| Readiness | Signification |
|-----------|---------------|
| `ready` | Action claire, plan/étapes, checklist OK |
| `missing_context` | Plan ou objectif manquant |
| `risky` | Risques élevés, test_failed, review needs_fix |
| `blocked` | Log blocked ou finding critical |
| `unclear` | Statut ambigu ou données contradictoires |

Le readiness **n'est pas une vérification réelle** du repo.

---

## 7. Sections agrégées

| Type | Contenu |
|------|---------|
| `action_summary` | Action préparée V1.8 |
| `mission_context` | Origine bridge V2.7 |
| `project_context` | Projet lié |
| `execution_plan` | Plan V2.0 |
| `execution_logs` | Journal V2.1 |
| `execution_review` | Review V2.2 |
| `follow_ups` | Propositions V2.3 |
| `history` | Entrées V2.4 |
| `risks` | Risques agrégés |
| `prerequisites` | Prérequis |
| `validation_checklist` | Checklist sécurité |
| `manual_steps` | Commandes théoriques copiables |
| `safety` | Disclaimer |
| `notes` | Notes utilisateur |

---

## 8. Checklist minimale

- Objectif compris
- Périmètre limité
- Risques relus
- Plan relu
- Commandes non exécutées par Gigi
- Exécution manuelle uniquement
- Résultat à logger après exécution
- Review à générer après exécution

Cocher/décocher **localement** dans le workspace.

---

## 9. Contexte Cursor copiable

Format markdown avec objectif, plan, risques, checklist obligatoire, étapes manuelles et commandes théoriques (si plan V2.0).

**À copier manuellement** — Gigi ne lance rien.

---

## 10. Limites de sécurité

- Pas d'exécution réelle
- Pas d'appel externe
- Pas de modification de fichiers
- Pas d'approbation automatique d'action
- Pas de marquage « terminé » automatique
- Données **locales déclarées** uniquement

---

## 11. Ce que Gigi ne fait PAS

- Ne lance aucune commande
- Ne vérifie pas GitHub / Git / build
- N'approuve pas une action automatiquement
- Ne marque pas une action terminée
- Ne bypass pas V1.9 ni V2.0
- Ne synchronise rien dans le cloud

---

## 12. UI

| Route | Intégration |
|-------|-------------|
| `/actions` | Bouton « Ouvrir workspace » sur cartes pending_review / approved |
| `/history` | Workspaces récents |
| `/conversation` | Intent `safe_action_workspace` |

---

## 13. Suite produit

**V2.9 — Manual Execution Handoff** (planned) : paquet de passation manuel vers Cursor ou humain (contexte, instructions, commandes théoriques, checklist, critères de succès, rapport attendu).

Voir [ROADMAP.md](./ROADMAP.md).
