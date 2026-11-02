# Complete Conceptual Entity-Relationship Diagram

Status: **ARCHITECTURALLY DEFINED** · 2026-11-02

This is the full conceptual entity inventory, split into readable domain views. Repeated entities connect the views. Every entity has a field/purpose/policy entry in [DATABASE_SCHEMA.md](../../DATABASE_SCHEMA.md). `PK`, `FK` and `UK` identify key concepts, not executable SQL. Additional typed columns and constraints are specified in the dictionary. This is not a migration or a claim that a database exists.

Cardinality: `||--o{` = one parent to zero or more children; `||--||` = required one-to-one; `o|--o{` = optional parent. Join entities resolve many-to-many relationships. Immutable versions/attachments preserve history. Audit/event targets use controlled typed references and do not cascade deletion.

## 1. Organization, identity and access

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFILES : identifies
  ORGANIZATIONS ||--o{ PROFILES : contains
  ORGANIZATIONS ||--o{ ORGANIZATIONAL_UNITS : contains
  ORGANIZATIONAL_UNITS o|--o{ ORGANIZATIONAL_UNITS : parents
  ORGANIZATIONS o|--o{ ROLES : defines_custom
  ROLES ||--o{ ROLE_PERMISSIONS : includes
  PERMISSIONS ||--o{ ROLE_PERMISSIONS : authorizes
  PROFILES ||--o{ USER_ROLES : receives
  ROLES ||--o{ USER_ROLES : scopes
  PROFILES ||--o{ USER_ASSIGNMENTS : belongs
  ORGANIZATIONAL_UNITS ||--o{ USER_ASSIGNMENTS : hosts
  PROFILES o|--o{ USER_ASSIGNMENTS : supervises
  PROFILES ||--o| AGENT_PROFILES : extends
  PROFILES ||--o| STAFF_PROFILES : extends
  PROFILES ||--o{ INVITATIONS : invites
  PROFILES ||--o{ USER_DEVICES : owns
  PROFILES ||--o{ USER_SESSIONS : opens
  USER_DEVICES o|--o{ USER_SESSIONS : uses
  PROFILES ||--o{ CONSENT_RECORDS : records
  PROFILES {
    uuid id PK
    uuid organization_id FK
    text account_status
  }
  USER_ROLES {
    uuid id PK
    uuid user_id FK
    uuid role_id FK
    uuid district_id FK
    timestamptz valid_from
    timestamptz valid_to
  }
  ROLE_PERMISSIONS {
    uuid role_id PK_FK
    uuid permission_id PK_FK
  }
```

`AUTH_USERS` is Supabase-owned, not an application-managed password table. Global `PERMISSIONS` is a protected catalog. A custom role belongs to an organization; a system role may have a null organization. `USER_ASSIGNMENTS` is organizational membership, distinct from polling-unit assignments.

## 2. Geography and elections

```mermaid
erDiagram
  GEOGRAPHY_RELEASES ||--o{ GEOGRAPHY_IMPORT_BATCHES : imports
  GEOGRAPHY_IMPORT_BATCHES ||--o{ GEOGRAPHY_IMPORT_ROWS : validates
  GEOGRAPHY_RELEASES ||--o{ SENATORIAL_DISTRICTS : contains
  SENATORIAL_DISTRICTS ||--o{ LOCAL_GOVERNMENT_AREAS : contains
  LOCAL_GOVERNMENT_AREAS ||--o{ WARDS : contains
  WARDS ||--o{ POLLING_UNITS : contains
  POLLING_UNITS ||--o{ POLLING_UNIT_COORDINATES : locates
  GEOGRAPHY_RELEASES ||--o{ GEOGRAPHICAL_BOUNDARIES : versions
  GEOGRAPHY_RELEASES ||--o{ GEOGRAPHICAL_FEATURES : includes
  GEOGRAPHICAL_FEATURES o|--o{ GEOGRAPHICAL_BOUNDARIES : describes
  ORGANIZATIONS ||--o{ ELECTION_CYCLES : runs
  ELECTION_CYCLES ||--o{ ELECTION_CONFIGURATIONS : configures
  ELECTION_TYPES ||--o{ ELECTION_CONFIGURATIONS : classifies
  GEOGRAPHY_RELEASES ||--o{ ELECTION_CONFIGURATIONS : pins
  SENATORIAL_DISTRICTS o|--o{ ELECTION_CONFIGURATIONS : scopes
  LOCAL_GOVERNMENT_AREAS o|--o{ ELECTION_CONFIGURATIONS : scopes
  WARDS o|--o{ ELECTION_CONFIGURATIONS : scopes
  ORGANIZATIONS ||--o{ POLITICAL_PARTIES : catalogs
  ELECTION_CONFIGURATIONS ||--o{ CANDIDATES : lists
  POLITICAL_PARTIES ||--o{ CANDIDATES : nominates
  SENATORIAL_DISTRICTS o|--o{ ORGANIZATIONAL_UNITS : hosts_room
  SENATORIAL_DISTRICTS o|--o{ USER_ROLES : limits_scope
  POLLING_UNITS {
    uuid id PK
    uuid release_id FK
    uuid ward_id FK
    text official_code UK
    text location_description
  }
  ELECTION_CONFIGURATIONS {
    uuid id PK
    uuid cycle_id FK
    uuid geography_release_id FK
    date election_date
    text approval_status
  }
```

Same-release composite FKs enforce district→LGA→ward→PU. `GEOGRAPHICAL_BOUNDARIES` has exactly one typed entity target (state feature, district, LGA or ward); those nullable FK columns and check constraint are detailed in the dictionary. PU coordinates are optional and provenance-bearing, never invented.

## 3. Coverage and field reports

```mermaid
erDiagram
  PROFILES ||--o{ AGENT_ASSIGNMENTS : observes
  ELECTION_CONFIGURATIONS ||--o{ AGENT_ASSIGNMENTS : governs
  POLLING_UNITS ||--o{ AGENT_ASSIGNMENTS : receives_coverage
  PROFILES o|--o{ AGENT_ASSIGNMENTS : supervises
  AGENT_ASSIGNMENTS ||--o{ ASSIGNMENT_HISTORY : changes
  AGENT_ASSIGNMENTS ||--o{ AGENT_CHECKINS : records
  PROFILES ||--o{ AGENT_AVAILABILITY : declares
  ELECTION_CONFIGURATIONS ||--o{ AGENT_AVAILABILITY : contextualizes
  AGENT_ASSIGNMENTS o|--o{ AGENT_AVAILABILITY : contextualizes
  AGENT_ASSIGNMENTS ||--o{ SITUATION_REPORTS : authorizes
  REPORT_CATEGORIES ||--o{ SITUATION_REPORT_VERSIONS : structures
  SITUATION_REPORTS ||--o{ SITUATION_REPORT_VERSIONS : preserves
  SITUATION_REPORT_VERSIONS ||--o{ REPORT_VERIFICATIONS : reviews
  SITUATION_REPORT_VERSIONS ||--o{ REPORT_ATTACHMENTS : attaches
  EVIDENCE_FILES ||--o{ REPORT_ATTACHMENTS : supplies
  AGENT_ASSIGNMENTS {
    uuid id PK
    uuid agent_id FK
    uuid configuration_id FK
    uuid polling_unit_id FK
    timestamptz valid_from
    timestamptz valid_to
  }
  SITUATION_REPORTS {
    uuid id PK
    uuid assignment_id FK
    uuid current_version_id FK
    text reference UK
    text workflow_status
  }
  SITUATION_REPORT_VERSIONS {
    uuid id PK
    uuid report_id FK
    integer version_number UK
    timestamptz observed_at
    timestamptz received_at
  }
```

The root's current-version FK is deferred within the creation/correction transaction. Versions and reviews are append-only; only controlled root workflow pointers/status change. A local draft/outbox record is not a server report.

## 4. Results and separate official publications

```mermaid
erDiagram
  AGENT_ASSIGNMENTS ||--o{ RESULT_SUBMISSIONS : authorizes
  ELECTION_CONFIGURATIONS ||--o{ RESULT_SUBMISSIONS : contextualizes
  RESULT_SUBMISSIONS ||--o{ RESULT_SUBMISSION_VERSIONS : preserves
  RESULT_SUBMISSION_VERSIONS ||--o{ RESULT_ENTRIES : contains
  CANDIDATES ||--o{ RESULT_ENTRIES : receives_votes
  RESULT_SUBMISSION_VERSIONS ||--o{ RESULT_VERIFICATIONS : reviews
  RESULT_SUBMISSION_VERSIONS ||--o{ RESULT_DISCREPANCIES : flags
  RESULT_SUBMISSION_VERSIONS ||--o{ RESULT_ATTACHMENTS : supports
  EVIDENCE_FILES ||--o{ RESULT_ATTACHMENTS : supplies
  ELECTION_CONFIGURATIONS ||--o{ OFFICIAL_RESULT_PUBLICATIONS : references
  OFFICIAL_RESULT_PUBLICATIONS ||--o{ OFFICIAL_RESULT_ENTRIES : contains
  CANDIDATES ||--o{ OFFICIAL_RESULT_ENTRIES : receives_official_count
  EVIDENCE_FILES o|--o{ OFFICIAL_RESULT_PUBLICATIONS : authenticates_source
  RESULT_SUBMISSIONS o|--o{ RESULT_SUBMISSIONS : duplicate_group
  RESULT_SUBMISSION_VERSIONS {
    uuid id PK
    uuid submission_id FK
    integer version_number UK
    bigint registered_voters
    bigint accredited_voters
    bigint valid_votes
    bigint rejected_votes
    bigint total_cast
  }
  OFFICIAL_RESULT_PUBLICATIONS {
    uuid id PK
    uuid configuration_id FK
    text issuing_authority
    timestamptz published_at
    uuid approved_by FK
  }
```

No relationship copies observer figures into official entries. A duplicate-group link preserves independent submissions; exact retry deduplication uses `IDEMPOTENCY_KEYS`. Arithmetic discrepancies are findings, not automatic changes to source figures.

## 5. Incidents and emergency

```mermaid
erDiagram
  AGENT_ASSIGNMENTS o|--o{ INCIDENTS : originates
  INCIDENT_CATEGORIES ||--o{ INCIDENTS : classifies
  INCIDENTS ||--o{ INCIDENT_VERSIONS : preserves_facts
  INCIDENTS ||--o{ INCIDENT_UPDATES : records_progress
  INCIDENTS ||--o{ INCIDENT_ASSIGNMENTS : allocates
  PROFILES o|--o{ INCIDENT_ASSIGNMENTS : responds
  INCIDENTS ||--o{ INCIDENT_ESCALATIONS : escalates
  INCIDENTS ||--o{ INCIDENT_RESOLUTIONS : resolves
  INCIDENTS ||--o{ INCIDENT_ATTACHMENTS : supports
  EVIDENCE_FILES ||--o{ INCIDENT_ATTACHMENTS : supplies
  INCIDENTS ||--o{ INCIDENT_CONFIDENTIAL_IDENTITIES : protects
  AGENT_ASSIGNMENTS o|--o{ EMERGENCY_ALERTS : originates
  EMERGENCY_ALERTS ||--o{ EMERGENCY_ACKNOWLEDGEMENTS : acknowledges
  EMERGENCY_ALERTS ||--o{ EMERGENCY_RESPONSES : responds
  EMERGENCY_ALERTS ||--o{ EMERGENCY_ATTACHMENTS : supports
  EVIDENCE_FILES ||--o{ EMERGENCY_ATTACHMENTS : supplies
  INCIDENTS o|--o{ CONVERSATIONS : links_discussion
  INCIDENTS {
    uuid id PK
    uuid assignment_id FK
    text severity
    text workflow_status
    text confidentiality_class
    uuid current_owner_id FK
  }
  EMERGENCY_ALERTS {
    uuid id PK
    uuid assignment_id FK
    text alert_type
    timestamptz received_at
    text status
  }
```

`INCIDENT_VERSIONS` explicitly preserves initial facts and corrections; `INCIDENT_UPDATES` records response notes/transitions. Confidential source details are not columns freely readable from the incident root. Emergency acknowledgement/response records are append-only.

## 6. Communications

```mermaid
erDiagram
  CONVERSATIONS ||--o{ CONVERSATION_MEMBERS : admits
  PROFILES ||--o{ CONVERSATION_MEMBERS : participates
  CONVERSATIONS ||--o{ MESSAGES : contains
  PROFILES ||--o{ MESSAGES : sends
  MESSAGES o|--o{ MESSAGES : replies_to
  MESSAGES ||--o{ MESSAGE_ATTACHMENTS : attaches
  EVIDENCE_FILES ||--o{ MESSAGE_ATTACHMENTS : supplies
  MESSAGES ||--o{ MESSAGE_RECEIPTS : receives
  CONVERSATION_MEMBERS ||--o{ MESSAGE_RECEIPTS : acknowledges
  CONVERSATIONS {
    uuid id PK
    uuid organization_id FK
    uuid district_id FK
    uuid incident_id FK
    bigint membership_epoch
  }
  MESSAGES {
    uuid id PK
    uuid conversation_id FK
    uuid sender_id FK
    uuid client_message_id UK
    bigint server_sequence
    timestamptz created_at
  }
```

Conversation membership, not district name or knowledge of a UUID, authorizes history. Message receipt identity is the member; sender is derived from the authenticated session. Redaction is an audited restriction with preserved custody, not normal client deletion.

## 7. Evidence custody

```mermaid
erDiagram
  PROFILES ||--o{ UPLOAD_RESERVATIONS : requests
  UPLOAD_RESERVATIONS o|--o{ EVIDENCE_FILES : finalizes
  PROFILES ||--o{ EVIDENCE_FILES : uploads
  EVIDENCE_FILES o|--o{ EVIDENCE_FILES : derives_from
  EVIDENCE_FILES ||--o{ EVIDENCE_HASHES : verifies
  EVIDENCE_FILES ||--o{ EVIDENCE_ACCESS_LOGS : audits
  EVIDENCE_FILES ||--o{ EVIDENCE_ANNOTATIONS : annotates
  PROFILES ||--o{ EVIDENCE_ANNOTATIONS : authors
  EVIDENCE_FILES ||--o{ REPORT_ATTACHMENTS : report_link
  EVIDENCE_FILES ||--o{ RESULT_ATTACHMENTS : result_link
  EVIDENCE_FILES ||--o{ INCIDENT_ATTACHMENTS : incident_link
  EVIDENCE_FILES ||--o{ MESSAGE_ATTACHMENTS : message_link
  EVIDENCE_FILES ||--o{ EMERGENCY_ATTACHMENTS : emergency_link
  EVIDENCE_FILES {
    uuid id PK
    uuid uploader_id FK
    text reference UK
    text storage_key UK
    text custody_kind
    bigint bytes
    text verification_status
  }
  EVIDENCE_HASHES {
    uuid id PK
    uuid evidence_id FK
    text algorithm
    text digest
    text digest_source
  }
```

Typed attachment tables appear in their owning domain and here to make the cross-domain boundary explicit. Original storage objects have no client update/delete policy. A derivative is never substituted for an original.

## 8. Notifications, reliability and account administration

```mermaid
erDiagram
  PROFILES ||--o{ NOTIFICATIONS : receives
  PROFILES ||--o{ NOTIFICATION_PREFERENCES : chooses
  NOTIFICATIONS ||--o{ NOTIFICATION_DELIVERIES : attempts
  OUTBOX_EVENTS ||--o{ NOTIFICATIONS : produces
  OUTBOX_EVENTS o|--o{ EXPORT_JOBS : schedules
  PROFILES ||--o{ EXPORT_JOBS : requests
  PROFILES ||--o{ IDEMPOTENCY_KEYS : owns_request
  PROFILES ||--o{ AUDIT_LOGS : acts
  PROFILES o|--o{ SECURITY_EVENTS : concerns
  SECURITY_EVENTS ||--o{ SECURITY_EVENT_UPDATES : investigates
  ORGANIZATIONS ||--o{ SYSTEM_SETTINGS : configures
  RATE_LIMIT_BUCKETS {
    text hashed_key PK
    timestamptz window_start
    integer request_count
    timestamptz expires_at
  }
  PROFILES ||--o{ BACKUP_RECORDS : requests
  PROFILES ||--o{ PRIVACY_REQUESTS : submits
  ORGANIZATIONS ||--o{ DATA_RETENTION_POLICIES : governs
  ORGANIZATIONS ||--o{ LEGAL_HOLDS : preserves
  NOTIFICATIONS {
    uuid id PK
    uuid recipient_id FK
    text priority
    text generic_preview
    timestamptz read_at
  }
  OUTBOX_EVENTS {
    uuid id PK
    text aggregate_type
    uuid aggregate_id
    text event_type
    timestamptz available_at
    text delivery_state
  }
```

`RATE_LIMIT_BUCKETS` is an isolated internal utility entity with hashed rate-limit key PK, window/count and expiry; it has no personal-data relationship and no client access. Outbox-to-notification/export is an optional trace link, not a requirement that every event notify a user. Provider attempts are idempotent and distinct from read receipts.

## 9. Governance relationships and deletion boundaries

```mermaid
erDiagram
  DATA_RETENTION_POLICIES o|--o{ LEGAL_HOLDS : constrains
  PROFILES ||--o{ EXPORT_JOBS : authorizes
  PROFILES ||--o{ LEGAL_HOLDS : approves
  PROFILES ||--o{ BACKUP_RECORDS : verifies
  EXPORT_JOBS ||--o{ EXPORT_JOB_ITEMS : enumerates
  EVIDENCE_FILES ||--o{ EXPORT_JOB_ITEMS : packages
  PROFILES ||--o{ SECURITY_EVENT_UPDATES : responds
  AUDIT_LOGS }o--o| PROFILES : human_actor
```

Governance correlations are append-only event references/manifests, not permission to delete source history when a job expires. Audit targets use validated typed columns or a controlled target registry; the diagram does not invent foreign keys from every domain event into the audit table. Audit rows restrict actor deletion and survive ordinary target retirement under policy. `EXPORT_JOB_ITEMS` is the enforceable manifest join between exports and evidence, with IDs/hashes/bytes captured at generation. Backup verification and security response actions are correlated by request IDs and append-only audit events, not cascading domain relationships.

## 10. Completeness and migration notes

- All minimum entities from the brief are represented. Added entities: geography release/import rows, invitations/consent, immutable result/incident versions, upload reservations, typed attachment tables, official publications, outbox/idempotency, rate limits, privacy/retention/hold and security-event updates.
- `election_types` and `report_categories` are approved reference catalogs, not free-text permissions.
- Composite organization/election/geography constraints are mandatory even where a diagram shows only a simple FK for readability.
- Physical migration order: extensions/schemas/helpers → organization/reference/identity → geography → coverage → reporting/evidence foundations → response/chat/results → governance. Policies/grants/tests accompany each table in the same phase.
- The ERD must be checked against implemented migrations in Phase 2 and updated through change control. This document is not evidence of database verification.
