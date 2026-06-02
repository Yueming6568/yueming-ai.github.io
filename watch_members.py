#!/usr/bin/env python3
"""
Watch member source files and regenerate assets/js/members-data.js on changes.

Usage:
    python3 watch_members.py
"""

from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PEOPLE_DIR = ROOT / "people"
PEOPLE_IMG_DIR = ROOT / "assets" / "img" / "people"
GENERATOR = ROOT / "generate_members_data.py"
POLL_INTERVAL = 1.0


def iter_watched_files() -> list[Path]:
    files = []
    files.extend(sorted(PEOPLE_DIR.glob("*.md")))
    if PEOPLE_IMG_DIR.exists():
        files.extend(sorted(path for path in PEOPLE_IMG_DIR.iterdir() if path.is_file()))
    files.append(GENERATOR)
    return files


def snapshot() -> dict[Path, tuple[int, int]]:
    state: dict[Path, tuple[int, int]] = {}
    for path in iter_watched_files():
        try:
            stat = path.stat()
        except FileNotFoundError:
            continue
        state[path] = (stat.st_mtime_ns, stat.st_size)
    return state


def run_generator() -> int:
    print("[watch_members] Regenerating assets/js/members-data.js")
    result = subprocess.run([sys.executable, str(GENERATOR)], cwd=ROOT)
    if result.returncode == 0:
        print("[watch_members] Update complete\n")
    else:
        print(f"[watch_members] Generator failed with exit code {result.returncode}\n")
    return result.returncode


def main() -> int:
    print("[watch_members] Watching people/*.md and assets/img/people/*")
    print("[watch_members] Press Ctrl+C to stop\n")

    previous = snapshot()

    try:
        while True:
            time.sleep(POLL_INTERVAL)
            current = snapshot()
            if current != previous:
                changed = sorted(
                    str(path.relative_to(ROOT))
                    for path in set(previous) | set(current)
                    if previous.get(path) != current.get(path)
                )
                print("[watch_members] Detected change in:")
                for path in changed:
                    print(f"  - {path}")
                run_generator()
                previous = current
    except KeyboardInterrupt:
        print("\n[watch_members] Stopped")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
