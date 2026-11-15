#!/usr/bin/env python3

import datetime as _dt
import json
import re
import shutil
import subprocess
import tempfile
import argparse
import hashlib
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple


PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLy9rIbGDXrG1Lfy3Um-KEPqFae7Ipghqj"


_TIMESTAMP_RE = re.compile(
    r"(?P<h>\d{2}):(?P<m>\d{2}):(?P<s>\d{2})\.(?P<ms>\d{3})"
)
_TAG_RE = re.compile(r"<[^>]+>")
_TOKEN_RE = re.compile(
    r"[A-Za-z]\([A-Za-z]+\)|[A-Za-z]\+\+|[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+|[A-Za-z0-9]+"
)


def _run(cmd: List[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)


def _parse_ts(ts: str) -> float:
    m = _TIMESTAMP_RE.match(ts.strip())
    if not m:
        raise ValueError(f"Bad timestamp: {ts!r}")
    h = int(m.group("h"))
    minutes = int(m.group("m"))
    s = int(m.group("s"))
    ms = int(m.group("ms"))
    return h * 3600 + minutes * 60 + s + ms / 1000.0


def _normalize_text(text: str) -> str:
    text = _TAG_RE.sub("", text)
    text = text.replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _stem_token(token: str) -> str:
    token = token.lower()
    if len(token) <= 3:
        return token
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


def _parse_vtt(vtt_text: str) -> List[dict]:
    """
    Minimal WebVTT parser extracting (start time, text).
    """
    lines = [ln.rstrip("\n") for ln in vtt_text.splitlines()]
    segments: List[dict] = []

    i = 0
    # Skip optional header
    if i < len(lines) and lines[i].strip().upper().startswith("WEBVTT"):
        i += 1
        while i < len(lines) and lines[i].strip():
            i += 1

    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Optional cue identifier line
        if "-->" not in line and i + 1 < len(lines) and "-->" in lines[i + 1]:
            i += 1
            line = lines[i].strip()

        if "-->" not in line:
            i += 1
            continue

        # Timestamp line
        try:
            left, right = line.split("-->", 1)
            start = _parse_ts(left.strip().split()[0])
        except Exception:
            i += 1
            continue

        i += 1
        text_lines: List[str] = []
        while i < len(lines) and lines[i].strip():
            text_lines.append(lines[i])
            i += 1

        text = _normalize_text(" ".join(text_lines))
        if text:
            segments.append({"start": int(start), "text": text})

    return segments


def _segment_stem_stats(text: str) -> Dict[str, Tuple[int, int]]:
    """
    Returns stem -> (freq, first_char_pos) for a single transcript segment.
    """
    lower = text.lower()
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
        head = t[:200]
        for name, rx in headings:
            if rx.search(head):
                current = name
                break
        out.append(current)
    return out


def _extract_playlist_entries(yt_dlp: str, playlist_url: str) -> List[dict]:
    proc = _run([yt_dlp, "--flat-playlist", "-J", playlist_url])
    data = json.loads(proc.stdout.decode("utf-8", errors="replace"))
    entries = data.get("entries") or []
    out = []
    for e in entries:
        vid = e.get("id")
        title = e.get("title") or ""
        if not vid:
            continue
        out.append({"id": vid, "title": title})
    return out


def _fetch_english_vtt(yt_dlp: str, video_id: str, tmp: Path) -> Tuple[Optional[str], str]:
    """
    Uses yt-dlp to write English subtitles (manual or auto) as VTT if available.
    Returns the VTT file contents or None.
    """
    video_url = f"https://www.youtube.com/watch?v={video_id}"

    # Prefer manual subs if present; otherwise auto-subs.
    common = [
        yt_dlp,
        "--skip-download",
        "--sub-langs",
        "en.*",
        "--sub-format",
        "vtt",
        "-o",
        str(tmp / "%(id)s.%(ext)s"),
        video_url,
    ]

    last_err = ""
    for mode in (["--write-subs"], ["--write-auto-subs"]):
        try:
            _run(common[:2] + mode + common[2:])
        except subprocess.CalledProcessError:
            last_err = "yt-dlp failed to fetch subtitles"
            continue

        candidates = sorted(tmp.glob(f"{video_id}*.vtt"), key=lambda p: len(p.name))
        if not candidates:
            last_err = "no subtitles found"
            continue
        return (candidates[0].read_text(encoding="utf-8", errors="replace"), "")

    return (None, last_err or "no subtitles found")


def _sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="replace")).hexdigest()


def _load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _save_json(path: Path, obj: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="Re-download transcripts (ignore cache).")
    args = ap.parse_args()

    yt_dlp = shutil.which("yt-dlp") or shutil.which("youtube-dl")
    if not yt_dlp:
        raise SystemExit(
            "yt-dlp (or youtube-dl) is required to build the YouTube transcript index.\n"
            "Install yt-dlp, then re-run this script."
        )

    repo_root = Path(__file__).resolve().parents[2]
    out_path = repo_root / "src" / "seminar" / "youtube-index.json"
    cache_dir = repo_root / ".cache" / "seminar_youtube_vtt"
    cache_manifest_path = cache_dir / "manifest.json"
    cache_manifest = _load_json(cache_manifest_path)
    cache_manifest.setdefault("videos", {})
    video_manifest: dict = cache_manifest["videos"]

    entries = _extract_playlist_entries(yt_dlp, PLAYLIST_URL)
    if not entries:
        raise SystemExit("No playlist entries found.")

    videos = []
    inv: Dict[str, List[List[int]]] = {}
    vocab: Set[str] = set()
    reused = 0
    rebuilt = 0
    skipped: List[dict] = []

    with tempfile.TemporaryDirectory(prefix="mfem-seminar-yt-") as tmpdir:
        tmp = Path(tmpdir)
        for entry in entries:
            vid = entry["id"]
            title = entry.get("title", "")

            cache_vtt = cache_dir / f"{vid}.vtt"
            cached = video_manifest.get(vid, {})
            vtt = None

            if not args.force and cache_vtt.exists() and cached.get("sha256"):
                vtt = cache_vtt.read_text(encoding="utf-8", errors="replace")
                if _sha256_text(vtt) == cached.get("sha256"):
                    reused += 1
                else:
                    vtt = None

            if vtt is None:
                vtt, reason = _fetch_english_vtt(yt_dlp, vid, tmp)
                if vtt:
                    cache_dir.mkdir(parents=True, exist_ok=True)
                    cache_vtt.write_text(vtt, encoding="utf-8")
                    video_manifest[vid] = {
                        "title": title,
                        "sha256": _sha256_text(vtt),
                        "downloaded": _dt.datetime.now(tz=_dt.timezone.utc).isoformat(),
                    }
                    rebuilt += 1

            if not vtt:
                skipped.append({"id": vid, "title": title, "reason": reason or "no transcript"})
                continue

            segments = _parse_vtt(vtt)
            if not segments:
                skipped.append({"id": vid, "title": title, "reason": "empty transcript"})
                continue

            video_idx = len(videos)
            section_texts = [str(s.get("text", "")) for s in segments]
            sections = _detect_sections(section_texts)
            videos.append({"id": vid, "title": title, "segments": segments, "sections": sections})

            for seg_idx, seg in enumerate(segments):
                stats = _segment_stem_stats(str(seg.get("text", "")))
                for stem, (freq, pos) in stats.items():
                    vocab.add(stem)
                    inv.setdefault(stem, []).append([video_idx, seg_idx, int(pos), int(freq)])

    payload = {
        "version": 2,
        "generated": _dt.datetime.now(tz=_dt.timezone.utc).isoformat(),
        "playlist": PLAYLIST_URL,
        "vocab": sorted(vocab),
        "inv": {k: sorted(inv[k]) for k in sorted(inv)},
        "videos": videos,
    }

    out_path.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )

    _save_json(cache_manifest_path, cache_manifest)
    print(
        f"Wrote {out_path} ({len(videos)} videos with transcripts; reused {reused}, rebuilt {rebuilt})"
    )

    if skipped:
        report_path = repo_root / "src" / "seminar" / "youtube-index.report.json"
        report = {
            "generated": _dt.datetime.now(tz=_dt.timezone.utc).isoformat(),
            "playlist": PLAYLIST_URL,
            "total_playlist_entries": len(entries),
            "indexed_videos": len(videos),
            "skipped_videos": skipped,
        }
        report_path.write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"Skipped {len(skipped)} videos without usable transcripts; wrote {report_path}")
        for item in skipped[:10]:
            print(f"- {item.get('id')} {item.get('reason')}")


if __name__ == "__main__":
    main()
