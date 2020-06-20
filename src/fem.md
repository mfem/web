# Finite Element Method

The finite element method is a general discretization technique that can utilize
unstructured grids to approximate the solutions of many partial differential
equations (PDEs).

There is a large body of literature on finite elements, including the
following excellent books:

- [Numerical Solution of Partial Differential Equations by the Finite Element Method](https://www.amazon.com/dp/048646900X) by *Claes Johnson*
- [Theory and Practice of Finite Elements](https://www.amazon.com/dp/144191918X) by *Alexandre Ern* and *Jean-Luc Guermond*
- [Higher-Order Finite Element Methods](https://www.amazon.com/dp/158488438X) by *Pavel Šolín*, *Karel Segeth* and *Ivo Doležel*
- [High-Order Methods for Incompressible Fluid Flow](https://www.amazon.com/dp/0521453097) by *Michel Deville*, *Paul Fischer* and *Ernest Mund*
- [Finite Elements: Theory, Fast Solvers, and Applications in Elasticity Theory](https://www.amazon.com/dp/0521705185) by *Dietrich Braess*
- [The Finite Element Method for Elliptic Problems](http://epubs.siam.org/doi/book/10.1137/1.9780898719208) by *Philippe Ciarlet*
- [The Mathematical Theory of Finite Element Methods](http://www.springer.com/us/book/9780387759333) by *Susanne Brenner* and *Ridgway Scott*
- [An Analysis of the Finite Element Method](https://www.amazon.com/dp/0980232708) by *Gilbert Strang* and *George Fix*
- [The Finite Element Method: Its Basis and Fundamentals](https://www.amazon.com/dp/1856176339/) by *Olek Zienkiewicz*, *Robert Taylor* and *J.Z. Zhu*

The MFEM library is designed to be lightweight, general and highly scalable
finite element toolkit that provides the building blocks for developing finite
element algorithms in a manner similar to that of MATLAB for linear algebra
methods.

Some of the C++ classes for the finite element realizations of these
PDE-level concepts in MFEM are described below.

### [Primal and Dual Vectors](pri-dual-vec.md)

The finite element method uses vectors of data in a variety of ways and the
differences can be subtle.  MFEM defines `GridFunction`, `LinearForm`, and
`Vector` classes which help to distinguish the different roles that vectors of
data can play.

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

### [Linear Interpolators](lininterp.md)

Unlike Bilinear and Linear forms, Linear Interpolators do not perform
integrations, but project one basis function (or a
linear function of a basis function) onto another basis function.  The
`DiscreteLinearOperator` class adds one or more `LinearInterpolators`
together to build a global sparse matrix representation of the linear
operator.

### [Coefficients](coefficient.md)

