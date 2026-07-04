# Gigi OS — Backup & restore manuels (V0.4.6)

Version: `0.4.6`
Status: Contrôles dev sécurisés
Purpose: Permettre backup local et restauration depuis Supabase **uniquement** avec confirmation explicite.

---

## 1. Pourquoi la restauration est dangereuse

Restaurer depuis Supabase **remplace entièrement** `gigi-os-v03-state` :

- Mission en cours perdue si non synchronisée
- Historique local écrasé
- Listes `completedMissionIds` / `postponedMissionIds` / `rejectedMissionIds` reconstruites depuis Supabase
- État React (GigiProvider) inchangé tant que l'app n'est pas rechargée

V0.4.6 limite ces opérations à `/dev/controls` avec garde-fous multiples.

---

## 2. Règles anti-perte de données

1. **Backup obligatoire** avant toute restauration — si le backup échoue, restore bloquée
2. **Phrase de confirmation** exacte : `RESTAURER DEPUIS SUPABASE`
3. **Mapping validé** — restore bloquée si un projet/mission Supabase n'a pas d'id local reconnu
4. **Aucune action automatique** au démarrage de l'app
5. **Backups jamais supprimés** par le module restore
6. **Supabase jamais modifié** par la restauration (sens unique : remote → local)
7. **localStorage reste source principale** au runtime

---

## 3. Clés localStorage

| Clé | Rôle |
|-----|------|
| `gigi-os-v03-state` | État actif de l'app |
| `gigi-os-v03-backup-YYYY-MM-DD-HH-mm-ss` | Copie complète avant restore ou backup manuel |
| `gigi-os-v03-backups-index` | Index des backups (50 max) |

---

## 4. Flux backup local (non destructif)

Bouton **« Créer backup local »** sur `/dev/controls` :

1. Lit l'état GigiProvider actuel
2. Écrit une copie JSON dans une clé dédiée
3. Met à jour l'index
4. **Ne modifie pas** `gigi-os-v03-state`

Ne nécessite pas Supabase ni connexion.

---

## 5. Flux restauration manuelle

Prérequis :

- Utilisateur connecté
- Supabase configuré
- Snapshot Supabase chargé
- Plan de restauration préparé
- Mapping complet
- Phrase `RESTAURER DEPUIS SUPABASE` tapée exactement

Étapes :

1. **Charger snapshot Supabase**
2. **Préparer plan de restauration** — preview, warnings, niveau de risque
3. Taper la phrase de confirmation
4. **Restaurer** — backup auto → écriture `gigi-os-v03-state`
5. **Recharger l'app** manuellement

---

## 6. Mapping Supabase → local

Module : `modules/persistence/manualControls/remoteToLocalMappers.ts`

| Entité | Stratégie |
|--------|-----------|
| Projets | `stableRowId(localId, userId, "project")` + fallback nom |
| Missions | `stableRowId` + catalogue missions |
| Historique | `metadata.local_id`, `local_type`, `local_date` si présents |

Si mapping incomplet → message clair, restore bloquée.

---

## 7. Ce que V0.4.6 fait

- Backup local manuel + index
- Backup automatique avant restore
- Chargement snapshot Supabase (manuel)
- Plan de restauration avec preview et risque
- Restauration manuelle avec confirmation forte
- Diagnostic backups sur `/dev/controls`

---

## 8. Ce que V0.4.6 ne fait pas encore

- Restore depuis un backup local (UI)
- Résolution de conflits guidée (fusion)
- Sync automatique au démarrage
- Brancher GigiProvider sur Supabase
- Supprimer des backups automatiquement

---

## 9. Comment tester `/dev/controls`

1. **Sans connexion** : backup local OK, restore bloquée
2. **Connecté** : charger snapshot → préparer plan → vérifier preview
3. **Phrase incorrecte** : bouton restore désactivé
4. **Phrase correcte + mapping OK** : restore → backup créé → recharger app
5. Vérifier `gigi-os-v03-backups-index` dans DevTools
6. Routes principales inchangées

---

## 10. Plan futur

| Version | Objectif |
|---------|----------|
| V0.4.7+ | Restore depuis backup local |
| V0.4.7+ | Résolution de conflits guidée |
| V0.5 | Auto-sync opt-in après validation terrain |

---

## 11. Fichiers V0.4.6

```
modules/persistence/manualControls/
  types.ts
  constants.ts
  localBackup.ts
  remoteToLocalMappers.ts
  restorePlan.ts
  restoreLocalFromRemote.ts
  useManualControls.ts
  index.ts

app/dev/controls/
  page.tsx
  DevControlsPanel.tsx

docs/MANUAL_BACKUP_RESTORE.md
```
