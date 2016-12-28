# Bilinear Form Integrators

$
\newcommand{\cross}{\times}
\newcommand{\inner}{\cdot}
\newcommand{\div}{\nabla\cdot}
\newcommand{\curl}{\nabla\times}
\newcommand{\grad}{\nabla}
\newcommand{\ddx}[1]{\frac\{d#1}\{dx}}
$

Bilinear form integrators are at the heart of any finite element method,
they are used to compute the integrals of products of basis functions
over individual mesh elements (or sometimes over edges or faces).
Typically each element is contained in the support of several basis
functions of both the domain and range spaces therefore bilinear
integrators simultaneously compute the integrals of all combinations
of the relevant basis functions from the domain and range spaces.
This produces a two dimensional array of results that are arranged
into a small dense matrix of integral values called a *local element matrix*.

To put this another way, the `BilinearForm` class builds a global,
sparse, finite element matrix, `glb_mat`, by performing the outer loop
in the following pseudocode snippet whereas the
`BilinearFormIntegrator` class performs the nested inner loops to
compute the dense local element matrix, `loc_mat`.

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

There are three types of integrals that typically arise although many
other, more exotic, forms are possible:

+ Integrals involving Scalar basis functions $\int_\Omega \lambda u v$
+ Integrals involving Vector basis functions $\int_\Omega \lambda \vec\{u}\cdot\vec\{v}$
+ Integrals involving Scalar and Vector basis functions $\int_\Omega u\,\vec\{\lambda}\cdot\vec\{v}$

The `BilinearFormIntegrator` classes allow MFEM to produce a wide
variety of local element matrices without modifying the
`BilinearForm` class.  Many of the possible operators are collected
below into tables that briefly describe their action and requirements.

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

Notation: The integrals performed by the various integrators listed
below are shown using inner product notation, $(\cdot,\cdot)$, defined
as follows.

$$(\lambda u, v)\equiv \int_\Omega \lambda u v$$
$$(\lambda\vec\{u}, \vec\{v})\equiv \int_\Omega\lambda\vec\{u}\cdot\vec\{v}$$

Where $u$ or $\vec\{u}$ is a function in the domain (or trial) space and $v$
or $\vec\{v}$ is in the range (or test) space.

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

## Vector Finite Element Operators

These operators require vector-valued basis functions in the trial
space.  Many of these operators will work with either ND or RT basis
fucntions but others require one or the other.

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


| Class Name | Domain | Range  | Coef.   | Operator | Dimension | Notes |
|---|---|---|---|---|:---:|---|
| VectorFEDivergenceIntegrator         | RT     | H1, L2 | S | $(\lambda\div\vec\{u}, v)$                                             | 2D, 3D | Alternate implementation of MixedScalarDivergenceIntegrator. |
| VectorFEWeakDivergenceIntegrator     | ND     | H1     | S | $(-\lambda\vec\{u},\grad v)$                                           | 2D, 3D | See MixedVectorWeakDivergenceIntegrator for a more general implementation. |
| VectorFECurlIntegrator               | ND, RT | ND, RT | S | $(\lambda\curl\vec\{u},\vec\{v})$ or $(\lambda\vec\{u},\curl\vec\{v})$ | 3D     | If the domain is ND then the Curl operator is returned, if the range is ND then the weak Curl is returned, otherwise a failure is encountered. See MixedVectorCurlIntegrator and MixedVectorWeakCurlIntegrator for more general implementations. |

## Vector Field Operators

These operators require vector-valued basis functions constructed by using multiple copies of scalar fields.

### Square Operators

| Class Name | Spaces | Coef. | Dimension | Operator | Notes |
|---|---|:---:|:---:|---|---|
| VectorMassIntegrator                 | $H_1^d$, $L_2^d$ | S, D, M | 1D, 2D, 3D | $(\lambda\vec\{u},\vec\{v})$ | |
| VectorCurlCurlIntegrator             | $H_1^d$, $L_2^d$ |    S    | 2D, 3D     | $(\lambda\curl\vec\{u},\curl\vec\{v})$ | |
| VectorDiffusionIntegrator            | $H_1^d$, $L_2^d$ |    S    | 1D, 2D, 3D | $(\lambda_\{ijkl}\frac\{\partial u_i}\{\partial x_j},\frac\{\partial v_k}\{\partial x_l})$ | Where $\lambda_\{ijkl}=\lambda\delta_\{ik}\delta_\{jl}$ |

### Mixed Operators

| Class Name | Domain | Range | Coef. | Dimension | Operator |
|---|---|---|:---:|:---:|---|
| VectorDivergenceIntegrator           | $H_1^d$, $L_2^d$ | H1, L2 |    S    | 1D, 2D, 3D | $(\lambda\div\vec\{u},v)$ |

## Others...
|   |   |   |
|---|---|---|
| DGTraceIntegrator                    | BilinearFormIntegrator |  |
| DGDiffusionIntegrator                | BilinearFormIntegrator |  |
| DGElasticityIntegrator               | BilinearFormIntegrator |  |
| TraceJumpIntegrator                  | BilinearFormIntegrator |  |
| NormalTraceJumpIntegrator            | BilinearFormIntegrator |  |

## Special Purpose Integrators

| Class Name |Domain | Range | Coef. | Dimensoin | Operator | Continuous Op. |
|---|---|---|---|---|---|---|
| DerivativeIntegrator                 | H1, L2 | H1, L2 | S | 1D, 2D, 3D | $(\lambda\frac\{\partial u}\{\partial x_i}, v)$ | The direction index "i" is passed by the user. See MixedDirectionalDerivativeIntegrator for a more general alternative. |
| BilinearFormIntegrator | NonlinearFormIntegrator |
| TransposeIntegrator | BilinearFormIntegrator |
| LumpedIntegrator | BilinearFormIntegrator |
| InverseIntegrator | BilinearFormIntegrator |
| SumIntegrator | BilinearFormIntegrator |
| BoundaryMassIntegrator               | ?? | ?? |
| ConvectionIntegrator                 | $(\vec\{\lambda}\cdot\grad u, v)$ | $\vec\{\lambda}\cdot\grad u$   |
| GroupConvectionIntegrator            | BilinearFormIntegrator |  |
| ElasticityIntegrator | BilinearFormIntegrator |

## Weak Operators

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

| Class Name                          | Operator                                      | Continuous Op.                             | Continuous Boundary Op.                            | UT |
|-------------------------------------|-----------------------------------------------|--------------------------------------------|----------------------------------------------------|----|
| DiffusionIntegrator                 | $(\lambda\grad u, \grad v)$                   | $-\div(\lambda\grad u)$                    | $\lambda\,\hat\{n}\cdot\grad u$                    | X  |
| MixedGradGradIntegrator             | $(\lambda\grad u, \grad v)$                   | $-\div(\lambda\grad u)$                    | $\lambda\,\hat\{n}\cdot\grad u$                    | X  |
| MixedCrossGradGradIntegrator        | $(\vec\{\lambda}\cross\grad u,\grad v)$       | $-\div(\vec\{\lambda}\cross\grad u)$       | $\hat\{n}\cdot(\vec\{\lambda}\times\grad u)$       | X  |
| MixedScalarWeakDivergenceIntegrator | $(-\vec\{\lambda}u,\grad v)$                  | $\div(\vec\{\lambda}u)$                    | $-\hat\{n}\cdot\vec\{\lambda}\,u$                  | X  |
| MixedScalarWeakDerivativeIntegrator | $(-\lambda u, \ddx\{v})$                      | $\ddx\{}(\lambda u)\;$                     | $-\hat\{n}\cdot\hat\{x}\,\lambda\,u$               |   |
| MixedVectorWeakDivergenceIntegrator | $(-\lambda\vec\{u},\grad v)$                  | $\div(\lambda\vec\{u})$                    | $-\hat\{n}\cdot(\lambda\,\vec\{u})$                | X  |
| MixedWeakDivCrossIntegrator         | $(-\vec\{\lambda}\cross\vec\{u},\grad v)$     | $\div(\vec\{\lambda}\cross\vec\{u})$       | $-\hat\{n}\cdot(\vec\{\lambda}\times\vec\{u})$     |   |
| MixedCrossCurlGradIntegrator        | $(\vec\{\lambda}\cross\curl\vec\{u},\grad v)$ | $-\div(\vec\{\lambda}\cross\curl\vec\{u})$ | $\hat\{n}\cdot(\vec\{\lambda}\cross\curl\vec\{u})$ | X  |
| MixedDivGradIntegrator              | $(\vec\{\lambda}\div\vec\{u}, \grad v)$       | $-\div(\vec\{\lambda}\div\vec\{u})$        | $\hat\{n}\cdot(\vec\{\lambda}\div\vec\{u})$        | X  |

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

| Class Name                          | Operator                                            | Continuous Op.                             | Continuous Boundary Op.                             | UT |
|-------------------------------------|-----------------------------------------------------|--------------------------------------------|-----------------------------------------------------|----|
| CurlCurlIntegrator                  | $(\lambda\curl\vec\{u},\curl\vec\{v})$              | $\curl(\lambda\curl\vec\{u})$              | $\lambda\,\hat\{n}\times\curl\vec\{u}$              | X  |
| MixedCurlCurlIntegrator             | $(\lambda\curl\vec\{u},\curl\vec\{v})$              | $\curl(\lambda\curl\vec\{u})$              | $\lambda\,\hat\{n}\times\curl\vec\{u}$              | X  |
| MixedCrossCurlCurlIntegrator        | $(\vec\{\lambda}\cross\curl\vec\{u},\curl\vec\{v})$ | $\curl(\vec\{\lambda}\cross\curl\vec\{u})$ | $\hat\{n}\times(\vec\{\lambda}\cross\curl\vec\{u})$ | X  |
| MixedCrossGradCurlIntegrator        | $(\vec\{\lambda}\cross\grad u,\curl\vec\{v})$       | $\curl(\vec\{\lambda}\cross\grad u)$       | $\hat\{n}\times(\vec\{\lambda}\cross\grad u)$       | X  |
| MixedVectorWeakCurlIntegrator       | $(\lambda\vec\{u},\curl\vec\{v})$                   | $\curl(\lambda\vec\{u})$                   | $\lambda\,\hat\{n}\times\vec\{u}$                   | X  |
| MixedScalarWeakCurlIntegrator       | $(\lambda u,\curl\vec\{v})$                         | $\curl(\lambda\,u\,\hat\{z})\;$            | $\lambda\,u\,\hat\{n}\times\hat\{z}$                |   |
| MixedWeakCurlCrossIntegrator        | $(\vec\{\lambda}\cross\vec\{u},\curl\vec\{v})$      | $\curl(\vec\{\lambda}\cross\vec\{u})$      | $\hat\{n}\times(\vec\{\lambda}\cross\vec\{u})$      | X  |
| MixedScalarWeakCurlCrossIntegrator  | $(\vec\{\lambda}\cross\vec\{u},\curl\vec\{v})$      | $\curl(\vec\{\lambda}\cross\vec\{u})$      | $\hat\{n}\times(\vec\{\lambda}\cross\vec\{u})$      |   |

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

| Class Name                          | Operator                                            | Continuous Op.                       | Continuous Boundary Op.                  | UT |
|-------------------------------------|-----------------------------------------------------|--------------------------------------|------------------------------------------|----|
| DivDivIntegrator                    | $(\lambda\div\vec\{u},\div\vec\{v})$                | $-\grad(\lambda\div\vec\{u})$        | $\lambda\div\vec\{u}\,\hat\{n}$          | X  |
| MixedGradDivIntegrator              | $(\vec\{\lambda}\cdot\grad u, \div\vec\{v})$        | $-\grad(\vec\{\lambda}\cdot\grad u)$ | $\vec\{\lambda}\cdot\grad u\,\hat\{n}$   | X  |
| MixedScalarWeakGradientIntegrator   | $(-\lambda u, \div\vec\{v})$                        | $\grad(\lambda u)$                   | $-\lambda u\,\hat\{n}$                   | X  |
| MixedWeakGradDotIntegrator          | $(-\vec\{\lambda}\cdot\vec\{u},\div\vec\{v})$       | $\grad(\vec\{\lambda}\cdot\vec\{u})$ | $-\vec\{\lambda}\cdot\vec\{u}\,\hat\{n}$ | X  |

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
