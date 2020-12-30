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
unexpected results.  As a rule domain integrals will have access to
element attributes and boundary integrals will access the boundary
attributes.  This seems obvious but there may be cases where the
outcome is not so clear cut and careful thought is required.

It is important to know when a Coefficient will be accessed,
particularly in the case of time-dependent or field-dependent
coefficients.  When used with `GridFunction::Project`,
`GridFunction::ComputeL2Error`, and other `GridFunction` methods the
`Coefficient` is used immediately. When used in `BilinearForm` and
`LinearForm` objects the coefficients are only accessed during calls
to the `Assemble` methods.  An important side note is that
`GridFunction` and `LinearForm` objects will overwrite their values
during such calls but a `BilinearForm` will not.  Consequently, when
using a time-dependent coefficient with a `BilinearForm` object it is
crucial that the user calls `BilinearForm::Update` to reset the
internally stored matrix to zero before calling
`BilinearForm::Assemble`.  Otherwise the new matrix entries will be
added to the previous values leading to odd behavior.

## Scalar Coefficients

### Basic Scalar Coefficients

| Class Name              | Description                                      |
|-------------------------|--------------------------------------------------|
| ConstantCoefficient     | Returns a constant value: $\alpha$               |
| FunctionCoefficient     | Computes a value from a standard function,       |
|                         | $f(\vec\{x},t)$, or a lambda expression          |
| PWConstCoefficient      | Returns different constants based on element     |
|                         | attribute or boundary attribute numbers          |
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
| VectorFunctionCoefficient | Computes a value from a standard function,       |
|                           | $\vec\{f}(\vec\{x})$, or a lambda expression     |
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
| MatrixFunctionCoefficient | Computes a value from a standard function,       |
|                           | $\overleftrightarrow\{f}$, or a lambda expression |
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
