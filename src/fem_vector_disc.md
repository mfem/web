tag-fem:

# Vector Field Discretization

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

Broadly speaking vector-valued fields can be represented in two ways
in MFEM. First, the individual components of the vector field could be
represented as scalar fields. Second, the vector field could be
approximated using vector-valued finite element basis functions. Each
of these approaches has advantages for certain types of problems.

## Components as Scalar-Valued Fields

This may be considered the traditional approach to representing
vector-valued fields numerically. For example, in structural mechanics
each component of a displacement field is typically represented by a
continuous scalar field (which MFEM refers to as an "H1" field). MFEM
allows the user to define finite element spaces consisting of any number
of copies of an H1 or L2 field although these two types of fields cannot
be combined into a single finite element space. When combining components
in this way two interleave strategies are available;
`Ordering::byNODES`: $x_0, x_1, x_2, \ldots, y_0, y_1, y_2, \ldots,
z_0, z_1, z_2, \ldots$
or
`Ordering::byVDIM`: $x_0, y_0, z_0, x_1, y_1, z_1, x_2, y_2, z_2, \ldots$.
The choice of strategy is made when defining the `[Par]FiniteElementSpace`
object so the choice need not be uniform throughout an application.

MFEM provides a handful of bilinear form integrators which assume this
type of vector field construction.
See [Vector Field Operators](bilininteg.md#vector-field-operators) for a
complete listing. These integrators assume `Ordering::byNODES` internally
but they should be compatible with any global odering choice.

Vector fields constructed in this manner often store the Cartesian
components of the vector field using three scalar fields but this is by
no means the only option. The various components could just as easily be
defined in a cylindrical or spherical coordinate system or even a
non-coordinate basis. Any number of scalar fields which can be
interpretted in any manner that may be required should be possible.

Various derivatives of these vector fields can be constructed from the
gradients of the scalar components. This provides a great deal of flexibility
but care must be taken because these gradients are typically discontinuous at
element interfaces. 

The freedom afforded by this type of vector field construction can be
very powerful but a looser construction utilizing `BlockVector` and
`BlockOperator` classes may be preferable in some cases. Many such
constructions will require specialized bilinear form integrator classes
which are specifically designed to implement the necessary differential
operators. Another consideration is the type of available solver that
may be required for a custom operator. In many cases an iterative solver
with a block diagonal preconditioner may be more efficient than solving
a monolithic operator when a specialized preconditioner is not available.

## Vector-Valued Basis Functions

Nedelec basis functions (referred to as "ND" in MFEM classes) can be
used to approximate the H(curl) space of vector fields which have a
well-defined curl. The ND basis functions are designed to contain the
gradients of the scalar basis functions of the standard nodal basis
(referred to as "H1" in MFEM classes). Furthermore these ND
representations produce approximations which have continuous
tangential components across element interfaces.

Raviart-Thomas basis functions (referred to as "RT" in MFEM classes)
can be used to approximate the H(div) space of vector fields which
have a well-defined divergence. The RT basis functions are designed to
contain the curls of the vector basis functions of the Nedelec
basis. Furthermore these RT representations produce approximations
which have continuous normal components across element
interfaces. Also, the divergence of the RT basis functions are
contained in the space of discontinous scalar basis functions
(referred to as "L2" in MFEM classes).

The containment property mentioned above means that these derivatives
can simply be interpolated locally by the appropriate set of basis
functions. These interpolations can be computed using MFEM's
`DiscreteInterpolator` classes. Specifically,

| Derivative | MFEM Class               | Notation  | Domain | Range |
|------------|--------------------------|-----------|--------|-------|
| Gradient   | `GradientInterpolator`   | $T_\{01}$ |   H1   |   ND  |
| Curl       | `CurlInterpolator`       | $T_\{12}$ |   ND   |   RT  |
| Divergence | `DivergenceInterpolator` | $T_\{23}$ |   RT   |   L2  |

`DiscreteInterpolator` operators do not involve computing integrals
over the elements or access to any non-local information so they are
much less computationally expensive than bilinear form operators.  The
subscripts used in the above notation refer to the spaces H1, ND, RT,
and L2 by the integers 0, 1, 2, and 3 respectively. This corresponds
to the interpretation of these discrete spaces as spaces of discrete
differential forms, see [Acta Numerica
2006](https://www-users.cse.umn.edu/~arnold//papers/acta.pdf).

### Vector calculus identities: $\curl\grad\phi=0$ and $\div\curl\vec{F}=0$

The design of the H1, ND, RT, and L2 bases leads to precise support
for certain vector calculus identities. For example the Curl of the
Gradient of any continuous scalar field should be zero and the
divergence of the curl of any vector field in H(curl) should also be
zero. In terms of the interpolator objects mentioned above this could
be written as:
$$\begin{align}
T_{12}T_{01}\,v&=0\, \forall\, v \in H_1 \\\\
T_{23}T_{12}\,v&=0\, \forall\, v \in H(Curl)
\end{align}$$
When using MFEM's interpolation objects the resulting matrices satisfy
$T_{12}T_{01} = 0$ and $T_{23}T_{12} = 0$ to machine precision and so
these important identities are satisfied when using the correct
discretizations.

It is also possible to compute [weak derivatives](fem_weak_form.md) of
vector fields. These cannot be computed locally but require global
solves involving "mass" matrices. In the following we will use this
notation for the mass matrices of the four basis function families;
$M_0$, $M_1$, $M_2$, and $M_3$.

| Derivative | MFEM Class                            | Continuous Op. | Linear Algebra Notation | Full Operator            | Domain    | Range      |
|------------|---------------------------------------|----------------|-------------------------|--------------------------|-----------|------------|
| Gradient   | `MixedScalarWeakGradientIntegrator`   | $dv=\grad v$   | $M_2\, dv= D_\{32}\, v$ | $\{M_2}^\{-1}\, D_\{32}$ | $v\in$ L2 | $dv\in$ RT |
| Curl       | `MixedVectorWeakCurlIntegrator`       | $dv = \curl v$ | $M_1\, dv= D_\{21}\, v$ | $\{M_1}^\{-1}\, D_\{21}$ | $v\in$ RT | $dv\in$ ND |
| Divergence | `MixedVectorWeakDivergenceIntegrator` | $dv = \div v$  | $M_0\, dv= D_\{10}\, v$ | $\{M_0}^\{-1}\, D_\{10}$ | $v\in$ ND | $dv\in$ H1 |

It is not [obvious](#bilinear-forms-and-discrete-interpolators) but
these weak linear algebra operators are related to the discrete
interpolation operators.

$$\begin{align}
D_\{32} &= -\{T_\{23}}^T\, M_3 \\\\
D_\{21} &= \{T_\{12}}^T\, M_2 \\\\
D_\{10} &= -\{T_\{01}}^T\, M_1 \\\\
\end{align}$$

This implies that the weak operators also satisfy the
$\curl\grad\phi=0$ and $\div\curl\vec{F}=0$ vector calculus
identities:
$$\begin{align}
({M_1}^{-1}\, D_{21})\, ({M_2}^{-1}\, D_{32}) &= ({M_1}^{-1}\, {T_{12}}^T\, M_2)\, (-{M_2}^{-1}\, {T_{23}}^T\, M_3) = -{M_1}^{-1}\, {T_{12}}^T\, {T_{23}}^T\, M_3 = -{M_1}^{-1}\,\left(T_{23}\, T_{12}\right)^T\,M_3 = 0 \\\\
({M_0}^{-1}\, D_{10})\, ({M_1}^{-1}\, D_{21}) &= (-{M_0}^{-1}\, {T_{01}}^T\, M_1)\, ({M_1}^{-1}\, {T_\{12}}^T\, M_2) = -{M_0}^{-1}\, {T_\{01}}^T\, {T_{12}}^T\, M_2 = -{M_0}^{-1}\,\left( {T_\{12}\,T_{01}}\right)^T\, M_2 = 0 \\\\
\end{align}$$

In many applications the linear solves used to evaluate these weak
operators can produce results which are only zero to solver tolerance
rather than machine precision. However, with careful choices of discretization,
these identities can still ensure conservation of quantities such as charge,
mass, or energy to at least the level of solver tolerance.

### Enforcement of $\div\vec{F}=0$

The requirement that a vector field be divergence free arises in many
applications areas. For example, in electromagnetics it is often
necessary that $\div\vec{B}=0$ or sometimes that
$\div(\epsilon\vec{E})=0$. Some numerical methods enforce these
requirements using constraint equations but when using ND and RT
spaces this is not always necessary.

Clearly we have seen that if an RT field, such as the magnetic flux
$\vec{B}$, is computed as the curl of an ND field then its divergence
is zero to machine precision. In other words:

$$ B = T_{12} A \mbox{ for }A\in H(curl) \implies T_{23} B = 0 \nonumber $$

The weak divergence of an H(curl) field is more subtle because it
often involves coefficients which may be non-trivial. For example we
can compute the electric field, $\vec{E}$ using a form of Ampère's law:

$$ \curl\mu^{-1}\vec{B} = \sigma\vec{E} \nonumber $$

Will $E\in$ ND be divergence free with respect to $\sigma$, i.e. $\div(\sigma\vec{E})\stackrel{?}{=}0$, if we compute it by solving the discrete equation:

$$ E = {M_1}(\sigma)^{-1}D_{21}(\mu^{-1})B \nonumber $$

If the conductivity coefficient, $\sigma$, is non-trivial then
$\div\vec{E}\neq 0$ but $\div(\sigma\vec{E})=0$. This is reflected in
the discrete equations where the following relations hold:

$$
\begin{align}
\div\vec{E} \leadsto {M_0}^{-1}D_{10}E = {M_0}^{-1}\left(-\{T_\{01}}^T\, M_1\right)\left({M_1}(\sigma)^{-1}\{T_\{12}}^TM_2(\mu^{-1})B\right) \neq 0 \nonumber \\\\
\div(\sigma\vec{E}) \leadsto {M_0}^{-1}D_{10}(\sigma)E = {M_0}^{-1}\left(-\{T_\{01}}^T\, M_1(\sigma)\right)\left({M_1}(\sigma)^{-1}\{T_\{12}}^TM_2(\mu^{-1})B\right) = -{M_0}^{-1}\left(\{T_\{12}}\{T_\{01}}\right)^TM_2(\mu^{-1})B = 0 \nonumber
\end{align} \nonumber
$$

Notice that the presence of $\mu^{-1}$ in these expressions does not
impact this property of the discrete divergence just as it doesn't in
the continuous case. This implies that the divergence free nature of
the discrete solutions can be inferred for a wide variety of
equations. For example in each of the following equations the solution
field would be divergence free:

$$
\begin{align}
\epsilon\vec{E} - \curl\left(\mu^{-1}\curl\vec{E}\right) = 0 &\implies \div\left(\epsilon\vec{E}\right) = 0 \nonumber \\\\
\mu\vec{H} + \curl\left(\vec{v}\times(\mu\vec{H})\right) = 0 &\implies \div\left(\mu\vec{H}\right) = 0 \nonumber \\\\
\end{align} \nonumber
$$

Similar results could be obtained showing that the curl of gradient
fields will be zero without the need to impose additional constraints.

### Divergence cleaning

In many cases fields which should be divergence free lose this quality
when projected onto a discrete approximation. A common example is the
current-driven Maxwell wave equation:

$$
\omega^2\epsilon\vec{E} - \curl\left(\mu^{-1}\curl\vec{E}\right) = i\omega\vec{J}
\implies -i\omega\div\left(\epsilon\vec{E}\right) = \div\vec{J} \nonumber
$$

A simulation of this equation might have an analytic expression for
$\vec{J}$ which satisfies $\div\vec{J} = 0$. However, once $\vec{J}$
is projected onto a discrete space, ND would be most common in this
case, the resulting approximation is likely not divergence free
i.e. $M_0^{-1}D_{10}J \neq 0$ where $J = \pi_1(\vec{J})$ (with $\pi_1$
being the Nedelec projection operator which computes ND fields from
their H(curl) counterparts). Most often the divergence of such fields
is nearly zero everywhere with perhaps large deviations near sharper
features of the analytic current density, $\vec{J}$. Unfortunately,
this can lead to non-physical approximations of the electric field,
$\vec{E}$, particularly in simulations of transient phenomena.

The way to resolve this issue is to adjust the discrete approximation
so that it has the expected divergence. We do this by adding the
gradient of a scalar field as follows:

$$
\begin{align}
D_{10}(\lambda)\left(J+T_{01}\psi\right) &= M_0\rho \nonumber \\\\
D_{10}(\lambda)T_{01}\psi \equiv -S_0(\lambda)\psi &= M_0\rho - D_{10}(\lambda)J \nonumber
\end{align}
\nonumber
$$

Where $S_0(\lambda)$ is the Laplacian operator computed from MFEM's
`DiffusionIntegrator`. Normally the desired divergence, $\rho$ in this
case, is zero but any scalar field could be used. Clearly $\psi$ is
not unique, shifting by any constant would leave $\grad\psi$
unchanged, so we must set the value of $\psi$ at at least one point
using a Dirichlet constraint. Once $\psi$ is computed we can adjust
the discrete representation of $J$ by adding $\grad\psi$ and our
electric field solution should have the expected divergence.

This divergence cleaning procedure is not always the answer. If the
current density is poorly resolved or not close to divergence free
itself the correction, $\grad\psi$, can be large and therefore the
applied current density could be very different than expected. Also,
the global Laplacian solve can introduce changes to $J$ anywhere in
the domain. This can lead to solutions which do not obey causality. In
such cases a reformulation of the wave equation in terms of the
magnetic field, $\vec{H}$, where $\vec{J}$ would be approximated in
the RT space may be preferred (divergence cleaning may still be
necessary for $J\in$ RT but this can often be done locally and
maintain causality).

### Bilinear Forms and Discrete Interpolators (non-trivial details)

Consider the `MixedVectorWeakDivergenceIntegrator` which computes the
divergence of the product of a coefficient and a vector field,
$\div(\lambda\vec\{u})$, which we can refer to as
$D_{10}(\lambda)$. If we take $\vec\{u}\in$ ND and seek a result in H1
we encounter a special situation because the ND space (discrete
H(curl)) includes the gradients of the H1 basis functions. This means
that we have:

$$\grad\phi_i = \sum_j (T_{01})_{ji}W_j\,\forall\, i$$

or

$$
\left(
\begin{array}{c}
\grad\phi_0\\\\
\grad\phi_1\\\\
\vdots \\\\
\grad\phi_{n_0-1}
\end{array}
\right)
= {T_{01}}^T
\left(
\begin{array}{c}
W_0\\\\
W_1\\\\
\vdots \\\\
W_{n_1-1}
\end{array}
\right)
$$

Where $\phi_i$ is a scalar-valued basis function of H1, $W_j$
is a vector-valued basis function of ND, and the $(T\_{01})\_{ij}$ are
entries from the discrete gradient operator $T_{01}$.

The entries of $D_{10}(\lambda)$ would be computed as:

$$ \left(D_{10}(\lambda)\right)\_{ij}
= -\int\_\Omega (\lambda\,W_j)\cdot\grad\phi\_i\,\partial\Omega
= -\int\_\Omega (\lambda\,W_j)\cdot\left(\sum\_k (T_{01})\_{ki}W\_k\right)\partial\Omega
= -\sum\_k (T_{01})\_{ki}\int\_\Omega (\lambda\,W_j)\cdot W\_k\partial\Omega
$$

or

$$D_{10}(\lambda) = -\{T_{01}}^T M_1(\lambda)$$

Where $M_1(\lambda)$ is the Nedelec "mass" matrix with coefficient
$\lambda$. Other weak derivatives can be factored in a similar manner.

## Choosing a Vector Field Discretization



## Periodic Vector Fields

MFEM's default mechanism for representing fields on periodic domains is to make use of topologically periodic meshes. For examples of how this is accomplished see [HowTo: Use periodic meshes](https://mfem.org/howto/periodic-boundaries). This scheme leads to discretizations which share a common set of degrees of freedom. In the vector field context scalar field components require more care to avoid non-intuitive results.



<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']], processEscapes: true, processEnvironments: false}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
