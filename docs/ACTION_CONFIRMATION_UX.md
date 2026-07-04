# Gigi OS — Action Confirmation UX (V0.6.2)

Version: `0.6.2`  
Status: Dry-run confirmation only — no real execution  
Purpose: UX de confirmation pour les Action Proposals V0.6.

---

## 1. Objectif V0.6.2

Après V0.6 (agents foundation) et V0.6.1 (daily review), Gigi peut **proposer** des actions en dry-run.

V0.6.2 ajoute une **UX de confirmation** pour que l'utilisateur comprenne clairement :

- ce que Gigi veut préparer ;
- pourquoi ;
- le projet concerné ;
- le risque ;
- ce qui sera fait en simulation ;
- ce qui ne sera **pas** fait ;
- le statut dry-run ;
- la possibilité de confirmer localement — sans effet externe.

Promesse : *« Tu confirmes la préparation, jamais l'exécution réelle. »*

---

## 2. Pourquoi confirmation obligatoire

| Raison | Détail |
|--------|--------|
| Sécurité | Éviter toute exécution accidentelle |
| Clarté | L'utilisateur voit risques et limites |
| Progression | Prépare V0.7+ (confirmation → action réelle contrôlée) |
| Garde-fou | Aligné sur `level_1_prepare_only` |

---

## 3. États de confirmation

| État | Signification |
|------|---------------|
| `pending_confirmation` | En attente — boutons actifs |
| `confirmed_dry_run` | Confirmé — simulation locale uniquement |
| `blocked` | Action réelle interdite — plan préparatoire possible |
| `expired` | Expiré (réservé) |
| `cancelled` | Annulé par l'utilisateur |

Module : `modules/agents/confirmation/confirmationState.ts`

---

## 4. Dry-run vs action réelle

| | Dry-run (V0.6.2) | Action réelle |
|---|------------------|---------------|
| Effet externe | **Aucun** | Interdit |
| Gmail / Calendar / GitHub | Non | Non |
| n8n | Non | Non |
| Supabase sync/restore | Non | Non |
| Résultat | Plan simulé local | Bloqué |

Message utilisateur :

> Aucune action externe ne sera exécutée.

---

## 5. Actions interdites en réel

Identiques à V0.6 : `merge_branch`, `sync_supabase`, `send_email`, etc.

Comportement V0.6.2 :
- `blockedReason` affiché ;
- bouton « Préparer le plan » → `simulateBlockedActionPlan()` ;
- statut `blocked` ou `confirmed_dry_run` selon action utilisateur.

---

## 6. Intégration conversation

Composant : `components/conversation/ActionProposalCard.tsx`

Affichage :
- titre, description, projet, risque, résultat attendu ;
- statut dry-run + confirmation requise ;
- section risques (will do / will not do) ;
- boutons : **Préparer en dry-run**, **Annuler**, **Voir les risques**.

Pipeline inchangé :

```
askAiBrain → applyDecisionQuality → applyAgentProposals → applyDailyReviewEnrichment
```

Les proposals passent par `applyConfirmationDefaults()` (`confirmationRequired: true`).

---

## 7. Dev

Route `/dev/agents` — panneau **Confirmation UX (V0.6.2)** :
- état exemple ;
- actions confirmables dry-run ;
- actions bloquées ;
- rappel : exécution réelle désactivée.

---

## 8. Tests manuels

1. « Gigi, update la bibliothèque Buildy Crafts » → proposal + confirmation
2. « merge cette branche » → bloqué + plan préparatoire
3. « prépare un agent n8n » → plan dry-run sans n8n
4. Clic « Préparer en dry-run » → message simulation, pas d'API
5. Clic « Annuler » → statut cancelled
6. `/dev/agents` → panneau confirmation UX
7. Fallback local sans OpenAI → OK

---

## 9. Fichiers clés

```text
modules/agents/confirmation/
  types.ts, confirmationState.ts, confirmationCopy.ts
  confirmationSafety.ts, confirmationSummary.ts, index.ts

components/conversation/ActionProposalCard.tsx
components/conversation/GigiAnswer.tsx
modules/agents/actionProposal.ts — applyConfirmationDefaults
modules/agents/actionDryRun.ts — simulateBlockedActionPlan
docs/ACTION_CONFIRMATION_UX.md
```

---

## 10. Futur (V0.7+)

- `level_2_confirmed_action` — exécution réelle après double confirmation
- Historique `action_confirmed_dry_run` / `action_confirmed_real`
- Expiration automatique des proposals
