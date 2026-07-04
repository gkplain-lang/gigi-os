# Gigi OS — Contexte mémoire IA (V0.5.2)

Version: `0.5.2`  
Status: Contexte mémoire borné pour le cerveau IA  
Purpose: Donner à l'IA une vue utile de l'état local sans action automatique.

---

## 1. Pourquoi un contexte mémoire IA ?

En V0.5, l'IA recevait surtout le message utilisateur et un contexte minimal (mission courante, quelques projets).

V0.5.2 ajoute un **contexte mémoire structuré** pour que l'IA puisse raisonner avec :

- la mission actuelle
- un résumé des projets
- l'historique récent
- les missions terminées / reportées / rejetées
- le statut mémoire local / distant
- un résumé de décision locale (decision engine)
- des avertissements (conflit, pas d'action auto)

L'IA reste **assistante** : elle ne modifie, ne synchronise et ne restaure rien.

---

## 2. Ce qu'on inclut

| Élément | Source | Limite par défaut |
|---------|--------|-------------------|
| Mission actuelle | `GigiLocalState.mission` | 1 |
| Projets | `GigiLocalState.projects` | 8 |
| Historique | `GigiLocalState.history` | 10 événements |
| IDs terminées / reportées / rejetées | localStorage `gigi-os-v03-state` | listes courtes |
| Statut mémoire | `useMemoryStatus()` | résumé |
| Snapshot Supabase | optionnel, dev only | compteurs uniquement |
| Décision locale | `explainDecisionFromProjects()` | 1 headline |

Module : `modules/ai/memoryContext/`

---

## 3. Ce qu'on exclut

- Backups complets
- Snapshots Supabase bruts (sauf compteurs résumés en dev)
- Clés API, tokens, `.env`
- Logs techniques longs
- Données `localStorage` brutes
- Toute instruction d'action automatique

Le **sanitizer** (`contextSanitizer.ts`) :

- tronque les textes longs
- retire les motifs de secrets (`sk-…`, `Bearer …`, `OPENAI_API_KEY`, etc.)
- borne la taille totale (~8000 caractères JSON)

---

## 4. Limites de contexte

Fichier : `contextLimits.ts`

```typescript
maxProjects: 8
maxHistoryEvents: 10
maxTextLength: 8000
maxTasks: 3
includeRemoteSnapshot: false // par défaut
```

Si le JSON dépasse la limite, le builder réduit progressivement historique et projets.

---

## 5. Intégration

```
/conversation
  → tryBuildAiMemoryContext({ localState, memoryStatus })
  → askAiBrain({ ..., memoryContext })
  → promptBuilder inclut memoryContext
  → fallback local si IA indisponible

/dev/ai
  → aperçu stats contexte
  → checkbox « Inclure snapshot Supabase » (dev only)
  → test avec contexte mémoire
```

**Pas de fetch Supabase automatique** dans `/conversation`.

---

## 6. Sécurité mémoire

- Conflit local/Supabase → warning dans le contexte + consigne « revue manuelle »
- L'IA ne doit pas dire « j'ai synchronisé » ou « j'ai restauré »
- Phrases de sync/restore auto bloquées dans `safety.ts`
- Garde-fous V0.5.1 conservés : `requestedProjectId`, `AI_PROJECT_MISMATCH`

---

## 7. Fallback local

Si `buildAiMemoryContext` échoue → `tryBuildAiMemoryContext` retourne `undefined`, l'IA utilise le payload legacy.

Si l'IA échoue → `askGigi()` via `localFallbackProvider` (inchangé).

---

## 8. Lien Supabase

Supabase reste une **sauvegarde distante optionnelle** (V0.4).

V0.5.2 :

- lit le **statut mémoire** déjà calculé côté client
- n'appelle pas Supabase depuis `/conversation`
- permet un snapshot résumé **manuel** dans `/dev/ai` uniquement

---

## 9. Futur

| Version | Objectif |
|---------|----------|
| **V0.5.3** | Affinage contexte (priorisation dynamique, résumés plus intelligents) |
| **V0.6** | Agents / n8n — toujours avec garde-fous et confirmation utilisateur |

---

## 10. Fichiers clés

| Fichier | Rôle |
|---------|------|
| `memoryContext/types.ts` | Types `AiMemoryContext` |
| `memoryContext/contextBuilder.ts` | `buildAiMemoryContext()` |
| `memoryContext/contextSanitizer.ts` | Nettoyage + troncature |
| `memoryContext/contextLimits.ts` | Limites par défaut |
| `memoryContext/contextSummary.ts` | Stats pour `/dev/ai` |
| `promptBuilder.ts` | Injection dans le prompt OpenAI |
| `safety.ts` | Blocage sync/restore inventés |

Voir aussi : `docs/AI_BRAIN_FOUNDATION.md`, `docs/MEMORY_APP_INTEGRATION.md`
