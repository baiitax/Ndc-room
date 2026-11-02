# Security Architecture, RLS Strategy and Threat Model

Status: **ARCHITECTURALLY DEFINED — no security control is represented as deployed or tested** · KEMSR-SEC-0001 · 2026-11-02

## 1. Security objectives and acceptance boundary

Protect observer identities, unpublished observations, confidential sources, evidence, conversations and election operations against unauthorized access, alteration, loss and misuse. Preserve neutral provenance and accountable administration. Database enforcement is mandatory; frontend hiding is not authorization.

Production gate: no unresolved critical/high risk; completed role/RLS/API/storage/Realtime tests; independent security review; privacy approval; measured recovery and operational fallback. A clean dependency scan or this document alone is not penetration-test evidence.

Normative references: [role matrix](docs/phase-0/ROLE_PERMISSION_MATRIX.md), [schema](DATABASE_SCHEMA.md), [evidence/offline design](docs/phase-0/OFFLINE_AND_EVIDENCE.md), [test plan](TESTING.md).

## 2. Assets, actors and trust boundaries

| Asset | Classification / impact | Primary protection |
|---|---|---|
| Agent/staff contact and identity | Personal/confidential; safety risk | Minimized directory, scoped personnel access, retention |
| Assignments and explicit checkins | Operational/personal; location risk | Own/scoped access; no continuous tracking |
| Reports and result observations | Unpublished operational information | Versioning, scoped review, provenance |
| Allegations and source/witness identity | Highly sensitive; retaliation risk | Separate confidential identity table and purpose-bound permission |
| Original evidence and private conversations | Confidential; integrity/privacy risk | Private storage, immutable originals, access audit, TLS |
| Audit/security/backup records | Restricted accountability/recovery material | Append-only application path, external tamper-evident copy, dual control |
| Auth/session/service/backup secrets | Privileged credentials | Server secret stores, rotation, no browser/SW/log exposure |

Actors include authorized users, suspended/former personnel, compromised device holders, malicious uploaders, cross-zone insiders, administrators, dependency attackers, external providers and unavailable infrastructure. Trust boundaries: device/origin; Next.js/Supabase; user/worker identity; Storage/Realtime; provider adapters; independent backup; human approval.

## 3. Identity and session architecture

- Supabase Auth owns credentials, recovery and MFA. No hardcoded login, custom password table or service-role login shortcut.
- Invitation tokens are random, hashed at rest, single-use, short-lived and bound to approved contact/scope. Acceptance creates/links identity but does not silently activate broad privileges.
- Profile activation and personnel verification are distinct from authentication. New identities have no operational role by default.
- Privileged command/district roles, grants, sensitive exports, source-identity access and recovery require AAL2. Supabase exposes assurance through the verified `aal` claim; checks are enforced in server/database policy, not only UI [Supabase MFA](https://supabase.com/docs/guides/auth/auth-mfa).
- Field MFA policy remains open. Enrollment/recovery must account for shared devices and lost phones; do not weaken privileged MFA to compensate.
- Short-lived access tokens, rotating refresh sessions, secure cookie handling for web server flows, no tokens in query strings or logs. Exact expiry/inactivity values require security approval and device testing.
- Account suspension checks live DB state for protected commands/reads; revoke auth sessions and force Realtime rejoin. An old JWT or cached page is not authority to upload.
- Session/device views show lawful, minimized metadata and support self/admin revocation. “Suspicious login” is a review signal, not an automated accusation.
- Login rate limits, abuse monitoring and recovery-flow protections use provider controls plus application controls where available. Do not claim Supabase alone implements the organization's desired lockout policy.
- Break-glass access requires named owners, MFA, time limit, reason, alert and post-use review. No shared permanent super-admin account.

## 4. PostgreSQL grants and RLS design

### 4.1 Mandatory baseline

For every application table: enable and force RLS; revoke unnecessary default grants; grant only required operations to `authenticated`; no `anon` operational access; no client DDL; internal tables have no client grants. Policies name their target role and are operation-specific. Supabase warns that grants and policies are separate and default grants may already exist [1](https://supabase.com/docs/guides/database/postgres/row-level-security).

Use a non-exposed `app_auth` helper schema. Helpers such as `is_active_member`, `has_permission`, `can_read_district`, `owns_active_assignment`, `is_conversation_member` and `requires_mfa_ok` derive identity from `auth.uid()` and live grant tables. Do not accept a caller-supplied user ID as proof. Do not use editable `user_metadata` for roles.

System role templates are platform-migration controlled, not editable by an organization administrator. Organization-specific customization creates custom roles; a central grant cannot broaden a shared system role for every organization.

Helpers have fixed `search_path`, minimal ownership/execute grants, stable transaction semantics and no arbitrary SQL. SECURITY DEFINER helpers are narrowly scoped to avoid recursive policy lookups; they are not blanket bypass functions. Test their owner and execution privileges. Any definer command validates actor, scope, state, expected version and audit reason itself.

### 4.2 Scope predicates

A protected operational read is the intersection of:

1. Active authenticated profile and organization membership.
2. Applicable MFA assurance.
3. Active role grant containing the action permission in the record's scope.
4. Record policy: own assignment, same district, conversation membership, approved audit projection or explicit escalation.
5. Data-class restriction: confidential source identity and precise location require separate permissions.

Central scope is organization-specific, not unlimited SaaS administration. District scope requires an explicit district grant. Field ownership uses authenticated ID plus valid assignment, never a client-supplied agent ID. Auditor policies read approved/minimized projections, not draft operational tables.

Denormalized district/election/organization columns are derived and validated against official parent/assignment chains. This improves policy performance without trusting client scope. Scope cannot be changed by ordinary update.

### 4.3 Policy coverage by entity family

| Entity family | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| Organization/reference catalogs | Active member and relevant scope | Config/import role command | Approved version command only | No ordinary delete |
| Profiles/contact/devices | Self; authorized minimal personnel projection | Trusted provisioning/self-device registration | Allowlisted self fields; IAM status commands | Governed anonymization/retention only |
| Roles/permissions/grants | Authorized IAM readers | Delegated grant command | Revoke/end-date command | No history deletion |
| Assignments/history/checkins | Own or scoped coverage permission | Manager assignment; own discrete checkin | End-date/reassign command; immutable events | No ordinary delete |
| Reports/results roots | Own or scoped review/read; auditor approved view | Own validated command | Workflow/current-version pointer via command | No ordinary delete |
| Immutable versions/entries/reviews | Same parent boundary | Append through authorized command | None | None |
| Incidents/alerts | Own limited status or response scope | Own/scoped create command | Controlled transition command | No ordinary delete |
| Confidential source identity | Separate purpose-bound grant | Restricted creation command | Approved correction event | Retention/hold workflow only |
| Conversation/members/messages/receipts | Active member; history policy | Member send/self receipt; authorized membership command | End-date membership/read cursor; redaction command | No ordinary history delete |
| Evidence/hashes/access/annotations | Linked-record permission + evidence action | Reserve/finalize/append command | Quarantine/verification worker only; not original bytes | No client delete |
| Notifications/preferences | Own recipient/preferences | Worker create/self preference update | Own read/preferences; worker delivery state | Governed retention only |
| Audit/security | Explicit audit/security projection | Trusted append/response event | Security workflow only; audit none | Audit none; retention governed |
| Outbox/idempotency/rate limits/import rows | No direct client access; own safe receipt RPC | Internal transaction/worker | Worker lease/state only | Internal retention only |
| Backup/export/privacy/hold | Restricted owner/role | Authorized request command | Controlled job/workflow state | Governed expiry, never held material |

Child tables implement their own RLS; a readable parent does not automatically expose every child. Attachment joins check both evidence and parent scope. `WITH CHECK` protects new/changed rows as well as `USING` protecting visible rows.

### 4.4 Views, RPCs and direct clients

Views use security-invoker semantics where supported or explicit safe projections with equivalent checks. Materialized views are internal; expose scoped aggregate RPCs, not direct rows that bypass base RLS. Search uses the same predicates and bounded indexes.

PostgREST may support simple reads, but no unrestricted generic write surface. Multi-table commands run in transactions with row locks/idempotency. A route handler using a user token still relies on RLS; using a service-role client requires an explicit server-only exception and cannot be justified by frontend convenience.

## 5. Storage and Realtime authorization

All buckets private: quarantine, originals, derivatives, imports and exports. Storage policies check reservation/uploader/scope for upload and linked-record permission for access. Folder names are identifiers, not authority. Clients cannot list broad buckets, overwrite originals, change custody metadata or delete evidence. Supabase Storage supports private buckets, RLS and signed URLs [1](https://supabase.com/docs/guides/storage/buckets/fundamentals).

Signed URLs are short-lived bearer capabilities. Log issuance, set approximately 60-second default for sensitive objects, avoid shared caching, and use authenticated streaming where revocation matters. Supabase documents that individual URLs cannot simply be revoked and key rotation/CDN caching affect invalidation [2](https://supabase.com/docs/guides/storage/serving/downloads). Do not promise instant recall of a copied file.

Private Realtime channels require `private: true` and `realtime.messages` policies. Broadcast/Presence receive and send are separate permissions. Disable public-channel access. Topic payloads contain minimal resource IDs/versions; no source identity, result figures or evidence URLs. Postgres Changes are RLS-filtered and selected narrowly. Supabase notes channel authorization caching and JWT renewal behavior; membership epoch + session revocation/rejoin are required on removal [1](https://supabase.com/docs/guides/realtime/authorization).

## 6. Application and API controls

- Strict TypeScript, shared Zod validation, DB constraints, parameterized queries and bounded JSON/file bodies.
- Cookie-authenticated mutations: same-origin allowlist, Origin/Referer validation and CSRF token strategy appropriate to the final session implementation. Bearer-token APIs do not rely on cookies but still require authorization. No permissive CORS.
- CSP with tested script/style/connect/media sources; nonce/hash strategy compatible with Next.js; no inline dynamic user HTML. Frame denial, nosniff, referrer policy, permissions policy, HSTS on production HTTPS and restricted camera/microphone/geolocation permissions.
- Preview environments need explicit proxy-host compatibility without a production-wide allow-any-origin rule. Browser API URLs remain relative.
- Render text safely; sanitize any approved rich text; never execute uploaded SVG/HTML. Downloads use safe content type/disposition; previews use isolated safe derivatives.
- Rate limits by action/account/hashed IP; stronger limits for login/recovery, uploads, exports and messaging. Emergency paths have abuse controls but must not be silently dropped by a generic low quota.
- Logs redact tokens, contact details, message bodies, source identities and signed URLs. Correlation IDs support investigation without leaking payloads.
- Dependency lockfile review, secret scanning, SAST, pinned CI actions, least-privilege deployment credentials and environment separation. Suppress neither TypeScript nor lint findings to claim completion.

## 7. Threat model and required tests

| ID / STRIDE | Scenario and impact | Design mitigation | Required evidence |
|---|---|---|---|
| T01 Spoofing | Forged agent/actor ID submits another person's report | Session-derived actor; active assignment; constraints | Forged owner/assignment API and DB tests |
| T02 Elevation | Agent edits metadata or calls role/verification RPC | Live scoped grants; MFA; no client status writes | Direct RPC escalation/self-approval denied |
| T03 Information disclosure | North commander enumerates South UUIDs | District RLS on tables, children, storage, search, exports and Realtime | Cross-zone negative matrix, response/payload inspection |
| T04 Repudiation | Reviewer changes figures then denies it | Immutable versions, actor/reason/time, audit copy | Original/version/audit reconciliation |
| T05 Tampering | Uploaded object replaced after approval | No overwrite; server hash; immutable custody; backup hashes | Replacement denied; mismatch quarantine |
| T06 Information disclosure | Signed evidence URL shared or cached | Short expiry, no-store/proxy for sensitive access, issuance audit | Expiry/revocation limitation test and incident runbook |
| T07 Tampering/XSS | Polyglot image/SVG/HTML executes in preview | Signature checks, quarantine scan, safe derivative, CSP | Malicious upload corpus and browser execution checks |
| T08 Spoofing | Suspended account retains session/socket | DB state check, session revoke, membership epoch | HTTP/read/write/socket denial after suspension |
| T09 Information disclosure | Push/lock screen reveals allegation or location | Generic preview, authenticated fetch after opening | Payload/device inspection |
| T10 Denial of service | Reconnect storm/export/media exhausts DB/egress | Backoff, queue isolation, limits, pagination, budgets | Load/fault tests and cost alerts |
| T11 Tampering | Duplicate retry creates extra result/report | Transactional idempotency fingerprint | Concurrent replay and lost-response tests |
| T12 Information disclosure | New group member reads restricted history | Membership/history policy and evidence ACL | Join/leave/history tests |
| T13 Elevation | Normal admin erases audit or grants self restore | No audit mutation; dual control; external copy | Audit-delete and restore approval denial |
| T14 Tampering/loss | DB restore references missing original objects | Separate object backup and manifest reconciliation | Isolated restore with hash/reference report |
| T15 Spoofing/misinformation | Fabricated “official” result publication | Separate authority workflow, source evidence, dual approval | Unauthorized publication and label/export tests |
| T16 Privacy harm | Excess witness/GPS/media collection | Minimization, consent/purpose, retention/hold, source separation | Privacy review and field comprehension tests |
| T17 Supply chain | Dependency/CI secret compromise | Lockfiles, scanning, pinned actions, isolated secrets | CI provenance and secret exposure review |
| T18 Endpoint compromise | Shared device exposes offline work | Account partition, logout purge choice, reauth, no token in IDB | Shared-device and stolen-browser-profile risk test |

Residual risks: compromised OS/browser can read visible data; hashes do not establish truth; legal admissibility requires external process; provider/admin infrastructure remains a trust dependency; offline delivery cannot be guaranteed. Document and accept residual risks explicitly.

## 8. Privacy and Nigeria Data Protection Act 2023

Before live processing, identify controller/processor roles and privacy contact; assess DPO/major-controller obligations; maintain purpose/lawful-basis and processing registers; approve notices and consent where appropriate; minimize witness/identity/location data; complete DPIA and cross-border/processor review; define access-review, data-subject request, retention/hold and breach procedures.

The Act text referenced during research includes Commission notification within 72 hours for a breach likely to risk rights/freedoms; counsel must confirm applicability, content, affected-person communication and the complete procedure [1](https://ndprcompliance.ng/wp-content/uploads/2023/09/Nigeria_Data_Protection_Act_2023.pdf). Do not infer a journalism exemption or treat all processing as consent-based.

Provider region, backup location, support access, subprocessors and international transfers are unresolved. Supabase encryption in transit/at rest does not equal application-level E2EE. No E2EE claim is made. Confidential source identity can receive additional field encryption with a separate server key-management design if approved; key custody and recovery must be specified before implementation.

Anonymous public reporting is disabled pending abuse, safety and lawful-handling policy. Authenticated confidential reporting limits ordinary visibility but is not anonymous to the system. Retention disposal honors legal holds and preserves required accountability without keeping all personal data indefinitely.

## 9. Security operations and release gates

Security-event lifecycle: detected → acknowledged → triaged → contained/investigated → remediated → verified → closed, with severity/owner/evidence and audit. Monitor login anomalies, privilege changes, denied access patterns, upload quarantine, export volume, queue lag, provider failures and backup verification. Health metrics must come from actual provider/database signals; unknown is not green.

Phase gates require: schema RLS coverage; role/persona tests; API/storage/Realtime negatives; secret/bundle scan; secure headers; malicious upload tests; MFA/suspension; audit immutability; export authorization; restore drill; independent review. Critical/high findings block production. Risk acceptance cannot waive a fundamental cross-zone or privileged-secret boundary without redesign.


## Phase 1 implementation boundary

The [environment/security guide](docs/phase-1/ENVIRONMENT.md) records the actual foundation headers and limits. Public shells collect no credentials or operational data. Production framing is denied; development allows the Arena preview. CSP still permits inline scripts/styles and must be hardened before authenticated content. The route-access helper is a tested future contract, not active authorization; database RLS and session enforcement remain Phase 2. No security/RLS penetration test or production approval is claimed.
