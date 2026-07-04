# Gigi OS — Plan d'intégration Supabase

> **Supabase est la mémoire de Gigi.**

Version: `0.1`
Status: Spécification produit (documentation uniquement)
Owner: Germain Caplain
Purpose: Préparer l'intégration future de Supabase comme couche de mémoire persistante de Gigi OS (V0.4). Aucun code, aucune dépendance, aucune connexion pour l'instant.

---

# 1. Objectif

Aujourd'hui, Gigi OS est **100 % local** :

- état React
- localStorage (`gigi-os-v03-state`)
- moteur de décision déterministe
- cerveau conversationnel local
- historique local

Gigi ne se souvient de rien au-delà du navigateur courant. Vider le cache, changer d'appareil, et tout est perdu.

**Supabase deviendra la vraie mémoire persistante de Gigi OS en V0.4.**

Il permettra de :

- utiliser Gigi sur plusieurs appareils
- conserver un véritable historique de projets
- stocker les missions et les décisions
- préparer le raisonnement IA futur (V0.5)
- préparer les automatisations n8n futures (V0.6)
- préparer les outils connectés futurs (V0.7)

Supabase n'ajoute **aucune intelligence**. Il ajoute **la persistance**. C'est le socle sur lequel tout le reste s'appuiera.

---

# 2. Placement dans la roadmap

```text
V0.3.x — Cerveau local et conversation   → tout en local, déterministe, sans réseau
V0.4   — Mémoire Supabase                → persistance réelle, multi-appareils, auth
V0.5   — Raisonnement assisté par IA     → meilleures décisions, sur mémoire stable
V0.6   — Couche d'exécution n8n          → actions externes avec confirmation
V0.7   — Outils connectés                → Gmail, Calendar, GitHub, Drive
V1.0   — Assistant quotidien autonome    → orchestration, permissions, logs
```

Règle : **la mémoire vient avant le raisonnement, le raisonnement avant l'exécution.**
On ne construit pas l'IA ni les automatisations tant que la mémoire n'est pas stable.

---

# 3. Modèle de données principal

Tables futures (SQL à créer en V0.4, pas maintenant).

### `profiles`

| Colonne | Type | Notes |
|---|---|---|
| id | uuid (PK) | = auth user id |
| email | text | |
| display_name | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `projects`

| Colonne | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK → profiles.id) | propriétaire |
| name | text | |
| description | text | |
| status | text | voir §5 |
| priority | text | critical / high / medium / low |
| strategic_value | int | 1–10 |
| business_impact | int | 1–10 |
| completion_proximity | int | 1–10 |
| urgency | int | 1–10 |
| clarity | int | 1–10 |
| effort_efficiency | int | 1–10 |
| risk_of_delay | int | 1–10 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `missions`

| Colonne | Type | Notes |
|---|---|---|
| id | uuid (PK) | id stable conservé depuis le catalogue local |
| user_id | uuid (FK) | |
| project_id | uuid (FK → projects.id) | |
| title | text | |
| reason | text | |
| status | text | voir §4 |
| score | int | score de décision |
| estimated_time | text | ex. « ~45 min » |
| impact | int | 1–10 |
| clarity | int | 1–10 |
| effort | int | 1–10 |
| tags | text[] | ex. { revenue, launch } |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| completed_at | timestamptz | null tant que non terminée |

### `history_events`

| Colonne | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK) | |
| project_id | uuid (FK, nullable) | |
| mission_id | uuid (FK, nullable) | |
| type | text | voir §6 |
| title | text | |
| description | text | |
| metadata | jsonb | données libres |
| created_at | timestamptz | |

### `conversation_messages`

| Colonne | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK) | |
| role | text | user / gigi |
| content | text | |
| detected_intent | text | intention détectée localement |
| recommended_mission_id | uuid (FK, nullable) | |
| created_at | timestamptz | |

### `decision_logs`

| Colonne | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK) | |
| selected_project_id | uuid (FK) | |
| selected_mission_id | uuid (FK) | |
| score_breakdown | jsonb | détail des critères |
| why_selected | text | |
| why_not_others | jsonb | raisons par projet écarté |
| created_at | timestamptz | |

### `autonomy_logs`

| Colonne | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK) | |
| action_type | text | internal / preparation / external / sensitive |
| project_id | uuid (FK, nullable) | |
| mission_id | uuid (FK, nullable) | |
| autonomy_level | int | 0–5 (voir AUTONOMY_LEVELS.md) |
| confirmation_required | boolean | |
| confirmation_status | text | auto / confirmed / rejected |
| result | text | success / failure / cancelled |
| created_at | timestamptz | |

### `user_settings`

| Colonne | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK) | |
| preferred_language | text | ex. « fr » |
| autonomy_level | int | plafond d'autonomie autorisé |
| daily_brief_time | time | heure du brief quotidien |
| focus_mode | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

# 4. Statuts de mission

```text
recommended       — proposée par Gigi comme priorité
available         — disponible dans le catalogue, non recommandée aujourd'hui
in_progress       — démarrée par l'utilisateur
completed         — terminée (ne doit plus être recommandée)
postponed         — reportée, gardée en mémoire
rejected_for_now  — refusée pour l'instant
archived          — retirée du flux actif
```

Note de cohérence : la V0.3 locale utilise déjà `recommended`, `in_progress`, `completed`, `postponed`, `rejected_for_now`. Supabase ajoute `available` et `archived` pour un cycle de vie complet.

---

# 5. Statuts de projet

```text
active     — projet en cours, éligible aux missions
paused     — en pause, missions prudentes uniquement
completed  — terminé
future     — idée pour plus tard
archived   — rangé, hors du flux
```

---

# 6. Types d'événements d'historique

```text
mission_recommended          — Gigi a recommandé une mission
mission_applied              — l'utilisateur a appliqué la mission recommandée
mission_started              — mission démarrée
mission_completed            — mission terminée
mission_postponed            — mission reportée
mission_rejected             — mission refusée pour l'instant
project_created              — projet créé
project_updated              — projet modifié
decision_made                — une décision a été enregistrée
conversation_started         — début d'un échange avec Gigi
local_data_imported          — migration des données locales vers Supabase
autonomy_action_requested    — action autonome demandée (attente confirmation)
autonomy_action_completed    — action autonome exécutée
```

Ces types doivent rester **stables** : ils seront consommés plus tard par l'IA (V0.5) et n8n (V0.6). On n'ajoute pas de type sans raison claire.

---

# 7. Migration depuis localStorage

En V0.4, la première ouverture connectée doit **migrer proprement** l'état local existant.

Procédure :

1. **Lire** `gigi-os-v03-state` depuis localStorage.
2. **Mapper les projets locaux** → lignes `projects` (avec `user_id`).
3. **Mapper les missions locales** → lignes `missions` (conserver l'`id` stable du catalogue).
4. **Mapper l'historique local** → lignes `history_events`.
5. **Préserver `completedMissionIds`** : marquer les missions correspondantes en `completed` (+ `completed_at`).
6. **Éviter les doublons** : migration idempotente, basée sur les ids stables (une même mission n'est jamais importée deux fois).
7. **Garder les outils reset/dev séparés** : le « Réinitialiser les données locales » reste une action locale de développement, distincte de la migration ; il ne doit pas effacer les données Supabase.

Après migration, un événement `local_data_imported` est écrit dans `history_events`.

Principe : **la migration ne perd rien et ne duplique rien.**

---

# 8. Sécurité et confidentialité

- **Row Level Security (RLS) obligatoire** sur toutes les tables.
- Chaque ligne appartient à un `user_id`.
- Un utilisateur ne peut accéder **qu'à ses propres données** (policies `user_id = auth.uid()`).
- **Aucune donnée de projet publique par défaut.**
- Les **actions sensibles** (voir AUTONOMY_LEVELS.md) doivent être **journalisées** dans `autonomy_logs`.
- Les **intégrations externes futures** (Gmail, Calendar, GitHub…) exigeront une **permission explicite** par utilisateur.

La donnée de Gigi est personnelle. Le défaut est : privé, isolé, traçable.

---

# 9. Supabase Auth

- Connexion par **email** ou **magic link**.
- **Aucune auth en V0.3** — tout est local, anonyme, sur l'appareil.
- L'**auth démarre en V0.4**.
- Une fois l'auth active, `user_id` devient la **clé de propriété** de toutes les tables (et la base des policies RLS).

Tant que l'auth n'existe pas, aucune table Supabase n'existe : les deux arrivent ensemble en V0.4.

---

# 10. Architecture client / API (future)

Structure envisagée (à **ne pas** implémenter maintenant) :

```text
modules/supabase/client.ts               — initialisation du client
modules/supabase/queries/projects.ts     — lecture/écriture projets
modules/supabase/queries/missions.ts     — lecture/écriture missions
modules/supabase/queries/history.ts      — lecture/écriture historique
modules/supabase/sync/localToRemote.ts   — migration localStorage → Supabase
```

Le `GigiProvider` actuel resterait la source de vérité côté UI ; ces modules ne feraient que **remplacer la couche de persistance** (localStorage → Supabase), sans changer la logique métier ni l'interface.

Aucune ligne de code n'est écrite pour l'instant.

---

# 11. Checklist d'implémentation V0.4

```text
[ ] Créer le projet Supabase
[ ] Ajouter les variables d'environnement
[ ] Installer le client Supabase
[ ] Créer le schéma SQL (tables du §3)
[ ] Activer la Row Level Security (policies user_id)
[ ] Ajouter l'authentification (email / magic link)
[ ] Ajouter les requêtes projets
[ ] Ajouter les requêtes missions
[ ] Ajouter les requêtes historique
[ ] Migrer les données localStorage (§7)
[ ] Tester la persistance après refresh et changement d'appareil
[ ] Garder un fallback local si Supabase est indisponible
```

Le **fallback local** est essentiel : si Supabase ne répond pas, Gigi doit continuer à fonctionner en local, sans bloquer l'utilisateur.

---

# 12. Ce qu'il ne faut PAS faire encore

- **Ne pas ajouter d'IA avant que la mémoire soit stable.** (V0.5 après V0.4)
- **Ne pas ajouter n8n avant que le modèle d'événements soit stable.** (V0.6 après un `history_events` éprouvé)
- **Ne pas ajouter Gmail / Calendar / GitHub avant que l'auth et les permissions soient prêtes.** (V0.7)
- **Ne pas complexifier le MVP.** Une seule couche à la fois.

Chaque brique attend que la précédente soit solide.

---

# 13. Principe final

```text
Supabase   = la mémoire de Gigi
IA         = le raisonnement de Gigi
n8n        = la couche d'exécution de Gigi
```

Ces trois couches se construisent **dans cet ordre**, jamais en désordre.

Et quoi qu'il arrive, Gigi OS doit rester **mission-first** :

> **Une mission. Une raison. Une action.**

La mémoire existe pour mieux choisir cette mission — pas pour ajouter du bruit.
