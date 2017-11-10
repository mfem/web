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

Linear interpolators can be very useful for interpolating one discrete
representation of a field onto another set of basis functions to
produce another representation.  However, this must be done with care
because different discrete representations are not completely
interchangeable.

As an example consider a scalar field projected onto either piece-wise
linear ($H_1$) or piece-wise constant ($L_2$) basis functions.
Interpolating from an $H_1$ representation to an $L_2$ representation
should produce a reasonable result because the constant value needed
in each element can be computed as a weighted sum of the $H_1$ basis
functions in that element.  On the other hand, if we try to
interpolate from the $L_2$ representation to an $H_1$ representation
we don't have enough information to determine reasonable values for
the degrees of freedom which are shared between neighboring elements
because linear interpolators can only access one element at a time.
To accurately compute an $H_1$ representation from an $L_2$
representation requires the type of weighted average of values from
neighboring elements that bilinear forms provide but this requires a
linear solve and often suitable boundary conditions.

The operators produced by the `BilinearForm` classes involve
integrations and therefore they sum the various contributions from
neighboring elements to compute a full integral.  The
`DiscreteLinearOperator` classes are not performing integrals but
rather interpolations and as such they do not combine contributions
from different elements in any way.  Consequently if the
`LinearInterpolator`s produce different results for entities that are
shared between neighboring elements then the resulting representation
will depend on the order in which the elements are processed.  Such
operators are not good candidates for `DiscreteLinearOperator`s.  The
sections below will offer some guidance on the appropriate use of these
operators.

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

The $H(Curl)$ and $H(Div)$ spaces are specifically designed to support
these derivative operators by having the necessary inter-element
continuity.  Other possible derivative operators would not possess the
correct continuity and must therefore be implemented in a weak sense.

| Class Name             | Domain | Range | Operator        |
|------------------------|--------|-------|-----------------|
| GradientInterpolator   |   H1   |  ND   | $\grad u$       |
| CurlInterpolator       |   ND   |  RT   | $\curl\vec\{u}$ |
| DivergenceInterpolator |   RT   |  L2   | $\div\vec\{u}$  |

### Product Interpolators

These operators require a bit more care than the previous set.  In
order for these operators to produce valid results the product of the
coefficient with the domain space must be uniquely representable
within the desired range space.  Additionally, it may sometimes be
desirable for the range space to have a higher order than the domain
space if the coefficient is not constant.  For example if the domain
space and the coefficient are both linear it might be desirable,
though not necessary, for the range space to be quadratic.

| Class Name                      | Domain | Range | Coef. | Operator          |
|---------------------------------|--------|-------|:-----:|-------------------|
| ScalarProductInterpolator       | H1,L2  | H1,L2 |   S   | $\lambda u$       |
| ScalarVectorProductInterpolator | ND,RT  | ND,RT |   S   | $\lambda\vec\{u}$ |
| VectorScalarProductInterpolator | H1,L2  | ND,RT |   V   | $\vec\{\lambda}u$ |
| VectorCrossProductInterpolator  | ND,RT  | ND,RT |   V   | $\vec\{\lambda}\times\vec\{u}$ |
| VectorInnerProductInterpolator  | ND,RT  | H1,L2 |   V   | $\vec\{\lambda}\cdot\vec\{u}$ |

### Special Purpose Interpolators

| Class Name           | Domain | Range    | Operator                |
|----------------------|--------|----------|-------------------------|
| IdentityInterpolator | H1,L2  | H1,L2    | $u$                     |
| NormalInterpolator   | H1$^d$ | RT_Trace | $\hat\{n}\cdot\vec\{u}$ |

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
