## <i class="fa fa-tasks"></i>&nbsp; Solvers and Scalability

<span class="label label-default">30 minutes</span>
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

---

### <i class="fa fa-check-square-o"></i>&nbsp; Scalable algebraic multigrid preconditioners from hypre
- MFEM comes with a large number of [example codes](/examples/) that demonstrate
  different physical applications, finite element discretizations, and linear
  solvers.
    - Example 1 solves a Poisson problem, example 2 solves a linear elasticity
      problem, example 3 solves a definite Maxwell (electromagnetics) problem,
      and example 4 solves grad-div diffusion problem.
- The parallel versions of these examples (ex1p, ex2p, ex3p, ex4p) each use
  suitable **algebraic multigrid preconditioners** from the
  [_hypre_](https://github.com/hypre-space/hypre/) solvers library.

#### <i class="fa fa-arrow-circle-right"></i>&nbsp; Example 1: Poisson problem and algebraic multigrid

- First, make sure you are in the examples subdirectory: `cd ~/mfem/examples`
- Ensure the parallel version of example 1 is built: `make ex1p`
- Run the parallel version of example 1, solving a Poisson problem: `./ex1p`
- After forming the linear system, MFEM uses _hypre_ to construct and apply an
  algebraic multigrid preconditioner. Details of the AMG preconditioner are
  provided in the example output under the headers `BoomerAMG SETUP PARAMETERS`
  and `BoomerAMG SOLVER PARAMETERS`.

- <details>
    <summary>Click to expand for terminal output</summary>
    <img class="tight" src="../img/solvers1.png">
  </details>

- A key feature of AMG methods is their scalability
    - <i class="fa fa-hand-o-right"></i>&nbsp; With default options,
      convergence is achieved in 18 conjugate gradient iterations.
- Let's see what happens if we increase the mesh refinement. Edit `ex1p.cpp`
  changing line 153 as follows:
```diff
@@ -150,7 +150,7 @@ int main(int argc, char *argv[])
    ParMesh pmesh(MPI_COMM_WORLD, mesh);
    mesh.Clear();
    {
-      int par_ref_levels = 2;
+      int par_ref_levels = 3;
       for (int l = 0; l < par_ref_levels; l++)
       {
          pmesh.UniformRefinement();
```

- This adds one additional level of refinement, making the problem roughly 4x as
  large in 2D, or 8x as large in 3D.
- Rebuild the example (`make ex1p`) and re-run it: `./ex1p`
- Even though the number of unknowns for this problem has increased by roughly
  4x, the iteration count remains at 18 &mdash; this is due to the
  **scalability** of the AMG preconditioner.
- Let's now try a 3D problem.
    - <i class="fa fa-info-circle"></i>&nbsp; To run a 3D problem, we just need
      to choose a 3D mesh using the `-m` or `--mesh` command line argument.
- Because these problems are more computationally
  expensive, let's reduce the refinement level, setting
  `int par_ref_levels = 1;` in the `ex1p.cpp` source code.
- Rebuild the example (`make ex1p`) and re-run it using the three-dimensional
  _Fichera_ mesh: `./ex1p -m ../data/fichera.mesh`
    - <i class="fa fa-hand-o-right"></i>&nbsp; Convergence is attained in only
      16 iterations.

<img class="tight" width="300" style="padding: 30px;" src="../img/solvers2.png">

- Finally, let's take a look at the parallel scalability of the solvers.
    - Increase the refinement level: `int par_ref_levels = 2;`
    - Recompile: `make ex1p`
    - Now run the 3D example on 8 cores: `mpirun -np 8 ./ex1p -m ../data/fichera.mesh`
    - This is an example of a [weak scaling
      test](https://en.wikipedia.org/wiki/Scalability#Weak_versus_strong_scaling):
      the problem size and the number of processors are both increased by a
      factor of 8.
    - Because the PCG iteration counts remain roughly constant, the total time
      to solution should remain roughly fixed (minus some overhead and
      communication cost), even though we are solving a problem that is 8x
      larger.


#### <i class="fa fa-arrow-circle-right"></i>&nbsp; Example 2: linear elasticity

- This example demonstrates solving a [linear
  elasticity](https://en.wikipedia.org/wiki/Linear_elasticity) cantilever beam
  problem with different materials.
- This example is designed to work with any of the "beam" meshes provided by
  MFEM
    - Run `ls ../data | grep beam` to list the available meshes.
    - The elements and boundaries of these meshes are assigned
      attributes/materials suitable for the cantilever problem:

```text
                                 +----------+----------+
                    boundary --->| material | material |<--- boundary
                    attribute 1  |    1     |    2     |     attribute 2
                    (fixed)      +----------+----------+     (pull down)

```

- Try running `./ex2p` to run a 2D elasticity problem.
- As in example 1, the linear system is solved using _algebraic multigrid_.
- For this example, two types of AMG solvers can be used:
    1. A special version of AMG designed specifically for elasticity ([see this
       paper](https://onlinelibrary.wiley.com/doi/pdf/10.1002/nla.688))
    2. AMG for systems.
- To enable the special elasticity AMG, add the flag `-elast`. Otherwise, AMG
  for systems will be used.
- The polynomial degree (order) can be changed with the `--order` argument (`-o`
  for short).
    - By default, low-order $(p=1)$ elements are used.
    - <i class="fa fa-exclamation-circle"></i>&nbsp; Using higher-order elements
      can become computationally expensive very quickly. See the section on
      [low-order-refined methods](#low-order-refined-methods) for a more
      efficient approach.
- Additionally, _static condensation_ can be used to eliminate interior
  high-order degrees of freedom and obtain a smaller system.
    - For `-order 1` this has no effect. For higher-order problems, static
      condensation can improve efficiency.
- In this example, as before, the mesh refinement level can be controlled in the
  source code through `par_ref_levels`.
    - <i class="fa fa-info-circle"></i>&nbsp; Remember to recompile the example
      after editing the source code (`make ex2p`).
- Running with more than one MPI rank will partition the mesh and run the
  problem in parallel
    - Sample run 3D: `mpirun -np 8 ./ex2p -m ../data/beam-hex.mesh`
- Try experimenting with different discretization, solver, and parallelization
  options.

#### <i class="fa fa-arrow-circle-right"></i>&nbsp; Examples 3 and 4: the de Rham complex

- Examples 3 and 4 demonstrate the use of _vector finite element spaces_.
    - Example 3 solves an electromagnetics problem using $H(\mathrm{curl})$
      finite elements.
    - Example 4 solves a grad-div problem using $H(\mathrm{div})$ finite
      elements.
- Standard multigrid methods don't always work well for these problems
    - <i class="fa fa-hand-o-right"></i>&nbsp; We need specialized solvers! (See
      [here](https://link.springer.com/article/10.1007/PL00005386) for a paper
      on this topic)
- <i class="fa fa-info-circle"></i>&nbsp; For $H(\mathrm{curl})$ problems, we use the [AMS solver](https://hypre.readthedocs.io/en/latest/solvers-ams.html) from hypre.
- <i class="fa fa-info-circle"></i>&nbsp; For $H(\mathrm{div})$ problems, we
  either use the [ADS
  solver](https://hypre.readthedocs.io/en/latest/solvers-ads.html) from hypre or
  a special [hybridization
  solver](https://epubs.siam.org/doi/abs/10.1137/17M1132562).
- Try experimenting with different options to get a feel for the performance of
  the discretizations and solvers.
    - Change the mesh (2D or 3D) using the `--mesh` (`-m`) command line
      argument.
    - Change the polynomial degree using the `--order` (`-o`) command line
      argument.
    - Run problems in parallel using `mpirun`
    - For `ex4p`, enable hybridization using the `-hb` flag.

---

### <i class="fa fa-check-square-o"></i>&nbsp; MFEM's native Multigrid solver

- The previous examples (`ex1p`, `ex2p`, `ex3p`, and `ex4p`) all used
  _algebraic_ multigrid methods.
- MFEM also supports geometric ($h$- and $p$-multigrid) methods.
- These solvers are illustrated in example 26 (and its parallel variant).
- Mesh refinement can be set using the `--geometric-refinements` (`-gr`) command
  line argument.
- The finite element order can be controlled using the `--order-refinements`
  (`-or`) command line argument.
    - <i class="fa fa-exclamation-circle"></i>&nbsp; **Note:** each additional
      order refinement **increases the order by a factor of 2**. This quickly
      becomes expensive, so be careful increasing the oreder refinements.
- <i class="fa fa-exclamation-circle"></i>&nbsp; This example runs
  **matrix-free** using MFEM's [partial assembly algorithms](/performance).
    - Matrix-free methods are **much** more efficient for high-order problems
      and work better on GPUs.
    - <i class="fa fa-info-circle"></i>&nbsp; Try comparing the performance of
      `ex1p` and `ex26p` for higher-order problems.
    - For example, compare the run time of `mpirun -np 8 ./ex26p -m
      ../data/fichera.mesh -or 2` to that of `mpirun -np 8 ./ex1p -m
      ../data/fichera.mesh -o 4`
     - Both examples solve a degree-4 Poisson problem with 1,884,545 degrees of
       freedom, but one is significantly faster.
- Try seeing how the number of CG iterations changes as `-or` and `-gr` are
  increased.
    - For large problems, it may be worth running `ex26p` in parallel with
      `mpirun`.

---

### <i class="fa fa-check-square-o"></i>&nbsp; Low-order-refined methods

<table>
    <tr>
        <td><img src="../img/solvers3.png" width="50%"/></td>
        <td><img src="../img/solvers4.png" width="50%"/></td>
    </tr>
</table>

- [Examples 1, 2, 3, and
  4](#scalable-algebraic-multigrid-preconditioners-from-hypre) used _algebraic
  multigrid methods_ applied to the discretization matrix for each of the
  problems.
- [Example 26](#mfems-native-multigrid-solver) showed how to use geometric multigrid together with matrix-free
  methods.
- _Low-order-refined_ provides an alternative matrix-free methodology for
  solving these problems.
- The **LOR solvers** miniapp provides matrix-free solvers for the same problems
  solved in examoples 1, 3, and 4.
- `cd` to the LOR solvers miniapp directory: `cd ~/mfem/miniapps/solvers`
- Run `make plor_solvers` to build the parallel LOR solvers miniapp.
- The `--fe-type` (or `-fe`) command line argument can be used to choose the
  problem type.
    - `-fe h` solves an $H^1$ problem (Poisson, equivalent to example 1).
    - `fe n` solves a Nedelec problem (Maxwell in $H(\mathrm{curl})$, equivalent
      to example 3).
    - `fe r` solves a Raviart-Thomas problem (grad-div in $H(\mathrm{div})$,
      equivalent to example 4).
- As usual, the `--mesh` (`-m`) argument can be used to choose the mesh file.
    - <i class="fa fa-info-circle"></i>&nbsp; Keep in mind, MFEM's meshes in the
      data directory are now found in `../../data` relative to the miniapp
      directory.
- The number of mesh refinements in serial and parallel can be controlled with
  the `--refine-serial` and `--refine-parallel` (`-rs` and `-rp`) command line
  arguments
- The polynomial degree can be controlled with the `--order` (`-o`) argument.
- Compare the performance of high-order problems with `plor_solvers` to that of
  examples 1, 3, and 4.
- Some sample runs to compare:
    - 2D, order 5, 256,800 DOFs:
        - `mpirun -np 8 ./plor_solvers -fe n -m ../../data/star.mesh -rs 2 -rp 2
          -o 5 -no-vis`
        - `mpirun -np 8 ../../examples/ex3p -m ../../data/star.mesh -o 5`
    - 3D, order 2, 2,378,016 DOFs:
        - `mpirun -np 8 ./plor_solvers -fe n -m ../../data/fichera.mesh -rs 2
          -rp 2 -o 2 -no-vis`
        - `mpirun -np 8 ../../examples/ex3p -m ../../data/fichera.mesh -o 2`

---

### <i class="fa fa-check-square-o"></i>&nbsp; Additional solver integrations
- PETSc, SuperLU and STRUMPACK

---

<div class="panel panel-warning">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-question-circle"></i>&nbsp; Questions?</h3>
</div>
<div class="panel-body">
Ask for help on the tutorial <a href="https://radiuss-llnl.slack.com/archives/C03HKL68HPT">Slack channel</a>.
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
