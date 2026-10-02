tag-fem:

# Error Estimators

Error estimators provide elementwise indicators that identify where a finite
element solution needs more resolution. They are commonly used with
`ThresholdRefiner` in an adaptive mesh refinement (AMR) loop. MFEM includes
specialized estimators, such as the Zienkiewicz--Zhu and Kelly estimators, as
well as `GeneralErrorEstimator`, a composable framework for residual-based
indicators.

`GeneralErrorEstimator` separates the traversal of the mesh from the
calculation of individual residual terms. Applications add the domain,
interior-face, and boundary terms appropriate to their PDE; the framework
combines those terms into one indicator per element.

## The error-estimator interface

All elementwise estimators derive from `ErrorEstimator`. The two operations
used by AMR are:

| Method | Purpose |
| --- | --- |
| `GetLocalErrors()` | Returns one non-negative indicator for each local mesh element. |
| `GetTotalError()` | Returns the global L2 norm of the local indicators. |
| `Reset()` | Invalidates cached indicators after solution data changes without a mesh change. |

An estimator also refreshes its cached values when it detects that the mesh
sequence has changed. Call `Reset()` after changing a solution, coefficient,
source, or other data used by an estimator. After an AMR operation, update the
finite element spaces and grid functions as usual; the estimator will
recompute its indicators for the new mesh.

The local indicator $\eta_K$ stored for an element $K$, in the vector returned
by `GetLocalErrors()`, has the form

$$
  \eta_K = \left(\sum_i \eta_{K,i}^2\right)^{1/2}.
$$

Here, $i$ indexes every contribution associated with $K$: each selected volume
term on $K$, each contribution assigned to $K$ from an incident interior face,
and each applicable boundary-element or boundary-face term. Each term supplies
the squared quantity $\eta_{K,i}^2$; `GeneralErrorEstimator` performs the sum
and square root.

The method `GetTotalError()` returns

$$
  \eta = \left(\sum_K \eta_K^2\right)^{1/2}.
$$

In a parallel run, the final sum is reduced across MPI ranks.

## Building a general estimator

`GeneralErrorEstimator` is associated with a `Mesh`; it does not own that
mesh. This allows one estimator to combine terms that use different finite
element spaces on the same mesh. It owns each term added to it, so terms should
be allocated with `new` and must not be deleted by the application.

The framework accepts the following term types:

| Term class | Where it is evaluated | Registration method |
| --- | --- | --- |
| `DomainErrorEstimator` | Every selected volume element | `AddDomainEstimator` |
| `DomainErrorEstimator` | Every selected boundary element | `AddBdrEstimator` |
| `FaceErrorEstimator` | Interior faces | `AddInteriorFaceEstimator` |
| `FaceErrorEstimator` | Selected boundary faces | `AddBdrFaceEstimator` |

Each `DomainErrorEstimator::GetElementError` and `FaceErrorEstimator::GetFaceError`
method must return a non-negative **squared** contribution. The general
estimator adds contributions to the adjacent element or elements and takes the
square root only after all terms have been accumulated. An interior-face term
returns separate squared contributions for its two adjacent elements.

The callbacks receive geometric transformations, rather than finite elements:
`DomainErrorEstimator::GetElementError(ElementTransformation &)` receives the
current volume or boundary-element transformation; an interior
`FaceErrorEstimator::GetFaceError(FaceElementTransformations &, real_t &,
real_t &)` returns one contribution for each adjacent element; and a boundary
`FaceErrorEstimator::GetFaceError(FaceElementTransformations &)` returns one
contribution. A term that needs a finite element or field value obtains it from
the `GridFunction` or other data it owns.

Attribute markers can restrict domain, boundary-element, and boundary-face
terms. Attribute markers are `Array<int>` objects with length equal to the
maximum domain or boundary attribute number. A domain marker has one entry for
each element attribute; a boundary marker has one entry for each boundary
attribute. An entry of `1` enables the term for that attribute and `0` omits
it. The marker is not owned by the general estimator and must outlive it.

### Boundary-element terms versus boundary-face terms

`AddBdrEstimator` intentionally accepts a `DomainErrorEstimator`. Despite the
class name, it is the right choice for a residual contribution evaluated as an
integral **on a boundary element**. For each selected boundary element, MFEM
passes its `ElementTransformation` to `DomainErrorEstimator::GetElementError`,
then adds the returned squared contribution to the adjacent volume element.
This is useful for a boundary source or residual that can be evaluated directly
from boundary-element data.

Use `AddBdrFaceEstimator` with a `FaceErrorEstimator` when the residual is
inherently a face term: for example, when it needs the
`FaceElementTransformations`, a normal or tangential trace, or values mapped
between the boundary face and its adjacent volume element. A boundary-face
estimator receives the face transformations, which provide the maps needed to
relate the face and adjacent volume element; a boundary-element estimator
receives only the boundary element transformation.

In short, choose the registration method based on the data required by the
formula, not only on where the formula is integrated:

| If the boundary residual needs... | Use... |
| --- | --- |
| Only the boundary element and its transformation | `AddBdrEstimator` with a `DomainErrorEstimator` |
| Face geometry, traces, normals, or the adjacent volume element | `AddBdrFaceEstimator` with a `FaceErrorEstimator` |

### Sharing preparation work

Many residual terms require common derived fields. A class derived from
`ErrorEstimatorData` can own and update that shared data. A term requests the
data during `Prepare(ErrorEstimatorContext &)`, and the context ensures that a
given data object is updated only once in an estimator sweep. This keeps a
multi-term residual indicator from reconstructing the same field repeatedly.

Face estimators that read `ParGridFunction` values on both sides of a shared
face should override `ExchangeFaceNbrData()`. `GeneralErrorEstimator` invokes
it before evaluating parallel shared faces.

The typical application structure is:

```cpp
GeneralErrorEstimator estimator(mesh);

// The estimator takes ownership of these term objects.
estimator.AddDomainEstimator(new MyVolumeResidual(...));
estimator.AddInteriorFaceEstimator(new MyFluxJumpResidual(...));
estimator.AddBdrFaceEstimator(new MyBoundaryResidual(...), bdr_marker);

ThresholdRefiner refiner(estimator);

// After solving or changing data used by the terms:
estimator.Reset();
const Vector &local_errors = estimator.GetLocalErrors();
real_t total_error = estimator.GetTotalError();
```

## Maxwell residual estimator terms

MFEM provides ready-made terms for the time-harmonic Maxwell equation

$$
  \operatorname{curl}(\mu^{-1}\operatorname{curl} E)
  - \omega^2\epsilon E = f.
$$

`MaxwellResidualEstimator` and `ComplexMaxwellResidualEstimator` are convenient
standalone implementations. The same residual can instead be assembled from
the following `GeneralErrorEstimator` terms:

| Class | Contribution |
| --- | --- |
| `MaxwellResidualCurlDomainEstimator` | Curl-residual volume term for real fields. |
| `MaxwellResidualDivergenceDomainEstimator` | Divergence-residual volume term for real fields. |
| `MaxwellResidualTangentialFaceEstimator` | Tangential reconstructed curl-flux jump term for real fields. |
| `MaxwellResidualNormalFaceEstimator` | Normal electric-displacement jump term for real fields. |
| `ComplexMaxwellResidualCurlDomainEstimator` / `ComplexMaxwellResidualDivergenceDomainEstimator` | Curl and divergence volume terms for complex fields. |
| `ComplexMaxwellResidualTangentialFaceEstimator` / `ComplexMaxwellResidualNormalFaceEstimator` | Tangential curl-flux and normal electric-displacement jump terms for complex fields. |
| `ComplexMaxwellDirichletBCErrorEstimator` / `ComplexMaxwellNeumannBCErrorEstimator` | Complex tangential-trace boundary residuals. |

For the common case, use the helper below. It creates the shared discontinuous
reconstructions $\mathcal{H}=\mu^{-1}\operatorname{curl}E$ and $D=\epsilon E$, then
adds the matching volume and interior-face terms. The helper supports scalar or
symmetric positive-definite matrix permittivity.

$\mathcal{H}$ is a curl flux, not the physical time-harmonic magnetic field.
It differs from the physical magnetic field by a phasor-dependent factor
involving $i\omega$.

```cpp
GeneralErrorEstimator estimator(mesh);
AddMaxwellResidualEstimators(estimator, electric, source,
                             epsilon, mu_inv, omega, order);

ThresholdRefiner refiner(estimator);
```

The helper adds two volume terms (curl and divergence residuals) and two
interior-face terms (tangential curl-flux and normal electric-displacement
jumps). All four share the discontinuous reconstructions $\mathcal{H}$ and $D$,
which are prepared once per estimator sweep. Applications can register only the
individual terms they need, or use the helper to reproduce the complete
residual indicator.

For complex fields, use `AddComplexMaxwellResidualEstimators` with the real and
imaginary permittivity coefficients. The real estimator supports ordinary 2D
and 3D fields, plus embedded three-component R1D and R2D vector finite element
spaces. The complex helper provides the analogous compositional interface for
complex Maxwell problems.

The helper adds only volume and interior-face terms. Add the appropriate
Dirichlet or Neumann boundary estimator explicitly when the residual indicator
must include nonhomogeneous boundary data. The standalone real Maxwell
estimator assumes homogeneous tangential boundary conditions.

Example 42 demonstrates an AMR loop that can switch between the ZZ estimator,
the standalone Maxwell residual estimator, and a `GeneralErrorEstimator`
configured by `AddMaxwellResidualEstimators`.

## Choosing an estimator

Use a specialized estimator when its assumptions match the problem and its
fixed formulation is sufficient. Use `GeneralErrorEstimator` when a residual
indicator needs to combine several PDE terms, apply terms on selected material
or boundary attributes, reuse derived data, or add application-specific
contributions. In either case, treat an indicator as a refinement guide: its
normalization and reliability depend on the PDE, finite element space,
coefficients, and residual terms being used.

<script type="text/x-mathjax-config">
  MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "AMS"}},
  tex2jax: {inlineMath: [['$','$']]}});
</script>
<script type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML">
</script>
