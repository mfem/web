<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$']]}});
</script>
<script type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML">
</script>

# ∂FEM operator decomposition 

<span style="color:#d9534f"><strong>Test for interactive ∂FEM operator decomposition with both backends.</strong></span>

Hover over a **panel** or an **arrow**. Click to pin. The **Local / Global** switch
redraws the kernel boundaries on the right-hand side.

<div class="dfd dfd-global" id="dfd">

  <div class="dfd-head">
    <div class="dfd-formula">$\nabla A(u;p) = P^T B^T G^T \, \color{#a94442}{\nabla D(u;p)} \, B G P$</div>
    <div class="dfd-toggle" role="group" aria-label="q-function backend">
      <button type="button" class="dfd-btn" data-mode="local">LocalQFBackend</button>
      <button type="button" class="dfd-btn dfd-on" data-mode="global">GlobalQFBackend</button>
    </div>
  </div>

  <div class="dfd-scroll">
    <svg id="dfd-svg" viewBox="0 0 980 330" aria-label="Finite element operator decomposition">

      <defs>
        <marker id="ah" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#555"/>
        </marker>
        <marker id="ahd" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 z" fill="#a94442"/>
        </marker>
        <filter id="lift" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.6" flood-color="#26415a" flood-opacity="0.42"/>
        </filter>
      </defs>

      <!-- Kernel boundaries. Only one set is visible at a time; the .dfd-local
           or .dfd-global class on the root decides which. -->

      <g class="kbox k-local">
        <rect x="548" y="32" width="404" height="254" rx="6"/>
        <text class="klabel" x="946" y="300" style="text-anchor:end">1 fused kernel · forall elements</text>
      </g>

      <g class="kbox k-global">
        <rect x="552" y="127" width="64"  height="24"  rx="4"/><text class="klabel" x="584" y="121">1 per input</text>
        <rect x="552" y="159" width="64"  height="24"  rx="4"/><text class="klabel" x="584" y="201">1 per output</text>
        <rect x="750" y="40"  width="202" height="240" rx="6"/><text class="klabel" x="851" y="32">1 kernel</text>
      </g>

      <!-- Vector levels. The dof pictures are drawn by the script from the
           LEVELS table; only the x position lives here. -->

      <g class="hot dfd-lvl"        data-k="T"></g>
      <g class="hot dfd-lvl"        data-k="L"></g>
      <g class="hot dfd-lvl epanel" data-k="E"></g>
      <g class="hot dfd-lvl qpanel" data-k="Q"></g>

      <text class="qtag k-global" x="685" y="136">xq · global memory</text>
      <text class="qtag k-global" x="685" y="190">yq · global memory</text>
      <text class="qtag k-local"  x="685" y="136">registers / shared</text>
      <text class="qtag k-local"  x="685" y="190">never materialized</text>

      <!-- Arrows are drawn by the script from the ARROWS table; only the
           q-function loop below is a one-off. -->

      <g class="hot" data-k="D">
        <rect class="grab" x="748" y="60" width="200" height="210"/>
        <path class="dcurve" d="M744,82 C 884,82 884,236 744,236" marker-end="url(#ahd)"/>
        <text class="dlab" x="888" y="164">∂D</text>
        <text class="dcode k-global" x="946" y="252" style="text-anchor:end">for q = 0 … nqp·ne</text>
        <text class="dcode k-global" x="946" y="266" style="text-anchor:end">qf(xq[q], yq[q])</text>
        <text class="dcode k-local"  x="946" y="252" style="text-anchor:end">qf(x_q, y_q)</text>
        <text class="dcode k-local"  x="946" y="266" style="text-anchor:end">one quadrature point</text>
      </g>

      <!-- Level captions are drawn by the script; these three are one-offs. -->

      <text class="ownlab"        x="250" y="320">DifferentiableOperator</text>
      <text class="etag"          x="481" y="318">handover · xe / ye</text>
      <text class="ownlab own-be" x="762" y="320">q-function backend</text>

    </svg>
  </div>

  <div class="dfd-detail" id="dfd-detail"></div>

</div>

<!-- Text shown in the panel below the diagram. One block per hover target,
     keyed by its data-k; targets whose story depends on the backend have a
     -local and a -global variant. -->

<div id="dfd-copy" hidden>

  <div id="c-T">
    <h4>T-vector — global true dofs</h4>
    <p>One entry per unique, unconstrained degree of freedom in the global
    parallel system. This is the vector a linear solver, a Newton iteration or a
    <code>HypreParVector</code> operates on.</p>
    <p><strong>This level is optional.</strong> By default the operator runs at
    <code>MultLevel::TVECTOR</code>, so <code>Mult</code> takes a T-vector and
    returns one. Switching it:</p>
<pre><code>dop.SetMultLevel(DifferentiableOperator::LVECTOR);</code></pre>
    <p>makes <code>Mult</code> take and return <strong>L-vectors</strong>
    instead. <code>P</code> and <code>Pᵀ</code> then drop out and this level
    never appears.</p>
    <p>The setting carries into the operators returned by
    <code>GetDerivative</code> and <code>GetSecondDerivative</code>, so a
    Jacobian is applied at the same level as the residual.</p>
  </div>

  <div id="c-L">
    <h4>L-vector — local subdomain dofs</h4>
    <p>Every degree of freedom visible on this rank, including those shared with
    neighbouring ranks and those constrained by hanging nodes. This is the layout
    of a <code>GridFunction</code>.</p>
    <p>Under <code>SetMultLevel(LVECTOR)</code> this becomes the operator's entry
    and exit level, and the chain starts and ends here rather than at the
    T-vector.</p>
  </div>

  <div id="c-E">
    <h4>E-vector — element dofs</h4>
    <p>Size <code>ne × ndof_per_elem × vdim</code>. Shared degrees of freedom are
    duplicated, so elements become completely independent.</p>
    <p><code>DifferentiableOperator</code> gives the
    backend <code>std::vector&lt;Vector*&gt; xe</code> and receives <code>ye</code>.
    Everything to the left is common to each operator, while to the right is <strong>backend-specific<strong>.</p>
  </div>

  <div id="c-Q-local">
    <h4>Q-vector — quadrature point values</h4>
    <p>With <code>LocalQFBackend</code> this level is never materialized, but is
    fused into the element-local kernel.</p>
    <p>The interpolated values produced by <code>B</code> live in per-thread
    registers and <code>MFEM_SHARED</code> memory <em>inside</em> the same kernel
    that runs the q-function, and the results are consumed by <code>Bᵀ</code>
    before the kernel exits.
  </div>

  <div id="c-Q-global">
    <h4>Q-vector — quadrature point values</h4>
    <p> With <code>GlobalQFBackend</code> this level is a real allocation for the entire q-vector.</p>
    <p><code>xq</code> and <code>yq</code> are <code>BlockVector</code>s in global
    memory, one block per input and per output, each sized
    <code>nqp × size_on_qp × nentities</code>. They are written by one kernel and
    read back by the next.</p>
    <p>That round trip is the cost of the global backend; what you buy with it is
    a q-function that sees every quadrature point at once.</p>
  </div>

  <div id="c-P">
    <h4>P / Pᵀ — subdomain restriction, T ↔ L
      <span class="dfd-tag dfd-tag-topo">topological · not differentiated</span></h4>
    <p>Standard MFEM operator decomposition — see <a href="../performance/#finite-element-operator-decomposition">Finite
    Element Operator Decomposition</a>.</p>
    <p> Skipped when the <code>DifferentiableOperator</code>
    runs at <code>LVECTOR</code> level.</p>
  </div>

  <div id="c-G">
    <h4>G / Gᵀ — element restriction, L ↔ E
      <span class="dfd-tag dfd-tag-topo">topological · not differentiated</span></h4>
    <p>Standard MFEM operator decomposition — see <a href="../performance/#finite-element-operator-decomposition">Finite
    Element Operator Decomposition</a>.</p>
  </div>

  <div id="c-B">
    <h4>B — basis evaluation, E → Q
      <span class="dfd-tag dfd-tag-topo">topological · not differentiated</span></h4>
    <p><code>B</code> is a <strong>stack with one row block per input</strong>,
    and the <code>FieldOperator</code> you request picks the block:</p>
    <ul>
      <li><code>Value&lt;i&gt;</code> — interpolated values, <code>vdim</code> per
      point.</li>
      <li><code>Gradient&lt;i&gt;</code> — derivatives in <em>reference</em>
      coordinates, <code>vdim × dim</code> per point.</li>
      <li><code>Identity&lt;i&gt;</code> — field already lives at the quadrature
      points, so it is passed through with no contraction.</li>
      <li><code>Weight</code> — the quadrature weights, read straight from the
      rule; not a field, and it has no basis rows.</li>
    </ul>
    <p>The first two are sum-factorized <code>DofToQuad</code> contractions,
    applied <strong>per element in both backends</strong> — never one quadrature
    point at a time. What the backends change is only <em>where the result
    goes</em>: registers (Local) or <code>xq</code> in global memory (Global).</p>
  </div>

  <div id="c-Bt">
    <h4>Bᵀ — contract onto test functions, Q → E
      <span class="dfd-tag dfd-tag-topo">topological · not differentiated</span></h4>
    <p>The same stack transposed: <strong>one row block per output</strong>,
    again chosen by the <code>FieldOperator</code>:</p>
    <ul>
      <li><code>Value&lt;i&gt;</code> — multiply by the shape functions and sum
      into the element dofs.</li>
      <li><code>Gradient&lt;i&gt;</code> — the same against the shape-function
      derivatives.</li>
      <li><code>Identity&lt;i&gt;</code> — written straight to quadrature-point
      storage, no contraction.</li>
      <li><code>FunctionalValue&lt;i&gt;</code> — the same, used for energies and
      functionals.</li>
      <li><code>Sum&lt;i&gt;</code> — reduced to a single number, during the
      transpose of <code>P</code> rather than here.</li>
    </ul>
    <p><code>Weight</code> is input-only; <code>FunctionalValue</code> and
    <code>Sum</code> are output-only.</p>
    <p>The quadrature weight and the geometric factors are <strong>not</strong>
    applied here — request <code>Weight</code> as an input and apply them
    yourself inside the q-function.</p>
  </div>

  <div id="c-D-local">
    <h4>∂D — q-function
      <span class="dfd-tag dfd-tag-diff">differentiated</span></h4>
    <p>The only nonlinear, problem-specific part of the operator, and the only
    part ∂FEM differentiates.</p>
    <p><code>LocalQFBackend</code> <strong>fuses</strong> E → Q → Q → E into a
    single kernel, launched once and looping over <strong>elements</strong>:</p>
<pre><code>forall(e):                       // ONE kernel launch
   LoadValue / LoadGradient      //  B  , whole element
   ---- registers + MFEM_SHARED ----
   foreach qp (qx,qy,qz):        //  one qp per THREAD
      qfunc(...)                 //  f(), single point
   ---- MFEM_SYNC_THREAD ----
   WriteValue / WriteGradient    //  Bᵀ , whole element</code></pre>
    <ul>
      <li>The outer loop is over <strong>elements</strong>, not quadrature
      points.</li>
      <li>Quadrature data never leaves registers / shared memory.</li>
      <li>Your q-function is called with the values at a <strong>single</strong>
      quadrature point</li>
    </ul>
  </div>

  <div id="c-D-global">
    <h4>∂D — q-function
      <span class="dfd-tag dfd-tag-diff">differentiated</span></h4>
    <p>The only nonlinear, problem-specific part of the operator, and the only
    part ∂FEM differentiates.</p>
    <p><code>GlobalQFBackend</code> keeps the three stages as <strong>separate
    passes</strong> through global memory:</p>
<pre><code>interpolate(...)   // xe -&gt; xq   one kernel per input
call_qfunc(...)    // xq -&gt; yq   one kernel, ALL qp
integrate(...)     // yq -&gt; ye   one kernel per output</code></pre>
    <ul>
      <li><code>n_inputs + 1 + n_outputs</code> kernel launches, with
      <code>xq</code> / <code>yq</code> materialized in between.</li>
      <li>Your q-function receives <code>tensor_array</code>s spanning
      <strong>all</strong> <code>nqp × nentities</code> points and writes whole
      output blocks — the q-function <strong>must include</strong> the loop over quadrature
      points.</li>
    </ul>
  </div>

  <div id="c-hint">
    <p class="dfd-hint">Hover or tab a panel or an arrow. Click to pin it.
    Panels are vector types, arrows are the operators between them — the top row
    is the forward pass, the bottom row the return pass.</p>
  </div>

</div>

<style>
/* ---- shell ------------------------------------------------------------ */
.dfd { border: 1px solid #ddd; border-radius: 4px; background: #fff;
       margin: 1.5em 0; font-size: 14px; }
.dfd-scroll { overflow-x: auto; padding: 6px 10px 0; }

/* ---- header: formula and backend switch ------------------------------- */
.dfd-head { display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
            justify-content: space-between; padding: 10px 14px;
            border-bottom: 1px solid #eee; background: #f7f7f9; }
.dfd-formula { font-family: Menlo, Consolas, monospace; font-size: 15px; color: #333; }
.dfd-formula em { font-style: normal; color: #a94442; font-weight: 700; }
.dfd-toggle { display: flex; }
.dfd-btn { font-family: Menlo, Consolas, monospace; font-size: 12px;
           padding: 4px 10px; border: 1px solid #ccc; background: #fff;
           color: #555; cursor: pointer; }
.dfd-btn:first-child { border-radius: 3px 0 0 3px; }
.dfd-btn:last-child  { border-radius: 0 3px 3px 0; border-left: 0; }
.dfd-btn.dfd-on { background: #337ab7; border-color: #2e6da4; color: #fff; }

/* ---- vector level panels ---------------------------------------------- */
#dfd-svg { display: block; width: 100%; min-width: 760px; max-width: 980px;
           margin: 0 auto; height: auto;
           font-family: Menlo, Consolas, monospace; }
.pbox { fill: #f0f0f0; stroke: #bbb; stroke-width: 1; }   /* panel outline */
.sbox { fill: #fafafa; stroke: #888; stroke-width: 1; }   /* subdomain / element */

/* E is the handover between operator and backend: lifted to the foreground. */
.epanel .pbox { fill: #fff; stroke: #9aa7b1; stroke-width: 1.4; filter: url(#lift); }
.epanel .sbox { fill: #f8fafb; stroke: #93a0aa; }
.etag { font-size: 11.5px; text-anchor: middle; fill: #6b7a86; font-weight: 700; }

/* Q turns amber only when it is a real allocation. */
.dfd-global .qpanel .pbox { fill: #fdf3e3; stroke: #d9a441; stroke-width: 1.4; }
.qtag { font-size: 11px; text-anchor: middle; fill: #8a6d3b; }
.dfd-local .qtag { fill: #a94442; }

/* ---- operators --------------------------------------------------------- */
.hot { cursor: pointer; }
.grab { fill: transparent; stroke: none; }                /* hover target */
.hot line { stroke: #555; stroke-width: 1.6; }
.alab { font-family: Georgia, serif; font-style: italic; font-size: 16px;
        fill: #333; text-anchor: middle; }
.dcurve { fill: none; stroke: #a94442; stroke-width: 2; }
.dlab { font-family: Georgia, serif; font-style: italic; font-size: 17px;
        fill: #a94442; text-anchor: middle; }
.dcode { font-size: 11px; fill: #a94442; text-anchor: middle; }

/* ---- kernel boundaries and captions ------------------------------------ */
.kbox rect { fill: none; stroke-width: 1.4; stroke-dasharray: 5 3; }
.klabel { font-size: 11px; text-anchor: middle; }
.k-local  rect { stroke: #a94442; }
.k-local  .klabel { fill: #a94442; }
.k-global rect { stroke: #8a6d3b; }
.k-global .klabel { fill: #8a6d3b; }
.dfd-local .k-global, .dfd-global .k-local { display: none; }

.toplab, .botlab { font-family: Georgia, serif; font-size: 13.5px; fill: #333;
                   text-anchor: middle; }
.ownlab { font-size: 12px; fill: #999; text-anchor: middle; }
.ownlab.own-be { fill: #a94442; }

/* ---- hover highlight --------------------------------------------------- */
.hot.act .pbox   { stroke: #337ab7; stroke-width: 2.4; }
.hot.act line    { stroke: #337ab7; stroke-width: 2.6; }
.hot.act .alab   { fill: #337ab7; }
.hot.act .dcurve { stroke-width: 3.4; }

/* ---- detail panel ------------------------------------------------------ */
.dfd-detail { border-top: 1px solid #eee; padding: 12px 16px; min-height: 170px;
              background: #fcfcfc; border-radius: 0 0 4px 4px; }
.dfd-detail h4 { margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #333; }
.dfd-detail p  { margin: 0 0 8px; line-height: 1.5; color: #444; }
.dfd-detail ul { margin: 6px 0 8px; padding-left: 20px; }
.dfd-detail li { margin: 3px 0; line-height: 1.45; color: #444; }
.dfd-detail pre { background: #f5f5f5; border: 1px solid #e3e3e3;
                  border-radius: 3px; padding: 8px 10px; margin: 8px 0;
                  font-size: 12px; overflow-x: auto; white-space: pre; }
.dfd-detail code { background: #f0f0f0; padding: 1px 4px; border-radius: 2px;
                   font-size: 12px; color: #c7254e; }
.dfd-detail pre code { background: none; padding: 0; color: #333; }
.dfd-hint { color: #999; font-style: italic; }
.dfd-tag { display: inline-block; font-size: 10px; text-transform: uppercase;
           letter-spacing: .5px; padding: 2px 6px; border-radius: 2px;
           margin-left: 8px; vertical-align: middle; }
.dfd-tag-topo { background: #dff0d8; color: #3c763d; }
.dfd-tag-diff { background: #f2dede; color: #a94442; }
</style>

<script>
(function () {

  var root = document.getElementById('dfd');
  var svg  = document.getElementById('dfd-svg');
  var out  = document.getElementById('dfd-detail');
  if (!root || !svg || !out) { return; }

  var NS = 'http://www.w3.org/2000/svg';

  function each(nodes, fn) { Array.prototype.forEach.call(nodes, fn); }

  function make(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var key in attrs) { node.setAttribute(key, attrs[key]); }
    return node;
  }

  /* ---- panels ---------------------------------------------------------- */

  // Every panel is 118 x 80 and appears twice: once on the forward pass and
  // once on the return pass.
  var PANEL_W = 118, PANEL_H = 80, ROW_TOP = 42, ROW_BOTTOM = 196;

  // Four sub-boxes in a 2x2 arrangement, shared by the E and Q levels.
  var QUADRANTS = [[8, 8, 47, 29], [63, 8, 47, 29], [8, 43, 47, 29], [63, 43, 47, 29]];

  // Everything that varies per level: where it sits, its two captions, the dot
  // colour, the sub-boxes drawn inside the panel, and the dot columns x rows
  // inside each sub-box. The progression whole -> subdomains -> elements ->
  // quadrature points is the point of the picture.
  var LEVELS = {
    T: { x: 14,  cap: 'Global true dofs',        name: 'T-vector',
         color: '#c0392b', boxes: [[8, 8, 102, 64]],                 cols: 5, rows: 4 },
    L: { x: 218, cap: 'Local subdomain dofs',    name: 'L-vector',
         color: '#222222', boxes: [[8, 8, 47, 64], [63, 8, 47, 64]], cols: 3, rows: 4 },
    E: { x: 422, cap: 'Element dofs',            name: 'E-vector',
         color: '#2a6496', boxes: QUADRANTS,                         cols: 3, rows: 3 },
    Q: { x: 626, cap: 'Quadrature point values', name: 'Q-vector',
         color: '#3c763d', boxes: QUADRANTS,                         cols: 2, rows: 2 }
  };

  function drawPanel(group, level, x, y) {
    group.appendChild(make('rect', {
      x: x, y: y, width: PANEL_W, height: PANEL_H, rx: 5, 'class': 'pbox'
    }));

    level.boxes.forEach(function (box) {
      var bx = x + box[0], by = y + box[1], bw = box[2], bh = box[3];
      group.appendChild(make('rect', {
        x: bx, y: by, width: bw, height: bh, rx: 2, 'class': 'sbox'
      }));

      var stepX = bw / (level.cols + 1), stepY = bh / (level.rows + 1);
      for (var c = 1; c <= level.cols; c++) {
        for (var r = 1; r <= level.rows; r++) {
          group.appendChild(make('circle', {
            cx: bx + c * stepX, cy: by + r * stepY, r: 1.9, fill: level.color
          }));
        }
      }
    });
  }

  function caption(cls, x, y, text) {
    var node = make('text', { 'class': cls, x: x, y: y });
    node.textContent = text;
    svg.appendChild(node);
  }

  each(svg.querySelectorAll('.dfd-lvl'), function (group) {
    var level = LEVELS[group.getAttribute('data-k')];
    drawPanel(group, level, level.x, ROW_TOP);
    drawPanel(group, level, level.x, ROW_BOTTOM);
    caption('toplab', level.x + PANEL_W / 2, 24,  level.cap);
    caption('botlab', level.x + PANEL_W / 2, 302, level.name);
  });

  /* ---- operators -------------------------------------------------------- */

  // One entry per transition: a forward arrow on the upper line and its
  // transpose returning below. Both halves are hover targets.
  // `group: true` gives the pair a single hover target: P and G are the
  // standard MFEM decomposition and share one description. B and Bᵀ carry
  // different dFEM-specific detail, so they stay separate.
  var ARROWS = [
    { x: 175, fwd: 'P', back: 'Pᵀ', group: true  },
    { x: 379, fwd: 'G', back: 'Gᵀ', group: true  },
    { x: 584, fwd: 'B', back: 'Bᵀ', group: false }
  ];

  var FWD_Y = 149, BACK_Y = 181;

  function drawArrow(key, x, y, label, dir) {
    var group = make('g', { 'class': 'hot', 'data-k': key });
    group.appendChild(make('rect', {
      'class': 'grab', x: x - 30, y: y - 22, width: 60, height: 24
    }));
    group.appendChild(make('line', {
      x1: x - dir * 27, y1: y, x2: x + dir * 27, y2: y, 'marker-end': 'url(#ah)'
    }));
    var text = make('text', { 'class': 'alab', x: x, y: y - 8 });
    text.textContent = label;
    group.appendChild(text);
    svg.appendChild(group);
  }

  ARROWS.forEach(function (a) {
    drawArrow(a.fwd, a.x, FWD_Y, a.fwd, 1);
    drawArrow(a.group ? a.fwd : a.fwd + 't', a.x, BACK_Y, a.back, -1);
  });

  /* ---- detail panel and hover ------------------------------------------ */

  var mode = 'global';   // which backend the diagram is showing
  var pinned = null;     // data-k of the click-pinned target, if any

  // Targets whose text depends on the backend have -local / -global variants.
  function copyFor(key) {
    return document.getElementById('c-' + key) ||
           document.getElementById('c-' + key + '-' + mode);
  }

  function show(key) {
    var block = key ? copyFor(key) : document.getElementById('c-hint');
    out.innerHTML = block ? block.innerHTML : '';
    each(svg.querySelectorAll('.hot'), function (target) {
      target.classList.toggle('act', key !== null && target.getAttribute('data-k') === key);
    });
  }

  each(svg.querySelectorAll('.hot'), function (target) {
    var key = target.getAttribute('data-k');
    target.setAttribute('tabindex', '0');
    target.addEventListener('mouseenter', function () { if (!pinned) { show(key); } });
    target.addEventListener('focus',      function () { if (!pinned) { show(key); } });
    target.addEventListener('click', function () {
      pinned = (pinned === key) ? null : key;
      show(pinned);
    });
  });

  svg.addEventListener('mouseleave', function () { if (!pinned) { show(null); } });

  /* ---- backend switch --------------------------------------------------- */

  each(root.querySelectorAll('.dfd-btn'), function (button) {
    button.addEventListener('click', function () {
      mode = button.getAttribute('data-mode');
      root.classList.remove('dfd-local', 'dfd-global');
      root.classList.add('dfd-' + mode);

      each(root.querySelectorAll('.dfd-btn'), function (other) {
        other.classList.toggle('dfd-on', other === button);
      });

      // Show the backend-specific q-function detail without disabling hover.
      pinned = null;
      show('D');
    });
  });

  show(null);

})();
</script>
