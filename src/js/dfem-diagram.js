/* ------------------------------------------------------------------------
   dfem-diagram.js — interactive ∂FEM operator decomposition.

   Draws the T -> L -> E -> Q panel diagram into #dfd-svg and wires up the
   detail panel below it. Everything that repeats — the vector level panels
   and the P / G / B arrow pairs — is generated here from the LEVELS and
   ARROWS tables, so the markup in the page holds only the one-offs.

   Hovering, tapping or keyboard-focusing a panel or an arrow shows the
   matching block from #dfd-copy; clicking pins it. The Local / Global switch
   redraws the kernel boundaries and picks the -local or -global variant of
   the copy for the targets whose story depends on the backend.
   ------------------------------------------------------------------------ */

(function () {

  function boot() {

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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
