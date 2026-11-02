#!/usr/bin/env python3
"""Conservative source secret scan; not a replacement for history/independent review."""
from pathlib import Path
import re
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
files = subprocess.check_output(["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"], cwd=root).decode().split("\0")
patterns = {
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "Supabase secret/service key assignment": re.compile(r"(?:SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY)\s*=\s*['\"]?[A-Za-z0-9_.-]{16,}"),
    "provider token": re.compile(r"\b(?:ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk_live_[A-Za-z0-9]{20,})\b"),
    "public Supabase secret reference": re.compile(r"NEXT_PUBLIC_(?:SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY|SECRET|PASSWORD|TOKEN)\s*="),
}
findings = []
for name in files:
    if not name or name == "scripts/scan_secrets.py": continue
    path = root / name
    if not path.is_file() or path.suffix in {".pdf", ".png", ".jpg", ".woff", ".woff2"}: continue
    try: lines = path.read_text(encoding="utf-8").splitlines()
    except (UnicodeDecodeError, OSError): continue
    for number, line in enumerate(lines, 1):
        for label, pattern in patterns.items():
            if pattern.search(line): findings.append(f"{name}:{number}: {label}")
if findings:
    print("Potential secrets found; values intentionally omitted:\n" + "\n".join(findings))
    sys.exit(1)
print(f"PASS: conservative secret patterns checked in {len([name for name in files if name])} tracked/untracked nonignored file entries. Not a full history or entropy audit.")
