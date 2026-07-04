# Gigi OS — Mise en place Supabase (V0.4.1)

> **Fondation mémoire uniquement.** Rien n'est encore branché sur l'app.

Version: `0.4.1`
Status: Guide d'installation (fondation)
Purpose: Préparer Supabase comme future couche de mémoire persistante de Gigi OS.

---

## 1. Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com) et connecte-toi.
2. **New project** → choisis un nom (ex. `gigi-os`), un mot de passe de base de données, une région proche.
3. Attends que le projet soit prêt (~1 min).

---

## 2. Récupérer les clés

Dans le tableau de bord du projet : **Settings → API**.

- **Project URL** → à copier dans `NEXT_PUBLIC_SUPABASE_URL`
  (ressemble à `https://xxxxxxxx.supabase.co`)
- **Project API keys → `anon` `public`** → à copier dans `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> ⚠️ N'utilise **jamais** la clé `service_role` côté client. Seule la clé `anon public` va dans l'app.

---

## 3. Créer `.env.local` en local

À la racine du projet, copie le modèle :

```bash
cp .env.local.example .env.local
```

Puis remplis tes valeurs dans `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

- **Ne commite jamais `.env.local`** — il est ignoré par git (`.gitignore`).
- Seul `.env.local.example` (vide) est versionné.

---

## 4. Exécuter le schéma SQL

1. Dans Supabase : **SQL Editor → New query**.
2. Copie tout le contenu de [`supabase/schema.sql`](../supabase/schema.sql).
3. Colle-le dans l'éditeur et clique **Run**.

Le script crée les 8 tables (`profiles`, `projects`, `missions`, `history_events`,
`conversation_messages`, `decision_logs`, `autonomy_logs`, `user_settings`),
les index, les triggers `updated_at`, et **active la Row Level Security** avec des
politiques « propriétaire uniquement » (chaque utilisateur ne voit que ses données).

Le script est **idempotent** : tu peux le relancer sans casser l'existant.

---

## 5. Vérifier

- **Table Editor** : les 8 tables apparaissent.
- **Authentication → Policies** : chaque table a ses policies `*_select_own`,
  `*_insert_own`, `*_update_own`, `*_delete_own` (et RLS activée).

---

## 6. Ce que fait la V0.4.1

- Installe le client `@supabase/supabase-js`.
- Ajoute un client navigateur (`modules/supabase/client.ts`) qui **échoue proprement**
  si les variables d'environnement manquent (l'app continue en local).
- Ajoute les types TypeScript (`modules/supabase/types.ts`).
- Ajoute le schéma SQL complet + RLS + index (`supabase/schema.sql`).
- Documente l'installation (ce fichier).

## 7. Ce que la V0.4.1 ne fait PAS encore

- ❌ Pas d'authentification (aucun écran de connexion, aucune obligation de se connecter).
- ❌ Pas de migration des données locales vers Supabase.
- ❌ localStorage **reste la source de vérité** (`gigi-os-v03-state`).
- ❌ Aucune lecture/écriture Supabase dans l'app.

La persistance réelle, l'auth et la migration arriveront en **V0.4.2 / V0.4.3**
(voir [`docs/SUPABASE_PLAN.md`](./SUPABASE_PLAN.md)).

---

## Rappel sécurité

- Clé `anon public` uniquement côté client.
- RLS obligatoire : rien n'est public par défaut.
- `.env.local` jamais commité.
