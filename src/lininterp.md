# Linear Interpolators

$
\newcommand{\cross}{\times}
\newcommand{\inner}{\cdot}
\newcommand{\div}{\nabla\cdot}
\newcommand{\curl}{\nabla\times}
\newcommand{\grad}{\nabla}
\newcommand{\ddx}[1]{\frac\{d#1}\{dx}}
\newcommand{\abs}[1]{|#1|}
$

Linear interpolators are very useful...

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

### Derivative Interpolators

| Class Name             | Domain | Range | Operator        |
|------------------------|--------|-------|-----------------|
| GradientInterpolator   |   H1   |  ND   | $\grad u$       |
| CurlInterpolator       |   ND   |  RT   | $\curl\vec\{u}$ |
| DivergenceInterpolator |   RT   |  L2   | $\div\vec\{u}$  |

### Product Interpolators

| Class Name                      | Domain | Range | Coef. | Operator          |
|---------------------------------|--------|-------|:-----:|-------------------|
| ScalarProductInterpolator       | H1,L2  | H1,L2 |   S   | $\lambda u$       |
| ScalarVectorProductInterpolator | ND,RT  | ND,RT |   S   | $\lambda\vec\{u}$ |
| VectorScalarProductInterpolator | H1,L2  | ND,RT |   V   | $\vec\{\lambda}u$ |
| VectorCrossProductInterpolator  | ND,RT  | ND,RT |   V   | $\vec\{\lambda}\times\vec\{u}$ |
| VectorInnerProductInterpolator  | ND,RT  | H1,L2 |   V   | $\vec\{\lambda}\cdot\vec\{u}$ |

### Special Purpose Interpolators

| Class Name           | Domain | Range | Operator                |
|----------------------|--------|-------|-------------------------|
| IdentityInterpolator | H1,L2  | H1,L2 | $u$                     |
| NormalInterpolator   | H1$^d$ | RT    | $\hat\{n}\cdot\vec\{u}$ |

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
