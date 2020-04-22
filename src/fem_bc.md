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

## Galerkin Formulations

### Essential Boundary Conditions

| Space   | Essential BC                                            |
|---------|---------------------------------------------------------|
|  H1     | $u = f$ on $\partial\Omega$                             |
|  H1$^d$ | $\vec\{u} = \vec\{f}$ on $\partial\Omega$               |
|  ND     | $\hat\{n}\times\vec\{u} = \vec\{f}$ on $\partial\Omega$ |
|  RT     | $\hat\{n}\cdot\vec\{u} = f$ on $\partial\Omega$         |


### Natural Boundary Conditions

| Operator | Continuous Operator | Natural BC |
|------|----------|---|
| $(\lambda\grad u,\grad v)$ | $-\div(\lambda\grad u)$ | $\hat\{n}\cdot(\lambda\grad u)=f$ on $\dO$|
| $(\lambda\curl\vec\{u},\curl\vec\{v})$ | $\curl(\lambda\curl\vec\{u})$ | $\hat\{n}\cross(\lambda\curl\vec\{u})=\vec\{f}$ on $\dO$|
| $(\lambda\div\vec\{u},\div\vec\{v})$   | $-\grad(\lambda\div\vec\{u})$| $\lambda\div\vec\{u}=f$ on $\dO$ |
| $(-\vec\{\lambda}u,\grad v)$                   | $\div(\vec\{\lambda}u)$ | $\hat\{n}\cdot\vec\{\lambda}u = f$ on $\dO$ |
|$(\lambda\vec\{u},\curl\vec\{v})$ | $\curl(\lambda\vec\{u})$| $\hat\{n}\cross(\lambda\vec\{u})=f$ on $\dO$ |

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

###  Boundary Conditions

## Discontinuous Galerkin Formulations

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
