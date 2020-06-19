# Linear Form Integrators

$
\newcommand{\cross}{\times}
\newcommand{\inner}{\cdot}
\newcommand{\div}{\nabla\cdot}
\newcommand{\curl}{\nabla\times}
\newcommand{\grad}{\nabla}
\newcommand{\ddx}[1]{\frac\{d#1}\{dx}}
$

Linear form integrators are the right-hand side companion to [Bilinear Form
Integrators](bilininteg.md) that compute the integrals of products of a basis
function and a given "right-hand side" function (coefficient) $\,f$ over
individual mesh elements (or sometimes over edges or faces). Typically each
element is contained in the support of several basis functions, therefore linear
integrators simultaneously compute the integrals of all combinations of the
relevant basis functions with the given input function $\,f$. This produces a
one dimensional array of results that is arranged into a small vector of
integral (dual) values called a *local element (load) vector*.

To put this another way, the `LinearForm` class builds a global vector,
`glb_vec`, by performing the outer loop in the following pseudocode snippet
whereas the `LinearFormIntegrator` class performs the nested inner loops to
compute the local vector, `loc_vec`.

```
for each elem in elements
   loc_vec = 0.0
   for each pt in quadrature_points
      for each v_i in elem
         loc_vec(i) += w(pt) * rhs(pt) v_i(pt)
      end
   end
   glb_vec += loc_vec
end
```

There are three types of integrals that typically arise although many other,
more exotic, forms are possible:

+ Integrals involving Scalar rhs $\,f$ and basis functions: $\int_\Omega\, f v$
+ Integrals involving Vector rhs $\,\vec{f}$ and basis functions: $\int_\Omega\, \vec\{f}\cdot\vec\{v}$
+ Integrals involving mix of Scalar and Vector rhs $\,\vec{f}$ and basis functions: $\int_\Omega f\,\vec\{\lambda}\cdot\vec\{v}$ and $\int_\Omega v\,\vec\{\lambda}\cdot\vec\{f}$

The `LinearFormIntegrator` classes allow MFEM to produce a wide variety of local
element matrices without modifying the `LinearForm` class. Many of the possible
operators are collected below into tables that briefly describe their action and
requirements.

In the tables below the *Space* column refers to finite element spaces which
implement the following methods:

| Space | Operator   | Derivative Operator |
|-------|------------|---------------------|
| H1    | CalcShape  | CalcDShape          |
| ND    | CalcVShape | CalcCurlShape       |
| RT    | CalcVShape | CalcDivShape        |
| L2    | CalcShape  | None                |

[//]: # ( The *Coef.* column refers to the types of coefficients (i.e. "right-hand side" )
[//]: # ( functions $\,f$) that are available. A boldface coefficient type is required )
[//]: # ( whereas most coefficients are optional. )
[//]: # ( )
[//]: # ( | Coef. | Type                     | )
[//]: # ( |-------|--------------------------| )
[//]: # ( |   S   | Scalar Valued Function   | )
[//]: # ( |   V   | Vector Valued Function   | )
[//]: # ( |   D   | Diagonal Matrix Function | )
[//]: # ( |   M   | General Matrix Function  | )

Notation:
$$\\{(f, v)\\}\_i\equiv \int_\Omega f v_i$$
$$\\{(\vec\{F}, \vec\{v})\\}\_i\equiv \int_\Omega \lambda \vec\{F}\cdot\vec\{v}_i$$
For boundary integrators, the integrals are over $\partial \Omega$.
Face integrators integrate over the interior and boundary faces of mesh elements
and are denoted with $\left<\cdot,\cdot\right>$.

## Scalar Field Operators

### Domain Integrators

| Class Name             | Space  | Operator                           | Continuous Op.   | Dimension  |
|------------------------|--------|------------------------------------|------------------| ---------- |
| DomainLFIntegrator     | H1, L2 | $(f, v)$ | $f$ | 1D, 2D, 3D |
| DomainLFGradIntegrator | H1 |   $(\vec\{f}, \nabla v)$ | $-\nabla \cdot \vec\{f}$ | 1D, 2D, 3D |

### Boundary Integrators

| Class Name             | Space  | Operator                           | Continuous Op.   | Dimension  |
|------------------------|-------|------------------------------------|------------------| ---------- |
| BoundaryLFIntegrator    | H1, L2 | $(f, v)$ | $f$ | 1D, 2D, 3D |
| BoundaryNormalLFIntegrator  | H1, L2 | $(\vec\{f} \cdot \vec\{n}, v)$ | $\vec\{f} \cdot \vec\{n}$ | 1D, 2D, 3D |
| BoundaryTangentialLFIntegrator | H1, L2 | $(\vec\{f} \cdot \vec\{\tau}, v)$ | $\vec\{f} \cdot \vec\{\tau}$ | 2D |
| BoundaryFlowIntegrator | H1, L2 | $\frac\{\alpha}\{2}\, \left< (\vec\{u} \cdot \vec\{n})\, f, v \right> - \beta\, \left<\mid \vec\{u} \cdot \vec\{n} \mid f, v \right>$ | $\frac\{\alpha}\{2} (\vec\{u} \cdot \vec\{n})\, f - \beta \mid \vec\{u} \cdot \vec\{n} \mid f$ | 1D, 2D, 3D |

### Face Integrators

| Class Name             | Space  | Operator                           | Continuous Op.   | Dimension  |
|------------------------|-------|------------------------------------|------------------| ---------- |
| DGDirichletLFIntegrator | L2 | $\sigma \left< u_D, Q \nabla v \cdot \vec\{n} \right> + \kappa \left< \\\{h^\{-1} Q\\\} u_D, v \right>$ | DG essential BCs for $u_D$ | 1D, 2D, 3D


## Vector Field Operators

### Domain Integrators

| Class Name             | Space  | Operator                           | Continuous Op.   | Dimension  |
|------------------------|--------|------------------------------------|------------------| ---------- |
| VectorDomainLFIntegrator   | H1, L2 | $(\vec\{f}, \vec\{v})$  | $\vec\{f}$  | 1D, 2D, 3D |
| VectorFEDomainLFIntegrator | ND, RT | $(\vec\{f}, \vec\{v})$  | $\vec\{f}$  | 2D, 3D |
| VectorFEDomainLFCurlIntegrator | ND | $(\vec\{f}, \nabla \times \vec\{v})$ | $\nabla \times \vec\{f}$ | 2D, 3D |
| VectorFEDomainLFDivIntegrator | RT | $(f, \nabla \cdot \vec\{v})$ | $ - \nabla f$ | 2D, 3D |

### Boundary Integrators

| Class Name             | Space  | Operator                           | Continuous Op.   | Dimension  |
|------------------------|--------|------------------------------------|------------------| ---------- |
| VectorBoundaryLFIntegrator    | H1, L2 | $( \vec\{f}, \vec\{v} )$ | $\vec\{f}$ | 1D, 2D, 3D |
| VectorBoundaryFluxLFIntegrator  | H1, L2 | $( f, \vec\{v} \cdot \vec\{n} )$ | $\vec\{f}$ | 1D, 2D, 3D |
| VectorFEBoundaryFluxLFIntegrator  | RT | $( f, \vec\{v} \cdot \vec\{n} )$ | $\vec\{f}$ | 2D, 3D |
| VectorFEBoundaryTangentLFIntegrator  | ND | $( \vec\{n} \times \vec\{f}, \vec\{v} )$ | $\vec\{n} \times \vec\{f}$ | 2D, 3D |

### Face Integrators

| Class Name             | Space  | Operator                           | Continuous Op.   | Dimension  |
|------------------------|-------|------------------------------------|------------------| ---------- |
| DGElasticityDirichletLFIntegrator | L2 | $\alpha\left<\vec\{u_D}, \left(\lambda \left(\div \vec\{v}\right) I + \mu \left(\nabla\vec\{v} + \nabla\vec\{v}^T\right)\right) \cdot \vec\{n}\right> \\\\ + \kappa\left< h^\{-1} (\lambda + 2 \mu) \vec\{u_D}, \vec\{v} \right>$ | DG essential BCs for $\vec\{u_D}$ | 1D, 2D, 3D

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
