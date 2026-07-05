# Gigi V4.4 — Local Review Runner / Read-Only Verification Layer

> **Phrase produit V4.4 :** « Colle un résultat obtenu manuellement — Gigi l'analyse localement, sans lire ton terminal. »

Version: `4.4`  
Status: Implemented (read-only local review — no real verification)  
Branch: `v4.4-local-review-runner-read-only-verification`

---

## 1. Objectif

Ajouter une couche de **revue locale read-only** : l'utilisateur colle un résultat (terminal, log, réponse GitHub/n8n, note), Gigi analyse le texte avec des règles prudentes et produit un statut probable — **sans exécution, sans lecture système, sans API**.

---

## 2. Ce que V4.4 ajoute

| Fonctionnalité | Description |
|----------------|-------------|
| `LocalReviewSession` | Session de revue locale avec signaux et statut probable |
| `LocalReviewInput` | Contenu collé par l'utilisateur |
| Détection de signaux | success / warning / error keywords locaux |
| Détection prudente secrets | token, password, ghp_, sk-, bearer, etc. |
| Génération depuis Command Pack | CTA depuis V4.3 |
| Export JSON + Markdown | Par session ou global |
| Route `/local-review` | Panel complet |
| Intégrations | `/command-packs`, `/actions`, `/settings`, `/history`, conversation |
| Schéma localStorage v4 | `localReviewSessions[]` |

---

## 3. Ce que V4.4 ne fait pas

- Lire le terminal, fichiers, ou API
- Exécuter des commandes
- Vérifier GitHub/n8n/browser/email réellement
- Connecteurs actifs ou fetch réseau
- Stockage volontaire de secrets
- Permission permanente, auto-approbation, scheduler

---

## 4. Review Session model

Chemin : `modules/executionReadiness/localReviewTypes.ts`

Statuts probables : `likely_success`, `needs_attention`, `likely_failed`, `inconclusive` — **jamais garantis**.

---

## 5. Input collé par l'utilisateur

- `rawText` provient uniquement de l'utilisateur (textarea)
- Avertissement si motif sensible détecté
- Checkbox « J'ai retiré les secrets » avant sauvegarde si alerte

---

## 6. Détection locale de signaux

Chemin : `modules/executionReadiness/localReviewSignals.ts`

Keywords success/warning/error — analyse prudente, non exhaustive.

---

## 7. Détection prudente de secrets

Patterns : token, secret, password, private key, api_key, bearer, ghp_, sk-, webhook, .env

Alerte locale uniquement — Gigi n'envoie le contenu nulle part.

---

## 8. Relation avec V4.3 Command Packs

- `createReviewSessionFromCommandPack(commandPackId)` reprend expectedOutcome, failureSigns
- Parcours : pack → lancement humain → collage résultat → revue locale

---

## 9. Statuts probables et déclaratifs

| Statut | Signification |
|--------|---------------|
| `likely_success` | Signaux positifs — **pas garanti** |
| `likely_failed` | Signaux d'erreur — **pas vérifié** |
| `needs_attention` | Mix ou avertissements |
| `inconclusive` | Peu de signaux |

---

## 10. Export JSON / Markdown

- Session : `gigi-local-review-{id}.json` / `.md`
- Global : `gigi-local-reviews-v4-4-YYYY-MM-DD.json`

---

## 11. Sécurité et wording

- `isLocalReviewReadOnly()` = true
- `isLocalReviewExecutionBlocked()` = true
- Wording interdit : « Gigi vérifie réellement », « Gigi lit ton terminal »
- Wording autorisé : « analyse locale », « résultat collé », « statut probable »

---

## 12. Tests manuels

1. Ouvrir `/local-review` — stats + créer revue
2. Coller une sortie avec « error » — statut probable failed
3. Coller une sortie avec « success » — statut probable success
4. Coller texte avec `ghp_` — alerte secret
5. Depuis `/command-packs` — « Créer une revue locale »
6. `/actions` — embed revues en attente
7. `/settings` — résumé V4.4
8. `/history` — journal revue locale
9. Conversation : « analyse ce log », « est-ce que ça a marché »
10. Export JSON/Markdown
11. Recharger — persistance localStorage v4

---

## 13. Limites connues

- Détection keywords simple — pas d'IA d'analyse profonde
- Statuts probables uniquement
- Pas de vérification système réelle
- Pas d'adaptateur read-only actif (prévu V4.5)

---

## 14. Préparation V4.5

**Human-Gated Read-Only Adapters / Verified Manual Checks** — adaptateurs read-only strictement contrôlés, toujours avec validation humaine.

Voir [ROADMAP.md](./ROADMAP.md).

---

## Références

- [V4_3_HUMAN_LAUNCHED_COMMAND_PACKS.md](./V4_3_HUMAN_LAUNCHED_COMMAND_PACKS.md)
- [V4_EXECUTION_POLICY.md](./V4_EXECUTION_POLICY.md)
