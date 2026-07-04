# Gigi OS — Stratégie de persistance

Version: `0.4.5`
Status: Diagnostic uniquement (aucune migration automatique)
Purpose: Définir comment Gigi OS gère local vs Supabase avant toute action destructive.

---

## 1. Pourquoi localStorage reste source principale (V0.4.5)

Gigi OS fonctionne **offline-first** :

- Clé : `gigi-os-v03-state`
- `GigiProvider` charge et sauvegarde l'état via `localStorage`
- Missions, historique, decision engine — tout part du local
- Supabase est un **backup / diagnostic** optionnel

V0.4.5 n'active **aucune** écriture automatique vers ou depuis Supabase.

---

## 2. Pourquoi éviter la migration automatique trop tôt

| Risque | Conséquence |
|--------|-------------|
| Écrasement local | Perte de missions / historique en cours |
| Ids locaux vs UUID | Liens cassés entre projets et missions |
| Statuts différents | Sémantique incohérente (`postponed` → `paused`) |
| Sync sans consentement | Utilisateur surpris par un changement d'état |
| Offline | App inutilisable si cloud obligatoire |

**Règle d'or** : ne jamais écraser automatiquement les données locales.

---

## 3. Modes de persistance

Module : `modules/persistence/`

| Mode | Situation | Recommandation typique |
|------|-----------|------------------------|
| `supabase_not_configured` | Pas de `.env.local` Supabase | `do_nothing` — app 100 % locale |
| `not_authenticated` | Utilisateur anonyme | `keep_local` |
| `local_only` | Aucune donnée local ni remote | `do_nothing` |
| `remote_empty` | Local rempli, Supabase vide | `backup_local_to_remote` (manuel) |
| `remote_available` | Local vide, Supabase rempli | `offer_remote_restore` (futur) |
| `remote_backup` | Les deux coexistent, alignés | `do_nothing` ou backup manuel |
| `remote_conflict` | Divergence local / distant | `manual_review` |
| `error` | Erreur auth ou chargement | `keep_local` |

---

## 4. Scénarios utilisateur

### Anonyme (sans compte)

- Auth : `anonymous`
- Source : localStorage uniquement
- Sync / restore : indisponibles
- App : pleinement utilisable

### Connecté, Supabase configuré

- Auth : `authenticated`
- Diagnostic via `/dev/persistence`
- Snapshot remote : chargement **manuel** uniquement
- Backup : via `/dev/sync` (V0.4.4), jamais automatique

### Supabase disponible mais local prioritaire

- Même connecté, localStorage reste la vérité runtime
- Supabase = copie de secours après action explicite

### Conflit local / distant

- Détecté par comparaison des résumés (compteurs + horodatages)
- Types : `local_newer`, `remote_newer`, `both_have_data`, `unknown`
- Action : **revue manuelle** — aucune fusion auto en V0.4.5

### Remote vide, local rempli

- Recommandation : sauvegarde manuelle (`/dev/sync`)
- Pas de restore nécessaire

### Local vide, remote rempli

- Recommandation : `offer_remote_restore` (UI future V0.4.6+)
- V0.4.5 : diagnostic seulement, pas de bouton restore

---

## 5. Règles anti-perte de données

1. **Local-first** — toujours protéger `gigi-os-v03-state`
2. **Pas d'écriture auto** — ni sync, ni restore au démarrage
3. **Consentement explicite** — toute migration future demande confirmation
4. **Diagnostic avant action** — `/dev/persistence` avant toute décision
5. **Fallback** — si Supabase échoue, l'app continue en local
6. **Auth optionnelle** — jamais forcer la connexion
7. **Clés jamais loggées** — `.env.local` jamais commité

---

## 6. Stratégie recommandée (ordre)

1. **Local-first** — développer et utiliser l'app sans cloud
2. **Backup manuel** — `/dev/sync` quand connecté et prêt
3. **Diagnostic** — `/dev/persistence` pour comparer local vs remote
4. **Restore manuel** — V0.4.6+ avec consentement utilisateur
5. **Auto-sync** — V0.5+ seulement après validation terrain

---

## 7. Architecture V0.4.5

```
┌─────────────────────────────────────────┐
│  GigiProvider (localStorage)            │  ← source principale
└──────────────┬──────────────────────────┘
               │ lecture seule
               ▼
┌─────────────────────────────────────────┐
│  modules/persistence/                   │
│  - createLocalSnapshotSummary           │
│  - createRemoteSnapshotSummary          │
│  - detectPersistenceConflict            │
│  - evaluatePersistenceStrategy          │
└──────────────┬──────────────────────────┘
               │ loadRemoteSnapshot (manuel)
               ▼
┌─────────────────────────────────────────┐
│  modules/supabase/sync/ (V0.4.4)        │  ← backup / lecture diagnostic
└─────────────────────────────────────────┘
```

---

## 8. Plan V0.4.6 — Restore guidé ✅

- Page `/dev/controls` — backup local + restore manuel
- Backup obligatoire avant restore
- Phrase de confirmation : `RESTAURER DEPUIS SUPABASE`
- Mapping Supabase → local validé avant écriture
- Voir `docs/MANUAL_BACKUP_RESTORE.md`

---

## 9. Plan V0.5 — Persistance intégrée

- Couche persistence branchée sur GigiProvider (opt-in)
- Sync background après actions importantes
- File d'attente offline
- Résolution de conflits simple (last-write-wins par entité)
- Toujours fallback localStorage si cloud indisponible

---

## 10. Fichiers V0.4.5

```
modules/persistence/
  types.ts                  — PersistenceMode, PersistenceDiagnostic
  localSnapshot.ts          — createLocalSnapshotSummary
  remoteSnapshot.ts         — createRemoteSnapshotSummary
  conflictDetection.ts      — detectPersistenceConflict
  persistenceStrategy.ts    — evaluatePersistenceStrategy
  usePersistenceDiagnostic.ts
  index.ts

app/dev/persistence/        — page diagnostic stratégie
docs/PERSISTENCE_STRATEGY.md
```

---

## 11. Tests manuels V0.4.5

1. Sans connexion : `/dev/persistence` affiche mode anonyme, résumé local OK
2. Connecté : charger snapshot → comparaison local / remote
3. Conflit simulé : recommandation `manual_review`
4. Remote vide + local rempli : `backup_local_to_remote`
5. Aucune sync / restore au chargement de l'app
6. Routes principales inchangées
7. `.env.local` absent du git status
