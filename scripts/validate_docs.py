#!/usr/bin/env python3
"""Validate Phase 0 documentation structure and cross-references.

Standard-library only. This is not an application, migration, RLS or security test.
Run from any directory: python scripts/validate_docs.py
"""
from __future__ import annotations

import os
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = [
    "README.md", "PHASE_0_BLUEPRINT.md", "ARCHITECTURE.md", "DATABASE_SCHEMA.md",
    "SECURITY.md", "API_DOCUMENTATION.md", "TESTING.md", "DEPLOYMENT.md",
    "IMPLEMENTATION_STATUS.md", "KNOWN_ISSUES.md", "CHANGELOG.md",
    "PHASE_COMPLETION_REPORTS/PHASE_0.md", "PHASE_COMPLETION_REPORTS/PHASE_1.md",
    "docs/phase-1/VERSION_DECISION.md", "docs/phase-1/DESIGN_SYSTEM.md",
    "docs/phase-1/ENVIRONMENT.md", "docs/phase-1/ACCESSIBILITY_REPORT.md",
    "docs/phase-0/PRD.md", "docs/phase-0/MODULE_DEPENDENCY_MAP.md",
    "docs/phase-0/GEOGRAPHY_DATA_CONTRACT.md", "docs/phase-0/ROLE_PERMISSION_MATRIX.md",
    "docs/phase-0/DATABASE_ERD.md", "docs/phase-0/USER_JOURNEYS.md",
    "docs/phase-0/OFFLINE_AND_EVIDENCE.md", "docs/phase-0/GIS_ARCHITECTURE.md",
    "docs/phase-0/ROADMAP.md", "docs/phase-0/DECISION_REGISTER.md",
    "docs/phase-0/RESEARCH_NOTES.md",
]
MINIMUM_ENTITIES = """
organizations election_cycles election_types senatorial_districts
local_government_areas wards polling_units organizational_units
profiles roles permissions role_permissions user_roles user_assignments
agent_profiles staff_profiles user_sessions user_devices
agent_assignments assignment_history agent_checkins agent_availability
situation_reports situation_report_versions report_categories report_attachments
report_verifications election_configurations candidates political_parties
result_submissions result_entries result_verifications result_discrepancies
incidents incident_categories incident_assignments incident_updates
incident_escalations incident_resolutions conversations conversation_members
messages message_attachments message_receipts emergency_alerts
emergency_acknowledgements emergency_responses evidence_files evidence_hashes
evidence_access_logs evidence_annotations notifications notification_deliveries
audit_logs security_events system_settings backup_records export_jobs
geographical_boundaries geographical_features polling_unit_coordinates
""".split()
ROUTES = [
    "/login", "/forgot-password", "/reset-password", "/privacy", "/terms",
    *[f"/central/{x}" for x in "dashboard zones agents staff reports results incidents emergency messages gis evidence analytics audit security backups settings".split()],
    *[f"/zone/{x}" for x in "dashboard agents assignments reports results incidents emergency messages gis evidence analytics staff".split()],
    *[f"/field/{x}" for x in "home assignment checkin report results incident media messages alerts history profile sync".split()],
    *[f"/admin/{x}" for x in "profile notifications security activity".split()],
]


def without_fences(text: str) -> str:
    return re.sub(r"```[^\n]*\n.*?```", "", text, flags=re.S)


def anchors(text: str) -> set[str]:
    counts: Counter[str] = Counter()
    result: set[str] = set()
    for match in re.finditer(r"^#{1,6}\s+(.+?)\s*$", without_fences(text), re.M):
        heading = re.sub(r"\s+#+\s*$", "", match.group(1))
        heading = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", heading)
        slug = re.sub(r"[^\w\- ]", "", heading.lower()).replace(" ", "-")
        count = counts[slug]
        result.add(slug if not count else f"{slug}-{count}")
        counts[slug] += 1
    return result


def main() -> int:
    errors: list[str] = []
    for name in REQUIRED_FILES:
        if not (ROOT / name).is_file():
            errors.append(f"Missing required document: {name}")
    if errors:
        print("\n".join(errors))
        return 1

    markdown = sorted(set(REQUIRED_FILES) | {"scripts/validate_docs.py"})
    # Include any future controlled Markdown documents in link validation.
    markdown_paths: list[Path] = []
    excluded = {".git", "node_modules", ".next", "out", "build", "coverage", "playwright-report", "test-results", "__pycache__"}
    for directory, subdirectories, filenames in os.walk(ROOT):
        subdirectories[:] = sorted(name for name in subdirectories if name not in excluded)
        markdown_paths.extend(Path(directory) / name for name in filenames if name.endswith(".md"))
    markdown = sorted(p.relative_to(ROOT).as_posix() for p in markdown_paths)
    texts = {name: (ROOT / name).read_text(encoding="utf-8") for name in markdown}
    anchor_map = {name: anchors(text) for name, text in texts.items()}
    links = 0
    for name, text in texts.items():
        if text.count("```") % 2:
            errors.append(f"Unbalanced code fences: {name}")
        for target in re.findall(r"(?<!!)\[[^\]]*\]\(([^)]+)\)", without_fences(text)):
            parsed = urlparse(target.strip("<>"))
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            destination = (ROOT / Path(name).parent / unquote(parsed.path)).resolve()
            links += 1
            try:
                relative = destination.relative_to(ROOT).as_posix()
            except ValueError:
                errors.append(f"Link escapes repository: {name} -> {target}")
                continue
            if not destination.exists():
                errors.append(f"Broken local link: {name} -> {target}")
            elif parsed.fragment and destination.suffix == ".md":
                if unquote(parsed.fragment) not in anchor_map.get(relative, set()):
                    errors.append(f"Missing heading anchor: {name} -> {target}")

    pdf = ROOT / "PHASE_0_BLUEPRINT.pdf"
    if not pdf.is_file() or not pdf.read_bytes().startswith(b"%PDF-"):
        errors.append("Missing or invalid Phase 0 review PDF")

    blueprint = texts["PHASE_0_BLUEPRINT.md"]
    sections = {int(x) for x in re.findall(r"^## (\d+)\.", blueprint, re.M)}
    if sections != set(range(1, 23)):
        errors.append(f"Blueprint must contain sections 1–22; found {sorted(sections)}")

    dictionary = texts["DATABASE_SCHEMA.md"]
    tables = set(re.findall(r"^\| `([a-z][a-z0-9_]+)` \|", dictionary, re.M))
    missing = set(MINIMUM_ENTITIES) - tables
    if missing:
        errors.append(f"Minimum entities missing from dictionary: {sorted(missing)}")
    erd = texts["docs/phase-0/DATABASE_ERD.md"]
    erd_text = "\n".join(re.findall(r"```mermaid\n(.*?)```", erd, re.S))
    nodes = set(re.findall(r"\b([A-Z][A-Z0-9_]+)\b", erd_text))
    missing_erd = {t.upper() for t in tables} - nodes
    if missing_erd:
        errors.append(f"Dictionary entities absent from ERD: {sorted(missing_erd)}")
    missing_dict = {n.lower() for n in nodes} - tables - {"auth_users", "pk", "fk", "uk", "pk_fk"}
    if missing_dict:
        errors.append(f"ERD entities absent from dictionary: {sorted(missing_dict)}")

    route_text = texts["docs/phase-0/MODULE_DEPENDENCY_MAP.md"]
    absent_routes = [r for r in ROUTES if f"`{r}`" not in route_text]
    if absent_routes:
        errors.append(f"Missing explicit route inventory entries: {absent_routes}")
    roadmap = texts["docs/phase-0/ROADMAP.md"]
    phases = {int(x) for x in re.findall(r"^## Phase (\d+) ", roadmap, re.M)}
    if phases != set(range(14)):
        errors.append(f"Roadmap must contain Phases 0–13; found {sorted(phases)}")
    testing = texts["TESTING.md"]
    scenario_section = testing.split("## 5. Twelve explicitly required scenarios", 1)[-1].split("## 6.", 1)[0]
    scenario_ids = {int(x) for x in re.findall(r"^\| (\d+) \|", scenario_section, re.M)}
    if scenario_ids != set(range(1, 13)):
        errors.append(f"Missing mandatory test scenarios: {sorted(set(range(1,13)) - scenario_ids)}")

    print(f"Documents checked: {len(markdown)}")
    print(f"Local links checked: {links}")
    print(f"Blueprint sections: {len(sections)}/22")
    print(f"Conceptual entities: {len(tables)}; minimum brief entities covered: {len(MINIMUM_ENTITIES)}")
    print(f"Explicit routes: {len(ROUTES) - len(absent_routes)}/{len(ROUTES)}")
    print(f"Phase gates: {len(phases)}/14; mandatory test scenarios: {len(scenario_ids)}/12")
    if errors:
        print(f"\nFAILED: {len(errors)} documentation issue(s)")
        print("\n".join(f"- {e}" for e in errors))
        return 1
    print("\nPASSED: documentation structure and local-reference checks only.")
    print("No application, database, RLS, security, accessibility, performance or deployment test was executed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
