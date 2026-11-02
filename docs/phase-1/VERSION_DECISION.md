# Phase 1 — Compatible version decision (D31)

Decision date: 2026-11-02. Status: selected and locally exercised; review at Phase 2 entry. Registry metadata and installed lockfile are the evidence, not an assumption that every `latest` package works together.

## Selected direct dependencies

| Package | Exact version | Rationale |
|---|---:|---|
| next / eslint-config-next | 16.4.3 | Current stable App Router foundation; build and production browser checks |
| react / react-dom | 19.3.1 | Compatible matched pair |
| typescript | **6.0.3** | Compatible exception: current typescript-eslint 8.72.1 declares `>=4.8.4 <6.1.0`; registry latest TypeScript 7.0.2 is outside that range |
| tailwindcss / @tailwindcss/postcss | 4.3.3 | Tailwind 4 CSS tokens; local shadcn-style source components |
| eslint | **9.39.5** | Next's bundled React/import/JSX-a11y plugins declare ESLint ≤9; initial ESLint 10.14.0 produced three peer overrides and an invalid tree |
| Radix Dialog / Dropdown / Tabs / Slot | 1.3.1 / 2.2.1 / 1.2.1 / 1.5.0 | Accessible primitive behavior, local component styling |
| Lucide React | 1.66.0 | Self-hosted/tree-shaken SVG icons |
| CVA / clsx / tailwind-merge | 0.7.1 / 2.1.1 / 3.7.0 | Typed variants and class composition |
| Zod | 4.6.7 | Server environment contract; domain forms deferred |
| Inter Variable | 5.2.8 | Self-hosted font, no runtime Google Fonts request |
| Vitest / Vite / plugin-react | 5.0.5 / 8.3.5 / 6.1.2 | Unit/component test toolchain |
| Testing Library React / jest-dom / user-event | 16.3.3 / 7.0.1 / 14.6.8 | Semantic component interactions |
| jsdom | 30.1.3 | Component test DOM |
| Playwright / axe | 1.64.1 / 4.14.0 | Production browser/viewport/accessibility checks |
| Node / npm | 22.22.3 / 12.2.1 | Reproducible runtime; npm 12 avoids observed optional-lock orphan issue |

Supabase clients, React Hook Form, TanStack Query, Recharts, MapLibre, IndexedDB and export libraries are intentionally not installed before their phase needs exist. Adding unused SDKs would not implement their features.

## Exceptions and residual findings

1. **TypeScript 6.0.3:** do not upgrade to 7 until the parser/plugin/Next toolchain explicitly supports it and strict checks pass. Review at Phase 2 entry; no `ignoreBuildErrors`, blanket rule disabling or `any` workaround is used.
2. **ESLint 9.39.5:** npm labels this maintenance version deprecated. It is selected for actual peer alignment with Next 16.4.3's plugins. Revisit when those plugins support 10; do not use `--force` or npm's suggested ancient downgrade. This exception expires at Phase 2 dependency review.
3. **Development dependency audit:** `npm audit --omit=dev` reports zero findings. Full audit reports 16 moderate affected package entries tracing to the `minimatch <11.0.1` glob-amplification advisory in lint tooling. No high/critical finding is reported. Do not force a breaking/minimatch-major override that changes CommonJS/default-export contracts without tests. Track as K25; review upstream fixes at Phase 2 entry. Lint processes trusted repository configuration, not public glob input.
4. **npm lock generation:** npm 10.9.8/11.21.1 left optional `@img/sharp-wasm32` and `@emnapi/runtime` entries extraneous on this platform. npm 12.2.1 regenerated the lock; strict `npm ci` and `npm ls` pass without those orphans. Pin npm in CI rather than masking the failed tree check.
5. **Local browser runtime:** sandbox browser checks used externally installed `@sparticuz/chromium` 143.0.4 with its bundled NSS/NSPR libraries, outside application dependencies. This is Chromium 143, not Playwright's bundled browser revision. CI installs Playwright's matching Chromium. Physical mobile devices and Firefox/WebKit are not represented by the three Chromium viewport projects.

## Acceptance evidence

The [Phase 1 report](../../PHASE_COMPLETION_REPORTS/PHASE_1.md) records exact executed commands/results. A successful install/build with documented maintenance/audit exceptions is not a claim of zero dependency advisories or future compatibility. Re-run the gate on every toolchain change.
