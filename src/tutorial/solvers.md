## <i class="fa fa-tasks"></i>&nbsp; Solvers and Scalability

<span class="label label-default">45 minutes</span>
<span class="label label-default">intermediate</span>

---

<div class="panel panel-success">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-check"></i>&nbsp; Lesson Objectives</h3>
</div>
<div class="panel-body" style="line-height: 1.8;">
<i class="fa fa-square-o"></i>&nbsp; Learn about MFEM's parallel scalability.<br>
<i class="fa fa-square-o"></i>&nbsp; Learn about MFEM's support for efficient solvers and preconditioners.
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

MFEM is designed to be highly scalable and efficient on a wide variety of
platforms: from laptops to
[GPU-accelerated supercomputers](https://mfem.org/features/#parallel-scalable-and-gpu-ready).
The solvers described in this lesson play a critical role in this parallel
scalability.

---

### <i class="fa fa-check-square-o"></i>&nbsp; Scalable algebraic multigrid preconditioners from _hypre_

MFEM comes with a large number of [example codes](/examples/) that demonstrate
different physical applications, finite element discretizations, and linear
solvers:

- [Example 1](https://github.com/mfem/mfem/blob/master/examples/ex1.cpp) solves a Poisson problem,
- [Example 2](https://github.com/mfem/mfem/blob/master/examples/ex2.cpp) solves a linear elasticity problem,
- [Example 3](https://github.com/mfem/mfem/blob/master/examples/ex3.cpp) solves a definite Maxwell (electromagnetics) problem, and
- [Example 4](https://github.com/mfem/mfem/blob/master/examples/ex4.cpp) solves grad-div diffusion problem.

The parallel versions of these examples (`ex1p`, `ex2p`, `ex3p`, and `ex4p`) each use
suitable **algebraic multigrid (AMG) preconditioners** from the
[_hypre_](https://github.com/hypre-space/hypre/) solvers library. We describe sample runs with
each of these examples in more details below.

---

#### <i class="fa fa-arrow-circle-right"></i>&nbsp; Example 1: Poisson problem and AMG

- First, make sure you are in the examples subdirectory: `cd ~/mfem/examples`

- Build the parallel version of Example 1: `make ex1p`

- Run the parallel version of Example 1, solving a Poisson problem: `./ex1p`

- After forming the linear system, MFEM uses _hypre_ to construct and apply an
  AMG preconditioner. Details of the AMG preconditioner are
  provided in the example output under the headers `BoomerAMG SETUP PARAMETERS`
  and `BoomerAMG SOLVER PARAMETERS`.

- <details>
    <summary> Click here to view the terminal output <i class="fa fa-arrow-down"></i></summary>
    <img class="tight" src="../img/solvers1.png">
  </details>

- A key feature of AMG methods is their scalability: with default options,
  convergence is achieved in only 18 conjugate gradient iterations.

- Let's see what happens if we increase the mesh refinement. Edit `ex1p.cpp`
  changing line 153 as follows:

    <pre style="background-color:white;"><code class="language-diff" style="font-size: 12px;">@@ -150,7 +150,7 @@ int main(int argc, char *argv[])
    ParMesh pmesh(MPI_COMM_WORLD, mesh);
    mesh.Clear();
    {
-      int par_ref_levels = 2;
+      int par_ref_levels = 3;
       for (int l = 0; l < par_ref_levels; l++)
       {
          pmesh.UniformRefinement();
    </code></pre>

- This adds one additional level of refinement, making the problem roughly 4 times as
  large in 2D, or 8 times as large in 3D.

- Rebuild the example (`make ex1p`) and re-run it: `./ex1p`

- Although the number of unknowns for this problem has increased by roughly
  4x, the iteration count remains at 18 due to the
  **scalability** of the AMG preconditioner.

- Let's now try a 3D problem. For that, we just need to choose a 3D mesh using
  the `-m` or `--mesh` command line argument.

- Because these problems are more computationally
  expensive, let's first reduce the refinement level, setting
  `int par_ref_levels = 1;` in the `ex1p.cpp` source code.

- Rebuild the example (`make ex1p`) and re-run it using the three-dimensional
  _Fichera_ mesh: `./ex1p -m ../data/fichera.mesh`. Convergence is attained in
  only 16 iterations.

<img class="tight" width="300" style="padding: 30px;" src="../img/solvers2.png">

- Finally, let's take a look at the parallel scalability of the solvers:

    - Increase the refinement level: `int par_ref_levels = 2;`
    - Recompile: `make ex1p`
    - Now run the 3D example on 8 cores: `mpirun -np 8 ./ex1p -m ../data/fichera.mesh`
    - This is an example of a [weak scaling test](https://en.wikipedia.org/wiki/Scalability#Weak_versus_strong_scaling):
      the problem size and the number of processors are both increased by a
      factor of 8.
    - Because the PCG iteration counts remain roughly constant, the total time
      to solution should remain roughly fixed (minus some overhead and
      communication cost), even though we are solving a problem that is 8 times
      larger.

---

#### <i class="fa fa-arrow-circle-right"></i>&nbsp; Example 2: Linear Elasticity

- This example demonstrates solving a
  [linear elasticity](https://en.wikipedia.org/wiki/Linear_elasticity)
  cantilever beam problem with different materials.

- This example is designed to work with any of the "beam" meshes provided by
  MFEM. Run `ls ../data | grep beam` to list the available 2D and 3D meshes:
  `beam-hex-nurbs.mesh`, `beam-hex.mesh`, `beam-hex.vtk`, `beam-quad-amr.mesh`,
  `beam-quad-nurbs.mesh`, `beam-quad.mesh`, `beam-quad.vtk`, `beam-tet.mesh`,
  `beam-tet.vtk`, `beam-tri.mesh`, `beam-tri.vtk`, `beam-wedge.mesh`, and
  `beam-wedge.vtk`.

- The elements and boundaries of these meshes are assigned attributes/materials
  suitable for the cantilever problem:

<div class="container" markdown="1" style="width:96%; margin:auto;">
```text
                         +----------+----------+
            boundary --->| material | material |<--- boundary
            attribute 1  |    1     |    2     |     attribute 2
            (fixed)      +----------+----------+     (pull down)
```
</div>

- Build the example with `make ex2p`.

- Try running `./ex2p` in the terminal to run a 2D elasticity problem.

- As in Example 1, the linear system is solved using AMG.

- For this example, two types of AMG solvers can be used:

    1. A special version of AMG designed specifically for elasticity ([see this
       paper](https://onlinelibrary.wiley.com/doi/pdf/10.1002/nla.688)).

    2. AMG for systems.

- To enable the special elasticity AMG, add the flag `-elast` to the command line,
  otherwise, AMG for systems will be used. For example: `./ex2p -elast`.

- The polynomial degree (order) can be changed with the `--order` command line argument (`-o`
  for short). For example: `./ex2p -o 2`. By default, low-order $(p=1)$ elements are used.

<div class="panel panel-danger" style="width:92%; margin-left: auto; margin-right: auto;">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-warning"></i>&nbsp; Warning</h3>
</div>
<div class="panel-body">
Using higher-order elements can quickly become computationally expensive. See the section below on
<a href="#low-order-refined-methods">Low-order-refined methods</a>
for a more efficient approach.
</div>
</div>

- Additionally, _static condensation_ can be used to eliminate interior
  high-order degrees of freedom and obtain a smaller system. For `--order 1`,
  this has no effect. For higher-order problems, static condensation can improve
  efficiency.

- In this example, as before, the mesh refinement level can be controlled in the
  source code through `par_ref_levels`.

<div class="panel panel-info" style="width:92%; margin-left: auto; margin-right: auto;">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
Remember to recompile the example after editing the source code (<code>make ex2p</code>).
</div>
</div>

- Running with more than one MPI rank will partition the mesh and run the
  problem in parallel. Here is a sample 3D run: `mpirun -np 8 ./ex2p -m ../data/beam-hex.mesh`

- Try experimenting with different discretization, solver, and parallelization
  options.

---

#### <i class="fa fa-arrow-circle-right"></i>&nbsp; Examples 3 and 4: the de Rham Complex

- The next two examples demonstrate the use of _vector finite element spaces_.

    - Example 3 solves an electromagnetics problem using $H(\mathrm{curl})$
      finite elements.

    - Example 4 solves a grad-div problem using $H(\mathrm{div})$ finite
      elements.

- Standard multigrid methods don't always work well for these problems, so
  *we need specialized solvers!*
  (See [here](https://link.springer.com/article/10.1007/PL00005386) for a paper on this topic.)

- For $H(\mathrm{curl})$ problems, we use the [AMS solver](https://hypre.readthedocs.io/en/latest/solvers-ams.html) from hypre.

- For $H(\mathrm{div})$ problems, we either use the
  [ADS solver](https://hypre.readthedocs.io/en/latest/solvers-ads.html)
  from hypre or a special
  [hybridization solver](https://epubs.siam.org/doi/abs/10.1137/17M1132562).

- Try experimenting with different options to get a feel for the performance of
  the discretizations and solvers:

    - Change the mesh (2D or 3D) using the `--mesh` (`-m`) command line
      argument. For example: `mpirun -np 16 ex3p -m ../data/beam-hex.mesh`.

    - Change the polynomial degree using the `--order` (`-o`) command line
      argument. For example: `mpirun -np 32 ex4p -m ../data/square-disc-nurbs.mesh -o 3`.

    - Run problems in parallel using `mpirun`.

    - For `ex4p`, enable hybridization using the `-hb` flag.
      For example: `mpirun -np 48 ex4p -m ../data/star-surf.mesh -o 3 -hb`.

<div class="panel panel-info" style="width:92%; margin-left: auto; margin-right: auto;">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
Remember to build the examples first: <code>make ex3 ex4 ex3p ex4p</code>
</div>
</div>

---

### <i class="fa fa-check-square-o"></i>&nbsp; MFEM's native Multigrid solver

- The previous examples (`ex1p`, `ex2p`, `ex3p`, and `ex4p`) all used
  _algebraic_ multigrid methods. MFEM also supports _geometric_ ($h$- and
  $p$-multigrid) methods.

- These solvers are illustrated in Example 26 (and its parallel variant); see the
  [ex26.cpp](https://github.com/mfem/mfem/blob/master/examples/ex26.cpp) and [ex26p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex26p.cpp) source files.

- Mesh refinement can be set using the `--geometric-refinements` (`-gr`) command
  line argument.

- The finite element order can be controlled using the `--order-refinements`
  (`-or`) command line argument.

<div class="panel panel-danger" style="width:92%; margin-left: auto; margin-right: auto;">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-warning"></i>&nbsp; Warning</h3>
</div>
<div class="panel-body">
Each additional order refinement increases the order by a factor of 2. This
quickly becomes computationally expensive, so be careful when increasing the order refinements.
</div>
</div>

- This example runs **matrix-free** using MFEM's [partial assembly algorithms](/performance). Matrix-free methods are **much** more efficient for high-order problems and
  also work better on GPU architectures.

- Try comparing the performance of `ex1p` and `ex26p` for higher-order
  problems. For example, compare the run time of the following two runs:

        mpirun -np 32 ./ex26p -m ../data/fichera.mesh -or 2
        mpirun -np 32 ./ex1p -m ../data/fichera.mesh -o 1

- Both examples solve a degree-4 Poisson problem with 1,884,545 degrees of
  freedom, but one of them is significantly faster.

- Explore how the number of CG iterations changes as `-or` and `-gr` are
  increased. (For large problems, it may be worth running `ex26p` in parallel
  with `mpirun`.)

---

### <i class="fa fa-check-square-o"></i>&nbsp; Low-order-refined methods

<div class="col-md-6" markdown="1">
<img src="../img/solvers3.png" width="240">
</div>
<div class="col-md-6" markdown="1">
<img src="../img/solvers4.png" width="240">
</div>

<div class="col-md-12" markdown="1" style="padding-left:0;">

- [Examples 1, 2, 3, and 4](#scalable-algebraic-multigrid-preconditioners-from-hypre)
  used _algebraic_ methods applied to the discretization matrix for
  each of the problems. [Example 26](#mfems-native-multigrid-solver) showed how to use _geometric_
  multigrid together with _matrix-free_ methods.

- _Low-order-refined_ (LOR) is an alternative matrix-free methodology for
  solving these problems. The **LOR solvers** miniapp provides matrix-free solvers for the same problems
  solved in Examples 1, 3, and 4.

- Go to the LOR solvers miniapp directory: `cd ~/mfem/miniapps/solvers`

- Run `make plor_solvers` to build the parallel LOR solvers miniapp.

- The `--fe-type` (or `-fe`) command line argument can be used to choose the
  problem type.

    - `-fe h` solves an $H^1$ problem (Poisson, equivalent to `ex1`).

    - `-fe n` solves a Nedelec problem (Maxwell in $H(\mathrm{curl})$, equivalent
      to `ex3`).

    - `-fe r` solves a Raviart-Thomas problem (grad-div in $H(\mathrm{div})$,
      equivalent to `ex4`).

- As usual, the `--mesh` (`-m`) argument can be used to choose the mesh file.
  (Keep in mind that MFEM's meshes in the data directory are now found in
  `../../data` relative to the miniapp directory.)

- The number of mesh refinements in serial and parallel can be controlled with
  the `--refine-serial` and `--refine-parallel` (`-rs` and `-rp`) command line
  arguments

- The polynomial degree can be controlled with the `--order` (`-o`) argument.

- Compare the performance of high-order problems with `plor_solvers` to that of
  Examples 1, 3, and 4. Here are some sample runs to compare:

        //  2D, 5th order, 256,800 DOFs
        mpirun -np 8 ./plor_solvers -fe n -m ../../data/star.mesh -rs 2 -rp 2 -o 5 -no-vis
        mpirun -np 8 ../../examples/ex3p -m ../../data/star.mesh -o 5

        // 3D, 2nd order, 2,378,016 DOFs
        mpirun -np 24 ./plor_solvers -fe n -m ../../data/fichera.mesh -rs 2 -rp 2 -o 3 -no-vis
        mpirun -np 24 ../../examples/ex3p -m ../../data/fichera.mesh -o 3

- For more details on how LOR solvers work in MFEM, see the _High-Order Matrix-Free Solvers_ talk ([PDF](../pdf/workshop21/15_WillPazner_High_Order_Solvers.pdf), [video](https://youtu.be/d6Ic9itl21g)) from the 2021 MFEM community [workshop](https://mfem.org/workshop).

---

### <i class="fa fa-check-square-o"></i>&nbsp; Additional solver integrations

In addition to the _hypre_ AMG solvers and MFEM's built-in solvers illustrated
above, MFEM also integrates with a number of third-party solver libraries,
including:

- [PETSc](https://petsc.org/release/) &mdash; see the `~/mfem/examples/petsc` directory

- [SuperLU](https://portal.nersc.gov/project/sparse/superlu/) &mdash; see the `~/mfem/examples/superlu` directory

- [STRUMPACK](https://portal.nersc.gov/project/sparse/strumpack/) &mdash; see `~/mfem/examples/ex11p.cpp`

- [Ginkgo](https://ginkgo-project.github.io) &mdash; see the `~/mfem/examples/ginkgo` directory

- [AmgX](https://developer.nvidia.com/amgx) &mdash; see the `~/mfem/examples/amgx` directory

These third-party libraries are not pre-installed in the AWS image, but you can still
peruse the example source code to see the capabilities of the various integrations.

<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
If you <a href="../further/#install-mfem-glvis-on-your-own-machine">install MFEM locally</a>,
you can enable these third-party solver library integrations with the <code>MFEM_USE_*</code>
configuration variables, e.g., by specifying <code>MFEM_USE_PETSC=YES</code>.
</div>
</div>

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
<li> <a href="../examples"><i class="fa fa-gears"></i>&nbsp; Tour of MFEM Examples</a>
<li> <a href="../meshvis"><i class="fa fa-picture-o"></i>&nbsp; Meshing and Visualization</a>
<li> <a href="../further"><i class="fa fa-rocket"></i>&nbsp; Further Steps</a>
</ul>
</div>
</div>

---

Back to the [MFEM tutorial page](index.md)

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
