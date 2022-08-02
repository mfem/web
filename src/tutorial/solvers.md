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

<img class="tight" src="../img/solvers1.png">

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
- Let's now try a 3D problem. Because these problems are more computationally
  expensive, let's reduce the refinement level, setting `int par_ref_levels =
  1;`
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

---

### <i class="fa fa-check-square-o"></i>&nbsp; MFEM's native Multigrid solver
- Example 26

---

### <i class="fa fa-check-square-o"></i>&nbsp; Low-order refined methods
- Solvers and Transfer miniapps

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
