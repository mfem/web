tag-fem:

# Coefficients

Coefficient objects serve many purposes within MFEM. As the name
suggests they often represent the material coefficients appearing in
partial differential equations. However, Coefficients can also be
used to specify initial conditions, boundary conditions, exact
solutions, etc..

Coefficients come in three varieties; scalar-valued, vector-valued,
and matrix-valued. The primary purpose of any Coefficient class is to
define an `Eval` method which returns a scalar, vector, or matrix
given an element and a location within that element expressed as a
point in reference space i.e. an `IntegrationPoint`. Coefficients can
also be time dependent. Time is treated as a parameter which changes
infrequently by passing the current time though a `SetTime(t)` method.

A Coefficient's `Eval` method depends on not only the position within
an element but also on the element attribute number which allows the
Coefficient to return different results from different regions of the
domain or boundary. This can be a powerful feature but it can lead to
unexpected results. The attribute available to `Eval` belongs to the
`ElementTransformation` supplied by the integrator, not necessarily
to the integration surface. Ordinary domain integrators supply volume
attributes and ordinary boundary-element integrators supply boundary
attributes. Face integrators can use both contexts in one integral:
`DGDirichletLFIntegrator` evaluates its prescribed boundary value with
the boundary face transformation, but its diffusion coefficient with
the adjacent volume element. `DGDiffusionIntegrator` similarly uses
adjacent volume attributes for material coefficients, including on
boundary faces. `BoundaryFlowIntegrator` uses a boundary attribute for
its prescribed value and a volume attribute for its velocity. Check
which transformation is passed for each coefficient before indexing
an attribute-dependent coefficient or constructing a piecewise one.

It is important to know when a coefficient is evaluated, particularly
for time-dependent or field-dependent data. `GridFunction` projection
and error routines evaluate it immediately. Ordinary assembled
`BilinearForm` and `LinearForm` objects evaluate it during `Assemble`,
but this is not the only possible evaluation: for example,
`BilinearForm::ComputeElementMatrix` evaluates its integrators when
element matrices are not cached. A LEGACY `NonlinearForm` evaluates
its integrators during residual and gradient calls. Other assembly
levels and integrators can have different coefficient caching rules;
do not infer coefficient lifetime or whether changed data will take
effect from the word "matrix-free" alone.

Projection and `LinearForm::Assemble` overwrite their result vectors.
In LEGACY assembly, a `BilinearForm` instead adds to its stored matrix.
For time-dependent coefficients, call `BilinearForm::Update` to reset
that matrix before reassembling it, or old and new entries accumulate.

## Coefficient ownership and lifetime

Adding an integrator to a form normally transfers ownership of the
integrator to the form; it does not transfer ownership of coefficients
passed to ordinary integrator constructors. For example,
`MassIntegrator(q)` stores a pointer to `q`, and `DomainLFIntegrator(q)`
stores a reference. Keep `q` alive through every assembly or other
operation that evaluates that integrator. A helper that registers an
integrator using a local coefficient and then returns before assembly
leaves a dangling reference; keep the coefficient in the caller or an
owning application object instead. A `GridFunctionCoefficient` also
borrows its grid function, which must remain valid during evaluation.

Coefficient containers have their own ownership rules. For example,
`VectorArrayCoefficient::Set` and `MatrixArrayCoefficient::Set` own the
supplied coefficient by default; use their `own=false` option when
passing a coefficient owned elsewhere, including a stack object.
Consult the individual constructor or setter documentation rather
than assuming that every coefficient wrapper borrows or owns its inputs.

## Scalar Coefficients

### Basic Scalar Coefficients

| Class Name              | Description                                      |
|-------------------------|--------------------------------------------------|
| ConstantCoefficient     | Returns a constant value: $\alpha$               |
| FunctionCoefficient     | Computes a value from a standard function, $f(\vec\{x},t)$, or a lambda expression          |
| PWConstCoefficient      | Returns different constants based e.g. on element attribute |
| GridFunctionCoefficient | Returns values interpolated from a scalar-valued `GridFunction`: $u(\vec\{x})$ |
| DivergenceGridFunctionCoefficient | Returns the divergence of a vector-valued  `GridFunction`:  $\nabla\cdot\vec\{u}$ |
| DeltaCoefficient        | A weighted Dirac delta function: $s\,w(\vec\{x},t)\,T(t)\,\delta(\vec\{x}-\vec\{x}_c)$ |

### Derived Scalar Coefficients

These classes provide a means of creating functions of existing
coefficients.  In performance critical situations it would clearly be
preferable to write specialized `Coefficient` classes but these offer
a quick and, hopefully, easy to use alternative.

| Class Name                  | Formula                                       |
|-----------------------------|-----------------------------------------------|
| TransformedCoefficient      | $T(Q_1(\vec\{x},t))\mbox\{ or }T(Q_1(\vec\{x},t),Q_2(\vec\{x},t))$ |
| RestrictedCoefficient       | $Q(\vec\{x})\,\forall a\in A, 0\mbox\{ otherwise}$ |
| SumCoefficient              | $\alpha\,Q_1(\vec\{x}) + \beta\,Q_2(\vec\{x})$ |
| ProductCoefficient          | $Q_1(\vec\{x})\,Q_2(\vec\{x})$ |
| PowerCoefficient            | $Q(\vec\{x})^p$ |
| InnerProductCoefficient     | $\vec\{Q}_1\cdot\vec\{Q}_2$ |
| VectorRotProductCoefficient | $\vec\{Q}_1\times\vec\{Q}_2\mbox\{ in }\mathbb\{R}^2$ |
| DeterminantCoefficient      | $\|\overleftrightarrow\{Q}\|$ |


## Vector Coefficients

### Basic Vector Coefficients

| Class Name                | Description                                      |
|---------------------------|--------------------------------------------------|
| VectorConstantCoefficient | Returns a constant vector value: $\vec\{\alpha}$ |
| VectorFunctionCoefficient | Computes a value from a standard function, $\vec\{f}(\vec\{x})$, or a lambda expression     |
| VectorGridFunctionCoefficient   | Returns values interpolated from a vector-valued `GridFunction`: $\vec\{u}(\vec\{x})$ |
| GradientGridFunctionCoefficient | Returns the gradient of a scalar-valued  `GridFunction`:  $\nabla u(\vec\{x})$ |
| CurlGridFunctionCoefficient     | Returns the curl of a vector-valued  `GridFunction`:  $\nabla\times\vec\{u}(\vec\{x})$ |
| VectorDeltaCoefficient    | $s\,\vec\{\alpha}\,\delta(\vec\{x}-\vec\{x}_c)$  |

### Derived Vector Coefficients

Again these classes provide a means of creating functions of existing
coefficients.

| Class Name | Formula |
|--|--|
| VectorArrayCoefficient  | Construct a vector value from an array of scalar coefficients: $\vec\{Q}_a$ |
| VectorRestrictedCoefficient  | $\vec\{Q}(\vec\{x})\,\forall a\in A, 0\mbox\{ otherwise}$ |
| VectorSumCoefficient  | $\alpha\,\vec\{Q}_1(\vec\{x}) + \beta\,\vec\{Q}_2(\vec\{x})$ |
| ScalarVectorProductCoefficient  | $Q_1\,\vec\{Q}_2$ |
| VectorCrossProductCoefficient  | $\vec\{Q}_1\times\vec\{Q}_2$ |
| MatVecCoefficient  | $\overleftrightarrow\{Q}_1\cdot\vec\{Q}_2$ |

## Matrix Coefficients

### Basic Matrix Coefficients

| Class Name                | Description                                      |
|---------------------------|--------------------------------------------------|
| MatrixConstantCoefficient | Returns a constant matrix value: $\overleftrightarrow\{\alpha}$ |
| MatrixFunctionCoefficient | Computes a value from a standard function, $\overleftrightarrow\{f}$, or a lambda expression |
| IdentityMatrixCoefficient | Returns the identity matrix of the appropriate dimension: $\overleftrightarrow\{I}$ |

### Derived Matrix Coefficients

Again these classes provide a means of creating functions of existing
coefficients.

| Class Name                     | Formula                                    |
|--------------------------------|--------------------------------------------|
| MatrixArrayCoefficient         | Construct a matrix value from an array of scalar coefficients: $\overleftrightarrow\{Q}_a$ |
| MatrixRestrictedCoefficient    | $\overleftrightarrow\{Q}(\vec\{x})\,\forall a\in A, 0\mbox\{ otherwise}$ |
| MatrixSumCoefficient           | $\alpha\,\overleftrightarrow\{Q}_1(\vec\{x}) + \beta\,\overleftrightarrow\{Q}_2(\vec\{x})$ |
| ScalarMatrixProductCoefficient | $Q_1\,\overleftrightarrow\{Q}_2$           |
| TransposeMatrixCoefficient     | $\overleftrightarrow\{Q}^T$                |
| InverseMatrixCoefficient       | $\overleftrightarrow\{Q}^\{-1}$            |
| OuterProductCoefficient        | $\vec\{Q}_1\otimes\vec\{Q}_2$              |

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
