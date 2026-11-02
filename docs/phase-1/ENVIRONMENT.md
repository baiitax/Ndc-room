# Phase 1 — Environment, runtime and security boundaries

## Reproducible local setup

Use Node **22.22.3** (`.nvmrc`) and npm **12.2.1** (`packageManager`). npm 10/11 generated orphan optional Sharp WASM entries on this Linux x64 environment; npm 12.2.1 regenerated a lockfile that passes a strict clean install and full tree check here. This is an observed toolchain issue, not a change to Next's image support.

```bash
nvm use                 # if nvm is installed
npm install --global npm@12.2.1
npm ci --strict-peer-deps
npm run dev -- --port 3000
```

No environment file or credentials are required for this public foundation preview. `.env.example` documents the two optional server settings. Never put secrets in `NEXT_PUBLIC_*` variables.

| Variable | Scope | Behavior |
|---|---|---|
| `APP_ENV` | Server | `development`, `staging`, `production`; defaults to development; invalid values fail validation |
| `APP_ALLOWED_ORIGINS` | Server | Comma-separated exact hostnames, optionally ports; no scheme, path, wildcard or empty entry |
| `NEXT_PUBLIC_BUILD_LABEL` | Public build metadata | Optional nonsecret release label; defaults to `local`; do not use a person's name, token or sensitive deployment detail |
| `E2E_PORT` | Test process | Production-browser test port, default 3001; separate from preview port 3000 |
| `CHROMIUM_EXECUTABLE_PATH` | Test process | Optional externally installed Chromium executable; CI normally uses Playwright's matching browser |

`NEXT_PUBLIC_BUILD_LABEL` is read directly by the health route; its name is public by convention, not a secret store. No Supabase environment variables are consumed in Phase 1. Server environment parsing lives in `src/lib/environment.ts`; no validated server object is serialized into client components. The allowlist is a configuration contract for Phase 2 server actions, **not a claim that request-origin enforcement is already active**. There are no mutation endpoints/actions to protect in this phase.

## Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:bundle
npx playwright install --with-deps chromium  # platform permitting
npm run test:e2e                             # starts an isolated production server
npm run audit:gate                          # fails on high/critical findings
npm audit                                  # includes lower-severity findings
python scripts/scan_secrets.py
python scripts/validate_docs.py
```

`npm run check` runs lint/typecheck/unit/build. Browser checks deliberately run against a fresh production build, not the hot-reloading dev server. Playwright launches its own server at 3001 and does not reuse the live preview. Build artifacts, reports, traces, environment files and dependencies are ignored by Git.

## Health and logging

`GET /api/health` is dynamic, no-store and reports **application process only**. It explicitly marks database/authentication as not configured and operational modules as not enabled. It is not a Supabase, Storage, Realtime, emergency-delivery or disaster-recovery probe. It exposes only phase, environment and nonsecret build label.

`src/lib/logger.ts` provides a structured JSON contract with timestamp, level, event, optional request ID and code. It deliberately accepts no arbitrary payload. No operational logging pipeline or monitoring provider is connected. Never pass credentials, report bodies, evidence, precise location or personal data to this logger.

## Browser security policy

- Self-hosted scripts/fonts/styles; no third-party runtime assets.
- `nosniff`, strict referrer policy and disabled camera/microphone/geolocation permissions.
- Production `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `object-src 'none'`, restricted base/form targets and HTTPS upgrade.
- Development permits Arena iframe embedding and HMR. Normal production denies framing. The Arena live preview therefore runs the development server; browser acceptance tests run an independent production build. Development origin exceptions are exact local test hosts plus Arena's `*.e2b.app`/`*.e2b.dev` preview suffixes. The application origin allowlist remains exact and separate.
- CSP currently permits inline scripts/styles and development eval. **This is not a production-hardened nonce CSP.** Before authenticated/sensitive content in Phase 2, implement/test request nonces or hashes, remove the inline-script exception where feasible, restrict development eval and verify production framing/HSTS at the actual edge. Do not describe the current header policy as a completed security audit.

## Route protection contract

`src/lib/route-access.ts` defines a tested future decision contract: unauthenticated → login with return destination; inactive membership, wrong workspace/zone, insufficient MFA or missing permission → deny. It is a pure function, **not active middleware or a database policy**. Current shells contain no sensitive records and are intentionally publicly explorable. Phase 2 must enforce sessions and scope on the server and in PostgreSQL RLS; URL hiding alone is never authorization.

## Deployment boundary

The preview is an Arena-hosted process, not a Vercel deployment. CI is defined in `docs/phase-1/ci/foundation.yml`; a local workflow definition is not evidence of a remote GitHub run. Production deployment, custom domain/TLS/HSTS, provider budgets, Supabase isolation, secrets and recovery remain later approval gates. No production data is used by tests.

## CI activation blocker

The GitHub App used by this session cannot create/update GitHub Actions workflow files. The push failed explicitly with a workflow-permission error; no bypass was attempted. The complete workflow is stored at `docs/phase-1/ci/foundation.yml`. An authorized maintainer can copy it to `.github/workflows/foundation.yml` and run it, or reconnect GitHub with workflow permission. Until a remote run completes, CI remains BLOCKED and Phase 1 cannot claim its CI-green exit criterion.
