# Weak Formulations

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

### Weak Derivatives

A "weak derivative" is a generalization of the notion of a derivative
for integrable functions whose derivatives do not exist in the strong
sense. When using the finite element method weak derivatives are
required whenever terms in a PDE require derivatives of discontinuous
or otherwise undifferentiable quantities. Finite element basis
functions are typically not smooth functions. Even if they happen to
be continuous their derivatives are often at least partially
discontinuous. Also, coefficient functions can be discontinuous but,
more importantly, their derivatives are often unknown. For these
reasons PDE terms similar to $\grad\(\lambda u)$ or $\div\grad u$
cannot be accurately computed using finite element basis functions
without employing weak derivatives.

Consider the following discontinuous approximation to the function
$\cos(2\pi x)e^{-2x}$.

<img class="floatcenter" src="../img/DiscFunc.png">

Piecewise linear, discontinuous basis functions can approximate this
function rather well on this coarse 4 element mesh. If we simply
ignore the discontinuities and compute the piecewise derivatives of
the basis functions we obtain the following approximation of the
continuous function's derivative.

<img class="floatcenter" src="../img/BasisDeriv.png">

This is a reasonable, albeit quite crude, approximation of the derivative.  Expending a little more effort to compute the weak derivative using continuous 2nd order basis functions produces a far superior approximation.

<img class="floatcenter" src="../img/WeakDeriv.png">

#### Weak Divergence
Natural boundary conditions arise when creating a weak formulation of a partial differential equation (PDE) whenever integration by parts is required to accurately handle the derivatives appearing in the PDE.  For example, consider a weak divergence operator.  Let $\vec\{\alpha} \equiv \vec\{\beta}u+\gamma\grad u$, where $\vec\{\beta}$ is a vector-valued function and $\gamma$ is a tensor-valued function.  The function $\vec\{\alpha}$ is a general linear function of $u$ and its gradient.  The weak divergence of this quantity would be calculated by multiplying $\div\vec\{\alpha}$ by a test function, $v$, and integrating over the domain $\Omega$.

$$(-\div\vec\{\alpha},v)\_\Omega
\equiv-\int_\Omega(\div\vec\{\alpha})v\,d\Omega$$
The negative sign in this expression is only a matter of convention.

Using the vector calculus identity, $\div(\vec\{\alpha}v) = (\div\vec\{\alpha})v + \vec\{\alpha}\cdot\grad v$, we find:
$$(-\div\vec\{\alpha}, v)\_\Omega = (\vec\{\alpha}, \grad v)\_\Omega - \int_\Omega\div(\vec\{\alpha}v)\,d\Omega$$
We then use the Divergence theorem to obtain:
$$(-\div\vec\{\alpha}, v)\_\Omega =
(\vec\{\alpha}, \grad v)\_\Omega - \int_\dO(\hat\{n}\cdot\vec\{\alpha}))v\,d\Gamma =
(\vec\{\alpha}, \grad v)\_\Omega - (\hat\{n}\cdot\vec\{\alpha},v)\_\dO $$
Where $d\Gamma$ is the area element on the boundary of $\Omega$.

#### Weak Curl

For the next example consider the weak curl of a vector operator.  Let $\vec\{\alpha} \equiv \beta\vec\{u}+\gamma\curl\vec\{u}$, where $\beta$ and $\gamma$ are both tensor-valued functions. The function $\vec\{\alpha}$ is a general linear function of $\vec\{u}$ and its curl.  The weak curl of this quantity would be calculated by multiplying $\curl\vec\{\alpha}$ by a test function, $\vec\{v}$, and integrating over the domain $\Omega$.

$$(\curl\vec\{\alpha},\vec\{v})\_\Omega \equiv
\int_\Omega(\curl\vec\{\alpha})\cdot\vec\{v}\,d\Omega$$
Using the vector calulus identity, $\div(\vec\{\alpha}\cross\vec\{v}) = (\curl\vec\{\alpha})\cdot\vec\{v} - \vec\{\alpha}\cdot(\curl\vec\{v})$, we find: 
$$(\curl\vec\{\alpha},\vec\{v})\_\Omega =
(\vec\{\alpha},\curl\vec\{v})\_\Omega +
\int_\Omega\div(\vec\{\alpha}\times\vec\{v})\,d\Omega$$
We again use the Divergence theorem to obtain:
$$(\curl\vec\{\alpha},\vec\{v})\_\Omega =
(\vec\{\alpha},\curl\vec\{v})\_\Omega +
\int_\dO\hat\{n}\cdot(\vec\{\alpha}\times\vec\{v})\,d\Gamma =
(\vec\{\alpha},\curl\vec\{v})\_\Omega + (\hat\{n}\cross\vec\{\alpha},\vec\{v})\_\dO$$
Where we also made use of the scalar triple product, $\hat\{n}\cdot(\vec\{\alpha}\cross\vec\{v}) = \vec\{v}\cdot(\hat\{n}\cross\vec\{\alpha})$, in the last equality.

#### Weak Gradient

For the last example consider the weak gradient of a scalar operator.  Let $\alpha \equiv \vec\{\beta}\cdot\vec\{u}+\gamma\div\vec\{u}$, where $\vec\{\beta}$ is a vector-valued function and $\gamma$ is a scalar-valued function. The function $\alpha$ is a general linear function of $\vec\{u}$ and its divergence.  The weak gradient of this quantity would be calculated by multiplying $\grad\alpha$ by a test function, $\vec\{v}$, and integrating over the domain $\Omega$.

$$(-\grad\alpha,\vec\{v})\_\Omega \equiv
-\int_\Omega(\grad\alpha)\cdot\vec\{v}\,d\Omega$$
The negative sign in this expression is again only a matter of convention.

Using the vector calulus identity, $\div(\alpha\vec\{v}) = (\grad\alpha)\cdot\vec\{v} + \alpha\div\vec\{v}$, we find: 
$$(-\grad\alpha,\vec\{v})\_\Omega =
(\alpha,\div\vec\{v})\_\Omega -
\int_\Omega\div(\alpha\vec\{v})\,d\Omega$$
We again use the Divergence theorem to obtain:
$$(-\grad\alpha,\vec\{v})\_\Omega =
(\alpha,\div\vec\{v})\_\Omega -
\int_\dO\hat\{n}\cdot(\alpha\vec\{v})\,d\Gamma =
(\alpha,\div\vec\{v})\_\Omega -
(\alpha\hat\{n},\vec\{v})\_\dO
$$


<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
