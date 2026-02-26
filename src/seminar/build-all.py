#!/usr/bin/env python3

import argparse
import subprocess
import sys
from pathlib import Path
from typing import List


def _run(cmd: List[str]) -> int:
    print(f"$ {' '.join(cmd)}")
    try:
        subprocess.run(cmd, check=True)
        return 0
    except subprocess.CalledProcessError as e:
        return int(e.returncode or 1)


def main() -> int:
    ap = argparse.ArgumentParser(description="Build all seminar search indexes.")
    ap.add_argument(
        "--force",
        action="store_true",
        help="Rebuild all indexes from scratch (passes --force to both builders).",
    )
    ap.add_argument(
        "--pdf-only",
        action="store_true",
        help="Only build the PDF index.",
    )
    ap.add_argument(
        "--youtube-only",
        action="store_true",
        help="Only build the YouTube transcript index.",
    )
    args = ap.parse_args()

    here = Path(__file__).resolve().parent
    pdf_cmd = [sys.executable, str(here / "build-pdf-index.py")]
    yt_cmd = [sys.executable, str(here / "build-youtube-index.py")]
    if args.force:
        pdf_cmd.append("--force")
        yt_cmd.append("--force")

    if args.pdf_only and args.youtube_only:
        print("Error: use at most one of --pdf-only or --youtube-only.", file=sys.stderr)
        return 2

    rc_pdf = rc_yt = 0
    if not args.youtube_only:
        rc_pdf = _run(pdf_cmd)
    if not args.pdf_only:
        rc_yt = _run(yt_cmd)

    if rc_pdf == 0 and rc_yt == 0:
        print("OK: built all requested indexes.")
        return 0
    if rc_pdf != 0 and rc_yt != 0:
        print("ERROR: both index builds failed.", file=sys.stderr)
        return 1
    if rc_pdf != 0:
        print("ERROR: PDF index build failed.", file=sys.stderr)
        return 1
    print("ERROR: YouTube index build failed.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
