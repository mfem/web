/* ------------------------------------------------------------------------
   dfem-map.js — interactive map between the weak form and the code.

   Ties three representations of the same operator together:

     1. the weak form and its quadrature-point form   (maths, tagged in TeX
        with \class{dm-KEY}{...})
     2. the operator decomposition                    (maths, same tagging)
     3. the C++ sample already on the page            (code, tagged by the
        text ranges declared in BLOCKS below)

   Hovering, tapping or keyboard-focusing any tagged region highlights every
   peer region across all three, and explains the correspondence.

   The page is authored normally: the equations stay TeX, the code sample
   stays an ordinary ```c++ fence.

   Loaded by src/dfem.md alone, not site-wide. It also returns immediately
   unless the page contains a #dm container, so including it anywhere else
   would still cost nothing but the request.
   ------------------------------------------------------------------------ */
(function () {
   "use strict";

   /* --- the concepts being mapped ---------------------------------------
      `key`   matches \class{dm-KEY}{...} in the maths and the code ranges
      `label` short name, used on the legend chips
      `math`  how it reads in the weak form
      `note`  the explanation shown in the caption bar

      To add a concept there are four places, and no more:
        1. here,
        2. \class{dm-KEY}{...} around the terms in the page's TeX,
        3. its needles in BLOCKS[].ranges below,
        4. one colour line in dfem-map.css (--hl-bg / --hl-fg), plus the
           caption badge and chip swatch beside it.                        */
   var CONCEPTS = [
      {
         key: "domain", label: "∫Ω", math: "the integral over the domain",
         note: "The domain, and the rule the integral is evaluated with. Neither is " +
               "part of the physics: they reach the integrator as an IntegrationRule " +
               "and a set of mesh attributes."
      },
      {
         key: "evalB", label: "B G P", math: "evaluation at the quadrature points",
         note: "The topological half of the decomposition — prolongation, gather, and " +
               "interpolation to the quadrature points. The input FieldDescriptors name " +
               "the spaces that fix P and G, and Inputs<...> is the B: each entry names " +
               "one thing the kernel wants to see at a point."
      },
      {
         key: "qf", label: "D", math: "the pointwise physics",
         note: "D, the only part you write and the only part that is differentiated. " +
               "A struct with a const call operator, taking the Inputs in order, then " +
               "the outputs as non-const references."
      },
      {
         key: "kappa", label: "κ(u)", math: "the nonlinear coefficient",
         note: "The coefficient depends on the solution value, so the value is requested " +
               "with Value<U> and arrives as the scalar argument u. This dependence is " +
               "what makes the operator nonlinear — and what Derivatives<U> " +
               "differentiates through."
      },
      {
         key: "gradu", label: "∇u", math: "the physical solution gradient",
         note: "Gradient<U> delivers the gradient in REFERENCE coordinates, as dudxi. " +
               "The pullback is yours to do in the kernel: ∇ₓu = ∇ξu J⁻¹, written " +
               "dudxi * invJ."
      },
      {
         key: "test", label: "∇v", math: "the test function gradient",
         note: "You never write the test function. Outputs<Gradient<U>> declares which " +
               "basis the result is contracted against — the Bᵀ Gᵀ Pᵀ of the " +
               "decomposition — and dvdxi is the value handed to it. The transpose(invJ) " +
               "is the matching pullback for ∇v."
      },
      {
         key: "measure", label: "dx", math: "the measure and the geometry",
         note: "The measure is not applied for you: the q-function has to include it. " +
               "Gradient<Coords> gives the Jacobian J and Weight the rule's w — for " +
               "volume elements that makes det(J) w. For the general case see",
         ref:  { text: "weight() in linalg/tensor.hpp",
                 href: "https://github.com/mfem/mfem/blob/7b85e1e9c178a5208683c77ca64ba6b64f437466/linalg/tensor.hpp#L1275" }
      }
   ];

   /* --- which text in the code sample belongs to which concept ----------
      A block is found by `id` if the page provides one, otherwise by the
      first code block whose text contains `signature`.

      Each range is [key, needle, nth?, after?]:
        needle  a string (indexOf) or a RegExp
        nth     which occurrence, default the first
        after   only search beyond the first occurrence of this anchor,
                which keeps a needle unambiguous without depending on how
                the sample happens to be split up.

      Ranges must not overlap. Misses are reported to the console rather
      than throwing, so an edited sample degrades to "this bit no longer
      highlights" instead of a broken page.                                */
   var BLOCKS = [{
      id: "code-example",
      signature: "struct NonlinearDiffusion\n",
      ranges: [
         /* the q-function */
         ["qf",      "struct NonlinearDiffusion"],
         ["kappa",   "const real_t &u,"],
         ["kappa",   "// Value<U>"],
         ["gradu",   "const tensor<real_t, dim> &dudxi,"],
         ["gradu",   "// Gradient<U>"],
         ["measure", "const tensor<real_t, dim, dim> &J,"],
         ["measure", "// Gradient<Coords>"],
         ["measure", "const real_t &w,"],
         ["measure", "// Weight"],
         ["test",    "tensor<real_t, dim> &dvdxi) const"],
         ["test",    "// the output"],
         ["measure", "const auto invJ = inv(J);"],
         ["gradu",   "const auto dudx = dudxi * invJ;"],
         ["kappa",   "const auto kappa = 1.0_r + u * u;"],
         ["test",    "dvdxi ="],
         ["kappa",   /\bkappa\b/, 1],
         ["gradu",   /\bdudx\b/, 1],
         ["test",    "transpose(invJ)"],
         ["measure", "det(J) * w"],

         /* the pieces it is built on */
         ["measure", "pmesh.GetNodes()->ParFESpace()"],
         ["domain",  "const IntegrationRule &ir"],
         ["domain",  "Array<int> all_domain_attr("],
         ["evalB",   "std::vector<FieldDescriptor> inputs"],
         ["test",    "std::vector<FieldDescriptor> outputs"],

         /* registering it */
         ["qf",      "NonlinearDiffusion qf;"],
         ["qf",      "qf,"],
         ["evalB",   "Inputs"],
         ["kappa",   "Value<U>", 0, "Inputs<"],
         ["gradu",   "Gradient<U>,"],
         ["measure", "Gradient<Coords>", 0, "Inputs<"],
         ["measure", "Weight", 0, "Inputs<"],
         ["test",    "Outputs<Gradient<U>> {}"],
         ["domain",  "ir, all_domain_attr"]
      ]
   }];

   var byKey = {};
   for (var i = 0; i < CONCEPTS.length; i++) { byKey[CONCEPTS[i].key] = CONCEPTS[i]; }

   /* ---------------------------------------------------------------- utils */

   /* Captions are written as plain text and go in through innerHTML, so the
      type names in them have to be escaped: unescaped, "Value<U>" is parsed
      as a <u> tag and disappears, taking the rest of the sentence into an
      underline with it. Links are declared with a concept's `ref` instead,
      so the only markup in a caption is markup someone meant.             */
   function esc(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
   }

   function closestTagged(node, root) {
      while (node && node !== root) {
         if (node.nodeType === 1 && node.getAttribute("data-dm")) { return node; }
         node = node.parentNode;
      }
      return null;
   }

   /* MathJax's AssistiveMML mirrors the whole expression into a hidden MathML
      subtree, classes and all. Those copies must not become hover targets. */
   function inAssistiveMathML(node) {
      while (node && node.nodeType === 1) {
         var cls = node.getAttribute && node.getAttribute("class");
         if (cls && cls.indexOf("MJX_Assistive_MathML") >= 0) { return true; }
         node = node.parentNode;
      }
      return false;
   }

   function textNodesOf(root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      var out = [], n;
      while ((n = walker.nextNode())) { out.push(n); }
      return out;
   }

   /* Locate the nth occurrence of `needle` in `text`, as [start, end). */
   function locate(text, needle, nth, after) {
      nth = nth || 0;
      var from = 0;
      if (after) {
         var anchor = text.indexOf(after);
         if (anchor < 0) { return null; }
         from = anchor + after.length;
      }
      if (typeof needle === "string") {
         var at = from - 1;
         for (var k = 0; k <= nth; k++) {
            at = text.indexOf(needle, at + 1);
            if (at < 0) { return null; }
         }
         return [at, at + needle.length];
      }
      var re = new RegExp(needle.source, "g");
      re.lastIndex = from;
      var m, seen = 0;
      while ((m = re.exec(text)) !== null) {
         if (seen === nth) { return [m.index, m.index + m[0].length]; }
         seen++;
         if (m.index === re.lastIndex) { re.lastIndex++; }
      }
      return null;
   }

   /* Wrap [start, end) of `root`'s text in <span data-dm="key">, splitting
      text nodes as needed. A range routinely cuts across the spans
      highlight.js produced, so it may become several wrappers sharing one
      key — which is why code highlights are drawn as a band rather than a
      box, so neighbouring fragments merge into one mark.                  */
   function tagRange(root, start, end, key) {
      var nodes = textNodesOf(root), pos = 0, jobs = [], i, n, len, s, e;
      for (i = 0; i < nodes.length; i++) {
         n = nodes[i]; len = n.nodeValue.length; s = pos; e = pos + len; pos = e;
         if (e <= start || s >= end) { continue; }
         jobs.push({ node: n, from: Math.max(0, start - s), to: Math.min(len, end - s) });
      }
      for (i = 0; i < jobs.length; i++) {
         var j = jobs[i], target = j.node;
         if (j.to < target.nodeValue.length) { target.splitText(j.to); }
         if (j.from > 0) { target = target.splitText(j.from); }
         var span = document.createElement("span");
         span.className = "dm-hit";
         span.setAttribute("data-dm", key);
         target.parentNode.insertBefore(span, target);
         span.appendChild(target);
      }
   }

   function findBlock(spec) {
      var el = spec.id && document.getElementById(spec.id);
      if (el) { return el; }
      var all = document.querySelectorAll("pre code"), i;
      for (i = 0; i < all.length; i++) {
         if (all[i].textContent.indexOf(spec.signature) >= 0) { return all[i]; }
      }
      return null;
   }

   function tagBlock(block, ranges, warn) {
      var text = block.textContent, spans = [], i, spec, at;
      for (i = 0; i < ranges.length; i++) {
         spec = ranges[i];
         at = locate(text, spec[1], spec[2], spec[3]);
         if (!at) { warn("no match for " + spec[1]); continue; }
         spans.push({ key: spec[0], start: at[0], end: at[1] });
      }
      spans.sort(function (a, b) { return a.start - b.start; });
      for (i = 1; i < spans.length; i++) {
         if (spans[i - 1].end > spans[i].start) {
            warn("overlapping ranges near offset " + spans[i].start);
         }
      }
      for (i = 0; i < spans.length; i++) {
         tagRange(block, spans[i].start, spans[i].end, spans[i].key);
      }
   }

   /* ------------------------------------------------------------- behaviour */

   function init() {
      var root = document.getElementById("dm");
      if (!root || root.getAttribute("data-ready")) { return; }

      function warn(msg) {
         if (window.console && console.warn) { console.warn("dfem-map: " + msg); }
      }

      /* 1. Colour the code. initHighlighting is one-shot and guarded by its
            own `called` flag, so calling it here both guarantees the sample
            is highlighted before it is tagged and turns the theme's own
            later call into a no-op — no race with base.js.                */
      if (window.hljs && window.hljs.initHighlighting) {
         window.hljs.initHighlighting();
      }

      /* 2. Adopt the page's own code sample as the second column, so the
            sample is never duplicated in the source.                      */
      var body = document.getElementById("dm-body");
      var spec = BLOCKS[0];
      var block = findBlock(spec);
      if (block && body) {
         var pre = block.parentNode;
         var col = document.createElement("div");
         col.className = "dm-col dm-col-code";
         var head = document.createElement("p");
         head.className = "dm-h";
         head.appendChild(document.createTextNode("The code"));
         col.appendChild(head);
         pre.parentNode.removeChild(pre);
         col.appendChild(pre);
         body.appendChild(col);
         tagBlock(block, spec.ranges, warn);
      } else {
         warn("code sample not found — the maths will still be shown");
      }

      /* 3. The maths: \class{dm-KEY}{} became a class on the output element;
            normalise it to the same data-dm attribute the code side uses. */
      CONCEPTS.forEach(function (c) {
         var found = root.querySelectorAll(".dm-" + c.key), bound = 0;
         for (var i = 0; i < found.length; i++) {
            if (inAssistiveMathML(found[i])) { continue; }
            found[i].setAttribute("data-dm", c.key);
            bound++;
         }
         if (!bound) { warn("nothing in the maths carries class dm-" + c.key); }
      });

      /* 4. Wrap the chips and the caption in one box, so they can be pinned
            as a unit while the code is scrolled. Two separate sticky
            elements would each need to know the other's height, which the
            chips break as soon as they wrap to a second line.             */
      var caption = document.getElementById("dm-caption");
      var legendEl = document.getElementById("dm-legend");
      if (legendEl && caption && legendEl.parentNode === caption.parentNode) {
         var head = document.createElement("div");
         head.className = "dm-head";
         legendEl.parentNode.insertBefore(head, legendEl);
         head.appendChild(legendEl);
         head.appendChild(caption);
      }
      var idleCap = document.createElement("div");
      idleCap.className = "dm-cap";
      idleCap.setAttribute("data-cap", "");
      idleCap.innerHTML =
         '<span class="dm-cap-idle">Point at any coloured region — in the maths or in ' +
         "the code — to light up its counterparts. Click to pin.</span>" +
         '<span class="dm-cap-pin">&nbsp;</span>';
      caption.appendChild(idleCap);

      CONCEPTS.forEach(function (c) {
         var d = document.createElement("div");
         d.className = "dm-cap";
         d.setAttribute("data-cap", c.key);
         d.innerHTML =
            '<span class="dm-cap-key" data-cap-key="' + c.key + '">' + esc(c.label) + "</span>" +
            '<span class="dm-cap-math">' + esc(c.math) + "</span>" +
            '<span class="dm-cap-note">' + esc(c.note) +
               (c.ref ? ' <a href="' + esc(c.ref.href) + '" target="_blank" ' +
                        'rel="noopener">' + esc(c.ref.text) + "</a>" : "") +
            "</span>" +
            '<span class="dm-cap-pin">pinned — click again or press Esc</span>';
         caption.appendChild(d);
      });

      var caps = caption.querySelectorAll(".dm-cap");

      /* 5. Highlighting. Every region of a concept is indexed by key, so
            lighting one up is two short loops over that key's regions rather
            than a walk over the whole widget on every mouse move. CSS then
            needs a single .is-lit rule instead of one selector per key.   */
      var buckets = {}, litKey = null;

      function indexRegions() {
         buckets = {};
         var all = root.querySelectorAll("[data-dm]"), i, k;
         for (i = 0; i < all.length; i++) {
            k = all[i].getAttribute("data-dm");
            (buckets[k] || (buckets[k] = [])).push(all[i]);
         }
      }

      function light(key) {
         if (key === litKey) { return; }
         var list, i;
         if (litKey && (list = buckets[litKey])) {
            for (i = 0; i < list.length; i++) { list[i].classList.remove("is-lit"); }
         }
         if (key && (list = buckets[key])) {
            for (i = 0; i < list.length; i++) { list[i].classList.add("is-lit"); }
         }
         litKey = key || null;
      }

      var pinned = null;

      function show(key, isPin) {
         light(key);
         /* no rule depends on this any more; kept as a state hook, readable
            in devtools and available to any custom CSS */
         root.setAttribute("data-active", key || "");
         var i, on;
         for (i = 0; i < caps.length; i++) {
            on = caps[i].getAttribute("data-cap") === (key || "");
            caps[i].className = "dm-cap" + (on ? " is-on" : "") + (on && isPin ? " is-pinned" : "");
         }
         var chips = root.querySelectorAll(".dm-chip");
         for (i = 0; i < chips.length; i++) {
            chips[i].setAttribute("aria-pressed",
               chips[i].getAttribute("data-dm") === key ? "true" : "false");
         }
      }

      function toggle(hit) {
         var key = hit.getAttribute("data-dm");
         pinned = (pinned === key) ? null : key;
         show(pinned || key, !!pinned);
      }

      root.addEventListener("mouseover", function (e) {
         if (pinned) { return; }
         var hit = closestTagged(e.target, root);
         if (hit) { show(hit.getAttribute("data-dm"), false); }
      });
      root.addEventListener("mouseout", function (e) {
         if (pinned) { return; }
         var hit = closestTagged(e.target, root);
         if (hit && !closestTagged(e.relatedTarget, root)) { show(null, false); }
      });
      root.addEventListener("click", function (e) {
         var hit = closestTagged(e.target, root);
         if (!hit) { return; }
         toggle(hit);
         e.preventDefault();
      });
      root.addEventListener("keydown", function (e) {
         if (e.keyCode === 27) { pinned = null; show(null, false); return; }  /* Esc */
         if (e.keyCode !== 13 && e.keyCode !== 32) { return; }                /* Enter, Space */
         var hit = closestTagged(e.target, root);
         if (!hit) { return; }
         toggle(hit);
         e.preventDefault();
      });
      root.addEventListener("focusin", function (e) {
         if (pinned) { return; }
         var hit = closestTagged(e.target, root);
         if (hit) { show(hit.getAttribute("data-dm"), false); }
      });

      /* 6. Legend chips: the touch- and keyboard-friendly way in. */
      var legend = document.getElementById("dm-legend");
      if (legend) {
         CONCEPTS.forEach(function (c) {
            var b = document.createElement("button");
            b.className = "dm-chip";
            b.type = "button";
            b.setAttribute("data-dm", c.key);
            b.setAttribute("aria-pressed", "false");
            b.innerHTML = '<i class="dm-swatch"></i>' + esc(c.label);
            legend.appendChild(b);
         });
      }

      var hits = root.querySelectorAll("pre .dm-hit");
      for (var i = 0; i < hits.length; i++) { hits[i].setAttribute("tabindex", "0"); }

      indexRegions();          /* after every region exists: code, maths, chips */
      root.setAttribute("data-ready", "1");
      show(null, false);
   }

   /* MathJax typesets asynchronously, so bind only once it has finished. */
   function boot() {
      if (!document.getElementById("dm")) { return; }
      if (window.MathJax && window.MathJax.Hub) {
         window.MathJax.Hub.Queue(init);
      } else {
         init();
      }
   }

   if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
   } else {
      boot();
   }
})();
