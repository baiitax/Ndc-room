# Electoral Geography Acquisition and Import Contract

Status: **ARCHITECTURALLY DEFINED; authoritative operating release BLOCKED pending supply/approval** · 2026-11-02

## 1. Authority and non-fabrication rule

Use an INEC-approved release for the selected election. Keep official State/LGA/Registration Area/PU codes as text, separate from internal UUIDs. The official directory explains the hierarchical code format and links to the CVR locator: [INEC directory](https://inecnigeria.org/polling-units/). The locator explicitly warns that directions are approximate: [INEC locator](https://cvr.inecnigeria.org/pu).

No polling-unit names, identifiers, coordinates or boundaries are created by this project. Synthetic fixtures are isolated in tests and visibly synthetic; they never enter production reference tables. A third-party scrape may be a reconciliation lead, not an automatically approved authority.

Historical reference: a 2022 report attributed to INEC Kano cited 44 LGAs, 484 wards and 11,222 PUs [3](https://solacebase.com/2022/04/27/inec-approves-11222-polling-units-for-kano/). IReV's 2023 Kano governorship snapshot showed 11,222 expected results [4](https://www.inecelectionresults.ng/elections/6407da9ece35006e9215f34d/context/ward/lga/5f0f39954d89fc3a883de24f). Search snapshots of North/South senatorial pages also contain historical LGA groupings [2](https://www.inecelectionresults.ng/elections/63f8bdaf1315f62e7767f841?type=sen) [1](https://www.inecelectionresults.ng/elections/63f8bdd61315f62e77680d10?type=sen). These are not a machine-readable current roster. Dynamic IReV pages did not yield a complete dataset during this review; no counts or memberships were imported.

## 2. Required source package

| Artifact | Required metadata |
|---|---|
| Senatorial district roster | Official district name/code, state, source/effective date, issuing office |
| LGA roster and district membership | All 44 LGAs, official LGA code, approved district mapping for the release |
| Ward/RA roster | Official LGA parent, ward code/name, effective date |
| PU roster | Official ward parent, PU code/name/location description, status and release identifier |
| Boundary geometries | Issuing authority, source scale/CRS, license, geometry type, release date and validation report |
| Optional coordinates | Source, capture/survey method if supplied, CRS, accuracy, collection time and approval; no inferred precision |
| Reconciliation statement | Expected totals by parent, differences from prior release, unresolved records and operational approval |

If INEC cannot supply a current bulk extract, obtain written direction on authoritative acquisition. A manual/assisted locator extraction requires permission, terms/rate-limit review, sample verification and documented provenance. Do not assume a public endpoint is a supported bulk API.

## 3. Release and identity model

`geography_releases` is immutable after approval. District, LGA, ward and PU rows belong to a release. Unique natural keys include release plus official code; names are not keys. Spelling, transliteration, whitespace and case normalization are stored separately from raw source values. Leading zeros never become integers.

Each child has a same-release composite foreign key to its parent. An election configuration pins one approved release. Reassignment or a new geography release does not rewrite historical submissions. A cross-release code mapping requires an explicit approved migration table/record, not fuzzy name matching.

Central command is an organizational unit, not a district. District-to-LGA membership is a property of the approved electoral release, not a hardcoded frontend array.

## 4. Import pipeline

1. Authenticate importer and require `geography.import`; reserve import batch and upload source to private import storage.
2. Record source URI/agency/contact, release/effective date, purpose, file hashes, byte size, schema version and importer.
3. Parse in an isolated worker with row/size limits; preserve raw row and source line/feature ID.
4. Validate encoding, required columns, code format, duplicate natural keys, parent existence, expected hierarchy and allowed state/district scope.
5. Reconcile counts by LGA/ward against the signed source manifest. The number 44 is a requested coverage check, not a substitute for current official evidence.
6. Validate geometry CRS/transform, ring orientation/closure, self-intersections, multipolygon handling and plausible state extent. A point inside a polygon is a consistency check, not proof of either source.
7. Quarantine errors/warnings with record-level reasons. No partial release silently becomes operational.
8. Reviewer with `geography.approve` compares sample source records and reconciliation; approves or rejects with reason.
9. Publish immutable release reference data and derived authorized map tiles. Record audit and cache version.
10. Pin approved election configuration; monitor later source amendments as a new release.

Imports are idempotent by source hash/schema/release. Retry does not duplicate rows. Rollback is allowed only before use; after use, supersede rather than delete history.

## 5. Coordinate and boundary policy

- Missing coordinate: null, “coordinate unavailable,” list/description available; never place at LGA centroid and label as PU.
- Approximate locator coordinate: retain approximate qualifier and source; do not use for automated misconduct or assignment-distance decisions.
- Agent GPS: separate consented checkin observation, never merged into official PU coordinates.
- Boundary source absent: no invented polygons; show approved boundary-only layers that exist and a clear unavailable-layer state.
- Public/static tiles may contain approved non-sensitive geography only. Operational points come from scoped live queries.
- Spatial reference: store EPSG:4326 longitude/latitude in PostGIS; transform area/distance calculations to an appropriate projected/measurement method.

## 6. Acceptance tests

- Reject duplicate official codes, missing parents, cross-release parents and numeric coercion.
- Preserve all source rows and quarantined errors; repeat import yields one release/batch result.
- Unauthorized import/approval and cross-organization release reads fail.
- Every operational PU resolves to exactly one approved ward→LGA→district chain for its election.
- Null/approximate coordinates remain visibly qualified; no fabricated map marker.
- District users can read only authorized release records; map/list/export scope matches.
- Source hashes, approver and release pin can be reproduced in an audit package.

## 7. Outstanding inputs

Current official machine-readable roster; approved district mapping; boundary source/license; coordinate permission/accuracy; election/release date; geography approver; acceptable reconciliation tolerances. These are tracked in [DECISION_REGISTER.md](DECISION_REGISTER.md). Until resolved, implementation may build the importer with synthetic test fixtures, but live geography acceptance remains blocked.
