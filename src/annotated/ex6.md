## <i class="fa fa-book"></i>&nbsp; Example 6: Poisson Problem with AMR

<span class="label label-default">30 minutes </span>
<span class="label label-default">intermediate</span>

---

<div class="panel panel-success">
  <div class="panel-heading">
    <h3 class="panel-title"><i class="fa fa-check"></i>&nbsp; Example 6 Objectives</h3>
  </div>
  <div class="panel-body" style="line-height: 1.8;">
    <i class="fa fa-square-o"></i>&nbsp; Understand how to set up and solve the Poisson equation with adaptive mesh refinement (AMR) in MFEM.<br>
    <i class="fa fa-square-o"></i>&nbsp; Learn to use the ZZ error estimator to drive local mesh refinement in 2D and 3D.<br>
    <i class="fa fa-square-o"></i>&nbsp; Explore both conforming and non-conforming refinements (triangles, quads, tetrahedra, hexes).<br>
    <i class="fa fa-square-o"></i>&nbsp; Practice interpolation of solution fields between coarse and refined meshes.<br>
  </div>
</div>


<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
Complete the <a href="../../tutorial/fem"><i class="fa fa-play-circle"></i>&nbsp; Example 1</a> tutorial before starting this lesson.
</div>
</div>

---

### <i class="fa fa-check-square-o"></i>&nbsp; Poisson's equation

The [_Poisson Equation_](https://en.wikipedia.org/wiki/Poisson's_equation) is a
partial differential equation (PDE) that can be used to model steady-state heat
conduction, electric potentials, and gravitational fields. In mathematical terms

$$
-\Delta u = f
$$

where _u_ is the potential field and _f_ is the source function. This PDE is a
generalization of the [_Laplace Equation_](https://en.wikipedia.org/wiki/Laplace%27s_equation).

To approximately solve the above continuous equation on computers, we need to
[discretize](https://en.wikipedia.org/wiki/Discretization) it by introducing a
finite (discrete) number of unknowns to compute for. In the
[_Finite Element Method_](https://en.wikipedia.org/wiki/Finite_element_method) (FEM),
this is done using the concept of _basis functions_.

Instead of calculating the exact analytic solution _u_, we approximate it

$$
u \approx u_h := \sum_{j=1}^n c_j \varphi_j
$$

where $u_h$ is the finite element approximation with degrees of freedom (unknown
coefficients) $c_j$, and $\varphi_j$ are known _basis functions_. The FEM basis
functions are typically piecewise-polynomial functions on a given computational mesh,
which are only non-zero on small portions of the mesh.


To solve for the unknown coefficients in (2), we consider the <a href="../../fem_weak_form/">weak</a> (or variational) form of the Poisson equation. This is obtained by first multiplying with another (test) basis function $\varphi_i$:

$$-\sum_{j=1}^n c_j \int_\Omega \Delta \varphi_j \varphi_i = \int_\Omega f \varphi_i$$

and then integrating by parts using the [divergence theorem](https://en.wikipedia.org/wiki/Divergence_theorem):

$$\sum_{j=1}^n c_j \int_\Omega \nabla \varphi_j \cdot \nabla \varphi_i = \int_\Omega f \varphi_i$$

Here we are assuming that the boundary term vanishes due to homogeneous
Dirichlet boundary conditions corresponding, for example, to zero temperature on
the whole boundary.

Since the basis functions are known, we can rewrite (4) as

$$
A x = b
$$

where

$$
A_{ij} = \int_\Omega \nabla \varphi_j \cdot \nabla \varphi_i
$$

$$
b_i = \int_\Omega f \varphi_i
$$

$$
x_j = c_j
$$

This is a $n \times n$ linear system that can be solved directly or iteratively
for the unknown coefficients. Note that we are free to choose the computational
mesh and the basis functions $\varphi_i$, and therefore the finite space, as we
see fit.

<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
The above is a basic introduction to finite elements in the simplest possible settings.
To learn more, you can visit MFEM's <a href="../../fem/">Finite Element Method</a> page.
</div>
</div>

---
### <i class="fa fa-check-square-o"></i>&nbsp; Adaptive Mesh Refinement (AMR)
<!-- Prathik -->

Adaptive mesh refinement (AMR) method has been widely used in scientific computing to get better accuracy with minimum degrees of freedom. Instead of uniformly refining the mesh, AMR dynamically refines the mesh only in regions where the solution requires higher resolution.

The main ideas behind AMR are:

- **Localized refinement**

   Refine the mesh where the solution needs more resolution (higher error regions).

- **Equidistribution of error** 

   After sufficient refinement, the discretization error should be approximately uniform across the elements, optimizing resource usage.

- **Efficiency**

   Compared to uniform refinement, AMR achieves a desired accuracy with significantly fewer degrees of freedom (DoFs), leading to major computational savings.


**Motivation for AMR in Poisson's equation**

- Singularities at reentrant corners

- Sudden changes inside the domain caused by strong force terms

- Boundary layers near domain boundaries

**AMR Algorithm:**

1. **Solve:**
Find $u_h \in V_h$ such that

$$
a(u_h, v_h) = (f, v_h)
$$

for all $v_h \in V_h.$

2. **Estimate:**
   For each element K, compute the local error indicator $\eta_K$ (explained in detail in next section).

3. **Mark:**
   Select elements K where $\eta_K$ is relatively large.

$$
\eta_K > \theta \max_{K' \in T_h} \eta_{K'}
$$

   Where $\theta \in (0,1)$ controls the maximum fraction of error. This ensure elements with reltively large errors are refined.

4. **Refine:**
   Refine the selected elements to create a new mesh $T_h'$. A conforming refinement is used for triangles/ tetrahedra, and a non-conforming refinement is used for quadrilaterals/ hexahedrals.

5. **Transfer:**
   Interpolate or project $u_h$ onto the new finite element space $V_h'$.

6. **Repeat:**
    Solve \rightarrow Estimate \rightarrow Mark \rightarrow Refine \rightarrow Transfer 

   until convergence is achieved or a target number of degrees of freedom (DoFs) is reached.

**References**

- Berger, M.J. and Oliger, J., 1984. Adaptive mesh refinement for hyperbolic partial differential equations. Journal of computational Physics, 53(3), pp.484-512.
- Berger, M.J. and Colella, P., 1989. Local adaptive mesh refinement for shock hydrodynamics. Journal of computational Physics, 82(1), pp.64-84.

---
### <i class="fa fa-check-square-o"></i>&nbsp; Zienkiewicz–Zhu (ZZ) Error Estimator
The [_Zienkiewicz–Zhu (ZZ) error estimator_](https://docs.mfem.org/html/classmfem_1_1ZienkiewiczZhuEstimator.html) is a popular recovery-based a posteriori error indicator for finite element solutions. It works by comparing the raw finite-element gradient (or stress) field to a “smoothed” (recovered) field and using their difference as an estimate of the local discretization error.

#### Key Ideas
- **Finite Element Gradient**  
   From the computed solution $u_h$, you can evaluate the element-wise gradient (or stress)  

$$
\nabla u_h \quad (\text{or } \sigma_h) .
$$

- **Recovery**  
   Build a higher-quality, continuous gradient field $\nabla u^*$ (or $\sigma^*$) by fitting a patch-wise polynomial through neighboring element values or applying a weighted averaging of nodal slopes.  

- **Local Error Indicator**  
   On each element $K$, define  

$$
\eta_K = \|\nabla u^* - \nabla u_h\|_{L^2(K)}  
\quad\bigl(\text{or } \|\sigma^* - \sigma_h\|\bigr).
$$

- **Global Estimate**  
   Sum or square–sum over all elements to get a global error estimate:  

$$
\eta = \Bigl(\sum_{K} \eta_K^2\Bigr)^{1/2}.
$$

#### Advantages

- **Simplicity**: Only requires post-processing of existing solution gradients.  
- **Accuracy**: Often yields reliable error localization even on unstructured meshes.  
- **Efficiency**: Computational cost is low compared to residual-based estimators.

#### Typical Workflow

- Solve the PDE with your chosen finite element discretization.  
- Compute elementwise gradients $\nabla u_h$.  
- Recover a smoothed gradient $\nabla u^*$.  
- Estimate $\eta_K$ on each element and mark for refinement.  
- Refine mesh elements with largest $\eta_K$ and repeat.

**Reference:**  
[1] Zienkiewicz, O.C. and Zhu, J.Z., The superconvergent patch recovery and a posteriori error estimates. Part 1: The recovery technique. Int. J. Num. Meth. Engng. 33, 1331-1364 (1992).

[2] Zienkiewicz, O.C. and Zhu, J.Z., The superconvergent patch recovery and a posteriori error estimates. Part 2: Error estimates and adaptivity. Int. J. Num. Meth. Engng. 33, 1365-1382 (1992).

---


### <i class="fa fa-check-square-o"></i>&nbsp; Annotated Example 6

Below is the classification of each mesh file used in the sample runs, indicating the dimension, element type, and whether it is conforming or non-conforming:

| Mesh File                   | Dimension   | Element Type                 | Classification    |
|-----------------------------|-------------|-------------------------------|-------------------|
| `square-disc.mesh`          | 2D          | triangles                     | conforming        |
| `square-disc-nurbs.mesh`    | 2D          | NURBS quadrilaterals          | non-conforming    |
| `star.mesh`                 | 2D          | triangles                     | conforming        |
| `escher.mesh`               | 2D          | quadrilaterals                | non-conforming    |
| `fichera.mesh`              | 3D          | tetrahedrons                  | conforming        |
| `disc-nurbs.mesh`           | 2D          | NURBS quadrilaterals          | non-conforming    |
| `ball-nurbs.mesh`           | 3D          | NURBS hexahedra               | non-conforming    |
| `pipe-nurbs.mesh`           | 3D          | NURBS hexahedra               | non-conforming    |
| `star-surf.mesh`            | 2D surface  | triangles                     | conforming        |
| `square-disc-surf.mesh`     | 2D surface  | triangles                     | conforming        |
| `amr-quad.mesh`             | 2D          | quadrilaterals                | non-conforming    |

MFEM's Example 6 implements the Laplace equation $-\Delta u = 1$ with homogeneous Dirichlet boundary conditions, enriched by a simple adaptive mesh refinement (AMR) loop. The refinements can be conforming (triangles, tetrahedra) or non-conforming (quadrilaterals, hexahedra) based on a Zienkiewicz–Zhu (ZZ) error estimator. Example 6 demonstrates MFEM’s support for 2D/3D, linear/curved and surface meshes, as well as function interpolation between coarse and refined meshes and persistent GLVis visualization.  We recommend reviewing Example 1 before this example. The source file is [examples/ex6.cpp](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp).

Below we highlight selected portions of the example code and connect them with the description above. You can follow along by opening `ex6.cpp` in your editor. In the settings of this tutorial, the visualization will automatically update in the GLVis browser window.

#### The Mesh

The computational mesh for this problem is shown in the table. For instance, it could be set to `pipe-nurbs.mesh`. We can use GLVis to generate a visualization of this mesh by running `glvis -m
pipe-nurbs.mesh`.

<img src="../img/ex6_1.png" width="300">

The code in lines [94-96](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L94-96)
loads the mesh from the given file, `mesh_file` and creates the corresponding
MFEM object `mesh` of class `Mesh`.
```c++
Mesh mesh(mesh_file, 1, 1);
int dim  = mesh.Dimension();
int sdim = mesh.SpaceDimension();
```
If the mesh is NURBS, it is uniformly refined twice and then converted to a quadratic curved mesh (lines [101-108](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L101-108)):
```c++
if (mesh.NURBSext)
{
   for (int i = 0; i < 2; i++)
   {
      mesh.UniformRefinement();
   }
   mesh.SetCurvature(2);
}
```

#### Defining Variables and Spaces
In the next section we create the finite element space, i.e., specify the finite element basis functions on the mesh. This involves the MFEM class and `FiniteElementSpace`, which connects the space and the mesh. The code in lines [112-113](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L112-113) is essentially:

```c++
H1_FECollection fec(order, dim);
FiniteElementSpace fespace(&mesh, &fec);
```

#### Set up the error estimator
We use the metioned ZZ error estimator in lines [160-174](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L160-174)
- **Error Estimator**  
  - `ZienkiewiczZhuEstimator`: computes element errors by subtracting a “smoothed” gradient (recovered via `DiffusionIntegrator`) from the original.  
  - `LSZienkiewiczZhuEstimator`: a least‐squares variant activated with `-ls`, useful for certain mesh types.  
  - In 3D on non-hexahedral meshes, Tikhonov regularization improves conditioning.

```c++
if (LSZZ)
   {
      estimator = new LSZienkiewiczZhuEstimator(*integ, x);
      if (dim == 3 && mesh.GetElementType(0) != Element::HEXAHEDRON)
      {
         dynamic_cast<LSZienkiewiczZhuEstimator *>
         (estimator)->SetTichonovRegularization();
      }
   }
   else
   {
      auto flux_fes = new FiniteElementSpace(&mesh, &fec, sdim);
      estimator = new ZienkiewiczZhuEstimator(*integ, x, flux_fes);
      dynamic_cast<ZienkiewiczZhuEstimator *>(estimator)->SetAnisotropic();
   }
```
We create a threshold refiner to determine when to refine the mesh (lines [180-181](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L160-174)).
- **ThresholdRefiner**  
  - `SetTotalErrorFraction(0.7)`: marks elements whose cumulative error reaches 70% for refinement.  
  - Supports both conforming (tri/tet) and non-conforming (quad/hex) refinements.
```c++
ThresholdRefiner refiner(*estimator);
refiner.SetTotalErrorFraction(0.7);
```


#### Adaptive Mesh Refinement loop

The main AMR loop (in lines [185–275](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L185–275)). The process can be summarized as several steps.
1. Iteration start & logging  (lines [185-189](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L185–189)). This begins a new AMR iteration, retrieve the current number of true DoFs (cdofs) and print iteration index and DoF count. 
```c++
for (int it = 0; ; it++)
{
   int cdofs = fespace.GetTrueVSize();
   cout << "\nAMR iteration " << it << endl;
   cout << "Number of unknowns: " << cdofs << endl;
```
2. Assemble the right-hand side, stiffness matrix and apply Dirichlet boundary conditions (lines [192-201](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L192-201)).
```c++
b.Assemble();
// 14. Set Dirichlet boundary values in the GridFunction x.
//     Determine the list of Dirichlet true DOFs in the linear system.
Array<int> ess_tdof_list;
x.ProjectBdrCoefficient(zero, ess_bdr);
fespace.GetEssentialTrueDofs(ess_bdr, ess_tdof_list);

// 15. Assemble the stiffness matrix.
a.Assemble();
```
<!-- Prathik -->
<!-- Complete the other parts. -->



**Forming the linear system**

The linear system is formed (in lines [206-210](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L206-210)), solved (in lines [218-231](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L218-231)), and the solution is recovered through the following steps (in line [236](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L236)):

```c++
OperatorPtr A;
Vector B, X;
const int copy_interior = 1;
a.FormLinearSystem(ess_tdof_list, x, b, A, X, B, copy_interior);
```
The method `FormLinearSystem` takes the bilinear form a, linear form b, current solution x, and a list of essential boundary degrees of freedom `ess_tdof_list`. It eliminates boundary conditions, handles any constraints, and sets up the system for the true degrees of freedom only. The flag `copy_interior = 1` ensures that the interior (unconstrained) DOFs are copied properly for consistency.

This process produces `A` (the assembled system matrix), `B` (the right-hand side vector), `X` (the unknowns vector to solve for).

**Solving the linear system:**

```c++
if (!pa)
{
    // Full assembly mode
#ifndef MFEM_USE_SUITESPARSE
    GSSmoother M((SparseMatrix&)(*A));
    PCG(*A, M, B, X, 3, 200, 1e-12, 0.0);
#else
    UMFPackSolver umf_solver;
    umf_solver.Control[UMFPACK_ORDERING] = UMFPACK_ORDERING_METIS;
    umf_solver.SetOperator(*A);
    umf_solver.Mult(B, X);
#endif
}
else
{
    // Partial assembly mode
    OperatorJacobiSmoother M(a, ess_tdof_list);
    PCG(*A, M, B, X, 3, 2000, 1e-12, 0.0);
}
```

There are two solving strategies depending on whether partial assembly (`pa`) is enabled:

**Full Assembly Mode (`pa == false`)** 
- If MFEM is not compiled with `SuiteSparse`, a symmetric **Gauss-Seidel smoother (`GSSmoother`)** is used as a preconditioner for a preconditioned conjugate gradient (`PCG`) solver.
- If MFEM is compiled with `SuiteSparse`, the system is solved directly using the **`UMFPackSolver`** (a direct sparse solver with METIS ordering for efficiency).

**Partial Assembly Mode (`pa == true`)** 
- A simple diagonal (Jacobi) preconditioner (**`OperatorJacobiSmoother`**) is used.
- `PCG` is used with more iterations allowed (up to 2000 iterations) since partial assembly typically results in slightly less robust preconditioning.

**Recovering the finite element solution:**

```c++
a.RecoverFEMSolution(X, b, x);
```

After solving the system for the true DOFs `X`, the full finite element solution `x` is reconstructed. Constrained DOFs (like boundary conditions or hanging nodes) are interpolated appropriately. As a result, `x.Size()` may be larger than `X.Size()`.

**Termination condition (in lines [245-249](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L245-249)):**

```c++
if (cdofs > max_dofs)
{
    cout << "Reached the maximum number of dofs. Stop." << endl;
    break;
}
```

The loop terminates if the number of degrees of freedom exceeds a preset `limit max_dofs`, ensuring that the refinement or solution process doesn't consume too much memory or computation time.


**Adaptive refinement loop**

After solving the linear system, the mesh is refined adaptively based on error estimation (in lines [255-260](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L255-260)), and the finite element space and solution are updated (in lines [268-269](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L268-269)) accordingly:

```c++
refiner.Apply(mesh);
if (refiner.Stop())
{
    cout << "Stopping criterion satisfied. Stop." << endl;
    break;
}
```
The method `refiner.Apply(mesh)` first computes local error indicators using the error estimator, then selects elements for refinement based on a marking strategy. It refines the selected elements (h-refinement) to improve solution accuracy. After refinement, `refiner.Stop()` checks if a stopping criterion, such as reaching a target error level or maximum mesh size, has been met, and exits the loop if necessary.

**Update the finite element space and solution:**

```c++

fespace.Update();
x.Update();

```
After mesh refinement, `fespace.Update()` updates the finite element space to match the new mesh and computes an interpolation matrix. Then, `x.Update()` uses this matrix to transfer the old solution onto the new space, providing a good initial guess that helps reduce solver iterations in the next step.

**Update bilinear and linear forms (in lines [273-274](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L273-274)) :**

```c++
a.Update();
b.Update();
```

`a.Update()` and `b.Update()` rebuild the internal data structures associated with the new mesh and finite element space.

Finally, after the refinement loop is completed, the error estimator object is deleted to free memory (in line [277](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp#L277)).

The figure is an example of refinement for example `pipe-nurbs.mesh`

<img src="../img/ex6_2.png" width="1000">

---

Back to the the <a href="../../getting-started"><i class="fa fa-play-circle"></i>&nbsp;Getting Started</a> page.

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">