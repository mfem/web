# Primal and Dual Vectors

## Primal Vectors

The finite element method is based on the notion that a smooth function can be
approximated by a sum of piecewise functions called *basis functions*:
$$f(\vec{x})\approx\sum_i f_i \phi_i(\vec{x}) \label{expan}$$
The support of an individual basis function, $\;\phi_i(\vec{x})$, will either be
a single zone or a collection of zones that share a common vertex, edge, or
face.  The expansion coefficients, $\;f_i$, are linear functions of the field
being approximated, $\;f(\vec{x})$ in this case.  The $\;f_i$ could be as simple
as values of the function at particular points, called interpolation points,
e.g. $\;f_i=f(\vec{x}\_i)$ or they could be integrals of the field over
submanifolds of the domain e.g. $\;f_i = \int_{\Omega_i}f(\vec{x})d\Omega$.
There are many possibilities but the expansion coefficients must be linear
functions of $\;f(\vec{x})$.

Once the basis functions are defined, with some unique ordering, the expansion
coefficients can be stored in a vector using the same order.  Such a vector of
coefficients is called a *primal vector*.  The original function,
$\;f(\vec{x})$, can then be approximated using \eqref{expan}.  In practice this
requires not only the primal vector of coefficients but also knowledge of the
mesh and the basis functions for each element of the mesh.  In MFEM these
collections of information are combined into `GridFunction` objects (or
`ParGridFunction` objects when used in parallel).

The `GridFunction` object can be used to compute a primal vector using any of
its various `Project` methods.  These methods compute the expansion
coefficients, $\;f_i$, or some subset of them, from a `Coefficient` object
representing $\;f(\vec{x})$.  There are also many `Get` methods which can
compute the expansion \eqref{expan} at particular locations within an element.
And still other methods for computing various measures of the error in the
finite element approximation of $\;f(\vec{x})$.

## Dual Vectors

In this context a *dual vector* is a linear functional of a *primal vector*
meaning that the action of a *dual vector* upon a *primal vector* is a real
number.  For example, the integral of a field over a domain,
$\;\alpha=\int_\Omega f(\vec{x})d\Omega$, is a linear functional because the
integral is linear with respect to the function being integrated and the result
is a real number.  In deed we can derive similar linear functionals using
compatible functions, $\;g(\vec{x})$, in this way
$G(f)=\int_\Omega g(\vec{x})f(\vec{x})d\Omega$. If we compute the action of our
functional on the finite element basis functions,
$$G_i=G(\phi_i(\vec{x})) =
\int_\Omega g(\vec{x})\phi_i(\vec{x})d\Omega\label{dualvec},$$
and we collect the results into a vector we call this a *dual vector*.

Integrals such as this often arise when enforcing energy balance in physical
systems. For example, if $\vec{J}$ is a current density describing a flow of
charged particles and $\vec{E}$ is an electric field effecting those particles,
then $\int_\Omega\vec{J}\cdot\vec{E}\,d\Omega$ is the rate at which work is
being done by the field on the charged particles.

MFEM provides `LinearForm` objects (or `ParLinearForm` objects in parallel)
which can compute *dual vectors* from a given function, $\;g(\vec{x})$.  These
objects require not only the mesh, basis functions, and the field
$\;g(\vec{x})$ but also a `LinearFormIntegrator` which defines precisely what
type of linear functional is being computed.
See [Linear Form Integrators](lininteg.md) for more information about MFEM's
linear form integrators.

A `LinearForm` objects provide one means for computing dual vectors if you have
a `Coefficient` describing the function $\;g(\vec{x})$.  If, on the other hand,
you have a *primal vector*, $\;g_i$, representing $\;g(\vec{x})$ you can form a
*dual vector* by multiplying $\;g_i$ by a bilinear form,
see [Bilinear Form Integrators](bilininteg.md) for more information on
bilinear forms.  To understand why this is so consider inserting the expansion
\eqref{expan} into \eqref{dualvec}.
$$
G_i=\int_\Omega \left(\sum_j g_j \phi_j(\vec{x})\right)\phi_i(\vec{x})d\Omega
= \sum_j \left(\int_\Omega \phi_j(\vec{x})\phi_i(\vec{x})d\Omega\right)g_j
$$
The last integral contains two indices and can therefore be viewed as an entry
in a square matrix.  Furthermore each *dual vector* entry, $\;G_i$, is
equivalent to one row of a matrix-vector product between this matrix of basis
function integrals and the *primal vector* $\;g_i$.  This particular matrix,
involving only the product of basis functions, is called a *mass matrix*.
However, the action of any matrix, resulting from a bilinear form, upon a
*primal vector* will produce a *dual vector*.  In general, such *dual vectors*
will have more complicated definitions than \eqref{dualvec} but they will still
be linear functionals of *primal vectors*.

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
