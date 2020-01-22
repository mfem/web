# Bilinear Form Integrators

$
\newcommand{\cross}{\times}
\newcommand{\inner}{\cdot}
\newcommand{\div}{\nabla\cdot}
\newcommand{\curl}{\nabla\times}
\newcommand{\grad}{\nabla}
\newcommand{\ddx}[1]{\frac\{d#1}\{dx}}
\newcommand{\abs}[1]{|#1|}
$

Bilinear form integrators are at the heart of any finite element method, they
are used to compute the integrals of products of basis functions over individual
mesh elements (or sometimes over edges or faces).  Typically each element is
contained in the support of several basis functions of both the domain and range
spaces, therefore bilinear integrators simultaneously compute the integrals of
all combinations of the relevant basis functions from the domain and range
spaces.  This produces a two dimensional array of results that are arranged into
a small dense matrix of integral values called a *local element (stiffness)
matrix*.

To put this another way, the `BilinearForm` class builds a global, sparse,
finite element matrix, `glb_mat`, by performing the outer loop in the following
pseudocode snippet whereas the `BilinearFormIntegrator` class performs the
nested inner loops to compute the dense local element matrix, `loc_mat`.

```
for each elem in elements
   loc_mat = 0.0
   for each pt in quadrature_points
      for each u_j in elem
         for each v_i in elem
            loc_mat(i,j) += w(pt) * u_j(pt) v_i(pt)
         end
      end
   end
   glb_mat += loc_mat
end
```

There are three types of integrals that typically arise although many other,
more exotic, forms are possible:

+ Integrals involving Scalar basis functions: $\int_\Omega \lambda\, u v$
+ Integrals involving Vector basis functions: $\int_\Omega \lambda\, \vec\{u}\cdot\vec\{v}$
+ Integrals involving Scalar and Vector basis functions: $\int_\Omega u\,\vec\{\lambda}\cdot\vec\{v}$

The `BilinearFormIntegrator` classes allow MFEM to produce a wide variety of
local element matrices without modifying the `BilinearForm` class.  Many of the
possible operators are collected below into tables that briefly describe their
action and requirements.

In the tables below the *Space* column refers to finite element spaces which
implement the following methods:

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

Notation: The integrals performed by the various integrators listed
below are shown using inner product notation, $(\cdot,\cdot)$, defined
as follows.

$$(\lambda u, v)\equiv \int_\Omega \lambda u v$$
$$(\lambda\vec\{u}, \vec\{v})\equiv \int_\Omega\lambda\vec\{u}\cdot\vec\{v}$$

Where $u$ or $\vec\{u}$ is a function in the domain (or trial) space and $v$
or $\vec\{v}$ is in the range (or test) space.
For boundary integrators, the integrals are over $\partial \Omega$.
Face integrators integrate over the interior and boundary faces of mesh elements
and are denoted with $\left<\cdot,\cdot\right>$.

Note that any operators involving a derivative of the range function
$v$ or $\vec\{v}$ are computed using integration by parts.  This leads
to a boundary integral which can be used to apply Neumann boundary
conditions.  Some of these operators are listed along with their
boundary terms in section [Weak Operators](#weak-operators).

## Scalar Field Operators

These operators require scalar-valued trial spaces.  Many of these
operators will work with either H1 or L2 basis functions but some that
require a gradient operator should be used with H1.

### Square Operators

These integrators are designed to be used with the BilinearForm object
to assemble square linear operators.

| Class Name          | Spaces | Coef.| Operator                    | Continuous Op.          | Dimension  |
|---------------------|--------|:----:|-----------------------------|-------------------------|:----------:|
| MassIntegrator      | H1, L2 | S    | $(\lambda u, v)$            | $\lambda u$             | 1D, 2D, 3D |
| DiffusionIntegrator | H1     | S, M | $(\lambda\grad u, \grad v)$ | $-\div(\lambda\grad u)$ | 1D, 2D, 3D |

### Mixed Operators

These integrators are designed to be used with the MixedBilinearForm object to assemble square or rectangular linear operators.

| Class Name                            | Domain | Range  | Coef.   | Operator                                       | Continuous Op.                       | Dimension  |
|---------------------------------------|--------|--------|:-------:|------------------------------------------------|--------------------------------------|:----------:|
| MixedScalarMassIntegrator             | H1, L2 | H1, L2 |    S    | $(\lambda u, v)$                               | $\lambda u$                          | 1D, 2D, 3D |
| MixedScalarWeakDivergenceIntegrator   | H1, L2 | H1     |  **V**  | $(-\vec\{\lambda}u,\grad v)$                   | $\div(\vec\{\lambda}u)$              | 2D, 3D     |
| MixedScalarWeakDerivativeIntegrator   | H1, L2 | H1     |    S    | $(-\lambda u, \ddx\{v})$                       | $\ddx\{}(\lambda u)\;$               | 1D         |
| MixedScalarWeakCurlIntegrator         | H1, L2 | ND     |    S    | $(\lambda u,\curl\vec\{v})$                    | $\curl(\lambda\,u\,\hat\{z})\;$      | 2D         |
| MixedVectorProductIntegrator          | H1, L2 | ND, RT |  **V**  | $(\vec\{\lambda}u,\vec\{v})$                   | $\vec\{\lambda}u$                    | 2D, 3D     |
| MixedScalarWeakCrossProductIntegrator | H1, L2 | ND, RT |  **V**  | $(\vec\{\lambda} u\,\hat\{z},\vec\{v})$        | $\vec\{\lambda}\times\,\hat\{z}\,u$  | 2D         |
| MixedScalarWeakGradientIntegrator     | H1, L2 | RT     |    S    | $(-\lambda u, \div\vec\{v})$                   | $\grad(\lambda u)$                   | 2D, 3D     |
| MixedDirectionalDerivativeIntegrator  | H1     | H1, L2 |  **V**  | $(\vec\{\lambda}\cdot\grad u, v)$              | $\vec\{\lambda}\cdot\grad u$         | 2D, 3D     |
| MixedScalarCrossGradIntegrator        | H1     | H1, L2 |  **V**  | $(\vec\{\lambda}\cross\grad u, v)$             | $\vec\{\lambda}\cross\grad u$        | 2D         |
| MixedScalarDerivativeIntegrator       | H1     | H1, L2 |    S    | $(\lambda \ddx\{u}, v)$                        | $\lambda\ddx\{u}\;$                  | 1D         |
| MixedGradGradIntegrator               | H1     | H1     | S, D, M | $(\lambda\grad u,\grad v)$                     | $-\div(\lambda\grad u)$              | 2D, 3D     |
| MixedCrossGradGradIntegrator          | H1     | H1     |  **V**  | $(\vec\{\lambda}\cross\grad u,\grad v)$        | $-\div(\vec\{\lambda}\cross\grad u)$ | 2D, 3D     |
| MixedVectorGradientIntegrator         | H1     | ND, RT | S, D, M | $(\lambda\grad u,\vec\{v})$                    | $\lambda\grad u$                     | 2D, 3D     |
| MixedCrossGradIntegrator              | H1     | ND, RT |  **V**  | $(\vec\{\lambda}\cross\grad u,\vec\{v})$       | $\vec\{\lambda}\cross\grad u$        | 3D         |
| MixedCrossGradCurlIntegrator          | H1     | ND     |  **V**  | $(\vec\{\lambda}\times\grad u, \curl\vec\{v})$ | $\curl(\vec\{\lambda}\times\grad u)$ | 3D         |
| MixedGradDivIntegrator                | H1     | RT     |  **V**  | $(\vec\{\lambda}\cdot\grad u, \div\vec\{v})$   | $-\grad(\vec\{\lambda}\cdot\grad u)$ | 2D, 3D     |

### Other Scalar Operators

| Class Name                |Domain  | Range  | Coef. | Dimension  | Operator                                        | Notes |
|---------------------------|--------|--------|-------|------------|-------------------------------------------------|-------|
| DerivativeIntegrator      | H1, L2 | H1, L2 |   S   | 1D, 2D, 3D | $(\lambda\frac\{\partial u}\{\partial x_i}, v)$ | The direction index "i" is passed by the user. See `MixedDirectionalDerivativeIntegrator` for a more general alternative. |
| ConvectionIntegrator      | H1     | H1     | **V** | 1D, 2D, 3D | $(\vec\{\lambda}\cdot\grad u, v)$               | This is designed to be used with `BilinearForm` to produce a square matrix. See `MixedDirectionalDerivativeIntegrator` for a rectangular version. |
| GroupConvectionIntegrator | H1     | H1     | **V** | 1D, 2D, 3D | $(\alpha\vec\{\lambda}\cdot\grad u, v)$         | Uses the "group" finite element formulation for advection due to [Fletcher](http://www.sciencedirect.com/science/article/pii/0045782583901226). |
| BoundaryMassIntegrator    | H1, L2 | H1, L2 |   S   | 1D, 2D, 3D | $(\lambda\,u,v)$                                | Computes a mass matrix on the exterior faces of a domain. See `MassIntegrator` above for a more general version. |

## Vector Finite Element Operators

These operators require vector-valued basis functions in the trial
space.  Many of these operators will work with either ND or RT basis
functions but others require one or the other.

### Square Operators

These integrators are designed to be used with the BilinearForm object
to assemble square linear operators.

| Class Name             | Spaces | Coef.   | Operator                               | Continuous Op.                | Dimension  |
|------------------------|--------|:-------:|----------------------------------------|-------------------------------|:----------:|
| VectorFEMassIntegrator | ND, RT | S, D, M | $(\lambda\vec\{u},\vec\{v})$           | $\lambda\vec\{u}$             | 2D, 3D     |
| CurlCurlIntegrator     | ND     |    S    | $(\lambda\curl\vec\{u},\curl\vec\{v})$ | $\curl(\lambda\curl\vec\{u})$ | 2D, 3D     |
| DivDivIntegrator       | RT     |    S    | $(\lambda\div\vec\{u},\div\vec\{v})$   | $-\grad(\lambda\div\vec\{u})$ | 2D, 3D     |

### Mixed Operators

These integrators are designed to be used with the MixedBilinearForm object to assemble square or rectangular linear operators.

| Class Name                           | Domain | Range  | Coef.   | Operator                                                 | Continuous Op.                                | Dimension  |
|--------------------------------------|--------|--------|:-------:|----------------------------------------------------------|-----------------------------------------------|:----------:|
| MixedDotProductIntegrator            | ND, RT | H1, L2 |  **V**  | $(\vec\{\lambda}\cdot\vec\{u},v)$                        | $\vec\{\lambda}\cdot\vec\{u}$                 | 2D, 3D     |
| MixedScalarCrossProductIntegrator    | ND, RT | H1, L2 |  **V**  | $(\vec\{\lambda}\cross\vec\{u},v)$                       | $\vec\{\lambda}\cross\vec\{u}$                | 2D         |
| MixedVectorWeakDivergenceIntegrator  | ND, RT | H1     | S, D, M | $(-\lambda\vec\{u},\grad v)$                             | $\div(\lambda\vec\{u})$                       | 2D, 3D     |
| MixedWeakDivCrossIntegrator          | ND, RT | H1     |  **V**  | $(-\vec\{\lambda}\cross\vec\{u},\grad v)$                | $\div(\vec\{\lambda}\cross\vec\{u})$          | 3D         |
| MixedVectorMassIntegrator            | ND, RT | ND, RT | S, D, M | $(\lambda\vec\{u},\vec\{v})$                             | $\lambda\vec\{u}$                             | 2D, 3D     |
| MixedCrossProductIntegrator          | ND, RT | ND, RT |  **V**  | $(\vec\{\lambda}\cross\vec\{u},\vec\{v})$                | $\vec\{\lambda}\cross\vec\{u}$                | 3D         |
| MixedVectorWeakCurlIntegrator        | ND, RT | ND     | S, D, M | $(\lambda\vec\{u},\curl\vec\{v})$                        | $\curl(\lambda\vec\{u})$                      | 3D         |
| MixedWeakCurlCrossIntegrator         | ND, RT | ND     |  **V**  | $(\vec\{\lambda}\cross\vec\{u},\curl\vec\{v})$           | $\curl(\vec\{\lambda}\cross\vec\{u})$         | 3D         |
| MixedScalarWeakCurlCrossIntegrator   | ND, RT | ND     |  **V**  | $(\vec\{\lambda}\cross\vec\{u},\curl\vec\{v})$           | $\curl(\vec\{\lambda}\cross\vec\{u})$         | 2D         |
| MixedWeakGradDotIntegrator           | ND, RT | RT     |  **V**  | $(-\vec\{\lambda}\cdot\vec\{u},\div\vec\{v})$            | $\grad(\vec\{\lambda}\cdot\vec\{u})$          | 2D, 3D     |
| MixedScalarCurlIntegrator            | ND     | H1, L2 |    S    | $(\lambda\curl\vec\{u},v)$                               | $\lambda\curl\vec\{u}\;$                      | 2D         |
| MixedCrossCurlGradIntegrator         | ND     | H1     |  **V**  | $(\vec\{\lambda}\cross\curl\vec\{u},\grad v)$            | $-\div(\vec\{\lambda}\cross\curl\vec\{u})$    | 3D         |
| MixedVectorCurlIntegrator            | ND     | ND, RT | S, D, M | $(\lambda\curl\vec\{u},\vec\{v})$                        | $\lambda\curl\vec\{u}$                        | 3D         |
| MixedCrossCurlIntegrator             | ND     | ND, RT |  **V**  | $(\vec\{\lambda}\cross\curl\vec\{u},\vec\{v})$           | $\vec\{\lambda}\cross\curl\vec\{u}$           | 3D         |
| MixedScalarCrossCurlIntegrator       | ND     | ND, RT |  **V**  | $(\vec\{\lambda}\cross\hat\{z}\,\curl\vec\{u},\vec\{v})$ | $\vec\{\lambda}\cross\hat\{z}\,\curl\vec\{u}$ | 2D         |
| MixedCurlCurlIntegrator              | ND     | ND     | S, D, M | $(\lambda\curl\vec\{u},\curl\vec\{v})$                   | $\curl(\lambda\curl\vec\{u})$                 | 3D         |
| MixedCrossCurlCurlIntegrator         | ND     | ND     |  **V**  | $(\vec\{\lambda}\cross\curl\vec\{u},\curl\vec\{v})$      | $\curl(\vec\{\lambda}\cross\curl\vec\{u})$    | 3D         |
| MixedScalarDivergenceIntegrator      | RT     | H1, L2 |    S    | $(\lambda\div\vec\{u}, v)$                               | $\lambda \div\vec\{u}$                        | 2D, 3D     |
| MixedDivGradIntegrator               | RT     | H1     |  **V**  | $(\vec\{\lambda}\div\vec\{u}, \grad v)$                  | $-\div(\vec\{\lambda}\div\vec\{u})$           | 2D, 3D     |
| MixedVectorDivergenceIntegrator      | RT     | ND, RT |  **V**  | $(\vec\{\lambda}\div\vec\{u}, \vec\{v})$                 | $\vec\{\lambda}\div\vec\{u}$                  | 2D, 3D     |

### Other Vector Finite Element Operators

| Class Name                       | Domain | Range  | Coef. | Operator                                                               | Dimension | Notes |
|----------------------------------|--------|--------|-------|------------------------------------------------------------------------|:---------:|-------|
| VectorFEDivergenceIntegrator     | RT     | H1, L2 |   S   | $(\lambda\div\vec\{u}, v)$                                             | 2D, 3D    | Alternate implementation of MixedScalarDivergenceIntegrator. |
| VectorFEWeakDivergenceIntegrator | ND     | H1     |   S   | $(-\lambda\vec\{u},\grad v)$                                           | 2D, 3D    | See MixedVectorWeakDivergenceIntegrator for a more general implementation. |
| VectorFECurlIntegrator           | ND, RT | ND, RT |   S   | $(\lambda\curl\vec\{u},\vec\{v})$ or $(\lambda\vec\{u},\curl\vec\{v})$ | 3D        | If the domain is ND then the Curl operator is returned, if the range is ND then the weak Curl is returned, otherwise a failure is encountered. See MixedVectorCurlIntegrator and MixedVectorWeakCurlIntegrator for more general implementations. |

## Vector Field Operators

These operators require vector-valued basis functions constructed by
using multiple copies of scalar fields.  In each of these integrators
the scalar basis function index increments most quickly followed by
the vector index.  This leads to local element matrix which have a
block structure.

### Square Operators

| Class Name | Spaces | Coef. | Dimension | Operator | Notes |
|---|---|:---:|:---:|---|---|
| VectorMassIntegrator                 | H1$^d$, L2$^d$ | S, D, M    | 1D, 2D, 3D | $(\lambda\vec\{u},\vec\{v})$ | |
| VectorCurlCurlIntegrator             | H1$^d$, L2$^d$ |    S       | 2D, 3D     | $(\lambda\curl\vec\{u},\curl\vec\{v})$ | |
| VectorDiffusionIntegrator            | H1$^d$, L2$^d$ |    S       | 1D, 2D, 3D | $(\lambda\grad u_i,\grad v_i)$ | Produces a block diagonal matrix where $i\in[0,dim)$ indicates the index of the block |
| ElasticityIntegrator                 | H1$^d$, L2$^d$ | $2\times$S | 1D, 2D, 3D | $(c_\{ikjl}\grad u_j,\grad v_i)$ | Takes two scalar coefficients $\lambda$ and $\mu$ and produces a $dim\times dim$ block structured matrix where $i$ and $j$ are indices in this matrix.  The coefficient is defined by $c_\{ikjl} = \lambda\delta_\{ik}\delta_\{jl}+\mu(\delta_\{ij}\delta_\{kl}+\delta_\{il}\delta_\{jk})$ |

### Mixed Operators

| Class Name                 | Domain           | Range   | Coef. | Dimension  | Operator                     |
|----------------------------|------------------|---------|:-----:|:----------:|------------------------------|
| VectorDivergenceIntegrator | H1$^d$, L2$^d$ | H1, L2 | S     | 1D, 2D, 3D | $(\lambda\div\vec\{u},v)$    |
| GradientIntegrator         | H1             | H1$^d$ | S     | 1D, 2D, 3D | $(\lambda\grad u, \vec\{v})$ |

## Discontinuous Galerkin Operators

| Class Name                | Domain | Range  | Operator | Notes |
|---------------------------|--------|--------|----------|-------|
| DGTraceIntegrator         | H1, L2 | H1, L2 | $\alpha \left<\rho_u(\vec\{u}\cdot\hat\{n}) \\\{v\\\},[w]\right> \\\\ + \beta \left<\rho_u \abs\{\vec\{u}\cdot\hat\{n}}[v],[w]\right>$ | |
| DGDiffusionIntegrator     | H1, L2 | H1, L2 | $-\left<\\\{Q\grad u\cdot\hat\{n}\\\},[v]\right> \\\\ + \sigma \left<[u],\\\{Q\grad v\cdot\hat\{n}\\\}\right> \\\\ + \kappa \left<\\\{h^\{-1}Q\\\}[u],[v]\right> $ | |
| DGElasticityIntegrator    | H1, L2 | H1, L2 | see $(\ref\{dg-elast})$ | |
| TraceJumpIntegrator       |        |        | $\left< v, [w] \right>$ | |
| NormalTraceJumpIntegrator |        |        | $\left< v, \left[\vec\{w}\cdot \vec\{n}\right] \right>$ | |

Integrator for the DG elasticity form, for the formulations see:

- PhD Thesis of Jonas De Basabe, High-Order Finite Element Methods for
  Seismic Wave Propagation, UT Austin, 2009, p. 23, and references therein
- Peter Hansbo and Mats G. Larson, Discontinuous Galerkin and the
  Crouzeix-Raviart Element: Application to Elasticity, PREPRINT 2000-09,
  p.3

$$
- \left< \\{ \tau(u) \\}, [v] \right> + \alpha \left< \\{ \tau(v) \\}, [u]
        \right> + \kappa \left< h^{-1} \\{ \lambda + 2 \mu \\} [u], [v] \right>
$$

where $ \left< u, v\right> = \int_\{F} u \cdot v $, and $ F $ is a
    face which is either a boundary face $ F_b $ of an element $ K $ or
    an interior face $ F_i $ separating elements $ K_1 $ and $ K_2 $.

In the bilinear form above $ \tau(u) $ is traction, and it's also
    $ \tau(u) = \sigma(u) \cdot \vec\{n} $, where $ \sigma(u) $ is
    stress, and $ \vec\{n} $ is the unit normal vector w.r.t. to $ F $.

In other words, we have
    $$\label\{dg-elast}
    - \left< \\{ \sigma(u) \cdot \vec\{n} \\}, [v] \right> + \alpha \left< \\{
        \sigma(v) \cdot \vec\{n} \\}, [u] \right> + \kappa \left< h^{-1} \\{
        \lambda + 2 \mu \\} [u], [v] \right>
    $$

For isotropic media
    $$
    \begin{split}
    \sigma(u) &= \lambda \nabla \cdot u I + 2 \mu \varepsilon(u) \\\\
              &= \lambda \nabla \cdot u I + 2 \mu \frac{1}{2} \left( \nabla u +
	         \nabla u^T \right) \\\\
              &= \lambda \nabla \cdot u I + \mu \left( \nabla u + \nabla u^T
	         \right)
    \end{split}
    $$

where $ I $ is identity matrix, $ \lambda $ and $ \mu $ are Lame
    coefficients (see ElasticityIntegrator), $ u, v $ are the trial and test
    functions, respectively.

The parameters $ \alpha $ and $ \kappa $ determine the DG method to
use (when this integrator is added to the "broken" ElasticityIntegrator):

- **IIPG**, $\alpha = 0$,
  C. Dawson, S. Sun, M. Wheeler, Compatible algorithms for coupled flow and
  transport, Comp. Meth. Appl. Mech. Eng., 193(23-26), 2565-2580, 2004.

- **SIPG**, $\alpha = -1$,
  M. Grote, A. Schneebeli, D. Schotzau, Discontinuous Galerkin Finite
  Element Method for the Wave Equation, SINUM, 44(6), 2408-2431, 2006.

- **NIPG**, $\alpha = 1$,
  B. Riviere, M. Wheeler, V. Girault, A Priori Error Estimates for Finite
  Element Methods Based on Discontinuous Approximation Spaces for Elliptic
  Problems, SINUM, 39(3), 902-931, 2001.

This is a 'Vector' integrator, i.e. defined for FE spaces using multiple
copies of a scalar FE space.

## Special Purpose Integrators

These "integrators" do not actually perform integrations they merely
alter the results of other integrators.  As such they provide a
convenient and easy way to reuse existing integrators in special
situations rather than needing to reimplement their functionality.

| Class Name          | Description                                                                                                            |
|---------------------|------------------------------------------------------------------------------------------------------------------------|
| TransposeIntegrator | Returns the transpose of the local matrix computed by another BilinearFormIntegrator                                   |
| LumpedIntegrator    | Returns a diagonal local matrix where each entry is the sum of the corresponding row of a local matrix computed by another BilinearFormIntegrator (only implemented for square matrices) |
| InverseIntegrator   | Returns the inverse of the local matrix computed by another BilinearFormIntegrator which produces a square local matrix |
| SumIntegrator       | Returns the sum of a series of integrators with compatible dimensions (only implemented for square matrices)           |

## Weak Operators and Their Boundary Integrals

Weak operators use integration by parts to move a spatial derivative
onto the test function.  This results in an implied boundary integral
that is often assumed to be zero but can be used to apply an
non-homogeneous Neumann boundary condition.

### Operator with Scalar Range

The following weak operators require the range (or test) space to be
$H_1$ i.e. a scalar basis function with a gradient operator.  The implied
natural boundary condition when using these operators is for the
continuous boundary operator (shown in the last column) to be equal to
zero.  On the other hand an inhomogeneous Neumann boundary condition
can be applied by using a linear form boundary integrator to compute
this boundary term for a known function e.g. when using the
`DiffusionIntegrator` one could provide a known function for
$\lambda\,\grad u$ to the `BoundaryNormalLFIntegrator` which would
then integrate the normal component of this function over the boundary
of the domain.  See [Linear Form Integrators](lininteg.md) for more
information.

| Class Name                          | Operator                                      | Continuous Op.                             | Continuous Boundary Op.                            |
|-------------------------------------|-----------------------------------------------|--------------------------------------------|----------------------------------------------------|
| DiffusionIntegrator                 | $(\lambda\grad u, \grad v)$                   | $-\div(\lambda\grad u)$                    | $\lambda\,\hat\{n}\cdot\grad u$                    |
| MixedGradGradIntegrator             | $(\lambda\grad u, \grad v)$                   | $-\div(\lambda\grad u)$                    | $\lambda\,\hat\{n}\cdot\grad u$                    |
| MixedCrossGradGradIntegrator        | $(\vec\{\lambda}\cross\grad u,\grad v)$       | $-\div(\vec\{\lambda}\cross\grad u)$       | $\hat\{n}\cdot(\vec\{\lambda}\times\grad u)$       |
| MixedScalarWeakDivergenceIntegrator | $(-\vec\{\lambda}u,\grad v)$                  | $\div(\vec\{\lambda}u)$                    | $-\hat\{n}\cdot\vec\{\lambda}\,u$                  |
| MixedScalarWeakDerivativeIntegrator | $(-\lambda u, \ddx\{v})$                      | $\ddx\{}(\lambda u)\;$                     | $-\hat\{n}\cdot\hat\{x}\,\lambda\,u$               |
| MixedVectorWeakDivergenceIntegrator | $(-\lambda\vec\{u},\grad v)$                  | $\div(\lambda\vec\{u})$                    | $-\hat\{n}\cdot(\lambda\,\vec\{u})$                |
| MixedWeakDivCrossIntegrator         | $(-\vec\{\lambda}\cross\vec\{u},\grad v)$     | $\div(\vec\{\lambda}\cross\vec\{u})$       | $-\hat\{n}\cdot(\vec\{\lambda}\times\vec\{u})$     |
| MixedCrossCurlGradIntegrator        | $(\vec\{\lambda}\cross\curl\vec\{u},\grad v)$ | $-\div(\vec\{\lambda}\cross\curl\vec\{u})$ | $\hat\{n}\cdot(\vec\{\lambda}\cross\curl\vec\{u})$ |
| MixedDivGradIntegrator              | $(\vec\{\lambda}\div\vec\{u}, \grad v)$       | $-\div(\vec\{\lambda}\div\vec\{u})$        | $\hat\{n}\cdot(\vec\{\lambda}\div\vec\{u})$        |

### Operator with Vector Range

The following weak operators require the range (or test) space to be
H(Curl) i.e. a vector basis function with a curl operator.  The
implied natural boundary condition when using these operators is for
the continuous boundary operator (shown in the last column) to be
equal to zero.  On the other hand an non-homogeneous Neumann boundary
condition can be applied by using a linear form boundary integrator to
compute this boundary term for a known function e.g. when using the
`CurlCurlIntegrator` one could provide a known function for
$\lambda\,\curl\vec\{u}$ to the `VectorFEBoundaryTangentLFIntegrator`
which would then integrate the product of the tangential portion of
this function with that of the ND basis function over the boundary of
the domain.  See [Linear Form Integrators](lininteg.md) for more
information.

| Class Name                          | Operator                                            | Continuous Op.                             | Continuous Boundary Op.                             |
|-------------------------------------|-----------------------------------------------------|--------------------------------------------|-----------------------------------------------------|
| CurlCurlIntegrator                  | $(\lambda\curl\vec\{u},\curl\vec\{v})$              | $\curl(\lambda\curl\vec\{u})$              | $\lambda\,\hat\{n}\times\curl\vec\{u}$              |
| MixedCurlCurlIntegrator             | $(\lambda\curl\vec\{u},\curl\vec\{v})$              | $\curl(\lambda\curl\vec\{u})$              | $\lambda\,\hat\{n}\times\curl\vec\{u}$              |
| MixedCrossCurlCurlIntegrator        | $(\vec\{\lambda}\cross\curl\vec\{u},\curl\vec\{v})$ | $\curl(\vec\{\lambda}\cross\curl\vec\{u})$ | $\hat\{n}\times(\vec\{\lambda}\cross\curl\vec\{u})$ |
| MixedCrossGradCurlIntegrator        | $(\vec\{\lambda}\cross\grad u,\curl\vec\{v})$       | $\curl(\vec\{\lambda}\cross\grad u)$       | $\hat\{n}\times(\vec\{\lambda}\cross\grad u)$       |
| MixedVectorWeakCurlIntegrator       | $(\lambda\vec\{u},\curl\vec\{v})$                   | $\curl(\lambda\vec\{u})$                   | $\lambda\,\hat\{n}\times\vec\{u}$                   |
| MixedScalarWeakCurlIntegrator       | $(\lambda u,\curl\vec\{v})$                         | $\curl(\lambda\,u\,\hat\{z})\;$            | $\lambda\,u\,\hat\{n}\times\hat\{z}$                |
| MixedWeakCurlCrossIntegrator        | $(\vec\{\lambda}\cross\vec\{u},\curl\vec\{v})$      | $\curl(\vec\{\lambda}\cross\vec\{u})$      | $\hat\{n}\times(\vec\{\lambda}\cross\vec\{u})$      |
| MixedScalarWeakCurlCrossIntegrator  | $(\vec\{\lambda}\cross\vec\{u},\curl\vec\{v})$      | $\curl(\vec\{\lambda}\cross\vec\{u})$      | $\hat\{n}\times(\vec\{\lambda}\cross\vec\{u})$      |

The following weak operators require the range (or test) space to be
H(Div) i.e. a vector basis function with a divergence operator.  The
implied natural boundary condition when using these operators is for
the continuous boundary operator (shown in the last column) to be
equal to zero.  On the other hand an non-homogeneous Neumann boundary
condition can be applied by using a linear form boundary integrator to
compute this boundary term for a known function e.g. when using the
`DivDivIntegrator` one could provide a known function for
$\lambda\,\div\vec\{u}$ to the `VectorFEBoundaryFluxLFIntegrator`
which would then integrate the product of this function with the
normal component of the RT basis function over the boundary of the
domain.  See [Linear Form Integrators](lininteg.md) for more
information.

| Class Name                          | Operator                                            | Continuous Op.                       | Continuous Boundary Op.                  |
|-------------------------------------|-----------------------------------------------------|--------------------------------------|------------------------------------------|
| DivDivIntegrator                    | $(\lambda\div\vec\{u},\div\vec\{v})$                | $-\grad(\lambda\div\vec\{u})$        | $\lambda\div\vec\{u}\,\hat\{n}$          |
| MixedGradDivIntegrator              | $(\vec\{\lambda}\cdot\grad u, \div\vec\{v})$        | $-\grad(\vec\{\lambda}\cdot\grad u)$ | $\vec\{\lambda}\cdot\grad u\,\hat\{n}$   |
| MixedScalarWeakGradientIntegrator   | $(-\lambda u, \div\vec\{v})$                        | $\grad(\lambda u)$                   | $-\lambda u\,\hat\{n}$                   |
| MixedWeakGradDotIntegrator          | $(-\vec\{\lambda}\cdot\vec\{u},\div\vec\{v})$       | $\grad(\vec\{\lambda}\cdot\vec\{u})$ | $-\vec\{\lambda}\cdot\vec\{u}\,\hat\{n}$ |

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
