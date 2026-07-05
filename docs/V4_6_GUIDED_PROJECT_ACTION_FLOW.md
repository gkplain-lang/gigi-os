# V4.6 — Guided Project Action Flow

> Parcours guidé depuis projet ou mission — orchestration visuelle des briques V4.0–V4.5, sans exécution réelle.

Version: `4.6`  
Status: Implemented (UI + local model)  
Branch: `v4.6-guided-project-action-flow`

---

## 1. Objectif

Créer un **parcours guidé** depuis une mission ou un projet pour que l'utilisateur comprenne :

1. quelle action préparer
2. pourquoi elle est utile
3. quel niveau de risque
4. quelle permission locale serait nécessaire
5. quel pont manuel préparer
6. quel pack de commandes générer
7. comment coller le résultat pour une revue locale

---

## 2. Ce que V4.6 ajoute

- Modèle `GuidedProjectActionFlow` (statuts déclaratifs locaux)
- 5 templates d'actions guidées (Git, GitHub PR, n8n, checklist, build review)
- Route `/guided-actions` + SideNav « Actions guidées »
- Intégrations : `/`, `/actions`, fiche projet, `/settings`, `/history`, `/conversation`
- Schéma localStorage v5 sur clé existante `gigi-os-v40-execution-readiness`

---

## 3. Ce que V4.6 ne fait pas

- Aucune exécution réelle
- Aucun connecteur actif
- Aucune auto-création silencieuse (flow créé uniquement par action explicite)
- Aucune permission permanente
- `completed_by_human` = déclaration locale, pas de vérification réelle

---

## 4. Modèle GuidedProjectActionFlow

Champs principaux : `id`, `title`, `projectId`, `missionId`, `status`, `actionGoal`, `riskLevel`, `steps[]`, liens optionnels vers request/packet/pack/review, `auditTrail[]`.

Statuts : `draft` → `action_selected` → … → `local_review_ready` → `completed_by_human` | `cancelled`.

---

## 5. Templates

| ID | Titre | Parcours |
|----|-------|----------|
| git-branch | Branche Git | permission → pont → pack → revue |
| github-pr | PR GitHub | idem |
| n8n-workflow | Workflow n8n | idem |
| launch-checklist | Checklist lancement | request → pack → revue |
| build-result-review | Résultat build | pack → revue |

---

## 6. Intégration projets

- `/projects/[projectId]` : section « Actions guidées possibles »
- CTA « Créer un parcours guidé » (action explicite)

---

## 7. Parcours Mission → Revue

Réutilise les routes V4 existantes — V4.6 **orchestre** sans dupliquer les moteurs.

---

## 8. Statuts déclaratifs

Tous les statuts et « marquer terminé » sont locaux et humains — aucune preuve automatique.

---

## 9. Stockage local

- Clé : `gigi-os-v40-execution-readiness`
- Version schéma : **5**
- Champ : `guidedProjectActionFlows[]`
- Compatible V4.0–V4.5 (fallback `[]`)

---

## 10. Sécurité et wording

Wording autorisé : « Gigi prépare », « parcours guidé », « tu valides », « aucune exécution réelle ».

Interdit en promesse UI : « Gigi exécute », « Gigi lance », « connecteur actif », etc.

---

## 11. Tests manuels

1. `/guided-actions` — créer un flow depuis un modèle
2. Marquer étapes, relier entités existantes, terminer/annuler
3. `/` — strip « Action guidée du jour »
4. Fiche projet — section actions guidées
5. `/actions` — embed flows actifs
6. `/settings` et `/history` — résumés V4.6
7. Conversation : « guide-moi sur ce projet », « crée un parcours guidé »

---

## 12. Limites connues

- Relier entités = première entité existante (pas de picker avancé)
- Navigation quick-start via `window.location` (action utilisateur explicite)
- Pas de deep-link mission auto sans clic

---

## 13. Préparation V4.7

**Project Mission Composer / Daily Guided Execution** — composition mission quotidienne avec contexte projet pré-rempli, toujours sous validation humaine.
