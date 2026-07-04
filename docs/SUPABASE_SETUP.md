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

## V0.4.2 — Vérifier la connexion

Cette étape ajoute une **vérification de connexion** sûre, sans auth ni migration.

### 1. Créer / remplir `.env.local`

Si `.env.local` n'existe pas encore :

```bash
cp .env.local.example .env.local
```

Puis colle tes valeurs (depuis **Settings → API** de ton projet Supabase) :

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> `.env.local` est ignoré par git : tes clés ne seront jamais commitées.

### 2. Redémarrer le serveur

Next.js ne lit les variables `.env.local` qu'au démarrage. Après édition :

```bash
# arrête le serveur (Ctrl+C) puis
npm run dev
```

### 3. Ouvrir la page de vérification

Va sur **[http://localhost:3000/dev/supabase](http://localhost:3000/dev/supabase)**
(le port peut être 3001/3002 si 3000 est occupé).

Cette page n'est **pas** dans la navigation et n'apparaît qu'en développement.

### 4. Comprendre les statuts

- **Non configuré** — les variables d'environnement manquent. L'app continue en local.
- **Connecté** — Supabase répond. Tout est prêt côté connexion.
- **Connecté (accès données limité par RLS)** — la connexion marche, mais la RLS
  restreint l'accès aux données (normal tant qu'il n'y a pas d'authentification).
- **Erreur / accès bloqué** — l'URL ou la clé anon est incorrecte, ou le schéma n'a pas été exécuté.

### 5. Ce que fait / ne fait pas la V0.4.2

- ✅ Vérifie que la connexion Supabase est possible.
- ✅ Garde **localStorage comme stockage principal** (`gigi-os-v03-state`).
- ❌ Pas d'authentification.
- ❌ Pas de migration des données locales.
- ❌ Aucune lecture/écriture Supabase dans le produit.

L'authentification et la migration arriveront plus tard (voir `docs/SUPABASE_PLAN.md`).

---

## V0.4.3 — Authentification (magic link)

Cette étape ajoute une **fondation d'authentification** optionnelle par email (magic link / OTP).
L'app reste **entièrement utilisable sans connexion** — localStorage reste la source principale.

### 1. Activer Supabase Auth dans le dashboard

Dans ton projet Supabase :

1. **Authentication → Providers → Email** : vérifie que **Email** est activé.
2. **Authentication → URL Configuration → Redirect URLs** : ajoute les URLs locales :

```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
http://localhost:3002/auth/callback
```

> L'app construit dynamiquement l'URL de redirection avec `window.location.origin + "/auth/callback"`.
> Les URLs ci-dessus doivent correspondre au port que tu utilises.

3. **Site URL** (optionnel en local) : `http://localhost:3000` (ou ton port actif).

### 2. Variables d'environnement

Si ce n'est pas déjà fait :

```bash
cp .env.local.example .env.local
```

Remplis `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`.

> ⚠️ **Ne commite jamais `.env.local`** — il est ignoré par git.

Redémarre le serveur après modification :

```bash
npm run dev
```

### 3. Tester la connexion

1. Ouvre **[http://localhost:3000/auth](http://localhost:3000/auth)** (ou ton port).
2. Entre ton email et clique **Recevoir le lien de connexion**.
3. Clique le lien reçu par email → tu es redirigé vers `/auth/callback` puis `/`.
4. Vérifie sur **[http://localhost:3000/dev/supabase](http://localhost:3000/dev/supabase)** :
   - **Connexion Supabase** : Connecté (accès données limité par RLS possible sans auth sur certaines requêtes)
   - **Auth** : Connecté, email affiché, profil détecté

### 4. Statuts attendus

**Sans connexion** (utilisateur anonyme) :

- Sidebar : « Local » + lien « Connexion »
- `/dev/supabase` → Auth : **Anonyme**
- L'app fonctionne normalement via localStorage

**Après connexion magic link** :

- Sidebar : email court + « Déconnexion »
- `/dev/supabase` → Auth : **Connecté**, profil : **Oui**
- Un profil est créé automatiquement dans `public.profiles` (RLS respectée)

**Supabase non configuré** :

- Sidebar : « Mode local »
- Pas de blocage de l'app

### 5. Ce que fait / ne fait pas la V0.4.3

- ✅ Magic link / OTP par email (`/auth`, `/auth/callback`)
- ✅ Session Supabase optionnelle (AuthProvider)
- ✅ Création/récupération automatique du profil (`profiles`)
- ✅ Indicateur discret dans la sidebar + lien mobile
- ✅ Page `/dev/supabase` enrichie (statut auth)
- ✅ **localStorage reste la source principale** (`gigi-os-v03-state`)
- ❌ Pas de migration des données locales
- ❌ Pas d'obligation de se connecter
- ❌ Pas de OAuth, mot de passe, paywall

La synchronisation manuelle arrive en **V0.4.4** ; la migration automatique en **V0.4.5+** (voir `docs/SUPABASE_SYNC_PLAN.md`).

---

## V0.4.4 — Sync Foundation (manuelle)

Cette étape **prépare la synchronisation** sans remplacer localStorage.

### Prérequis

- Supabase configuré (`.env.local` local, jamais commité)
- Schéma SQL exécuté (`supabase/schema.sql`)
- Utilisateur **connecté** via magic link (`/auth`)

### Page dev `/dev/sync`

Ouvre **[http://localhost:3000/dev/sync](http://localhost:3000/dev/sync)** (dev only, absent de la navigation).

La page affiche :

- État auth (AuthProvider)
- Données locales (projets, missions, historique)
- Bouton **Sauvegarder local → Supabase** — backup manuel
- Bouton **Lire snapshot Supabase** — diagnostic distant uniquement

Lien discret depuis `/dev/supabase` → `/dev/sync`.

### Ce que fait / ne fait pas la V0.4.4

- ✅ Mappe l'état local vers le schéma Supabase (`modules/supabase/sync/`)
- ✅ Upsert projets / missions / historique (RLS respectée)
- ✅ Lecture snapshot distant pour diagnostic
- ✅ **localStorage reste la source principale**
- ❌ Pas de sync automatique au démarrage
- ❌ Pas d'injection remote → local dans l'app
- ❌ Pas de suppression de données locales ou distantes

Voir aussi [`docs/SUPABASE_SYNC_PLAN.md`](./SUPABASE_SYNC_PLAN.md).

### Erreur RLS / permission sur la sync

Si `/dev/sync` affiche une erreur RLS ou « permission denied » :

1. Ouvre **SQL Editor** dans Supabase.
2. Exécute [`supabase/patches/2026-07-04-fix-sync-rls.sql`](../supabase/patches/2026-07-04-fix-sync-rls.sql).
3. Réessaie **Sauvegarder local → Supabase**.

Ce patch ajoute les **GRANT** manquants et des policies `to authenticated` sur `projects`, `missions`, `history_events`.

---

## Rappel sécurité

- Clé `anon public` uniquement côté client.
- RLS obligatoire : rien n'est public par défaut.
- `.env.local` jamais commité.
- Aucune clé n'est jamais affichée dans les logs.
