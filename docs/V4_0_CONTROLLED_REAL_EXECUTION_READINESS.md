# Gigi V4.0 — Controlled Real Execution Readiness

> **Phrase produit V4 :** « Gigi ne fait pas encore tout. Mais il devient capable de demander le droit d'agir. »

Version: `4.0`  
Status: Implementation (readiness / simulation — no real execution)  
Branch: `v4.0-controlled-real-execution-readiness`

---

## 1. Objectif

Préparer le futur « Gigi, fais-le » avec des garde-fous explicites **sans** brancher d'exécution réelle en V4.0.

Gigi peut :

- préparer une **demande d'autorisation** locale ;
- déclarer le **risque** et le **périmètre** (scopes) ;
- proposer un **plan de rollback** ;
- tracer un **audit trail** local ;
- imposer le **dry-run** par défaut ;
- demander une **validation forte** de l'utilisateur.

Gigi ne peut **pas** en V4.0 :

- exécuter shell, Git, GitHub, n8n, API, email, calendrier ;
- modifier des fichiers externes ;
- appeler un service externe ;
- approuver ou compléter une action automatiquement.

---

## 2. Différence V3 vs V4

| V3 (livré) | V4.0 (readiness) |
|------------|------------------|
| Mission → action → handoff manuel → rapport → apprentissage | + couche **permission / risque / scope** |
| L'utilisateur exécute toujours hors Gigi | Gigi **demande le droit** de préparer une future exécution |
| Pas de modèle de capacité | Capacités typées + policy |
| Dry-run implicite | Dry-run **obligatoire** ; « Approuver dry-run » ≠ exécuter |

---

## 3. Pourquoi des garde-fous

Un OS mission-first ne doit pas promettre une autonomie qu'il n'a pas. V4.0 pose le contrat :

1. **Permission explicite** — rien sans l'utilisateur.
2. **Scope** — ce qui est autorisé vs interdit.
3. **Risque** — low → blocked.
4. **Rollback** — comment revenir en arrière.
5. **Audit** — trace locale de simulation.
6. **Connecteurs plus tard** — un par un, avec validation.

---

## 4. Module `executionReadiness`

Chemin : `modules/executionReadiness/`

| Fichier | Rôle |
|---------|------|
| `types.ts` | Types, clé localStorage autorisée |
| `executionReadinessPolicy.ts` | Capacités dry-run / approval / blocked |
| `executionReadinessRisk.ts` | Scoring risque |
| `executionReadinessStore.ts` | Persistance locale |
| `executionReadinessService.ts` | CRUD, décisions, création depuis action |
| `executionReadinessFormatter.ts` | Labels FR |
| `executionReadinessSummary.ts` | Résumé global |
| `executionReadinessConversation.ts` | Intent conversation V4 |

---

## 5. Clé localStorage

**Autorisée V4.0 :** `gigi-os-v40-execution-readiness`

Contenu :

- demandes d'autorisation préparées ;
- scopes, risques, statuts dry-run ;
- notes de permission ;
- audit trail local de simulation.

**Interdit :** secrets, tokens, credentials, résultat d'exécution réelle, autorisation permanente dangereuse.

---

## 6. UI

Chemin : `components/executionReadiness/`

Intégrations :

- **`/`** — indication V4 légère + statut demande active
- **`/actions`** — panneau « Préparation exécution contrôlée »
- **`/history`** — section compacte + lien /actions
- **Conversation** — intents « Gigi fais-le », « prépare l'exécution », « quels risques ? », etc.

Boutons locaux uniquement :

- Approuver dry-run
- Refuser
- Demander plus de contexte
- Marquer simulation seulement
- Archiver

Aucun bouton n'exécute.

---

## 7. Critères d'acceptation V4.0

- [ ] L'utilisateur comprend que Gigi **ne peut pas encore agir seul**
- [ ] Chaque demande a risque, scope, rollback
- [ ] Rien n'est exécuté automatiquement
- [ ] Build OK, lint ciblé V4 OK
- [ ] Aucune clé localStorage existante cassée
- [ ] auth / providers / Supabase non modifiés

---

## 8. Prochaines étapes — V4.1 (non codée)

**V4.1 — Execution Permission Center**

- historique des permissions ;
- expiration ;
- confirmation forte ;
- scopes réutilisables ;
- journal local enrichi ;
- toujours **aucun connecteur réel** sans validation explicite.

---

## 9. Conclusion

V4.0 pose le socle de sécurité pour le futur « Gigi, fais-le ».  
Statut : **readiness livrée en simulation** — exécution réelle reportée à V4.1+ connecteur par connecteur.
