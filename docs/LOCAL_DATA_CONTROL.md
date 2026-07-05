# Local Data Control — Technical Reference

> Catalogue technique des données localStorage Gigi OS (V3.7).

---

## 1. Philosophy

- **Local-first** : localStorage côté client uniquement
- **Manual** : export, import, reset sur action utilisateur explicite
- **No auto-migration** : les clés existantes ne sont jamais renommées silencieusement
- **SSR-safe** : toutes les lectures vérifient `typeof window !== "undefined"`

---

## 2. Storage keys catalogue

| Key | Owner | Category | Risk | Exportable | Resettable |
|-----|-------|----------|------|------------|------------|
| `gigi-os-v03-state` | storage | core | critical | yes | yes* |
| `gigi-os-v03-backups-index` | persistence | backup | medium | yes | yes |
| `gigi-os-v03-backup-*` | persistence | backup | medium | yes | yes |
| `gigi-os-v04-memory-status` | memory | memory | low | yes | yes |
| `gigi-os-v09-beta-feedback` | beta | feedback | low | yes | yes |
| `gigi-os-v19-action-queue` | actionQueue | execution | high | yes | yes |
| `gigi-os-v20-execution-plans` | executionPlans | execution | high | yes | yes |
| `gigi-os-v21-execution-logs` | executionLogs | execution | medium | yes | yes |
| `gigi-os-v22-execution-reviews` | executionReviews | execution | medium | yes | yes |
| `gigi-os-v23-followup-actions` | followUpActions | execution | medium | yes | yes |
| `gigi-os-v24-history-learning-loop` | historyLearning | mission | medium | yes | yes |
| `gigi-os-v25-mission-feedback-loop` | missionFeedback | mission | low | yes | yes |
| `gigi-os-v26-mission-decision-center` | missionDecision | mission | medium | yes | yes |
| `gigi-os-v27-mission-plan-bridge` | missionPlanBridge | mission | medium | yes | yes |
| `gigi-os-v28-safe-action-workspaces` | safeActionWorkspace | execution | medium | yes | yes |
| `gigi-os-v29-manual-execution-handoffs` | manualExecutionHandoff | execution | medium | yes | yes |
| `gigi-os-v210-execution-report-intake` | executionReportIntake | execution | medium | yes | yes |
| `gigi-os-v211-closed-loop-action-lifecycle` | closedLoopLifecycle | execution | high | yes | yes |
| `gigi-os-v37-local-settings` | localDataControl | settings | low | yes | yes |
| `gigi-os-v35-onboarding-state` | onboarding | optional | low | yes | yes |
| `gigi-os-v36-projects-command-state` | projectsCommand | optional | low | yes | yes |
| `gigi-os-v40-execution-readiness` | executionReadiness | optional | medium | no | yes |

\* Reset de `gigi-os-v03-state` uniquement via reset ultra-confirmé ou flow GigiProvider existant.

---

## 3. V3.7 settings key schema

```json
{
  "uiDensity": "comfortable",
  "safetyMode": "normal",
  "showBetaHints": true,
  "showSafetyReminders": true,
  "lastOpenedSection": "overview",
  "updatedAt": "2026-07-05T00:00:00.000Z"
}
```

---

## 4. Export JSON format

```json
{
  "schemaVersion": "3.7",
  "appVersion": "3.7.0",
  "exportedAt": "ISO-8601",
  "source": "gigi-local-export",
  "keys": ["gigi-os-v03-state", "..."],
  "data": {
    "gigi-os-v03-state": { "...": "..." }
  }
}
```

Filename pattern : `gigi-local-export-v3-7-YYYY-MM-DD.json`

---

## 5. Import rules

1. Parse JSON locally
2. Validate `schemaVersion === "3.7"` and `source === "gigi-local-export"`
3. Block if unknown keys present
4. Skip non-exportable keys
5. Preview keys that would change
6. Require explicit user confirmation + overwrite opt-in
7. Never import on page load

---

## 6. Reset rules

| Target | Confirmation | Keys |
|--------|--------------|------|
| beta_feedback | simple | v09 |
| local_settings | simple | v37 |
| memory_status | simple | v04 |
| onboarding_ui | simple | v35 (if exists) |
| action_queue | strong (text) | v19 |
| all_known | ultra (`RESET GIGI LOCAL`) | all catalogued gigi-os-* |

---

## 7. Forbidden

- Auto sync/restore Supabase
- Auto import on load
- Silent delete
- Storing secrets in v37 settings
- External API calls from settings module
- System command execution
- Writing to filesystem outside browser download API

---

## 8. Module API (summary)

```typescript
buildLocalDataSnapshot()
buildLocalDataExport() / serializeLocalDataExport() / downloadLocalDataExport()
previewLocalDataImport(raw) / applyLocalDataImport(raw, { allowOverwrite })
executeLocalReset(target, confirmationPhrase?)
loadLocalSettings() / patchLocalSettings() / resetLocalSettings()
```

---

## 9. Related docs

- [V3_7_SETTINGS_LOCAL_DATA_CONTROL.md](./V3_7_SETTINGS_LOCAL_DATA_CONTROL.md)
- [ROADMAP.md](./ROADMAP.md)
