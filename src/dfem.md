<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$']]}});
</script>
<script type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML">
</script>

<!-- Interactive map between the weak form and the code, and the interactive
     operator decomposition further down. Loaded here rather than site-wide,
     so no other page pays for them. -->
<link rel="stylesheet" href="../css/dfem-map.css">
<script type="text/javascript" src="../js/dfem-map.js"></script>
<link rel="stylesheet" href="../css/dfem-diagram.css">
<script type="text/javascript" src="../js/dfem-diagram.js"></script>

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
points the q-function sees per call](#local-and-global-q-functions). 

The `Derivatives<...>{}` sequence determines which derivatives are generated, at
**compile time**: only the requested ones are instantiated, so nothing is paid
for a derivative that is never asked for. Omit the sequence
entirely for an operator you only ever apply — even then ∂FEM is useful, since
it lets you write custom physics without implementing a new
`BilinearFormIntegrator`.


The code below puts this together for a nonlinear diffusion residual
$\int_\Omega \kappa(u) \, \nabla u \cdot \nabla v \, dx$, with
$\kappa(u) = 1 + u^2$. Point at any coloured term below — in the maths or in
the code — to light up its counterparts:

<div id="dm">
<div id="dm-legend"></div>
<div id="dm-caption"></div>
<div id="dm-body">
<div class="dm-col dm-col-math">

<p class="dm-h">The weak form</p>
<div class="dm-math">
$$ r(u;v) \;=\; \class{dm-domain}{\int_\Omega} \class{dm-kappa}{\kappa(u)} \,
   \class{dm-gradu}{\nabla u} \cdot \class{dm-test}{\nabla v} \;
   \class{dm-measure}{dx} \;=\; 0 $$
</div>
<p class="dm-sub">for all $v \in V_h$, with $\class{dm-kappa}{\kappa(u) = 1 + u^2}$.</p>

<p class="dm-h">Evaluated at the quadrature points</p>
<div class="dm-math">
$$ \class{dm-domain}{\sum_q} \class{dm-kappa}{\kappa(u_q)} \,
   \class{dm-gradu}{\nabla_{\!x} u_q} \cdot \class{dm-test}{\nabla_{\!x} v_q} \;
   \class{dm-measure}{\det(J_q)\, w_q} $$
</div>
<p class="dm-sub">This line is the q-function, term for term.</p>

<p class="dm-h">The operator decomposition</p>
<div class="dm-math">
$$ A_p(u) \;=\; \class{dm-test}{P^{\sf T} G^{\sf T} B^{\sf T}} \;
   \class{dm-qf}{D}\big( \class{dm-evalB}{B \, G \, P} \, u \big) $$
</div>
<p class="dm-sub">$P$, $G$ and $B$ are topological, so only $\class{dm-qf}{D}$ is
written, and only $\class{dm-qf}{D}$ is differentiated.</p>

</div>
</div>
</div>

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
| `Value<ID>` | the interpolated value | `scalar_t`, `tensor<scalar_t, V>` |
| `Gradient<ID>` | the gradient, in **reference** coordinates | `tensor<scalar_t, D>`, `tensor<scalar_t, V, D>` |
| `Hessian<ID>` | the hessian, in **reference** coordinates | `tensor<scalar_t, D, D>`, `tensor<scalar_t, V, D, D>` |
| `Identity<ID>` | the data as is, for quadrature and parameter spaces | `scalar_t`, `tensor<scalar_t, ...>` |
| `Weight` | the integration rule weight (no field identifier) | `real_t` |
| `FunctionalValue<ID>` | **output only**: sum into a scalar functional | `scalar_t` |

The last column is the type of the matching parameter in the q-function
signature; the field operator itself only carries an integer field identifier.
Where two forms are listed, the first is the one for a scalar field and the
second for a vector field. `D` is the mesh dimension, `V` the vector dimension
of the space the field was declared on, and `scalar_t` the scalar that argument
is written against: `real_t` under Enzyme, `dual<real_t, real_t>` with the dual
fallback. The type has to follow the space exactly, and a mismatch is a compile
error.

Gradients arrive in *reference* coordinates, so the pullback needs to happen in
the q-function. That is why the mesh coordinates are requested as an input
field: the gradient of the coordinates is the Jacobian $J$, from which you get
the physical gradient $\nabla_x u = \nabla_\xi u \, J^{-1}$ and the measure
$\det(J)\,w$.

### Handling multiple integrators

Several integrators may be added to one operator, and their contributions
**accumulate**. 
This can also be achieved with a single integrator, which is declared with **multiple outputs**. 
Those landing on the same output space are summed after each has been contracted with its own test function basis. 
This is how an operator that is a sum of terms is written in one pass over the quadrature
points, with the geometry evaluated only once.

As an example, for a Helmholtz-type operator
$\int_\Omega \nabla u \cdot \nabla v \, dx - k^2 \int_\Omega u \, v \, dx$, the
diffusion term leaves through `Gradient<U>` and the mass term through
`Value<U>`:

```c++
struct Helmholtz
{
   real_t k;

   MFEM_HOST_DEVICE inline
   void operator()(const real_t &u,                      // Value<U>
                   const tensor<real_t, dim> &dudxi,     // Gradient<U>
                   const tensor<real_t, dim, dim> &J,    // Gradient<Coords>
                   const real_t &w,                      // Weight
                   real_t &mass,                         // out: Value<U>
                   tensor<real_t, dim> &diffusion) const // out: Gradient<U>
   {
      const auto invJ = inv(J);
      const auto detJ = det(J);
      mass      = -k * k * u * detJ * w;
      diffusion = (dudxi * invJ) * transpose(invJ) * (detJ * w);
   }
};

Helmholtz qf{k};
dop.AddDomainIntegrator<LocalQFBackend>(
   qf,
   Inputs<Value<U>, Gradient<U>, Gradient<Coords>, Weight> {},
   Outputs<Value<U>, Gradient<U>> {},
   ir, all_domain_attr,
   Derivatives<U> {});
```

This effectively evaluates, in one sweep over the quadrature points,

$$ y \;=\; P^{\sf T} G^{\sf T} \Big( B_{\text{val}}^{\sf T} \, D_{\text{mass}}
   \;+\; B_{\text{grad}}^{\sf T} \, D_{\text{diff}} \Big)\big(B \, G \, P \, u\big), $$

where $B = [\,B_{\text{val}};\ B_{\text{grad}}\,]$ stacks the two interpolations
requested in `Inputs`, so that $B \, G \, P \, u$ carries both the value and the
reference gradient of $u$ at every quadrature point, and $B^{\sf T}$ splits into
one transposed interpolation per declared output — both of which name the field
`U`, so the two contributions are summed into the same output vector. This is
the matrix-free action $y = (A - k^2 M)\,u$, with neither the stiffness
matrix $A$ nor the mass matrix $M$ ever being formed, and will give access to the Jacobian of the combined operator.


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

<div class="dfd dfd-global" id="dfd">

  <div class="dfd-intro">The whole chain, end to end. Point at a
    <strong>panel</strong> or an <strong>arrow</strong> to read what it is, and
    click to pin it; the <strong>Local / Global</strong> switch redraws the
    kernel boundaries on the right-hand side, which is the half the backend
    owns.</div>

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
    Everything to the left is common to each operator, while to the right is <strong>backend-specific</strong>.</p>
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

### Reducing compile time and binary size: kernel selection

∂FEM is heavily templated, and Enzyme requires every instantiation to be known
at compile time. This costs compile time and binary size, especially for complex
models carrying templates of their own (e.g several constitutive behaviours in a
nonlinear mechanics problem).

The number of kernels one integrator emits is a product:

$$ N \;=\; N_{\rm dim} \,\times\, N_{q} \,\times\, \big(1 + N_{k} \, N_{\partial}\big), $$

where $N_{\rm dim}$ is the spatial dimensions covered, $N_{q}$ the quadrature
tile sizes, $N_{k}$ the callbacks requested and $N_{\partial}$ the derivatives
requested; the $1$ is the primal action, which is always emitted. $N_q$ is the
number of quadrature tile sizes the kernels are specialized on, and is fixed by
the backend rather than by the caller.

The remaining three factors can be controlled:

**$N_{\rm dim}$: deduced from the q-function.** The spatial dimension is taken
from the trailing extent of the first `Gradient` or `Hessian` argument, scanning
the inputs and then the outputs, so a q-function written against
`tensor<scalar_t, 2, 2>` emits the 2D branch alone.

**$N_{k}$: selected by a bit-mask.** Every `AddDomainIntegrator` registers
callbacks for the operations the operator may be asked to perform, and by
default all of them are requested, though few operators use all. The second
template argument narrows that set:

```c++
constexpr auto kernels = DerivativeKernels::Action | DerivativeKernels::Apply;
dop.AddDomainIntegrator<LocalQFBackend, kernels>(...);
```

The individual kernels are `Apply`, `ApplyTranspose`, `AssembleMatrix`,
`AssembleDiagonal` and `Action`, and predefined families group the combinations
that occur in practice:

| Family | Expands to | For |
| --- | --- | --- |
| `None` | nothing | an operator that is only ever applied |
| `MF` | `Action` | matrix-free derivative action |
| `PA` | `Apply | ApplyTranspose` | partially assembled action (cached setup+apply) |
| `AllAssembly` | `AssembleMatrix | AssembleDiagonal` | sparse and `HypreParMatrix` assembly, diagonals |
| `All` | `PA | AllAssembly | Action` | the default |

`Setup`, which fills the quadrature point cache, is never requested explicitly:
it is enabled automatically by `Apply`, `ApplyTranspose`, `AssembleMatrix` or
`AssembleDiagonal`, all of which read that cache. `Action` is the exception —
the matrix-free action recomputes at each application, so `MF` on its own emits
no `Setup` kernel.

**$N_{\partial}$: the requested derivatives.** The callbacks above are
instantiated once per entry in the `Derivatives<...>` sequence, so asking only
for the derivatives actually taken keeps that factor down. This is covered in
[adding an integrator](#adding-an-integrator).

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

### A few more special topics

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
