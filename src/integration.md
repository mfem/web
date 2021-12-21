tag-fem:

# Integration

MFEM's spatial integrations are performed in the usual finite element
manner by first splitting the spatial domain into a collection of
non-overlapping "elements" which cover the domain. This is usually
referred to as the "mesh". An integral can then be computed separately
in each element and the results added together:

$$ \int_\Omega f(x)\,d\Omega = \sum_i\int_{\Omega_i}f(x)\,d\Omega $$

Where $\Omega$ is the full domain and $\Omega_i$ is the domain of the
i-th element. In MFEM this sum over elements is performed in classes
such as the `BilinearForm` or `LinearForm` and their parallel
counterparts.

Elements come in a variety of shapes and they may be flat-sided or
curved. For this reason it is much simpler to perform the element-wise
integrations on reference elements which have relatively simple
shapes. For example in 2D we might integrate over a unit square rather
than an arbitrary quadrilateral.

Finite element methods typically make the assumption that the
functions to be integrated are non-singular and at least reasonably
smooth. This enables us to employ families of relatively simple
quadrature rules which are designed for accurately integrating
polynomials.  This is in contrast to boundary element methods which
require more specialized rules which can accurately integrate
singularities. Our rules take the form:

$$\int_{\Omega_i} f(x)\,d\Omega \approx \sum_j w_j\,f(x(u_j))\,|J_i(u_j)|\label{eq:quad_rule}$$

Where $w_j$ are the quadrature weights, $u_j$ are the quadrature
points within the reference element, and $|J_i(u_j)|$ is the Jacobian
determinant for element $i$ at the location $u_j$. Integrals at this level
are typically computed by classes derived from
`BilinearFormIntegrator` or `LinearFormIntegrator`, see [Bilinear Form
Integrators](bilininteg.md) or [Linear Form Integrators](lininteg.md)
for numerous examples.

## Integration Rules

The basic building block of an integration rule is the
`IntegrationPoint`. This is a minimal object with member data 'x',
'y', 'z', and 'weight' (and an integer 'index' which is a mystery to
me). These store the coordinates of the integration point in the
reference coordinate system, $u_j$ from equation $\ref{eq:quad_rule}$
is defined as $u_j\equiv(x,y,z)$ , along with the quadrature weight,
$w_j$ also from equation $\ref{eq:quad_rule}$.

Integration points can be collected together into an `IntegrationRule`
object. `IntegrationRule` is little more than a container for the set
of `IntegrationPoint` objects associated with an integration rule for
a given order of accuracy within the domain of a specific reference
element.

`IntegrationRule` objects are in turn collected together into the
`IntegrationRules` global object. This object constructs and caches
all `IntegrationRule` objects requested by the calling program. On one
hand the `IntegrationRules` global object is a container class which
categorizes `IntegrationRule` objects by element type and order of
accuracy but more importantly it is responsible for allocating
`IntegrationRule` objects and populating them with appropriate
`IntegrationPoint` objects.

It is also possible to sidestep the `IntegrationRules` global object
and setup custom `IntegrationRule` objects. These custom integration
rules can then be passed to `BilinearFormIntegrator` or
`LinearFormIntegrator` objects (using custom integration rules with
mixed meshes currently requires specialized handling).

## Coordinate Transformations

The coordinate transformation from the reference element to an
individual mesh element is performed by the `ElementTransformation`
class. Objects of this class are prepared by the `Mesh` object and
retrieved in various ways depending on context.

For standard mesh elements

```c++
for (int e=0; e<mesh->GetNE(); e++)
{
   ElementTransformation *Trans = mesh->GetElementTransformation(e);

   ...
}
```

or for boundary elements

```c++
for (int be=0; be<mesh->GetNBE(); be++)
{
   ElementTransformation *Trans = mesh->GetBdrElementTransformation(be);

   ...
}
```

or for faces (usually in a Discontinuous Galerkin (DG) context)

```c++
for (int f=0; f<mesh->GetNumFaces(); f++)
{
   FaceElementTransformation *FETrans = mesh->GetFaceElementTransformation(f);

   ...
}
```

or, finally, for boundary faces in a DG context

```c++
for (int bf=0; bf<mesh->GetNBE(); bf++)
{
   FaceElementTransformation *FETrans = mesh->GetBdrFaceElementTransformation(bf);

   ...
}
```

A `FaceElementTransformation` object is a convenience object for
easily accessing the three `ElementTransformation` objects associated
with a mesh face and its two neighboring elements. In the case of
boundary faces one of the neighboring element transformation objects
is not present.

In addition to transforming coordinates between the reference and
global coordinate systems an `ElementTransformation` object can be
used to compute the following quantities related to the Jacobian
matrix:

| Name                 | C++ Expression                                       | Formula |
|----------------------|------------------------------------------------------|---------|
| Jacobian Matrix      | `const DenseMatrix &J = Trans.Jacobian()`            | $\{\bf J}_\{ij} = \frac\{\partial x_i}\{\partial u_j}$ |
| Jacobian Determinant | `double detJ = Trans.Weight()`                       | $\|\{\bf J}\|$ |
| Inverse Jacobian     | `const DenseMatrix &InvJ = Trans.InverseJacobian()`  | $\{\bf J}^\{-1}$ |
| Adjugate Jacobian    | `const DenseMatrix &AdjJ = Trans.AdjugateJacobian()` | $\|\{\bf J}\|\,\{\bf J}^\{-1}$ |

Since these quantities can be expensive to compute the
`ElementTransformation` object will avoid recomputing values whenever
possible. However, once a new quadrature point is set, using
`ElementTransformation::SetIntPoint()`, any cached values will be
overwritten by subsequent calls to the above functions.

## Writing Custom Integrators

Element-wise integration arises in various places in the finite element
method. A few of the most common occurrences are square and rectangular
bilinear form operators, linear form operators, and the calculation of
norms from field data.

| Type                  | Primary Function Needing Implementation          |
|-----------------------|--------------------------------------------------|
| Square Operators      | `BilinearFormIntegrator::AssembleElementMatrix`  |
| Rectangular Operators | `BilinearFormIntegrator::AssembleElementMatrix2` |
| Linear Operators      | `LinearFormIntegrator::AssembleRHSElementVect`   |

Development of a new norm or another custom integral might follow the
code found in `GridFunction::ComputeElementLpErrors`.

The pieces that are common to each of these include:

 + Determination of the appropriate quadrature order
 + Obtaining the quadrature rule for the appropriate element type
 + Working with the `ElementTransformtation` object
 + Evaluating the function to be integrated

An appropriate quadrature order depends on many variables. If we could
restrict ourselves to integrating polynomials then a specific order
would produce an exact result and a higher order would only incur
additional effort. However, skewed or curved elements can introduce a
rational polynomial factor through the Jacobian of the element
transformation. Furthermore, non-trivial material coefficients can
introduce factors with arbitrary functional forms. Useful rules of
thumb for linear and bilinear form integration orders are:

 + (linear form order) = (basis function order) + (geometry order)
 + (bilinear form order) = (domain basis function order) + (range basis function order) + (geometry order)

It can be appropriate to lower the basis function order by one if a
derivative of the basis function is being used. It might be
appropriate to increase the order if the coefficient is expected to
vary more rapidly but, in such a case, it would probably be more
appropriate to further refine the mesh. Appropriate orders for
computing norms should probably follow the guidance for bilinear forms
since most common norms tend to be quadratic.

For example a custom integrator for a rectangular operator might start
with the following lines:

```c++
void CustomIntegrator::AssembleElementMatrix2(const FiniteElement &trial_fe,
                                              const FiniteElement &test_fe,
                                              ElementTransformation &Trans,
                                              DenseMatrix &elmat)
{
   // Determine an appropriate integration rule order
   int order = trial_fe.GetOrder() // Polynomial order of domain space
             + test_fe.GetOrder()  // Polynomial order of range space
             + Trans.OrderW();     // Polynomial order of the geometry

   // Determine the element type: triangle, quadrilateral, tetrahedron, etc.
   Geometry::Type geom = Trans.GetGeometryType();

   // Construct or retrieve an integration rule for the appropriate
   // reference element with the desired order of accuracy
   const IntegrationRule * ir = &IntRules.Get(Trans.GetGeometryType(), order);

   ...
}
```

This example uses the `IntRules` global object but custom integration
rules could be provided through the use of a similar global object or
by some other means.

The next piece is to loop over the integration points and, in most
cases, make use of the `ElementTransformation` object.

```c++
...

// Loop over each quadrature point in the reference element
for (int i = 0; i < ir->GetNPoints(); i++)
{
   // Extract the current quadrature point from the integration rule
   const IntegrationPoint &ip = ir->IntPoint(i);

   // Prepare to evaluate the coordinate transformation at the current
   // quadrature point
   Trans.SetIntPoint(&ip);

   // Compute the Jacobian determinant at the current integration point
   double detJ = Trans.Weight();

   ...
}
```

The final piece is to evaluate the function to be integrated. This
often involves evaluation of a coefficient object as well as one or
two sets of basis functions or their derivatives. The coefficient
should be straightforward, simply call its `Eval` method with the
`ElementTransformation` and `IntegrationPoint` objects and perhaps a
`Vector` or `DenseMatrix` to hold the resulting coefficient value when
appropriate. Basis function evaluation can be a bit more complicated.

### Basis Function Evaluation

Some basis functions, particularly vector-valued basis functions,
partially depend upon the geometry of the physical element in addition
to their dependence on the reference element.

The scalar basis functions provided by the `H1_FECollection` are
straightforward. Simply call `FiniteElement::CalcShape` with the
current quadrature point to retrieve a vector containing the values of
each basis function evaluated at the given point in reference space.

```c++
...

// Retrieve the number of basis functions
int tr_dof = trial_fe.GetDof();

// Allocate a vector to hold the values of each basis function
Vector tr_shape(tr_dof);

// Loop over each quadrature point in the reference element
for (int i = 0; i < ir->GetNPoints(); i++)
{
   // Extract the current quadrature point from the integration rule
   const IntegrationPoint &ip = ir->IntPoint(i);

   ...

   // Evaluate the basis functions at the point ip
   trial_fe.CalcShape(ip, tr_shape);

   ...
}
```

For other types of basis functions it can be more simple to call
`CalcPhysShape` or `CalcPhysVShape`. These, and similar evaluation
functions with "Phys" in the name, internally perform the geometric
transformation of the basis functions when necessary. This is clearly
a convenience feature but it can lead to unnecessary computations when
certain optimizations are possible.

In the following table subscripts on the derivative operators indicate
which coordinate system is being used to compute the derivative; 'x'
for the physical coordinates and 'u' for the reference
coordinates. Quantities with a caret above them indicate functions
computed in the reference coordinate system.

| Family | Evaluation          | Transformation                                |
|--------|---------------------|-----------------------------------------------|
| H1     | Basis               | None |
| H1     | Gradient of Basis   | $\nabla_x\varphi_i = (J^\{-1})^T\nabla_u\hat\{\varphi}_i$ |
| ND     | Basis               | $\vec\{W}_i = (J^\{-1})^T\hat\{W}_i$ |
| ND     | Curl of Basis       | $\nabla_x\times\vec\{W}_i = \frac\{1}\{\|J\|}J\,\nabla_u\times\hat\{W}_i$ |
| RT     | Basis               | $\vec\{F}_i = \frac\{1}\{\|J\|}J\,\hat\{F}_i$ |
| RT     | Divergence of Basis | $\nabla_x\cdot\vec\{F}_i = \frac\{1}\{\|J\|}\nabla_u\cdot\hat\{F}_i$ |
| L2 (INTEGRAL) | Basis | $\psi_i = \frac\{1}\{\|J\|}\hat\{\psi}_i$ |
| L2 (VALUE)    | Basis | None |

Use of these "CalcPhys" functions enable integrators to be used with a
wider variety of basis function families without the need to
explicitly handle these transformations within the integrator. This
leads to more general implementations but at the possible cost of
added computational expense. For example, a `LinearFormIntegrator`
involving an L2 basis function using the `INTEGRAL` map type would
both multiply and divide by the Jacobian determinant at each
integration point. Clearly this is unnecessary and could significantly
increase the computational effort needed to compute the integrals.

### Working with the MixedScalarIntegrator

The `MixedScalarIntegrator` is designed to help construct
`BilinearFormIntegrators` which build an integrand from two sets of
scalar-valued basis function evaluations. Such integrands will involve
combinations of the following quantities:

+ Scalar-valued basis functions obtained from `CalcPhysShape`
+ Divergence of vector-valued basis functions obtained from `CalcPhysDivShape`
+ Curl of vector-valued basis functions in 2D obtained from `CalcPhysCurlShape`
+ Gradient of scalar-valued basis functions in 1D obtained from `CalcPhysDShape`
+ An optional scalar coefficient

To derive a custom integrator from `MixedScalarIntegrator` a developer
need only define constructors for the custom integrator. Only one constructor
is necessary but support of various coefficient types is often useful.
```c++
class MixedScalarMassIntegrator : public MixedScalarIntegrator
{
public:
   MixedScalarMassIntegrator() { same_calc_shape = true; }
   MixedScalarMassIntegrator(Coefficient &q)
      : MixedScalarIntegrator(q) { same_calc_shape = true; }
};
```

By default this integrator will compute the operator:

$$a_{ij} = \int_{\Omega_e}q(x)\,f_j(x)\,g_i(x)\,d\Omega$$

Where $f_j$ and $g_i$ are two sets of scalar-valued basis functions
which produces a "mass" matrix.

The `MixedScalarIntegrator` has two public methods and five protected
methods which can be overridden to customize the integrator.

The public methods are `AssembleElementMatrix` for use with the `BilinearForm`
class of square bilinear forms and `AssembleElementMatrix2` for use with the
`MixedBilinearForm` class of rectangular bilinear forms. Typically only one of
these is necessary and the default implementations will often suffice. However,
one or both of these methods may be overridden by a derived class if some
customization is desired. For example, to implement optimizations related to
coordinate transformations or custom integration rules, etc..

More commonly a derived class will need to override one or both of the
`CalcTestShape` and `CalcTrialShape` methods which compute the necessary basis
function values. For example the four types of scalar basis function evaluations
supported by `MixedScalarIntegrator` could be obtained by these overrides of the trial (domain) finite element basis functions:
```c++
/// Evaluate the scalar-valued basis functions
inline virtual void CalcTrialShape(const FiniteElement & trial_fe,
                                   ElementTransformation &Trans,
                                   Vector & shape)
{ trial_fe.CalcPhysShape(Trans, shape); }
```
or
```c++
/// Evaluate the divergence of the vector-valued basis functions
virtual void CalcTrialShape(const FiniteElement & trial_fe,
                            ElementTransformation &Trans,
                            Vector & shape)
{ trial_fe.CalcPhysDivShape(Trans, shape); }
```
or
```c++
/// Evaluate the 2D curl of the vector-valued basis functions
inline virtual void CalcTrialShape(const FiniteElement & trial_fe,
                                   ElementTransformation &Trans,
                                   Vector & shape)
{
   DenseMatrix dshape(shape.GetData(), shape.Size(), 1);
   trial_fe.CalcPhysCurlShape(Trans, dshape);
}
```
or
```c++
/// Evaluate the 1D gradient of the scalar-valued basis functions
inline virtual void CalcTrialShape(const FiniteElement & trial_fe,
                                   ElementTransformation &Trans,
                                   Vector & shape)
{
   DenseMatrix dshape(shape.GetData(), shape.Size(), 1);
   trial_fe.CalcPhysDShape(Trans, dshape);
}
```
Similar overrides could be implemented for the test (range) space. Of course
other overrides are possible and may be quite useful for other custom
integrators.

The next override that is often advisable is `VerifyFiniteElementTypes` which
provides a means of testing the `FiniteElement` objects passed by the
`BilinearForm` class to make sure they support the evaluations needed by the
`CalcTestShape` and `CalcTrialShape` methods. This override is optional but
highly recommended. As an example the following override verifies that the
geometry is one dimensional and that the trial (domain) space supports
evaluation of the gradient of the basis functions.
```c++
inline virtual bool VerifyFiniteElementTypes(const FiniteElement & trial_fe,
                                             const FiniteElement & test_fe
                                             ) const
{
   return (trial_fe.GetDim() == 1 && test_fe.GetDim() == 1 &&
           trial_fe.GetDerivType() == mfem::FiniteElement::GRAD  &&
           test_fe.GetRangeType()  == mfem::FiniteElement::SCALAR );
}
```
A related optional method can be used to output an appropriate error message in
the event that unsuitable basis functions have been provided. For example the
following error message might be appropriate in conjunction with the previous
`VerifyFiniteElementTypes` implementation:
```c++
inline virtual const char * FiniteElementTypeFailureMessage() const
{
   return "Trial and test spaces must both be scalar fields in 1D "
          "and the trial space must implement CalcDShape.";
}
```
The last optional protected method allows a certain flexibility in the choice
of quadrature order. The default implementation is shown below but other
choices may be suitable.
```c++
inline virtual int GetIntegrationOrder(const FiniteElement & trial_fe,
                                       const FiniteElement & test_fe,
                                       ElementTransformation &Trans)
{ return trial_fe.GetOrder() + test_fe.GetOrder() + Trans.OrderW(); }
```

A wide variety of bilinear forms can be easily implemented using the
`MixedScalarIntegrator`. Most of these are probably already included in MFEM,
see [Bilinear Form Integrators](bilininteg.md) for a listing, but other options
may be useful.

### Working with the MixedVectorIntegrator

The `MixedVectorIntegrator` is very similar in spirit to the
`MixedScalarIntegrator` but the integrand in this case is computed as the inner
product of two vectors. Such integrands will involve combinations of the
following quantities:

+ Vector-valued basis functions obtained from `CalcVShape`
+ Gradient of scalar-valued basis functions obtained from `CalcPhysDShape`
+ Curl of vector-valued basis functions in 3D obtained from `CalcPhysCurlShape`
+ Optional scalar, vector, or matrix-valued coefficients

By default this integrator will compute different operators based on
coefficient type:

| Coefficient Type | Default Integral                                          |
|------------------|-----------------------------------------------------------|
| Scalar           | $a_\{ij} = \int_\{\Omega_e}q(x)\,\vec\{F}_j(x)\cdot\,\vec\{G}_i(x)\,d\Omega$ |
| Matrix           | $a_\{ij} = \int_\{\Omega_e}\left(Q(x)\,\vec\{F}_j(x)\right)\cdot\,\vec\{G}_i(x)\,d\Omega$ |
| Vector           | $a_\{ij} = \int_\{\Omega_e}\left(\vec\{q}(x)\times\vec\{F}_j(x)\right)\cdot\,\vec\{G}_i(x)\,d\Omega$ |

Where $\vec{F}_j$ and $\vec{G}_i$ are two sets of vector-valued basis functions
which produces a "mass" matrix.

The `MixedVectorIntegrator` also has public and protected methods which may be
overridden in an analogous manner to those in `MixedScalarIntegrator` to
implement an even wider variety of custom integrators. Note that the default
implementation of the assembly methods do assume a square matrix coefficient
but this assumption could be removed if necessary.

The `CalcTestShape` and `CalcTrialShape` methods which compute the necessary
vector-valued basis function values might be overridden as follows:

```c++
/// Evaluate the vector-valued basis functions
inline virtual void CalcTrialShape(const FiniteElement & trial_fe,
                                   ElementTransformation &Trans,
                                   DenseMatrix & shape)
{ trial_fe.CalcVShape(Trans, shape); }
```
or
```c++
/// Evaluate the gradient of the scalar-valued basis functions
inline virtual void CalcTrialShape(const FiniteElement & trial_fe,
                                   ElementTransformation &Trans,
                                   DenseMatrix & shape)
{ trial_fe.CalcPhysDShape(Trans, shape); }
```
or
```c++
/// Evaluate the 3D curl of the vector-valued basis functions
inline virtual void CalcTrialShape(const FiniteElement & trial_fe,
                                   ElementTransformation &Trans,
                                   DenseMatrix & shape)
{ trial_fe.CalcPhysCurlShape(Trans, shape); }
```

Many of the possible `MixedVectorIntegrator` customizations are already
included in MFEM. See [Bilinear Form Integrators](bilininteg.md) for a listing.

### Working with the MixedScalarVectorIntegrator

The `MixedScalarVectorIntegrator` follows naturally from the
`MixedScalarIntegrator` and the `MixedVectorIntegrator`. The integrand in this
case is computed as the product of a scalar basis function with a vector basis
function. However, since the integrand must be scalar valued, a vector-valued
coefficient will always be required.

The types of scalar-valued basis functions will include:

+ Scalar-valued basis functions obtained from `CalcPhysShape`
+ Divergence of vector-valued basis functions obtained from `CalcPhysDivShape`
+ Curl of vector-valued basis functions in 2D obtained from `CalcPhysCurlShape`
+ Gradient of scalar-valued basis functions in 1D obtained from `CalcPhysDShape`

The types of vector-valued basis functions will include:

+ Vector-valued basis functions obtained from `CalcVShape`
+ Gradient of scalar-valued basis functions obtained from `CalcPhysDShape`
+ Curl of vector-valued basis functions in 3D obtained from `CalcPhysCurlShape`

By default this integrator will compute different operators based on the choice
of the trial and test spaces and, in 2D, how the vector coefficient should be
employed:

$$a_{ij} = \int_{\Omega_e}\left(\vec{q}(x)\,f_j(x)\right)\cdot\vec{G}_i(x)\,d\Omega\label{msv_def}$$

or

$$a_{ij} = \int_{\Omega_e}\left(\vec{q}(x)\cdot\vec{F}_j(x)\right)\,g_i(x)\,d\Omega\label{msv_trans}$$

or in 2D there is an option to compute

$$a_{ij} = \int_{\Omega_e}\left(\vec{q}(x)\,f_j(x)\right)\times\vec{G}_i(x)\,d\Omega\label{msv_2d_def}$$

or (again optionally in 2D)

$$a_{ij} = \int_{\Omega_e}\left(\vec{q}(x)\times\vec{F}_j(x)\right)\,g_i(x)\,d\Omega\label{msv_2d_trans}$$

The methods that a developer may choose to override are again quite similar to
those in `MixedScalarIntegrator` and `MixedVectorIntegrator`. The main
difference is the basis function overrides which have been renamed to
`CalcShape` for the scalar-valued basis and `CalcVShape` for the vector-valued
basis. By default it is assumed that the trial (domain) space is scalar-valued
and the test (range) space is vector-valued as in equations \ref{msv_def} and
\ref{msv_2d_def}. The choice of trial and test spaces is here controlled by a
`transpose` option in the `MixedScalarVectorIntegrator` constructor. If
`transpose == true` then equations \ref{msv_trans} and \ref{msv_2d_trans} are
assumed. The choice between equations \ref{msv_def} and \ref{msv_trans} on the
one hand and equations \ref{msv_2d_def} and \ref{msv_2d_trans} on the other is
made with the `cross_2d` optional constructor argument.

Again there are several customizations of this integrator included in MFEM but
others are possible. See [Bilinear Form Integrators](bilininteg.md) for a
listing.

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
