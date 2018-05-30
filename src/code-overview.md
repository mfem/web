# Code Overview

MFEM consists of the following closely interconnected modules:

* [General](#general) - general data structures and algorithms.
* [Linear Algebra](#linear-algebra) - linear algebra, linear and nonlinear solvers,
  time steppers.
* [Mesh](#mesh) - mesh class, mesh readers, mesh manipulation.
* [FEM](#finite-elements) - finite elements, spaces, linear and bilinear forms, etc.

----

## General

### Array

* Class `Array<T>`.
* Similar to `std::vector<T>` in many respects.
* Can allocate and manage data or hold _external_ data.

### Hash table

* Class `HashTable<T>`.
* Used in the `NCMesh` class.

### Table

* Class `Table`.
* Maps each row, `{0,1,..,n-1}`, to a _list_ of integers (columns).
* This is CSR-like data structure without data, only the '`I`' and '`J`' arrays.
* Represents relations like `vertex-to-element`, `element-to-dof`, etc.

### Dynamic symmetric table

* Class `DSTable` is a dynamic symmetric version of the `Table` class.
* Used for building relations like `vertex-to-vertex` - mesh edges.

### Dynamic symmetric 3D table

* Class `STable3D`.
* Used for building `vertex-to-vertex-to-vertex` relations - mesh faces in 3D.

### Communication

* Classes `GroupTopology`, `GroupCommunicator`.
* _Groups_ are sets of MPI ranks that need to exchange common data at processor
  boundaries.
* Reduce (gather) and broadcast (scatter) MPI communications within _groups_.

### Socket stream

* Class `socketstream`
* Two-way TCP sockets as c++ streams.
* Can be compiled with GnuTLS for security.
* Primarily used for sending data to GLVis.

### Timers

* Class `StopWatch`.
* Has various "backends" - `std::clock`, POSIX clocks, Windows'
  `QueryPerformanceCounter` etc.

### Options parser

* Class `OptionsParser`.
* Makes it easy to define and parse command line parameters.
* Used in all examples and miniapps.

----

## Linear Algebra

### Vector

* Class `Vector` - a vector of `double`s.
* Can allocate and manage data or warp _external_ data.
* Defines a number of vector operations on the data.

### Operator

* Class `Operator`
* An abstract base class for all linear and non-linear operators.
* Virtual method `Mult(const Vector &, Vector &)`.
* Optional virtual method `Operator &GetGradient(const Vector &x)`.

### Dense matrix

* Class `DenseMatrix` - a matrix of `double`s.
* Can allocate and manage data or wrap _external_ data.
* Uses column-major storage.
* Defines a number of matrix operations, matrix-vector, etc.
* Inherits from `Operator`.

### Dense tensor

* Class `DenseTensor`
* Can be viewed as an array of `DenseMatrix` (of the same size).
* Can be used in _batched_ matrix operations.

### Sparse matrix

* Class `SparseMatrix` - `int` indices, `double` data.
* Compressed sparse row (CSR) or linked list (LIL) storage.
* Various operations: assembly, matrix-vector, smoothers, etc.
* Inherits from `Operator`.

### Parallel hypre vector

* Class `HypreParVector` - wraps hypre's data structure & operations.

### Parallel hypre matrix

* Class `HypreParMatrix` - wraps hypre's data structure & operations.

### Solvers

* Abstract base class `Solver` - extends (inherits) class `Operator`.
* Adds virtual method `void SetOperator(const Operator &)`.

### Direct dense solver

* Class `DenseMatrixInverse` - inherits `Solver`.
* Inverts dense matrices, class `DenseMatrix`.
* Uses standard LU factorization with pivoting.

### Iterative solvers

* Krylov methods, Newton method.

### Direct sparse solvers

* Classes `UMFPackSolver`, `KLUSolver` - wraps UMFPACK and KLU from SuiteSparse;
  can be used with `SparseMatrix` (serial).
* Class `SuperLUSolver` - wraps SuperLU_DIST; the parallel matrix needs to be
  converted to `SuperLURowLocMatrix`.
* Class `STRUMPACKSolver` - wraps STRUMPACK; the parallel matrix needs to be
  converted to `STRUMPACKLURowLocMatrix`.

### Hypre preconditioners and solvers

* Classes `HypreBoomerAMG`, `HypreAMS`, ect.
* Classes `HyprePCG`, `HypreGMRES`.

### Time dependent operator

* Class `TimeDependentOperator`, inherits from `Operator`.
* Implements basic virtual methods `double GetTime()` and
  `void SetTime(const double)`.
* Optional virtual method
  `void ImplicitSolve(const double dt, const Vector &x, Vector &k)` - solve
  backward Euler system; required for implicit time steppers.

### ODE solvers

* Abstract base class `ODESolver`.
* Has virtual method `void Init(TimeDependentOperator &)`.
* Has pure virtual method `void Step(Vector &x, double &t, double &dt)`.
* Derived classes for explicit Runge-Kutta and implicit (SDIRK) methods.

### Symplectic Integrators for Hamiltonian Systems

* Abstract base class 'SIASolver'.
* Has virtual method `void Init(Operator &, TimeDependentOperator &)`.
* Has pure virtual method `void Step(Vector &q, Vector &p, double &t, double &dt)`.
* Derived classes for explicit first and second order integrators.
* Derived class supporting integration orders from 1 to 4.


### Constraint operator

* Class `ConstrainedOperator`, inherits from `Operator`.
* Impose essential boundary conditions on any `Operator` (matrix-free).
* Used by `Operator::FormLinearSystem()`.

### Block vector

* Class `BlockVector`, inherits from `Vector`.
* Holds a set of multiple contiguously allocated vectors.
* Useful for systems of equations with multiple components using different
  finite element spaces.

### Block operator

* Class `BlockOperator`, inherits from `Operator`.
* Each block is itself an `Operator`.

### Block matrix

* Class `BlockMatrix`, inherits `AbstractSparseMatrix`.
* Each block is a `SparseMatrix`.
* Supports more operations than `BlockOperator`.

### Block diagonal preconditioner

* Class `BlockDiagonalPreconditioner`, inherits `Solver`.
* Similar to `BlockOperator` but with diagonal block structure and square
  diagonal blocks.

----

## Mesh

### Mesh

* Class `Mesh`.
* The mesh topology/connectivity is given by `element-to-vertex` relation.
* Elements have type (triangle, quadrilateral, tetrahedron, hexahedron, etc) and
  attribute (`int`).
* Boundary elements can be included allowing tagging of boundary subsets, e.g.
  for boundary conditions, by the boundary element attribute.
* Edges, faces, and other connectivity are derived automatically based on the
  element type.
* A high-order mesh uses a vector FE function, i.e. a vector
  [`GridFunction`](#grid-function), to represent its high-order _nodes_.
* Hanging/slave vertices are regular vertices - the mesh is _"cut"_ along
  non-conforming edges and faces.
* Conforming constraints and interpolation are added at the level of the
  [`FiniteElementSpace`](#finite-element-space) based on additional
  data from the `Mesh` and `NCMesh` objects.
* Local conforming refinement for triangles and tets.
* Local non-conforming refinement for triangles, quads, and hexes.
* De-refinement and parallel rebalancing for non-conforming meshes.
* Supports curve and surface meshes.
* Periodic meshes: periodic topology with a DG `GridFunction` as nodes, cut
  along the periodic edges/faces.

### Non-conforming mesh

* Class `NCMesh`.
* Used through class `Mesh`.
* Supports triangles, quads, and hexes including anisotropic refinement for
  quads and hexes.
* Arbitrary level of hanging nodes and full refinement hierarchy.
* Generates the "cut" `Mesh` from the leaf elements.

### NURBS mesh

* Class `NURBSExtension`.
* Used through class `Mesh`.
* The NURBS patch connectivity is itself a quad/hex `Mesh`.
* Supports knot insertion, degree elevation, (serial, uniform) h-refinement.
* Generates a quad/hex `Mesh`.
* Easy to convert to a polynomial high-order mesh.

### Mesh readers and writers

* Own formats, read and write, for: `MFEM mesh v1.0`, `MFEM mesh v1.1`
  (extension for non-conforming meshes), `MFEM NURBS mesh v1.0`, and
  `MFEM INLINE mesh v1.0` (boxes).
* Readers for (some) Netgen, TrueGrid, VTK, Gmsh, and CUBIT mesh files.
* Write linear and quadratic VTK meshes.

### Parallel mesh

* Classes `ParMesh`, `ParNCMesh`, `ParNURBSExtension`.
* Inherit and extend classes `Mesh`, `NCMesh`, `NURBSExtension`.
* `ParMesh` is constructed from a serial `Mesh` available on all tasks.
* Built-in mesh partitioning is based on METIS.
* Parallel conforming and non-conforming refinement.

### Mesh operators

* Classes `ThresholdRefiner`, `ThresholdDerefiner`, `Rebalancer`.

----

## Finite Elements

### Quadrature formulas

* Class `IntegrationPoint` - coordinates plus weights.
* Class `IntegrationRule` - an array of `IntegrationPoint`s.
* Class `IntegrationRules` - container for `IntegrationRule`s.

### Element transformation

* Class `ElementTransformation`, `IsoparametricTransformation`.
* Defined through a `FiniteElement`
* Transforms reference `IntegrationPoint`s into physical `Vector`s.
* On demand, computes and stores Jacobian matrix, and weight.

### Finite elements

* Abstract base class `FiniteElement`.
* Arbitrary order `H1_*`, `L2_*`, `RT_*`, and `ND_*` elements on
  segment, triangles, quads, tets, and hexes.
* Abstract method `CalcShape`, `CalcDShape` for scalar FE; `CalcVShape`,
  `CalcDivShape`, `CalcCurlShape` for vector H(div)/H(curl) FE.
* Other interpolation and projection methods.

### Finite element collections

* Base class `FiniteElementCollection`.
* Associates `FiniteElement`s with elements, faces, edges, vertices.
* Degrees of freedom on faces/edges/vertices are shared between adjacent
  elements.
* Derived classes for arbitrary order `H1_*`, `L2_*`, `RT_*`, and `ND_*`
  collections.

### Finite element space

* Class `FiniteElementSpace`.
* Constructed from a `Mesh` and a `FiniteElementCollection`.
* Defines the mappings `elements-to-dofs`, `faces-to-dofs`, etc.
* Defines, when necessary, a prolongation, `P`, and a restriction, `R`,
  matrices: `R.P = I` to constrain _"slave"_ dofs.
* On non-conforming meshes, the space is _"cut"_ or _"partially conforming"_
  (before applying `P`).
* The domain of `P` defines the _"true"_ or _"conforming"_ dofs.
* The range of `P` is a sub-set of the _"partially conforming"_ dofs.

### Grid function

* Class `GridFunction`, extends class `Vector`.
* A container `Vector` on the _"partially conforming"_ dofs.
* Defines a number of useful operations like computing values, gradient, etc
  at quadrature points (`IntegrationPoint` or `IntegrationRule`).
* Methods for projecting (interpolating) `Coefficient`, `VectorCoefficient`.
* Methods for computing error norms with respect to a `Coefficient`.

### Linear form

* Class `LinearForm`, extends class `Vector`.
* Assembles r.h.s. vector.
* Uses a sum of local `LinearFormIntegrator`s.

### Bilinear form

* Class `BilinearForm`.
* Assembles linear system matrix.
* Uses a sum of local `BilinearFormIntegrator`s.
* Method `FormLinearSystem` applies necessary transformations, e.g.
  $P^T A P$.

### Mixed bilinear form

* Class `MixedBilinearForm`.

### Coefficients

* Abstract base classes: `Coefficient`, `VectorCoefficient`, and
  `MatrixCoefficient`.
* Derived classes include: `ConstantCoefficient`, `FunctionCoefficient`,
  `GridFunctionCoefficient`; `VectorFunctionCoefficient`,
  `VectorGridFunctionCoefficient`, etc.
* Easy to derive new coefficient classes.

### Parallel versions
* `ParFiniteElementSpace`
* `ParGridFunction`
* `ParLinearForm`
* `ParBilinearForm`
* etc

### Error estimators

* Classes `ZienkiewiczZhuEstimator`, `L2ZienkiewiczZhuEstimator`.

<script type="text/x-mathjax-config">
  MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "AMS"}},
  tex2jax: {inlineMath: [['$','$']]}});
</script>
<script type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML">
</script>
