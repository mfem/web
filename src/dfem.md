<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$']]}});
</script>
<script type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML">
</script>

# Differentiable Finite Elements (∂FEM)

∂FEM brings differentiability into MFEM's high-performance finite element
framework. Derivatives with respect to the solution or to any parameter field
are what sensitivity analysis, PDE-constrained optimization, inverse problems
and topology optimization all rest on.

When applied as a black box around a whole program, automatic differentiation
has to see through complicated program structures, non-trivial object types and
communication layers such as MPI, often making it an impractical choice.

∂FEM instead **constrains AD to the quadrature point level**. You write the
physics as a function evaluated at a single quadrature point, and MFEM
derives the rest: the operator action, its Jacobian, the transpose of that
Jacobian, assembled matrices, and, for scalar functionals, the Hessian.

<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
∂FEM lives in the <code>mfem::future</code> namespace: it is still under
development and the interface may change in upcoming releases.
</div>
</div>

If you would rather start from working code than from the theory, the
[miniapps](#miniapps-and-tests) at the bottom of this page are complete,
runnable examples, and [Building a ∂FEM operator](#building-a-fem-operator) is
the minimum needed to read them.

## The main idea

MFEM writes a finite element operator in the [finite element operator
decomposition](performance.md#finite-element-operator-decomposition)

$$ A_p(u) \;=\; P^{\sf T} G^{\sf T} B^{\sf T} \; D\big(B \, G \, P \, u\big), $$

where $P$ and $G$ take the solution from global true degrees of freedom down to
element degrees of freedom, $B$ evaluates it at the quadrature points, and $D$
applies the pointwise physics there.

The key observation is that $P$, $G$ and $B$ are **topological** and depend only
on the mesh and the finite element spaces, not on the solution, the coordinates,
or any design parameter. They can therefore be left out of the differentiation
loop entirely, and the Jacobian of the whole operator is the same decomposition
wrapped around the Jacobian of $D$ alone:

$$ J_p(u) \;=\; P^{\sf T} G^{\sf T} B^{\sf T} \; J_D(u_q) \; B \, G \, P. $$

So $D$ is the only part you write, and the only part that is differentiated.

The same holds for **parameters**. A parametric operator $A(u;\rho)$ takes its
design or coefficient fields through their own prolongation,
$\hat\rho = B_\rho G_\rho P_\rho \, \rho$, so in the API a parameter is just
another field, and differentiating with respect to a material or design field
is the very same call as differentiating with respect to the solution.

## Building a ∂FEM operator

The core of ∂FEM is the `DifferentiableOperator` class. Like a `BilinearForm`,
you construct it on a mesh, add integrators to it, and apply it, except that the
integrators are not chosen from a catalogue: you write the physics as
quadrature-point functions, which MFEM is then able to differentiate.

Everything on this page assumes:

```c++
#include "mfem.hpp"

using namespace mfem;
using namespace mfem::future;
```

Here we assume that the differentiated arguments are written as plain `real_t`,
which is the Enzyme case. Without Enzyme they have to carry a dual type
instead — see
[differentiation engine](#differentiation-engine-enzyme-and-dual-numbers).

Three components make up the interface:

**`FieldDescriptor`** describes the inputs and outputs. A field is an integer
identifier that you choose, paired with the space it lives in: a
`ParFiniteElementSpace`, a `VectorQuadratureSpace` for data given directly at
quadrature points, or a `ParameterSpace` for a few global scalars. The
identifier is just a name; it is how field operators and derivative requests
refer to that field everywhere else.

**`FieldOperator`** says how a field is evaluated at the quadrature points: its
value, its gradient, and so on. In an `Inputs<...>` tuple, field operators fix
what the q-function receives and in which order; in `Outputs<...>` they fix
which test function basis the result is contracted against. See
[field operators](#field-operators) below.

**The q-function** is the kernel applied at the quadrature point level, the $D$
of the decomposition, and the only part that gets differentiated. It is a struct
with a `const` call operator taking the inputs in the order `Inputs` declares
them, followed by the outputs as non-`const` references.

### Creating the operator

A `DifferentiableOperator` is built from a `ParMesh` and two vectors of
`FieldDescriptor` describing its input/output fields:

```c++
DifferentiableOperator(
   const std::vector<FieldDescriptor> &infds,   // input fields
   const std::vector<FieldDescriptor> &outfds,  // output fields
   const ParMesh &mesh);
```

### Adding an integrator

Integrators are then registered on that operator:

```c++
template <typename backend_t = GlobalQFBackend, ...>
void AddDomainIntegrator(
   qfunc_t &qfunc,                             // 1. q-function functor
   input_t inputs,                             // 2. Inputs<...>  field operators
   output_t outputs,                           //    Outputs<...> field operators
   const IntegrationRule &integration_rule,    // 3.
   const Array<int> &domain_attributes,        // 4.
   derivative_ids_t derivative_ids =           // 5.
      Derivatives<> {},
   second_derivative_ids_t second_derivative_ids =
      SecondDerivatives<Pairs::None> {});
```

so what has to be provided is:

1. a functor for the q-function,
2. two tuples of `FieldOperator`s, associated to the operator's
   `FieldDescriptor`s,
3. an `IntegrationRule`,
4. the domain (`AddDomainIntegrator`) or boundary (`AddBoundaryIntegrator`)
   attributes,
5. (optional) an integer sequence of requested derivatives, consistent with the
   field IDs, and of second derivatives, see
   [energies and second derivatives](#energies-and-second-derivatives),

together with a backend template argument, which selects [how many quadrature
points the q-function sees per call](#local-and-global-q-functions). Several
integrators may be added to one operator; their contributions accumulate.

The `Derivatives<...>{}` sequence determines which derivatives are generated, at
**compile time**: only the requested ones are instantiated, so nothing is paid
for a derivative that is never asked for. Omit the sequence
entirely for an operator you only ever apply — even then ∂FEM is useful, since
it lets you write custom physics without implementing a new
`BilinearFormIntegrator`.

The code below puts this together for a nonlinear diffusion residual
$\int_\Omega \kappa(u) \, \nabla u \cdot \nabla v \, dx$, with
$\kappa(u) = 1 + u^2$:

```c++
// Field identifiers — arbitrary integers, your names for the fields
constexpr int U = 1, Coords = 2, dim = 2;

// The q-function: the physics at a single quadrature point
struct NonlinearDiffusion
{
   MFEM_HOST_DEVICE inline
   void operator()(const real_t &u,                    // Value<U>
                   const tensor<real_t, dim> &dudxi,   // Gradient<U>
                   const tensor<real_t, dim, dim> &J,  // Gradient<Coords>
                   const real_t &w,                    // Weight
                   tensor<real_t, dim> &dvdxi) const   // the output
   {
      const auto invJ = inv(J);
      const auto dudx = dudxi * invJ;             // physical gradient
      const auto kappa = 1.0_r + u * u;
      dvdxi = kappa * dudx * transpose(invJ) * det(J) * w;
   }
};

// The pieces the operator is built on
auto *mesh_nodes_fes = pmesh.GetNodes()->ParFESpace();
const IntegrationRule &ir = IntRules.Get(pmesh.GetTypicalElementGeometry(),
                                         2 * order + 1);
Array<int> all_domain_attr(pmesh.attributes.Max());
all_domain_attr = 1;

// Which spaces the fields live in
std::vector<FieldDescriptor> inputs  = {{U, &fes}, {Coords, mesh_nodes_fes}};
std::vector<FieldDescriptor> outputs = {{U, &fes}};

DifferentiableOperator dop(inputs, outputs, pmesh);

// Register the integrator. The backend argument fixes how many quadrature
// points the q-function sees per call — see "Local and global q-functions".
NonlinearDiffusion qf;
dop.AddDomainIntegrator<LocalQFBackend>(
   qf,
   Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight> {},
   Outputs<Gradient<U>> {},
   ir, all_domain_attr,
   Derivatives<U> {});
```

The q-function above is written against a *single* quadrature point, which is
what `LocalQFBackend` asks for. That choice is discussed in
[local and global q-functions](#local-and-global-q-functions); until then, read
it as "one quadrature point per call".

### Field operators

Field operators are the $B$ of the decomposition: they say *how* each field is
evaluated at the quadrature points. The same types appear on both sides of the
integrator, with two different meanings:

- in `Inputs`, a field operator selects what the q-function receives, and its
  position fixes which argument it lands in;
- in `Outputs`, it selects the test function basis the result is contracted
  against. `Outputs<Value<U>>` gives $\int v \, (\cdot)$, so a mass-like form,
  while `Outputs<Gradient<U>>` gives $\int \nabla v \cdot (\cdot)$, a
  diffusion-like one.

| Field operator | At a quadrature point | Q-function argument |
| --- | --- | --- |
| `Value<ID>` | the interpolated value | scalar, tensor |
| `Gradient<ID>` | the gradient, in **reference** coordinates | tensor |
| `Identity<ID>` | the data as is, for quadrature and parameter spaces | scalar, tensor |
| `Weight` | the integration rule weight (no field identifier) | scalar |
| `FunctionalValue<ID>` | **output only**: sum into a scalar functional | scalar |

In every case the argument type follows the vector dimension of the space the
field was declared on, and a mismatch is a compile error.

Gradients arrive in *reference* coordinates, so the pullback needs to happen in
the q-function. That is why the mesh coordinates are requested as an input
field: the gradient of the coordinates is the Jacobian $J$, from which you get
the physical gradient $\nabla_x u = \nabla_\xi u \, J^{-1}$ and the measure
$\det(J)\,w$.

## Using the operator

Fields are passed as either `BlockVector` or, more conveniently, `MultiVector`,
one block per field, in the same order as the `FieldDescriptor` vectors:

```c++
MultiVector X{u_tdofs, mesh_nodes_tdofs};
MultiVector Y{y_tdofs};
dop.Mult(X, Y);
```

The Jacobian of a `DifferentiableOperator dop` is requested by field identifier,
which returns a `DerivativeOperator` pointer with available matrix-free action:

```c++
auto dop_du = dop.GetDerivative(U, X);   // linearized at the state X

MultiVector DU{du}, DR{dr};
dop_du->Mult(DU, DR);                    // dr = J du
dop_du->MultTranspose(DR, DU);           // du = J^T dr
```

This is the linearization of a nonlinear operator *about a state*, so this
call is **stateful**: `X` is captured and reused for every subsequent apply. Ask
for the derivative again whenever the state changes, which is what happens when
`GetDerivative` is called from an `Operator::GetGradient()` override, once per
Newton step.

Nothing is assembled unless you ask, which for high order saves a great deal of
memory and time. When a matrix is needed anyway, typically for a preconditioner,
the derivative operator assembles itself through `Assemble(SparseMatrix *&A)`,
`Assemble(HypreParMatrix *&A)` or `AssembleDiagonal(Vector &diag)`.

## Local and global q-functions

`DifferentiableOperator` always handles the outer half of the decomposition
itself: the transformation from T- or L-vectors down to E-vectors, and back
again. These are the stages of the
[operator decomposition](performance.md#finite-element-operator-decomposition):
a T-vector holds the global true degrees of freedom, an L-vector the local ones
of an MPI rank after $P$, and an E-vector the element degrees of freedom after
$G$, with $B$ taking those to the quadrature point values (Q). That part is
identical whichever backend you pick, and you only choose which end you hand it.
By default `Mult` takes and returns true degrees of freedom; when composing
operators, `SetMultLevel(DifferentiableOperator::LVECTOR)` skips the parallel
prolongation and works on L-vectors instead.

What the backend does control is the inner half, E $\to$ Q $\to$ E, that is,
the type of q-function the operator accepts, and how many quadrature points it
sees per call.

**`LocalQFBackend`** passes the data of a *single* quadrature point, and MFEM
owns the loops:

```c++
struct NonlinearDiffusionLocal
{
   MFEM_HOST_DEVICE inline
   void operator()(const real_t &u,
                   const tensor<real_t, dim> &dudxi,
                   const tensor<real_t, dim, dim> &J,
                   const real_t &w,
                   tensor<real_t, dim> &dvdxi) const
   {
      const auto invJ = inv(J);
      dvdxi = (1.0_r + u * u) * (dudxi * invJ)
              * transpose(invJ) * det(J) * w;
   }
};
```

**`GlobalQFBackend`** passes `tensor_array` views spanning *all* quadrature
points, and you write the loop:

<!-- TODO: drop the explicit UseEnzyme argument once the Enzyme code fix lands. -->

```c++
struct NonlinearDiffusionGlobal
{
   MFEM_HOST_DEVICE inline
   void operator()(tensor_array<const real_t> &u,
                   tensor_array<const real_t, dim> &dudxi,
                   tensor_array<const real_t, dim, dim> &J,
                   tensor_array<const real_t> &w,
                   tensor_array<real_t, dim> &dvdxi) const
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

Only the backend argument differs at registration:

```c++
using IT = Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight>;
using OT = Outputs<Gradient<U>>;
using DT = Derivatives<U>;

dop.AddDomainIntegrator<LocalQFBackend>(qf_local, IT{}, OT{}, ir, attr, DT{});
dop.AddDomainIntegrator<GlobalQFBackend>(qf_global, IT{}, OT{}, ir, attr, DT{});
```

The rest, including how the operator is used, remains unchanged.

`LocalQFBackend` is the right choice for essentially all physics: because MFEM
owns the loops, it can generate fused, tensor-product, GPU-friendly kernels, and
it is the only backend that supports energy functionals and second derivatives.
Note that it is not the default — `AddDomainIntegrator` and
`AddBoundaryIntegrator` fall back to `GlobalQFBackend` when the template
argument is omitted, so it is worth naming the backend explicitly.

`GlobalQFBackend` is worth reaching for when the pointwise picture does not fit:
when the computation has to be split into several passes over the quadrature
points (see [ScratchBank](#reusing-temporaries-scratchbank) below), when an
external library or hand-tuned kernel has to run on the whole quadrature data,
or when you want direct control over the loop.

## Differentiation engine: Enzyme and dual numbers

Two AD tools are available to differentiate the q-function, selected when MFEM
is configured. They differ only in the scalar type the differentiated arguments
of your q-function are written against, so one `#ifdef` covers both:

```c++
#ifdef MFEM_USE_ENZYME
using dscalar_t = real_t;                 // Enzyme differentiates plain code
#else
using dscalar_t = dual<real_t, real_t>;   // dual number fallback
#endif
```

The examples on this page are written with `real_t`, which is the Enzyme case.
With the dual fallback, the arguments that take part in differentiation have to
carry the dual type instead — which is why the miniapps and tests template their
physics on `dscalar_t` and select it with exactly this `#ifdef`.

[Enzyme](https://enzyme.mit.edu) is a compiler plugin that differentiates code
at the LLVM level, after optimization. It supports forward and reverse mode,
works on GPUs, and is the recommended choice: with Enzyme your q-function is
ordinary `real_t` code and the compiler synthesizes the derivative. Enable it
with `MFEM_USE_ENZYME=ON`.

Working at the compiler level rather than through type overloading also means
the q-function may call into code that other AD tools could not touch, an
external library, or a routine written in another language, such as an equation
of state.

Without Enzyme, ∂FEM falls back to `dual<real_t, real_t>`, a header-only
forward-mode implementation based on operator overloading. It needs no external
dependencies and debugs easily, which is convenient while developing a new
q-function, but being forward mode only it supports neither energy functionals
nor second derivatives.

## Energies and second derivatives

When the physics is naturally a functional $F$ rather than a residual, writing
the functional alone is enough: ∂FEM derives its gradient and its Hessian. Take
a parametrized Dirichlet energy over a solution $u$ and a coefficient field
$\rho$,

$$ F(u;\rho) \;=\; \int_\Omega \tfrac{1}{2}\, \rho \, |\nabla u|^2 \, dx. $$

The q-function returns a scalar per quadrature point, already multiplied by the
measure:

```c++
struct WeightedDirichletEnergy
{
   MFEM_HOST_DEVICE inline
   void operator()(const tensor<real_t, dim> &dudxi,   // Gradient<U>
                   const real_t &rho,                  // Value<Rho>
                   const tensor<real_t, dim, dim> &J,  // Gradient<Coords>
                   const real_t &w,                    // Weight
                   real_t &e) const                    // FunctionalValue<Energy>
   {
      const auto dudx = dudxi * inv(J);
      e = 0.5_r * rho * sqnorm(dudx) * det(J) * w;
   }
};
```

The output lives on a quadrature space and is marked `FunctionalValue`, which is
what registers the integrator as a functional. Second derivatives are then
requested alongside the first ones:

```c++
QuadratureSpace       qspace(pmesh, ir);
VectorQuadratureSpace qspace_vec(qspace, 1);

std::vector<FieldDescriptor> inputs =
   {{U, &fes}, {Rho, &rho_fes}, {Coords, mesh_nodes_fes}};
std::vector<FieldDescriptor> outputs = {{Energy, &qspace_vec}};

DifferentiableOperator F(inputs, outputs, pmesh);

WeightedDirichletEnergy qf;
F.AddDomainIntegrator<LocalQFBackend>(
   qf,
   Inputs<Gradient<U>, Value<Rho>, Gradient<Coords>, Weight> {},
   Outputs<FunctionalValue<Energy>> {},
   ir, all_domain_attr,
   Derivatives<U, Rho> {},
   SecondDerivatives<Pairs::All> {});
```

Both derivatives are then available:

```c++
// Gradient: the residual r(u) = dF/du
auto dFdu = F.GetDerivative(U);
MultiVector X{u, rho, mesh_nodes_tdofs}, R{residual};
dFdu->Mult(X, R);

// Hessian block d/du (grad_u F), linearized at X
// Expands to GetSecondDerivative(U, U, X) for same fieldID
F.GetSecondDerivative(U, X)->Mult(du, dr);

// Mixed block d/drho (grad_u F): the sensitivity of the residual to rho
F.GetSecondDerivative(U, Rho, X)->Mult(drho, dr);
```

Note that `GetDerivative(id)` behaves differently here than it does for a
residual operator. The gradient of a functional depends on the state alone, so
no state is captured: the full input state is supplied at apply time through
`Mult` instead. `GetSecondDerivative(id, X)` does capture the state, like any
other linearization.

With several fields differentiated, the Hessian has blocks
$\partial^2 F / \partial X \, \partial Y$, and you choose which to generate,
based on the selector provided to `SecondDerivatives<>`:

| Selector | Blocks |
| --- | --- |
| `Pairs::None` | none, the default |
| `Pairs::Diagonal` | only the diagonal blocks |
| `Pairs::All` | all blocks from the requested first derivatives |
| `DerivativePair<X, Y>` | only $\partial/\partial Y\,(\nabla_X F)$ |

Second derivatives are only available for functional integrators, and the
gradient identifier of every requested pair must also appear among the first
derivatives; both are checked at compile time. The direction identifier only has
to be an input field, which is what allows $\partial/\partial\rho\,(\nabla_u F)$
even when $\rho$ is not differentiated to first order. At runtime,
`HasSecondDerivative(gradient_id, direction_id)` says whether a block was
registered.

## Miniapps and tests

The miniapps in
[miniapps/dfem](https://github.com/mfem/mfem/tree/master/miniapps/dfem) are the
best place to continue and to start experimenting:

| Miniapp | Description |
| --- | --- |
| [dfem-minimal-surface][ms] | Minimal surface problem in 2D |
| [dfem-hyperelasticity_energy][he] | Finite strain solid mechanics from an energy formulation |

[ms]: https://github.com/mfem/mfem/blob/master/miniapps/dfem/dfem-minimal-surface.cpp
[he]: https://github.com/mfem/mfem/blob/master/miniapps/dfem/dfem-hyperelasticity_energy.cpp

## Advanced topics

### Reusing temporaries: ScratchBank

Sometimes a global q-function is easier to write as several passes over the
quadrature points, and then intermediate results need somewhere to live. This is
slightly subtle: a temporary also needs a matching *shadow* buffer, so that the
derivative information computed in one pass survives into the next. Without it
the derivative comes out silently wrong.

`ScratchBank` handles this. Derive your q-function from `QFWithScratchType` and
the shadow buffers are allocated and kept in step for you:

<!-- TODO: drop the explicit UseEnzyme argument once the Enzyme code fix lands. -->

```c++
struct CubicQFWithScratch : QFWithScratchType
{
   MFEM_HOST_DEVICE inline
   void operator()(tensor_array<const real_t> &x,
                   tensor_array<const real_t> &coef,
                   tensor_array<const real_t, 2, 2> &J,
                   tensor_array<const real_t> &w,
                   tensor_array<real_t> &y) const
   {
      const int NQ = nq;
      auto s = make_tensor_array<>(scratch[0], NQ);

      mfem::forall<UseEnzyme>(x.size(), [=] MFEM_HOST_DEVICE (int q)
      {
         s(q) = x(q);
      });
      mfem::forall<UseEnzyme>(x.size(), [=] MFEM_HOST_DEVICE (int q)
      {
         s(q) = s(q) * x(q);
      });
      mfem::forall<UseEnzyme>(x.size(), [=] MFEM_HOST_DEVICE (int q)
      {
         y(q) = coef(q) * s(q) * x(q) * det(J(q)) * w(q);
      });
   }
};

CubicQFWithScratch qf;
qf.SetScratch(pmesh.GetNE() * ir.GetNPoints(), {1});
```

`SetScratch` takes the total number of quadrature points and a list with one
entry per scratch buffer, giving its components per quadrature point. So
`{1, 2}` asks for a scalar buffer and a two-component one, retrieved as
`make_tensor_array<>(scratch[0], NQ)` and `make_tensor_array<2>(scratch[1], NQ)`.

There is also a *global* scratch for data whose size does not depend on the
number of quadrature points: flags, scalars, small `Vector` workspaces. Derive
from `QFWithScratch<bool, real_t, Vector>`, aliased `QFWithGlobalScratchType`,
and reach the entries with `GetGlobalScratch<I>()`.

### A few more knobs

Rarely needed at first, but useful to know about.

- **Kernel specialization.** With `LocalQFBackend`, MFEM dispatches to kernels
  specialized on the dimension and number of 1D quadrature points. A runtime
  fallback always exists, but for a known configuration the fast path can be
  instantiated at compile time with
  `AddLocalSpecializations<dim, Q1D, QFunction, Inputs, Outputs, Derivatives>()`.
  Purely a performance knob.

- **Cached setup.** Some overloads of `GetDerivative` and `GetSecondDerivative`
  take a `use_cached_setup` flag, which splits evaluation into a setup pass that
  precomputes quadrature point data and cheap apply passes. This trades memory
  for speed and pays off when the same linearization is applied many times, as
  in a Krylov solve.

- **Multiple outputs.** `Outputs<Value<V>, Gradient<V>, Identity<S>>` is
  legitimate, and the q-function then takes three trailing reference arguments.

- **Generic assembly.** `DisableTensorProductStructure()` falls back to the
  generic path, the escape hatch when a specialized kernel does not cover your
  case.

## Build

See [INSTALL](https://github.com/mfem/mfem/blob/master/INSTALL) for detailed
build instructions; ∂FEM needs `MFEM_USE_MPI` on, plus the following for Enzyme:

```sh
# CMake
cmake .. -DMFEM_USE_MPI=ON -DMFEM_USE_ENZYME=ON -DENZYME_DIR=/path/to/enzyme

# GNU make
make config MFEM_USE_MPI=YES MFEM_USE_ENZYME=YES ENZYME_DIR=/path/to/enzyme
```

Since Enzyme is a Clang plugin, such a build has to use a matching `clang++`
(and `CUDA_CXX=clang++` for CUDA builds); MFEM looks for `ClangEnzyme-*.so` in
`$(ENZYME_DIR)/lib`. For GPU runs, pass `-d cuda` or `-d hip` and annotate
q-functions with `MFEM_HOST_DEVICE`; Enzyme differentiates device code, so the
AD Jacobian runs on the GPU too.

## Further information/refs
