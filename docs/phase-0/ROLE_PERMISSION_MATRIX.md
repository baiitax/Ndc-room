# Role and Permission Matrix

Status: **ARCHITECTURALLY DEFINED — operational approval pending** · KEMSR-IAM-0001 · 2026-11-02

## 1. Authorization equation and notation

Every protected operation requires an authenticated Supabase identity, active/non-suspended profile, organization membership, action permission in the relevant scope, record-level policy and MFA where required. Authentication alone grants no operational role. Account verification is an operational decision, not merely email deliverability.

Notation: **A** all records within the stated organization scope; **D** assigned district only; **O** own records/membership only; **P** explicit permission and record policy; **—** denied; **R** approved/minimized read-only projection. “All” never means other organizations or unrestricted raw confidential identities.

| Module / action | Super admin | Central commander | Central staff | District commander | Zonal staff | Field agent | Auditor |
|---|---|---|---|---|---|---|---|
| Own profile/contact | O | O | O | O | O | O | O |
| Personnel directory/contact | A | P | P | D/P | D/P | Own + minimal assigned supervisor | R/P |
| Invite/register personnel | A | P | P | D/P, no central roles | — by default | — | — |
| Verify/activate/suspend | A | P | P | D/P, field/zonal limits | — | — | — |
| Grant/revoke roles | A, MFA + reason | — by default | — | D, delegated allowlist only | — | — | — |
| Configure rooms/elections | A | P | P | — | — | — | R approved config |
| Import/approve geography | P, separate grants | — by default | P | — | — | — | R release metadata |
| Assign/reassign agents | A | P | P | D/P | D/P | — | R history |
| Check in / availability | — | — | — | — | — | O, active assignment | — |
| Read situation reports | A/P | A/P | P | D/P | D/P | O | R approved |
| Submit/correct situation report | — as agent unless separately assigned | — | — | — | — | O | — |
| Review/verify situation report | P | P | P | D/P | D/P | — | — |
| Read result observations | A/P | A/P | P | D/P | D/P | O | R approved |
| Submit/correct result observation | — unless separately assigned | — | — | — | — | O | — |
| Verify/dispute/reject result | P, no self-review | P, no self-review | P, no self-review | D/P, no self-review | D/P, no self-review | — | — |
| Import/approve official publication | P, dual control | P, dual control | P, dual control | — by default | — | — | R |
| Read incidents | A/P | A/P | P | D/P | D/P | O limited status | R verified/closed |
| Create incident | O via assignment | P | P | D/P | D/P | O | — |
| Triage/assign/investigate | P | P | P | D/P | D/P | — | — |
| Escalate to central | P | P | P | D/P | D/P | Request assistance in own report | — |
| Resolve / close | P / P closure grant | P / P | P / P | D/P / P | P / P | — | — |
| Confidential source identity | Separate P + purpose | Separate P | Separate P | Separate P | Separate P | Own only | — by default |
| Emergency create / read | O / A/P | O / A/P | O / A/P | O / D/P | O / D/P | O | R approved summary |
| Emergency acknowledge/respond | P | P | P | D/P | D/P | Own updates only | — |
| Evidence read/download | P linked-record scope | P | P | D/P | D/P | O + explicitly shared | R/P approved |
| Evidence annotate | P | P | P | D/P | D/P | Own pending context only | — |
| Evidence export | P + export grant | P | P | D/P | P | Own permitted package | P, separate grant |
| Evidence original deletion | — ordinary API | — | — | — | — | — | — |
| Conversations / messages | O/member | O/member | O/member | O/member | O/member | O/member | — by default |
| Create direct/group conversation | P | P | P | D/P | D/P | Assigned supervisor/room only | — |
| Manage group membership | P | P | P | D/P | D/P | — | — |
| GIS operational layers | A/P | A/P | P | D/P | D/P | Own assignment only | R approved aggregates |
| Precise explicit checkin location | Separate P | Separate P | Separate P | D/P + separate P | Separate P | O | — by default |
| Analytics / operational exports | A/P | A/P | P | D/P | D/P | O history only | R/P |
| Audit read | P | P | P security/intelligence | D/P where permitted | — by default | Own activity summary | P |
| Audit update/delete | — | — | — | — | — | — | — |
| Security events / sessions | A/P | P | P | D limited personnel events | — | O sessions | R/P |
| Settings/integrations | P | — | P delegated | — | — | O preferences | — |
| Backup request / verify record | P | — | P delegated | — | — | — | R |
| Restore request / approve | P, dual control | — | P designated recovery role | — | — | — | — |
| Retention/legal hold change | P, dual control | — | P privacy role | — | — | — | R policy |

## 2. Permission keys

Keys are stable identifiers, not display labels. A role is a set of keys plus scope; a scoped grant cannot manufacture a key above its delegator's authority.

| Domain | Keys |
|---|---|
| Identity/org | `personnel.read`, `personnel.invite`, `personnel.verify`, `personnel.suspend`, `roles.grant`, `rooms.manage`, `organization.manage` |
| Geography/election | `geography.read`, `geography.import`, `geography.approve`, `elections.configure`, `elections.approve` |
| Assignments | `assignments.read`, `assignments.manage`, `agents.performance.read` |
| Reports | `reports.read`, `reports.review`, `reports.verify`, `reports.export` |
| Results | `results.read`, `results.review`, `results.verify`, `results.export`, `official_results.import`, `official_results.approve` |
| Incidents | `incidents.read`, `incidents.triage`, `incidents.assign`, `incidents.investigate`, `incidents.escalate`, `incidents.resolve`, `incidents.close`, `incidents.source_identity.read` |
| Emergency | `emergency.read`, `emergency.acknowledge`, `emergency.respond`, `emergency.resolve` |
| Evidence | `evidence.read`, `evidence.download`, `evidence.annotate`, `evidence.export`, `evidence.quarantine.review` |
| Communications | `communications.use`, `communications.group.manage`, `communications.history.read` |
| GIS/analytics | `gis.read`, `gis.location.precise.read`, `analytics.read`, `exports.create` |
| Governance | `audit.read`, `security.read`, `security.respond`, `sessions.revoke`, `settings.manage`, `integrations.manage`, `notifications.manage` |
| Recovery/privacy | `backups.request`, `backups.verify`, `restore.request`, `restore.approve`, `retention.manage`, `privacy.respond`, `legal_hold.manage` |

Agent-self operations use separate owner policies (`self.profile.update`, `self.checkin.create`, `self.report.create`, etc.), not general administrative permissions. A role can be held in more than one district only through separate explicit grants; district roles do not accept null scope.

## 3. Configurable staff roles

Central staff functions: intelligence/reporting; incident management; result verification; agent management; communications; media/evidence; analysis; security. Zonal functions: reporting; incidents; agent coordination; results; communications; evidence. These are bounded role templates/custom roles, not automatic all-module staff access.

A custom role may combine only keys allowed for its context. A district commander cannot create a central role or grant a key/scope they do not possess and lack delegation authority for. System templates are immutable to organization administrators and change only through platform migration review. Organization-specific templates are custom roles. Custom-role changes require privilege-change audit; broadening access requires the same approval as a new grant. Default invitation role is **no role**.

## 4. Sensitive qualifications

- **MFA:** all central/district command and administrative roles; role grants, raw source-identity access, sensitive exports, retention/hold changes and recovery actions require AAL2. Field MFA policy is unresolved; support enrollment without assuming all agents have authenticator devices.
- **Separation of duties:** result submitter cannot verify their own version. Official publication importer and approver must differ. Restore requester and approver must differ. Last-active-admin protection and emergency break-glass procedure require explicit design in Phase 2/10.
- **Auditor:** approved reports/verified incidents/authorized summaries, audit permission and specifically authorized evidence. Not unrestricted draft, message, whistleblower or live-location access.
- **Confidentiality:** ordinary incident permission does not reveal confidential source identity. Anonymous public ingestion is disabled pending policy; authenticated confidential submission still has an accountable system identity.
- **Location:** a checkin is a discrete consented event. No permission enables covert continuous tracking. Map/list/download policies must match.
- **Suspension:** blocks new commands and protected reads; revoke sessions and Realtime access. Offline drafts are not automatically uploaded under a suspended identity.
- **Exports:** read permission alone is insufficient for bulk export. Export jobs recheck permission at request, execution and download; revoked access invalidates pending jobs.

## 5. Database enforcement contract

The matrix becomes RLS policies, minimal table/column grants, validated RPCs, storage policies and private Realtime policies. No client update of role, owner, district, review status, official label or audit history. Security-definer helpers must not create recursive policy lookups or trust editable JWT/user metadata for application roles.

Every cell marked denied requires an automated negative test at the database/API layer. Every allowed cell requires a positive test with the correct scope. UI tests alone do not satisfy this contract. See [SECURITY.md](../../SECURITY.md) and [TESTING.md](../../TESTING.md).

## 6. Approval items

Confirm personnel delegation limits, result-review separation, source-identity roles, auditor evidence scope, field MFA, emergency responders and retention/restore approvers. Names and numeric thresholds are intentionally not invented. Operational sign-off is recorded in the [decision register](DECISION_REGISTER.md).
