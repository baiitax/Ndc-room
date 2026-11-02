# Known Issues, Blockers and Residual Risks

Updated: 2026-11-02 · Phase 1 foundation review

Phase 0 planning findings remain unless resolved below. Phase 1 adds executed foundation checks, not an independent application/security audit. Decision IDs refer to [the decision register](docs/phase-0/DECISION_REGISTER.md).

## Blocking inputs and execution dependencies

| ID | Severity / state | Issue | Affected gate / action |
|---|---|---|---|
| K01 | High / OPEN | Formal operational/technical review signatures still outstanding | User authorized Phase 1 progression; this does not approve live operations or later phases (D01/D02/D30) |
| K02 | High / BLOCKED | No approved current official geography/boundary/coordinate package | Live Phase 3/9 acceptance; acquire and validate source (D04/D05) |
| K03 | High / OPEN | Controller, privacy/security, operations and recovery owners unnamed | Live data and approval gates; assign accountability (D01/D02/D18) |
| K04 | High / OPEN | Election/contest configuration and candidate/party roster unspecified | Phase 8 live acceptance; do not invent roster (D03/D11) |
| K05 | High / OPEN | Emergency contacts, thresholds and response policy unspecified | Phase 5 live use; verify contacts and rehearse (D13/D14) |
| K06 | High / OPEN | Malware scanner and evidence release policy unselected | Phase 6 production evidence acceptance (D16/D17) |
| K07 | High / OPEN | Retention/hold/transfer/lawful-basis decisions unresolved | Before live personal data (D18–D20) |
| K08 | High / OPEN | Independent DB/object backup destination and funded recovery targets unresolved | Phase 10/13; cannot claim RPO/RTO (D21/D24/D25) |
| K09 | Medium / RESOLVED WITH EXCEPTIONS | Strict local foundation build/tests passed with TS6/ESLint9 | [Version decision](docs/phase-1/VERSION_DECISION.md); review exceptions at Phase 2 entry (D31) |
| K10 | Medium / BLOCKED locally | No Docker executable observed; no local Supabase stack run | Phase 2 execution setup; provide runtime or isolated test project (D32) |
| K11 | Medium / OPEN | Actual devices, languages, load, media volume and budget unknown | Phase 6/11/12 measurement and procurement (D06/D07/D16/D21) |
| K12 | Medium / OPEN | Notification/map/monitoring providers unselected | Relevant integration gates; no fake delivery/tiles (D22/D23/D26) |

## Design limitations that must remain visible

| ID | Limitation | Required treatment |
|---|---|---|
| K13 | Browser storage can be cleared/evicted and shared devices can be compromised | Visible save failures, persistence/quota handling, purge/re-auth controls; no absolute offline durability claim |
| K14 | Background sync/upload and recording vary by browser/OS | Manual/foreground baseline; real-device matrix; no universal background guarantee |
| K15 | Signed URLs are bearer capabilities with revocation/cache limitations | Short expiry, proxy where needed, audit and realistic incident response |
| K16 | Realtime authorization can remain cached on an existing connection | Membership epoch, session revocation/rejoin and measured removal tests |
| K17 | DB backups exclude Storage object bytes | Separate replication/manifests and full restore reconciliation |
| K18 | Hashes do not prove truth or legal admissibility | Provenance/review and external legal custody process |
| K19 | TLS/provider encryption is not E2EE | Do not claim E2EE; design key management separately if required |
| K20 | Approximate coordinates cannot prove agent misconduct or exact PU location | Source/accuracy labels; no automated accusation/geofence inference |
| K21 | Critical notifications cannot bypass no network or OS restrictions | Explicit unsent/unacknowledged states and direct emergency fallback |
| K22 | Complete NDPA legal text was not parsed during research | Counsel review; no compliance certification from architecture or provider claims |
| K23 | Broad scope can create misleading “finished” UI | Honest disabled states, phase status register and evidence-based acceptance |

## Defect register

Phase 1 browser tests found and corrected malformed CSP construction, mobile drawer route-close behavior, public heading hierarchy and test focus setup. Final local rerun passed 35 browser tests (one intentional desktop skip), with 34 unit/component tests. See the Phase 1 report for intermediate failures and corrections. No independent penetration or formal accessibility audit was performed.

No critical/high issue may be silently accepted for production. Operational unresolved inputs can block a phase without preventing synthetic-fixture implementation after approval.

## Phase 1 residual findings

| ID | Severity / state | Finding | Treatment / expiry |
|---|---|---|---|
| K24 | Medium / OPEN | ESLint 9.39.5 maintenance/deprecation exception for Next plugin peer alignment | No forced downgrade; review at Phase 2 entry and upgrade when compatible |
| K25 | Medium / OPEN | Full audit reports 16 moderate lint-tooling entries from minimatch advisory; production-only audit reports zero | Trusted repository lint input only; no high/critical reported; review upstream fixes at Phase 2 entry, no unsafe major override |
| K26 | High / OPEN before auth | CSP permits inline scripts/styles; active session/RLS enforcement absent | Public non-sensitive shells only; nonce/hardening and server/DB enforcement required in Phase 2 |
| K27 | Medium / OPEN | Automated Chromium/axe coverage is not physical-device/screen-reader certification | NVDA/VoiceOver, Safari/Firefox, real devices, Hausa and zoom/reflow review before operational release |
| K28 | Medium / OPEN | Bundle baseline is build-output accounting, not field-network performance | Measure actual transfer/compute on representative devices/networks in Phase 11 |
| K29 | Medium / BLOCKED | GitHub App push rejected workflow creation/update without workflow permission | CI template retained under docs/phase-1/ci; authorized maintainer activation or GitHub reconnection with workflow permission required; no CI-green claim |

No critical/high production issue is accepted for live operation. The preview contains no live operational data; these findings do not authorize deployment. Legal/geography/emergency/recovery blockers above remain unchanged.
