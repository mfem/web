# Finite Element Method

The finite element method is a general discretization technique that can utilize
unstructured grids to approximate the solutions of many partial differential
equations (PDEs).

The MFEM library is designed to be lightweight, general and highly scalable
finite element toolkit that provides the building blocks for developing finite
element algorithms in a manner similar to that of MATLAB for linear algebra
methods.

Some of the C++ classes that describe the finite element realizations of
PDE-level concepts in MFEM are described below.

### [Bilinear Form Integrators](bilininteg.md)

Bilinear form integrators are at the heart of any finite element method, they
are used to compute the integrals of products of basis functions over individual
mesh elements (or sometimes over edges or faces).  The `BilinearForm` class puts
several `BilinearFormIntegrator`s together to build the global sparse finite
element matrix.

### [Linear Form Integrators  ](lininteg.md)

Linear form integrators are used to compute the integrals of products of a basis
function with a given source function over individual mesh elements (or
sometimes over edges or faces).  The `LinearForm` class puts several
`LinearFormIntegrator`s together to build the global right-hand side for the
finite element linear system.
