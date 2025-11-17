## <i class="fa fa-book"></i>&nbsp; The Obstacle Problem

<span class="label label-default">30 minutes</span>
<span class="label label-default">intermediate</span>

---

<div class="panel panel-success">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-check"></i>&nbsp; Lesson Objectives</h3>
</div>
<div class="panel-body" style="line-height: 1.8;">
<i class="fa fa-square-o"></i>&nbsp; Understand a finite element discretization of the obstacle problem in MFEM.<br>
<i class="fa fa-square-o"></i>&nbsp; Learn how to solve nonlinear variational systems in MFEM.<br>
</div>
</div>

<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
We assume you are already familiar with the Finite Element Method and how to implement it using MFEM. Please complete the <a href="../start"><i class="fa fa-play-circle"></i>&nbsp; Getting Started</a> page and the <a href="../fem"><i class="fa fa-play-circle"></i>&nbsp; Finite Element Basics</a> page before this lesson.
</div>
</div>

---

The [_obstacle problem_](https://en.wikipedia.org/wiki/Obstacle_problem) is an
example of a free boundary problem. Particularly, the task is to find the
resting position of an elastic membrane with fixed boundary, constrained to lie
above a given obstacle. In mathematical terms, we seek to minimize the
Dirichlet energy functional

$$
J(v) = \frac{1}{2} \int_\Omega |\nabla v|^2 \, \mathrm{d} x
$$

over the set of admissible functions

$$
K = \\{v \in H^1(\Omega) : v|_{\partial \Omega} = g \text{ and } v \geq \varphi\\},
$$

where $\Omega$ is an open bounded domain with smooth boundary and $\varphi$ is
a smooth function representing the obstacle.

We will discretize and solve this problem using the proximal Galerkin finite
element method, introduced by [Keith and
Surowiec](https://arxiv.org/abs/2307.12444). In this method, given linear
subspaces $V_h \subset H_0^1(\Omega)$ and $W_h \subset L^\infty(\Omega)$, we
aim to find $u_h \in g_h + V_h$ and $\psi_h \in W_h$ such that

$$
\begin{equation}
\begin{aligned}
(\alpha_{k+1} \nabla u_h, \nabla v) + (\psi_h, v) &= (\alpha_{k+1} f + \psi_h^k, v) && \text{for all } v \in V_h, \\\\
(u_h,w) - (\exp \psi_h, w) &= (\varphi,w) && \text{for all } w \in W_h,
\end{aligned}
\end{equation}
$$

where $\alpha_k > 0$ is a sequence of step sizes and $g_h \in H^1(\Omega)$
provides an approximation of the boundary values $g_h|_{\partial \Omega}
\approx g$. Equation (3) is a coupled system of $(u,\psi)$ and is nonlinear in $\psi$. Therefore, we apply the Newton-Raphson method[^1] and solve the following linearized discrete saddle-point problem: find $u_h \in V_h$ and $\delta \psi_h \in W_h$ such that

$$
\begin{equation}
\begin{aligned}
(\alpha_{k+1} \nabla u_h,\nabla v) + (\delta \psi_h, v) &= (\alpha_{k+1} f + \psi_h^k - \psi_h, v) && \text{for all } v \in V_h, \\\\
(u_h,w) - c_\varepsilon(\psi_h,\delta \psi_h,w) &= (\varphi + \exp \psi_h,w) && \text{for all } w \in W_h,
\end{aligned}
\end{equation}
$$

where

$$
c_\varepsilon(\psi_h,\delta \psi_h,w) =
\begin{cases}
(\delta \psi_h \exp \psi_h, w) + \varepsilon (\delta \psi_h, w) & \text{if } W_h \in \mathrm{ker}(\nabla_h), \\\\
(\delta \psi_h \exp \psi_h, w) + \varepsilon (\nabla_h \delta \psi_h, \nabla_h w) & \text{otherwise.}
\end{cases}
$$

We then assign $\psi_h \leftarrow \psi_h + \delta \psi_h$ and repeat solving (4) until a tolerance condition is satisfied. Lastly, we assign $u_h^k \leftarrow u_h$ and $\psi_h^k \leftarrow \psi_h$ and repeat until another tolerance condition is satisfied.

---

### <i class="fa fa-check-square-o"></i>&nbsp; Annotated Example 36

MFEM's Example 36 implements the above simple FEM for the obstacle problem in
the source file
[examples/ex36.cpp](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp).
We set $\varphi$ to be a half-sphere centered at the origin, $\Omega$ to be a
circular domain, and $f = 0$. In particular, we set

$$
\varphi(x,y) = \sqrt{1/4 - (x^2 + y^2)}
$$

if $\sqrt{x^2 + y^2} \leq 1/2 \cdot 9/10$ and assume that $\varphi$ is
sufficiently negative when $\sqrt{x^2 + y^2} > 1/2 \cdot 9/10$. Compare this
definition with the definition of the function `spherical_obstacle` in lines
[401-421](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L401-L421).

Below we highlight selected portions of the example code and connect them with
the description in the previous section. You can follow along by browsing
`ex36.cpp` in your VS Code browser window. In the settings of this tutorial,
the visualization will automatically update in the GLVis browser window.

#### The Mesh

The computational mesh for this problem is set to `disc-nurbs.mesh` in line
[109](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L109). We can
use GLVis to generate a visualization of this mesh by running `glvis -m
disc-nurbs.mesh`.

<img src="../img/obstacle1.png" width="300">

The code in lines
[108-111](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L110-L111)
loads the mesh from the given file, `mesh_file` and creates the corresponding
MFEM object `mesh` of class `Mesh`.

```c++
Mesh mesh(mesh_file, 1, 1);
int dim = mesh.Dimension();
```

The following code (lines
[113-118](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L113-L118))
refines the mesh uniformly three times. You can easily modify the refinement by
changing the definition of `ref_levels`.

```c++
for (int l = 0; l < ref_levels; l++)
{
  mesh.UniformRefinement();
}
```

Next, we control the geometric approximation by setting the curvature of our mesh
to have order at least two in lines
[122-123](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L122-L123).

```c++
int curvature_order = max(order,2);
mesh.SetCurvature(curvature_order);
```

Lastly, the code in
[125-128](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L125-L128)
rescales the domain to a unit circle.

```c++
GridFunction *nodes = mesh.GetNodes();
real_t scale = 2*sqrt(2);
*nodes /= scale;
```

#### Defining Variables and Spaces

In the next section we create the finite element space, i.e., specify the
finite element basis functions on the mesh. This involves the MFEM class and
`FiniteElementSpace`, which connects the space and the mesh.

Focusing on the common case `order > 0`, the code in lines
[131-140](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L131-L140)
is essentially:

```c++
H1_FECollection H1fec(order+1, dim);
FiniteElementSpace H1fes(&mesh, &H1fec);

L2_FECollection L2fec(order-1, dim);
FiniteElementSpace L2fes(&mesh, &L2fec);

cout << "Number of H1 finite element unknowns: "
     << H1fes.GetTrueVSize() << endl;
cout << "Number of L2 finite element unknowns: "
     << L2fes.GetTrueVSize() << endl;
```

The variable `H1fes` will hold our solutions $u_h$, and the variable `L2fes`[^2] will hold our solutions $\delta \psi_h$ in (4). In order to deal with the many bilinear and linear forms present in (4), we will use block matrices (which will be built using `offsets` defined below) and block vectors (`rhs`) to assign each bilinear and linear form a block. The offsets are calculated in lines [142-149](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L142-L149) and will be used in the main loop of the proximal Galerkin method. The block vector `x` will contain $u_h$ and $\delta \psi_h$.

```c++
Array<int> offsets(3);
offsets[0] = 0;
offsets[1] = H1fes.GetVSize();
offsets[2] = L2fes.GetVSize();
offsets.PartialSum();

BlockVector x(offsets), rhs(offsets);
x = 0.0; rhs = 0.0;
```

The finite element degrees of freedom that are on the domain boundary are then
extracted in lines
[151-157](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L151-L157).
We need those to impose the Dirichlet boundary conditions.

```c++
Array<int> ess_bdr;
if (mesh.bdr_attributes.Size())
{
   ess_bdr.SetSize(mesh.bdr_attributes.Max());
   ess_bdr = 1;
}
```

Next, in lines [159-169](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L159-L169), we make an initial guess for the solution, namely that $u(x) = 1 - \\|x\\|^2$.
Note that such a guess preserves the boundary condition, $u(x) = 0$ when
$\\|x\\| = 1$.

```c++
auto IC_func = [](const Vector &x)
{
  real_t r0 = 1.0;
  real_t rr = 0.0;
  for (int i=0; i<x.Size(); i++)
  {
     rr += x(i)*x(i);
  }
  return r0*r0 - rr;
};
```

The finite element approximation $u_h$ is described in MFEM as a `GridFunction`
belonging to the `FiniteElementSpace` `H1fes`. Similarly, $\delta \psi_h$ belongs to the `FiniteElementSpace` `L2fes`. See lines [173-179](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L173-L179).

```c++
GridFunction u_gf, delta_psi_gf;

u_gf.MakeRef(&H1fes,x,offsets[0]);
delta_psi_gf.MakeRef(&L2fes,x,offsets[1]);
```

We will also store the previous iteration's solution for step-by-step
comparisons.

```c++
GridFunction u_old_gf(&H1fes);
GridFunction psi_old_gf(&L2fes);
GridFunction psi_gf(&L2fes);
```

Next, we define the function coefficients for the solution and use them to
initialize the initial guess. We also define the exact solution of our problem
with the function `exact_solution_obstacle` defined in lines
[423-439](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L423-L439),
as well as its gradient `exact_solution_gradient_obstacle` in lines
[441-459](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L441-L459),
to compute error. We will need these for computing the error in our finite
element solution. As our solution is a scalar function, we set the type of
`exact_coef` to `FunctionCoefficient` and the type of its gradient
`exact_grad_coef`, a vector valued function, to `VectorFunctionCoefficient`. is
Recall that the function `spherical_obstacle` represents our obstacle function
$\varphi$ in (4).

```c++
FunctionCoefficient exact_coef(exact_solution_obstacle);
VectorFunctionCoefficient exact_grad_coef(dim,exact_solution_gradient_obstacle);
FunctionCoefficient IC_coef(IC_func);
ConstantCoefficient f(0.0);
FunctionCoefficient obstacle(spherical_obstacle);
u_gf.ProjectCoefficient(IC_coef);
u_old_gf = u_gf;
```

Lastly, we define our latent variable $\psi_h = \ln(u_h - \varphi)$ in lines [197-200](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L197-L200).

```c++
LogarithmGridFunctionCoefficient ln_u(u_gf, obstacle);
psi_gf.ProjectCoefficient(ln_u);
psi_old_gf = psi_gf;
```

#### Solving the System

The main loop for the proximal Galerkin method is found in lines
[211-343](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L211-L343),
and consists of an inner loop in lines
[223-323](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L223-L323)
which implements (4), Newton's method.

Each bilinear form in (4) corresponds to a block matrix. For example, the code
in lines
[249-256](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L249-L256)
represent $(\alpha_{k+1} \nabla u_h, \nabla v)$. Below, `alpha_cf` is of type
`ConstantCoefficient` and initialized to `alpha`, which is set by default to be
1.

```c++
BilinearForm a00(&H1fes);
a00.SetDiagonalPolicy(mfem::Operator::DIAG_ONE);
a00.AddDomainIntegrator(new DiffusionIntegrator(alpha_cf));
a00.Assemble();
a00.EliminateEssentialBC(ess_bdr,x.GetBlock(0),rhs.GetBlock(0),
                         mfem::Operator::DIAG_ONE);
a00.Finalize();
SparseMatrix &A00 = a00.SpMat();
```

Lines [267-268](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L267-L268) represent $-(\delta \psi_h \exp \psi_h,w)$ present in (4), but particularly in (5).

```c++
BilinearForm a11(&L2fes);
a11.AddDomainIntegrator(new MassIntegrator(neg_exp_psi));
```

We note in addition that the code in lines
[269-281](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L269-L281)
implements the other term in (5).

```c++
// NOTE: Shift the spectrum of the Hessian matrix for additional
//       stability (Quasi-Newton).
ConstantCoefficient eps_cf(-1e-6);
if (order == 1)
{
   // NOTE: ∇ₕuₕ = 0 for constant functions.
   //       Therefore, we use the mass matrix to shift the spectrum
   a11.AddDomainIntegrator(new MassIntegrator(eps_cf));
}
else
{
   a11.AddDomainIntegrator(new DiffusionIntegrator(eps_cf));
}
```

Similar constructions for the other bilinear forms are done, and we obtain block
matrices `A00`, `A01`, `A10`, and `A11`. Using MFEM's `BlockOperator` class, we
can combine these block matrices to form the matrix of bilinear forms, $A$.

```c++
BlockOperator A(offsets);
A.SetBlock(0,0,&A00);
A.SetBlock(1,0,&A10);
A.SetBlock(0,1,A01);
A.SetBlock(1,1,&A11);
```

The linear form $(\alpha_{k+1} f + \psi_h^k - \psi_h, v)$ present in (4) is constructed sequentially, and a similar construction is made for the other bilinear form; see lines [241-247](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L241-L247).

```c++
b0.AddDomainIntegrator(new DomainLFIntegrator(alpha_f));
b0.AddDomainIntegrator(new DomainLFIntegrator(psi_old_minus_psi));
b0.Assemble();
```

The linear system $AX = B$ is solved using [GMRES](https://en.wikipedia.org/wiki/Generalized_minimal_residual_method), using a block diagonal preconditioner `prec`. In line [297](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L297), the matrix $A$ corresponds to `A`, the vector $B$ corresponds to `rhs`, and the solution $X$ is stored in `x`.

```c++
GMRES(A,prec,rhs,x,0,10000,500,1e-12,0.0);
```

The solution `x` contains $u_h$ and $\delta \psi_h$, so we need to split it.

```c++
u_gf.MakeRef(&H1fes, x.GetBlock(0), 0);
delta_psi_gf.MakeRef(&L2fes, x.GetBlock(1), 0);
```

In lines
[310-315](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L310-L315),
we use GLVis to visualize our approximate solution.

```c++
if (visualization)
{
   sol_sock << "solution\n" << mesh << u_gf << "window_title 'Discrete solution'"
            << flush;
   mfem::out << "Newton_update_size = " << Newton_update_size << endl;
}
```

<img src="../img/obstacle2.png" width="300">

We compute and print the $H^1$ error between our discrete solution $u_h$ and the exact
solution $u$ to (4).

```c++
real_t H1_error = u_gf.ComputeH1Error(&exact_coef,&exact_grad_coef);
mfem::out << "H1-error  (|| u - uₕᵏ||)       = " << H1_error << endl;
```

Lastly, in lines
[350-362](https://github.com/mfem/mfem/blob/master/examples/ex36.cpp#L350-L362),
we visualize the error between our discrete solution and the exact solution.

```c++
if (visualization)
{
   socketstream err_sock(vishost, visport);
   err_sock.precision(8);

   GridFunction error_gf(&H1fes);
   error_gf.ProjectCoefficient(exact_coef);
   error_gf -= u_gf;

   err_sock << "solution\n" << mesh << error_gf << "window_title 'Error'"  <<
            flush;
}
```

<img src="../img/obstacle3.png" width="300">

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
<li> <a href="../solvers"><i class="fa fa-tasks"></i>&nbsp; Solvers and Scalability</a>
</ul>
</div>
</div>

---

Back to the [MFEM tutorial page](index.md)

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">

[^1]: For a more complete description of the algorithm, see Algorithm 4 in \[v5\] of the paper by Keith and Surowiec.
[^2]: In (3) and (4), the space $W_h$ is a subset of $L^\infty(\Omega)$, but in our code, we are requiring that $W_h \subset L^2(\Omega)$. This is not an issue, as we are using piecewise polynomials for our basis.
