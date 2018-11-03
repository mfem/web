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
$G(f)=\int_\Omega g(\vec{x})f(\vec{x})d\Omega$.  

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
