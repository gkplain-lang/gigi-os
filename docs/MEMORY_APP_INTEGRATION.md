# Gigi OS — Intégration mémoire dans l'app (V0.4.7)

Version: `0.4.7`
Status: Statut mémoire visible dans l'app principale
Purpose: Exposer clairement local vs Supabase sans action automatique dangereuse.

---

## 1. Pourquoi V0.4.7 expose la mémoire dans l'app

Jusqu'à V0.4.6, Supabase et la persistance étaient surtout visibles dans `/dev/*`.

V0.4.7 ajoute une **couche légère** dans l'expérience produit :

- L'utilisateur sait si Gigi tourne en local ou connecté
- Il voit si une sauvegarde distante est possible ou récente
- Il peut sauvegarder manuellement depuis la sidebar ou `/memory`
- Aucune migration, restore ou sync automatique

---

## 2. localStorage reste source principale

| Clé | Rôle |
|-----|------|
| `gigi-os-v03-state` | État actif missions / projets / historique — **inchangé** |
| `gigi-os-v04-memory-status` | Métadonnées mémoire uniquement (dernier backup, mode connu) |

Le module `modules/memory/` **n'écrit jamais** dans `gigi-os-v03-state`.

---

## 3. Supabase = sauvegarde distante secondaire

- Sync via `syncLocalStateToSupabase()` — **manuel uniquement**
- Bouton « Sauvegarder » dans `MemoryStatusStrip` et `/memory`
- Nécessite auth + Supabase configuré
- Échec Supabase → message clair, app locale intacte

---

## 4. Statuts mémoire (`MemoryMode`)

| Mode | Signification |
|------|---------------|
| `local_anonymous` | Non connecté, local actif |
| `local_only` | Chargement ou local sans cloud |
| `connected_not_backed_up` | Connecté, jamais sauvegardé (ou pas récemment) |
| `connected_backup_available` | Sauvegarde distante existante |
| `connected_recently_backed_up` | Backup récent (< 48 h) |
| `connected_conflict` | Écart local/Supabase (après actualisation manuelle) |
| `supabase_error` | Erreur distante |
| `supabase_not_configured` | Pas de `.env.local` Supabase |

---

## 5. Composants UI

| Composant | Emplacement |
|-----------|-------------|
| `MemoryStatusStrip` | Sidebar desktop (sous auth) |
| `MemoryStatusStrip` mobile | Header compact |
| `/memory` | Page simple — statut, résumé, sauvegarde |

Pas de nouvelle entrée dans la navigation principale.

---

## 6. Règles anti-perte de données

1. **Aucune sync au démarrage**
2. **Aucune restore depuis l'UI principale**
3. **Backup manuel uniquement** — pas d'écrasement local
4. **Restore dev-only** — reste sur `/dev/controls` (V0.4.6)
5. **Auth optionnelle** — app utilisable sans compte
6. **Clés jamais loggées** — `.env.local` jamais commité

---

## 7. Ce que V0.4.7 fait

- Module `modules/memory/`
- Hook `useMemoryStatus()`
- Persistance `gigi-os-v04-memory-status`
- Strip mémoire sidebar + mobile
- Page `/memory` légère
- Réutilise sync V0.4.4 et stratégie V0.4.5

---

## 8. Ce que V0.4.7 ne fait pas encore

- Auto-sync au démarrage ou après actions
- Restore depuis l'UI principale
- Brancher GigiProvider sur Supabase
- Dashboard mémoire complexe

---

## 9. Plan futur

| Version | Objectif |
|---------|----------|
| V0.5+ | Auto-sync opt-in après validation |
| V0.5+ | Notifications backup recommandé |
| V0.5+ | Résolution conflits guidée dans l'app |

---

## 10. Fichiers V0.4.7

```
modules/memory/
  types.ts
  constants.ts
  memoryPersist.ts
  memoryStatus.ts
  memorySummary.ts
  useMemoryStatus.ts
  index.ts

components/memory/
  MemoryStatusStrip.tsx
  MemoryPageContent.tsx

app/memory/page.tsx
```

---

## 11. Tests manuels

1. Anonyme : strip « Local », bouton Connexion, pas de Sauvegarder
2. Connecté : strip « Connecté », bouton Sauvegarder actif
3. Après backup : « Sauvegardé » + date
4. `/memory` : résumé local + sauvegarde manuelle
5. Routes principales inchangées
6. `gigi-os-v03-state` intact après backup
