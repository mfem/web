tag-howto:

<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$']]}});
</script>
<script type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML">
</script>

<!-- Same heading and panel styles as the ∂FEM page. -->
<link rel="stylesheet" href="../../css/dfem-page.css">

# HowTo: Get started with ∂FEM

Short recipes for common tasks with [∂FEM](../dfem.md), MFEM's differentiable
finite element operators. The concepts behind each recipe are explained on the
∂FEM page; this page shows the code. Like that page, it documents the
[`dfem-dev`](https://github.com/mfem/mfem/tree/dfem-dev) branch.

Most snippets are condensed from the ∂FEM
[unit tests](https://github.com/mfem/mfem/tree/dfem-dev/tests/unit/dfem) and
[miniapps](https://github.com/mfem/mfem/tree/dfem-dev/miniapps/dfem), where the
complete code can be found.

- [Setup](#setup)
- [Create and apply an operator](#create-and-apply-an-operator)
- [Choose the backend](#choose-the-backend)
- [Use the Jacobian](#use-the-jacobian)
- [Solve a nonlinear problem with Newton](#solve-a-nonlinear-problem-with-newton)
- [Request only the kernels you need](#request-only-the-kernels-you-need)
- [Add a boundary integrator](#add-a-boundary-integrator)
- [Compute outward normals and boundary fluxes](#compute-outward-normals-and-boundary-fluxes)
- [Use multiple outputs](#use-multiple-outputs)
- [Pass coefficients and parameters](#pass-coefficients-and-parameters)
- [Compute an energy, its gradient and its Hessian](#compute-an-energy-its-gradient-and-its-hessian)
- [Register kernel specializations](#register-kernel-specializations)

## Setup

∂FEM is not included by `mfem.hpp`; include its header explicitly (the miniapps
use `"../../fem/dfem/doperator.hpp"`). The q-function arguments that take part
in differentiation use a scalar type that depends on the AD tool, see
[AD tools](../dfem.md#ad-tools-enzyme-and-dual-numbers):

```c++
#include "mfem.hpp"
#include "fem/dfem/doperator.hpp"   // relative to the MFEM source directory

using namespace mfem;
using namespace mfem::future;

using dscalar_t = std::conditional_t<mfem::UseEnzyme, real_t,
                                     dual<real_t, real_t>>;
```

<div class="panel panel-danger">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-exclamation-circle"></i>&nbsp; Upcoming rename</h3>
</div>
<div class="panel-body">
The <code>Mult</code> and <code>MultTranspose</code> calls below that take
<code>MultiVector</code> arguments will be renamed <code>MultMV</code> and
<code>MultTransposeMV</code>, the names upstream MFEM's <code>Operator</code>
uses for <code>MultiVector</code> arguments. The calls on plain
<code>Vector</code>s keep their names.
</div>
</div>

The examples below share the **same assumptions**: parallel mesh with nodes, an H1 space,
an integration rule and an attribute marker.

```c++
constexpr int DIM = 2;
constexpr int U = 0, Coords = 1;     // field IDs: any distinct integers

Mesh smesh = Mesh::MakeCartesian2D(8, 8, Element::QUADRILATERAL);
ParMesh pmesh(MPI_COMM_WORLD, smesh);
smesh.Clear();
pmesh.EnsureNodes();

auto *nodes = static_cast<ParGridFunction *>(pmesh.GetNodes());
ParFiniteElementSpace &nodes_fes = *nodes->ParFESpace();
Vector coords;
nodes->GetTrueDofs(coords);          // the mesh coordinates, a field like u

const int order = 2;
H1_FECollection fec(order, DIM);
ParFiniteElementSpace fes(&pmesh, &fec);
const int n = fes.GetTrueVSize();

const IntegrationRule &ir =
   IntRules.Get(pmesh.GetTypicalElementGeometry(), 2 * order + 1);
Array<int> all_attr(pmesh.attributes.Max());
all_attr = 1;
```

## Create and apply an operator

A nonlinear diffusion residual
$r(u; v) = \int_\Omega (1 + u^2) \nabla u \cdot \nabla v \, dx$. The q-function
receives the gradients in reference coordinates and does the pullback itself:

```c++
struct NonlinearDiffusion
{
   MFEM_HOST_DEVICE inline
   void operator()(const dscalar_t &u,                    // Value<U>
                   const tensor<dscalar_t, DIM> &dudxi,   // Gradient<U>
                   const tensor<real_t, DIM, DIM> &J,     // Gradient<Coords>
                   const real_t &w,                       // Weight
                   tensor<dscalar_t, DIM> &dvdxi) const   // Gradient<U>
   {
      const auto invJ = inv(J);
      dvdxi = (1.0_r + u * u) * (dudxi * invJ) * transpose(invJ) * det(J) * w;
   }
};

std::vector<FieldDescriptor> in_fds  = {{U, &fes}, {Coords, &nodes_fes}};
std::vector<FieldDescriptor> out_fds = {{U, &fes}};
DifferentiableOperator dop(in_fds, out_fds, pmesh);

NonlinearDiffusion qf;
dop.AddDomainIntegrator<LocalQFBackend>(
   qf,
   Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight> {},
   Outputs<Gradient<U>> {},
   ir, all_attr, Derivatives<U> {});

Vector u(n), r(n);
u.Randomize(1);
MultiVector X{u, coords}, R{r};      // one block per field, in the order of the descriptors
dop.Mult(X, R);                      // r = residual at u, on the T-dofs
```

## Choose the backend

The backend decides how the q-function is called. With `LocalQFBackend`, MFEM
calls it at one quadrature point at a time, inside one fused kernel per batch
of elements. With `GlobalQFBackend`, the inputs at every quadrature point are
first stored in memory, and the q-function is then run on all of them.

A q-function written for one point, like `NonlinearDiffusion` above, runs on
both backends; only the template argument changes:

```c++
dop.AddDomainIntegrator<GlobalQFBackend>(
   qf,
   Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight> {},
   Outputs<Gradient<U>> {},
   ir, all_attr, Derivatives<U> {});
```

The global backend also accepts a q-function that sees all the points at once.
Its arguments are `tensor_array`s (from `linalg/tensor_arrays.hpp`) indexed by
the point, and it writes the loop itself, with `mfem::forall<UseEnzyme>` so that
Enzyme can differentiate through it. The same physics as `NonlinearDiffusion`:

```c++
struct NonlinearDiffusionGlobal
{
   void operator()(tensor_array<const dscalar_t> &u,
                   tensor_array<const dscalar_t, DIM> &dudxi,
                   tensor_array<const real_t, DIM, DIM> &J,
                   tensor_array<const real_t> &w,
                   tensor_array<dscalar_t, DIM> &dvdxi) const
   {
      mfem::forall<UseEnzyme>(u.size(), [=] MFEM_HOST_DEVICE (int q)
      {
         const auto invJ = inv(J(q));
         dvdxi(q) = (1.0_r + u(q) * u(q)) * (dudxi(q) * invJ)
                    * transpose(invJ) * det(J(q)) * w(q);
      });
   }
};
```

| | `LocalQFBackend` | `GlobalQFBackend` |
| --- | --- | --- |
| The q-function sees | one quadrature point | one point, or all of them with `tensor_array` arguments |
| Kernels | one fused kernel | one per input, one for the q-function, one per output |
| Quadrature point data | kept in registers and shared memory | stored in memory between the kernels |
| Functionals and second derivatives | yes | no |
| `ParameterSpace` fields | no | yes |
| Use it for | most physics | several passes over the points, external libraries working on whole arrays, `ParameterSpace` fields |

The [backends section](../dfem.md#local-and-global-backends) of the ∂FEM page
shows the mechanism behind two execution models side by side.

## Use the Jacobian

`GetDerivative` linearizes the operator about a state and returns a
`DerivativeOperator`. Each use needs its
[kernel](../dfem.md#matrix-free-partial-and-full-assembly):

```c++
Vector du(n), dr(n), w(n), dw(n);
du.Randomize(2);
w.Randomize(3);
MultiVector DR{dr}, W{w}, DW{dw};

auto J = dop.GetDerivative(U, X);           // linearized at X
J->Mult(du, DR);                            // matrix-free J du      (Action)

auto J_pa = dop.GetDerivative(U, X, true);  // partially assembled
J_pa->Mult(du, DR);                         // same result            (Apply)

J->MultTranspose(W, DW);                    // dw = J^T w             (ApplyTranspose)

HypreParMatrix *A = nullptr;                // assembled              (AssembleMatrix)
J->Assemble(A);
Vector diag;                                // diagonal               (AssembleDiagonal)
J->AssembleDiagonal(diag);
delete A;
```

The direction of `Mult` is a plain `Vector` on the T-dofs of the differentiated
field; the result is a `MultiVector`. The derivative captures the state, so ask
for it again when `u` changes.

## Solve a nonlinear problem with Newton

`NewtonSolver` needs an `Operator` for the residual whose `GetGradient` returns
the Jacobian. Two small wrappers adapt the ∂FEM operators and apply the
essential boundary conditions, as in the
[minimal surface miniapp](https://github.com/mfem/mfem/blob/dfem-dev/miniapps/dfem/dfem-minimal-surface.cpp):

```c++
// The Jacobian with essential dofs eliminated: identity on those rows.
class Jacobian : public Operator
{
public:
   Jacobian(std::shared_ptr<DerivativeOperator> dR, const Array<int> &ess)
      : Operator(dR->Height(), dR->Width()), dR(dR), ess(ess), z(Width()) { }

   void Mult(const Vector &x, Vector &y) const override
   {
      z = x;
      z.SetSubVector(ess, 0.0);
      MultiVector Y{y};
      dR->Mult(z, Y);
      const auto d_x = x.Read();
      const auto d_ess = ess.Read();
      auto d_y = y.ReadWrite();
      mfem::forall(ess.Size(), [=] MFEM_HOST_DEVICE (int i)
      {
         d_y[d_ess[i]] = d_x[d_ess[i]];
      });
   }

private:
   std::shared_ptr<DerivativeOperator> dR;
   const Array<int> &ess;
   mutable Vector z;
};

// The residual, with zero on the essential dofs.
class Residual : public Operator
{
public:
   Residual(DifferentiableOperator &dop, const Vector &coords,
            const Array<int> &ess, int n)
      : Operator(n), dop(dop), coords(coords), ess(ess) { }

   void Mult(const Vector &u, Vector &r) const override
   {
      MultiVector X{u, coords}, R{r};
      dop.Mult(X, R);
      r.SetSubVector(ess, 0.0);
   }

   Operator &GetGradient(const Vector &u) const override
   {
      MultiVector X{u, coords};
      jacobian = std::make_unique<Jacobian>(dop.GetDerivative(U, X), ess);
      return *jacobian;
   }

private:
   DifferentiableOperator &dop;
   const Vector &coords;
   const Array<int> &ess;
   mutable std::unique_ptr<Jacobian> jacobian;
};
```

With these, the solve is standard MFEM:

```c++
Array<int> ess_bdr(pmesh.bdr_attributes.Max()), ess_tdofs;
ess_bdr = 1;
fes.GetEssentialTrueDofs(ess_bdr, ess_tdofs);
Residual residual(dop, coords, ess_tdofs, n);

GMRESSolver krylov(MPI_COMM_WORLD);
krylov.SetRelTol(1e-8);
NewtonSolver newton(MPI_COMM_WORLD);
newton.SetOperator(residual);
newton.SetSolver(krylov);
newton.SetRelTol(1e-6);

Vector zero;                // u holds the initial guess and the boundary values
newton.Mult(zero, u);
```

For a preconditioner, assemble the derivative into a `HypreParMatrix` (see
above), eliminate the essential dofs from it, and hand it to, e.g.,
`HypreBoomerAMG`.

## Request only the kernels you need

By default every integrator compiles the kernels for every use of its
derivatives. Name the ones you use to cut compile time and binary size:

```c++
// Matrix-free Newton-Krylov: only J du
constexpr auto mf = DerivativeKernels::Action;

// Partial assembly and its transpose, plus a matrix for the preconditioner
constexpr auto pa_amg = DerivativeKernels::PA | DerivativeKernels::AssembleMatrix;

dop.AddDomainIntegrator<LocalQFBackend, mf>(
   qf, Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight> {},
   Outputs<Gradient<U>> {}, ir, all_attr, Derivatives<U> {});
```

Request only the `Derivatives<...>` you take, too: each one multiplies the
number of kernels. If a call needs a kernel that was not requested, it aborts
with a message naming the kernel and the integrator.

## Add a boundary integrator

Boundary integrators are handled similarly to the domain counterpart and require no particular modification (apart from normals, see [Compute outward normals and boundary fluxes](#compute-outward-normals-and-boundary-fluxes)); define the q-function for the boundary term and add it with `AddBoundaryIntegrator`.


Here we show the case of a boundary mass term $\int_{\Gamma} u\, v \, ds$ on the boundary attribute 1.
On a face, `Gradient<Coords>` is the $d \times (d-1)$ Jacobian of the face, and
`weight(J)` its measure:

```c++
constexpr int BDIM = DIM - 1;
const IntegrationRule &bdr_ir =
   IntRules.Get(pmesh.GetTypicalFaceGeometry(), 2 * order);
Array<int> bdr_attr(pmesh.bdr_attributes.Max());
bdr_attr = 0;
bdr_attr[0] = 1;                     // boundary attribute 1 only

auto bdr_mass = [] MFEM_HOST_DEVICE (const dscalar_t &u,
                                     const tensor<real_t, DIM, BDIM> &J,
                                     const real_t &w,
                                     dscalar_t &v)
{
   v = u * weight(J) * w;
};

dop.AddBoundaryIntegrator<LocalQFBackend>(
   bdr_mass,
   Inputs<Value<U>, Gradient<Coords>, Weight> {},
   Outputs<Value<U>> {},
   bdr_ir, bdr_attr, Derivatives<U> {});
```

Domain and boundary integrators of the same operator add up, and their
derivatives too.

## Compute outward normals and boundary fluxes

∂FEM intentionally does not precompute normals. Precomputed normals would work for derivatives
with respect to the fields, but not for derivatives with respect to the mesh coordinates. Instead, the q-function computes the normal from the face Jacobian
(`Gradient<Coords>`), so it stays differentiable with respect to the mesh coordinates.

That normal points outward on some faces and inward on others, depending on how each face is parametrized. The `Orientation` input gives the sign of each face, and `normal(J, s)` the unit outward normal (`normal(J)` alone does not compile). The outward flux of a vector field $F(x)$ against each test function, $\int_{\partial\Omega} (F \cdot n)\, v \, ds$:

```c++
MFEM_HOST_DEVICE inline tensor<real_t, DIM> Flux(const tensor<real_t, DIM> &x)
{
   return {x[0] * x[1] + 1.0_r, 2.0_r * x[1] - x[0] * x[0]};
}

auto flux = [] MFEM_HOST_DEVICE (const tensor<real_t, DIM> &x,          // Value<Coords>
                                 const tensor<real_t, DIM, DIM - 1> &J, // Gradient<Coords>
                                 const real_t &w,                       // Weight
                                 const real_t &s,                       // Orientation
                                 real_t &v)                             // Value<U>
{
   v = dot(Flux(x), normal(J, s)) * weight(J) * w;
};

std::vector<FieldDescriptor> flux_in  = {{Coords, &nodes_fes}};
std::vector<FieldDescriptor> flux_out = {{U, &fes}};
DifferentiableOperator flux_op(flux_in, flux_out, pmesh);

Array<int> all_bdr_attr(pmesh.bdr_attributes.Max());
all_bdr_attr = 1;
flux_op.AddBoundaryIntegrator<LocalQFBackend>(
   flux,
   Inputs<Value<Coords>, Gradient<Coords>, Weight, Orientation> {},
   Outputs<Value<U>> {},
   bdr_ir, all_bdr_attr);

Vector b(n);
MultiVector XC{coords}, B{b};
flux_op.Mult(XC, B);
```

`ortho(J, s)` returns the same normal scaled by the face measure, so
`dot(Flux(x), ortho(J, s)) * w` is equivalent.

The signs are also available as data, to pass modified signs or to use them as
`Identity<>` input:

```c++
auto orientation = DifferentiableOperator::GetBoundaryOrientation(pmesh, bdr_ir);
// orientation.first : a VectorQuadratureSpace, for an input FieldDescriptor
// orientation.second: the signs at every point, for the input MultiVector
```

Both must outlive the operator, like any other input field.

## Use multiple outputs

A q-function can have several outputs, on the same field or on different ones.

**Several outputs on one field.** Outputs on the same field are summed, so a
mass and a diffusion term come out of one pass over the quadrature points, with
the geometry computed once. The residual of field `U`, tested against $v$, is

<div>
$$
r_U(u; v) = \int_\Omega \big( \underbrace{u^2\, v}_{\texttt{Value&lt;U&gt;}}
          + \underbrace{\kappa\, \nabla u \cdot \nabla v}_{\texttt{Gradient&lt;U&gt;}} \big)\, dx,
\qquad
\frac{\partial r_U}{\partial u} = M_{2u} + \kappa K,
$$
</div>

with $M_{2u}$ the mass matrix weighted by $2u$ and $K$ the stiffness matrix:

```c++
struct MassDiffusion
{
   real_t kappa;

   MFEM_HOST_DEVICE inline
   void operator()(const dscalar_t &u,
                   const tensor<dscalar_t, DIM> &dudxi,
                   const tensor<real_t, DIM, DIM> &J,
                   const real_t &w,
                   dscalar_t &mass,                         // Value<U>
                   tensor<dscalar_t, DIM> &diffusion) const // Gradient<U>
   {
      const auto invJ = inv(J);
      const real_t detJw = det(J) * w;
      mass = u * u * detJw;
      diffusion = (dudxi * invJ) * transpose(invJ) * (kappa * detJw);
   }
};

MassDiffusion md{2.0};
dop.AddDomainIntegrator<LocalQFBackend>(
   md,
   Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight> {},
   Outputs<Value<U>, Gradient<U>> {},
   ir, all_attr, Derivatives<U> {});
```

**Several output fields.** Outputs may also go to different fields, which is
how multi-field problems are written (for example Stokes-type systems, with a
velocity and a pressure block). The operator then has one output block per
field, and its derivative one row block per field. Here one q-function
produces a residual for each of the output fields `U` and `P`, tested against
$v$ and $q$:

<div>
$$
\begin{aligned}
r_U(u; v) &= \int_\Omega \big( u\, v + \nabla u \cdot \nabla v \big)\, dx, \\
r_P(u; q) &= \int_\Omega \kappa\, \nabla u \cdot \nabla q \; dx .
\end{aligned}
$$
</div>

Differentiating with respect to `U` gives one block per output field, in the
order of `out_fds`:

<div>
$$
\frac{\partial r}{\partial u} =
\begin{bmatrix} \partial r_P / \partial u \\ \partial r_U / \partial u \end{bmatrix} =
\begin{bmatrix} \kappa K \\ M + K \end{bmatrix},
$$
</div>

with $M$ the mass and $K$ the stiffness matrix.

```c++
struct ReactionDiffusionAndFlux
{
   real_t kappa;

   MFEM_HOST_DEVICE inline
   void operator()(const dscalar_t &u,
                   const tensor<dscalar_t, DIM> &dudxi,
                   const tensor<real_t, DIM, DIM> &J,
                   const real_t &w,
                   dscalar_t &v_u,                        // Value<U>
                   tensor<dscalar_t, DIM> &dv_u,          // Gradient<U>
                   tensor<dscalar_t, DIM> &dv_p) const    // Gradient<P>
   {
      const auto invJ = inv(J);
      const real_t detJw = det(J) * w;
      const auto grad = (dudxi * invJ) * transpose(invJ);
      v_u  = u * detJw;
      dv_u = grad * detJw;
      dv_p = grad * (kappa * detJw);
   }
};

constexpr int P = 2;
std::vector<FieldDescriptor> in_fds  = {{U, &fes}, {Coords, &nodes_fes}};
std::vector<FieldDescriptor> out_fds = {{P, &fes}, {U, &fes}};
DifferentiableOperator dop(in_fds, out_fds, pmesh);

ReactionDiffusionAndFlux rd_flux{0.5};
dop.AddDomainIntegrator<LocalQFBackend>(
   rd_flux,
   Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight> {},
   Outputs<Value<U>, Gradient<U>, Gradient<P>> {},
   ir, all_attr, Derivatives<U> {});

Vector yp(n), yu(n);
MultiVector Y{yp, yu};                // blocks in the order of out_fds
dop.Mult(X, Y);

auto dY = dop.GetDerivative(U, X);
std::vector<HypreParMatrix *> blocks; // blocks[0] = dY_P/dU, blocks[1] = dY_U/dU
dY->Assemble(blocks);

Vector diag_p;
dY->AssembleDiagonal(P, diag_p);      // diagonal of the dY_P/dU block
```

## Pass coefficients and parameters

**A coefficient field on a finite element space** is just another input. Read it
with `Value<>` and list it in `Derivatives<...>` to get the sensitivity of the
operator to it:

```c++
struct WeightedDiffusion
{
   MFEM_HOST_DEVICE inline
   void operator()(const tensor<dscalar_t, DIM> &dudxi,   // Gradient<U>
                   const dscalar_t &rho,                  // Value<Rho>
                   const tensor<real_t, DIM, DIM> &J,     // Gradient<Coords>
                   const real_t &w,                       // Weight
                   tensor<dscalar_t, DIM> &dvdxi) const   // Gradient<U>
   {
      const auto invJ = inv(J);
      dvdxi = rho * (dudxi * invJ) * transpose(invJ) * det(J) * w;
   }
};

constexpr int Rho = 3;
ParFiniteElementSpace rho_fes(&pmesh, &fec);
Vector rho(rho_fes.GetTrueVSize());
rho = 1.0;

std::vector<FieldDescriptor> p_in  = {{U, &fes}, {Rho, &rho_fes}, {Coords, &nodes_fes}};
std::vector<FieldDescriptor> p_out = {{U, &fes}};
DifferentiableOperator pop(p_in, p_out, pmesh);
WeightedDiffusion weighted_diffusion;
pop.AddDomainIntegrator<LocalQFBackend>(
   weighted_diffusion,
   Inputs<Gradient<U>, Value<Rho>, Gradient<Coords>, Weight> {},
   Outputs<Gradient<U>> {},
   ir, all_attr, Derivatives<U, Rho> {});

MultiVector XP{u, rho, coords};
auto dR_drho = pop.GetDerivative(Rho, XP); // dR/drho, a U x Rho operator
```

**Data stored at the quadrature points**, such as a material state or a
parameter that changes between time steps, lives on a `VectorQuadratureSpace`
and is read with `Identity<>`. Since the q-function is copied when it is
registered, this is also how to pass a value that changes at runtime:

```c++
constexpr int Kappa = 4;
QuadratureSpace qs(pmesh, ir);
VectorQuadratureSpace kappa_space(qs, 1);   // one value per point
QuadratureFunction kappa(kappa_space);
kappa = 1.0;                                // refill whenever it changes

// in_fds:   {Kappa, &kappa_space}
// Inputs:   ..., Identity<Kappa>
// argument: const real_t &kappa
MultiVector XK{u, coords, kappa};
```

**Parameters with a layout of their own** are described by deriving from
`ParameterSpace` and implementing `GetTrueVSize`, `GetVSize`, and the operators
`GetB` (to the quadrature points) and `GetBt` (back). Such fields are read with
`Value<>` and need `GlobalQFBackend`. The
[runtime materials miniapp](https://github.com/mfem/mfem/blob/dfem-dev/miniapps/dfem/dfem-runtime-materials.cpp)
is a complete example.

## Compute an energy, its gradient and its Hessian

The following shows how to work with functionals.

To do so, we write the integrand of $F(u) = \int_\Omega \psi(u, \nabla u)\, dx$ as a
q-function with a `FunctionalValue` output on a quadrature space, and request
the second derivatives:

```c++
constexpr int E = 5;
QuadratureSpace qs(pmesh, ir);
VectorQuadratureSpace e_space(qs, 1);

struct Energy
{
   MFEM_HOST_DEVICE inline
   void operator()(const dscalar_t &u,
                   const tensor<dscalar_t, DIM> &dudxi,
                   const tensor<real_t, DIM, DIM> &J,
                   const real_t &w,
                   dscalar_t &psi) const
   {
      const auto dudx = dudxi * inv(J);
      psi = (0.5_r * u * u + 0.25_r * u * u * u * u
             + 0.5_r * dot(dudx, dudx)) * det(J) * w;
   }
};

std::vector<FieldDescriptor> e_in  = {{U, &fes}, {Coords, &nodes_fes}};
std::vector<FieldDescriptor> e_out = {{E, &e_space}};
DifferentiableOperator F(e_in, e_out, pmesh);

Energy energy_qf;
F.AddDomainIntegrator<LocalQFBackend>(
   energy_qf,
   Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight> {},
   Outputs<FunctionalValue<E>> {},
   ir, all_attr, Derivatives<U> {}, SecondDerivatives<Pairs::All> {});
```

Then the value, the gradient and the Hessian:

```c++
// Value: sum the integrand over the points and the ranks
QuadratureFunction psi(e_space);
MultiVector XE{u, coords}, PSI{psi};
F.Mult(XE, PSI);
real_t local = psi.Sum(), energy;
MPI_Allreduce(&local, &energy, 1, MPITypeMap<real_t>::mpi_type, MPI_SUM,
              pmesh.GetComm());

// Gradient dF/du, as a T-vector
Vector g;
F.GetDerivative(U, XE)->Assemble(g);

// Hessian action H du
Vector hdu(n);
MultiVector HDU{hdu};
F.GetSecondDerivative(U, XE)->Mult(du, HDU);
```

The gradient is the residual of the energy, and the Hessian its Jacobian: the
[Newton wrappers](#solve-a-nonlinear-problem-with-newton) work with them by
replacing `dop.Mult` with the gradient and `GetDerivative` with
`GetSecondDerivative`, as in the
[hyperelasticity miniapp](https://github.com/mfem/mfem/blob/dfem-dev/miniapps/dfem/dfem-hyperelasticity_energy.cpp).

## Register kernel specializations

To see which kernels a run looked up and did not find, set
`MFEM_REPORT_KERNELS` and collect the lines it prints:

```sh
MFEM_REPORT_KERNELS=YES mpirun -np 1 ./my_app 2>&1 | grep "Fallback kernel"
```

Each line names a kernel table and the parameters it was asked for. What to do
with it depends on the backend.

**`LocalQFBackend`**: the tables are named `ActionLO`, `DerivativeApplyHO` and
so on, with parameters (dimension, tile size). Up to a tile size of 8 the
fallback already runs a kernel compiled for that exact size, so these lines can
be ignored. Above 8, register the exact size with `AddLocalSpecializations`,
repeating the template arguments of the integrator:

```c++
AddLocalSpecializations<DIM, 9, NonlinearDiffusion,
                        Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight>,
                        Outputs<Gradient<U>>,
                        Entity::Element, Derivatives<U>,
                        DerivativeKernels::All>();
```

**`GlobalQFBackend`**: the tables belong to MFEM's `QuadratureInterpolator`,
which evaluates the inputs at the quadrature points. Their fallback is a
slower, generic kernel, so a specialization pays off. Register the reported
parameters with the table's `Specialization<...>::Add()`, for example
`QuadratureInterpolator::GradKernels::Specialization<...>::Add()`.

Specializations are registered at runtime, before the first `Mult`, and only
change performance.
