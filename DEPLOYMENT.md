# Deployment, Backup and Disaster Recovery Plan

Status: **ARCHITECTURALLY DEFINED — no environment, backup or restore has been provisioned/tested** · 2026-11-02

## 1. Environment separation

| Environment | Application | Data/services | Purpose and gate |
|---|---|---|---|
| Local development | Local Next.js after approval | Local Supabase CLI/Postgres/Storage where supported; synthetic fixtures | Fast migration/RLS/UI tests; no real personnel data |
| Staging | Separate Vercel staging environment/domain | Separate Supabase project, buckets, auth settings and provider sandboxes | Rehearse migrations, integrations, load and restore; restricted access |
| Production | Separate Vercel production environment/domain | Separate Supabase project/region, private buckets, approved providers | Only after formal security/operational acceptance |

Never point staging/tests at production. Separate credentials, auth redirect URLs, storage buckets, Realtime settings, backup destination and monitoring. Provider project IDs/domains/regions are not yet selected. Do not assume a Nigeria Supabase region exists; choose an approved available region after latency/legal review.

Vercel preview deployments must not receive production secrets. Browser-facing configuration uses explicit public Supabase URL/publishable key; server-only secret/service credentials remain in restricted environment stores. Validate environment schema at build/startup. No privileged key in `NEXT_PUBLIC_*`, source control, client bundle or service worker.

## 2. Release pipeline

1. Protected branch and reviewed change; no direct production schema editing.
2. CI: clean install from lockfile, strict typecheck, lint, unit/component tests, migration upgrade/empty-db tests, pgTAP RLS, integration/E2E smoke, dependency/secret scan and build.
3. Validate environment/config and feature flags; disabled modules remain honest.
4. Deploy staging application and compatible migrations; run authorization/media/sync/Realtime smoke and representative load.
5. Rehearse rollback/forward-fix. Confirm DB backup/recovery point and object backup state before production migration.
6. Approval gate; deploy compatible application/migrations using expand→migrate→contract for breaking changes.
7. Production smoke with synthetic approved test account, not real election manipulation; monitor errors/latency/queue/DB/storage.
8. Record release, migration versions, configuration changes, test evidence and rollback owner.

Database migrations are versioned and transactional where possible. Long backfills run in monitored batches with idempotent checkpoints. Do not assume a destructive down migration can restore lost data. Application rollback must tolerate the expanded schema until a tested contract migration.

## 3. Configuration and secrets

Required configuration categories: public app/Supabase endpoints; server DB/worker identity; auth redirect/session/MFA settings; private storage buckets/limits; realtime private-channel setting; approved map tiles; notification providers; scanner; monitoring; backup destination; feature flags and election release pins.

Use least-privilege worker identities where possible. Service-role use is exceptional, isolated and audited. Rotate credentials on personnel/provider changes and suspected compromise. Backup credentials cannot delete production data; production credentials cannot erase the independent backup history. Secret values never appear in docs, logs or tickets.

Secure production headers, TLS and domain ownership are release gates. Preview host support must be configured narrowly for the actual preview environment, not by disabling origin/host protections globally.

## 4. Backup coverage and provider facts

Supabase documents daily backups for paid Pro/Team/Enterprise plans and optional PITR with at least Small compute; enabling PITR replaces daily backups. Database backups do not include Storage object bytes, only metadata [Supabase backups](https://supabase.com/docs/guides/platform/backups). Confirm current plan/region/pricing at procurement rather than relying on this blueprint as a price quote.

| Asset | Protection | Verification |
|---|---|---|
| PostgreSQL domain/auth configuration | Managed PITR if approved; scheduled logical export where supported; versioned schema/config | Restore to isolated project; RLS/role/function/extension checks; row/reference reconciliation |
| Storage originals/derivatives/imports/exports | Independent object-byte replication to restricted versioned/immutable destination; manifests | Hash/byte comparison and DB reference reconciliation; test actual object retrieval |
| Auth users/settings | Provider-supported export/config inventory; recovery documentation | Test identity/session/MFA behavior after recovery; never export passwords/secrets into Git |
| Application/configuration | Git/lockfile, deployment inventory, secret references and rotation procedure | Clean redeploy in isolation; no secret values in backup manifest |
| Audit/security history | DB backup plus external append-only/tamper-evident copy where approved | Hash-chain/manifest verification and access review |
| Queue/outbox | Durable DB state included in DB recovery | Lease expiry/replay tests; provider idempotency prevents duplicate effects |

Do not assume database PITR, Storage redundancy or a successful upload equals an independent backup. Do not assume Supabase backups include every edge function secret, external provider setting or object byte.

## 5. Proposed objectives and retention

These are approval targets, not achieved service levels:

- Acknowledged DB records: RPO ≤5 minutes; core intake/review RTO ≤2 hours.
- Acknowledged originals: RPO ≤15 minutes; evidence access RTO ≤4 hours, subject to measured volume.
- Full GIS/analytics/export services: RTO ≤8 hours.
- Election-day configuration/code recovery material updated before each release; no unversioned console-only change.

Daily-only DB backup implies a much larger RPO and cannot meet five minutes. If PITR or equivalent recovery is not funded, record actual RPO and obtain explicit risk acceptance. Continuous object replication must be implemented and measured before claiming a 15-minute evidence RPO.

Proposed retention for approval: short-lived operational logs; election-cycle plus legally approved review period for reports/evidence; restricted identity data minimized earlier where lawful; audit/hold material retained under schedule. No universal deletion period is invented. Counsel/controller must approve the data-class schedule, legal holds, backup expiry and disposal evidence. Backups cannot be selectively purged on every user request without a documented lawful process.

## 6. Backup implementation design

Database: configure managed PITR/daily option after plan approval; record recovery window and latest usable point through provider APIs/console evidence. Scheduled exports are supplementary only if supported and tested; physical backup download limitations must not be assumed away.

Storage: event-driven or scheduled incremental replication enumerates original/derivative objects and copies bytes with checksums. A manifest records object ID/key/version, bytes, SHA-256, custody state and replication time. Reconcile new/changed records and retry failures. Use separate provider credentials and versioning/object-lock where supported. Keep original evidence immutable; replication never transcodes it.

`backup_records` distinguishes requested, running, completed, failed, verified and restore-tested. A scheduler heartbeat is not a verified backup. Alert on missing recovery point, replication lag, hash mismatch, orphan DB reference, quota/cost failure and expired credentials.

## 7. Restore runbook

1. Declare incident, appoint recovery commander/scribe and freeze risky writes/deploys as appropriate.
2. Identify last known-good time, affected assets and desired recovery point; preserve forensic/audit material.
3. Request restore with scope/impact; a different authorized person approves. Production overwrite is never the default button.
4. Provision isolated recovery project/storage and restrict public/provider callbacks. Restore DB/PITR and object manifests/bytes.
5. Reconcile schema/migration versions, auth configuration, roles, RLS, private buckets, Realtime policies and approved geography/election releases.
6. Verify every in-scope evidence reference has expected object/hash; quarantine missing/mismatched references. Report gaps rather than marking healthy.
7. Rebuild safe derivatives/search/tiles/aggregates if needed. Expire old signed access and rotate secrets where compromise is suspected.
8. Replay outstanding outbox with provider idempotency; suppress duplicate external notifications/SMS. Validate client receipt reconciliation.
9. Run role/cross-zone, text submission, evidence access, emergency acknowledgement, chat and export smoke tests.
10. Recovery commander + operations + security approve promotion. Communicate expected data gap and client resync instructions. Monitor and record actual RPO/RTO.
11. Conduct post-incident review and update the runbook. Never declare success from a provider “restore completed” message alone.

Do not restore production personal data into a developer laptop or unapproved region. Recovery drills use synthetic data or a controlled staging dataset with equivalent protections.

## 8. Responsibilities and cadence

| Role | Responsibility |
|---|---|
| Operations lead | Go/no-go, election fallback, recovery command and communications |
| Engineering recovery owner | DB/application restoration, migration/config reconciliation |
| Evidence custodian | Object manifests, hash reconciliation and custody gaps |
| Security/privacy lead | Containment, access/secret rotation, breach/hold assessment |
| Independent approver | Validate restore request and promotion evidence |
| Product/controller | Retention/lawful processing and data-subject implications |

Proposed cadence: daily automated backup/replication health; weekly failed-job and lag review; monthly isolated sample restore; pre-election full DB+Storage+auth/outbox drill; after major schema/provider changes another drill. Record actual duration/loss and remediate missed targets. These are planned operations, not performed activities.

## 9. Monitoring and election-day readiness

Monitor API error/latency, DB connections/locks/query plans, RLS denial anomalies, auth failures, Realtime connections/fan-out, queue age/dead letters, upload/scan failures, storage/egress cost, backup lag and restore-test age. Health UI shows source/time and unknown state. Alerts have named on-call owners and escalation paths.

Election-day freeze window, support rota, direct emergency contacts, degraded-mode procedure and spare-device/contact process require operational approval. Run a full synthetic election simulation before go-live. Disable optional heavy exports/media derivatives under load only through documented feature flags; never disable RLS/audit or misrepresent receipt to increase throughput.

## 10. Production acceptance checklist

- [ ] Named production owner/controller/security/on-call roles.
- [ ] Separate projects/environments/secrets and approved regions/providers.
- [ ] Official geography/election configuration and privacy approvals.
- [ ] All phase gates and no unresolved critical/high security finding.
- [ ] Measured performance/capacity/cost envelope.
- [ ] DB and object restore drill with actual RPO/RTO evidence.
- [ ] Monitoring, support, emergency fallback and election simulation accepted.
- [ ] Formal go/no-go recorded; Phase 0 approval alone is insufficient.


## Phase 1 runtime status

A local Next production preview is implemented; no Vercel/Supabase environment has been created. Follow [Phase 1 environment instructions](docs/phase-1/ENVIRONMENT.md) for Node 22.22.3/npm 12.2.1, exact lockfile, validation commands and health semantics. `/api/health` proves only that the application process responds. CI is defined but remote execution must be recorded separately. All later deployment/recovery gates below remain planned.
