# Decision and Assumption Register

Status: **OPEN unless explicitly resolved** · 2026-11-02

Proposed architecture is not an operational answer. The items below need named owners and recorded decisions. “Before live data” means implementation may proceed with synthetic fixtures, but production acceptance is blocked. No names, dates, coordinates, candidates, emergency numbers or budgets are invented.

| ID | Decision / missing requirement | Proposed direction / consequence | Accountable role | Latest gate |
|---|---|---|---|---|
| D01 | Operating organization, data controller and product owner | Name legal/operating entity and approval authority | Sponsor | Phase 0 approval |
| D02 | Engineering, operations, security/privacy and evidence-custody owners | Assign named accountable roles and deputies | Sponsor | Phase 0 approval |
| D03 | Election cycle/date, Federal/State contests and reporting windows | Approve configuration; no current election assumed | Operations | Phase 8/live data |
| D04 | Current official district/LGA/ward/PU release and district mapping | Obtain INEC-approved machine-readable package; historical counts only reconciliation | Geography lead | Phase 3 live geography |
| D05 | Boundary source/license and coordinate acquisition/accuracy | Approved polygons/sourced points; null/list fallback otherwise | Geography lead | Phase 9 |
| D06 | Expected agents/staff, concurrency, devices and network inventory | Approve load/device matrix; current 5k/2k figures are planning inputs only | Operations/engineering | Phase 11–12 |
| D07 | Languages and safety/verification translations | English/Hausa readiness; human-reviewed operational strings | Operations/product | Field pilot |
| D08 | Identity contact method and account recovery | Email/phone choice, verified contact ownership and lost-device process | Security/operations | Phase 2 |
| D09 | MFA policy for field/shared devices | Privileged AAL2 mandatory; field policy/device support approved separately | Security | Phase 2/live onboarding |
| D10 | Staff delegation and custom-role limits | Bounded templates; no invitation auto-privilege | Operations/security | Phase 3 |
| D11 | Result verification and official publication authority | Independent reviewer; separate official source and dual approval | Operations | Phase 8 |
| D12 | Anonymous/confidential reporting and source-protection policy | Anonymous public intake disabled; confidential authenticated path separately governed | Counsel/operations | Phase 5 live use |
| D13 | Incident severity/escalation/acknowledgement thresholds | Configurable policy with named responders; no numeric defaults assumed | Operations | Phase 5 |
| D14 | Emergency contacts, responders and fallback procedure | Verified direct services/contacts; app not a substitute | Operations/safety | Phase 5 live use |
| D15 | Location purpose, consent, precision access and retention | Discrete checkins only; no continuous/covert tracking | Privacy/operations | Phase 3 live use |
| D16 | Media size/duration/bitrate and original-upload policy | Low-bandwidth defaults after device tests; originals never silently replaced | Evidence/operations | Phase 6 |
| D17 | Malware scanner and quarantine release policy | Approved scanner required before evidence marked clean/available | Security | Phase 6 |
| D18 | Lawful bases, notices, DPO applicability and DPIA | Controller/counsel approve purpose register and privacy process | Controller/privacy | Before live data |
| D19 | Retention, legal hold, backup expiry and disposal | Data-class schedule, not indefinite retention or invented period | Controller/counsel | Phase 10/live data |
| D20 | Hosting regions, cross-border transfers and processors | Choose available approved regions; latency/privacy/cost review | Security/engineering | Staging/live data |
| D21 | Supabase/Vercel plans, budget and quotas | Fund RLS-compatible scale, PITR/compute, storage/egress and support | Sponsor/engineering | Phase 12–13 |
| D22 | Email/SMS/push providers and sender identities | Adapter contracts, consent, sandbox tests, generic previews | Operations/procurement | Phase 10 |
| D23 | Basemap/tiles/fonts provider or self-hosting | Approved license/privacy/availability; boundary-only fallback | GIS/engineering | Phase 9 |
| D24 | Independent backup destination and immutability controls | Separate credentials/provider; DB and object bytes covered | Recovery/security | Phase 10 |
| D25 | RPO/RTO targets and restore approvers | Proposed DB 5m/2h, evidence 15m/4h; prove or revise formally | Sponsor/operations | Phase 10/13 |
| D26 | Monitoring/error tracking and on-call support | Redacted telemetry, named rota and escalation | Engineering/operations | Phase 13 |
| D27 | Supported browser/device matrix and shared-device exit | Real device inventory; local-data purge/retention warning | Operations/engineering | Phase 11 |
| D28 | Domain, branding, legal pages and accessibility sign-off | Approved content/identity; no implied INEC affiliation | Product/controller | Phase 13 |
| D29 | Election-day freeze, support and degraded-mode fallback | Rehearsed procedure; never disable audit/RLS for throughput | Operations/engineering | Phase 13 |
| D30 | Formal phase reviewers and go/no-go authority | Record approval signatures and risk acceptance limits | Sponsor | Every phase |
| D31 | TypeScript 7 / current library compatibility | [Phase 1 version decision](../phase-1/VERSION_DECISION.md): TS 6.0.3 and ESLint 9.39.5 exceptions; strict local checks executed; review at Phase 2 entry | Engineering | IMPLEMENTED WITH DOCUMENTED EXCEPTIONS |
| D32 | Local Supabase execution runtime | Docker-compatible local environment or approved isolated test project; no mocked RLS gate | Engineering | Phase 2 |

## Assumptions that must not become silent facts

- One operating organization initially; organization IDs preserve future separation.
- Three senatorial districts; central command is organizational, not a fourth district.
- Multiple agents may observe one PU; independent observations are not duplicates to erase.
- No official current candidate/party roster or geography has been supplied.
- No E2EE, continuous tracking, offline login, universal background sync or guaranteed notification delivery is assumed.
- Provider managed encryption/redundancy is not independent backup or legal compliance.
- Performance/load figures are test proposals, not achieved targets or actual traffic.

## Decision record template

`ID · date · decision · alternatives considered · evidence/source · approving names/roles · affected requirements/risks · implementation phase · review/expiry date`.

Phase 0 approval should resolve ownership/scope and acknowledge blockers; it need not pretend unavailable official data or provider choices already exist. Any unresolved production-critical decision retains its gate.
