# Gigi OS — Plan d'intégration n8n

> **Gigi décide. n8n exécute.**

Version: `0.1`
Status: Spécification produit (documentation uniquement)
Owner: Germain Caplain
Purpose: Préparer l'intégration future de n8n comme couche d'exécution de Gigi OS (V0.6). Aucun workflow, aucune dépendance, aucun webhook réel pour l'instant.

---

# 1. Objectif

**n8n n'est pas le cerveau de Gigi OS.**

- **Gigi décide** — il choisit la mission prioritaire et la raison.
- **n8n exécute** — il déclenche les actions concrètes, plus tard, à la demande de Gigi.

n8n servira à **connecter Gigi OS aux outils et workflows externes** (Gmail, Calendar, GitHub, Drive, Telegram…), une fois la mémoire et le raisonnement en place.

n8n n'ajoute aucune décision. Il transforme une décision déjà prise en action concrète, **sous contrôle**.

Tant que Gigi ne sait pas encore décider proprement (mémoire stable, raisonnement fiable), n8n n'a aucune raison d'exister.

---

# 2. Placement dans la roadmap

```text
V0.3.x — Cerveau local et conversation   → local, déterministe, sans réseau
V0.4   — Mémoire Supabase                → persistance, multi-appareils, auth
V0.5   — Raisonnement assisté par IA     → meilleures décisions
V0.6   — Couche d'exécution n8n          → actions externes avec confirmation
V0.7   — Outils connectés                → Gmail, Calendar, GitHub, Drive, Telegram
V1.0   — Assistant quotidien autonome    → orchestration, permissions, logs
```

n8n arrive en **V0.6**, après la mémoire (V0.4) et le raisonnement (V0.5). Jamais avant.

---

# 3. Séparation des rôles

```text
Gigi OS                              = système de décision (le cerveau)
Supabase                             = mémoire (persistance)
IA                                   = raisonnement et langage
n8n                                  = workflows d'exécution
GitHub / Gmail / Calendar /
Drive / Telegram                     = outils externes (les mains)
```

Chaque couche a **un seul rôle**. On ne mélange pas :

- Gigi ne stocke pas → c'est Supabase.
- Gigi ne « fait » pas les emails → c'est n8n via Gmail.
- n8n ne décide pas quelle mission compte → c'est Gigi.

Cette séparation stricte est ce qui garde le système simple et sûr.

---

# 4. Modèle d'événements

Gigi émet des **événements**. n8n s'y abonne et déclenche des workflows. Voici les événements futurs.

### `mission_selected`
- **Déclencheur** : Gigi recommande une mission (moteur de décision).
- **Payload** : `user_id`, `mission_id`, `project_id`, `score`, `reason`.
- **Workflow n8n** : préparer les sorties liées à la mission (checklist, prompt).
- **Confirmation** : non (préparation interne).

### `mission_started`
- **Déclencheur** : l'utilisateur démarre la mission.
- **Payload** : `user_id`, `mission_id`, `started_at`.
- **Workflow n8n** : démarrer un minuteur / focus, préparer un rappel.
- **Confirmation** : non.

### `mission_completed`
- **Déclencheur** : l'utilisateur termine la mission.
- **Payload** : `user_id`, `mission_id`, `completed_at`.
- **Workflow n8n** : mettre à jour la mémoire, suggérer la prochaine mission.
- **Confirmation** : non (interne).

### `mission_postponed`
- **Déclencheur** : mission reportée.
- **Payload** : `user_id`, `mission_id`.
- **Workflow n8n** : reprogrammer un rappel.
- **Confirmation** : non.

### `mission_rejected_for_now`
- **Déclencheur** : mission refusée pour l'instant.
- **Payload** : `user_id`, `mission_id`.
- **Workflow n8n** : noter l'écart, ré-évaluer plus tard.
- **Confirmation** : non.

### `project_created`
- **Déclencheur** : création d'un projet.
- **Payload** : `user_id`, `project_id`, `name`.
- **Workflow n8n** : initialiser un espace lié (optionnel).
- **Confirmation** : non.

### `project_updated`
- **Déclencheur** : modification d'un projet.
- **Payload** : `user_id`, `project_id`, `changes`.
- **Workflow n8n** : recalculer les priorités liées.
- **Confirmation** : non.

### `daily_brief_requested`
- **Déclencheur** : planifié (chaque matin) ou manuel.
- **Payload** : `user_id`, `date`.
- **Workflow n8n** : générer et envoyer le brief du jour.
- **Confirmation** : non (sortie interne) — **oui** si envoi externe (email/Telegram).

### `cursor_prompt_requested`
- **Déclencheur** : l'utilisateur demande un prompt Cursor.
- **Payload** : `user_id`, `mission_id`, `context`.
- **Workflow n8n** : préparer un prompt structuré.
- **Confirmation** : non (préparation).

### `github_review_requested`
- **Déclencheur** : demande de revue d'activité d'un dépôt.
- **Payload** : `user_id`, `repo`, `range`.
- **Workflow n8n** : résumer l'activité du dépôt (lecture seule).
- **Confirmation** : non en lecture — **oui** pour toute écriture.

### `content_plan_requested`
- **Déclencheur** : demande de plan de contenu.
- **Payload** : `user_id`, `project_id`, `objective`.
- **Workflow n8n** : préparer un plan de contenu (brouillon).
- **Confirmation** : non (brouillon) — **oui** pour publier.

### `autonomy_action_requested`
- **Déclencheur** : Gigi propose une action externe.
- **Payload** : `user_id`, `action_type`, `mission_id`, `details`.
- **Workflow n8n** : préparer l'action, **attendre confirmation**.
- **Confirmation** : **oui**.

### `autonomy_action_confirmed`
- **Déclencheur** : l'utilisateur confirme l'action.
- **Payload** : `user_id`, `action_id`, `confirmation_status`.
- **Workflow n8n** : exécuter l'action confirmée.
- **Confirmation** : déjà donnée.

### `autonomy_action_completed`
- **Déclencheur** : l'action externe est terminée.
- **Payload** : `user_id`, `action_id`, `result`.
- **Workflow n8n** : journaliser dans `autonomy_logs`.
- **Confirmation** : non (post-exécution).

---

# 5. Premiers workflows à construire (plus tard)

### Workflow 1 — Brief quotidien de Gigi
- **Déclencheur** : planifié chaque matin.
- **Action** : envoyer le résumé de la mission du jour.

### Workflow 2 — Mission terminée
- **Déclencheur** : `mission_completed`.
- **Action** : mettre à jour la mémoire et suggérer la prochaine mission.

### Workflow 3 — Générateur de prompt Cursor
- **Déclencheur** : `cursor_prompt_requested`.
- **Action** : préparer un prompt structuré pour Cursor.

### Workflow 4 — Veille projet GitHub
- **Déclencheur** : manuel ou planifié.
- **Action** : résumer l'activité du dépôt (lecture seule).

### Workflow 5 — Poussée revenu Buildy Clear
- **Déclencheur** : sélection d'une mission revenu.
- **Action** : préparer checklist de lancement, idées de contenu et rappels.

### Workflow 6 — Compagnon Gigi sur Telegram
- **Déclencheur** : message Telegram.
- **Action** : envoyer l'objectif à Gigi et renvoyer la recommandation de mission.

### Workflow 7 — Gardien d'agenda
- **Déclencheur** : quotidien ou manuel.
- **Action** : vérifier le temps disponible et ajuster la taille de la mission.

Chaque workflow commence en **lecture seule ou préparation**. Les effets externes n'arrivent qu'avec confirmation (§6).

---

# 6. Règles de sécurité

n8n ne fait **jamais** ce qui suit sans confirmation explicite :

- envoyer des emails
- publier du contenu
- modifier une branche de production GitHub
- supprimer des fichiers
- effectuer un paiement ou une action Stripe
- partager des données privées

Et dans tous les cas :

- **Toute action externe est journalisée** (`autonomy_logs`).
- **L'utilisateur peut désactiver chaque workflow**, individuellement.
- Un workflow indisponible ne bloque pas Gigi : la décision reste prise, l'exécution attend.

Principe : **rien d'externe ne part sans un “oui” humain, et tout est traçable.**

---

# 7. Lien avec les niveaux d'autonomie

Voir `docs/AUTONOMY_LEVELS.md` pour la définition complète.

```text
Niveau 0 — Conseil uniquement       → n8n inutile
Niveau 1 — Préparation              → n8n inutile (Gigi prépare seul)
Niveau 2 — Mémoire interne          → mémoire interne uniquement, pas d'action externe
Niveau 3 — Actions avec confirmation → workflows n8n déclenchés, confirmation obligatoire
Niveau 4 — Actions sûres auto        → workflows automatiques à faible risque (interne)
Niveau 5 — Orchestration multi-agents → coordination de workflows, avec permissions et logs
```

n8n **n'entre en jeu qu'à partir du niveau 3**. En dessous, tout se fait dans Gigi, en local ou en mémoire.

---

# 8. Prérequis de données avant n8n

Avant tout workflow n8n, il faut que la mémoire (Supabase, voir `docs/SUPABASE_PLAN.md`) fournisse :

- les **tables Supabase** créées et stables
- un **`user_id` stable** (auth active)
- des **ids de projet stables**
- des **ids de mission stables** (conservés depuis le catalogue local)
- la table **`history_events`** opérationnelle
- la table **`autonomy_logs`** opérationnelle
- un **schéma de payload d'événement** figé
- un **modèle de permissions** clair

Sans ces fondations, n8n déclencherait des actions sur des données instables → chaos. On attend.

---

# 9. Brouillon de contrat webhook

Exemples d'endpoints futurs (à **ne pas** implémenter maintenant).

```text
POST /api/events/mission-selected
POST /api/events/mission-completed
POST /api/actions/request-cursor-prompt
POST /api/actions/request-daily-brief
POST /api/actions/confirm-autonomy-action
```

### `POST /api/events/mission-selected`
```json
{
  "user_id": "uuid",
  "mission_id": "bc-sales-page",
  "project_id": "buildy-clear",
  "score": 86,
  "reason": "Le plus proche du revenu court terme.",
  "created_at": "2026-07-04T09:00:00Z"
}
```

### `POST /api/events/mission-completed`
```json
{
  "user_id": "uuid",
  "mission_id": "bc-sales-page",
  "project_id": "buildy-clear",
  "completed_at": "2026-07-04T10:15:00Z"
}
```

### `POST /api/actions/request-cursor-prompt`
```json
{
  "user_id": "uuid",
  "mission_id": "bc-sales-page",
  "context": "Finaliser la page de vente Buildy Clear",
  "confirmation_required": false
}
```

### `POST /api/actions/request-daily-brief`
```json
{
  "user_id": "uuid",
  "date": "2026-07-04",
  "delivery": "internal",
  "confirmation_required": false
}
```

### `POST /api/actions/confirm-autonomy-action`
```json
{
  "user_id": "uuid",
  "action_id": "uuid",
  "action_type": "external",
  "confirmation_status": "confirmed",
  "confirmed_at": "2026-07-04T10:20:00Z"
}
```

Chaque payload transporte toujours `user_id` (propriété + RLS) et, pour les actions, un champ `confirmation_required`.

---

# 10. Ce qu'il ne faut PAS automatiser tôt

- les **paiements**
- les **déploiements en production**
- la **publication publique** de contenu
- les **emails de masse**
- les **opérations destructrices** sur les fichiers
- les **workflows manipulant des données personnelles sensibles**

Ces actions restent **manuelles et confirmées** jusqu'à ce que le système de permissions et de logs soit pleinement éprouvé.

---

# 11. Checklist d'implémentation V0.6

```text
[ ] Créer l'espace de travail n8n
[ ] Créer le premier webhook
[ ] Définir les types de payload d'événement
[ ] Connecter les événements Supabase
[ ] Créer le workflow « brief quotidien »
[ ] Créer le workflow « mission terminée »
[ ] Ajouter la couche de confirmation
[ ] Ajouter les journaux d'autonomie (autonomy_logs)
[ ] Tester en local
[ ] Tester avec un seul workflow sûr d'abord
```

On démarre avec **un seul workflow sûr** (lecture ou préparation), on valide, puis on élargit.

---

# 12. Principe final

> **n8n existe pour exécuter les décisions de Gigi, pas pour créer plus de chaos.**

n8n ne décide rien. Il agit, sous contrôle, sur ce que Gigi a déjà décidé.

Et la mission reste la même :

> **Une mission. Une raison. Une action.**
