# Phased Implementation Roadmap and Acceptance Gates

Status: **ARCHITECTURALLY DEFINED** · 2026-11-02

Phase 0 is a review candidate. No later phase is complete. Each phase must deliver its scope, migrations where applicable, tests, security controls, documentation and a factual completion report. “UI exists” is not implementation evidence. Dates/team capacity are not invented; the product owner must resource and schedule the approved sequence.

## Common phase exit package

Every phase reports: objectives; files changed; migrations applied and target environment; frontend/backend/security work; tests actually executed with results; acceptance passed/failed; defects/risks; updated status vocabulary; recommended next phase. Unexecuted tests are PLANNED/BLOCKED, never passed. Critical/high security defects block production and the affected live-data workflow.

Cross-cutting requirements begin early: RLS/grants with every sensitive table; audit/outbox/idempotency with first durable writes; offline semantics with first field forms; evidence custody with first attachments; accessibility/error states with every UI. Phase 10/11 consolidate and assure these controls rather than adding them for the first time.

## Phase 0 — Discovery and architectural blueprint

**Objectives:** establish scope, authority, workflows, data model, security boundaries, UX direction, operational assumptions and measurable gates.

**Implementation:** documentation only. Inspect existing repository; research primary platform/electoral references; define architecture and unresolved decisions. No application components, live DB changes or production data.

**Deliverables:** PRD; module/dependency map; organization/geography contract; role matrix; complete conceptual ERD/dictionary; RLS/threat model; application/API architecture; user journeys; evidence/offline/GIS design; recovery plan; roadmap/testing; decision/status registers.

**Security/tests/docs:** review authorization coverage and non-fabrication rules; validate document links/entity coverage; record research limitations. These checks do not verify application behavior.

**Acceptance:** all 22 requested blueprint areas covered; every minimum data entity represented; all requested routes/modules mapped; assumptions and blockers explicit; no implementation/deployment claim; product/operations/security/engineering review recorded. **Current state: review pending.** Phase 1 starts only after approval.

## Phase 1 — Foundation and design system

**Objectives:** create a strict, accessible, responsive application foundation and three honest visual shells.

**Frontend:** compatible pinned Next.js App Router/React/TypeScript/Tailwind/shadcn/Lucide stack; theme/tokens; central sidebar/alert rail, zonal tablet shell, field mobile shell; navigation, global-search shell, notification/profile shells; loading/empty/error/offline patterns; public legal-content structure with approval-pending text clearly identified.

**Backend/database:** environment validation, server/browser boundaries, health/build metadata and logging contract. No new operational schema or fake authentication. Migrations: none unless a documented foundation need is approved.

**Security:** no secrets in public config; safe headers/origin strategy; route-shell protection contract; dependency/secret scan; no hardcoded login or production counts. Incomplete actions are disabled/labelled, not simulated.

**Tests:** clean install/build/typecheck/lint; component and navigation tests; keyboard/contrast/screen-reader smoke; mobile/tablet/desktop viewports; reduced motion/zoom; bundle baseline. No broken shell routes.

**Docs/artifacts:** architecture/version decision, design tokens, environment guide, accessibility report, Phase 1 completion report.

**Exit:** compatible lockfile; zero TypeScript/lint errors; responsive layouts; no critical accessibility finding; shell states honest; CI green. Operational modules remain PLANNED. Approve before Phase 2.

## Phase 2 — Database and authentication

**Objectives:** real identity, scoped authorization and normalized foundations.

**Database/migrations:** extensions/schemas; organization/profile/role/permission/grant/membership/invitation/device/session/consent; election/geography release foundations; RLS helpers, policies, grants, constraints and indexes; audit/outbox/idempotency primitives. Private Storage/Realtime baseline configuration.

**Frontend/backend:** Supabase sign-in/recovery/reset/MFA; invitation acceptance; pending/active/suspended states; role-aware routing; basic configuration and geography import foundation. No public privilege grant.

**Security:** AAL2 for privileged roles; fixed-search-path helpers; no editable metadata authority; no public reads/buckets; session revocation design; approved environment separation.

**Tests:** real local Auth flows; pgTAP allow/deny for every table/operation; cross-zone/agent denial; role escalation; suspended session; MFA; direct Storage/Realtime negatives; migration empty/upgrade; bundle secret scan.

**Docs/exit:** executable ERD/migration docs, RLS test report, auth runbook, Phase 2 report. Authentication and role routing work; cross-zone access prevented; no privileged exposure. Geography operational approval may remain blocked without weakening tests.

## Phase 3 — Organization and agent management

**Objectives:** verified personnel, scoped rooms and auditable coverage.

**Migrations/frontend/backend:** staff/agent profiles, verification/delegation, room/supervisor relationships, time-bounded assignments/history, checkins/availability; approved geography import/approve UI; personnel lists/forms; assignment and checkin workflows; performance source events.

**Security:** district managers limited to allowed roles/agents; own-only agent reads; server-derived checkin actor/location consent; privileged changes audited; no continuous tracking.

**Tests:** onboarding/verification/suspension; assignment overlap/reassignment; multiple agents per PU; optional GPS denial; cross-zone manager and other-agent negatives; historical scope preservation; official code/parent import validation.

**Docs/exit:** personnel/assignment SOP, geography release evidence, metric definitions, Phase 3 report. Managers can operate only authorized personnel; agents see own assignments; every assignment change/checkin is traceable.

## Phase 4 — Field reporting engine

**Objectives:** durable, low-bandwidth situation reporting with review history.

**Migrations:** categories, report roots/versions/reviews/attachment foundations, receipts/idempotency and scoped query indexes. **Frontend:** mobile home/report/drafts/history/sync; structured category forms; assignment context; clear receipt states. **Backend:** transactional create/correct/review, outbox notifications and cursor reads.

**Security/offline:** own active assignment; no client verification; per-account IndexedDB draft/outbox atomic save; stable idempotency; session-expiry preservation; server-authoritative receipt; scoped supervisor delivery.

**Tests:** ordinary report E2E; category validation; duplicate/lost response; concurrent correction; offline reload/closure; auth expiry; unauthorized review; real database counts; representative 30–60s usability observation (record result, do not assume).

**Docs/exit:** reporting SOP, sync contract, test evidence, Phase 4 report. Reports reach authorized supervisors; originals retained; drafts survive reload; duplicates prevented; queued work never shown as received.

## Phase 5 — Incident and emergency management

**Objectives:** safe triage, ownership, escalation and emergency acknowledgement.

**Migrations/frontend/backend:** incident versions/categories/updates/assignments/escalations/resolutions; confidential identity separation; emergency alerts/acknowledgements/responses; priority worklists, response forms and notification engine foundations.

**Security:** legal state transitions, closure grants, source-identity permission, generic push previews, scoped Realtime, emergency abuse controls and explicit unsent state. No automated guilt label.

**Tests:** all lifecycle transitions and forbidden shortcuts; critical alert priority; duplicate acknowledgement; escalation; confidential identity denial; offline emergency wording; suspension; commit-to-render latency baseline; notification provider failure independent of receipt.

**Docs/exit:** response/escalation configuration approved, emergency contacts/safety notice, Phase 5 report. Critical alerts visible to authorized command; ownership/response history complete; unauthorized incident access denied.

## Phase 6 — Media and evidence management

**Objectives:** safe capture, private custody and recoverable uploads.

**Migrations/frontend/backend:** upload reservations, evidence/hashes/access/annotations, typed attachment links; camera/gallery/audio/video interfaces, preview/progress/retry; private quarantine/original/derivative buckets; scanner/derivative workers; repository.

**Security:** signature/size/hash checks, malware quarantine, no original overwrite/delete, short-lived signed/proxied access, access/download audit, safe derivatives and metadata handling.

**Tests:** supported mobile capture/fallback; interrupted upload/lost finalize response; hash mismatch; malicious file; unauthorized preview/download; original preservation; late attachment; quota; scanner outage; backup manifest foundation.

**Docs/exit:** custody/scanner/retention SOP, device compatibility matrix, Phase 6 report. Original integrity and private access proven; failed uploads recover; no clean/available label before required checks.

## Phase 7 — Secure communication engine

**Objectives:** authorized persistent direct/group/incident communication.

**Migrations/frontend/backend:** conversations/members/messages/attachments/receipts; history/search; realtime invalidation; membership epoch; notification integration; incident-linked discussions.

**Security:** active-member RLS and private channel policies; sender derivation; restricted history on join; removal/session revocation; attachment scope; no E2EE claim.

**Tests:** send/receive/reconnect; nonmember/cross-zone subscription; removed member; forged sender/read receipt; offline queue/idempotency; attachment authorization; history pagination; provider/socket outage reconciliation.

**Docs/exit:** communication policy, receipt semantics, Realtime revocation report, Phase 7 report. Only authorized recipients receive messages; history persists; read/delivery/commit remain distinct.

## Phase 8 — Election result management

**Objectives:** versioned, validated observations and separate official-source records.

**Migrations/frontend/backend:** approved election/party/candidate configuration; result roots/versions/entries/reviews/discrepancies/attachments; official publications/entries; transcription/review/comparison UI and exports.

**Security:** nonnegative counts, discrepancy flags without rewriting, distinct-agent preservation, exact retry deduplication, no self/unauthorized verification, dual-approved official publication and immutable evidence.

**Tests:** arithmetic boundary corpus; unknown versus zero; duplicate/concurrent result; correction after review; unauthorized/self approval; source-document authentication; official label separation; cross-configuration candidate injection; export provenance.

**Docs/exit:** result-review SOP, approved contest configuration, Phase 8 report. Correct PU association; validation/versioning work; verified observation never labelled official declaration.

## Phase 9 — GIS and operational analytics

**Objectives:** authorized spatial intelligence and real operational metrics.

**Migrations/frontend/backend:** PostGIS boundaries/coordinates/features and indexes; scoped cluster/feature/list APIs; MapLibre layers/filters; coverage heatmaps; zone/LGA/ward dashboards; agent compliance metrics; aggregate refresh/reconciliation.

**Security:** approved geography only; no sensitive static tiles; precise-location permission; map/list/export/search scope parity; neutral performance definitions.

**Tests:** geometry/source validation; null coordinate fallback; cross-zone bbox/ID attempts; cluster reconciliation; filter correctness; real-data aggregate reconciliation; mobile/WebGL fallback; map payload/query benchmarks.

**Docs/exit:** geography attribution/release manifest, metric dictionary, GIS performance report, Phase 9 report. No invented coordinates or production statistics; accessible list works; measured map performance.

## Phase 10 — Administration, security and recovery

**Objectives:** operational governance, controlled exports and proven recovery.

**Migrations/frontend/backend:** security-event updates/workflow, audit/session views, settings/integrations, notification providers/preferences, export jobs, retention/hold/privacy workflows, backup records and isolated restore requests; health indicators from real signals.

**Security:** privileged MFA/dual control, audit deletion denial, external tamper-evident audit copy, export formula/privacy controls, provider-secret isolation, vulnerability remediation and access review.

**Tests:** privilege/suspension/export/audit negatives; CSV/XLSX formula injection; provider retry/dead letter; retention hold; privacy request; full isolated DB+Storage+auth/outbox restore; measured RPO/RTO; dependency/security scans.

**Docs/exit:** security/retention/backup/restore runbooks, drill evidence, risk/remediation register, Phase 10 report. A backup is not verified until restored; no normal admin can erase audit history; unresolved critical/high findings block production.

## Phase 11 — Offline optimization and performance

**Objectives:** harden field resilience and prove measurable budgets.

**Implementation:** PWA install/update shell, IndexedDB migrations/quota/persistence, background sync enhancement, media retry/resume where supported, conflict UX, backoff/jitter, lazy bundles, reference caching, scoped subscription limits and connection-quality indicators. No fundamental schema redesign to bypass RLS.

**Tests:** poor/intermittent/disconnected network; reload/browser closure; account switch/logout; interrupted capture/upload; duplicate sync; stale assignment; suspended auth; quota denial; service-worker update; lower-end Android/iOS matrix; load/reconnect storms; text/dashboard/realtime benchmarks.

**Docs/exit:** supported-browser limitations, sync recovery guide, measured performance/cost report, Phase 11 report. No silent loss in defined tests; idempotent sync; pending remains pending; targets met or formally revised with risk acceptance.

## Phase 12 — Integration, security audit and load testing

**Objectives:** independent, cross-module assurance before live operation.

**Work:** full E2E and role matrix; RLS/API/storage/Realtime penetration tests; upload abuse; auth/MFA/suspension; cross-zone and privilege escalation; concurrency/idempotency; DB/GIS/Realtime load; mobile compatibility; backup restoration; disaster simulation; privacy review.

**Artifacts:** executed test logs, security audit, benchmark report, bug register, risk register, remediation retests and residual-risk decisions. Independent reviewer should not be the sole implementer of the tested controls.

**Exit:** critical workflows pass under all relevant personas; no unresolved critical/high vulnerability; accepted capacity/recovery envelope; all major defects dispositioned; formal readiness review. Failed targets are not relabelled as passed.

## Phase 13 — Production deployment and election readiness

**Objectives:** controlled release and people/process readiness, not just hosting.

**Work:** approved production project/domain/TLS/secrets; migrations and monitoring; backup/replication schedules; on-call/support; administrator/agent onboarding; verified emergency contacts; operational/privacy training; election-day freeze and fallback; full synthetic election simulation from assignment through field report/result/incident/media/chat/review/escalation/export/recovery.

**Security/acceptance:** production configuration review, no test data in live operation, approved geography/candidates, least-privilege access, restore evidence, incident-response rehearsal and formal go/no-go by operations/product/security/engineering.

**Docs/exit:** deployment record, election-day runbook, support rota, simulation report, acceptance signatures and rollback/fallback decision. Only then may real operational data be processed. A Vercel URL alone is not election readiness.

## Dependency and change control

Later-phase work may be prototyped behind disabled flags only against approved contracts; it cannot be marked complete before prerequisites. Changes to scope, authorization, geography authority, retention or recovery require architecture review and updated tests. Maintain [IMPLEMENTATION_STATUS.md](../../IMPLEMENTATION_STATUS.md) and phase reports with evidence links. No election date or team velocity is assumed in this roadmap.
