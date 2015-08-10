<div class="col-md-6" markdown="1">

[<img class="centered" src="img/logo-300.png">](gallery.md)

**MFEM** is a _lightweight_, _general_, _scalable_ C++ library for finite element methods.

## Features

* 2D and 3D, arbitrary high-order elements.
* H<sup>1</sup>, [H(curl)](examples.md?hcurl), [H(div)](examples.md?hdiv), L<sub>2</sub> and NURBS spaces.
* MPI version scalable to [hundreds of thousands](http://www.llnl.gov/casc/blast/parallel.php) of cores.
* Adaptive mesh refinement ([AMR](examples.md?amr)): conforming, nonconforming, anisotropic.
* Galerkin, [mixed](examples.md?mixed), isogeometric, [DG](examples.md?dg) and [DPG](examples.md?dpg) discretizations.
* Triangular, quadrilateral, tetrahedral and hexahedral [curved](https://github.com/glvis/glvis/wiki/Mesh-Formats#curvilinear-and-more-general-meshes) elements.
* ... and [many more](features.md).

MFEM is currently used in the [BLAST](http://www.llnl.gov/casc/blast), [GLVis](http://glvis.org) and [XBraid](http://www.llnl.gov/casc/xbraid) projects. See also our [Gallery](https://github.com/mfem/mfem/wiki/Gallery).


</div><div class="col-md-6" markdown="1">

## Latest Release

**
[New features](https://raw.githubusercontent.com/mfem/mfem/master/CHANGELOG) 
/ [Example codes](examples.md)
/ [Code documentation](http://mfem.github.io/doxygen/html/index.html) 
**

[<button type="button" class="btn btn-success">
**Download mfem-3.0.1.tgz**
</button>](http://goo.gl/gcNNsA)

Please use the GitHub [issue tracker](https://github.com/mfem/mfem/issues)
to report [bugs](https://github.com/mfem/mfem/issues/new) 
or post [questions or comments](https://github.com/mfem/mfem/issues/new).
For older releases see [downloads](download.md).

## Documentation

The best starting point for new users is the interactive documentation of the [example codes](examples.md).

**
[Building MFEM](building.md) 
/ [Serial Tutorial](serial-tutorial.md) 
/ [Parallel Tutorial](parallel-tutorial.md) 
<br> [Mesh Formats](https://github.com/glvis/glvis/wiki/MeshFormats) 
/ [GLVis Tutorials](https://github.com/glvis/glvis/wiki/)
**

MFEM is being developed at [CASC](http://computation.llnl.gov/casc/), [LLNL](https://www.llnl.gov/). It can be cited with
<pre>
@misc{mfem-library,
  title = {{MFEM}: Modular finite element methods},
  howpublished = {\url{mfem.org}}
}</pre>

See also our list of [publications](publications.md).


</div>
