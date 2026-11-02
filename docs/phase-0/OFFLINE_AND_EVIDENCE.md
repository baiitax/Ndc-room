# Offline Synchronization and Evidence Architecture

Status: **ARCHITECTURALLY DEFINED** · 2026-11-02

## 1. Guarantees and limitations

Guarantee to design/test: a supported browser either commits a local draft/outbox transaction or visibly reports that it could not save; a server success receipt follows a durable database commit; retries use stable idempotency; acknowledged records survive the defined provider fault tests.

Do not guarantee: offline login, unlimited browser storage, execution after the OS kills a PWA, background upload on every iOS browser, delivery over no network, protection from a compromised device, or survival of explicit site-data clearing. Browser eviction/quota errors are visible. “Saved on this device” and “received by command” are different statements.

## 2. Local data model and account isolation

IndexedDB stores/schema (names conceptual):

| Store | Key / indexes | Contents and lifecycle |
|---|---|---|
| `account_context` | account ID | Non-secret display/scope/reference version; no refresh token |
| `reference_snapshots` | account/release/entity | Authorized assignment/PU/category/candidate reference data; versioned expiry |
| `drafts` | draft UUID; account/status/time | Schema version, payload, expected root version, capture/observation time |
| `outbox` | operation UUID; account/state/nextAttempt | Stable idempotency key, fingerprint, dependency IDs, attempt count and safe error |
| `media` | media UUID; account/state | Original Blob, expected hash/size/MIME, reservation ID, upload cursor if supported |
| `receipts` | idempotency key; account/resource | Authoritative server ID/reference/version/receivedAt |
| `conflicts` | conflict UUID; account/resource | Server summary, local payload reference, explicit resolution history |
| `sync_state` | account | Last successful reference/data sync, cursor, schema version, pending counts |

All indexes include account scope. On account switch, close subscriptions and show only the active account's partition. On logout, offer explicit purge/retain choice with unsent-work warning; shared-device quick exit purges local sensitive data after warning. Never silently delete unsent work to make a retry succeed.

IndexedDB is origin-bound, not automatically application-encrypted. Do not store service keys or refresh tokens there. Supabase web session storage must be reviewed for XSS/shared-device risk. Optional local draft encryption requires a real passphrase/key-derivation and recovery design; storing a decryption key beside the ciphertext is not meaningful protection. No E2EE claim.

Request persistent storage where supported; display grant/denial and quota estimates. Handle private-browsing restrictions and corruption with a safe recovery screen. Local schema migrations are versioned and backup-before-migrate where feasible; failure must not erase the only copy of a draft.

## 3. Save/send state machine

```text
EDITING → DRAFT_SAVED
DRAFT_SAVED → QUEUED (payload + outbox commit)
QUEUED → SENDING
SENDING → RECEIVED (authoritative server receipt persisted)
SENDING → RETRY_WAIT (timeout/5xx/temporary network)
RETRY_WAIT → QUEUED (backoff/manual retry)
SENDING → FAILED (non-retryable error; work retained)
SENDING/FAILED → CONFLICT (stale version/scope/idempotency mismatch)
CONFLICT → NEW_CORRECTION_VERSION or EXPLICIT_LOCAL_DISCARD
```

A locally saved emergency alert is not silently dispatched as a fresh emergency hours later: on reconnect, require explicit send/reconfirmation, preserve the original capture time and display the delay. If already committed, reconcile its receipt rather than creating a second alert.

`navigator.onLine` is only a hint. A successful authenticated health/receipt request establishes usable connectivity. Connection quality is derived from recent request outcomes, not invasive probing. Server receipt time is authoritative; client clock skew is flagged, not used to order official receipt.

Before sending, verify account/session and reference version. Expired session → reauthenticate, retain queue. Suspended account → stop upload and show support state. Late offline work is accepted only under approved assignment/election window policy; rejected work remains exportable/visible until lawful resolution, not silently dropped.

## 4. Idempotency, ordering and conflicts

- Client creates one UUID/key per logical operation and retains it across reload/retry. Fingerprint is a canonical hash of the immutable payload/schema/operation.
- DB unique key: actor + operation + idempotency key. Same fingerprint returns original receipt; different fingerprint returns conflict. Receipt and domain write commit together.
- Lost response: retry same key or query own receipt endpoint. Never create a new key merely because receipt was uncertain.
- Automatic retry: exponential backoff with jitter, proposed cap and maximum unattended attempts; after cap, show manual action but retain work. Honor Retry-After. Reconnect adds jitter to avoid thundering herds.
- Dependencies: text report commits before attachment link; media reservation/upload/finalization precedes link. A report can be received with media pending. Message attachment follows the same rule.
- Corrections carry expected version. Stale assignment/root/election configuration yields explicit conflict. No last-write-wins for results, incident facts or review state.
- Distinct agents at one PU are independent. Duplicate-result comparison is a review workflow, not a unique constraint that erases the second observer.
- Server-side transaction writes domain, audit, outbox and receipt together. Client marks received only after persisting the returned receipt; if that local commit fails, retry resolves to the same server receipt.

## 5. Service worker, PWA and background behavior

Service worker precaches versioned public shell, icons, fonts and static code. It excludes `/api/*`, authenticated HTML, Supabase responses, signed URLs and evidence bytes from shared Cache Storage. Navigation fallback is a public/offline shell that loads the active local account context only after app initialization.

Manifest provides installable display/name/icons; installation is optional. Foreground resume and online events trigger reconciliation. Background Sync/periodic sync are progressive enhancements where supported; the worker cannot assume access to a usable auth session. No refresh/service secret is embedded in the worker. Manual sync remains available.

Push payloads are generic. Opening the app performs authenticated fetch. Cache cleanup removes old public assets, not IndexedDB drafts. A new app version must support the previous local schema long enough to migrate safely. Test update while a draft/recording/upload is active.

## 6. Media capture and bandwidth

| Media | Capture/default direction | Integrity/bandwidth behavior |
|---|---|---|
| Photo | Camera input/capture or gallery; supported-browser getUserMedia optional | Preserve original; resize/compress a labeled derivative; thumbnail; target max dimension/quality configurable |
| Audio | MediaRecorder with MIME capability check; proposed 32–64 kbps speech default | Duration/level/preview/stop; chosen capture bitrate is part of original; retry original upload |
| Video | Camera/file input; proposed 480p/low-bitrate/short clip default | Duration/size warning; preview; server/client transcode only as derivative if supported |
| Document/result sheet | File picker/image capture | Signature/MIME/size validation; no executable preview; original preserved |

Exact size/duration/bitrate limits require device/network tests and policy approval. Offer lower-quality capture before recording; do not silently replace an original with a lossy copy. File picker is the fallback when recording APIs are unsupported/denied. Stop tracks on stop/unmount; show recording indicator and handle interruption/backgrounding.

Upload progress reflects bytes accepted by the upload API where available; otherwise show staged state rather than fake percentages. Resumable/TUS support must be verified for the selected Supabase endpoint/SDK. If unsupported, retry the whole bounded file with the same reservation/key and reconcile an already-uploaded object. Large media never blocks a basic text report.

## 7. Evidence custody protocol

1. **Reserve:** authenticated uploader supplies intended typed parent/scope, media kind, expected MIME/bytes/SHA-256. Server checks permission and returns opaque reservation/object path/expiry.
2. **Capture/save:** local transaction stores original Blob and metadata. Client hash is a comparison value, not proof of server custody.
3. **Upload:** private quarantine bucket under reservation-bound path; no overwrite of finalized originals. Enforce bucket and application size/type limits.
4. **Finalize:** server inspect object size/signature and compute/verify SHA-256. Record receipt time, uploader, source filename, detected type and custody state. Mismatch → quarantine/reject, never approved original.
5. **Scan:** approved malware scanner processes quarantine. Pending/failed/unsupported scan is not “clean.” No production evidence acceptance until scanner policy is operational.
6. **Approve custody:** immutable original reference moves logically to approved custody; avoid copy/move that changes hash. Any storage migration records old/new location and verifies hash.
7. **Derive:** thumbnail/preview/transcode gets a new evidence record, parent-original reference and its own hash. Metadata stripping/redaction happens only on derivatives.
8. **Link:** typed attachment table checks parent version and evidence scope. Late attachment does not change the original observation payload silently.
9. **Access:** authorize linked record + evidence action + purpose; append access log; issue ~60-second signed URL or authenticated proxy stream. Log actual download completion separately if observable.
10. **Export/backup:** manifest includes IDs, hashes, bytes, custody/review state and source references. Independent backup verifies object bytes, not just DB metadata.

Original filename is untrusted display text. Guard path traversal, MIME spoofing, polyglots, decompression bombs, SVG/HTML scripting and metadata leakage. Do not expose GPS EXIF through derivatives unless explicitly authorized. Hashes prove byte equality relative to a digest, not truth, capture time or legal admissibility.

## 8. Deletion, annotation and confidentiality

No ordinary client deletion of originals, hashes or access logs. Annotations are append-only versions. A safety/privacy redaction creates restricted derivatives and access controls while preserving required original custody under policy. Retention disposal requires approved policy, legal-hold check, dual authorization where required and an audit tombstone/manifest.

Confidential source identity is separate from evidence access. A photograph may itself reveal identity; classification and reviewer guidance must reflect that. Anonymous reporting remains disabled until policy exists. Confidential authenticated reporting is not anonymous to the system.

## 9. Required fault tests

Save/reload/close browser; account switch; logout with unsent work; quota/persistence denial; local schema upgrade; offline incident/result/message; lost response after commit; concurrent duplicate sync; changed assignment; suspended session; interrupted photo/audio/video; hash mismatch; scanner timeout; retry limit; signed-link expiry; backup restore with missing object; cache update during recording. Assert no silent data loss, no duplicate logical submission and truthful UI state.

These are planned tests, not executed application tests in Phase 0.
