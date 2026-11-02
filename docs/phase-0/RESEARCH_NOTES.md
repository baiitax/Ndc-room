# Phase 0 Research and Evidence Notes

Research date: **2026-11-02**. These notes distinguish observed sources, historical snapshots, provider documentation and proposed design. They are not a geography import, compatibility certification or security audit.

## 1. Repository and execution observations

Executed local inspection found branch `arena/52212c3f-ndc-room`, commit `9ab263c` (`Initial commit`), a clean initial working tree and only `README.md` containing `# Ndc-room`. There was no application, dependency lockfile, migration, test suite or deployment configuration to assess.

Observed runtime: Node `v22.22.3`, npm `10.9.8`, Python `3.11.2`. `docker` and `pandoc` were not found on PATH. GitHub CLI was available. No Supabase/Vercel project was created or inspected; no provider credentials were used. Local database/container feasibility must be resolved before Phase 2 tests.

## 2. Electoral geography and result authority

| Source | Observed information | Limit / architectural consequence |
|---|---|---|
| [INEC Polling Units Directory](https://inecnigeria.org/polling-units/) | Official locator link; hierarchical State/LGA/Ward/PU code explanation | Authoritative reference for code structure; not a supplied current Kano extract |
| [INEC CVR PU locator](https://cvr.inecnigeria.org/pu) | State selection includes `19 - KANO`; state/LGA/RA/PU selectors; directions described as approximate | Dynamic page did not yield a complete roster; coordinates require provenance and approximate qualifier |
| 2023 Kano North senatorial IReV search snapshot [2](https://www.inecelectionresults.ng/elections/63f8bdaf1315f62e7767f841?type=sen) | Historical LGA/ward listings | Not current geography; direct fetch later showed initializing shell, not complete data |
| 2023 Kano South senatorial IReV search snapshot [1](https://www.inecelectionresults.ng/elections/63f8bdd61315f62e77680d10?type=sen) | Historical LGA/ward/PU counts | Search snapshot cannot establish current totals or complete membership |
| 2023 Kano governorship IReV snapshot [4](https://www.inecelectionresults.ng/elections/6407da9ece35006e9215f34d/context/ward/lga/5f0f39954d89fc3a883de24f) | Snapshot showed 11,222 expected results | Historical reconciliation reference only; not dashboard data |
| NAN-derived 2022 Kano report [3](https://solacebase.com/2022/04/27/inec-approves-11222-polling-units-for-kano/) | Attributed statement: 484 wards, 44 LGAs, 11,222 PUs | Secondary historical report, not approved operating release |
| IReV explanation [1](https://www.vanguardngr.com/2026/10/what-is-irev-how-nigerians-can-view-election-results-online/) | Result-sheet viewing is distinct from formal collation/declaration | Secondary explanation; design independently keeps official publication separate and requires authoritative source approval |

Conflicting third-party totals were encountered and deliberately not used as operating facts. No current candidate/party list, senatorial mapping file, boundary polygon, PU coordinate or emergency number was supplied. D03–D05 and D11/D14 remain open.

The product's separation of reported/verified/disputed/pending and official publication is a design invariant from the user's requirements, not a claim that IReV itself declares winners.

## 3. Supabase platform references

| Topic and source | Observed provider behavior | Design consequence |
|---|---|---|
| RLS/grants [1](https://supabase.com/docs/guides/database/postgres/row-level-security) | Grants and policies are separate; exposed tables need RLS; default grants may exist; test allow/deny and assert target unchanged | Revoke/grant explicitly, force RLS, test every persona/table/operation |
| Private Storage [1](https://supabase.com/docs/guides/storage/buckets/fundamentals) | Private buckets use RLS; authenticated download or signed URL | No public evidence buckets |
| Signed URLs [2](https://supabase.com/docs/guides/storage/serving/downloads) | Temporary bearer access; individual revocation limitations; signing-key/CDN behavior | Short expiry, issuance audit, proxy for sensitive access, realistic revocation runbook |
| Storage schema [3](https://supabase.com/docs/guides/storage/schema/design) | Metadata in Postgres; object operations through Storage API; do not edit storage schema directly | Use APIs and independent custody records; metadata is not object backup |
| Realtime authorization [1](https://supabase.com/docs/guides/realtime/authorization) | Private channels and `realtime.messages` policies; connection policy caching; JWT renewal; RLS-filtered Postgres Changes | Minimal payloads, membership epoch, session revocation/rejoin and cross-zone tests |
| MFA [Supabase Auth MFA](https://supabase.com/docs/guides/auth/auth-mfa) | Enrollment/challenge/verification; `aal1`/`aal2`; enforcement belongs in app/API/RLS | Privileged AAL2 checks, not frontend-only MFA |
| Backups [Supabase platform backups](https://supabase.com/docs/guides/platform/backups) | Paid-plan daily backups; PITR option/compute prerequisite; PITR replaces daily; Storage bytes excluded | Separate object replication and isolated restore; no assumed five-minute RPO from daily backup |
| Queue workers [1](https://supabase.com/docs/guides/queues/consuming-messages-with-edge-functions) | Scheduled Edge Function can consume queue messages; visibility/retry behavior | Candidate outbox worker pattern, not a deployed queue |

Documentation can change. Recheck exact plan quotas, SDK upload/resume support, region availability, auth session defaults and pricing during implementation/procurement. No provider feature is considered verified in this project until exercised.

## 4. Privacy references and limits

The Nigeria Data Protection Act 2023 text was located through a [published PDF mirror](https://ndprcompliance.ng/wp-content/uploads/2023/09/Nigeria_Data_Protection_Act_2023.pdf). Search excerpts included the Commission's 72-hour notification provision for likely-risk breaches [1](https://ndprcompliance.ng/wp-content/uploads/2023/09/Nigeria_Data_Protection_Act_2023.pdf). Direct PDF fetch failed in the research tool, so the complete text was not independently parsed here. NDPC's own privacy policy illustrates purpose/lawful-basis and security/accountability concepts but is not the Act or legal advice [1](https://ndpc.gov.ng/our-data-privacy-policy/).

An attempted official NDPC PDF fetch failed; a KPMG search-result mirror subsequently returned 404. These failures are recorded rather than treated as full legal review. Counsel/controller must confirm current obligations, exemptions, DPO/major-controller status, transfers, breach process and retention before live processing. The blueprint makes no compliance certification.

## 5. npm registry compatibility snapshot

Queried `https://registry.npmjs.org/<package>/latest` on 2026-11-02. This is a registry observation, not an installed or tested dependency set.

| Package | Observed `latest` | Observed engine/peer note |
|---|---:|---|
| next | 16.4.3 | Node ≥20.9; React 19 supported in observed peer range |
| react / react-dom | 19.3.1 | Use compatible pair |
| typescript | 7.0.2 | Compatibility with chosen Next/lint/shadcn tooling not yet tested |
| tailwindcss | 4.3.3 | Component/tooling compatibility gate required |
| @supabase/supabase-js | 2.118.0 | Node ≥22 |
| @supabase/ssr | 0.12.7 | Session/cookie integration to test in Phase 2 |
| maplibre-gl | 6.16.0 | Node ≥16.14; browser/WebGL/device tests still required |
| zod | 4.6.7 | Shared schema integration to test |
| @tanstack/react-query | 5.105.1 | Remote state only; not durable offline authority |
| recharts | 3.10.1 | Lazy-load analytics bundle |
| vitest | 5.0.5 | Observed Node ^22.12 or ^24 or ≥26; align CI runtime |
| playwright | 1.64.1 | Browser/device installation required later |
| idb | 8.0.4 | Candidate IndexedDB wrapper, not yet selected by build test |
| pdfkit | 0.20.2 | Candidate PDF worker; font/accessibility/tagging assessment required |
| exceljs | 4.4.0 | Candidate XLSX worker; formula-injection controls required |

Phase 1 must use a pinned compatible lockfile and clean build/type/lint/test gate. “Latest” is not permission to adopt an untested toolchain or suppress errors. If TypeScript 7 compatibility blocks the foundation, record an explicit approved compatible-version exception and revisit it.

## 6. What was not established

No official current geography download, production load, device inventory, election date, provider budget, legal approval, penetration test, application benchmark, backup restore or deployment readiness was established. These remain decisions/phase gates, not hidden assumptions.

## 7. Document-validation execution

The standard-library validator initially found two broken numbered-heading anchors; they were corrected. Its final executed run passed 23 documents/116 local links and coverage of 22 blueprint sections, 85 conceptual entities, 49 routes, 14 phases and 12 mandatory scenarios. Python syntax compilation and `git diff --check` passed. A temporary Mermaid 12.2.0 parser environment validated all 11 diagram blocks; visual rendering and database behavior were not tested. The 18-page review PDF was generated and read back; representative pages were visually inspected and all pages passed a text-bound check. Temporary rendering libraries are not application dependencies. Exact scope and limitations are recorded in the [Phase 0 report](../../PHASE_COMPLETION_REPORTS/PHASE_0.md).
