# Database Schema and Relationship Dictionary

Status: **ARCHITECTURALLY DEFINED** · KEMSR-DATA-0001 · 2026-11-02

This is a complete conceptual entity catalog for the requested scope, not an applied or executable migration. The [ERD](docs/phase-0/DATABASE_ERD.md) splits the model by domain for readability; cross-domain relationships are explicit below. Physical types, indexes and policies must be implemented and tested in Phase 2 and expanded in the owning feature phase.

## 1. Global conventions

- PostgreSQL on Supabase; internal primary keys UUID. Official electoral codes are text natural keys, never generated UUID substitutes.
- Business tables include `organization_id`; global permission/geography reference catalogs have the exceptions documented below. Election-specific records reference an election configuration; historical records retain their original scope.
- Mutable roots: `created_at timestamptz`, `updated_at timestamptz`, `created_by`, `updated_by`, `row_version integer`, controlled `status`. Append-only records: `created_at`, actor/source and sequence/version where needed; no fake update lifecycle.
- Human actors reference `profiles(id)` and ultimately `auth.users(id)`. Worker events use an explicit `actor_kind` and worker identifier; never impersonate an administrator.
- `created_by`/receipt time/official geography scope are server-derived. Clients cannot set review status, role, hash-verification state or server receipt.
- All timestamps stored in UTC; display Africa/Lagos with explicit label. Client observation/capture time remains distinct from server receipt.
- JSONB only for versioned structured observations, source metadata or provider responses with schema validation; normalized counts, ownership, status and relationships are relational.
- Reference/operational deletes are restricted. Use end-date, suspension, supersession or approved retention disposal. Join rows may be removed only where no accountability is lost; conversation membership is end-dated.
- Foreign keys and same-organization/same-release composite keys prevent cross-tenant or cross-geography links. Required composite unique constraints on parents are part of the migration contract.
- RLS is enabled and forced on every application table. `anon` has no application-data grants. `authenticated` receives only needed operations. Internal outbox/rate-limit/hash/import-processing tables have no direct client grants.

## 2. Policy classes used in the catalog

| Class | Read policy | Mutation policy |
|---|---|---|
| REF | Active authorized scope; reference catalogs may be readable to all active organization members | Designated import/configure/approve commands; no ordinary client writes |
| SELF | Own identity/contact and devices; authorized personnel projection separately | Own allowed contact fields; no role/activation changes |
| IAM | Authorized personnel/role/security scope | Privileged validated commands, MFA and audit |
| OWN | Own submissions/assignments; scoped staff read separately | Own create through active assignment; correction by version command |
| OPS | Scoped module permission and record classification | Scoped command with legal state transition and row version |
| REVIEW | Scoped readers; auditors approved projection | Specific review permission; no self-approval where required |
| CHAT | Active conversation members only | Member send; server sender; membership management separately authorized |
| EVID | Permission on linked record + evidence read/download | Reserve/finalize/annotate commands; no original overwrite/delete |
| APPEND | Explicit audit/security/approved-history permission | Trusted append only; no client update/delete; retention is governed |
| INTERNAL | No direct client read; safe receipt/status projection only | Trusted transaction/worker only |

A policy class is a specification shortcut, not a single permissive `USING (true)` policy. Every child/join table repeats the parent boundary and operation-specific checks.

## 3. Organization and election catalog

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `organizations` | Operating organization; name, status, privacy/controller metadata | Root; one initial organization, no public signup | IAM; member sees limited own organization |
| `organizational_units` | Central/district rooms/teams; kind, name, parent unit, district, status | FK organization, self parent, optional district; central is not a fourth district | REF/IAM |
| `election_cycles` | Named monitoring cycle; organization, start/end, status | Organization FK; dates checked | REF/IAM |
| `election_types` | Configurable Federal/State and contest type catalog; code, label, scope level | Unique code; no current election assumed | REF |
| `election_configurations` | Cycle/type/contest, election date, geography release, jurisdiction level, optional typed district/LGA/ward scope, reporting windows, schema version, approval | FKs cycle/type/release and scope matching level; approved configuration immutable; overlapping active contest scope prevented | REF/IAM |
| `political_parties` | Organization, approved party code/name, valid interval, source reference | Organization FK; unique approved organization/code/source release | REF |
| `candidates` | Approved candidate/party/contest ordering and source | FK configuration and party; unique configuration ballot order; jurisdiction eligibility validated by approved import | REF |

## 4. Geography and import catalog

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `geography_releases` | Source agency, release/effective date, status, schema version, manifest hash, approver | Unique approved source release; approval time/actor required; no edits after use | REF; internal write |
| `geography_import_batches` | Source URI/hash, filename, importer, counts, status, error summary | FK release/profile; unique release/source hash/schema for idempotency | INTERNAL/IAM metadata |
| `geography_import_rows` | Raw source row, source line/feature ID, normalized values, validation errors | FK batch; unique batch/source row; quarantined rows preserved | INTERNAL |
| `senatorial_districts` | Release, official code/name, raw source values | Unique `(release_id, official_code)`; unique `(release_id,id)` for composite children | REF |
| `local_government_areas` | Release, district, official code/name | Same-release district FK; unique release/official code; all 44 coverage checked against approved manifest | REF |
| `wards` | Release, LGA, official code/name | Same-release LGA FK; unique release/official code | REF |
| `polling_units` | Release, ward, official PU code/name, location description, source status | Same-release ward FK; unique release/full official code; no invented coordinates | REF |
| `polling_unit_coordinates` | PU, source, longitude/latitude, PostGIS point, accuracy, approximate flag, capture/source time, approval | FK PU; EPSG:4326 range/geometry checks; multiple provenance versions, one approved current coordinate per source purpose | REF; precise source metadata restricted |
| `geographical_boundaries` | Entity kind/ID, release, source, PostGIS geometry, CRS metadata, valid interval, approval | Typed FK constraint to district/LGA/ward/state feature; valid MultiPolygon/Polygon; GiST index | REF |
| `geographical_features` | State boundary and approved non-electoral reference features; code, kind, source, geometry | Release/source FK; unique feature code/release; no agent tracks | REF |

Boundary rows use explicit nullable foreign-key columns plus an exactly-one-target check, not an unenforced polymorphic UUID. State geometry belongs to a state feature. The state→district relationship is represented by the approved release's district roster; spatial containment alone does not establish it.

## 5. Identity, access and devices

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `profiles` | ID mirrors auth user; display name, contact, organization, verification/account status, locale, privacy notice version | FK auth user and organization; no password stored; status not client-editable | SELF/IAM |
| `roles` | System/custom role; key, context central/district/field/auditor, delegatable flag | Unique key/context; custom role organization FK; bounded template changes | IAM/REF |
| `permissions` | Global permission key catalog; domain/action/description | Unique key; not organization-specific | REF, no client write |
| `role_permissions` | Role-to-permission join | Composite FKs; unique role/permission; grant does not include scope by itself | IAM/REF |
| `user_roles` | User, role, organization, optional district/organizational unit, valid interval, grantor/reason, revocation | FKs profile/role/scope; district roles require district; central roles forbid implicit district wildcard; active grant audit | IAM |
| `user_assignments` | Organizational membership and supervisor/team scope, valid interval | FK profile/organization/unit; optional supervisor profile; distinct from PU assignment | IAM/SELF limited |
| `agent_profiles` | Agent code, verification/training, emergency contact if approved, availability policy | FK profile; unique organization/agent code; minimal necessary PII | SELF/IAM |
| `staff_profiles` | Staff code, function, verification and delegation limits | FK profile; no privileges implied by staff record | SELF/IAM |
| `invitations` | Invited contact, intended bounded role/scope, token hash, expiry, accepted/revoked state, inviter | FK organization/inviter; single-use token hash; acceptance does not auto-grant beyond approved invitation | IAM; token never readable |
| `user_sessions` | Auth session reference, device reference, start/last seen/revocation, lawful IP/device metadata | FK profile/device; no raw access/refresh tokens; auth is session authority | SELF/IAM |
| `user_devices` | Account-bound device label, platform/browser, push endpoint if approved, trust/revocation state | FK profile; no covert fingerprint; push secret treated as sensitive | SELF/IAM |
| `consent_records` | Purpose, notice version, granted/withdrawn time, lawful-basis reference | FK profile where authenticated; append-only; consent not assumed for every processing purpose | SELF/privacy role |

## 6. Agent coverage

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `agent_assignments` | Agent, configuration, PU, supervisor, valid from/to, status, assignment version | FKs profile/configuration/PU/supervisor; derived district chain checked; no overlapping active same-agent/time slot; multiple agents per PU allowed | OWN read/OPS manage |
| `assignment_history` | Assignment, old/new PU/supervisor/window, actor, reason, effective time | FK assignment; append-only; old records never rebound to new location | APPEND/OWN summary |
| `agent_checkins` | Assignment, agent, kind arrival/available/checkout, observed time, receipt time, optional point/accuracy/consent, device | FK assignment/profile/device; discrete events only; GPS optional; idempotency key | OWN create/OPS scoped read |
| `agent_availability` | Agent/configuration, optional assignment, state, since/until, source checkin/declaration, reason | FK profile/configuration/optional assignment; non-overlapping active state per assignment context | OWN create/OPS read |

“Active agent” is a metric definition over explicit availability/checkin/activity, not continuous GPS or a fabricated online count.

## 7. Situation reporting

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `report_categories` | Category code, label, structured schema/version, valid interval | Unique code/version; approved configuration only | REF |
| `situation_reports` | Reference, organization/election/district/PU/assignment/agent, current version, workflow status, row version | FKs own chain; scope derived from assignment/PU; unique internal reference | OWN create/REVIEW |
| `situation_report_versions` | Report, version number, category/schema, structured observation, description, severity, observed/client time, receipt time, correction reason | Unique report/version; immutable payload; FK author/category; first version preserved | OWN/REVIEW, append only |
| `report_attachments` | Report version to evidence file and attachment purpose | Composite FKs; unique version/file/purpose; evidence scope must match | EVID |
| `report_verifications` | Report version, decision, reviewer, reason, reviewed_at, supersedes decision | FK version/reviewer; append-only; authorized review; current root state updated transactionally | REVIEW |

A queued client draft is not a server report row. Server rows begin at durable receipt; offline status is local until acknowledged.

## 8. Result observations and official publications

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `result_submissions` | Reference, assignment/agent/configuration/PU, current version, review state, duplicate-group link, row version | Same scope chain; distinct agents preserved; idempotency unique actor/operation/key | OWN create/REVIEW |
| `result_submission_versions` | Submission/version, source kind transcription/document, registered/accredited/valid/rejected/cast counts nullable as appropriate, observed time, notes, correction reason, validation summary | FK root/author; nonnegative integer checks; immutable; no silent total correction | OWN/REVIEW |
| `result_entries` | Result version, candidate, votes | FK version/candidate; unique candidate per version; votes ≥0; candidate belongs to same configuration | OWN/REVIEW |
| `result_verifications` | Version, document-authentication decision, transcription decision, reviewer, reason, time | FK version/reviewer; separate checks; no self-verification by default | REVIEW |
| `result_discrepancies` | Version, rule code, expected/observed summary, status, resolution reference | FK version; duplicates deduplicated by rule/version; discrepancy does not establish guilt | REVIEW |
| `result_attachments` | Result version, evidence file, sheet/supporting purpose | FK version/file; unique combination; matching scope | EVID |
| `official_result_publications` | Issuing authority, configuration, jurisdiction level and typed district/LGA/ward/PU scope, source URI/document, publication/declaration time, source hash, importer, approver, status | FK configuration/evidence and exactly one scope FK matching level; distinct from observer root; dual approval; no winner calculation | REVIEW/public only after explicit publication policy |
| `official_result_entries` | Official publication, candidate, officially sourced count | FK publication/candidate; unique candidate/publication; never populated from unverified transcription | REVIEW |

Arithmetic rules flag `valid + rejected ≠ cast`, `sum(candidate votes) ≠ valid`, and contextual accredited/cast/registered inconsistencies. Unknown source values remain null, not zero. Confirmed impossibility and faithful transcription of a questionable source are separate review findings.

## 9. Incidents and emergency response

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `incident_categories` | Code, label, guidance, schema/version, active flag | Unique code/version | REF |
| `incidents` | Reference, scope/PU, reporter, category/severity, title, current version/state, owner, safety/assistance flags, confidentiality class, row version | FK assignment/PU/configuration/category; district derived; no guilt label | OWN limited/OPS |
| `incident_versions` | Incident, version number, immutable initial/corrected facts, observed time, correction reason, author | FK incident/profile; unique incident/version; original description never silently overwritten | OWN limited/OPS, append only |
| `incident_updates` | Incident, prior/new state, response/investigation note, actor, visibility, created time, expected version | FK incident; append-only; internal discussion separated from reporter-visible updates | OPS/APPEND |
| `incident_assignments` | Incident, responder/team, assigned by, valid interval, responsibility | FK incident/profile/unit; controlled active owner; history retained | OPS |
| `incident_escalations` | Incident, from/to scope/unit, reason, actor, acknowledgement/time | FK incident/units; cross-zone sharing only through authorized central escalation | OPS |
| `incident_resolutions` | Incident, outcome, resolution notes, resolver, closure actor/time, reopening link | FK incident; closure permission; disputed/duplicate/insufficient-evidence outcomes supported | OPS/REVIEW |
| `incident_attachments` | Incident, optional update, evidence file, purpose | FK incident/update/file; evidence access does not automatically expose source identity | EVID |
| `incident_confidential_identities` | Incident, protected reporter/witness/involved-person details, access purpose/classification | FK incident; separate strict RLS; minimized/encrypted fields where approved; no ordinary incident read | Separate source-identity permission |
| `emergency_alerts` | Reference, reporter/assignment/PU, type, safety note, optional consented point, status, receipt time, priority | FK scope chain; server receipt; no precise location required | OWN create/OPS response |
| `emergency_acknowledgements` | Alert, responder, acknowledged time, command scope | FK alert/profile; append-only; first acknowledgement derived not overwritten | OPS |
| `emergency_responses` | Alert, responder, action/update, status, created time, resolution | FK alert/profile; append-only response log; authorized resolution | OPS |
| `emergency_attachments` | Alert/response to evidence | FKs alert/optional response/file; matching scope | EVID |

Incident description and initial facts belong to `incident_versions`; later factual corrections create another version and response progress belongs to `incident_updates`. The root current-version pointer changes only through a scoped, audited command.

## 10. Communications

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `conversations` | Kind direct/group/incident, organization, optional district/incident, title, creator, membership epoch, status | FKs scope/incident; direct pair uniqueness; incident-linked conversation inherits restriction | CHAT |
| `conversation_members` | Conversation, profile, role, joined/left time, last read sequence, membership epoch | FK conversation/profile; active member uniqueness; removal end-dates access | CHAT |
| `messages` | Conversation, sender, client UUID, server sequence, body, kind, optional reply, created time, redaction reference | FK conversation/member/profile; unique conversation/client UUID/sender; sequence gap-tolerant; immutable original access | CHAT |
| `message_attachments` | Message/evidence/purpose | FK message/file; matching conversation scope | CHAT + EVID |
| `message_receipts` | Message/member, delivered/read time, device context if necessary | FK message/member; unique message/member/receipt kind; reader can mark only self | CHAT |

Server commit is authoritative; “delivered” requires a defined client acknowledgement, not merely provider broadcast. “Read” is an explicit authorized receipt. No unrestricted historical access after joining a group unless policy explicitly permits and membership history records it.

## 11. Evidence and upload custody

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `upload_reservations` | Uploader/scope, intended kind, object key, expected MIME/size/hash, expiry, state, idempotency key | FK profile/scope; unguessable server object key; one reservation finalization; no client-selected arbitrary path | INTERNAL/own safe status |
| `evidence_files` | Reference, organization/district/PU/uploader, original filename, detected MIME, bytes, storage key, original/derivative kind, parent original, quarantine/verification state, receipt time | FK reservation/uploader; unique bucket/object key; original immutable; derivative FK original; scope fixed at finalization | EVID |
| `evidence_hashes` | Evidence, algorithm SHA-256, client/server/backup digest, verifier, verified time, outcome | FK file; unique file/algorithm/source; server digest authoritative; mismatch quarantines | EVID metadata/Internal write |
| `evidence_access_logs` | Evidence, actor, action preview/download/export, purpose, time, request ID, outcome | FK file/profile; append-only; log authorization before signed URL creation | APPEND |
| `evidence_annotations` | Evidence, version, annotation, author, supersedes, time | FK file/profile; append-only versions; original bytes untouched | EVID |

Typed attachment tables are the enforceable evidence links. Do not replace them with one unchecked `(entity_type,entity_id)` pointer. Derivatives have separate hashes and never inherit “original” labeling.

## 12. Notifications and administration

| Table | Purpose and principal fields | Relationships and constraints | Policy |
|---|---|---|---|
| `notifications` | Recipient, organization/scope, category/priority, generic preview, resource reference, read time | FK recipient/resource-specific safe reference; no sensitive lock-screen body | SELF recipient/OPS create via worker |
| `notification_preferences` | Profile, category/channel, enabled, quiet hours where policy permits | FK profile; critical channels cannot be disabled below approved safety policy | SELF |
| `notification_deliveries` | Notification, channel/provider, attempt, provider message ID, status/time, sanitized error | FK notification; unique idempotent attempt; provider accepted ≠ device delivered | INTERNAL/SELF status |
| `outbox_events` | Aggregate/type/ID, minimal payload, created/available time, lease, attempts, delivered/dead-letter state | Commit with domain transaction; internal only; no evidence URL or source identity in payload | INTERNAL |
| `idempotency_keys` | Actor/operation/key, request hash, resource receipt, created/expires_at | Unique actor/operation/key; same fingerprint returns receipt; different fingerprint conflicts | INTERNAL/own receipt RPC |
| `audit_logs` | Actor kind/ID, action, target, scope, before/after redacted summary, reason, request ID, time, hash-chain metadata | Append-only; no ordinary FK that cascades audit away; restricted audit reader | APPEND |
| `security_events` | Event kind/severity, actor/resource, lawful IP/device context, status/owner, detection time, response summary | Optional profile FK; no secret values; workflow updates append event history | IAM/security |
| `security_event_updates` | Event, prior/new state, owner, containment/remediation note, actor, time | FK event/profile; append-only investigation history; no secret payload | IAM/security |
| `system_settings` | Organization/scope, key, versioned value, classification, updater, effective time | Unique scope/key/version; secrets stored by reference only; privileged validation | IAM; nonsecret member projection |
| `backup_records` | Asset class, provider/reference, snapshot interval, manifest hash, status, verification/restore-test time, retention class | No credentials; requested ≠ completed ≠ verified; operator/approver references | IAM/recovery |
| `export_jobs` | Requester, kind/format, scope/filters, purpose, snapshot/version, status, object reference, expiry, approved by | FK requester/private object; authorization rechecked at download; no public URL | IAM/own authorized read |
| `export_job_items` | Export job, evidence file, manifest order, hash/bytes snapshot, inclusion outcome | FK job/evidence; unique job/file; authorized evidence only; expired job does not delete evidence | IAM/own authorized read |
| `rate_limit_buckets` | Hashed actor/IP/action key, window/counter, expiry | Internal; minimization/retention; no raw IP in browser | INTERNAL |
| `data_retention_policies` | Data class, purpose/lawful basis, retention interval, disposal method, version/approver | Approved versioned policy; no automatic deletion of held evidence | Privacy role/REF metadata |
| `legal_holds` | Scope/class, optional retention-policy version, reason, authority, start/release, approver | Optional policy FK; blocks disposal across its explicit scope; access restricted; release audited | Privacy role |
| `privacy_requests` | Data subject/request kind, verification state, owner, due date, outcome | Minimal identity proof; restricted workflow and audit | Privacy role/own limited status |

## 13. Cross-domain relationship rules

1. Profile → organization membership → scoped user role. A role row is never accepted merely because a user authenticated.
2. Election configuration → one geography release → district/LGA/ward/PU. Assignment and submission scope must match this chain.
3. Assignment → agent/configuration/PU; report/result/checkin/alert references must belong to the same actor and scope. Historical validity is checked against observation time and approved late-submission policy.
4. Root → versions → reviews/entries/attachments. A review references one version; a correction cannot retarget an old approval.
5. Incident → confidential identity is a separate access path. Escalation grants access to a defined incident package, not every unrelated district record.
6. Conversation → active membership → message/receipt. Message sender derives from session; evidence attachment inherits conversation scope.
7. Evidence → typed attachment → authorized parent. Storage policy and application link policy must agree. A matching folder name alone is not sufficient authority.
8. Domain mutation → audit + outbox + idempotency receipt in one transaction. Provider side effects occur after commit.
9. Export/backup → restricted object + manifest. Database restoration must reconcile referenced original bytes.
10. Audit/consent/assignment/evidence history uses restricted deletion or pseudonymization under approved retention, not user-delete cascades.

## 14. Index, constraint and performance plan

- B-tree: organization/election/district/time; reporter/created time; assignment validity; review status/priority/time; conversation/sequence; recipient/read/time; outbox availability/lease; idempotency unique key.
- Join-table indexes on both lookup directions, including membership `(profile_id, conversation_id)` and role `(user_id, organization_id, district_id)`.
- GiST on approved PU points, boundaries and optional consented checkin points. No index on precise location creates a permission to expose it.
- Partial unique indexes for active assignment/membership/grant; exclusion constraint with time ranges where appropriate.
- Check constraints for count nonnegativity, interval ordering, version positivity, role scope, exactly-one typed link and valid enum transitions at command layer.
- Cursor pagination `(created_at,id)` or conversation sequence; maximum page size and bounded search. Avoid offset scans on large history.
- Aggregates maintained by committed events or scheduled refresh with `as_of`, scope and source version. Direct reconciliation queries detect drift.
- RLS helper indexes and `EXPLAIN` under each persona are acceptance artifacts. No materialized view directly grants access around base-table RLS.
- Partition audit/outbox only after volume evidence; retention and foreign-key effects must be tested. Do not prematurely partition every table.

## 15. Migration and acceptance strategy

Phase 2 creates foundations, RLS helpers and reference/identity tables. Each later phase adds its domain migrations together with policies, grants, constraints, indexes and pgTAP tests. Every migration runs on an empty local DB and an upgraded prior-version DB; destructive rollback is not assumed. Backfills are batched, idempotent and audited. Production migrations require staging rehearsal and backup confirmation.

Acceptance: all listed entities implemented or a formally approved model change; all sensitive tables RLS-tested; all relationship/scope forgeries rejected; no orphan evidence; original versions immutable; no public bucket; official publication separate; query plans recorded. **None of these database acceptance claims is made in Phase 0.**
