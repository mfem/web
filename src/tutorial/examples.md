## <i class="fa fa-gears"></i>&nbsp; Tour of MFEM Examples

<span class="label label-default">30 minutes</span>
<span class="label label-default">intermediate</span>

---

<div class="panel panel-success">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-check"></i>&nbsp; Lesson Objectives</h3>
</div>
<div class="panel-body" style="line-height: 1.8;">
<i class="fa fa-square-o"></i>&nbsp; Learn about MFEM's main features through several of the examples included with the library. <br>
</div>
</div>

<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
Please complete the <a href="../start"><i class="fa fa-play-circle"></i>&nbsp; Getting Started</a>
and <a href="../fem"><i class="fa fa-book"></i> Finite Element Basics</a> pages before this lesson.
</div>
</div>

---

### <i class="fa fa-check-square-o"></i>&nbsp; High-order methods
- full de Rham complex
- How to build the example codes
- Examples 1, 2, 3, 4

---

### <i class="fa fa-check-square-o"></i>&nbsp; Discontinuous Galerkin
- Example 9

---

### <i class="fa fa-check-square-o"></i>&nbsp; Nonlinear elasticity
- Example 10

---

### <i class="fa fa-check-square-o"></i>&nbsp; Adaptive mesh refinement
<img class="floatright" src="../../img/examples/ex15.png", width="260"/>

MFEM provides support for local conforming and non-conforming adaptive mesh refinement (AMR) with arbitrary order hanging nodes, anisotropic refinement, derefinement and parallel load balancing. The AMR support covers the full de Rham complex i.e., the energy spaces $H^1$, $H(curl)$, $H(div)$ and $L^2$. The user can choose from  several error estimators, such as the Zienkiewicz - Zhu (ZZ) or the Kelly estimator, to drive the adaptive mesh refinements. We recommend to take look at examples 6, 15, 21 and 30 for some simulations with AMR. 

In particular, <strong>Example 16</strong> demonstrates MFEM's cabability to refine, derifine and load balance non-conforming meshes in 2D and 3D, and on linear, curved and surface meshes. In this example the mesh is adapted to a time-dependent solution. At each time step the problem is solved on a sequence of adaptive meshes which are refined based on a simple ZZ estimator. At the end of the refinement process the error estimates are used to identify elements that are over-refined and a single derefinment step is performed. Finally, in the parallel case a load-balancing step is executed. 

The implementation can be found in
[ex15.cpp](https://github.com/mfem/mfem/blob/master/examples/ex15.cpp) and
[ex15p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex15p.cpp).

Try the following sample runs:
<code class="language-java"><pre>
./ex15 -p 1 -n 3
./ex15 -m ../data/square-disc.mesh
./ex15 -est 1 -e 0.0001
mpirun -np 4 ex15p -m ../data/mobius-strip.mesh
mpirun -np 4 ex15p -m ../data/fichera.mesh -tf 0.5
</pre></code>

---

### <i class="fa fa-check-square-o"></i>&nbsp; Complex-valued problems

MFEM provides a user friendly interface for solving complex valued systems.
These kinds of problems can be formulated using the classes `ComplexOperator`,
`ComplexLinearForm`, `SesquilinearForm`, `ComplexGridFunction`, and their parallel
counterparts. The user can define the weak formulation by providing the integrators
of its real and imaginary part independently and then use similar methods as in
the real problems (such us `Assemble`, `FormLinearSystem`, and `RecoverFEMSolution`)
to recover the solution.

Currently, there are two examples demonstrating the use of complex valued systems.
<img class="floatright" src="../../img/examples/ex22.gif", width="260"/>

- <strong>Example 22</strong> implements three variants of a damped harmonic oscillator:

    * A scalar $H^1$ field:
      $$-\nabla\cdot\left(a \nabla u\right) - \omega^2 b\,u + i\,\omega\,c\,u = 0$$

    * A vector $H(curl)$ field:
      $$\nabla\times\left(a\nabla\times\vec{u}\right) - \omega^2 b\,\vec{u} + i\,\omega\,c\,\vec{u} = 0$$

    * A vector $H(div)$ field:
      $$-\nabla\left(a \nabla\cdot\vec{u}\right) - \omega^2 b\,\vec{u} + i\,\omega\,c\,\vec{u} = 0$$

    In each case the field is driven by a forced oscillation, with angular
    frequency $\omega$, imposed at the boundary or a portion of the boundary.
    The implementation can be found in
    [ex22.cpp](https://github.com/mfem/mfem/blob/master/examples/ex22.cpp) and
    [ex22p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex22p.cpp).

    Try the following sample runs:
    <code class="language-java"><pre>
    ./ex22 -m ../data/inline-quad.mesh -o 3 -p 1
    ./ex22 -m ../data/inline-hex.mesh -o 2 -p 2 -pa
    ./ex22 -m ../data/star.mesh -r 1 -o 2 -sigma 10.0
    ./ex22 -m ../data/inline-pyramid.mesh -o 1
    </pre></code>

<img class="floatright" src="../../img/examples/ex25.gif", width="250"/>

- <strong>Example 25</strong> illustrates the use of a [Perfectly Matched Layer (PML)](https://en.wikipedia.org/wiki/Perfectly_matched_layer)
    for the simulation of time-harmonic electromagnetic waves propagating in unbounded
    domains. The implementation involves the introduction of an artificial absorbing
    layer that minimizes undesired reflections. Inside this layer a complex coordinate
    stretching map is used which forces the wave modes to decay exponentially.

    The example solves the indefinite Maxwell equations
    $$ \nabla \times (a \nabla \times E) - \omega^2 b E = f $$ where $a = \mu^{-1} |J|^{-1} J^T J$,
    $b= \epsilon |J| J^{-1} J^{-T}$ and $J$ is the Jacobian matrix of the coordinate
    transformation. The implementation can be found in
    [ex25.cpp](https://github.com/mfem/mfem/blob/master/examples/ex25.cpp) and
    [ex25p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex25p.cpp).

    Try the following sample runs:
    <code class="language-java"><pre>
    ./ex25 -o 3 -f 10.0 -ref 2 -prob 1
    ./ex25 -o 2 -f 1.0 -ref 2 -prob 3
    ./ex25 -o 2 -f 8.0 -ref 3 -prob 4 -m ../data/inline-quad.mesh
    ./ex25 -o 2 -f 1.0 -ref 2 -prob 0 -m ../data/beam-quad.mesh
    </pre></code>

---

<div class="panel panel-warning">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-question-circle"></i>&nbsp; Questions?</h3>
</div>
<div class="panel-body">
Ask for help in the tutorial <a href="https://radiuss-llnl.slack.com/archives/C03T2DQCSC8">Slack channel</a>.
</div>
</div>

<div class="panel panel-success">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-external-link"></i>&nbsp; Next Steps</h3>
</div>
<div class="panel-body" style="line-height: 1.8; margin-bottom: -10pt;">
Depending on your interests pick one of the following lessons:<br>
<ul>
<li> <a href="../meshvis"><i class="fa fa-picture-o"></i>&nbsp; Meshing and Visualization</a>
<li> <a href="../solvers"><i class="fa fa-tasks"></i>&nbsp; Solvers and Scalability</a>
<li> <a href="../further"><i class="fa fa-rocket"></i>&nbsp; Further Steps</a>
</ul>
</div>
</div>

---

Back to the [MFEM tutorial page](index.md)

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>