# Finite Element Method

The finite element method is a general discretization technique that can utilize
unstructured grids to approximate the solutions of many partial differential
equations (PDEs).

There is a large body of literature on finite elements, including the
following excellent books:

- [Numerical Solution of Partial Differential Equations by the Finite Element Method](https://www.amazon.com/dp/048646900X) by *Claes Johnson*
- [The Finite Element Method for Elliptic Problems](http://epubs.siam.org/doi/book/10.1137/1.9780898719208) by *Philippe Ciarlet*
- [Higher-Order Finite Element Methods](https://www.amazon.com/dp/158488438X) by *Pavel Šolín*, *Karel Segeth* and *Ivo Doležel*
- [High-Order Methods for Incompressible Fluid Flow](https://www.amazon.com/dp/0521453097) by *Michel Deville*, *Paul Fischer* and *Ernest Mund*
- [Finite Elements: Theory, Fast Solvers, and Applications in Elasticity Theory](https://www.amazon.com/dp/0521705185) by *Dietrich Braess*
- [The Mathematical Theory of Finite Element Methods](http://www.springer.com/us/book/9780387759333) by *Susanne Brenner* and *Ridgway Scott*
- [An Analysis of the Finite Element Method](https://www.amazon.com/dp/0980232708) by *Gilbert Strang* and *George Fix*

The MFEM library is designed to be lightweight, general and highly scalable
finite element toolkit that provides the building blocks for developing finite
element algorithms in a manner similar to that of MATLAB for linear algebra
methods.

Some of the C++ classes that describe the finite element realizations of
PDE-level concepts in MFEM are described below.

### [Bilinear Form Integrators](bilininteg.md)

Bilinear form integrators are at the heart of any finite element method, they
are used to compute the integrals of products of basis functions over individual
mesh elements (or sometimes over edges or faces).  The `BilinearForm` class adds
several `BilinearFormIntegrator`s together to build the global sparse finite
element matrix.

### [Linear Form Integrators](lininteg.md)

Linear form integrators are used to compute the integrals of products of a basis
function with a given source function over individual mesh elements (or
sometimes over edges or faces).  The `LinearForm` class adds several
`LinearFormIntegrator`s together to build the global right-hand side for the
finite element linear system.
