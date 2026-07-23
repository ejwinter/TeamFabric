#!/usr/bin/env python3
"""Compute and verify spec-sha fingerprints for TeamFabric spec files.

A spec file wraps its load-bearing, structured rules in ``<!-- spec:begin -->`` /
``<!-- spec:end -->`` markers and records ``spec-sha:`` in YAML frontmatter. That
hash is what TeamFabricHosted stamps onto its implementing graph/prompt via
``# implements: <name>@<sha>`` for cross-repo drift detection.

This is the authoritative, dependency-free tool on the *source* side. Its hashing
is byte-for-byte identical to the consumer copy in TeamFabricHosted
(``src/api/app/shared/spec_sha.py``): hash the concatenation of every spec region
(in document order), sha256, first 12 hex chars. Keep the two in sync.

Usage:
    python fabscripts/spec_sha.py [PATH ...]   # print computed sha per file
    python fabscripts/spec_sha.py --check [PATH ...]   # verify frontmatter; exit 1 on drift

With no PATH, the known spec files are used.
"""
from __future__ import annotations

import argparse
import hashlib
import re
import sys
from pathlib import Path

SHA_LENGTH = 12
_SPEC_BLOCK = re.compile(r"<!-- spec:begin -->(.*?)<!-- spec:end -->", re.DOTALL)
_FRONTMATTER_SHA = re.compile(r"^---\s*\n.*?^spec-sha:\s*(\S+)\s*$.*?^---\s*$", re.DOTALL | re.MULTILINE)

# Spec files this repo stamps, relative to the repo root.
_DEFAULT_FILES = [
    "Fabric/template/fabric-core.md",
    "Fabric/.claude/skills/ingestion.md",
]

REPO_ROOT = Path(__file__).resolve().parents[1]


def extract_spec_blocks(text: str) -> list[str]:
    """Return the stripped text of every spec:begin/end region, in order."""
    return [m.group(1).strip() for m in _SPEC_BLOCK.finditer(text)]


def compute_spec_sha(text: str) -> str:
    """Hash a spec file's region(s); raise if it carries none."""
    blocks = extract_spec_blocks(text)
    if not blocks:
        raise ValueError("no <!-- spec:begin -->/<!-- spec:end --> region found")
    return hashlib.sha256("\n".join(blocks).encode("utf-8")).hexdigest()[:SHA_LENGTH]


def frontmatter_sha(text: str) -> str | None:
    """Read the recorded ``spec-sha:`` from YAML frontmatter, if present."""
    match = _FRONTMATTER_SHA.search(text)
    return match.group(1) if match else None


def _resolve(paths: list[str]) -> list[Path]:
    if not paths:
        return [REPO_ROOT / p for p in _DEFAULT_FILES]
    return [Path(p) if Path(p).is_absolute() else REPO_ROOT / p for p in paths]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", help="spec files (default: known spec files)")
    parser.add_argument(
        "--check", action="store_true", help="verify frontmatter spec-sha; exit 1 on drift"
    )
    args = parser.parse_args()

    drift = False
    for path in _resolve(args.paths):
        text = path.read_text(encoding="utf-8")
        computed = compute_spec_sha(text)
        rel = path.relative_to(REPO_ROOT) if path.is_relative_to(REPO_ROOT) else path
        if args.check:
            recorded = frontmatter_sha(text)
            ok = recorded == computed
            drift = drift or not ok
            status = "OK" if ok else f"DRIFT (frontmatter={recorded})"
            print(f"{rel}: {computed} {status}")
        else:
            print(f"{rel}: {computed}")
    return 1 if drift else 0


if __name__ == "__main__":
    sys.exit(main())
