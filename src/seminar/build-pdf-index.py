#!/usr/bin/env python3

import datetime as _dt
import json
import re
import subprocess
import argparse
import hashlib
from pathlib import Path
from typing import Dict, List, Set, Tuple


def _normalize_page_text(text: str) -> str:
    text = text.replace("\x00", "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


_TOKEN_RE = re.compile(
    r"[A-Za-z]\([A-Za-z]+\)|[A-Za-z]\+\+|[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+|[A-Za-z0-9]+"
)


def _stem_token(token: str) -> str:
    token = token.lower()
    if len(token) <= 3:
        return token
    # Keep punctuation-heavy tokens as-is (e.g. h(curl), c++, p-refinement).
    if re.search(r"[^a-z0-9]", token):
        return token
    token = re.sub(r"'s$", "", token)

    if token.endswith("sses"):
        token = token[:-2]
    elif token.endswith("ies") and len(token) > 4:
        token = token[:-3] + "y"
    elif token.endswith("ss"):
        token = token
    elif token.endswith("s") and len(token) > 4:
        token = token[:-1]

    for suf in ("ingly", "edly", "ing", "ed", "ly"):
        if token.endswith(suf) and len(token) > len(suf) + 2:
            token = token[: -len(suf)]
            break

    if token.endswith("tion") and len(token) > 6:
        token = token[:-3]
    if token.endswith("ment") and len(token) > 7:
        token = token[:-4]
    if token.endswith("ness") and len(token) > 7:
        token = token[:-4]

    return token


def _sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def _load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _save_json(path: Path, obj: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _cached_pdf_text_pages(
    pdf_path: Path,
    cache_dir: Path,
    manifest: dict,
    *,
    force: bool,
) -> Tuple[List[str], bool]:
    """
    Returns (pages, reused_cache).
    """
    key = pdf_path.name
    cache_txt = cache_dir / f"{key}.txt"
    meta = manifest.get(key, {})

    stat = pdf_path.stat()
    fingerprint = {
        "size": int(stat.st_size),
        "mtime_ns": int(stat.st_mtime_ns),
    }

    if not force and cache_txt.exists() and meta.get("fingerprint") == fingerprint:
        raw = cache_txt.read_text(encoding="utf-8", errors="replace")
        pages = raw.split("\f")
        if pages and pages[-1].strip() == "":
            pages.pop()
        return ([_normalize_page_text(p) for p in pages], True)

    # (Re)extract
    cache_dir.mkdir(parents=True, exist_ok=True)
    try:
        proc = subprocess.run(
            ["pdftotext", "-enc", "UTF-8", str(pdf_path), str(cache_txt)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
        )
    except FileNotFoundError as e:
        raise SystemExit(
            "Missing required tool: pdftotext.\n"
            "Install Poppler (macOS: brew install poppler; Ubuntu/Debian: apt-get install poppler-utils)."
        ) from e
    _ = proc  # keep symmetry; output is in file

    raw = cache_txt.read_text(encoding="utf-8", errors="replace")
    pages = raw.split("\f")
    if pages and pages[-1].strip() == "":
        pages.pop()

    manifest[key] = {
        "fingerprint": fingerprint,
        "sha256": _sha256_file(pdf_path),
    }
    return ([_normalize_page_text(p) for p in pages], False)


def _page_stem_stats(page_text: str) -> Dict[str, Tuple[int, int]]:
    """
    Returns stem -> (freq, first_char_pos) for a single page.
    """
    lower = page_text.lower()
    stats: Dict[str, Tuple[int, int]] = {}

    def add(token: str, pos: int) -> None:
        stem = _stem_token(token)
        if not stem:
            return
        if stem in stats:
            freq, first = stats[stem]
            stats[stem] = (freq + 1, first)
        else:
            stats[stem] = (1, pos)

    for m in _TOKEN_RE.finditer(lower):
        tok = m.group(0)
        start = m.start()
        add(tok, start)

        if "-" in tok:
            offset = 0
            for part in tok.split("-"):
                if part:
                    add(part, start + offset)
                offset += len(part) + 1

        pm = re.match(r"^([a-z])\(([a-z]+)\)$", tok)
        if pm:
            add(pm.group(1), start)
            add(pm.group(2), start + 2)

        cm = re.match(r"^([a-z])\+\+$", tok)
        if cm:
            add(cm.group(1), start)

    return stats


def _detect_sections(texts: List[str]) -> List[str]:
    """
    Heuristic section tracking across pages.
    """
    headings = [
        ("Abstract", re.compile(r"\babstract\b", re.I)),
        ("Introduction", re.compile(r"\bintroduction\b", re.I)),
        ("Methods", re.compile(r"\b(methods?|methodology|approach)\b", re.I)),
        ("Results", re.compile(r"\bresults?\b", re.I)),
        ("Conclusion", re.compile(r"\bconclusions?\b", re.I)),
        ("References", re.compile(r"\breferences?\b", re.I)),
    ]
    current = "General"
    out: List[str] = []
    for t in texts:
        head = t[:300]
        for name, rx in headings:
            if rx.search(head):
                current = name
                break
        out.append(current)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="Re-extract all PDFs (ignore cache).")
    args = ap.parse_args()

    repo_root = Path(__file__).resolve().parents[2]
    pdf_dir = repo_root / "src" / "pdf" / "seminar"
    out_path = repo_root / "src" / "seminar" / "pdf-index.json"
    cache_dir = repo_root / ".cache" / "seminar_pdf_text"
    cache_manifest_path = cache_dir / "manifest.json"
    cache_manifest = _load_json(cache_manifest_path)
    cache_manifest.setdefault("pdfs", {})
    pdf_manifest = cache_manifest["pdfs"]

    pdf_files = sorted(p.name for p in pdf_dir.glob("*.pdf"))
    if not pdf_files:
        raise SystemExit(f"No PDFs found under: {pdf_dir}")

    docs = []
    inv: Dict[str, List[List[int]]] = {}
    vocab: Set[str] = set()
    reused = 0

    for filename in pdf_files:
        pdf_path = pdf_dir / filename
        pages, was_reused = _cached_pdf_text_pages(
            pdf_path, cache_dir, pdf_manifest, force=args.force
        )
        if was_reused:
            reused += 1
        doc_idx = len(docs)
        sections = _detect_sections(pages)
        docs.append({"file": filename, "pages": pages, "sections": sections})

        for page_i, page_text in enumerate(pages, start=1):
            stats = _page_stem_stats(page_text)
            for stem, (freq, pos) in stats.items():
                vocab.add(stem)
                inv.setdefault(stem, []).append([doc_idx, page_i, int(pos), int(freq)])

    payload = {
        "version": 2,
        "generated": _dt.datetime.now(tz=_dt.timezone.utc).isoformat(),
        "vocab": sorted(vocab),
        "inv": {k: sorted(inv[k]) for k in sorted(inv)},
        "docs": docs,
    }

    out_path.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    _save_json(cache_manifest_path, cache_manifest)
    print(f"Wrote {out_path} ({len(docs)} PDFs; reused {reused}, rebuilt {len(docs) - reused})")


if __name__ == "__main__":
    main()
