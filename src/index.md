<div class="col-md-6" markdown="1">

<div id="myCarousel" class="carousel slide" data-ride="carousel" markdown="1" style="margin-top:-10px;margin-bottom:0px;height:360px;">
  <!-- Indicators -->
  <ol class="carousel-indicators">
    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
    <li data-target="#myCarousel" data-slide-to="1"></li>
    <li data-target="#myCarousel" data-slide-to="2"></li>
    <li data-target="#myCarousel" data-slide-to="3"></li>
    <li data-target="#myCarousel" data-slide-to="4"></li>
    <li data-target="#myCarousel" data-slide-to="5"></li>
    <li data-target="#myCarousel" data-slide-to="6"></li>
    <li data-target="#myCarousel" data-slide-to="7"></li>
  </ol>

  <!-- Wrapper for slides -->
  <div class="carousel-inner">
    <div class="item active">
      [<img class="d-block w-100" src="img/logo-300.png" >](gallery.md)
    </div>
    <div class="item">
      [<img class="d-block w-100" width="375" height="300" src="img/gallery/workshop24/conf-topopt.png">](gallery.md#schmidt)
      <div class="carousel-caption d-none" style="margin-top:-15px;">
        2024 Visualization Contest Winner Mathias Schmidt
      </div>
    </div>
    <div class="item">
      [<img class="d-block w-100" width="250" height="160" src="img/gallery/workshop24/ex5-aniso-q-200x200-p2-Q3-HDG-a1e3-ks1e-3-c2e4.png">](gallery.md#nikl)
      <div class="carousel-caption d-none" style="margin-top:-15px;">
        2024 Visualization Contest Winner Jan Nikl
      </div>
    </div>
    <div class="item">
      [<img class="d-block w-100" width="250" height="250" src="img/carousel/tokamak.png">](gallery.md#nstx)
      <div class="carousel-caption d-none" style="margin-top:-15px;">
        Electromagnetic wave propagation in the [NSTX-U](https://nstx-u.pppl.gov/overview) tokamak
      </div>
    </div>
    <div class="item">
      [<img class="d-block w-100" width="250" height="250" src="img/carousel/icf.jpg">](gallery.md#blast)
      <div class="carousel-caption d-none" style="margin-top:-15px;">
        High-order multi-material hydrodynamics in the [BLAST](https://www.llnl.gov/casc/blast) code
      </div>
    </div>
    <div class="item">
      [<img class="d-block w-100" style="width:90%; margin-top:50px;" src="img/carousel/drone.png">](gallery.md#drone)
      <div class="carousel-caption d-none" style="margin-top:-10px;">
        Topology optimization of a drone body using <br> LLNL's [LiDO code](https://str.llnl.gov/2018-03/tortorelli), based on MFEM
      </div>
    </div>
    <div class="item">
      [<img class="d-block w-100" width="280" height="280" src="img/carousel/amr.png">](gallery.md)
      <div class="carousel-caption d-none" style="margin-top:-15px;">
        Non-conforming adaptive mesh refinement with parallel load-balancing
      </div>
    </div>
  </div>

  <!-- Left and right controls -->
  <a class="left carousel-control" href="#myCarousel" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#myCarousel" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right"></span>
    <span class="sr-only">Next</span>
  </a>
</div>

MFEM is a _free_, _lightweight_, _scalable_ C++ library for finite element methods.


## Features

* Arbitrary high-order finite element [meshes](features.md#wide-range-of-mesh-types)
and [spaces](features.md#higher-order-finite-element-spaces).
* [Wide variety](features.md#flexible-discretization) of finite element discretization approaches.
* Conforming and nonconforming [adaptive mesh refinement](examples.md?amr).
* Scalable from laptops to [GPU-accelerated](features#parallel-scalable-and-gpu-ready) supercomputers.
* ... and [many more](features.md).

MFEM is used in many projects, including [BLAST](https://www.llnl.gov/casc/blast), [Cardioid](https://github.com/llnl/cardioid), [Palace](https://github.com/awslabs/palace), [VisIt](https://visit.llnl.gov), [RF-SciDAC](https://www.rfscidac4.org/), [FASTMath](https://scidac5-fastmath.lbl.gov/), [xSDK](https://xsdk.info/), and [CEED](https://ceed.exascaleproject.org) in the [Exascale Computing Project](https://exascaleproject.org).

We host an annual [workshop](workshop.md) and [FEM@LLNL seminar series](seminar.md) series.

See also our [Gallery](gallery.md), [Publications](publications.md), [Videos](videos.md) and [News](news.md) pages.


</div><div class="col-md-6 news-table" markdown="1">

## News

Date         | Message
------------ | -----------------------------------------------------------------
Apr 15, 2025 | MOOSE [incorporates MFEM](https://github.com/idaholab/moose/pull/29633) as a backend.
Apr 9, 2025  | Version 4.8 [released](https://github.com/mfem/mfem/blob/v4.8/CHANGELOG).
Nov 25, 2024 | [Recap](https://computing.llnl.gov/about/newsroom/mfem-workshop-2024) of the 2024 [MFEM Community Workshop](workshop.md).
Jun 5, 2024  | MFEM in the cloud [tutorial](tutorial/index.md).
 May 2, 2024 | New MFEM [paper](https://journals.sagepub.com/doi/pdf/10.1177/10943420241261981) in IJHPCA.

## Latest Release

[New features](https://github.com/mfem/mfem/blob/v4.8/CHANGELOG)
┊ [Examples](examples.md)
┊ [Code documentation](dox.md)
┊ [Sources](https://github.com/mfem/mfem)

[<button type="button" class="btn btn-success">
**Download mfem-4.8.tgz**
</button>](https://bit.ly/mfem-4-8)

[Older releases](download.md) ┊ [Python wrapper](https://github.com/mfem/PyMFEM) ┊
[![Launch Colab](https://colab.research.google.com/assets/colab-badge.svg){style="display:inline;margin:0"}](https://colab.research.google.com/github/GLVis/pyglvis/blob/main/examples/ex1.ipynb "Python Jupyter notebook")

## Documentation


[Building MFEM](building.md)
┊ [Getting Started](getting-started.md)
┊ [Finite Elements](fem.md)
┊ [Performance](performance.md)

New users should start by examining the [example codes](examples.md).

We also recommend using [GLVis](https://glvis.org) for visualization.

## Contact

Use the GitHub [issue tracker](https://github.com/mfem/mfem/issues)
to report [bugs](https://github.com/mfem/mfem/issues/new?labels=bug)
or post [questions](https://github.com/mfem/mfem/issues/new?labels=question)
or [comments](https://github.com/mfem/mfem/issues/new?labels=comment).
See&nbsp;the [About](about.md) page for citation information.

</div><div class="col-md-12 bottom"></div>
