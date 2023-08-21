# Features

The goal of MFEM is to enable high-performance scalable finite element discretization research and application development on a wide variety of platforms, ranging from laptops to supercomputers.

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

 - triangular, quadrilateral, tetrahedral, wedge, and hexahedral [elements][Element],
 - uniform refinement (all element types),
 - conforming local mesh refinement (triangular/tetrahedral meshes),
 - non-conforming mesh refinement (quadrilateral/hexahedral meshes), including anisotropic refinement,
 - [mesh optimization][HyperelasticModel] based on the Target-Matrix Optimization Paradigm (TMOP),
 - higher-order elements with [curved](mesh-formats.md#curvilinear-vtk-meshes) boundaries,
 - [surface](https://github.com/mfem/mfem/blob/master/data/square-disc-surf.mesh) meshes embedded in 3D, topologically [periodic](https://github.com/mfem/mfem/blob/master/data/periodic-hexagon.mesh) meshes, 1D meshes.

Additional support for automated adaptive analysis and parallel unstructured modifications on simplex meshes is provided via integration with the [PUMI](https://scorec.rpi.edu/pumi) distributed mesh management system.

## Parallel, Scalable and GPU-ready

MFEM supports MPI-based parallelism throughout the library, and can readily be used as a scalable unstructured finite element problem generator.

 - MFEM-based [applications](https://www.llnl.gov/casc/blast) have been [scaled](https://computing.llnl.gov/blast/parallel-performance) to hundreds of thousands of parallel cores.
 - The library supports [efficient operator assembly/evaluation](performance.md) for tensor-product high-order elements.
 - Support for hardware devices, such as [GPUs](gpu-support.md), and programming models, such as CUDA, HIP, [OCCA](https://libocca.org), [RAJA](https://github.com/LLNL/RAJA) and OpenMP is also included.

A serial MFEM application typically requires [minimal](https://docs.mfem.org/html/examples_2ex1_8cpp_source.html) [changes](https://docs.mfem.org/html/examples_2ex1p_8cpp_source.html) to transition to a scalable parallel version of the code, where it can take advantage of the integrated scalable linear solvers from the *[hypre](https://www.llnl.gov/CASC/hypre)* library. Both of these versions can be further transitioned to [high-performing](https://docs.mfem.org/html/miniapps_2performance_2ex1_8cpp_source.html) [templated variants](https://docs.mfem.org/html/miniapps_2performance_2ex1p_8cpp_source.html), where operator assembly/evaluation is fully inlined for particular runtime parameters. As of version 4.0, GPU acceleration of several [examples](examples.md?pa) and many [linear algebra](https://docs.mfem.org/html/vector_8cpp_source.html) and [finite element](https://docs.mfem.org/html/bilininteg__diffusion_8cpp_source.html) operations is available.

## Built-in Solvers

MFEM is commonly used as a "finite element to linear algebra translator", since it can take a problem described in terms of finite element-type objects, and produce the corresponding linear algebra [vectors][Vector] and [sparse matrices][SparseMatrix].

Several matrix storage formats are available including dense, compressed sparse row ([CSR][SparseMatrix]) and parallel compressed sparse row ([ParCSR][HypreParMatrix]). Block vectors, operators and [matrices][BlockMatrix] are also supported.

A variety of solvers are available for the resulting linear algebra systems (or semi-discrete time-integration problems):

 - point-wise and polynomial [serial][SparseSmoother] and [parallel][HypreSmoother] smoothers,
<img src="../img/hypre_wiw.gif" align="right" width="250">
 - [Krylov solvers][IterativeSolver], such as PCG, MINRES and GMRES applicable to general [operators][Operator] in serial and in parallel,
 - parallel [eigensolvers](examples.md?lobpcg): LOBPCG and AME,
 - high-performance preconditioners from the *[hypre](https://www.llnl.gov/CASC/hypre)* library including the [BoomerAMG](examples.md?amg), [AMS](examples.md?ams) and [ADS](examples.md?ads) solvers,
 - many linear and nonlinear solvers, preconditioners and time integrators from the [PETSc](https://www.mcs.anl.gov/petsc) suite,
 - several eigensolvers from the [SLEPc](https://slepc.upv.es/) suite,
 - various iterative solvers and preconditioners on multiple architectures (OpenMP, CUDA and HIP) from the [Ginkgo](https://github.com/ginkgo-project/ginkgo) library.
 - time integrators and non-linear solvers from the CVODE, ARKODE and KINSOL libraries of the [SUNDIALS](https://computing.llnl.gov/projects/sundials/sundials-software) suite,
 - discretization-specific solvers for electromagnetic, elasticity, hybridization and DPG methods,
 - [parallel](examples.md?superlu) and [serial](examples.md?umfpack) sparse direct solvers based on [SuperLU](https://crd-legacy.lbl.gov/~xiaoye/SuperLU), [STRUMPACK](https://portal.nersc.gov/project/sparse/strumpack) and the [SuiteSparse](https://faculty.cse.tamu.edu/davis/suitesparse.html) library,
 - explicit and implicit high-order Runge-Kutta [time integrators][ODESolver],
 - solvers for nonlinear problems (Newton, [HiOp](https://github.com/LLNL/hiop)) and for single linearly constrained [quadratic minimization][SLBQPOptimizer] problems.

## Extensive Examples

MFEM includes a number of well-documented [example codes](examples.md) that can be used as tutorials, as well as simple starting points for user applications. Some of the included example codes are:

 - [Example 0](https://docs.mfem.org/html/ex0_8cpp_source.html): simplest MFEM example, good starting point for new users (nodal H1 FEM for the Laplace problem),
 - [Example 1](https://docs.mfem.org/html/examples_2ex1_8cpp_source.html): nodal H1 FEM for the Laplace problem,
 - [Example 2](https://docs.mfem.org/html/ex2_8cpp_source.html): vector FEM for linear elasticity,
 - [Example 3](https://docs.mfem.org/html/ex3_8cpp_source.html): Nedelec H(curl) FEM for the definite Maxwell problem,
 - [Example 4](https://docs.mfem.org/html/ex4_8cpp_source.html): Raviart-Thomas H(div) FEM for the grad-div problem,
 - [Example 5](https://docs.mfem.org/html/ex5_8cpp_source.html): mixed pressure-velocity FEM for the Darcy problem,
 - [Example 6](https://docs.mfem.org/html/ex6_8cpp_source.html): non-conforming adaptive mesh refinement (AMR) for the Laplace problem,
 - [Example 7](https://docs.mfem.org/html/ex7_8cpp_source.html): Laplace problem on a surface (the unit sphere),
 - [Example 8](https://docs.mfem.org/html/ex8_8cpp_source.html): Discontinuous Petrov-Galerkin (DPG) for the Laplace problem,
 - [Example 9](https://docs.mfem.org/html/ex9_8cpp_source.html): Discontinuous Galerkin (DG) time-dependent advection,
 - [Example 10](https://docs.mfem.org/html/ex10_8cpp_source.html): time-dependent implicit nonlinear elasticity,
 - [Example 11](https://docs.mfem.org/html/examples_2ex11p_8cpp_source.html): parallel Laplace eigensolver,
 - [Example 12](https://docs.mfem.org/html/ex12p_8cpp_source.html): parallel linear elasticity eigensolver,
 - [Example 13](https://docs.mfem.org/html/ex13p_8cpp_source.html): parallel Maxwell eigensolver,
 - [Example 14](https://docs.mfem.org/html/ex14_8cpp_source.html): Discontinuous Galerkin (DG) for the Laplace problem,
 - [Example 15](https://docs.mfem.org/html/ex15_8cpp_source.html): dynamic AMR for Laplace with prescribed time-dependent source,
 - [Example 16](https://docs.mfem.org/html/ex16_8cpp_source.html): time-dependent nonlinear heat equation,
 - [Example 17](https://docs.mfem.org/html/ex17_8cpp_source.html): Discontinuous Galerkin (DG) for linear elasticity,
 - [Example 18](https://docs.mfem.org/html/ex18_8cpp_source.html): Discontinuous Galerkin (DG) for the Euler equations,
 - [Example 19](https://docs.mfem.org/html/ex19_8cpp_source.html): incompressible nonlinear elasticity,
 - [Example 20](https://docs.mfem.org/html/ex20_8cpp_source.html): symplectic ODE integration,
 - [Example 21](https://docs.mfem.org/html/ex21_8cpp_source.html): adaptive mesh refinement for linear elasticity,
 - [Example 22](https://docs.mfem.org/html/ex22_8cpp_source.html): complex-valued linear systems,
 - [Example 23](https://docs.mfem.org/html/ex23_8cpp_source.html): second order in time wave equation,
 - [Example 24](https://docs.mfem.org/html/ex24_8cpp_source.html): mixed finite element spaces and interpolators,
 - [Example 25](https://docs.mfem.org/html/ex25_8cpp_source.html): Perfectly Matched Layer (PML) for Maxwell equations,
 - [Example 26](https://docs.mfem.org/html/ex26_8cpp_source.html): multigrid preconditioner for the Laplace problem,
 - [Example 27](https://docs.mfem.org/html/ex27_8cpp_source.html): boundary conditions for the Laplace problem,
 - [Example 28](https://docs.mfem.org/html/ex28_8cpp_source.html): constraints and sliding boundary conditions,
 - [Example 29](https://docs.mfem.org/html/ex29_8cpp_source.html): solving PDEs on embedded surfaces,
 - [Example 30](https://docs.mfem.org/html/ex30_8cpp_source.html): mesh preprocessing, resolving problem data,
 - [Example 31](https://docs.mfem.org/html/ex31_8cpp_source.html): Nedelec H(curl) FEM for the anisotropic definite Maxwell problem,
 - [Example 32](https://docs.mfem.org/html/ex32p_8cpp_source.html): parallel Nedelec Maxwell eigensolver with anisotropic permittivity,
 - [Example 33](https://docs.mfem.org/html/ex33_8cpp_source.html): nodal C0 FEM for the fractional Laplacian problem.
 - [Example 36](https://docs.mfem.org/html/ex36_8cpp_source.html): high-order FEM for the obstacle problem.
 - [Example 37](https://docs.mfem.org/html/ex37_8cpp_source.html): topology optimization.

Most of the examples have a serial and a parallel version, illustrating the ease of transition and the minimal code changes between the two.

Many of the examples also have modifications that take advantage of optional third-party libraries such as [PETSc](https://docs.mfem.org/html/petsc_8hpp.html), [SLEPc](https://docs.mfem.org/html/slepc_8hpp.html), [SUNDIALS](https://docs.mfem.org/html/sundials_8hpp.html), [PUMI](https://docs.mfem.org/html/pumi_8hpp.html), [Ginkgo](https://docs.mfem.org/html/ginkgo_8hpp.html) and [HiOp](https://docs.mfem.org/html/hiop_8hpp.html).

Beyond the examples, a number of miniapps are available that are more representative of the advanced usage of the library in physics/application codes. Some of the included miniapps are:

 - [Volta](https://docs.mfem.org/html/volta_8cpp_source.html): simple electrostatics simulation code,
 - [Tesla](https://docs.mfem.org/html/tesla_8cpp_source.html): simple magnetostatics simulation code,
 - [Maxwell](https://docs.mfem.org/html/maxwell_8cpp_source.html): transient electromagnetics simulation code,
 - [Joule](https://docs.mfem.org/html/joule_8cpp_source.html): transient magnetics and Joule heating miniapp,
 - [Navier](https://docs.mfem.org/html/classmfem_1_1navier_1_1NavierSolver.html#details): solver for the incompressible time-dependent Navier-Stokes equations,
 - [Mesh Explorer](https://docs.mfem.org/html/mesh-explorer_8cpp_source.html): visualize and manipulate meshes,
 - [Mesh Optimizer](https://docs.mfem.org/html/mesh-optimizer_8cpp_source.html): optimize high-order meshes,
 - [Interpolation](https://docs.mfem.org/html/findpts_8cpp_source.html): evaluation of high-order finite element functions in physical space,
 - [Overlapping Grids](https://github.com/mfem/mfem/blob/master/miniapps/gslib/schwarz_ex1.cpp): Schwarz coupling of single- and multi-physics problems,
 - [Extrapolation](https://docs.mfem.org/html/extrapolate_8cpp_source.html): finite element extrapolation solver,
 - [Distance](https://docs.mfem.org/html/distance_8cpp_source.html): finite element distance solver,
 - [Shifted Diffusion](https://docs.mfem.org/html/shifted_8cpp_source.html): high-order shifted boundary method for non body-fitted meshes,
 - [Minimal Surface](https://docs.mfem.org/html/minimal-surface_8cpp_source.html): compute the minimal surface of a given mesh,
 - [Display Basis](https://docs.mfem.org/html/display-basis_8cpp_source.html): visualize finite element basis functions,
 - [Get Values](https://docs.mfem.org/html/get-values_8cpp_source.html): extract field values via DataCollection classes,
 - [Load DC](https://docs.mfem.org/html/load-dc_8cpp_source.html): visualize fields saved via DataCollection classes,
 - [Convert DC](https://docs.mfem.org/html/convert-dc_8cpp_source.html): convert between different DataCollection formats,
 - [LOR Transfer](https://docs.mfem.org/html/lor-transfer_8cpp_source.html): map functions between high-order and low-order-refined spaces,
 - [ParELAG H(curl) and H(div) AMGe](https://docs.mfem.org/html/MultilevelHcurlHdivSolver_8cpp_source.html): solve H(curl) and H(div) problems using the element-based algebraic multigrid (AMGe) in the ParELAG library.

In addition, the sources for several external benchmark/proxy-apps build on top of MFEM are available:

- [Laghos](https://github.com/CEED/Laghos): high-order Lagrangian hydrodynamics miniapp,
- [Remhos](https://github.com/CEED/Remhos): high-order advection remap miniapp,
- [Mulard](https://computing.llnl.gov/projects/co-design/mulard): multigroup thermal radiation diffusion mini application.

A handful of "toy" miniapps of less serious nature demonstrate the flexibility of MFEM (and provide a bit of fun):

 - [Automata](https://docs.mfem.org/html/automata_8cpp_source.html): model of a simple cellular automata,
 - [Life](https://docs.mfem.org/html/life_8cpp_source.html): model of Conway's game of life,
 - [Lissajous](https://docs.mfem.org/html/lissajous_8cpp_source.html): spinning optical illusion,
 - [Mandel](https://docs.mfem.org/html/mandel_8cpp_source.html): fractal visualization with AMR,
 - [Mondrian](https://docs.mfem.org/html/mondrian_8cpp_source.html): convert any image to an AMR mesh,
 - [Rubik](https://docs.mfem.org/html/rubik_8cpp_source.html): interactive Rubik's Cube&trade; puzzle,
 - [Snake](https://docs.mfem.org/html/snake_8cpp_source.html): model of the Rubik's Snake&trade; puzzle.

## Accurate and Flexible Visualization

The general (high-order) meshes and finite element functions in MFEM can be visualized accurately using the companion OpenGL visualization tool [GLVis](https://glvis.org), which is built on top of MFEM.

The [VisIt](https://visit.llnl.gov) visualization and analysis tool also natively supports MFEM formats.

Another visualization tool natively supported by MFEM is [ParaView](https://www.paraview.org). The file format supports high-order (up to order six) meshes and elements.

## Lightweight, Portable and Easily Extendable

The MFEM code base is [relatively small](download.md) and is written in highly portable C++ (e.g. with very limited use of templates and the STL).

 - The serial version of MFEM has no external dependencies and is [straightforward to build](building.md) on Linux, Mac and Windows machines.
 - The MPI-parallel version uses two third-party libraries (*hypre* and METIS), and is also easy to build with an MPI compiler.
 - On most machines, both versions can be built in under a minute by typing: "`make serial -j`" and "`make parallel -j`" respectively.

The object-oriented design of MFEM [separates](https://docs.mfem.org/html/index.html) the mesh, finite element and linear algebra abstractions, making it easy to extend the library and adapt it to a variety of [applications](publications.md).

## Open Source

MFEM is an open-source software, and can be freely used under the terms of the [BSD](https://github.com/mfem/mfem/blob/master/LICENSE) license.

<!-- To update the SVG images: in the gh-pages branch of mfem/doxygen do:
     grep 'id="node1" href="$classmfem_1_1FiniteElementCollection.html"' html/inherit*map -->

[FiniteElement]:           https://docs.mfem.org/html/classmfem_1_1FiniteElement.html
[FiniteElementCollection]: https://docs.mfem.org/html/classmfem_1_1FiniteElementCollection.html
[Element]:                 https://docs.mfem.org/html/classmfem_1_1Element.html
[HyperelasticModel]:       https://docs.mfem.org/html/classmfem_1_1HyperelasticModel.html
[NonlinearFormIntegrator]: https://docs.mfem.org/html/classmfem_1_1NonlinearFormIntegrator.html
[LinearFormIntegrator]:    https://docs.mfem.org/html/classmfem_1_1LinearFormIntegrator.html
[Operator]:                https://docs.mfem.org/html/classmfem_1_1Operator.html
[Vector]:                  https://docs.mfem.org/html/classmfem_1_1Vector.html

[BlockMatrix]:             https://docs.mfem.org/html/classmfem_1_1BlockMatrix.html
[ElementTransformation]:   https://docs.mfem.org/html/classmfem_1_1ElementTransformation.html
[HypreParMatrix]:          https://docs.mfem.org/html/classmfem_1_1HypreParMatrix.html
[HypreSmoother]:           https://docs.mfem.org/html/classmfem_1_1HypreSmoother.html
[IterativeSolver]:         https://docs.mfem.org/html/classmfem_1_1IterativeSolver.html
[ODESolver]:               https://docs.mfem.org/html/classmfem_1_1ODESolver.html
[SLBQPOptimizer]:          https://docs.mfem.org/html/classmfem_1_1SLBQPOptimizer.html
[SparseMatrix]:            https://docs.mfem.org/html/classmfem_1_1SparseMatrix.html
[SparseSmoother]:          https://docs.mfem.org/html/classmfem_1_1SparseSmoother.html
