# Gigi V4.3 — Human-Launched Command Packs

> **Phrase produit V4.3 :** « Gigi prépare des commandes à relire et copier — tu lances toi-même, hors Gigi. »

Version: `4.3`  
Status: Implemented (human-launched command packs — no real execution)  
Branch: `v4.3-human-launched-command-packs`

---

## 1. Objectif

Étendre V4.2 avec des **Command Packs** structurés : objectif humain, contexte, prérequis, commandes copiables ligne par ligne, risques, checklists et rollback — **sans exécution Gigi**.

---

## 2. Ce que V4.3 ajoute

| Fonctionnalité | Description |
|----------------|-------------|
| Modèle `CommandPack` | Pack local avec commandes, checklists, audit |
| Modèle `CommandPackCommand` | Texte à copier, explication, placeholders, risques |
| 6 templates | Git local, GitHub PR, n8n, browser, file edit, email draft |
| Génération depuis pont manuel | CTA depuis un `ManualExecutionPacket` V4.2 |
| Statuts déclaratifs | draft → ready → copied → marked run → success/failed |
| Export JSON + Markdown | Par pack ou export global |
| Route `/command-packs` | Panel complet |
| Intégrations | `/manual-bridge`, `/actions`, `/permissions`, `/settings`, `/history`, conversation |
| Schéma localStorage v3 | `commandPacks[]` sur clé existante |

---

## 3. Ce que V4.3 ne fait pas

- Exécution shell, Git, GitHub API, n8n, email, calendrier
- Connecteurs actifs ou adaptateurs réels
- Stockage secrets, tokens, credentials
- Permission permanente, auto-approbation, scheduler
- Sync cloud, import automatique, reset silencieux
- Modification Supabase, auth, providers, paiement

---

## 4. Command Pack model

Chemin : `modules/executionReadiness/commandPackTypes.ts`

Champs principaux : `id`, `title`, `humanGoal`, `commands[]`, `preflightChecklist`, `postRunChecklist`, `rollbackCommands`, `knownRisks`, `requiredSecretsNames` (noms uniquement), `auditTrail`, `disclaimer`.

TTL : 7 jours (comme V4.2).

---

## 5. Command model

Chaque `CommandPackCommand` contient :

- `commandText` — texte à copier, **jamais exécuté**
- `explanation` — ligne par ligne
- `placeholders` — ex. `<BRANCH_NAME>`, `<TOKEN_NAME_ONLY>`
- `failureSigns`, `rollbackHint` (optionnels)

---

## 6. Templates disponibles

Chemin : `modules/executionReadiness/commandPackTemplates.ts`

1. Git local manual pack  
2. GitHub PR manual checklist pack  
3. n8n manual workflow setup pack  
4. Browser manual checklist pack  
5. File edit manual checklist pack  
6. Email draft manual checklist pack  

Tous : sandbox, placeholders, aucun secret.

---

## 7. Relation avec V4.2 Manual Bridge

- `createCommandPackFromManualPacket(manualPacketId)` reprend le contexte V4.2
- Lien `sourceManualPacketId` conservé
- Audit `command_pack_created`
- Parcours produit : permission → pont manuel → pack de commandes

---

## 8. Statuts déclaratifs

| Statut | Signification |
|--------|---------------|
| `ready_for_review` | Pack préparé, à relire |
| `copied_by_human` | Copie déclarée localement |
| `marked_run_by_human` | Lancement déclaré — Gigi ne vérifie pas |
| `marked_success_by_human` | Succès déclaré par l'humain |
| `marked_failed_by_human` | Échec déclaré par l'humain |
| `cancelled` / `expired` | Clos localement |

---

## 9. Export JSON / Markdown

- Pack JSON : `gigi-command-pack-{id}.json`
- Pack Markdown : `gigi-command-pack-{id}.md`
- Global : `gigi-command-packs-v4-3-YYYY-MM-DD.json`
- Aucun envoi réseau

---

## 10. Gestion des secrets

- `requiredSecretsNames` = noms uniquement (ex. `GITHUB_TOKEN`)
- Jamais de valeur stockée dans Gigi
- Placeholders explicites à remplacer manuellement

---

## 11. Sécurité et wording

Policy : `isCommandPackExecutionBlocked()` = **true** toujours.

Wording autorisé : prépare, propose, commande à copier, lancement humain, validation humaine, statut déclaratif.

Wording interdit en UI : « Gigi exécute », « Gigi lance », « exécution automatique », « connecteur actif ».

---

## 12. Tests manuels

1. Ouvrir `/command-packs` — stats + templates
2. « Préparer ce pack » depuis un template Git
3. Copier une commande — vérifier audit `command_copied_by_human`
4. Marquer statuts déclaratifs (copié, lancé, succès)
5. Export JSON et Markdown d'un pack
6. Export global JSON
7. Depuis `/manual-bridge` — « Préparer un pack de commandes »
8. `/actions` — embed packs prêts à relire
9. `/permissions` — lien vers `/command-packs`
10. `/settings` — résumé V4.3
11. `/history` — journal command packs
12. Conversation : « prépare un pack de commandes », « quels packs sont prêts »
13. Recharger — persistance localStorage v3

---

## 13. Limites connues

- Expiration au chargement — pas de cron
- Aucune vérification d'exécution réelle
- Templates génériques — personnalisation manuelle requise
- Pas d'adaptateur local actif (prévu V4.4)

---

## 14. Préparation V4.4

**Local Review Runner / Read-Only Verification Layer** — couche de vérification locale en lecture seule, sans exécution destructive.

Voir [ROADMAP.md](./ROADMAP.md).

---

## Références

- [V4_2_REAL_CONNECTOR_SANDBOX_MANUAL_BRIDGE.md](./V4_2_REAL_CONNECTOR_SANDBOX_MANUAL_BRIDGE.md)
- [V4_1_EXECUTION_PERMISSION_CENTER.md](./V4_1_EXECUTION_PERMISSION_CENTER.md)
- [V4_EXECUTION_POLICY.md](./V4_EXECUTION_POLICY.md)
