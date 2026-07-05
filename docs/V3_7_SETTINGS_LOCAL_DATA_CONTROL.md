# Gigi V3.7 — Settings & Local Data Control

> **Route B** — Rendre Gigi plus contrôlable, testable et rassurant avant V4.

Version: `3.7`  
Status: Implementation (pending commit)  
Branch: `v3.7-settings-local-data-control`

---

## 1. Objectif

Créer un centre de contrôle local pour que l'utilisateur puisse :

- comprendre quelles données existent sur l'appareil ;
- exporter manuellement un JSON ;
- prévisualiser (et appliquer avec confirmation) un import ;
- réinitialiser certaines données avec confirmation explicite ;
- ajuster des préférences UI locales ;
- voir la version et les limites de sécurité ;
- revenir vers onboarding, bêta et docs.

**Sans** sync cloud, exécution réelle, connecteur externe ou automatisation dangereuse.

---

## 2. Route `/settings`

Page principale : `app/settings/page.tsx`  
Contenu : `components/settings/SettingsPageContent.tsx`

| Bloc | Composant |
|------|-----------|
| Hero | `SettingsHero` |
| Version & statut | `SettingsVersionCard` |
| Données locales | `LocalDataOverview` + `LocalDataKeyTable` |
| Export | `LocalDataExportPanel` |
| Import | `LocalDataImportPanel` |
| Reset | `LocalDataResetPanel` |
| Préférences | `LocalPreferencesPanel` |
| Limites | `SettingsSafetyNote` |

Navigation : lien **Réglages** dans la sidebar footer (`SideNav`).

---

## 3. Module `localDataControl`

Chemin : `modules/localDataControl/`

| Fichier | Rôle |
|---------|------|
| `types.ts` | Descripteurs clés, snapshot, export, import preview, settings |
| `localDataKeys.ts` | Catalogue des clés localStorage connues |
| `localDataInspector.ts` | Inspection présence / taille |
| `localDataExport.ts` | Export JSON manuel |
| `localDataImportPreview.ts` | Preview + apply import contrôlé |
| `localDataReset.ts` | Reset ciblé avec confirmations |
| `localSettingsStore.ts` | Préférences UI V3.7 |
| `localDataFormatter.ts` | Labels FR, format taille |
| `index.ts` | Exports publics |

---

## 4. localStorage

### Nouvelle clé autorisée

`gigi-os-v37-local-settings` — préférences UI uniquement :

- `uiDensity` : `comfortable` | `compact`
- `safetyMode` : `normal` | `strict`
- `showBetaHints` : boolean
- `showSafetyReminders` : boolean
- `lastOpenedSection` : string | null
- `updatedAt` : ISO string

**Ne stocke pas** : données métier, secrets, tokens, backups lourds.

### Clés existantes

Toutes les clés protégées restent intactes — voir [LOCAL_DATA_CONTROL.md](./LOCAL_DATA_CONTROL.md).

---

## 5. Export JSON

- Déclenché manuellement par l'utilisateur
- Format : `gigi-local-export-v3-7-YYYY-MM-DD.json`
- Contenu : `schemaVersion`, `appVersion`, `exportedAt`, `source`, `keys`, `data`
- Uniquement clés **exportables** du catalogue
- Aucun envoi réseau

---

## 6. Import

**Deux temps obligatoires :**

1. **Preview** — analyse locale, clés connues/inconnues, warnings
2. **Apply** — uniquement si checkboxes de confirmation cochées

Règles :

- Clés inconnues → import bloqué
- Clés non exportables → ignorées
- Écrasement → opt-in explicite
- Jamais d'import au chargement de page

---

## 7. Reset contrôlé

Options ciblées :

- feedback bêta
- préférences V3.7
- statut mémoire
- UI onboarding (clé v35 si présente)
- file d'actions (confirmation forte)
- reset complet (phrase `RESET GIGI LOCAL`)

Aucune suppression silencieuse.

---

## 8. Sécurité & limites

- Pas de sync/restore Supabase depuis `/settings`
- Pas de modification auth/providers
- Pas d'exécution, commande système ou connecteur réel
- Pas de paiement/checkout
- Pas d'approbation/auto-complétion de mission ou action

---

## 9. Critères d'acceptation

- [ ] `/settings` accessible et compréhensible
- [ ] Catalogue clés locales visible
- [ ] Export JSON manuel fonctionnel
- [ ] Import preview + apply avec confirmation
- [ ] Reset ciblé avec confirmations
- [ ] Préférences UI persistées dans `gigi-os-v37-local-settings`
- [ ] Build OK, lint ciblé OK
- [ ] Aucune régression routes V3.6

---

## 10. Après V3.7

**V4.0 — Controlled Real Execution Readiness** (stash intact, validation explicite requise).

Voir [ROADMAP.md](./ROADMAP.md).
