# Linear Form Integrators

$
\newcommand{\cross}{\times}
\newcommand{\inner}{\cdot}
\newcommand{\div}{\nabla\cdot}
\newcommand{\curl}{\nabla\times}
\newcommand{\grad}{\nabla}
\newcommand{\ddx}[1]{\frac\{d#1}\{dx}}
$

Explain the purpose of Linear Form Integrators...

In the tables below the *Space* column refers to finite element spaces
which implement the following methods:

| Space | Operator   | Derivative Operator |
|-------|------------|---------------------|
| H1    | CalcShape  | CalcDShape          |
| ND    | CalcVShape | CalcCurlShape       |
| RT    | CalcVShape | CalcDivShape        |
| L2    | CalcShape  | None                |

The *Coef.* column refers to the types of coefficients that are
available.  A boldface coefficient type is required whereas most
coefficients are optional.

| Coef. | Type                     |
|-------|--------------------------|
|   S   | Scalar Valued Function   |
|   V   | Vector Valued Function   |
|   D   | Diagonal Matrix Function |
|   M   | General Matrix Function  |

Notation:
$$\\{(f, v)\\}\_i\equiv \int_\Omega f v_i$$
$$\\{(\vec\{F}, \vec\{v})\\}\_i\equiv \int_\Omega \lambda \vec\{F}\cdot\vec\{v}_i$$

## Scalar Field Operators

### Domain Integrators

| Class Name             | Space  | Coef. | Operator                           | Continuous Op.   | Dimension  |
|------------------------|--------|:-----:|------------------------------------|------------------|:----------:|
| ScalarLinearIntegrator | H1, L2 |   S   | $(\lambda, v)$                    | $\lambda$        | 1D, 2D, 3D |
|                        | ND, RT |   V   | $(\vec\{\lambda}, \vec\{v})$      | $\vec\{\lambda}$ | 1D, 2D, 3D |

### Boundary Integrators

| Class Name             | Space  | Coef.   | Operator                       | Continuous Op.          | Dimension  |
|------------------------|--------|:-------:|--------------------------------|-------------------------|:----------:|
|                        | H1     | S, D, M | $(-\lambda\hat\{n}, \grad v)$ | $\div(\lambda\hat\{n})$ | 1D, 2D, 3D |

## Vector Field Operators

## Pre-existing Integrators

| Class Name                          | Parent Class         |
|-------------------------------------|----------------------|
| LinearFormIntegrator                |                      |
| DomainLFIntegrator                  | LinearFormIntegrator |
| BoundaryLFIntegrator                | LinearFormIntegrator |
| BoundaryNormalLFIntegrator          | LinearFormIntegrator |
| BoundaryTangentialLFIntegrator      | LinearFormIntegrator |
| VectorDomainLFIntegrator            | LinearFormIntegrator |
| VectorBoundaryLFIntegrator          | LinearFormIntegrator |
| VectorFEDomainLFIntegrator          | LinearFormIntegrator |
| VectorBoundaryFluxLFIntegrator      | LinearFormIntegrator |
| VectorFEBoundaryFluxLFIntegrator    | LinearFormIntegrator |
| VectorFEBoundaryTangentLFIntegrator | LinearFormIntegrator |
| BoundaryFlowIntegrator              | LinearFormIntegrator |
| DGDirichletLFIntegrator             | LinearFormIntegrator |
| DGElasticityDirichletLFIntegrator   | LinearFormIntegrator |


<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
