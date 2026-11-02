# GIS and Geographical Intelligence Architecture

Status: **ARCHITECTURALLY DEFINED; approved geography/coordinates/boundaries pending** · 2026-11-02

## 1. Data authority

PostGIS is the spatial authority for approved boundaries and sourced coordinates. MapLibre renders authorized data; it does not define geography. INEC's locator describes directions as approximate, so coordinates cannot be treated as surveyed truth without provenance [INEC locator](https://cvr.inecnigeria.org/pu). No PU marker, boundary or district membership is fabricated.

Election configuration pins a geography release. District/LGA/ward/PU relationships come from the approved roster, not a point-in-polygon guess. Source package and import validation are defined in [GEOGRAPHY_DATA_CONTRACT.md](GEOGRAPHY_DATA_CONTRACT.md).

## 2. Spatial model

- Store longitude/latitude in `geometry(Point,4326)`; boundaries in validated Polygon/MultiPolygon 4326.
- GiST indexes on points/boundaries; B-tree indexes on release/election/district/status/time.
- Transform to an appropriate local projected CRS or use geography-based measurement for distance/area; do not interpret degrees as metres.
- Optional PU coordinate records retain source, accuracy, approximate flag and approval. Agent checkin points remain separate consented events.
- Boundary table uses exactly-one typed entity FK; no unchecked polymorphic entity IDs.
- Missing coordinates produce an accessible list row with official description and “coordinate unavailable,” not a centroid marker.

## 3. Rendering and delivery

```text
Approved release → validation → generalized geometry derivatives
                              ├── non-sensitive static boundary tiles/GeoJSON
                              └── attribution/version manifest
Operational DB + RLS → scoped feature/cluster API → MapLibre layers
                                      └── accessible paginated list
```

MapLibre and styles/fonts load only on GIS routes. Prefer self-hosted glyphs/sprites and approved tiles. External tile providers require licensing, privacy, availability and cost approval; no operational query strings or personal data sent to a tile vendor. Boundary-only mode must work without a commercial basemap.

Static artifacts contain approved geography only, never agent positions, incidents or result status. Generate new artifacts per release; cache by immutable version. Sensitive operational layers are fetched through authorized APIs with bounded bbox/zoom/time filters.

At low zoom, return district/LGA aggregates or server clusters. At high zoom, return bounded PU features. Cluster counts must be scope-aware; a cluster cannot leak the existence of restricted records. Use supercluster/client clustering only on already-authorized bounded data; otherwise aggregate in PostGIS. Detail/evidence loads on selection.

## 4. Layers and semantics

| Layer | Source | Access / label |
|---|---|---|
| State/district/LGA/ward boundaries | Approved release geometry | Geography scope; source/version visible |
| PU locations | Approved optional coordinates | Assignment/command scope; approximate/null qualifier |
| Assignments/coverage | Assignment + election configuration | Own or scoped command; assigned vs observed distinguished |
| Checkins | Explicit consented checkin events | Precise location requires separate permission; no continuous tracks |
| Reports | Received report versions | Scoped module read; review-state colors plus text |
| Incidents | Authorized incident projection | Severity/state; confidential source omitted |
| Results | Observation review state | Not vote-share or winner map unless explicitly approved official source |
| Coverage heatmap | Observed/assigned PU ratios | Observation coverage, not voter support or population density |

Filters: election/contest, district/LGA/ward, time window, report/review state, incident severity and layer. Filter options are authorized. Date semantics state whether observation time or receipt time is used. Map popup shows reference, scope, status, freshness and permitted links; no raw source identity or signed evidence URL in a shared style layer.

## 5. Authorization and privacy

GIS API, list alternative, popups, search, exports and Realtime invalidations use the same permission predicates. District commanders cannot request another district by changing bbox or IDs. Agents see own assignment, not other agents' locations. Auditors get approved aggregates unless specifically authorized.

Precise checkin location is purpose-bound and retained only under policy. Default command coverage can use PU assignment/status without showing a person's GPS. Location consent/denial is transparent. No geofencing inference of misconduct from approximate coordinates.

## 6. Offline and accessibility

Cache only authorized non-sensitive reference geometry for the active assignment/release where policy permits. Operational map data may be stale; show `asOf` and offline state. Do not cache precise positions or evidence in public tiles/HTTP cache. List/description remains usable without WebGL; detect unsupported MapLibre/WebGL and offer the list.

Keyboard-accessible layer/filter controls, textual status, contrast-safe map legends, non-color markers and screen-reader list alternative. Popups are dismissible and focus-managed. Reduced motion disables animated fly-to. Touch targets remain usable on tablets.

## 7. Performance and acceptance

Measure feature counts, payload bytes, query time, tile size and frame rate on target devices. Proposed initial bound: aggregated low-zoom response and at most a configured few thousand authorized high-zoom features; exact cap set by benchmark, not a silent truncation. If truncated, say so and offer narrower filters/list.

Acceptance: approved source/version; valid geometry; no invented/null replacement coordinates; district scope enforced; layer filters correct; cluster totals reconcile; missing-coordinate list works; no sensitive static tiles; map/list/export parity; mobile/WebGL fallback; measured load. No GIS performance or accuracy claim is made in Phase 0.
