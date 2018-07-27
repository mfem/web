# Features

The goal of MFEM is to enable research and development of scalable finite element discretization and solver algorithms through general finite element abstractions, accurate and flexible visualization, and tight integration with the *[hypre](http://www.llnl.gov/CASC/hypre)* library.

Conceptually, MFEM can be viewed as a finite element toolbox that provides the building blocks for developing finite element algorithms in a manner similar to that of MATLAB for linear algebra methods.

## Higher-order Finite Element Spaces

<img src="../img/ho-spaces-padding.png" align="right" alt="H(curl) and H(div) spaces">

MFEM supports a wide variety of [finite element][FiniteElement] [spaces][FiniteElementCollection] in 2D and 3D, including arbitrary high-order:

 - [H<sup>1</sup>](examples.md?h1)-conforming, [H(div)](examples.md?hdiv)-conforming, [H(curl)](examples.md?hcurl)-conforming spaces,
 - discontinuous [L<sub>2</sub>](examples.md?l2) spaces,
 - numerical trace ([interfacial](examples.md?h12)) spaces,
 - [NURBS](examples.md?nurbs) spaces for isogeometric analysis.

Many [bilinear][NonlinearFormIntegrator] and [linear][LinearFormIntegrator] forms defined on these spaces, as well as linear operators such as gradient, curl and embedding between these spaces, are available in the code.

## Flexible Discretization

In addition to classical Galerkin methods, MFEM enables the quick prototyping of

 - [mixed](examples.md?mixed) finite elements,
 - Discontinuous Galerkin ([DG](examples.md?dg)) methods,
 - [isogeometric](examples.md?nurbs) analysis methods,
 - Discontinuous Petrov-Galerkin ([DPG](examples.md?dpg)) approaches,
 - [Hybridization](examples.md?hybr) and [static condensation](examples.md?staticcond) for high-order problems.

<img src="../img/examples/ex6.png" align="right" width="230">

## Wide Range of Mesh Types

MFEM supports arbitrary element [transformations][ElementTransformation] and includes classes for dealing with:

 - triangular, quadrilateral, tetrahedral and hexahedral [elements][Element],
 - conforming local mesh refinement (triangular/tetrahedral meshes),
 - non-conforming mesh refinement (quadrilateral/hexahedral meshes), including anisotropic refinement,
 - [mesh optimization][HyperelasticModel] based on the Target-Matrix Optimization Paradigm (TMOP),
 - higher-order elements with [curved](mesh-formats.md#curvilinear-vtk-meshes) boundaries,
 - [surface](https://github.com/mfem/mfem/blob/master/data/square-disc-surf.mesh) meshes embedded in 3D, topologically [periodic](https://github.com/mfem/mfem/blob/master/data/periodic-hexagon.mesh) meshes, 1D meshes.

Additional support for automated adaptive analysis and parallel unstructured modifications on simplex meshes is provided via integration with the [PUMI](https://scorec.rpi.edu/pumi) distributed mesh management system.

## Parallel and Scalable

MFEM supports MPI-based parallelism throughout the library, and can readily be used as a scalable unstructured finite element problem generator.

 - MFEM-based [applications](http://www.llnl.gov/casc/blast) have been [scaled](http://computation.llnl.gov/blast/parallel-performance) to [hundreds of thousands](http://computation.llnl.gov/sites/default/files/public/NewBLASTScaling.png) of parallel cores.
 - The library supports [efficient operator assembly/evaluation](performance.md) for tensor-product high-order elements.
 - An experimental support for OpenMP acceleration is also included.

A serial MFEM application typically requires [minimal](http://mfem.github.io/doxygen/html/examples_2ex1_8cpp_source.html) [changes](http://mfem.github.io/doxygen/html/examples_2ex1p_8cpp_source.html) to transition to a scalable parallel version of the code, where it can take advantage of the integrated scalable linear solvers from the *[hypre](http://www.llnl.gov/CASC/hypre)* library. Both of these versions can be further transitioned to [high-performing](http://mfem.github.io/doxygen/html/miniapps_2performance_2ex1_8cpp_source.html) [templated variants](http://mfem.github.io/doxygen/html/miniapps_2performance_2ex1p_8cpp_source.html), where operator assembly/evaluation is fully inlined for particular runtime parameters.

## Built-in Solvers

MFEM is commonly used as a "finite element to linear algebra translator", since it can take a problem described in terms of finite element-type objects, and produce the corresponding linear algebra [vectors][Vector] and [sparse matrices][Operator].

Several matrix storage formats are available including dense, compressed sparse row ([CSR][SparseMatrix]) and parallel compressed sparse row ([ParCSR][HypreParMatrix]). Block vectors, operators and [matrices][(http://mfem.github.io/doxygen/html/classmfem_1_1BlockMatrix.html] are also supported.

A variety of solvers are available for the resulting linear algebra systems (or semi-discrete time-integration problems):

 - point-wise and polynomial [serial][SparseSmoother] and [parallel][HypreSmoother] smoothers,
<img src="../img/hypre_wiw.gif" align="right" width="250">
 - [Krylov solvers][IterativeSolver], such as PCG, MINRES and GMRES applicable to general [operators][Operator] in serial and in parallel,
 - parallel [eigensolvers](examples.md?lobpcg): LOBPCG and AME,
 - high-performance preconditioners from the *[hypre](http://www.llnl.gov/CASC/hypre)* library including the [BoomerAMG](examples.md?amg), [AMS](examples.md?ams) and [ADS](examples.md?ads) solvers,
 - many linear and nonlinear solvers, preconditioners and time integrators from the [PETSc](https://www.mcs.anl.gov/petsc) suite,
 - time integrators and non-linear solvers from the CVODE, ARKODE and KINSOL libraries of the [SUNDIALS](http://computation.llnl.gov/projects/sundials/sundials-software) suite,
 - discretization-specific solvers for electromagnetic, elasticity, hybridization and DPG methods,
 - [parallel](examples.md?superlu) and [sequential](examples.md?umfpack) sparse direct solvers based on [SuperLU](http://crd-legacy.lbl.gov/~xiaoye/SuperLU), [STRUMPACK](http://portal.nersc.gov/project/sparse/strumpack) and the [SuiteSparse](http://faculty.cse.tamu.edu/davis/suitesparse.html) library,
 - explicit and implicit high-order Runge-Kutta [time integrators][ODESolver],
 - solvers for nonlinear problems (Newton) and for single linearly constrained [quadratic minimization][SLBQPOptimizer] problems.

## Extensive Examples

MFEM includes a number of well-documented [example codes](examples.md) that can be used as tutorials, as well as simple starting points for user applications. Some of the included example codes are:

 - [Example 1](http://mfem.github.io/doxygen/html/examples_2ex1_8cpp_source.html): nodal H1 FEM for the Laplace problem,
 - [Example 2](http://mfem.github.io/doxygen/html/ex2_8cpp_source.html): vector FEM for linear elasticity,
 - [Example 3](http://mfem.github.io/doxygen/html/ex3_8cpp_source.html): Nedelec H(curl) FEM for the definite Maxwell problem,
 - [Example 4](http://mfem.github.io/doxygen/html/ex4_8cpp_source.html): Raviart-Thomas H(div) FEM for the grad-div problem,
 - [Example 5](http://mfem.github.io/doxygen/html/ex5_8cpp_source.html): mixed pressure-velocity FEM for the Darcy problem,
 - [Example 6](http://mfem.github.io/doxygen/html/ex6_8cpp_source.html): non-conforming adaptive mesh refinement (AMR) for the Laplace problem,
 - [Example 7](http://mfem.github.io/doxygen/html/ex7_8cpp_source.html): Laplace problem on a surface (the unit sphere),
 - [Example 8](http://mfem.github.io/doxygen/html/ex8_8cpp_source.html): Discontinuous Petrov-Galerkin (DPG) for the Laplace problem,
 - [Example 9](http://mfem.github.io/doxygen/html/ex9_8cpp_source.html): Discontinuous Galerkin (DG) time-dependent advection,
 - [Example 10](http://mfem.github.io/doxygen/html/ex10_8cpp_source.html): time-dependent implicit nonlinear elasticity,
 - [Example 11](http://mfem.github.io/doxygen/html/examples_2ex11p_8cpp_source.html): parallel Laplace eigensolver,
 - [Example 12](http://mfem.github.io/doxygen/html/ex12p_8cpp_source.html): parallel linear elasticity eigensolver,
 - [Example 13](http://mfem.github.io/doxygen/html/ex13p_8cpp_source.html): parallel Maxwell eigensolver,
 - [Example 14](http://mfem.github.io/doxygen/html/ex14_8cpp_source.html): Discontinuous Galerkin (DG) for the Laplace problem,
 - [Example 15](http://mfem.github.io/doxygen/html/ex15_8cpp_source.html): dynamic AMR for Laplace with prescribed time-dependent source,
 - [Example 16](http://mfem.github.io/doxygen/html/ex16_8cpp_source.html): time-dependent nonlinear heat equation,
 - [Example 17](http://mfem.github.io/doxygen/html/ex17_8cpp_source.html): Discontinuous Galerkin (DG) for linear elasticity,
 - [Example 18](http://mfem.github.io/doxygen/html/ex18_8cpp_source.html): Discontinuous Galerkin (DG) for the Euler equations,
 - [Example 19](http://mfem.github.io/doxygen/html/ex19_8cpp_source.html): incompressible nonlinear elasticity,
 - [Example 20](http://mfem.github.io/doxygen/html/ex20_8cpp_source.html): symplectic ODE integration.

Most of the examples have a serial and a parallel version, illustrating the ease of transition and the minimal code changes between the two.

Many of the examples also have modifications that take advantage of optional third-party libraries such as [PETSc](http://mfem.github.io/doxygen/html/petsc_8hpp.html), [SUNDIALS](http://mfem.github.io/doxygen/html/sundials_8hpp.html) and [PUMI](http://mfem.github.io/doxygen/html/pumi_8hpp.html).

Beyond the examples, a number of miniapps are available that are more representative of the advanced usage of the library in physics/application codes. Some of the included miniapps are:

 - [Volta](http://mfem.github.io/doxygen/html/volta_8cpp_source.html): simple electrostatics simulation code,
 - [Tesla](http://mfem.github.io/doxygen/html/tesla_8cpp_source.html): simple magnetostatics simulation code,
 - [Maxwell](http://mfem.github.io/doxygen/html/maxwell_8cpp_source.html): transient electromagnetics simulation code,
 - [Joule](http://mfem.github.io/doxygen/html/joule_8cpp_source.html): transient magnetics and Joule heating miniapp,
 - [Mesh Explorer](http://mfem.github.io/doxygen/html/mesh-explorer_8cpp_source.html): visualize and manipulate meshes.
 - [Mesh Optimizer](http://mfem.github.io/doxygen/html/mesh-optimizer_8cpp_source.html): optimize high-order meshes.

In addition, the sources for several external benchmark/proxy-apps build on top of MFEM are available:

- [Laghos](https://github.com/CEED/Laghos): high-order Lagrangian hydrodynamics miniapp,
- [Mulard](https://codesign.llnl.gov/mulard.php): multigroup thermal radiation diffusion mini application.

## Accurate and Flexible Visualization

The general (high-order) meshes and finite element functions in MFEM can be visualized accurately using the companion OpenGL visualization tool [GLVis](http://glvis.org), which is built on top of MFEM.

The [VisIt](http://visit.llnl.gov) visualization and analysis tool also natively supports MFEM formats.

## Lightweight, Portable and Easily Extendable

The MFEM code base is [relatively small](download.md) and is written in highly portable C++ (e.g. with very limited use of templates and the STL).

 - The serial version of MFEM has no external dependencies and is [straightforward to build](building.md) on Linux, Mac and Windows machines.
 - The MPI-parallel version uses two third-party libraries (*hypre* and METIS), and is also easy to build with an MPI compiler.
 - On most machines, both versions can be built in under a minute by typing: "`make serial -j`" and "`make parallel -j`" respectively.

The object-oriented design of MFEM [separates](http://mfem.github.io/doxygen/html/index.html) the mesh, finite element and linear algebra abstractions, making it easy to extend the library and adapt it to a variety of [applications](publications.md).

## Open Source

MFEM is an open-source software, and can be freely used under the terms of the [LGPL 2.1](https://www.gnu.org/licenses/lgpl-2.1.html) license.

<!-- To update the SVG images: in the gh-pages branch of mfem/doxygen do:
     grep 'id="node1" href="$classmfem_1_1FiniteElementCollection.html"' html/inherit*map -->

[FiniteElement]:           http://mfem.github.io/doxygen/html/inherit_graph_251.svg
[FiniteElementCollection]: http://mfem.github.io/doxygen/html/inherit_graph_55.svg
[Element]:                 http://mfem.github.io/doxygen/html/inherit_graph_33.svg
[HyperelasticModel]:       http://mfem.github.io/doxygen/html/inherit_graph_104.svg
[NonlinearFormIntegrator]: http://mfem.github.io/doxygen/html/inherit_graph_165.svg
[LinearFormIntegrator]:    http://mfem.github.io/doxygen/html/inherit_graph_130.svg
[Operator]:                http://mfem.github.io/doxygen/html/inherit_graph_223.svg
[Vector]:                  http://mfem.github.io/doxygen/html/inherit_graph_295.svg

[BlockMatrix]:             http://mfem.github.io/doxygen/html/classmfem_1_1BlockMatrix.html
[ElementTransformation]:   http://mfem.github.io/doxygen/html/classmfem_1_1ElementTransformation.html
[HypreParMatrix]:          http://mfem.github.io/doxygen/html/classmfem_1_1HypreParMatrix.html
[HypreSmoother]:           http://mfem.github.io/doxygen/html/classmfem_1_1HypreSmoother.html
[IterativeSolver]:         http://mfem.github.io/doxygen/html/classmfem_1_1IterativeSolver.html
[ODESolver]:               http://mfem.github.io/doxygen/html/classmfem_1_1ODESolver.html
[SLBQPOptimizer]:          http://mfem.github.io/doxygen/html/classmfem_1_1SLBQPOptimizer.html
[SparseMatrix]:            http://mfem.github.io/doxygen/html/classmfem_1_1SparseMatrix.html
[SparseSmoother]:          http://mfem.github.io/doxygen/html/classmfem_1_1SparseSmoother.html
