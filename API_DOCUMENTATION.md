# API Architecture and Contract Catalog

Status: **ARCHITECTURALLY DEFINED — no endpoint is implemented** · KEMSR-API-0001 · 2026-11-02

## 1. Transport and authority

Browser-facing commands use same-origin relative `/api/v1/*` URLs. Next.js route handlers validate session, input, origin/CSRF, rate limit and permission; multi-table invariants run in PostgreSQL RPC/transactions. Simple scoped Supabase reads may use the user-context client directly. Storage uploads use authorized reservations and private Storage APIs. Realtime carries invalidation signals, not authoritative write acknowledgement.

There is no generic privileged table proxy. Client-supplied `actor_id`, `organization_id`, `district_id`, `role`, `verification_status`, `received_at` and official-publication labels are rejected or ignored in favor of trusted derivation. Service-role credentials never reach browser/service-worker code.

Versioned JSON contracts use camelCase at the HTTP boundary and snake_case in PostgreSQL; generated DB types plus explicit Zod schemas define the mapping. OpenAPI and typed client contracts will be generated/maintained from implementation in later phases. This catalog specifies intended contracts, not working endpoints.

## 2. Command envelope, receipts and errors

Repeatable write headers/body:

```text
Idempotency-Key: client-generated UUID
Content-Type: application/json (or authorized upload protocol)

schemaVersion: 1
requestId: UUID
expectedVersion: integer (required for corrections/transitions)
payload: domain-specific object
location: optional {latitude, longitude, accuracyMeters, capturedAt, consentPurpose}
```

The server derives actor/scope/reference/receipt time. Location is accepted only for operations that explicitly support it. A success receipt contains `resourceId`, `reference`, `version`, `status`, `receivedAt`, `idempotencyKey` and optional warnings. HTTP success for a text report means durable DB commit, not media completion, review or provider notification.

| HTTP / domain code | Meaning | Client behavior |
|---|---|---|
| 200 `IDEMPOTENT_REPLAY` | Same key/fingerprint already committed | Show original authoritative receipt |
| 201 `RECEIVED` | Durable commit | Persist receipt; update queued state |
| 202 `JOB_ACCEPTED` | Export/scan/backup request durably queued | Show job pending, not completed |
| 400/422 `VALIDATION_FAILED` | Invalid fields/schema | Preserve draft and show field errors |
| 401 `AUTH_REQUIRED` | Missing/expired identity | Reauthenticate; retain local work |
| 403 `FORBIDDEN` / `MFA_REQUIRED` | No active grant or assurance | Do not retry blindly; no private resource details |
| 404 `NOT_FOUND` | Resource absent or intentionally indistinguishable unauthorized case | Safe empty state; avoid scope enumeration |
| 409 `VERSION_CONFLICT` | Expected version stale | Fetch latest and request explicit correction/merge |
| 409 `IDEMPOTENCY_CONFLICT` | Same key, different fingerprint | Stop automatic retry; preserve payload for resolution |
| 413 `BODY_TOO_LARGE` | Body/media limit exceeded | Keep local file; offer approved alternative |
| 415/422 `MEDIA_REJECTED` | Signature/type/scan/hash failure | Quarantine/reject state; no public preview |
| 429 `RATE_LIMITED` | Limit exceeded | Honor retry-after/jitter; emergency guidance remains visible |
| 503 `TEMPORARILY_UNAVAILABLE` | Provider/DB unavailable | Retry only durable idempotent work; show not received |

Errors include correlation ID, stable code and safe message; never SQL, tokens, storage keys, stack traces or confidential source details. Arithmetic discrepancies may be accepted as faithful observations with warnings and review flags; negative/non-integer counts are rejected.

## 3. Identity and organization contracts

| Method / path | Action permission | Key contract |
|---|---|---|
| `POST /api/v1/auth/invitations` | personnel.invite | Approved contact, bounded intended role/scope, expiry; no automatic broad grant |
| `POST /api/v1/auth/invitations/:id/accept` | Single-use invitation token | Verify identity/contact; consume atomically; activation remains governed |
| `POST /api/v1/auth/invitations/:id/revoke` | personnel.invite | Reason/audit; invalidate token |
| `PATCH /api/v1/profile/me` | self.profile.update | Allowlisted contact/locale only |
| `POST /api/v1/personnel/:id/verify` | personnel.verify | Verification evidence/reason; scoped delegation |
| `POST /api/v1/personnel/:id/suspend` | personnel.suspend | Reason; revoke sessions/channels; no history deletion |
| `POST /api/v1/roles/grants` | roles.grant + MFA | Bounded role/scope/validity; cannot exceed grantor authority |
| `POST /api/v1/roles/grants/:id/revoke` | roles.grant + MFA | End-date and reason; membership epoch update |
| `GET /api/v1/sessions` | self / sessions.revoke scope | Minimized device/session list |
| `DELETE /api/v1/sessions/:id` | self / sessions.revoke | Revoke auth session, not just delete display row |
| `POST /api/v1/rooms` | rooms.manage | Central/district unit; district uniqueness validated |
| `GET /api/v1/organization/scope` | Active member | Authorized rooms/districts/modules and reference versions |

Login, password recovery/reset, MFA enrollment/challenge and sign-out use Supabase Auth SDK/server callbacks with strict redirect allowlists. They are not replaced by a custom password endpoint. Reset routes never grant operational roles.

## 4. Geography, election and assignment contracts

| Method / path | Permission | Key contract |
|---|---|---|
| `POST /api/v1/geography/imports` | geography.import | Source manifest + private file reservation; idempotent source hash |
| `GET /api/v1/geography/imports/:id` | geography.import/read | Counts, row errors, validation state; no raw public source URL |
| `POST /api/v1/geography/imports/:id/approve` | geography.approve | Release reconciliation, distinct approval, immutable publication |
| `GET /api/v1/geography/releases/:id/tree` | geography.read | Paginated district/LGA/ward/PU projection within scope |
| `POST /api/v1/elections/configurations` | elections.configure | Type/cycle/date/geography/jurisdiction/schema; draft until approved |
| `POST /api/v1/elections/configurations/:id/approve` | elections.approve | Candidate/party roster/source and release pin validated |
| `POST /api/v1/assignments` | assignments.manage | Agent/configuration/PU/supervisor/time window; derived scope |
| `POST /api/v1/assignments/:id/reassign` | assignments.manage | Expected version, reason, effective time; preserve history |
| `GET /api/v1/assignments/me` | Own active identity | Current/history and cached reference version |
| `POST /api/v1/checkins` | self.checkin.create | Assignment, kind, observed time, optional consented point; idempotent |
| `POST /api/v1/availability` | self.availability.update | State/reason/window; no background tracking |

## 5. Reports, incidents and emergency

| Method / path | Permission | Key contract |
|---|---|---|
| `POST /api/v1/reports` | self.report.create | Active assignment, category/schema, observation; immutable first version |
| `POST /api/v1/reports/:id/versions` | Own correction | Expected version, reason, new immutable payload |
| `GET /api/v1/reports` | reports.read / own | Cursor, election/district/status/time filters; bounded page |
| `GET /api/v1/reports/:id` | Parent read policy | Version/review history and permitted attachment references |
| `POST /api/v1/reports/:id/reviews` | reports.review/verify | Version-specific decision and reason; no unauthorized verify |
| `POST /api/v1/incidents` | self.incident.create / incidents.triage | Facts, category/severity, safety/assistance, confidentiality; no guilt label |
| `POST /api/v1/incidents/:id/transitions` | Matching incident action | Expected version, allowed state, reason, optional owner/escalation scope |
| `POST /api/v1/incidents/:id/notes` | incidents.investigate | Internal/reporter-visible classification; append-only |
| `POST /api/v1/incidents/:id/resolve` | incidents.resolve | Outcome/notes; disputed/duplicate/insufficient evidence supported |
| `POST /api/v1/incidents/:id/close` | incidents.close | Resolution prerequisite, reason and audit |
| `POST /api/v1/emergency/alerts` | self.alert.create | Type, optional note/location; short idempotent payload |
| `POST /api/v1/emergency/alerts/:id/acknowledge` | emergency.acknowledge | Responder derived; append first/subsequent acknowledgements |
| `POST /api/v1/emergency/alerts/:id/responses` | emergency.respond/resolve | Action/update/status; resolution requires permission |

Emergency success means server receipt only. UI then tracks acknowledgement separately. Offline alert remains visibly unsent and displays approved direct emergency guidance.

## 6. Evidence and media

| Method / path | Permission | Key contract |
|---|---|---|
| `POST /api/v1/evidence/reservations` | Authorized uploader | Intended parent/scope, kind, expected MIME/size/SHA-256; expiry |
| `POST /api/v1/evidence/:id/finalize` | Reservation owner | Storage object reference, observed bytes/hash; server verification/scan pending |
| `GET /api/v1/evidence/:id` | evidence.read + parent | Metadata/custody/scan state; no broad bucket listing |
| `POST /api/v1/evidence/:id/access` | evidence.download/preview + parent | Purpose; audit then short-lived URL or proxy ticket |
| `POST /api/v1/evidence/:id/annotations` | evidence.annotate | Versioned annotation; original unchanged |
| `POST /api/v1/evidence/links` | Parent edit/attach permission | Typed parent/version and evidence ID; matching scope |
| `POST /api/v1/exports/evidence` | evidence.export | Purpose, authorized IDs/filters, manifest/hash format; async job |

Upload bytes use Supabase private Storage under a server-issued path/reservation, not arbitrary client paths. Multipart/resumable capability must be verified against the selected SDK/service before promising it. Text receipt does not wait for upload. Original and derivative hashes are distinct. Quarantined/rejected objects have no ordinary preview/download.

## 7. Communication and notifications

| Method / path | Permission | Key contract |
|---|---|---|
| `POST /api/v1/conversations` | communications.use/group.manage | Authorized direct/group/incident scope and initial members |
| `GET /api/v1/conversations` | Active membership | Own authorized list and unread counts |
| `POST /api/v1/conversations/:id/members` | Group manager | Active scoped identities; epoch increment |
| `POST /api/v1/conversations/:id/members/:id/remove` | Group manager | End-date; revoke future channel access |
| `POST /api/v1/conversations/:id/messages` | Active member | Client UUID, body/attachment IDs; sender server-derived |
| `GET /api/v1/conversations/:id/messages` | Active member + history policy | Cursor/sequence pagination |
| `POST /api/v1/messages/:id/receipts` | Active member | Own delivered/read receipt; no forged recipient |
| `GET /api/v1/notifications` | Own recipient | Priority/read/cursor; generic previews |
| `PATCH /api/v1/notifications/:id/read` | Own recipient | Idempotent read state |
| `PATCH /api/v1/notification-preferences` | Self | Allowed channels/quiet hours; critical policy retained |

Realtime topics are private `user:<id>`, `district:<id>:epoch`, `conversation:<id>:epoch`, `incident:<id>:epoch`. Names are not authorization. Subscribe only after policy checks; payloads are minimal invalidation metadata. Reconcile missed events through paginated reads after reconnect.

## 8. Results, GIS, analytics and governance

| Method / path | Permission | Key contract |
|---|---|---|
| `POST /api/v1/results` | self.result.create | Configuration/assignment/counts/entries/source kind; idempotent |
| `POST /api/v1/results/:id/versions` | Own correction | Expected version/reason; original preserved |
| `POST /api/v1/results/:id/reviews` | results.review/verify | Document and transcription checks, version-specific decision |
| `POST /api/v1/official-publications` | official_results.import | Authority/source/date/scope/evidence; draft pending approval |
| `POST /api/v1/official-publications/:id/approve` | official_results.approve | Distinct approver; source verification; separate label |
| `GET /api/v1/gis/features` | gis.read | Release/election/bbox/layer/time filters; scoped GeoJSON/aggregate |
| `GET /api/v1/gis/list` | gis.read | Accessible paginated equivalent, including null coordinates |
| `GET /api/v1/analytics/overview` | analytics.read | Scope/election/time; numerator/denominator/asOf/missingness |
| `POST /api/v1/exports` | exports.create + domain read | PDF/XLSX/CSV, filters/purpose/snapshot; async authorized job |
| `GET /api/v1/exports/:id` | Job owner/export role | State/expiry; reauthorize download |
| `GET /api/v1/audit` | audit.read | Cursor/scope/action filters; immutable redacted projection |
| `GET /api/v1/security/events` | security.read | Scoped event workflow and health provenance |
| `POST /api/v1/security/events/:id/transitions` | security.respond | Owner/state/reason; audited |
| `POST /api/v1/backups/requests` | backups.request | Asset class/reason; queued, not completed |
| `POST /api/v1/restores/requests` | restore.request + MFA | Recovery point/scope/impact; isolated target by default |
| `POST /api/v1/restores/:id/approve` | restore.approve + MFA | Distinct approver; production switch separately controlled |
| `POST /api/v1/privacy/requests` | Self/privacy.respond | Verified request workflow; minimal identity proof |
| `GET /api/v1/sync/receipts` | Own identity | Receipts for client keys/cursor; no other actors' keys |

## 9. Pagination, caching and rate limits

Lists default to a bounded page (proposed 25–50, max 100) and stable cursor. Search is scoped before ranking. Responses include `nextCursor`, `asOf` and partial-data status where relevant. Reference releases use versioned ETags; sensitive responses use private/no-store as appropriate. Public service-worker cache contains no authenticated API response.

Rate-limit classes and numeric quotas are set after load/abuse testing. Return safe retry metadata. Upload/export limits include bytes, duration, concurrency and cost. Job workers use lease/visibility timeout, idempotent provider keys, retry/backoff and dead-letter review. Never retry a non-idempotent privilege or publication action without checking its committed state.

## 10. Route protection map

Public routes: `/login`, `/forgot-password`, `/reset-password`, `/privacy`, `/terms`; no operational data. Central `/central/*`: organization scope plus route-specific central permission. District `/zone/*`: explicit district grant plus module permission. Field `/field/*`: active field identity and own assignment; offline shell never implies server authorization. Shared `/admin/profile|notifications|security|activity`: self-service only, not central administration.

Every route has server-side protection and a safe denied/expired-session state. Dynamic IDs are reauthorized on every read/write/export/download. Client navigation filtering is only usability. Route/API/storage/Realtime authorization tests must agree.
