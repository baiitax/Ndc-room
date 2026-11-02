# Testing and Acceptance Strategy

Status: **PLANNED application/database testing; Phase 0 document checks tracked separately** · 2026-11-02

## 1. Truth in reporting

Only executed checks may be reported as passed. Record command, environment, commit, dataset/personas, timestamp, result and artifact. Distinguish VERIFIED IN CODE, DATABASE, UI and END-TO-END; a component render does not prove persistence, and an API success does not prove RLS. Skipped/blocked tests remain visible. No production data is used in automated tests.

Phase 0 has no Next.js application, Supabase schema or deployed endpoint. Vitest/Playwright/pgTAP results therefore do not exist yet. Document validation results are reported in [Phase 0 report](PHASE_COMPLETION_REPORTS/PHASE_0.md), not as product tests.

## 2. Test layers and proposed tooling

| Layer | Tooling / environment | Required evidence |
|---|---|---|
| Static | Strict TypeScript, ESLint, dependency/secret scan, schema validation | Clean lockfile install and zero suppressed errors |
| Unit | Vitest | Schemas, arithmetic, state transitions, idempotency fingerprint, metric definitions, redaction |
| Component | React Testing Library + Vitest | Forms, validation, receipt labels, empty/error/offline states, accessibility roles |
| Database | Local Supabase Postgres + pgTAP via `supabase test db` | Grants/RLS, constraints, immutable versions, scope chains, RPC transitions |
| API integration | Local/staging Supabase Auth/Storage/Realtime + typed test client | Real identity, durable writes, upload/finalize, private access, revoked membership |
| End-to-end | Playwright | Field→district→central workflows, real DB receipts, role routing and denied direct access |
| Accessibility | axe-based automation plus manual keyboard/screen-reader/zoom | WCAG 2.2 AA target; map list alternative and critical alert behavior |
| Mobile/device | Real target Android/iOS devices plus emulation | Camera/mic/file fallback, IndexedDB, PWA update, quota, recording interruption |
| Network/fault | Playwright network controls/proxy and worker/provider fault injection | Offline, lost response, retry, conflict, partial media, reconnect storm |
| Performance/load | k6 or equivalent approved runner; DB EXPLAIN/monitoring | Defined percentiles, load model, dataset, cost and bottleneck report |
| Security | RLS negative suite, SAST/DAST/dependency checks, independent penetration review | Findings/retests, no open critical/high at production gate |
| Recovery | Isolated Supabase/staging restore and object manifest reconciliation | Actual RPO/RTO, hash/reference/role/outbox validation |

Tool versions will be pinned after Phase 1 compatibility checks. Local Supabase requires a container runtime or approved remote test alternative; the Phase 0 sandbox did not provide Docker. This is an execution setup issue, not permission to mock RLS tests and call them database verification.

## 3. Test personas and isolation

Synthetic identities only; names below are labels, not real personnel or electoral records.

| Persona | Scope / grants |
|---|---|
| Central super administrator | One test organization, MFA, explicit governance grants |
| Central commander | Same organization, statewide operational read/response, not automatic IAM |
| Central staff A | Result verification only |
| Central staff B | Incident/evidence only, no result verification |
| North commander | North district, MFA, delegated agent management |
| South commander | South district, MFA, same template as North |
| Central commander | Central district (organizational district, not central command), MFA |
| North zonal staff | North reporting/incident subset |
| Agent North A | Own active North assignment |
| Agent North B | Different own North assignment/PU |
| Agent South A | Own South assignment |
| Auditor | Approved read-only/audit grant, no raw source identity |
| Pending / suspended / revoked | Explicit negative-control identities |
| Anonymous visitor | No application data grants |

Fixtures include three districts, synthetic LGA/ward/PU chains clearly marked test-only, multiple agents per PU, assignments with history, approved synthetic election configuration, reports/results in every review state, incidents/confidential identities, evidence hashes, conversations and queued local operations. Production geography is never replaced by these fixtures.

## 4. Mandatory authorization matrix

For every sensitive table and major RPC, test SELECT/INSERT/UPDATE/DELETE as applicable under every relevant persona. Include direct API/RPC calls, not just UI navigation. Test child joins, views, search, counts, exports, Storage and Realtime separately. A denied write must assert the target remained unchanged; zero affected rows alone is insufficient. Allowed writes assert returned IDs/content.

| Resource/action | Agent | District commander | Central staff | Auditor | Anonymous |
|---|---|---|---|---|---|
| Other agent profile | Deny | Own district + permission only | Personnel grant only | Minimized approved only | Deny |
| Other-zone report/result/incident | Deny | Deny | Explicit org module grant only | Approved projection only | Deny |
| Own report create | Active assignment only | Only if separately agent-assigned | No implicit self-agent grant | Deny | Deny |
| Review status/role change | Deny | Only delegated grant | Specific review/IAM grant | Deny | Deny |
| Evidence download | Own/authorized link | District + evidence grant | Linked scope + evidence grant | Approved + evidence grant | Deny |
| Conversation subscribe/send | Member only | Member only | Member only | No implicit access | Deny |
| Audit delete | Deny | Deny | Deny | Deny | Deny |

Central commander/super admin positives are tested separately; “central” does not mean another organization. Staff permission subsets must deny ungranted modules even in their own scope.

## 5. Twelve explicitly required scenarios

| # | Scenario | Required assertion / layers |
|---|---|---|
| 1 | Agent accesses another agent's records | Forged owner/resource UUID denied in DB/API; no private contact/history/evidence leak |
| 2 | Agent accesses another zone | Direct read/write/filter/topic/export denied; own assignment unaffected |
| 3 | District commander accesses another district | North→South and South→Central UUID/bbox/search/Realtime/export denied |
| 4 | Unauthorized result verification | Agent/staff without grant and self-review denied; original review state unchanged |
| 5 | Unauthorized evidence download | Bucket list/read, signed URL request, proxy and attachment link deny; no URL issued |
| 6 | Unauthorized conversation access | Nonmember/cross-zone subscribe/read/send and removed-member epoch tests deny |
| 7 | Duplicate report submission | Concurrent same key yields one version/receipt; changed payload conflicts; distinct agents preserved |
| 8 | Duplicate result submission | Same operation deduplicated; independent observations retained/linked; correction version explicit |
| 9 | Interrupted media upload | Local original retained; retry/reconcile; no orphan marked received; hash mismatch quarantined |
| 10 | Offline report synchronization | Draft survives reload; pending until commit; same key after lost response; authoritative receipt persisted |
| 11 | Suspended account attempts login/continued use | New login/commands/reads blocked as policy; sessions/channels revoked; queued upload not accepted |
| 12 | Privileged role escalation | Metadata/body/RPC/direct grant attempts fail; MFA/delegation enforced; audit records attempt |

Each scenario includes a positive control so an accidentally broken endpoint returning no data cannot make every negative test appear successful.

## 6. Workflow and invariant suites

- Auth invitation expiry/replay, recovery redirect allowlist, MFA challenge, session/device revocation and pending activation.
- Geography duplicate/missing parent/cross-release code, source hash idempotency, approval and null coordinate behavior.
- Assignment overlap/reassignment, multiple agents, historical scope, GPS consent/denial and discrete checkin only.
- Report/result/incident version immutability, stale expected version, review-specific version and correction history.
- Incident legal/forbidden transitions, duplicate/dispute/insufficient evidence, escalation and closure authorization.
- Emergency first/subsequent acknowledgement, response ownership, offline unsent wording and generic notification payload.
- Arithmetic: zero/unknown/negative/non-integer/overflow; candidate sum; valid+rejected; accredited/cast/registered discrepancy; faithful questionable source remains flagged.
- Official publication authority/source/dual approval and separation in UI/API/export/GIS.
- Evidence original/derivative hashes, quarantine/scan failure, annotation version, signed expiry and access logs.
- Communication commit versus delivered/read, membership history, attachment scope and reconnect reconciliation.
- Notifications retry/dead letter/provider failure; accepted by provider is not read by user.
- Exports scope/snapshot/provenance/formula injection/download reauthorization and evidence manifest.
- Retention/legal hold/privacy request and audit preservation.

## 7. Offline and mobile acceptance corpus

Test airplane mode, high latency/loss, intermittent requests, DNS/provider failure, reconnect, reload/browser closure, app update, account switch, logout with queue, expired/suspended session, storage quota/persistence denial and local schema migration. Interrupt photo/audio/video upload before bytes, after bytes before finalize and after commit before client receipt. Assert no silent local loss, duplicate logical submission or false received label.

Device matrix must be approved from actual field inventory. Include low-end Android Chrome and supported iOS Safari, camera/mic permission denial, file-picker fallback, backgrounding during recording, thermal/storage constraints and 200% zoom. Browser emulation alone cannot certify camera/PWA behavior.

## 8. Performance and load plan

Planning envelope (not measured): 5,000 agents, 2,000 concurrent connections, 20 writes/s sustained, 100 writes/s burst; 10,000-agent stress. Use historical geography only as a sizing reference. Seed representative reports/versions/evidence metadata/messages/audit, not just empty tables. Model opening checkins, midday reports, closing results, critical fan-out, reconnect storms and exports.

Measure text receipt p95 <5s on agreed stable profile; dashboard/list p95 <2s; field LCP p75 ≤3s on constrained profile; healthy critical commit-to-render p95 <5s. Record errors, saturation, query plans, pool waits, queue age, bytes/egress and cost. Include media separately. Run soak and burst tests; verify no acknowledged-record loss and bounded retry behavior. Targets are accepted only with artifacts or formally revised.

## 9. Security, privacy and recovery gates

Run malicious upload/polyglot/size/hash tests, XSS/CSRF/origin/header checks, secret/bundle scan, SQL injection/input validation, privilege/cross-zone negatives, signed-link behavior, audit deletion denial and provider isolation. Independent penetration review and remediation retests precede production.

Privacy tests cover minimization, source-identity separation, retention holds, export redaction and data-subject workflow. Recovery tests restore DB and actual object bytes, reconcile hashes/references, validate auth/RLS/Realtime/outbox and measure RPO/RTO. A dashboard backup status is not a restore test.

## 10. CI and release gates

Pull requests: static/unit/component/migration/RLS tests and build. Staging: integration/E2E/accessibility/mobile smoke and scoped provider tests. Nightly/pre-release: deeper security, load, fault and restore samples as appropriate. Production: approved migration/release plan, recovery point, smoke evidence and go/no-go.

A phase completion report links actual artifacts. Failed/blocked acceptance stays failed/blocked. No `it.skip`, lint suppression or mocked database may be used to manufacture a passing phase gate.


## Phase 1 executed foundation checks

The former planning-only status is superseded for the foundation layer by the [Phase 1 report](PHASE_COMPLETION_REPORTS/PHASE_1.md): 34 unit/component tests and 35 production-browser project cases passed, one desktop skip. Tests cover all workspace/account routes, search/theme/navigation, drawer focus, both themes with selected axe rules, 320px primary-shell reflow/targets, online/offline hints and honest public states. Browser projects use Chromium desktop/tablet/mobile emulation, not three engines or physical devices. `npm run test:e2e` builds must be current; it launches a separate production server at port 3001. CI installs the matching Playwright Chromium; local sandbox evidence used explicitly disclosed external Chromium 143. Database/RLS, operational E2E, load, device, screen-reader and restore tests remain unexecuted.
