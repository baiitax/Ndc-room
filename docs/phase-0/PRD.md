# Product Requirements Document

Document: KEMSR-PRD-0001 · Version 1.0 · 2026-11-02 · **ARCHITECTURALLY DEFINED; awaiting review**

## 1. Problem and intended outcome

Election observers need a safe, low-bandwidth way to send observations from assigned polling units; commanders need to know what was received, what needs review and who owns a response. The product unifies field reporting, district coordination and central oversight without treating allegations as findings or observer transcriptions as official results.

The operating organization, election date and deployment owner are not yet identified. The platform is for an authorized monitoring organization, not an INEC replacement. The source request is the initial requirements baseline; this document makes implementation boundaries explicit.

## 2. Personas, jobs and success measures

| Persona | Job to be done | Success measure |
|---|---|---|
| Field agent | Send an observation or request help without losing work | Durable local save; clear server receipt; accessible retry; safe emergency guidance |
| Supervisor | Know coverage and respond to assigned personnel | Accurate assignment/checkin state; bounded queue; response audit |
| Senatorial commander | Coordinate one district | No cross-zone reads/writes; verified workload/coverage; owned escalations |
| Central commander | Understand statewide operations | Reconciled scoped aggregates; drill-down provenance; timely critical alerts |
| Verification staff | Review a particular kind of record | Version-specific decisions; arithmetic/document checks; no self-approval by default |
| Administrator | Govern access/configuration safely | Explicit grants, MFA, suspension, audit and recovery controls |
| Auditor | Inspect approved evidence/history | Read-only, minimized projections and logged access |

No success measure rewards political loyalty, candidate preference, number of allegations or lack of incidents.

## 3. Scope and release boundaries

All modules in the source brief are in the eventual product scope. Delivery is phased. “MVP” is not permission to remove RLS, audit, durable receipt or result provenance. GIS, large media, external messaging and advanced exports may be disabled by feature flags until their phase passes; disabled modules show an honest unavailable state, not fabricated functionality.

Out of scope: voting, voter-register processing, BVAS integration, automatic winner projection, covert tracking, biometric identification, autonomous legal/enforcement decisions and public access to operational records. Official-source publication is a controlled reference workflow, not a declaration engine.

## 4. Functional requirements

Priority: P0 = necessary for safe live operation; P1 = required by full product brief before final acceptance; P2 = optional enhancement after core acceptance. Every P0/P1 requirement remains planned until implemented and tested.

| ID | Requirement | Priority / phase | Acceptance evidence |
|---|---|---|---|
| IAM-01 | Supabase-backed sign-in, recovery, verified invitation and activation; no public privilege grant | P0 / 2 | Real test-account login; pending/suspended access denied |
| IAM-02 | Scoped roles and configurable central/zonal staff permissions | P0 / 2 | Role matrix tests, including direct API attempts |
| IAM-03 | MFA for privileged accounts and sensitive grants; session/device review/revocation | P0 / 2,10 | AAL2 enforcement and revoked-session tests |
| IAM-04 | User profile/contact update without access to other agents' private information | P0 / 3 | Owner/other-agent tests; profile audit |
| GEO-01 | Import and validate approved district/LGA/ward/PU releases, all 44 LGAs | P0 / 2–3 | Manifest, parent/code checks, reconciliation and approval |
| GEO-02 | Optional sourced coordinates and validated boundaries; no fabricated production data | P0 / 9 | Null-coordinate behavior; provenance and spatial validity tests |
| ORG-01 | Central and three district rooms, organization membership and supervisor relationships | P0 / 3 | Scope/relationship tests and history |
| AGT-01 | Onboard, verify, activate, suspend and assign/reassign agents | P0 / 3 | Delegated manager tests; effective-dated assignment audit |
| AGT-02 | Arrival, availability and checkout with optional transparent GPS and accuracy | P0 / 3 | Consent/denial path; no background tracking |
| RPT-01 | Structured categories, observations, description, optional severity and evidence | P0 / 4 | Validated submission and own-history read |
| RPT-02 | Draft, queued, received and review states; server-authoritative receipt | P0 / 4 | Lost-response/retry and refresh tests |
| RPT-03 | Corrections as versions; authorized verification/dispute/rejection | P0 / 4 | Immutable original and reviewer permission tests |
| INC-01 | Structured incident categories, severity, safety and assistance flags | P0 / 5 | Required-field and neutral-language tests |
| INC-02 | Triage, ownership, investigation, escalation, resolution and authorized closure | P0 / 5 | Every allowed/forbidden transition tested |
| EMG-01 | Rapid emergency type/location/note, priority receipt and acknowledgement | P0 / 5 | Commit-to-render measurement; unsent state and safety notice |
| MED-01 | Camera/gallery, audio and short video with supported-browser fallbacks | P1 / 6 | Mobile device matrix; file picker fallback |
| MED-02 | Private original upload, retry, hash, quarantine, derivatives and typed links | P0 / 6 | Unauthorized download/overwrite and interrupted-upload tests |
| MED-03 | Evidence inventory, access/download logs, versioned annotations and controlled export | P0 / 6,10 | Audit reconciliation and manifest/hash package |
| COM-01 | Authorized direct/group and incident-linked conversations | P1 / 7 | Nonmember and cross-zone subscription denied |
| COM-02 | Persisted text/attachments, delivery/read receipts, search and notifications | P1 / 7 | Receipt semantics and history after reconnect |
| RES-01 | Configurable election, party and candidate lists with jurisdiction/date scope | P0 / 8 | Approved configuration required; no invented roster |
| RES-02 | Structured transcription, nonnegative counts and discrepancy flags | P0 / 8 | Arithmetic boundary corpus including inconsistent originals |
| RES-03 | Distinct submissions preserved; exact retries deduplicated; corrections versioned | P0 / 8 | Concurrent duplicate and multi-agent tests |
| RES-04 | Independent authorized review; official publications separate | P0 / 8 | Self/unauthorized approval denied; labels/exports retain provenance |
| GIS-01 | MapLibre/PostGIS layers, filters, clustering and list alternative | P1 / 9 | Scoped API/map parity; keyboard/list use; missing-coordinate behavior |
| ANA-01 | Real coverage, activity, incident, review and response analytics | P1 / 9 | Query-to-aggregate reconciliation; missing-data labels |
| ANA-02 | Transparent agent compliance/performance metrics | P1 / 9 | Metric definitions exclude political preference/allegation counts |
| NOT-01 | In-app/Realtime notifications, priority, preferences and delivery history | P0 / 5–7 | Generic lock-screen payload; retry and provider-failure states |
| NOT-02 | Configurable push/email/SMS providers where approved | P1 / 10 | Adapter contract tests; no false delivered claim |
| ADM-01 | Audit, security-event workflow, login/privilege history and health indicators | P0 / 10 | No client audit edit/delete; measured health provenance |
| ADM-02 | PDF/XLSX/CSV reports with scope, provenance, timestamp and generator | P1 / 10 | Export authorization, formula safety and reconciliation |
| BAK-01 | Separate DB/evidence recovery, history, integrity and restore requests | P0 / 10 | Isolated restore and DB/object hash reconciliation |
| OFF-01 | PWA shell, per-account IndexedDB drafts/reference data/outbox/media | P0 / 4,6,11 | Reload/closure/quota/persistence tests |
| OFF-02 | Idempotent synchronization, conflict handling, backoff and manual control | P0 / 11 | Duplicate sync, assignment conflict and interrupted media tests |
| SEC-01 | RLS on all sensitive tables; private buckets and authorized Realtime | P0 / 2 onward | Automated positive/negative tests per role and resource |
| SEC-02 | Privacy notices, lawful-basis register, retention/hold and data-subject process | P0 / 2,10 | Counsel/controller approval and exercised request/hold workflow |
| OPS-01 | Isolated environments, release gates, monitoring and election simulation | P0 / 12–13 | Formal acceptance package and rehearsed fallback |

## 5. Report and incident content

Report categories: opening; officials arrived; materials arrived; accreditation/voting commenced; queue; voting process; observers present; accessibility; closing; counting; announcement observed; general update. Category-specific structured fields are versioned configuration, not arbitrary client JSON accepted without validation.

Incident categories: violence/threats; intimidation; disruption; missing materials; delayed start; accessibility; procedural irregularity; equipment malfunction; result-document concern; security concern; other. Severity: informational/low/medium/high/critical. Capture only necessary involved-person/witness information; no encouraged confrontation or evidence gathering under danger.

Emergency types: immediate personal threat; violence; medical; security; communication assistance; operational emergency. Anonymous reporting is disabled until an approved policy exists. Confidential authenticated reporting is distinct from anonymous reporting; source identity is stored separately and requires a specific access grant.

## 6. Nonfunctional requirements and measurement profiles

| ID | Requirement | Proposed acceptance |
|---|---|---|
| NFR-01 | Mobile performance | LCP p75 ≤3s on agreed low-end Android/4× CPU throttle, 1.6 Mbps down/768 kbps up/150 ms RTT profile; record device/browser and cold/warm cache |
| NFR-02 | Submission | Text receipt p95 <5s on 10 Mbps/50 ms RTT profile; exclude media but include auth/API/database work |
| NFR-03 | Operational interaction | List/dashboard p95 <2s on agreed seeded dataset; no unbounded page reads |
| NFR-04 | Critical realtime | Commit-to-authorized-UI p95 <5s on healthy network; report disconnected cases separately |
| NFR-05 | Durability | Zero acknowledged-record loss in defined fault tests; local commits visibly fail when storage unavailable |
| NFR-06 | Accessibility | WCAG 2.2 AA target; automated checks plus manual keyboard/screen-reader review |
| NFR-07 | Security | No unresolved critical/high finding at production gate; database negative tests mandatory |
| NFR-08 | Compatibility | Supported Android Chrome and iOS Safari versions agreed after device inventory; camera/recording/PWA limitations documented |
| NFR-09 | Recoverability | Proposed DB RPO ≤5m, intake RTO ≤2h; evidence RPO ≤15m/access RTO ≤4h; prove or revise formally |
| NFR-10 | Observability | Correlation IDs, structured logs, redacted errors, queue lag, provider failure and freshness metrics |
| NFR-11 | Cost/capacity | Approved load/media/egress envelope and alerts before live operation |
| NFR-12 | Usability | Practiced ordinary report in 30–60s; test with representative agents, not developer timing alone |

The profiles and figures are proposed test inputs, not measurements or guarantees. “First meaningful content” is operationalized using LCP plus task-ready checks; LCP alone is insufficient.

## 7. Data and operational governance

Required before real personal data: named controller and privacy contact, purpose/lawful-basis register, processor/region inventory, DPIA, retention/hold schedule, source-protection policy, access-review cadence and emergency contact verification. NDPA compliance is an organizational process supported by software, not a checkbox supplied by Supabase.

Election configuration requires operational approval of candidate/party lists, geography version, reporting windows, review roles and escalation thresholds. Reference releases are immutable once used; changes create a new release or explicit migration with audit.

## 8. Assumptions and exclusions

- One operating organization initially; organization IDs support future separation but no public multi-tenant signup is specified.
- Three Kano senatorial rooms; central command is not a senatorial zone.
- Email/phone choice, languages, device ownership, election date, provider budgets and live counts are unresolved.
- No offline authentication guarantee, continuous location collection, E2EE claim, automated malware-scan claim or provider-independent push guarantee.
- No real names, party rosters, PU coordinates, emergency numbers or election statistics are seeded as part of architecture.

## 9. Acceptance and change control

Every requirement maps to tests in [TESTING.md](../../TESTING.md) and a phase gate in [ROADMAP.md](ROADMAP.md). Changes affecting scope, data classification, authorization or recovery require product, operations and security review. The [decision register](DECISION_REGISTER.md) records unresolved answers. Phase 0 approval authorizes foundation work only, not production processing.
