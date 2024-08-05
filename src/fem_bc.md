tag-fem:

# Boundary Conditions

$
\newcommand{\cross}{\times}
\newcommand{\inner}{\cdot}
\newcommand{\div}{\nabla\cdot}
\newcommand{\curl}{\nabla\times}
\newcommand{\grad}{\nabla}
\newcommand{\ddx}[1]{\frac\{d#1}\{dx}}
\newcommand{\abs}[1]{|#1|}
\newcommand{\dO}{{\partial\Omega}}
$

MFEM supports boundary conditions of mixed type through the definition
of boundary attributes on the mesh.  A boundary attribute is a
positive integer assigned to each boundary element of the mesh.  Since
each boundary element can have only one attribute number the boundary
attributes split the boundary into a group of disjoint sets.  MFEM
allows the user to define boundary conditions on a subset of boundary
attributes.

Typically mixed boundary conditions are imposed on disjoint portions
of the boundary defined as:

| Symbol            | Description                       |
|-------------------|-----------------------------------|
| $\Gamma\equiv\dO$ | Boundary of the Domain ($\Omega$) |
| $\Gamma_D$        | Dirichlet Boundary                |
| $\Gamma_N$        | Neumann Boundary                  |
| $\Gamma_R$        | Robin Boundary                    |
| $\Gamma_0$        | Natural Boundary                  |

Where we assume $\Gamma =
\Gamma_D\cup\Gamma_N\cup\Gamma_R\cup\Gamma_0$.  In MFEM boundaries are
usually described by "marker arrays".  A marker array is an array of
integers containing zeros and ones with a length equal to the largest
boundary attribute index.

```c++
// Assume we start with an array containing boundary attribute numbers
// stored in bdr_attr.
//
// Prepare a marker array from a set of attributes
Array<int> bdr_marker(pmesh.bdr_attributes.Max());
bdr_marker = 0;

for (int i=0; i<bdr_attr.Size(); i++)
{
   bdr_marker[bdr_attr[i]-1] = 1;
}
```

Separate marker arrays of this type can be prepared for the Dirichlet,
Neumann, and Robin portions of the boundary.  It is left to the user
to ensure that $\Gamma_D$, $\Gamma_N$, and $\Gamma_R$ are defined as
non-overlapping portions of the boundary.

## Continuous Formulations

### Dirichlet (Essential) Boundary Conditions

In continuous formulations essential boundary conditions are set by
modifying the linear system to require the degrees of freedom on the
boundary to obtain specific values. This limits the types of
constraints that can be imposed on fields. For example, $L^2$ fields
have no degrees of freedom on the boundary of elements so essential
BCs cannot be applied, H(Curl) (Nedelec) elements can only
constrain the tangential components of a vector field, and H(Div)
(Raviart-Thomas) elements can only constrain the normal
component of a vector field.

| Space   | Essential BC                                                      |
|---------|-------------------------------------------------------------------|
|  H1     | $u = f$ on $\Gamma_D$                                             |
|  H1$^d$ | $\vec\{u} = \vec\{f}$ on $\Gamma_D$                               |
|  ND     | $(\hat\{n}\times\vec\{u})\times\hat\{n} = \vec\{f}$ on $\Gamma_D$ |
|  RT     | $\hat\{n}\cdot\vec\{u} = f$ on $\Gamma_D$                         |

MFEM provides a convenience method, called `FormLinearSystem`, on the
`[Par]BilinearForm` class which can prepare a linear system with these
essential constraints.

```c++
// Set the Dirichlet values in the solution vector
ParGridFunction u(&fespace);
u = 0.0;
u.ProjectBdrCoefficient(dbcCoef, dbc_marker);

// Prepare the source term in the right-hand-side
ParLinearForm b(&fespace);
b.AddDomainIntegrator(new DomainLFIntegrator(rhsCoef));
b.Assemble();

// Prepare the bilinear form
ParBilinearForm a(&fespace);
a.AddDomainIntegrator(new DiffusionIntegrator(matCoef));
a.Assemble();

// Determine the essential degrees of freedom corresponding to the set of
// boundary attributes marked in dbc_marker
Array<int> ess_tdof_list(0);
fespace.GetEssentialTrueDofs(dbc_marker, ess_tdof_list);

// Prepare the linear system with enforcement of the essential boundary
// conditions
OperatorPtr A;
Vector B, X;
a.FormLinearSystem(ess_tdof_list, u, b, A, X, B);
```

### Natural Boundary Conditions

The so called "Natural Boundary Conditions" arise whenever weak
derivatives occur in a PDE (see below for more on [weak
derivatives](fem_weak_form.md)).  Weak derivatives must be handled
using integration by parts which introduces a boundary integral. If
this boundary integral is ignored, its value is implicitly set to zero
which creates an implicit constraint on the solution called a
"natural boundary condition".

| Continuous Operator | Weak Operator | Natural BC |
|---------------------|---------------|------------|
| $-\div(\lambda\grad u)$       | $(\lambda\grad u,\grad v)$             | $\hat\{n}\cdot(\lambda\grad u)=0$ on $\Gamma_0$   |
| $\curl(\lambda\curl\vec\{u})$ | $(\lambda\curl\vec\{u},\curl\vec\{v})$ | $\hat\{n}\cross(\lambda\curl\vec\{u})=0$ on $\Gamma_0$|
| $-\grad(\lambda\div\vec\{u})$ | $(\lambda\div\vec\{u},\div\vec\{v})$   | $\lambda\div\vec\{u}=0$ on $\Gamma_0$             |
| $\div(\vec\{\lambda}u)$       | $(-\vec\{\lambda}u,\grad v)$           | $\hat\{n}\cdot\vec\{\lambda}u = 0$ on $\Gamma_0$  |
| $\curl(\lambda\vec\{u})$      |$(\lambda\vec\{u},\curl\vec\{v})$       | $\hat\{n}\cross(\lambda\vec\{u})=0$ on $\Gamma_0$ |
| $-\div(\lambda\grad u) + \div(\vec\{\beta}u)$ | $(\lambda\grad u - \vec\{\beta}u,\grad v)$             | $\hat\{n}\cdot(\lambda\grad u-\vec\{\beta}u)=0$ on $\Gamma_0$   |

No additional implementation is necessary to impose natural boundary conditions.  Any
portion of the boundary where a Dirichlet, Neumann, or Robin boundary
condition has not been applied will receive a natural boundary
condition by default.

###  Neumann Boundary Conditions

Neumann boundary conditions are closely related to natural boundary
conditions.  Rather than ignoring the boundary integral we integrate a
known function on the boundary which approximates the desired value of
the boundary condition (often a involving a derivative of the field).
The following table shows a variety of common operators and their
related Neumann boundary condition.

| Operator | Continuous Operator | Neumann BC |
|----------|---------------------|------------|
| $(\lambda\grad u,\grad v)$ | $-\div(\lambda\grad u)$ | $\hat\{n}\cdot(\lambda\grad u)=f$ on $\Gamma_N$|
| $(\lambda\curl\vec\{u},\curl\vec\{v})$ | $\curl(\lambda\curl\vec\{u})$ | $\hat\{n}\cross(\lambda\curl\vec\{u})=\hat\{n}\cross\vec\{f}$ on $\Gamma_N$|
| $(\lambda\div\vec\{u},\div\vec\{v})$   | $-\grad(\lambda\div\vec\{u})$| $\lambda\div\vec\{u}=\hat\{n}\cdot\vec\{f}$ on $\Gamma_N$ |
| $(-\vec\{\lambda}u,\grad v)$                   | $\div(\vec\{\lambda}u)$ | $\hat\{n}\cdot\vec\{\lambda}u = f$ on $\Gamma_N$ |
|$(\lambda\vec\{u},\curl\vec\{v})$ | $\curl(\lambda\vec\{u})$| $\hat\{n}\cross(\lambda\vec\{u})=\hat\{n}\cross\vec\{f}$ on $\Gamma_N$ |
| $(\lambda\grad u - \vec\{\beta}u,\grad v)$             | $-\div(\lambda\grad u) + \div(\vec\{\beta}u)$ | $\hat\{n}\cdot(\lambda\grad u-\vec\{\beta}u)=f$ on $\Gamma_N$   |

To impose these boundary conditions in MFEM simply modify the
right-hand side of your linear system by adding the appropriate
boundary integral of either $f$ or $\vec\{f}$.  For $H^1$ or $L^2$
fields this can be accomplished by adding the `BoundaryLFIntegrator`
with an appropriate coefficient for $f$ to a `[Par]LinearForm` object.

Neumann boundary conditions can be added to the above example code by adding the following line before the call to `b.Assemble()`.
```c++
// Add Neumann BCs n.(matCoef Grad u) = nbcCoef on the boundary marked in
// the nbc_marker array.
b.AddBoundaryIntegrator(new BoundaryLFIntegrator(nbcCoef), nbc_marker);
```

For H(Curl) fields this can be accomplished by adding the
`VectorFEBoundaryTangentLFIntegrator` with an appropriate vector
coefficient for $\vec\{f}$ to a `[Par]LinearForm` object.  And
finally, for H(Div) fields this can be accomplished by adding the
`VectorFEBoundaryFluxLFIntegrator` with an appropriate scalar
coefficient for $f = \hat\{n}\cdot\vec\{f}$ to a `[Par]LinearForm`
object.  Other integrators may be appropriate if it is desirable to
express the functions $\,f$ or $\vec\{f}$ in other ways.

### Robin Boundary Conditions

Robin boundary conditions typically involve a linear function of the
field and its normal derivative.  As such they also arise from weak
derivatives and the boundary integrals they introduce to the system of
equations.  Typical forms of the Robin boundary condition include the
following.

| Operator | Continuous Operator | Robin BC |
|----------|---------------------|----------|
| $(\lambda\grad u,\grad v)$ | $-\div(\lambda\grad u)$ | $\hat\{n}\cdot(\lambda\grad u)+\gamma\,u=f$ on $\Gamma_R$|
| $(\lambda\curl\vec\{u},\curl\vec\{v})$ | $\curl(\lambda\curl\vec\{u})$ | $\hat\{n}\cross(\lambda\curl\vec\{u}+\gamma\,\hat\{n}\cross\vec\{u})=\hat\{n}\cross\vec\{f}$ on $\Gamma_R$|
| $(\lambda\div\vec\{u},\div\vec\{v})$   | $-\grad(\lambda\div\vec\{u})$| $\lambda\div\vec\{u}+\gamma\,\hat\{n}\cdot\vec\{u}=\hat\{n}\cdot\vec\{f}$ on $\Gamma_R$ |
| $(\lambda\grad u - \vec\{\beta}u,\grad v)$             | $-\div(\lambda\grad u) + \div(\vec\{\beta}u)$ | $\hat\{n}\cdot(\lambda\grad u-\vec\{\beta}u)+\gamma\,u=f$ on $\Gamma_R$   |

Robin boundary conditions are applied in the same manner as Neumann
boundary conditions except that one must also add a boundary integral
to the `[Par]BilinearForm` object to account for the term involving
$\gamma$.  For example, when solving for an $H^1$ field one should add
a `MassIntegrator` with an appropriate scalar coefficient for
$\gamma$.

The implementation of a Robin boundary condition requires precisely
the same change to the right-hand-side as the Neumann boundary
condition as well as a new term in the bilinear form before `a.Assemble()`:

```c++
// Add Robin BCs n.(matCoef Grad u) + rbcACoef u = rbcBCoef on the boundary
// marked in the rbc_marker array.
b.AddBoundaryIntegrator(new BoundaryLFIntegrator(rbcBCoef), rbc_marker);

...

// Add Robin BCs n.(matCoef grad u) + rbcACoef u = rbcBCoef on the boundary
// marked in the rbc_marker array.
a.AddBoundaryIntegrator(new MassIntegrator(rbcACoef), rbc_marker);
```

## Discontinuous Galerkin Formulations

In the Discontinuous Galerkin (DG) formulation the
[Natural](#natural-boundary-conditions),
[Neumann](#neumann-boundary-conditions), and [Robin](#robin-boundary-conditions)
can be implemented in a similar the same manner as in the continuous case
(adding the appropriate `LinearFormIntegrator` as a _boundary face integrator_
instead of a _boundary integrator_).  However, since DG basis functions
have no degrees of freedom associated with the boundary, Dirichlet boundary
conditions must be handled differently.

```c++
// Add the desired value for the Dirichlet constraint on the boundary
// marked in the dbc_marker array.
b.AddBdrFaceIntegrator(new DGDirichletLFIntegrator(dbcCoef, matCoef, sigma, kappa),
                       dbc_marker);

...

// Add the n.Grad(u) boundary integral on the Dirichlet portion of the
// boundary marked in the dbc_marker array.
a.AddBdrFaceIntegrator(new DGDiffusionIntegrator(matCoef, sigma, kappa),
                       dbc_marker);
```

Where `sigma` and `kappa` are parameters controlling the symmetry and
interior penalty used in the DG diffusion formulation.  These two
integrators work together to balance the natural boundary condition
associated with the `DiffusionIntegrator` and to penalize solutions
which differ from the desired Dirichlet value near the boundary.
Similar pairs of integrators can be implemented to accommodate
other PDEs.

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
