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

## Continuous Formulations

### Essential (Dirichlet) Boundary Conditions

In continuous formulations essential boundary conditions are set by
modifying the linear system to require the degrees of freedom on the
boundary to obtain specific values. This limits the types of
constraints that can be imposed on fields. For example, $L^2$ fields
have no degrees of freedom on the boundary of elements so essential
BCs cannot be applied, H(Curl) (a.k.a. Nedelec) elements can only
constrain the tangential components of a vector field, and H(Div)
(a.k.a. Raviart-Thomas) elements can only constrain the normal
component of a vector field.

| Space   | Essential BC                                            |
|---------|---------------------------------------------------------|
|  H1     | $u = f$ on $\partial\Omega$                             |
|  H1$^d$ | $\vec\{u} = \vec\{f}$ on $\partial\Omega$               |
|  ND     | $(\hat\{n}\times\vec\{u})\times\hat\{n} = \vec\{f}$ on $\partial\Omega$ |
|  RT     | $\hat\{n}\cdot\vec\{u} = f$ on $\partial\Omega$         |


### Natural Boundary Conditions

So called "Natural Boundary Conditions" can arise whenever weak
derivatives occur in a PDE (see below for more on [weak
derivatives](fem_weak_form.md)).  Weak derivatives must be handled
using integration by parts which introduces a boundary integral. If
this boundary integral is ignored its value is implicitly set to zero
which creates an implicit constraint, called a "natural boundary
condition", on the solution.

| Continuous Operator | Weak Operator | Natural BC |
|---------------------|---------------|------------|
| $-\div(\lambda\grad u)$       | $(\lambda\grad u,\grad v)$             | $\hat\{n}\cdot(\lambda\grad u)=0$ on $\dO$   |
| $\curl(\lambda\curl\vec\{u})$ | $(\lambda\curl\vec\{u},\curl\vec\{v})$ | $\hat\{n}\cross(\lambda\curl\vec\{u})=0$ on $\dO$|
| $-\grad(\lambda\div\vec\{u})$ | $(\lambda\div\vec\{u},\div\vec\{v})$   | $\lambda\div\vec\{u}=0$ on $\dO$             |
| $\div(\vec\{\lambda}u)$       | $(-\vec\{\lambda}u,\grad v)$           | $\hat\{n}\cdot\vec\{\lambda}u = 0$ on $\dO$  |
| $\curl(\lambda\vec\{u})$      |$(\lambda\vec\{u},\curl\vec\{v})$       | $\hat\{n}\cross(\lambda\vec\{u})=0$ on $\dO$ |
| $-\div(\lambda\grad u) + \div(\vec\{\beta}u)$ | $(\lambda\grad u - \vec\{\beta}u,\grad v)$             | $\hat\{n}\cdot(\lambda\grad u-\vec\{\beta}u)=0$ on $\dO$   |

###  Neumann Boundary Conditions

Neumann boundary conditions are closely related to natural boundary
conditions.  Rather than ignoring the boundary integral we integrate a
known function on the boundary which approximates the desired value of
the boundary condition (often a involving a derivative of the field).
The following table shows a variety of common operators and their
related Neumann boundary condition.

| Operator | Continuous Operator | Neumann BC |
|------|----------|---|
| $(\lambda\grad u,\grad v)$ | $-\div(\lambda\grad u)$ | $\hat\{n}\cdot(\lambda\grad u)=f$ on $\dO$|
| $(\lambda\curl\vec\{u},\curl\vec\{v})$ | $\curl(\lambda\curl\vec\{u})$ | $\hat\{n}\cross(\lambda\curl\vec\{u})=\hat\{n}\cross\vec\{f}$ on $\dO$|
| $(\lambda\div\vec\{u},\div\vec\{v})$   | $-\grad(\lambda\div\vec\{u})$| $\lambda\div\vec\{u}=\hat\{n}\cdot\vec\{f}$ on $\dO$ |
| $(-\vec\{\lambda}u,\grad v)$                   | $\div(\vec\{\lambda}u)$ | $\hat\{n}\cdot\vec\{\lambda}u = f$ on $\dO$ |
|$(\lambda\vec\{u},\curl\vec\{v})$ | $\curl(\lambda\vec\{u})$| $\hat\{n}\cross(\lambda\vec\{u})=\hat\{n}\cross\vec\{f}$ on $\dO$ |
| $-\div(\lambda\grad u) + \div(\vec\{\beta}u)$ | $(\lambda\grad u - \vec\{\beta}u,\grad v)$             | $\hat\{n}\cdot(\lambda\grad u-\vec\{\beta}u)=f$ on $\dO$   |

To impose these boundary conditions in MFEM simply modify the
right-hand side of your linear system by adding the appropriate
boundary integral of either $f$ or $\vec\{f}$.  For $H^1$ or $L^2$
fields this can be accomplished by adding the `BoundaryLFIntegrator`
with an appropriate coefficient for $f$ to a `[Par]LinearForm` object.
For H(Curl) fields this can be accomplished by adding the
`VectorFEBoundaryTangentLFIntegrator` with an appropriate vector
coefficient for $\vec\{f}$ to a `[Par]LinearForm` object.  And
finally, for H(Div) fields this can be accomplished by adding the
`VectorFEBoundaryFluxLFIntegrator` with an appropriate scalar
coefficient for $f = \hat\{n}\cdot\vec\{f}$ to a `[Par]LinearForm`
object.  Other integrators may be appropriate if it is desirable to
express the functions $f$ or $\vec\{f}$ in other ways.

### Mixed (Robin) Boundary Conditions

## Discontinuous Galerkin Formulations

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
