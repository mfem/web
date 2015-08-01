[![](img/logo-300.png)](gallery.md)

MFEM is a _lightweight_, _general_, _scalable_ C++ library for finite element methods. Its features include:

 * 2D and 3D, arbitrary high-order H1, [H(curl)](http://mfem.github.io/doxygen/examples/README_files/index.html?hcurl), [H(div)](http://mfem.github.io/doxygen/examples/README_files/index.html?hdiv), L2 and NURBS elements.
 * Parallel version scalable to [hundreds of thousands](http://www.llnl.gov/casc/blast/parallel.php) of MPI cores, tightly integrated with the _[hypre](http://www.llnl.gov/CASC/hypre)_ linear solvers library.
 * Conforming or nonconforming adaptive mesh refinement ([AMR](http://mfem.github.io/doxygen/examples/README_files/index.html?amr)), including anisotropic refinement.
 * Galerkin, [mixed](http://mfem.github.io/doxygen/examples/README_files/index.html?mixed), isogeometric, [DG](http://mfem.github.io/doxygen/examples/README_files/index.html?dg) and [DPG](http://mfem.github.io/doxygen/examples/README_files/index.html?dpg) discretizations.
 * Support for triangular, quadrilateral, tetrahedral and hexahedral elements with [curved](https://github.com/glvis/glvis/wiki/Mesh-Formats#curvilinear-and-more-general-meshes) boundaries.
 * ... and [many more](https://github.com/mfem/mfem/wiki/Features).

MFEM is currently used in the [BLAST](http://www.llnl.gov/casc/blast), [GLVis](http://glvis.org) and [XBraid](http://www.llnl.gov/casc/xbraid) projects. See also our [Gallery](https://github.com/mfem/mfem/wiki/Gallery).

## Latest Release

#### [mfem-3.0.1.tgz](http://goo.gl/gcNNsA) | [Example codes](http://mfem.github.io/doxygen/examples/README_files/index.html) | [Code documentation](http://mfem.github.io/doxygen/html/index.html) | [New features](https://raw.githubusercontent.com/mfem/mfem/master/CHANGELOG)

_Please use the GitHub [issue tracker](https://github.com/mfem/mfem/issues) to report [bugs](https://github.com/mfem/mfem/issues/new) or post [questions or comments](https://github.com/mfem/mfem/issues/new)_. For older releases see [all releases](https://github.com/mfem/mfem/wiki/Releases).


## Documentation

The best starting point for new users is the interactive documentation of the [example codes](http://mfem.github.io/doxygen/examples/README_files/index.html).

[Building MFEM](https://github.com/mfem/mfem/wiki/Building) | [Serial Tutorial](https://github.com/mfem/mfem/wiki/SerialTutorial) | [Parallel Tutorial](https://github.com/mfem/mfem/wiki/ParallelTutorial) | [Mesh Formats](https://github.com/glvis/glvis/wiki/MeshFormats) | [GLVis Tutorials](https://github.com/glvis/glvis/wiki/)

MFEM is being developed at [CASC](http://computation.llnl.gov/casc/), [LLNL](https://www.llnl.gov/). It can be cited with
<pre>
@misc{mfem-library,
   title = {{MFEM}: Modular finite element methods},
   howpublished = {\url{mfem.org}}
}</pre>

See also our list of [Publications](https://github.com/mfem/mfem/wiki/Publications).
