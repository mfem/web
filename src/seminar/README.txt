# Seminar Search Maintenance

This directory contains the client-side search code and prebuilt search indexes used by `src/seminar.md`.

## Generated index files (policy)

The following files are **generated** and can be large:

- `src/seminar/pdf-index.json`
- `src/seminar/youtube-index.json`

They are required for the deployed site search to work, but they can create very large diffs in PRs.
This repo marks them as “no diff” in `.gitattributes` to keep reviews readable.

## Review notes

- The search widget is implemented in plain JS (`src/seminar/search.js`) and runs fully client-side.
- The index builder scripts are deterministic as much as possible (sorted index keys/postings), but regenerating indexes can still produce large diffs.
- `.cache/` and `src/seminar/youtube-index.report.json` are intentionally git-ignored.

## When adding a new talk

1. **Add the talk to the page**
   - Edit `src/seminar.md` and add the new entry (speaker image, title, abstract, links).

2. **Add slides (PDF)**
   - Put the slides in `src/pdf/seminar/` (e.g. `src/pdf/seminar/mytalk.pdf`).
   - Link it from `src/seminar.md` like `pdf/seminar/mytalk.pdf`.

3. **Add recording (YouTube)**
   - Link the recording from `src/seminar.md` with a normal YouTube URL (e.g. `https://youtu.be/<id>` or `https://www.youtube.com/watch?v=<id>`).
   - Transcripts are pulled from the FEM@LLNL playlist when the YouTube index is rebuilt.

4. **Rebuild the search indexes**
   - Build both:
     - `python3 src/seminar/build-all.py`
   - Or individually:
     - `python3 src/seminar/build-pdf-index.py`
     - `python3 src/seminar/build-youtube-index.py` (requires `yt-dlp` or `youtube-dl`)

Notes:

- The index builder scripts are compatible with Python 3.6.9+ (the MkDocs environment constraint).
- The PDF builder requires `pdftotext` (typically from Poppler).

The scripts cache extracted content under `.cache/` to avoid reprocessing unchanged PDFs/videos. Use `--force` to rebuild from scratch:

- `python3 src/seminar/build-all.py --force`
- `python3 src/seminar/build-pdf-index.py --force`
- `python3 src/seminar/build-youtube-index.py --force`

The YouTube builder prints a summary of skipped videos (e.g. no transcript available) and writes a report file:

- `src/seminar/youtube-index.report.json`
  - This file is generated for maintainers and is ignored by git.

## Files in this folder

- `src/seminar/search.js`: search UI + boolean query support.
- `src/seminar/pdf-index.json`: generated PDF slides search index.
- `src/seminar/youtube-index.json`: generated YouTube transcript search index.
- `src/seminar/youtube-index.report.json`: generated report (skipped videos, counts; git-ignored).
- `src/seminar/build-all.py`: convenience wrapper that builds both indexes and returns a useful exit code for automation.
- `src/seminar/pdf` → symlink to `src/pdf/seminar` (slides).
- `src/seminar/img` → symlink to `src/img/seminar` (speaker images).

## Search behavior notes

- **Snippets** are selected using a densest-match window (clustered query terms) rather than “first match”.
- **YouTube hits** are clustered by timestamp (≤10 seconds gap) and only the first hit of each cluster is listed; larger clusters are shown as `+N`.
- **Ordering** is by cluster size (desc), then relevance score, then time (asc).
- **Sections** are detected heuristically (“Abstract”, “Introduction”, “Results”, “Conclusion”, “References”, …) and shown as a badge on each hit.
- **Metadata boost:** matches in the talk title / speaker / date can boost talk ranking even if there are few full-text hits.
- Boolean operator words (`AND`/`OR`/`NOT`) are not highlighted in snippets if they appear in the underlying text.
- Sort controls (“Sort by: Relevance / Most Recent / Oldest”) are hidden until there is a non-empty query.

## Query syntax

### Grammar

The search box supports a small boolean expression language.

- **Atoms**
  - Term: `gpu`, `mfem`, `p-refinement`, `H(curl)`, `C++`
  - Phrase: `"partial assembly"` (double quotes)
- **Operators**
  - `NOT X`
  - `X AND Y`
  - `X OR Y`
  - Parentheses: `( ... )`
- **Implicit AND**
  - Adjacent atoms are treated as `AND`.
  - Example: `"partial assembly" gpu` is the same as `"partial assembly" AND gpu`.
- **Precedence**
  - `NOT` binds strongest, then `AND`, then `OR`.
  - Use parentheses to be explicit.

### Normalization / shorthands

- `-term` means `NOT term` (e.g. `mfem -cuda` is treated like `mfem AND (NOT cuda)`).
- `|` means `OR`
- `&` means `AND`
- Operators are case-insensitive (`and`, `Or`, `NOT` all work).

### Examples

- Multiple phrases + terms: `"partial assembly" AND gpu`
- Grouping: `mfem AND (hypre OR amg)`
- Excluding: `gpu NOT cuda` (equivalent to `gpu AND (NOT cuda)`)
- Shorthand: `mfem | hypre`

### Edge cases

- Unbalanced parentheses or dangling operators show a parse error.
- Queries that use `NOT` **must** include at least one positive term/phrase (e.g. `NOT gpu` is rejected).
