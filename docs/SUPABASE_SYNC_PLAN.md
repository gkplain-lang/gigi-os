# Gigi OS — Plan de synchronisation Supabase

Version: `0.4.4`
Status: Fondation sync (manuelle, diagnostic)
Purpose: Préparer la migration future tout en gardant localStorage comme source de vérité.

---

## 1. Architecture localStorage-first

Gigi OS V0.4.x fonctionne ainsi :

```
┌─────────────────────────────────────┐
│  App (React)                        │
│  GigiProvider → gigi-os-v03-state     │  ← source principale
└──────────────┬──────────────────────┘
               │ sync manuelle (V0.4.4)
               ▼
┌─────────────────────────────────────┐
│  Supabase (RLS, auth.uid())         │  ← backup / diagnostic
└─────────────────────────────────────┘
```

**Règle d'or V0.4.4** : rien ne remplace localStorage automatiquement.

---

## 2. Pourquoi ne pas migrer trop vite

- L'app doit rester **utilisable offline** et sans compte.
- Les ids locaux (ex. `buildy-clear`, `bc-sales-page`) diffèrent des UUID Supabase — il faut une stratégie de mapping stable.
- Les statuts et champs locaux ne correspondent pas toujours 1:1 au schéma SQL.
- Une migration automatique prématurée pourrait **écraser** des données ou casser missions / historique.

V0.4.4 introduit mappers + repositories + sync **manuelle** pour valider le pipeline avant V0.4.5.

---

## 3. Stratégie local → remote (V0.4.4)

Module : `modules/supabase/sync/`

| Étape | Description |
|-------|-------------|
| Mapper | `Project`, `Mission`, `HistoryEvent` → rows Supabase |
| IDs stables | UUID déterministe par `localId + userId + entity` |
| Champs extra | Stockés dans `metadata` jsonb si pas de colonne |
| Upsert | `onConflict: id` — idempotent, pas de doublons |
| Auth | Requiert user connecté ; RLS `user_id = auth.uid()` |

**Sync manuelle** via `/dev/sync` → `syncLocalStateToSupabase(localState)`.

Ne modifie **pas** localStorage ni l'état React.

---

## 4. Stratégie remote → local (V0.4.5 diagnostic / V0.4.6+ restore)

V0.4.5 introduit le module `modules/persistence/` :

1. Charger snapshot Supabase (`loadRemoteSnapshot`) — **manuel**
2. Comparer avec état local via `evaluatePersistenceStrategy`
3. Afficher recommandation sur `/dev/persistence`
4. **Aucune** écriture localStorage en V0.4.5

Restore guidé avec consentement : **V0.4.6** (voir `docs/PERSISTENCE_STRATEGY.md`).

`loadRemoteSnapshot()` sert au diagnostic sur `/dev/sync` et `/dev/persistence`.

---

## 5. Conflits possibles

| Conflit | Risque | Mitigation future |
|---------|--------|-------------------|
| Même mission modifiée local + remote | Doublon ou état incohérent | Horodatage + `updated_at` |
| Id local vs UUID remote | Perte de lien | `metadata.local_id` + mapping stable |
| Statuts différents (`postponed` projet local → `paused` remote) | Sémantique | Metadata `original_status` |
| Historique types locaux vs SQL | Perte de granularité | `metadata.local_type` |
| Sync sans auth | RLS bloque | Statut `anonymous`, message clair |

---

## 6. Plan V0.4.5 — Stratégie de persistance ✅

- Module `modules/persistence/` — diagnostic local vs remote
- Page `/dev/persistence` — modes, recommandations, conflits
- **Aucune** migration ni restore automatique
- Voir `docs/PERSISTENCE_STRATEGY.md`

---

## 7. Plan V0.4.6 — Migration / restore guidé

- UI de comparaison local vs remote détaillée
- Import sélectif (projets, missions, historique)
- Première écriture localStorage depuis Supabase **avec consentement**
- Journal de migration dans `history_events`

---

## 8. Plan V0.4.7 — Sync continue (optionnelle)

- Sync background après actions importantes (mission terminée)
- File d'attente offline
- Résolution de conflits automatique simple (last-write-wins par entité)

Toujours **opt-in** ; localStorage reste fallback offline.

---

## 9. Règles de sécurité

- Clé `anon public` uniquement côté client
- **RLS** sur toutes les tables — aucune donnée publique
- `.env.local` **jamais commité**
- Aucune clé dans les logs
- Sync impossible sans session authentifiée
- Pas de `service_role` dans l'app

---

## 10. Fichiers V0.4.4

```
modules/supabase/sync/
  types.ts           — SyncStatus, SyncResult, RemoteSnapshot
  stableId.ts        — UUID déterministe depuis id local
  mappers.ts         — local → row Supabase
  repositories.ts    — upsert / get par table
  syncLocalState.ts  — syncLocalStateToSupabase, loadRemoteSnapshot
  useSupabaseSync.ts — hook dev (pas de sync auto)
  index.ts

app/dev/sync/        — page diagnostic sync
```

---

## 11. Tests manuels V0.4.4

1. Sans connexion : app OK, `/dev/sync` invite à se connecter
2. Connecté : sauvegarde local → Supabase, vérifier tables Supabase
3. Lire snapshot : compteurs cohérents
4. Déconnexion : pas de sync, app locale intacte
5. `localStorage` inchangé après sync
