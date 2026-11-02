# Kano Election Monitoring & Situation Room Platform

**Current stage: Phase 1 foundation preview — locally tested, awaiting review.**

A mobile-first engineering foundation for central command, Kano's three senatorial districts and authorized field observers. This is an independent observation platform, not an INEC voting, collation or declaration system.

## Explore the application

Use the live Arena preview, or run locally with Node **22.22.3** and npm **12.2.1**:

```bash
npm ci --strict-peer-deps
npm run dev -- --port 3000
```

- `/central/dashboard` — desktop command shell, readiness and unavailable-data states.
- `/zone/dashboard` — tablet-friendly senatorial coordination shell.
- `/field/home` — mobile observer desk and safety guidance.
- `/login` — honest access information; **authentication is not enabled**.
- `/api/health` — application-process health only, not database readiness.

The preview has no live election/personnel data, working submission actions, database, authentication, offline storage, evidence uploads or emergency dispatch. Unknown operational values are unavailable, not zero. The three zone names and 44-LGA mandate describe scope, not imported geography.

## Verification commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:bundle
npx playwright install --with-deps chromium
npm run test:e2e        # fresh production server on port 3001
npm run audit:gate     # high/critical gate; full audit still has moderate dev findings
python scripts/scan_secrets.py
python scripts/validate_docs.py
```

See the [Phase 1 report](PHASE_COMPLETION_REPORTS/PHASE_1.md) for actual executed results and limitations. CI is defined in `docs/phase-1/ci/foundation.yml`; remote execution status is recorded there, not assumed from local tests. [Version exceptions](docs/phase-1/VERSION_DECISION.md) include TypeScript 6.0.3 and ESLint 9.39.5 for actual toolchain compatibility.

## Phase 1 documentation

- [Design system/tokens](docs/phase-1/DESIGN_SYSTEM.md)
- [Environment/security boundaries](docs/phase-1/ENVIRONMENT.md)
- [Accessibility/responsive report](docs/phase-1/ACCESSIBILITY_REPORT.md)
- [Bundle baseline](docs/phase-1/bundle-baseline.json)
- [Implementation status](IMPLEMENTATION_STATUS.md) · [Known issues](KNOWN_ISSUES.md) · [Changelog](CHANGELOG.md)

## Approved architecture / Phase 0 package

- [Phase 0 Blueprint PDF](PHASE_0_BLUEPRINT.pdf) — 18-page controlled review document.
- [Editable blueprint](PHASE_0_BLUEPRINT.md) — 22 engineering areas.
- [Product requirements](docs/phase-0/PRD.md) · [Roadmap/acceptance gates](docs/phase-0/ROADMAP.md)
- [Architecture](ARCHITECTURE.md) · [Database model](DATABASE_SCHEMA.md) · [ERD](docs/phase-0/DATABASE_ERD.md)
- [Role matrix](docs/phase-0/ROLE_PERMISSION_MATRIX.md) · [Security/RLS](SECURITY.md) · [API contracts](API_DOCUMENTATION.md)
- [User journeys](docs/phase-0/USER_JOURNEYS.md) · [Offline/evidence](docs/phase-0/OFFLINE_AND_EVIDENCE.md) · [GIS](docs/phase-0/GIS_ARCHITECTURE.md)
- [Testing](TESTING.md) · [Deployment/recovery](DEPLOYMENT.md)
- [Decision register](docs/phase-0/DECISION_REGISTER.md) · [Research limitations](docs/phase-0/RESEARCH_NOTES.md) · [Phase 0 report](PHASE_COMPLETION_REPORTS/PHASE_0.md)

## Next decision

Review Phase 1 before authorizing **Phase 2: database, authentication and database-enforced RLS**. No Phase 2 implementation is included. Official geography/election configuration, controller/privacy approval, emergency policy, provider budgets and recovery ownership remain unresolved. No legal compliance, production security, physical-device accessibility or performance certification is claimed.

Never import real personal/electoral data into tests or deploy for live operations before the relevant acceptance gates pass. Preserve original evidence, separate observations from official results, and do not invent polling-unit identifiers or coordinates.
