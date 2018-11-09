# Primal and Dual Vectors

The finite element method uses vectors of data in a variety of ways and the
differences can be subtle.  MFEM defines `GridFunction`, `LinearForm`, and
`Vector` classes which help to distinguish the different roles that vectors of
data can play.

## Primal Vectors

The finite element method is based on the notion that a smooth function can be
approximated by a sum of piece-wise functions called *basis functions*:
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
\label{dualvecprod}$$
The last integral contains two indices and can therefore be viewed as an entry
in a square matrix.  Furthermore each *dual vector* entry, $\;G_i$, is
equivalent to one row of a matrix-vector product between this matrix of basis
function integrals and the *primal vector* $\;g_i$.  This particular matrix,
involving only the product of basis functions, is called a *mass matrix*.
However, the action of any matrix, resulting from a bilinear form, upon a
*primal vector* will produce a *dual vector*.  In general, such *dual vectors*
will have more complicated definitions than \eqref{dualvec} or
\eqref{dualvecprod} but they will still be linear functionals of *primal
vectors*.

## True Degree-of-Freedom Vectors

Primal vectors contain all of the expansion coefficients needed to compute the
finite element approximation of a function in each element of a mesh.  When run in parallel, the local portion of a primal vector only contains data for the locally owned elements.  Regardless of wether or not the simulation is being run in parallel, some of these cofficients may in fact be redundant.

Sources of redundancy:

- In parallel some coefficients must be shared between processors.
- When using static condensation or hybridization many coefficients will
  depend upon the coefficients which are associated with the skeleton of the
  mesh as well as upon other data.
- When using non-conforming meshes some of the coefficients on the finer side
  of a non-conforming interface between elements will depend upon those on the
  coarser side of the interface.

For any or all of these reasons primal vectors may not contain the *true
degrees-of-freedom* for describing a finite element approximation of a field.
The *true* set of degrees-of-freedom may in fact be much smaller than the size
of the primal vector.

When setting up and solving a linear system to determine the finite element
approximation of a field, the size of the linear system is determined by the
number of *true degrees-of-freedom*.  The details of creating this linear
system are mostly hidden within the `BilinearForm` object. To convert
individual bilinear form objects the user can call the
`BilinearForm::FormSystemMatrix()` method, however, the more common task is to
form the entire linear system with `BilinearForm::FormLinearSystem()`.  As
input, this method requires a *primal vector*, a *dual vector*, and an array of
boundary degrees of freedom.  The degree-of-freedom array contains the true
degrees-of-freedom, as obtained from a `FiniteElementSpace` object, which
coincide with the Dirichlet, a.k.a. *essential*, boundaries.
```
   // Given a bilinear form 'a', a primal vector 'x', a dual vector 'b',
   // and an array of essential boundary true dof indices...
   SparseMatrix A;
   Vector B, X;
   a.FormLinearSystem(ess_tdof_list, x, b, A, X, B);

   // Solve X = A^{-1}B
   ...

   a.RecoverFEMSolution(X, b, x);
```
The primal vector
must contain the appropriate values for the solution on the essential
boundaries.  The interior of the primal vector is ignored by default although
it can be used to supply an initial guess when using certain solvers.  The dual
vector should be an assembled `LinearForm` object or the product of a
`GridFunction` and a `BilinearForm`.  As output,
`BilinearForm::FormLinearSystem()` produces the objects $A$, $X$, and $B$ in
the linear system $A X=B$.  Where $A$ is ready to be passed to the appropriate
MFEM solver, $X$ is properly initialized, and $B$ has been modified to
incorporate the essential boundary conditions.  After the linear system has
been solved the primal vector representing the solution must be built from $X$
and the original dual vector by calling `BilinearForm::RecoverFEMSolution()`.

## Technical Details

### Constructing Dual Vectors

It was mentioned above, in the section on
[Dual Vectors](pri-dual-vec.md#dual-vectors), that you can create a dual vector
by multiplying a primal vector by a bilinear form.  But of course if you have a
primal vector you can also use a `GridFunctionCoefficient` to create a dual
vector using a `LinearForm` and an appropriate `LinearFormIntegrator`.  These
two choices should produce nearly identical results if the
`BilinearFormIntegrator` and the `LinearFormIntegrator` use the same
integration rule order.  The only differences should involve differing
round-off errors produced by summing double precision numbers in different
orders.

A bilinear form must create a sparse matrix which can require a great deal of
memory.  Integrating a `GridFunctionCoefficient` in a `LinearForm` object will
require very little memory.  On the other hand, computing the integrals inside
a `LinearForm` object can be computationally expensive even in comparison to
assembling the bilinear form.

Which is the better option?  As always, there are trade-offs.  The answer
depends on many variables; the complexities of the `BilinearFormIntegrator` and
the `LinearFormIntegrator`, the complexity of other coefficients that may be
present, the order of the basis functions, can the bilinear form be reused or
is this a one-time calculation, whether the code runs on a CPU or GPU, etc.. On
some architectures the motion of data through memory during a matrix-vector
multiplication may be expensive enough that using a `LinearForm` and
recomputing the integrals is more efficient.

Often the construction of dual vectors is a small portion of the overall
compute time so this choice may not be critical.  The best choice is to test
your application and determine which method is more appropriate for your
algorithm on your hardware.

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
