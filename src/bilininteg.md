# Bilinear Integrators

$\newcommand{\cross}{\times}
\newcommand{\inner}{\cdot}
\newcommand{\div}{\nabla\cdot}
\newcommand{\curl}{\nabla\times}
\newcommand{\grad}{\nabla}
\newcommand{\ddx}[1]{\frac\{d#1}\{dx}}
$

Explain the purpose of Bilinear Integrators...

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
$$\\{a(\lambda u, v)\\}\_{ij}\equiv \int_\Omega \lambda u_j v_i$$
$$\\{a(\lambda\vec\{u}, \vec\{v})\\}\_{ij}\equiv \int_\Omega \lambda \vec\{u}_j\cdot\vec\{v}_i$$

## Scalar Field Operators

### Square Operators

| Class Name          | Spaces | Coef.| Operator                     | Continuous Op.          | Dimension  |
|---------------------|--------|:----:|------------------------------|-------------------------|:----------:|
| MassIntegrator      | H1, L2 | S    | $a(\lambda u, v)$            | $\lambda u$             | 1D, 2D, 3D |
| DiffusionIntegrator | H1     | S, M | $a(\lambda\grad u, \grad v)$ | $-\div(\lambda\grad u)$ | 1D, 2D, 3D |

### Mixed Operators

| Class Name                           | Domain | Range  | Coef.   | Operator                                      | Continuous Op.                       | Dimension  |
|--------------------------------------|--------|--------|:-------:|-----------------------------------------------|--------------------------------------|:----------:|
| MixedScalarMassIntegrator            | H1, L2 | H1, L2 |    S    | $a(\lambda u, v)$                             | $\lambda u$                          | 1D, 2D, 3D |
| MixedVectorGradientIntegrator        | H1     | ND, RT | S, D, M | $a(\lambda\grad u,\vec\{v})$                  | $\lambda\grad u$                     | 2D, 3D     |
| MixedScalarWeakGradientIntegrator    | H1, L2 | RT     |    S    | $a(-\lambda u, \div\vec\{v})$                 | $\grad(\lambda u)$                   | 2D, 3D     |
| MixedScalarVectorIntegrator          | H1, L2 | ND, RT |  **V**  | $a(\vec\{\lambda}u,\vec\{v})$                 | $\vec\{\lambda}u$                    | 2D, 3D     |
| MixedDirectionalDerivativeIntegrator | H1     | H1, L2 |  **V**  | $a(\vec\{\lambda}\cdot\grad u, v)$            | $\vec\{\lambda}\cdot\grad u$         | 2D, 3D     |
| MixedGradDivIntegrator               | H1     | RT     |  **V**  | $a(\vec\{\lambda}\cdot\grad u, \div\vec\{v})$ | $-\grad(\vec\{\lambda}\cdot\grad u)$ | 2D, 3D     |
| MixedScalarWeakDivergenceIntegrator  | H1, L2 | H1     |  **V**  | $a(-\vec\{\lambda}u,\grad v)$                 | $\div(\vec\{\lambda}u)$              | 2D, 3D     |
| MixedScalarWeakCurlIntegrator        | H1, L2 | ND     |    S    | $a(\lambda u,\curl\vec\{v})$                  | $\curl(\lambda\,u\,\hat\{z})\;$      | 2D         |
| MixedScalarDerivativeIntegrator      | H1     | H1, L2 |    S    | $a(\lambda \ddx\{u}, v)$                      | $\lambda\ddx\{u}\;$                  | 1D         |
| MixedScalarWeakDerivativeIntegrator  | H1, L2 | H1     |    S    | $a(-\lambda u, \ddx\{v})$                     | $\ddx\{}(\lambda u)\;$               | 1D         |

## Vector Field Operators

### Square Operators
| Class Name             | Spaces | Coef.   | Operator                                | Continuous Op.                | Dimension  |
|------------------------|--------|:-------:|-----------------------------------------|-------------------------------|:----------:|
| VectorFEMassIntegrator | ND, RT | S, D, M | $a(\lambda\vec\{u},\vec\{v})$           | $\lambda\vec\{u}$             | 2D, 3D     |
| CurlCurlIntegrator     | ND     |    S    | $a(\lambda\curl\vec\{u},\curl\vec\{v})$ | $\curl(\lambda\curl\vec\{u})$ | 2D, 3D     |
| DivDivIntegrator       | RT     |    S    | $a(\lambda\div\vec\{u},\div\vec\{v})$   | $-\grad(\lambda\div\vec\{u})$ | 2D, 3D     |

### Mixed Operators

| Class Name                           | Domain | Range  | Coef.   | Operator                                             | Continuous Op.                             | Dimension  |
|--------------------------------------|--------|--------|:-------:|------------------------------------------------------|--------------------------------------------|:----------:|
| MixedVectorMassIntegrator            | ND, RT | ND, RT | S, D, M | $a(\lambda\vec\{u},\vec\{v})$                        | $\lambda\vec\{u}$                          | 2D, 3D     |
| MixedScalarDivergenceIntegrator      | RT     | H1, L2 |    S    | $a(\lambda\div\vec\{u}, v)$                          | $\lambda \div\vec\{u}$                     | 2D, 3D     |
| MixedVectorWeakDivergenceIntegrator  | ND, RT | H1     | S, D, M | $a(-\lambda\vec\{u},\grad v)$                        | $\div(\lambda\vec\{u})$                    | 2D, 3D     |
| MixedVectorCurlIntegrator            | ND     | ND, RT | S, D, M | $a(\lambda\curl\vec\{u},\vec\{v})$                   | $\lambda\curl\vec\{u}$                     | 3D         |
| MixedVectorWeakCurlIntegrator        | ND, RT | ND     | S, D, M | $a(\lambda\vec\{u},\curl\vec\{v})$                   | $\curl(\lambda\vec\{u})$                   | 3D         |
| MixedDotProductIntegrator            | ND, RT | H1, L2 |  **V**  | $a(\vec\{\lambda}\cdot\vec\{u},v)$                   | $\vec\{\lambda}\cdot\vec\{u}$              | 2D, 3D     |
| MixedDotDivIntegrator                | ND, RT | RT     |  **V**  | $a(\vec\{\lambda}\cdot\vec\{u},\div\vec\{v})$        | $-\grad(\vec\{\lambda}\cdot\vec\{u})$      | 2D, 3D     |
| MixedCrossProductIntegrator          | ND, RT | ND, RT |  **V**  | $a(\vec\{\lambda}\cross\vec\{u},\vec\{v})$           | $\vec\{\lambda}\cross\vec\{u}$             | 3D         |
| MixedWeakDivCrossIntegrator          | ND, RT | H1     |  **V**  | $a(-\vec\{\lambda}\cross\vec\{u},\grad v)$           | $\div(\vec\{\lambda}\cross\vec\{u})$       | 3D         |
| MixedWeakCurlCrossIntegrator         | ND, RT | ND     |  **V**  | $a(\vec\{\lambda}\cross\vec\{u},\curl\vec\{v})$      | $\curl(\vec\{\lambda}\cross\vec\{u})$      | 3D         |
| MixedCrossCurlIntegrator             | ND     | ND, RT |  **V**  | $a(\vec\{\lambda}\cross\curl\vec\{u},\vec\{v})$      | $\vec\{\lambda}\cross\curl\vec\{u}$        | 3D         |
| MixedCrossCurlCurlIntegrator         | ND     | ND     |  **V**  | $a(\vec\{\lambda}\cross\curl\vec\{u},\curl\vec\{v})$ | $\curl(\vec\{\lambda}\cross\curl\vec\{u})$ | 3D         |
| MixedCrossCurlGradIntegrator         | ND     | H1     |  **V**  | $a(\vec\{\lambda}\cross\curl\vec\{u},\grad v)$       | $-\div(\vec\{\lambda}\cross\curl\vec\{u})$ | 3D         |
| `None Yet`                           | ND, RT | H1, L2 |  **V**  | $a(\vec\{\lambda}\cross\vec\{u},v)$                  | $\vec\{\lambda}\cross\vec\{u}$             | 2D         |
| `None Yet`                           | ND, RT | ND     |  **V**  | $a(\vec\{\lambda}\cross\vec\{u},\curl\vec\{v})$      | $\curl(\vec\{\lambda}\cross\vec\{u})$      | 2D         |
| MixedScalarCurlIntegrator            | ND     | H1, L2 |    S    | $a(\lambda\curl\vec\{u},v)$                          | $\lambda\curl\vec\{u}\;$                   | 2D         |


| Class Name | Operator | Continuous Op. |
|---|---|---|:---:|
| VectorMassIntegrator                 | BilinearFormIntegrator |  |
| VectorFEDivergenceIntegrator         | BilinearFormIntegrator |  |
| VectorFEWeakDivergenceIntegrator     | BilinearFormIntegrator |  |
| VectorFECurlIntegrator               | BilinearFormIntegrator |  |
| DerivativeIntegrator                 | BilinearFormIntegrator |  |
| VectorCurlCurlIntegrator             | BilinearFormIntegrator |  |
| VectorDivergenceIntegrator           | BilinearFormIntegrator |  |
| VectorDiffusionIntegrator            | BilinearFormIntegrator |  |
| DGTraceIntegrator                    | BilinearFormIntegrator |  |
| DGDiffusionIntegrator                | BilinearFormIntegrator |  |
| DGElasticityIntegrator               | BilinearFormIntegrator |  |
| TraceJumpIntegrator                  | BilinearFormIntegrator |  |
| NormalTraceJumpIntegrator            | BilinearFormIntegrator |  |

## Special Purpose Integrators

| Class Name | Operator | Continuous Op. |
|---|---|---|
| BilinearFormIntegrator | NonlinearFormIntegrator |
| TransposeIntegrator | BilinearFormIntegrator |
| LumpedIntegrator | BilinearFormIntegrator |
| InverseIntegrator | BilinearFormIntegrator |
| SumIntegrator | BilinearFormIntegrator |
| BoundaryMassIntegrator               | ?? | ?? |
| ConvectionIntegrator                 | $a(\vec\{\lambda}\cdot\grad u, v)$ | $\vec\{\lambda}\cdot\grad u$   |
| GroupConvectionIntegrator            | BilinearFormIntegrator |  |
| ElasticityIntegrator | BilinearFormIntegrator |


| Domain Space | Range Space | Operator | Class Name|
|:---|:---|:---|:---|
|Scalar| Scalar | $a(\lambda u,v)$| MassIntegrator |
|Scalar| Scalar | $a(\lambda\grad u,\grad v)$| DiffusionIntegrator |



<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
