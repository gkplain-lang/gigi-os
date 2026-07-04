# Gigi OS — V0.9 Private Beta Readiness

> Préparer une bêta privée testable, stable et sécurisée — **sans activer d'intégrations réelles**.

Version: `0.9.0`  
Status: Implemented  
Branch: `v0.9-private-beta`

---

## 1. Objectif V0.9

Gigi OS doit être prêt pour une **bêta privée** avec :

- routes principales stables ;
- garde-fous dry-run conservés ;
- checklist de readiness visible ;
- feedback local pour testeurs invités ;
- documentation claire du périmètre.

V0.9 **n'est pas** un lancement public.

---

## 2. Périmètre bêta privée

### Activé

- Conversation, brain, projets, historique, mémoire
- Mission execution loop (local)
- Action / Automation / Integration proposals (dry-run)
- Daily review (read-only)
- Fallback local sans OpenAI
- Feedback local (`/feedback`, `/dev/beta`)
- Pages dev de diagnostic

### Dry-run uniquement

- Agents V0.6
- Automatisations V0.7
- Intégrations GitHub V0.8

### Interdit en V0.9

- Intégrations réelles (GitHub API, Gmail, Calendar)
- n8n, agents réels
- git commit / push / merge applicatif
- Sync / restore Supabase automatique
- Paiement, landing publique
- Envoi feedback vers API externe

---

## 3. Module `modules/beta/`

```text
types.ts           — types checklist, feedback, summary
betaChecklist.ts   — 16 items pass / manual
betaHealth.ts      — statut modules clés V0.5–V0.8
betaGuardrails.ts  — garde-fous, routes, risques
betaFeedback.ts    — localStorage feedback (gigi-os-v09-beta-feedback)
betaSummary.ts     — résumé dev
index.ts           — exports
```

---

## 4. Checklist bêta

| Catégorie | Items |
|-----------|-------|
| Stabilité | build OK (manuel) |
| IA | fallback local, IA optionnelle, pas de clé exposée |
| Persistance | localStorage principal, Supabase optionnel, sync/restore manuels |
| Agents / Automation / Integrations | dry-run only |
| UX | confirmation obligatoire |
| Core | history, daily review, mission loop (tests manuels) |

Voir `/dev/beta` pour la checklist complète.

---

## 5. Feedback local

- **Route** : `/feedback` ou section dans `/dev/beta`
- **Types** : bug, friction, idée, mauvaise décision, autre
- **Contexte optionnel** : route, module, mission
- **Stockage** : `localStorage` (`gigi-os-v09-beta-feedback`)
- **Aucun** envoi Supabase ou API

---

## 6. Pages dev

`/dev/beta` affiche :

- statut bêta privée ;
- garde-fous actifs ;
- checklist ;
- modules clés ;
- routes critiques ;
- interdictions V0.9 ;
- risques connus ;
- prochaines validations ;
- formulaire feedback intégré.

---

## 7. Tests manuels

1. `npm run build` — OK
2. Routes : `/`, `/conversation`, `/brain`, `/projects`, `/history`, `/memory`, `/feedback`
3. Routes dev : `/dev/ai` … `/dev/beta`
4. Fallback local sans OpenAI
5. Ajouter un feedback → visible après refresh local
6. Vérifier `.env.local` absent du git
7. DevTools réseau : pas d'appel GitHub / n8n / Gmail

---

## 8. Risques connus

- OpenAI absent → 100 % fallback (attendu)
- Supabase absent → pas de cloud (attendu)
- Feedback non synchronisé entre appareils
- Intégrations = plans uniquement

---

## 9. Post-bêta (V1.0)

Après retours testeurs :

- réduire confusion UX ;
- prioriser intégrations réelles opt-in ;
- daily use release — toujours avec confirmation pour actions sensibles.

---

## 10. Contraintes permanentes

- `gigi-os-v03-state` reste la source principale
- Pas de modification `.env.local`
- Pas de `NEXT_PUBLIC_*` pour clés IA
- Toute action externe désactivée par défaut
