# User Journeys and Operational Workflows

Status: **ARCHITECTURALLY DEFINED** · 2026-11-02

## 1. Field agent: onboarding and assignment

Preconditions: approved invitation, verified contact, privacy notice, required training and explicit activation. Steps: accept single-use invitation → authenticate → enroll MFA if required → complete minimal profile → await personnel verification → receive assignment → view official PU description and supervisor contact.

Failures: expired/revoked invitation; unverified/suspended account; no assignment; stale geography; lost MFA device. Do not grant a temporary broad role or invent a PU. Offer approved support route. Acceptance: another agent's ID cannot reveal assignments; reassignment preserves old history; pending user cannot submit.

## 2. Field agent: checkin and ordinary report

1. Open cached assignment; see reference version, network and last successful sync.
2. Check in with arrival/availability. Location permission explains purpose; denial remains allowed. If supplied, store point, accuracy, capture time and consent purpose as a discrete event.
3. Select report category; answer structured prompts; optionally add description/media.
4. Save local draft transactionally. Send text first; display queued/sending until durable receipt.
5. Media uploads independently; report shows which attachments are local, uploading, quarantined or received.
6. Server derives scope/reference/receipt time, validates assignment and deduplicates retry. Supervisor worklist updates after commit.
7. Agent sees received/review status and can submit a correction version when requested.

Target: practiced ordinary report in 30–60 seconds under normal conditions; measure with representative users. Failure states include offline, auth expired, storage quota, stale assignment, invalid category schema and media failure. None may silently discard a locally committed draft. No continuous location collection.

## 3. Field agent: result observation

Select approved contest and assigned PU → transcribe counts/candidate entries → review arithmetic warnings → attach result sheet if safe → submit. Unknown registered-voter count stays unknown. A questionable original total can be faithfully transcribed and flagged; the app does not rewrite it.

Track document authentication separately from transcription verification. Correction creates a new version. Distinct agents' observations remain separate. “Verified” means authorized review of this observation, never “INEC declared.” Unsafe demands for a photograph must not override safety guidance.

## 4. Field agent: incident and emergency

Incident: choose category/severity → minimum necessary facts → safety/assistance flags → optional evidence/confidentiality choice → submit and track acknowledgement/response. Involved-person/witness details are collected only when necessary/lawful; no encouragement to confront armed individuals or interfere with officials.

Emergency: persistent accessible action → type → optional note/location → brief confirmation → sending/received/acknowledged states. If offline or rejected, say **not sent** and show approved direct emergency contacts/procedure. No invented phone numbers. Critical notification priority is internal; it cannot force a disconnected device to receive it.

## 5. Field agent: communication, history and shared-device exit

Message assigned supervisor/room or authorized group; queued messages remain pending until committed. Read receipt is not inferred from notification delivery. History shows own reports/results/incidents and review status. Sync screen lists pending text/media, failures and conflicts with manual retry.

On sign-out, warn about unsent work and offer authorized backup/retention or explicit purge. Shared-device exit can purge local account data and revoke session; it must not pretend unsent records reached the server. Browser/OS compromise remains a residual risk.

## 6. Senatorial commander

District-pinned home → coverage/checkin gaps → verify personnel within delegation → assign/reassign with reason → triage reports/incidents → allocate responders → escalate to central when policy requires → review results with explicit permission → communicate → inspect scoped map/list → export authorized summary.

Every drill-down retains district/election context. A copied URL, altered UUID, search query, export filter or Realtime topic cannot cross scope. Commander absence/delegation uses an expiring explicit grant, not sharing credentials. Performance views measure compliance/completeness, not allegations or political preference.

## 7. Central command and staff

Statewide overview → compare three districts → inspect missing coverage/workload → drill into authorized records/provenance → coordinate escalated response → review approved summaries → govern election/geography/configuration → monitor security/recovery. Staff see only their functional grants.

Central commander is not automatically super administrator. Raw confidential source identity, sensitive exports and restore approval are separate permissions. Official-source publication requires authority/reference and dual control. Central aggregate freshness and incomplete coverage are visible; no estimated number is presented as a count.

## 8. Auditor

Authenticate with MFA as policy requires → select approved historical scope → inspect approved reports/verified incidents/audit projections → request specifically authorized evidence → access is logged → export only with separate permission. Drafts, private conversations, source identities and precise live locations are excluded by default. Redactions/minimization are explained without revealing protected content.

## 9. Incident and emergency state machines

### Incident primary states

| From | Event / required permission | To | Records / guard |
|---|---|---|---|
| New | Validated create | SUBMITTED/RECEIVED | Immutable initial version, server receipt, reference |
| RECEIVED | Triage | TRIAGED | Severity/category review, actor/reason |
| TRIAGED | Assign responder | ASSIGNED | Owner/scope and response expectation |
| ASSIGNED | Begin investigation | UNDER_INVESTIGATION | Owner/authorized investigator |
| UNDER_INVESTIGATION | Assistance/action needed | ACTION_REQUIRED | Action note/owner; may escalate |
| ACTION_REQUIRED or UNDER_INVESTIGATION | Resolve | RESOLVED | Outcome and resolution notes |
| RESOLVED | Authorize closure | CLOSED | Closure permission; no unresolved required action |
| Any open state | Escalate | Same workflow state + escalation event | Authorized target; central visibility, original retained |
| Review/investigation | Dispute | DISPUTED | Reason; original allegation not labelled offense |
| Triage | Duplicate | DUPLICATE | Canonical incident link; no deletion |
| Investigation | Lack of material | INSUFFICIENT_EVIDENCE | New evidence may reopen through audited event |
| Closed/dispositioned | Reopen | TRIAGED/UNDER_INVESTIGATION | Authorized reason and prior-history link |

Severity and confidentiality are separate from state. “Resolved” does not mean an allegation was proven. Internal notes and reporter-visible updates have different read policies. Response-time metrics measure receipt→acknowledgement, acknowledgement→assignment and assignment→resolution with clock/source definitions.

### Emergency states

`CREATED_LOCAL → SENDING → RECEIVED → ACKNOWLEDGED → RESPONDING → RESOLVED → CLOSED`, with `FAILED`, `REJECTED` and `CANCELLED_WITH_REASON`. Local creation is not a server state. First acknowledgement is derived from append-only acknowledgements; later responders remain recorded. Central escalation is an event. Resolution records action/outcome, not a medical/legal determination.

Proposed escalation configuration: severity, acknowledgement timeout, response timeout, target room/role, repeat interval and quiet-hours exemption. Numeric defaults require operations approval. Test clock skew, duplicate alerts, repeated notifications and responder reassignment.

## 10. Verification and publication journeys

Report reviewer opens a specific version → checks assignment/category/evidence → verifies, disputes, rejects or requests correction with reason. Result reviewer separately checks source document authenticity/legibility and transcription/arithmetic. Submitter cannot approve own result by default.

Official publication importer records issuing authority, scope, source reference/document and publication time. A different authorized approver checks source and approves. Comparison views keep observer and official records separate, including differing totals and coverage. No automatic winner declaration.

## 11. Geography and personnel governance journeys

Importer uploads source/hash/manifest → worker validates/quarantines → reviewer reconciles official parents/counts → approves immutable release → election configuration pins release. Later changes create another release; used records retain their original geography.

Personnel manager invites bounded identity → verifier checks required evidence → authorized grant/activation → assignment. Suspension revokes access and ends future assignment validity; historical reports remain. Reassignment records reason/effective time and does not retarget old evidence.

## 12. Export and recovery journeys

Exporter selects scope/format/purpose → server authorizes and queues snapshot job → worker applies formula/privacy controls → restricted package/manifest → download reauthorizes and logs. Evidence package preserves original references/hashes and verification caveats.

Recovery operator requests isolated restore → different approver authorizes → restore DB and object bytes → reconcile references/hashes/auth/policies/outbox → smoke test → operational decision on promotion. A backup request button never directly overwrites production. See [DEPLOYMENT.md](../../DEPLOYMENT.md).

## 13. Journey acceptance

Each journey requires positive, denied, offline, stale-version and duplicate/retry tests where relevant. UI language must distinguish local save, server receipt, review, official publication and provider delivery. Safety/privacy notices are reviewed in supported languages. No journey is accepted from a mock screen alone.
