(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  var root = byId("seminar-pdf-search");
  if (!root) return;

  var input = byId("seminar-pdf-search-input");
  var statusEl = byId("seminar-pdf-search-status");
  var sortControlsEl = byId("seminar-pdf-search-sort-controls");
  var resultsEl = byId("seminar-pdf-search-results");

  if (!input || !statusEl || !resultsEl || !sortControlsEl) return;

  function setStatus(text) {
    statusEl.textContent = text || "";
  }

  function getSortMode() {
    var el = document.querySelector('input[name="seminar-pdf-search-sort"]:checked');
    return el ? String(el.value || "relevance") : "relevance";
  }

  function setSortControlsVisible(visible) {
    sortControlsEl.style.display = visible ? "inline-flex" : "none";
  }

  function clearResults() {
    resultsEl.innerHTML = "";
    setSortControlsVisible(false);
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (ch) {
      switch (ch) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return ch;
      }
    });
  }

  function bestDenseSnippet(text, needlesLower) {
    var raw = String(text || "");
    var lower = raw.toLowerCase();
    var radius = 170;
    var indices = [];
    for (var i = 0; i < (needlesLower || []).length; i++) {
      var needle = String(needlesLower[i] || "").toLowerCase();
      if (!needle) continue;
      var from = 0;
      while (true) {
        var idx = lower.indexOf(needle, from);
        if (idx === -1) break;
        indices.push(idx);
        from = idx + Math.max(1, needle.length);
      }
    }
    if (!indices.length) return raw.slice(0, 240).trim();
    indices.sort(function (a, b) {
      return a - b;
    });

    var windowSpan = 220;
    var bestL = 0;
    var bestR = 0;
    var l = 0;
    for (var r = 0; r < indices.length; r++) {
      while (indices[r] - indices[l] > windowSpan && l < r) l++;
      if ((r - l) > (bestR - bestL)) {
        bestL = l;
        bestR = r;
      }
    }

    var center = Math.floor((indices[bestL] + indices[bestR]) / 2);
    var start = Math.max(0, center - radius);
    var end = Math.min(raw.length, center + radius);
    return raw.slice(start, end).trim();
  }

  function tokenize(text) {
    text = String(text || "").toLowerCase();
    var re = /[a-z]\([a-z]+\)|[a-z]\+\+|[a-z0-9]+(?:-[a-z0-9]+)+|[a-z0-9]+/g;
    var out = [];
    var seen = Object.create(null);
    var m;
    while ((m = re.exec(text)) !== null) {
      var tok = m[0];
      if (!seen[tok]) {
        out.push(tok);
        seen[tok] = true;
      }
      if (tok.indexOf("-") !== -1) {
        var parts = tok.split("-").filter(Boolean);
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          if (p && !seen[p]) {
            out.push(p);
            seen[p] = true;
          }
        }
      }
      var pm = tok.match(/^([a-z])\(([a-z]+)\)$/);
      if (pm) {
        var a = pm[1];
        var b = pm[2];
        if (a && !seen[a]) {
          out.push(a);
          seen[a] = true;
        }
        if (b && !seen[b]) {
          out.push(b);
          seen[b] = true;
        }
      }
      var cm = tok.match(/^([a-z])\\+\\+$/);
      if (cm) {
        var c = cm[1];
        if (c && !seen[c]) {
          out.push(c);
          seen[c] = true;
        }
      }
    }
    return out;
  }

  function stemToken(token) {
    token = String(token || "").toLowerCase();
    if (token.length <= 3) return token;
    if (/[^a-z0-9]/.test(token)) return token;
    token = token.replace(/'s$/, "");

    if (token.endsWith("sses")) token = token.slice(0, -2);
    else if (token.endsWith("ies") && token.length > 4) token = token.slice(0, -3) + "y";
    else if (token.endsWith("ss")) token = token;
    else if (token.endsWith("s") && token.length > 4) token = token.slice(0, -1);

    var suffixes = ["ingly", "edly", "ing", "ed", "ly"];
    for (var i = 0; i < suffixes.length; i++) {
      var suf = suffixes[i];
      if (token.endsWith(suf) && token.length > suf.length + 2) {
        token = token.slice(0, -suf.length);
        break;
      }
    }

    if (token.endsWith("tion") && token.length > 6) token = token.slice(0, -3);
    if (token.endsWith("ment") && token.length > 7) token = token.slice(0, -4);
    if (token.endsWith("ness") && token.length > 7) token = token.slice(0, -4);

    return token;
  }

  function normalizeNeedles(tokens) {
    var out = [];
    var seen = Object.create(null);
    for (var i = 0; i < (tokens || []).length; i++) {
      var t = String(tokens[i] || "").trim();
      if (!t) continue;
      if (t.indexOf(" ") !== -1) {
        var k = t.toLowerCase();
        if (!seen[k]) {
          out.push(k);
          seen[k] = true;
        }
        continue;
      }
      var parts = tokenize(t);
      for (var j = 0; j < parts.length; j++) {
        var p = parts[j];
        if (!p) continue;
        if (!seen[p]) {
          out.push(p);
          seen[p] = true;
        }
      }
    }
    return out;
  }

  function escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightHtml(text, tokens) {
    var raw = String(text || "");
    if (!raw) return "";
    if (!tokens || !tokens.length) return escapeHtml(raw);

    var uniq = Object.create(null);
    var cleaned = [];
    for (var i = 0; i < tokens.length; i++) {
      var tok = String(tokens[i] || "").trim();
      if (!tok) continue;
      var up = tok.toUpperCase();
      if (up === "AND" || up === "OR" || up === "NOT") continue;
      var key = tok.toLowerCase();
      if (uniq[key]) continue;
      uniq[key] = true;
      cleaned.push(tok);
    }
    if (!cleaned.length) return escapeHtml(raw);

    cleaned.sort(function (a, b) {
      return b.length - a.length;
    });

    var re = new RegExp("(" + cleaned.map(escapeRegex).join("|") + ")", "ig");
    var out = "";
    var last = 0;
    var m;
    while ((m = re.exec(raw)) !== null) {
      var idx = m.index;
      var match = m[0];
      out += escapeHtml(raw.slice(last, idx));
      out += '<mark style="background:#ffeb3b;">' + escapeHtml(match) + "</mark>";
      last = idx + match.length;
      if (re.lastIndex === idx) re.lastIndex++; // safety
    }
    out += escapeHtml(raw.slice(last));
    return out;
  }

  function parseYouTubeId(href) {
    href = String(href || "");
    var m = href.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  }

  function formatTimestamp(seconds) {
    seconds = Math.max(0, Math.floor(Number(seconds) || 0));
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    function pad2(n) {
      return n < 10 ? "0" + n : "" + n;
    }
    if (h > 0) return h + ":" + pad2(m) + ":" + pad2(s);
    return m + ":" + pad2(s);
  }

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function stableTalkIdFromPdfFile(pdfFile) {
    var base = String(pdfFile || "").split("/").pop();
    base = base.replace(/\.pdf$/i, "");
    return "seminar-" + (slugify(base) || "talk");
  }

  function stableTalkIdFromYouTubeId(videoId) {
    var vid = String(videoId || "").trim();
    return "seminar-yt-" + (slugify(vid) || "talk");
  }

  function parseTalkDate(text) {
    text = String(text || "").trim();
    if (!text) return null;
    var ms = Date.parse(text);
    if (!isFinite(ms)) return null;
    return ms;
  }

  function lexBoolean(query) {
    var s = String(query || "");
    var out = [];
    var i = 0;
    while (i < s.length) {
      var ch = s.charAt(i);
      if (/\s/.test(ch)) {
        i++;
        continue;
      }
      if (ch === "|") {
        out.push({ t: "op", v: "OR", i: i });
        i++;
        continue;
      }
      if (ch === "&") {
        out.push({ t: "op", v: "AND", i: i });
        i++;
        continue;
      }
      if (ch === "-") {
        // Query normalization: -term means NOT term (only when '-' starts a token).
        out.push({ t: "op", v: "NOT", i: i });
        i++;
        continue;
      }
      if (ch === "(") {
        out.push({ t: "lp", i: i });
        i++;
        continue;
      }
      if (ch === ")") {
        out.push({ t: "rp", i: i });
        i++;
        continue;
      }
      if (ch === '"') {
        var j = i + 1;
        var buf = "";
        while (j < s.length && s.charAt(j) !== '"') {
          buf += s.charAt(j);
          j++;
        }
        out.push({ t: "phrase", v: buf.trim(), i: i });
        i = j < s.length ? j + 1 : j;
        continue;
      }
      var j2 = i;
      var w = "";
      while (j2 < s.length) {
        var c2 = s.charAt(j2);
        if (/\s/.test(c2) || c2 === "(" || c2 === ")" || c2 === '"' || c2 === "|" || c2 === "&") break;
        w += c2;
        j2++;
      }
      var up = w.toUpperCase();
      if (up === "AND" || up === "OR" || up === "NOT") out.push({ t: "op", v: up, i: i });
      else out.push({ t: "term", v: w, i: i });
      i = j2;
    }
    return out;
  }

  function insertImplicitAnd(tokens) {
    var out = [];
    function isAtom(tok) {
      return tok && (tok.t === "term" || tok.t === "phrase" || tok.t === "rp");
    }
    function startsAtom(tok) {
      return tok && (tok.t === "term" || tok.t === "phrase" || tok.t === "lp" || (tok.t === "op" && tok.v === "NOT"));
    }
    for (var i = 0; i < tokens.length; i++) {
      var cur = tokens[i];
      var prev = out.length ? out[out.length - 1] : null;
      if (prev && isAtom(prev) && startsAtom(cur)) {
        out.push({ t: "op", v: "AND" });
      }
      out.push(cur);
    }
    return out;
  }

  function parseBooleanQuery(query) {
    query = String(query || "").trim();
    if (!query) return null;

    var tokens = insertImplicitAnd(lexBoolean(query));
    var idx = 0;

    function peek() {
      return tokens[idx] || null;
    }

    function consume() {
      return tokens[idx++] || null;
    }

    function err(msg, tok) {
      return {
        error: msg,
        at: tok && typeof tok.i === "number" ? tok.i : null,
      };
    }

    function parsePrimary() {
      var tok = peek();
      if (!tok) return err("Unexpected end of query.", tok);
      if (tok.t === "lp") {
        consume();
        var inner = parseOr();
        if (inner && inner.error) return inner;
        var close = peek();
        if (!close || close.t !== "rp") return err("Missing ')'.", close || tok);
        consume();
        return inner;
      }
      if (tok.t === "term") {
        consume();
        var parts = tokenize(tok.v);
        if (!parts.length) return err("Empty term.", tok);
        if (parts.length === 1) return { type: "term", raw: parts[0] };
        var node = { type: "and", items: [] };
        for (var i = 0; i < parts.length; i++) node.items.push({ type: "term", raw: parts[i] });
        return node;
      }
      if (tok.t === "phrase") {
        consume();
        if (!tok.v) return err("Empty phrase.", tok);
        return { type: "phrase", raw: tok.v };
      }
      if (tok.t === "op") return err("Unexpected operator '" + tok.v + "'.", tok);
      if (tok.t === "rp") return err("Unexpected ')'.", tok);
      return err("Unexpected token.", tok);
    }

    function parseUnary() {
      var tok = peek();
      if (tok && tok.t === "op" && tok.v === "NOT") {
        consume();
        var child = parseUnary();
        if (child && child.error) return child;
        return { type: "not", child: child };
      }
      return parsePrimary();
    }

    function parseAnd() {
      var left = parseUnary();
      if (left && left.error) return left;
      var items = [left];
      while (true) {
        var tok = peek();
        if (!tok) break;
        if (tok.t === "op" && tok.v === "AND") {
          consume();
          var right = parseUnary();
          if (right && right.error) return right;
          items.push(right);
          continue;
        }
        // implicit AND was inserted by insertImplicitAnd()
        break;
      }
      if (items.length === 1) return left;
      return { type: "and", items: items };
    }

    function parseOr() {
      var left = parseAnd();
      if (left && left.error) return left;
      var items = [left];
      while (true) {
        var tok = peek();
        if (!tok) break;
        if (tok.t === "op" && tok.v === "OR") {
          consume();
          var right = parseAnd();
          if (right && right.error) return right;
          items.push(right);
          continue;
        }
        break;
      }
      if (items.length === 1) return left;
      return { type: "or", items: items };
    }

    var ast = parseOr();
    if (ast && ast.error) return ast;

    if (idx < tokens.length) {
      var extra = tokens[idx];
      return err("Unexpected token after a complete expression.", extra);
    }

    var atoms = [];
    var highlight = [];
    var positiveAtoms = [];

    function walk(node, negated) {
      if (!node || node.error) return;
      if (node.type === "term") {
        atoms.push({ kind: "term", raw: node.raw });
        highlight.push(node.raw);
        if (!negated) positiveAtoms.push({ kind: "term", raw: node.raw });
        return;
      }
      if (node.type === "phrase") {
        atoms.push({ kind: "phrase", raw: node.raw });
        highlight.push(node.raw);
        if (!negated) positiveAtoms.push({ kind: "phrase", raw: node.raw });
        return;
      }
      if (node.type === "not") {
        walk(node.child, !negated);
        return;
      }
      if (node.type === "and" || node.type === "or") {
        for (var i = 0; i < (node.items || []).length; i++) {
          walk(node.items[i], negated);
        }
      }
    }

    walk(ast, false);

    return {
      raw: query,
      ast: ast,
      atoms: atoms,
      positiveAtoms: positiveAtoms,
      highlightTokens: highlight,
    };
  }

  function buildTalkMeta() {
    var metaByPdfFile = Object.create(null);
    var metaByVideoId = Object.create(null);

    var container =
      document.querySelector('[role="main"]') ||
      document.querySelector(".container") ||
      document.body;

    var walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );

    var currentSpeaker = "";
    var currentTitle = "";
    var currentDateMs = null;
    var currentPdfFile = "";
    var currentVideoId = "";
    var currentH4 = null;
    var lastSeminarImg = null;

    for (var node = walker.nextNode(); node; node = walker.nextNode()) {
      var tag = node.tagName;
      if (tag === "IMG") {
        var src = node.getAttribute("src") || "";
        if (src.indexOf("img/seminar/") !== -1) {
          lastSeminarImg = node;
        }
        continue;
      }
      if (tag === "H4") {
        currentSpeaker = (node.textContent || "").trim();
        currentTitle = "";
        currentDateMs = null;
        currentPdfFile = "";
        currentVideoId = "";
        currentH4 = node;
        continue;
      }
      if (tag === "H5") {
        var em = node.querySelector("em");
        if (em && (em.textContent || "").trim()) {
          currentTitle = em.textContent.trim();
        } else {
          var maybeDateMs = parseTalkDate(node.textContent || "");
          if (maybeDateMs) currentDateMs = maybeDateMs;
        }
        continue;
      }
      if (tag === "A") {
        var href = node.getAttribute("href") || "";
        var speaker = currentSpeaker || "";
        var title = currentTitle || "";
        var label = speaker || "";
        if (title) label = (label ? label + " \u2014 " : "") + title;

        if (href.indexOf("pdf/seminar/") !== -1 && href.toLowerCase().slice(-4) === ".pdf") {
          var file = href.split("pdf/seminar/")[1];
          if (!file) continue;
          file = file.split(/[?#]/)[0];
          if (!file) continue;

          currentPdfFile = currentPdfFile || file;
          var anchorId = stableTalkIdFromPdfFile(file);
          if (lastSeminarImg && !lastSeminarImg.id) lastSeminarImg.id = anchorId;

          if (!metaByPdfFile[file]) {
            metaByPdfFile[file] = {
              label: label || file,
              speaker: speaker || "",
              title: title || "",
              anchorId: anchorId,
              dateMs: currentDateMs,
              pdfFile: file,
              videoId: currentVideoId || null,
            };
          } else if (!metaByPdfFile[file].videoId && currentVideoId) {
            metaByPdfFile[file].videoId = currentVideoId;
            if (!metaByPdfFile[file].dateMs && currentDateMs) metaByPdfFile[file].dateMs = currentDateMs;
          }
          continue;
        }

        var vid = parseYouTubeId(href);
        if (vid) {
          currentVideoId = currentVideoId || vid;
          var yAnchorId = currentPdfFile ? stableTalkIdFromPdfFile(currentPdfFile) : stableTalkIdFromYouTubeId(vid);
          if (lastSeminarImg && !lastSeminarImg.id) lastSeminarImg.id = yAnchorId;

          if (!metaByVideoId[vid]) {
            metaByVideoId[vid] = {
              label: label || vid,
              speaker: speaker || "",
              title: title || "",
              anchorId: yAnchorId,
              dateMs: currentDateMs,
              pdfFile: currentPdfFile || null,
              videoId: vid,
            };
          } else if (!metaByVideoId[vid].pdfFile && currentPdfFile) {
            metaByVideoId[vid].pdfFile = currentPdfFile;
            if (!metaByVideoId[vid].dateMs && currentDateMs) metaByVideoId[vid].dateMs = currentDateMs;
          }

          if (currentPdfFile && metaByPdfFile[currentPdfFile] && !metaByPdfFile[currentPdfFile].videoId) {
            metaByPdfFile[currentPdfFile].videoId = vid;
          }
        }
      }
    }

    return { byPdfFile: metaByPdfFile, byVideoId: metaByVideoId };
  }

  var talkMeta = null;
  var pdfIndexPromise = null;
  var ytIndexPromise = null;
  var pdfIndexError = null;
  var ytIndexError = null;

  function loadPdfIndex() {
    if (pdfIndexPromise) return pdfIndexPromise;

    var indexUrl = new URL("./pdf-index.json", window.location.href).toString();

    pdfIndexPromise = fetch(indexUrl, { cache: "force-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load PDF index (" + res.status + ")");
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.docs || !data.docs.length) {
          throw new Error("PDF index is empty");
        }
        if (!data.inv || !data.vocab) {
          data._legacy = true;
          for (var i = 0; i < data.docs.length; i++) {
            var doc = data.docs[i];
            doc._pagesLower = (doc.pages || []).map(function (p) {
              return String(p || "").toLowerCase();
            });
          }
        }
        pdfIndexError = null;
        return data;
      })
      .catch(function (err) {
        pdfIndexError = (err && err.message) ? err.message : "PDF index unavailable";
        throw err;
      });

    return pdfIndexPromise;
  }

  function loadYouTubeIndex() {
    if (ytIndexPromise) return ytIndexPromise;

    var indexUrl = new URL("./youtube-index.json", window.location.href).toString();

    ytIndexPromise = fetch(indexUrl, { cache: "force-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load YouTube index (" + res.status + ")");
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.videos || !data.videos.length) {
          throw new Error("YouTube index is empty");
        }
        if (!data.inv || !data.vocab) {
          data._legacy = true;
          for (var i = 0; i < data.videos.length; i++) {
            var v = data.videos[i];
            v._segmentsLower = (v.segments || []).map(function (s) {
              return String((s && s.text) || "").toLowerCase();
            });
          }
        }
        ytIndexError = null;
        return data;
      })
      .catch(function (err) {
        ytIndexError = (err && err.message) ? err.message : "YouTube index unavailable";
        throw err;
      });

    return ytIndexPromise;
  }

  function render(groups, availability, tokens) {
    if (!groups.length) {
      setStatus("No matches");
      clearResults();
      return;
    }

    var note = availability ? " (" + availability + ")" : "";
    setStatus("Found " + groups.length + " talk(s)" + note);
    setSortControlsVisible(true);

    var sortMode = getSortMode();
    if (sortMode === "recent" || sortMode === "oldest") {
      groups.sort(function (a, b) {
        var da = isFinite(a.dateMs) ? a.dateMs : -Infinity;
        var db = isFinite(b.dateMs) ? b.dateMs : -Infinity;
        if (db !== da) return (sortMode === "oldest") ? (da - db) : (db - da);
        return a.label.localeCompare(b.label);
      });
    } else {
      groups.sort(function (a, b) {
        var sa = Number(a.score) || 0;
        var sb = Number(b.score) || 0;
        if (sb !== sa) return sb - sa;
        return a.label.localeCompare(b.label);
      });
    }

    var basePdfUrl = new URL("../pdf/seminar/", window.location.href).toString();
    var html = "";

    function clusterYouTubeHits(hits) {
      // Build connected time clusters (gap <= 10s) and keep the earliest hit as the representative.
      // Order clusters by: (1) cluster size (desc), (2) best relevance score in cluster (desc),
      // (3) earliest timestamp (asc) for stability.
      hits = (hits || []).slice();
      var normalized = [];
      for (var i0 = 0; i0 < hits.length; i0++) {
        var h0 = hits[i0] || {};
        var t0 = Number(h0.start);
        var valid = isFinite(t0) && t0 >= 0;
        normalized.push({ hit: h0, t: valid ? t0 : null, valid: valid, idx: i0 });
      }
      normalized.sort(function (a, b) {
        if (a.valid !== b.valid) return a.valid ? -1 : 1; // valid timestamps first
        if (!a.valid && !b.valid) return a.idx - b.idx;
        return a.t - b.t;
      });

      var clusters = [];
      var cur = null;

      function finishCluster() {
        if (!cur) return;
        clusters.push(cur);
        cur = null;
      }

      for (var i = 0; i < normalized.length; i++) {
        var item = normalized[i];
        var h = item.hit;
        // Non-finite timestamps are treated as standalone clusters (still show the hit, but no timestamp link).
        if (!item.valid) {
          finishCluster();
          clusters.push({ first: h, firstT: null, lastT: null, size: 1, bestScore: Number(h.score) || 0 });
          continue;
        }
        var t = item.t;
        if (!cur) {
          cur = { first: h, firstT: t, lastT: t, size: 1, bestScore: Number(h.score) || 0 };
          continue;
        }
        if ((t - cur.lastT) <= 10) {
          cur.size += 1;
          cur.lastT = t;
          var s = Number(h.score) || 0;
          if (s > cur.bestScore) cur.bestScore = s;
          continue;
        }
        finishCluster();
        cur = { first: h, firstT: t, lastT: t, size: 1, bestScore: Number(h.score) || 0 };
      }
      finishCluster();

      clusters.sort(function (a, b) {
        if (b.size !== a.size) return b.size - a.size;
        if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
        var at = isFinite(a.firstT) ? a.firstT : 1e18;
        var bt = isFinite(b.firstT) ? b.firstT : 1e18;
        return at - bt;
      });

      var reps = [];
      for (var j = 0; j < clusters.length; j++) {
        var c = clusters[j];
        var rep = Object.assign({}, c.first);
        rep.clusterSize = c.size;
        rep.clusterScore = c.bestScore;
        rep._startValid = isFinite(c.firstT);
        reps.push(rep);
      }
      return reps;
    }

    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      var pdfUrl = group.pdfFile ? new URL(group.pdfFile, basePdfUrl).toString() : null;
      var videoUrl = group.videoId
        ? "https://www.youtube.com/watch?v=" + encodeURIComponent(group.videoId)
        : null;
      var anchorHref = group.anchorId ? "#" + encodeURIComponent(group.anchorId) : null;

      var pdfCount = (group.pdfHits || []).length;
      var ytHits = clusterYouTubeHits(group.ytHits || []);
      var ytCount = ytHits.length;

      html += '<div class="seminar-search-card">';
      html += '<div class="hdr">';
      if (group.title) {
        html += '<div class="title">';
        if (anchorHref) html += '<a href="' + anchorHref + '">' + escapeHtml(group.title) + "</a>";
        else html += escapeHtml(group.title);
        html += "</div>";
      } else {
        html += '<div class="title">' + escapeHtml(group.label) + "</div>";
      }
      if (group.speaker) html += '<div class="speaker">' + escapeHtml(group.speaker) + "</div>";
      html += '<div class="seminar-search-badges">';
      if (pdfCount) html += '<span class="seminar-search-badge">📄 ' + pdfCount + "</span>";
      if (ytCount) html += '<span class="seminar-search-badge">📺 ' + ytCount + "</span>";
      if (group.dateMs) html += '<span class="seminar-search-badge">' + escapeHtml(new Date(group.dateMs).toLocaleDateString()) + "</span>";
      html += "</div>";
      html += "</div>";

      html += '<div class="body">';

      var pdfHits = group.pdfHits || [];

      var activeKind = "pdf";
      if (pdfHits.length && !ytHits.length) activeKind = "pdf";
      else if (!pdfHits.length && ytHits.length) activeKind = "yt";
      else if (pdfHits.length && ytHits.length) {
        var ps = Number(pdfHits[0].score) || 0;
        var ys = Number(ytHits[0].score) || 0;
        activeKind = ys > ps ? "yt" : "pdf";
      }

      function renderPdfHit(hit) {
        var pageUrl = pdfUrl + "#page=" + hit.page;
        html += '<div class="seminar-search-hit">';
        html += '<span class="seminar-search-pill">';
        html += '<a href="' + pageUrl + '" target="_blank" rel="noopener">📄 p.' + hit.page + "</a>";
        html += "</span>";
        if (hit.section) {
          html += '<span class="seminar-search-badge" style="margin-top:2px;">' + escapeHtml(hit.section) + "</span>";
        }
        if (hit.snippet) {
          html += '<span class="seminar-search-snippet">' + highlightHtml(hit.snippet, tokens) + "</span>";
        }
        html += "</div>";
      }

      function renderYtHit(hit) {
        var tnum = Number(hit.start);
        var hasTime = isFinite(tnum) && tnum >= 0;
        var tt = hasTime ? Math.max(0, Math.floor(tnum)) : 0;
        var tsUrl = hasTime ? (videoUrl + "&t=" + tt + "s") : videoUrl;
        html += '<div class="seminar-search-hit">';
        html += '<span class="seminar-search-pill">';
        html += '<a href="' + tsUrl + '" target="_blank" rel="noopener">📺 ' + (hasTime ? escapeHtml(formatTimestamp(tt)) : "") + "</a>";
        html += "</span>";
        if (Number(hit.clusterSize) > 1) {
          html += '<span class="seminar-search-badge">+' + (Number(hit.clusterSize) - 1) + "</span>";
        }
        if (hit.section) {
          html += '<span class="seminar-search-badge" style="margin-top:2px;">' + escapeHtml(hit.section) + "</span>";
        }
        if (hit.snippet) {
          html += '<span class="seminar-search-snippet">' + highlightHtml(hit.snippet, tokens) + "</span>";
        }
        html += "</div>";
      }

      function renderHitsPane(kind, hits, paneId) {
        var initialCount = 1;
        var moreId = "seminar-search-more-" + i + "-" + kind;
        var moreCount = Math.max(0, hits.length - initialCount);

        for (var c = 0; c < hits.length && c < initialCount; c++) {
          if (kind === "pdf") renderPdfHit(hits[c]);
          else renderYtHit(hits[c]);
        }

        if (hits.length > initialCount) {
          html +=
            '<a href="#" class="seminar-search-toggle" data-target="' +
            moreId +
            '" data-expanded="0" data-show-more="Show more (' +
            moreCount +
            ')" data-show-less="Show less (' +
            initialCount +
            ')">Show more (' +
            moreCount +
            ")</a>";
          html += '<div id="' + moreId + '" style="display:none; margin-top: 10px;">';
          for (var c2 = initialCount; c2 < hits.length; c2++) {
            if (kind === "pdf") renderPdfHit(hits[c2]);
            else renderYtHit(hits[c2]);
          }
          html += "</div>";
        }
      }

      if (pdfHits.length && ytHits.length) {
        var pdfTabId = "seminar-search-tab-" + i + "-pdf";
        var ytTabId = "seminar-search-tab-" + i + "-yt";
        html += '<ul class="nav nav-tabs seminar-search-tabs" role="tablist">';
        html +=
          '<li role="presentation"' +
          (activeKind === "pdf" ? ' class="active"' : "") +
          '><a href="#' +
          pdfTabId +
          '" role="tab" data-toggle="tab">📄 Slides</a></li>';
        html +=
          '<li role="presentation"' +
          (activeKind === "yt" ? ' class="active"' : "") +
          '><a href="#' +
          ytTabId +
          '" role="tab" data-toggle="tab">📺 Video</a></li>';
        html += "</ul>";
        html += '<div class="tab-content">';

        html +=
          '<div role="tabpanel" class="tab-pane seminar-search-tabpane' +
          (activeKind === "pdf" ? " active" : "") +
          '" id="' +
          pdfTabId +
          '">';
        renderHitsPane("pdf", pdfHits, pdfTabId);
        html += "</div>";

        html +=
          '<div role="tabpanel" class="tab-pane seminar-search-tabpane' +
          (activeKind === "yt" ? " active" : "") +
          '" id="' +
          ytTabId +
          '">';
        renderHitsPane("yt", ytHits, ytTabId);
        html += "</div>";

        html += "</div>";
      } else if (pdfHits.length) {
        renderHitsPane("pdf", pdfHits, null);
      } else if (ytHits.length) {
        renderHitsPane("yt", ytHits, null);
      }

      html += "</div></div>";
    }

    resultsEl.innerHTML = html;
    wireToggles();
  }

  function wireToggles() {
    var toggles = resultsEl.querySelectorAll("a.seminar-search-toggle");
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener("click", function (e) {
        e.preventDefault();
        var targetId = this.getAttribute("data-target");
        if (!targetId) return;
        var el = document.getElementById(targetId);
        if (!el) return;
        var expanded = this.getAttribute("data-expanded") === "1";
        if (expanded) {
          el.style.display = "none";
          this.setAttribute("data-expanded", "0");
          this.textContent = this.getAttribute("data-show-more") || "Show more";
        } else {
          el.style.display = "block";
          this.setAttribute("data-expanded", "1");
          this.textContent = this.getAttribute("data-show-less") || "Show less";
        }
      });
    }
  }

  function countOccurrences(hay, needle) {
    if (!needle) return 0;
    var count = 0;
    var idx = 0;
    while (true) {
      idx = hay.indexOf(needle, idx);
      if (idx === -1) break;
      count++;
      idx += needle.length || 1;
    }
    return count;
  }

  function scoreFromStats(totalFreq, minPos, maxPos, phraseHits) {
    var spread = isFinite(minPos) && isFinite(maxPos) ? Math.max(0, maxPos - minPos) : 99999;
    var closeness = spread < 99999 ? 6 / (1 + spread / 80) : 0;
    return totalFreq * 10 + phraseHits * 60 + closeness;
  }

  function titleSpeakerBoost(group, rawTokens) {
    var speaker = String(group.speaker || "").toLowerCase();
    var title = String(group.title || "").toLowerCase();
    var dateStr = "";
    if (group.dateMs) {
      try {
        var d = new Date(group.dateMs);
        dateStr = (d.toISOString ? d.toISOString().slice(0, 10) : "") + " " + d.toLocaleDateString();
        dateStr = dateStr.toLowerCase();
      } catch (e) {
        dateStr = "";
      }
    }
    var boost = 0;
    for (var i = 0; i < rawTokens.length; i++) {
      var tok = String(rawTokens[i] || "").toLowerCase();
      if (!tok) continue;
      if (speaker.indexOf(tok) !== -1) boost += 35;
      if (title.indexOf(tok) !== -1) boost += 50;
      if (dateStr && dateStr.indexOf(tok) !== -1) boost += 25;
    }
    return boost;
  }

  function legacyTermsAndPhrases(parsed) {
    var terms = [];
    var phrases = [];
    for (var i = 0; i < (parsed.atoms || []).length; i++) {
      var a = parsed.atoms[i];
      if (!a || !a.raw) continue;
      if (a.kind === "phrase") phrases.push(String(a.raw));
      else if (a.kind === "term") terms.push(String(a.raw));
    }
    return {
      termsLower: terms.map(function (t) { return String(t || "").toLowerCase(); }).filter(Boolean),
      phrasesLower: phrases.map(function (p) { return String(p || "").toLowerCase(); }).filter(Boolean)
    };
  }

  function evalAstText(ast, textLower) {
    if (!ast) return false;
    if (ast.type === "term") return textLower.indexOf(String(ast.raw || "").toLowerCase()) !== -1;
    if (ast.type === "phrase") return textLower.indexOf(String(ast.raw || "").toLowerCase()) !== -1;
    if (ast.type === "not") return !evalAstText(ast.child, textLower);
    if (ast.type === "and") {
      var items = ast.items || [];
      for (var i = 0; i < items.length; i++) {
        if (!evalAstText(items[i], textLower)) return false;
      }
      return true;
    }
    if (ast.type === "or") {
      var items2 = ast.items || [];
      for (var j = 0; j < items2.length; j++) {
        if (evalAstText(items2[j], textLower)) return true;
      }
      return false;
    }
    return false;
  }

  function mapUnion(a, b) {
    var out = Object.create(null);
    for (var k in a) out[k] = a[k];
    for (var k2 in b) {
      if (!out[k2]) out[k2] = b[k2];
      else {
        var x = out[k2];
        var y = b[k2];
        x.totalFreq += y.totalFreq;
        x.phraseHits += y.phraseHits;
        if (y.minPos < x.minPos) x.minPos = y.minPos;
        if (y.maxPos > x.maxPos) x.maxPos = y.maxPos;
      }
    }
    return out;
  }

  function mapIntersect(a, b) {
    var out = Object.create(null);
    for (var k in a) {
      if (!b[k]) continue;
      var x = a[k];
      var y = b[k];
      out[k] = {
        totalFreq: x.totalFreq + y.totalFreq,
        phraseHits: x.phraseHits + y.phraseHits,
        minPos: Math.min(x.minPos, y.minPos),
        maxPos: Math.max(x.maxPos, y.maxPos),
      };
    }
    return out;
  }

  function mapDiff(universe, b) {
    var out = Object.create(null);
    for (var k in universe) {
      if (!b[k]) out[k] = universe[k];
    }
    return out;
  }

  function mapSize(m) {
    var n = 0;
    for (var _ in m) n++;
    return n;
  }

  var MAX_MATCH_KEYS = 20000;

  function mapUnionCapped(a, b) {
    var out = Object.create(null);
    var n = 0;
    for (var k in a) {
      out[k] = a[k];
      n++;
      if (n >= MAX_MATCH_KEYS) return { map: out, capped: true };
    }
    for (var k2 in b) {
      if (!out[k2]) {
        out[k2] = b[k2];
        n++;
        if (n >= MAX_MATCH_KEYS) return { map: out, capped: true };
      } else {
        var x = out[k2];
        var y = b[k2];
        x.totalFreq += y.totalFreq;
        x.phraseHits += y.phraseHits;
        if (y.minPos < x.minPos) x.minPos = y.minPos;
        if (y.maxPos > x.maxPos) x.maxPos = y.maxPos;
      }
    }
    return { map: out, capped: false };
  }

  function mapIntersectSmart(a, b) {
    var sa = mapSize(a);
    var sb = mapSize(b);
    if (sa === 0 || sb === 0) return Object.create(null);
    if (sa <= sb) return mapIntersect(a, b);
    return mapIntersect(b, a);
  }

  function evalAst(ast, atomMapByKey, universe) {
    function evalNode(node) {
      if (!node) return { map: Object.create(null), capped: false };
      if (node.type === "term") {
        return { map: atomMapByKey["term:" + node.raw] || Object.create(null), capped: false };
      }
      if (node.type === "phrase") {
        return { map: atomMapByKey["phrase:" + node.raw] || Object.create(null), capped: false };
      }
      if (node.type === "not") {
        var child = evalNode(node.child);
        return { map: mapDiff(universe, child.map), capped: child.capped };
      }
      if (node.type === "and") {
        var items = node.items || [];
        if (!items.length) return { map: Object.create(null), capped: false };
        // Evaluate in increasing size order for faster intersection.
        var evals = [];
        for (var i = 0; i < items.length; i++) {
          var r = evalNode(items[i]);
          evals.push(r);
          if (mapSize(r.map) === 0) return { map: Object.create(null), capped: false };
        }
        evals.sort(function (a, b) {
          return mapSize(a.map) - mapSize(b.map);
        });
        var cur = evals[0];
        for (var j = 1; j < evals.length; j++) {
          cur = { map: mapIntersectSmart(cur.map, evals[j].map), capped: cur.capped || evals[j].capped };
          if (mapSize(cur.map) === 0) return { map: Object.create(null), capped: false };
        }
        return cur;
      }
      if (node.type === "or") {
        var items = node.items || [];
        if (!items.length) return { map: Object.create(null), capped: false };
        // Evaluate larger first; short-circuit if capped early.
        var parts = [];
        for (var i2 = 0; i2 < items.length; i2++) {
          parts.push(evalNode(items[i2]));
        }
        parts.sort(function (a, b) {
          return mapSize(b.map) - mapSize(a.map);
        });
        var acc = { map: Object.create(null), capped: false };
        for (var k = 0; k < parts.length; k++) {
          var u = mapUnionCapped(acc.map, parts[k].map);
          acc = { map: u.map, capped: acc.capped || parts[k].capped || u.capped };
          if (acc.capped) return acc;
        }
        return acc;
      }
      return { map: Object.create(null), capped: false };
    }

    return evalNode(ast);
  }

  function searchPdfIndex(pdfData, parsed) {
    var groupsByKey = Object.create(null);
    if (pdfData._legacy) {
      var legacy = legacyTermsAndPhrases(parsed);
      var needlesLower = legacy.termsLower.concat(legacy.phrasesLower);

      for (var di = 0; di < (pdfData.docs || []).length; di++) {
        var doc = pdfData.docs[di];
        var hits = [];
        var pagesLower = doc._pagesLower || [];
        for (var p = 0; p < pagesLower.length; p++) {
          var hay = pagesLower[p];
          if (!evalAstText(parsed.ast, hay)) continue;

          var pageText = String((doc.pages || [])[p] || "");
          var snippet = bestDenseSnippet(pageText, needlesLower);

          var totalFreq = 0;
          var phraseHits = 0;
          for (var ni = 0; ni < needlesLower.length; ni++) {
            totalFreq += countOccurrences(hay, needlesLower[ni]);
          }
          for (var pi = 0; pi < legacy.phrasesLower.length; pi++) {
            phraseHits += countOccurrences(hay, legacy.phrasesLower[pi]);
          }
          var score = totalFreq * 10 + phraseHits * 60;

          hits.push({ page: p + 1, snippet: snippet, score: score });
          if (hits.length >= 8) break;
        }
        if (!hits.length) continue;

        var meta = talkMeta && talkMeta.byPdfFile ? talkMeta.byPdfFile[doc.file] : null;
        var groupKey = (meta && meta.label) || doc.file;
        if (!groupsByKey[groupKey]) {
          groupsByKey[groupKey] = {
            label: (meta && meta.label) || doc.file,
            speaker: (meta && meta.speaker) || "",
            title: (meta && meta.title) || "",
            anchorId: (meta && meta.anchorId) || "",
            dateMs: (meta && meta.dateMs) || null,
            pdfFile: doc.file,
            videoId: (meta && meta.videoId) || null,
            pdfHits: [],
            ytHits: [],
            score: 0,
          };
        }
        groupsByKey[groupKey].pdfHits = groupsByKey[groupKey].pdfHits.concat(hits);
      }

      for (var gk0 in groupsByKey) {
        groupsByKey[gk0].pdfHits.sort(function (a, b) {
          return (b.score || 0) - (a.score || 0);
        });
      }
      return groupsByKey;
    }

    var inv = pdfData.inv || {};
    var docs = pdfData.docs || [];
    var needlesLower2 = normalizeNeedles(parsed.highlightTokens || []);

    function atomMapForTerm(rawTerm) {
      var stem = stemToken(rawTerm);
      var postings = inv[stem] || [];
      var m = Object.create(null);
      for (var i = 0; i < postings.length; i++) {
        var post = postings[i];
        var docIdx = post[0];
        var page = post[1];
        var pos = post[2];
        var freq = post[3];
        var key = docIdx + ":" + page;
        var cur = m[key];
        if (!cur) {
          cur = { totalFreq: 0, phraseHits: 0, minPos: Infinity, maxPos: -Infinity };
          m[key] = cur;
        }
        cur.totalFreq += Number(freq) || 0;
        if (isFinite(pos)) {
          if (pos < cur.minPos) cur.minPos = pos;
          if (pos > cur.maxPos) cur.maxPos = pos;
        }
      }
      return m;
    }

    function atomMapForPhrase(phrase) {
      var toks = tokenize(phrase);
      if (!toks.length) return Object.create(null);
      var m = null;
      for (var i = 0; i < toks.length; i++) {
        var tm = atomMapForTerm(toks[i]);
        m = m === null ? tm : mapIntersect(m, tm);
      }
      m = m || Object.create(null);
      var filtered = Object.create(null);
      var phrLower = String(phrase || "").toLowerCase();
      for (var key in m) {
        var parts = key.split(":");
        var docIdx = Number(parts[0]);
        var page = Number(parts[1]);
        var doc = docs[docIdx];
        if (!doc) continue;
        var pageText = String((doc.pages || [])[page - 1] || "");
        var pageLower = pageText.toLowerCase();
        if (pageLower.indexOf(phrLower) === -1) continue;
        var stats = m[key];
        filtered[key] = {
          totalFreq: stats.totalFreq,
          phraseHits: countOccurrences(pageLower, phrLower),
          minPos: stats.minPos,
          maxPos: stats.maxPos,
        };
      }
      return filtered;
    }

    var atomMapByKey = Object.create(null);
    var universe = Object.create(null);
    for (var ai = 0; ai < parsed.atoms.length; ai++) {
      var a = parsed.atoms[ai];
      var k = a.kind + ":" + a.raw;
      if (!atomMapByKey[k]) {
        atomMapByKey[k] = a.kind === "phrase" ? atomMapForPhrase(a.raw) : atomMapForTerm(a.raw);
      }
    }
    for (var pi = 0; pi < parsed.positiveAtoms.length; pi++) {
      var p = parsed.positiveAtoms[pi];
      var pk = p.kind + ":" + p.raw;
      universe = mapUnion(universe, atomMapByKey[pk] || Object.create(null));
    }

    if (!parsed.positiveAtoms.length && parsed.raw.toUpperCase().indexOf("NOT") !== -1) {
      return { __error: "Queries with NOT must include at least one positive term (e.g. foo NOT bar)." };
    }

    var evalRes = evalAst(parsed.ast, atomMapByKey, universe);
    var matched = evalRes.map;

    for (var key in matched) {
      var parts = key.split(":");
      var docIdx = Number(parts[0]);
      var page = Number(parts[1]);
      var doc = docs[docIdx];
      if (!doc) continue;

      var pageText = String((doc.pages || [])[page - 1] || "");
      var snippet = bestDenseSnippet(pageText, needlesLower2);
      var stats = matched[key];
      var score = scoreFromStats(stats.totalFreq, stats.minPos, stats.maxPos, stats.phraseHits);
      var section = (doc.sections && doc.sections[page - 1]) ? doc.sections[page - 1] : "";

      var meta = talkMeta && talkMeta.byPdfFile ? talkMeta.byPdfFile[doc.file] : null;
      var groupKey = (meta && meta.label) || doc.file;
      if (!groupsByKey[groupKey]) {
        groupsByKey[groupKey] = {
          label: (meta && meta.label) || doc.file,
          speaker: (meta && meta.speaker) || "",
          title: (meta && meta.title) || "",
          anchorId: (meta && meta.anchorId) || "",
          dateMs: (meta && meta.dateMs) || null,
          pdfFile: doc.file,
          videoId: (meta && meta.videoId) || null,
          pdfHits: [],
          ytHits: [],
          score: 0,
        };
      }
      groupsByKey[groupKey].pdfHits.push({ page: page, snippet: snippet, score: score, section: section });
    }

    for (var gk in groupsByKey) {
      groupsByKey[gk].pdfHits.sort(function (a, b) {
        return (b.score || 0) - (a.score || 0);
      });
    }

    return groupsByKey;
  }

  function searchYouTubeIndex(ytData, parsed) {
    var groupsByKey = Object.create(null);
    if (ytData._legacy) {
      var legacy = legacyTermsAndPhrases(parsed);
      var needlesLower = legacy.termsLower.concat(legacy.phrasesLower);

      for (var vi = 0; vi < (ytData.videos || []).length; vi++) {
        var video = ytData.videos[vi];
        var hits = [];
        var segmentsLower = video._segmentsLower || [];
        for (var si = 0; si < segmentsLower.length; si++) {
          var hay = segmentsLower[si];
          if (!evalAstText(parsed.ast, hay)) continue;

          var seg = (video.segments || [])[si] || {};
          var segText = String(seg.text || "");
          var snippet = bestDenseSnippet(segText, needlesLower);

          var totalFreq = 0;
          var phraseHits = 0;
          for (var ni = 0; ni < needlesLower.length; ni++) {
            totalFreq += countOccurrences(hay, needlesLower[ni]);
          }
          for (var pi = 0; pi < legacy.phrasesLower.length; pi++) {
            phraseHits += countOccurrences(hay, legacy.phrasesLower[pi]);
          }
          var score = totalFreq * 10 + phraseHits * 60;

          hits.push({ start: seg.start, snippet: snippet, score: score });
          if (hits.length >= 8) break;
        }
        if (!hits.length) continue;

        var meta = talkMeta && talkMeta.byVideoId ? talkMeta.byVideoId[video.id] : null;
        var groupKey = (meta && meta.label) || video.title || video.id;
        if (!groupsByKey[groupKey]) {
          groupsByKey[groupKey] = {
            label: (meta && meta.label) || video.title || video.id,
            speaker: (meta && meta.speaker) || "",
            title: (meta && meta.title) || "",
            anchorId: (meta && meta.anchorId) || "",
            dateMs: (meta && meta.dateMs) || null,
            pdfFile: (meta && meta.pdfFile) || null,
            videoId: video.id,
            pdfHits: [],
            ytHits: [],
            score: 0,
          };
        }
        groupsByKey[groupKey].ytHits = groupsByKey[groupKey].ytHits.concat(hits);
      }

      for (var gk0 in groupsByKey) {
        groupsByKey[gk0].ytHits.sort(function (a, b) {
          return (b.score || 0) - (a.score || 0);
        });
      }
      return groupsByKey;
    }

    var inv = ytData.inv || {};
    var videos = ytData.videos || [];
    var needlesLower2 = normalizeNeedles(parsed.highlightTokens || []);

    function atomMapForTerm(rawTerm) {
      var stem = stemToken(rawTerm);
      var postings = inv[stem] || [];
      var m = Object.create(null);
      for (var i = 0; i < postings.length; i++) {
        var post = postings[i];
        var videoIdx = post[0];
        var segIdx = post[1];
        var pos = post[2];
        var freq = post[3];
        var key = videoIdx + ":" + segIdx;
        var cur = m[key];
        if (!cur) {
          cur = { totalFreq: 0, phraseHits: 0, minPos: Infinity, maxPos: -Infinity };
          m[key] = cur;
        }
        cur.totalFreq += Number(freq) || 0;
        if (isFinite(pos)) {
          if (pos < cur.minPos) cur.minPos = pos;
          if (pos > cur.maxPos) cur.maxPos = pos;
        }
      }
      return m;
    }

    function atomMapForPhrase(phrase) {
      var toks = tokenize(phrase);
      if (!toks.length) return Object.create(null);
      var m = null;
      for (var i = 0; i < toks.length; i++) {
        var tm = atomMapForTerm(toks[i]);
        m = m === null ? tm : mapIntersect(m, tm);
      }
      m = m || Object.create(null);
      var filtered = Object.create(null);
      var phrLower = String(phrase || "").toLowerCase();
      for (var key in m) {
        var parts = key.split(":");
        var videoIdx = Number(parts[0]);
        var segIdx = Number(parts[1]);
        var video = videos[videoIdx];
        if (!video) continue;
        var seg = (video.segments || [])[segIdx] || {};
        var segText = String(seg.text || "");
        var segLower = segText.toLowerCase();
        if (segLower.indexOf(phrLower) === -1) continue;
        var stats = m[key];
        filtered[key] = {
          totalFreq: stats.totalFreq,
          phraseHits: countOccurrences(segLower, phrLower),
          minPos: stats.minPos,
          maxPos: stats.maxPos,
        };
      }
      return filtered;
    }

    var atomMapByKey = Object.create(null);
    var universe = Object.create(null);
    for (var ai = 0; ai < parsed.atoms.length; ai++) {
      var a = parsed.atoms[ai];
      var k = a.kind + ":" + a.raw;
      if (!atomMapByKey[k]) {
        atomMapByKey[k] = a.kind === "phrase" ? atomMapForPhrase(a.raw) : atomMapForTerm(a.raw);
      }
    }
    for (var pi = 0; pi < parsed.positiveAtoms.length; pi++) {
      var p = parsed.positiveAtoms[pi];
      var pk = p.kind + ":" + p.raw;
      universe = mapUnion(universe, atomMapByKey[pk] || Object.create(null));
    }

    if (!parsed.positiveAtoms.length && parsed.raw.toUpperCase().indexOf("NOT") !== -1) {
      return { __error: "Queries with NOT must include at least one positive term (e.g. foo NOT bar)." };
    }

    var evalRes = evalAst(parsed.ast, atomMapByKey, universe);
    var matched = evalRes.map;

    for (var key in matched) {
      var parts = key.split(":");
      var videoIdx = Number(parts[0]);
      var segIdx = Number(parts[1]);
      var video = videos[videoIdx];
      if (!video) continue;
      var seg = (video.segments || [])[segIdx] || {};
      var segText = String(seg.text || "");
      var snippet = bestDenseSnippet(segText, needlesLower2);
      var stats = matched[key];
      var score = scoreFromStats(stats.totalFreq, stats.minPos, stats.maxPos, stats.phraseHits);
      var section = (video.sections && video.sections[segIdx]) ? video.sections[segIdx] : "";

      var meta = talkMeta && talkMeta.byVideoId ? talkMeta.byVideoId[video.id] : null;
      var groupKey = (meta && meta.label) || video.title || video.id;
      if (!groupsByKey[groupKey]) {
        groupsByKey[groupKey] = {
          label: (meta && meta.label) || video.title || video.id,
          speaker: (meta && meta.speaker) || "",
          title: (meta && meta.title) || "",
          anchorId: (meta && meta.anchorId) || "",
          dateMs: (meta && meta.dateMs) || null,
          pdfFile: (meta && meta.pdfFile) || null,
          videoId: video.id,
          pdfHits: [],
          ytHits: [],
          score: 0,
        };
      }
      groupsByKey[groupKey].ytHits.push({ start: seg.start, snippet: snippet, score: score, section: section });
    }

    for (var gk in groupsByKey) {
      groupsByKey[gk].ytHits.sort(function (a, b) {
        return (b.score || 0) - (a.score || 0);
      });
    }

    return groupsByKey;
  }

  function doSearch(query) {
    query = String(query || "").trim();
    if (query.length < 2) {
      setStatus("");
      clearResults();
      return;
    }

    var parsed = parseBooleanQuery(query);
    if (parsed && parsed.error) {
      setStatus(parsed.error);
      clearResults();
      return;
    }
    if (!parsed || !parsed.atoms || !parsed.atoms.length) {
      setStatus("");
      clearResults();
      return;
    }

    setStatus("Searching\u2026");

    if (!talkMeta) talkMeta = buildTalkMeta();

    var pdfP = loadPdfIndex().then(
      function (data) {
        return data;
      },
      function () {
        return null;
      }
    );

    var ytP = loadYouTubeIndex().then(
      function (data) {
        return data;
      },
      function () {
        return null;
      }
    );

    Promise.all([pdfP, ytP]).then(function (pair) {
      var pdfData = pair[0];
      var ytData = pair[1];

      if (!pdfData && !ytData) {
        var msg = "Search indexes not available.";
        if (pdfIndexError || ytIndexError) {
          msg +=
            " " +
            [pdfIndexError, ytIndexError].filter(Boolean).join("; ") +
            ".";
        }
        setStatus(msg);
        clearResults();
        return;
      }

      var byKey = Object.create(null);
      var hasAny = false;

      if (pdfData) {
        var pdfGroups = searchPdfIndex(pdfData, parsed);
        if (pdfGroups && pdfGroups.__error) {
          setStatus(pdfGroups.__error);
          clearResults();
          return;
        }
        for (var k in pdfGroups) {
          byKey[k] = pdfGroups[k];
          hasAny = true;
        }
      }

      if (ytData) {
        var ytGroups = searchYouTubeIndex(ytData, parsed);
        if (ytGroups && ytGroups.__error) {
          setStatus(ytGroups.__error);
          clearResults();
          return;
        }
        for (var k2 in ytGroups) {
          if (byKey[k2]) {
            if (!byKey[k2].videoId) byKey[k2].videoId = ytGroups[k2].videoId;
            if (!byKey[k2].pdfFile) byKey[k2].pdfFile = ytGroups[k2].pdfFile;
            if (!byKey[k2].speaker) byKey[k2].speaker = ytGroups[k2].speaker || "";
            if (!byKey[k2].title) byKey[k2].title = ytGroups[k2].title || "";
            if (!byKey[k2].anchorId) byKey[k2].anchorId = ytGroups[k2].anchorId || "";
            if (!byKey[k2].dateMs) byKey[k2].dateMs = ytGroups[k2].dateMs || null;
            byKey[k2].ytHits = (byKey[k2].ytHits || []).concat(ytGroups[k2].ytHits || []);
          } else {
            byKey[k2] = ytGroups[k2];
          }
          hasAny = true;
        }
      }

      if (!hasAny) {
        setStatus("No matches");
        clearResults();
        return;
      }

      var groups = [];
      for (var kk in byKey) {
        var g = byKey[kk];
        var combinedScores = [];
        for (var i1 = 0; i1 < 3 && g.pdfHits && g.pdfHits[i1]; i1++) {
          combinedScores.push(Number(g.pdfHits[i1].score) || 0);
        }
        for (var i2 = 0; i2 < 3 && g.ytHits && g.ytHits[i2]; i2++) {
          combinedScores.push(Number(g.ytHits[i2].score) || 0);
        }
        combinedScores.sort(function (a, b) {
          return b - a;
        });
        var sumTop = 0;
        for (var i3 = 0; i3 < 3 && i3 < combinedScores.length; i3++) sumTop += combinedScores[i3];
        g.score = sumTop + titleSpeakerBoost(g, parsed.highlightTokens || []);
        groups.push(g);
      }

      var availability = "";
      if (pdfData && ytData) availability = "";
      else if (pdfData) availability = "PDF only" + (ytIndexError ? " \u2014 " + ytIndexError : "");
      else if (ytData) availability = "YouTube only" + (pdfIndexError ? " \u2014 " + pdfIndexError : "");

      var note = "";
      if (groups.length >= MAX_MATCH_KEYS) note = "Refine your query.";
      render(groups, availability + (note ? " \u2014 " + note : ""), parsed.highlightTokens);
    }).catch(function (err) {
      setStatus("Search failed");
      clearResults();
      if (window && window.console && window.console.error) window.console.error(err);
    });
  }

  function debounce(fn, delayMs) {
    var timer = null;
    return function () {
      var args = arguments;
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(null, args);
      }, delayMs);
    };
  }

  var debounced = debounce(function () {
    doSearch(input.value);
  }, 250);

  input.addEventListener("input", debounced);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch(input.value);
    }
  });
  sortControlsEl.addEventListener("change", function (e) {
    var t = e && e.target;
    if (t && t.name === "seminar-pdf-search-sort") doSearch(input.value);
  });
})();
