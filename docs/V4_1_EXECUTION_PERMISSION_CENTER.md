# Gigi V4.1 — Execution Permission Center

> **Phrase produit V4.1 :** « Gigi prépare et simule — tu décides, tu révoques, tout reste local. »

Version: `4.1`  
Status: Implemented (simulation / dry-run — no real execution)  
Branch: `v4.1-execution-permission-center`

---

## 1. Objectif

Transformer la base V4.0 en **centre de contrôle des permissions locales** — sans exécution réelle, sans connecteur, sans sync cloud.

Le centre permet de :

- lister toutes les demandes de permission locales ;
- filtrer par statut (en attente, dry-run approuvé, refusé, expiré, bloqué, révoqué) ;
- consulter le détail (capacité, scope, risque, justification, rollback, audit trail) ;
- expirer automatiquement les approbations dry-run (TTL 24 h) ;
- révoquer localement une décision ;
- exporter le journal d'audit en JSON (téléchargement manuel).

---

## 2. Différence V4.0 vs V4.1

| V4.0 (livré) | V4.1 (implémenté) |
|--------------|-------------------|
| Demandes dispersées dans `/actions`, conversation | **Vue centralisée** `/permissions` |
| Approbation dry-run sans expiration explicite | **Expiration locale** (24 h après approbation) |
| Pas de révocation dédiée | **Révocation locale** avec audit |
| Audit trail par demande | **Journal global** + export JSON |
| Résumé settings basique | **Résumé V4.1** avec compteurs expiré / révoqué |

---

## 3. Garanties sécurité (V4.1)

Règles définies dans `modules/executionReadiness/permissionCenterPolicy.ts` :

1. **Exécution réelle bloquée** — aucun shell, Git, GitHub, n8n, API, email, calendrier.
2. **Dry-run uniquement** — approbation = simulation locale, pas d'action externe.
3. **État local uniquement** — clé `gigi-os-v40-execution-readiness` (extension schéma V4.1, pas de nouvelle clé).
4. **Validation humaine obligatoire** — pas d'auto-approbation.
5. **Capacités sensibles bloquées** — policy V4.0 inchangée.
6. **Aucune permission permanente** — TTL dry-run + statut `expired`.
7. **Aucune exécution en arrière-plan**.

Wording interdit dans l'UI : « Gigi exécute », « autorisation permanente », « exécution automatique », etc.

Wording autorisé : « prépare », « simulation », « dry-run », « validation humaine », « permission locale », « révocation locale », « aucune exécution réelle ».

---

## 4. Module — extensions V4.1

Chemin : `modules/executionReadiness/`

| Fichier | Rôle |
|---------|------|
| `permissionCenterPolicy.ts` | Règles V4.1 |
| `permissionCenterExpiration.ts` | Sync expiration dry-run (`syncExpiredDryRunPermissions`) |
| `permissionCenterRevocation.ts` | `revokeLocalPermission()` |
| `permissionCenterFilters.ts` | Filtres liste (all, awaiting, approved, rejected, expired, blocked, revoked) |
| `permissionCenterAuditExport.ts` | Export JSON local du journal |
| `permissionCenterViewModel.ts` | `buildPermissionCenterViewModel()` |

Types étendus dans `types.ts` :

- statut `revoked` ;
- décision `revoke` ;
- champs `dryRunApprovedAt`, `dryRunExpiresAt`, `revokedAt` ;
- `DRY_RUN_APPROVAL_TTL_HOURS` = 24 ;
- `EXECUTION_READINESS_V41_DISCLAIMER`.

---

## 5. UI

Chemin : `components/executionPermissionCenter/`

| Composant | Rôle |
|-----------|------|
| `PermissionCenterPageContent.tsx` | Page principale `/permissions` |
| `PermissionCenterBadges.tsx` | Badges Simulation / Local / Bloqué V4.1 |
| `PermissionCenterFilters.tsx` | Filtres statut |
| `PermissionRequestListItem.tsx` | Ligne liste |
| `PermissionRequestDetail.tsx` | Détail + révocation locale |
| `PermissionAuditJournal.tsx` | Journal lisible |
| `PermissionAuditExportPanel.tsx` | Export JSON manuel |

Intégrations :

- `/permissions` — route dédiée ;
- `/actions` — lien vers le centre ;
- `/settings` — résumé V4.1 + lien ;
- SideNav — entrée « Permissions » ;
- `ExecutionReadinessPanel` — lien « Ouvrir le centre de permissions ».

---

## 6. Expiration dry-run

- À l'approbation dry-run : `dryRunApprovedAt` + `dryRunExpiresAt` (+24 h).
- Au chargement du centre (`syncExpiration: true`) : statut → `expired` si TTL dépassé.
- Affichage clair des permissions expirées (filtre + badge).

---

## 7. Révocation locale

- Action « Révoquer localement » dans le détail d'une demande approuvée dry-run.
- Change uniquement l'état local (`revoked`, `revokedAt`, entrée audit `revoked`).
- Aucune action externe.

---

## 8. Export audit

- Bouton « Exporter le journal » — téléchargement JSON local.
- Nom de fichier : `gigi-permission-audit-v4-1-YYYY-MM-DD.json`.
- Événements tracés : `created`, `approved_dry_run`, `rejected`, `revoked`, `expired`.
- Pas de sync cloud, pas d'envoi externe.

---

## 9. Non-objectifs V4.1

- Exécution réelle (shell, fichiers, Git, agents).
- Connecteurs GitHub, n8n, email, calendrier.
- Autorisation permanente ou auto-approbation.
- Modification Supabase, auth, providers, paiement.
- Nouvelle clé localStorage (compatibilité V3.7 `localDataControl`).

---

## 12. Tests manuels

1. Créer une demande depuis `/actions` (panneau V4 ou action dominante).
2. Ouvrir le centre embed sur `/actions` — vérifier filtres, stats, détail.
3. Ouvrir `/permissions` — vue complète, export JSON.
4. Approuver un dry-run — vérifier `dryRunExpiresAt` (+24 h).
5. Recharger après expiration simulée (ou attendre TTL) — statut `expired`.
6. Révoquer une permission dry-run — statut `revoked`, entrée audit.
7. Vérifier `/history` — carte journal permissions.
8. Vérifier `/settings` — résumé V4.1 + liens.
9. Conversation : « quelles permissions », « est-ce bloqué », « révoque les permissions ».
10. Recharger la page — persistance `gigi-os-v40-execution-readiness`.

---

## 13. Limites connues

- Expiration calculée au chargement / interaction locale — pas de scheduler background.
- Export JSON manuel uniquement — pas de sync cloud.
- Révocation et expiration = état local — aucune action externe.
- Connecteurs réels réservés à V4.2+ avec validation produit explicite.

---

## 14. Préparation V4.2

**Real Connector Sandbox / Manual Bridge** — sandbox contrôlé pour futurs connecteurs, pont manuel uniquement, toujours sans exécution non supervisée.

Voir [ROADMAP.md](./ROADMAP.md).

---

## 15. Références

- [V4_0_CONTROLLED_REAL_EXECUTION_READINESS.md](./V4_0_CONTROLLED_REAL_EXECUTION_READINESS.md)
- [V4_EXECUTION_POLICY.md](./V4_EXECUTION_POLICY.md)
- [ROADMAP.md](./ROADMAP.md)
