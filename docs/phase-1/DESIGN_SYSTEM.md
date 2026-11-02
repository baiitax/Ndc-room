# Phase 1 — Design system and implementation boundary

Status: foundation implementation; operational modules remain PLANNED. See [executed verification](ACCESSIBILITY_REPORT.md) and [Phase 1 report](../../PHASE_COMPLETION_REPORTS/PHASE_1.md).

## Visual language

Navy/charcoal command surfaces, restrained teal actions, light/dark semantic themes, self-hosted Inter Variable and Lucide icons. Glass is limited to the noncritical header; primary content and dialogs are solid. The central hero uses a decorative border treatment, not a fabricated map or election visualization. No stock election photography, live-looking activity feed or invented operational counts are used.

Tokens are implemented in `src/app/globals.css` and mapped to Tailwind 4 through `@theme inline`. Components consume semantic names rather than hardcoded operational status colors.

| Token | Light | Dark | Purpose |
|---|---|---|---|
| background | `#F3F6F9` | `#0B1623` | Canvas |
| card | `#FFFFFF` | `#111F30` | Solid content |
| foreground | `#172B40` | `#EDF3F8` | Main text |
| muted-foreground | `#526174` | `#B7C5D4` | Supporting text |
| primary | `#0F766E` | `#5EEAD4` | Main action; paired with contrasting foreground |
| border | `#D7E1E9` | `#2A3D51` | Boundaries, not the sole state indicator |
| success | `#166534` | `#86EFAC` | Confirmed state with a written label |
| warning | `#92400E` | `#FCD34D` | Attention with a written label |
| destructive | `#B42318` | `#FCA5A5` | Emergency/destructive semantics |
| ring | `#2563EB` | `#93C5FD` | Visible keyboard focus |

The dark card/border values refine the Phase 0 proposal; [architecture](../../ARCHITECTURE.md) records the implementation decision. Status colors must be rechecked when placed on new surface combinations. Color alone never communicates status.

## Components

`src/components/ui/` contains locally maintained shadcn-style components built on Radix Dialog, Dropdown Menu, Tabs and Slot, CVA and Tailwind Merge: Button, Badge, Card, Dialog, Sheet, Dropdown Menu, Input, Skeleton and Tabs. `components.json` records the style/alias convention. These are source components, not a claim that a remote shadcn registry was executed. A Tooltip primitive is not implemented yet; inaccessible hover-only explanations are not used for essential information.

- Buttons: native button semantics unless explicitly rendering a link; minimum 44px target; disabled actions cannot invoke handlers.
- Dialogs/sheets: named/described, focus containment, Escape dismissal and trigger focus restoration; mobile navigation explicitly closes after route selection.
- Tabs: keyboard arrow navigation and accessible selected state; district labels are preview labels, not authorization scopes.
- Input: 48px minimum height and 16px type; only navigation search collects input in this phase.
- Skeleton: decorative, hidden from assistive technology, accompanied by a textual loading status.
- Empty state: explains missing connection/records without representing unknown values as zero.

## Responsive shells

- Central: desktop collapsible sidebar, grouped module navigation, header search, theme/account/notification controls and a readiness/incident rail. The rail explicitly says services are disconnected.
- Senatorial: tablet-friendly district tabs, response/personnel panels and larger controls. Kano North/Central/South are mandated structure labels; no zone records or identities are supplied.
- Field: mobile bottom navigation, assignment placeholder with unavailable values, large report/result/incident/check-in navigation, safety guidance and explicit lack of offline storage.
- Shared: public access-information/legal pages, account destinations, unavailable states, root error/retry and not-found routes.

The 40 module shells and four account shells derive from a single route registry. They show capability boundaries, required future permission and design workflow rather than fake forms, records or success states. This is intentional Phase 1 scope, not operational module completion.

## Theme and device state

The product default is the navy command theme. Explicit light/dark/system choices are persisted only as a nonessential device preference; selecting system follows the device. An inline prehydration script prevents the initial theme flash; system changes are observed. Local storage denial does not prevent theme changes for the current document. Sidebar state uses an external-store subscription without hydration-dependent initial markup. Connectivity listens to browser online/offline events and is explicitly **not** a server/database/Realtime health indicator.

No service worker, offline database, background sync, geolocation request, camera/microphone access, authentication, analytics tracker or remote font request is implemented. The UI states those boundaries. Reduced motion removes nonessential animation; reduced transparency gets a solid header fallback.

## Honesty and future acceptance

“3 senatorial zones / 44 LGAs in mandate” describes scope, not imported geography or live coverage. All operational metrics render an em dash with an unavailable accessible label. No incident count, agent identity, assignment, election date, result or alert is invented. Emergency guidance says sending is unavailable and the platform is not a substitute for direct emergency services.

Legal pages are visibly unapproved drafts. Hausa translation, real screen-reader/user testing, low-power device measurements, authenticated-state design and all operational workflows remain later gates. Do not treat an attractive shell as evidence of a working election operation.

## Captured UI

- [Central command, dark](screenshots/central-dark.png)
- [Central command, light](screenshots/central-light.png)
- [Senatorial tablet shell](screenshots/zone-tablet.png)
- [Field mobile shell](screenshots/field-mobile.png)

These are local production-build screenshots, not live election data.
