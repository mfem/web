<div class="col-md-6" markdown="1">

[![MFEM logo](img/logo-300.png)](gallery.md)

MFEM is a _free_, _lightweight_, _scalable_ C++ library for finite element methods.


## Features

* Arbitrary high-order finite element [meshes](features.md#wide-range-of-mesh-types)
and [spaces](features.md#higher-order-finite-element-spaces).
* [Wide variety](features.md#flexible-discretization) of finite element discretization approaches.
* Conforming and nonconforming [adaptive mesh refinement](examples.md?amr).
* Scalable from laptops to [GPU-accelerated](features#parallel-scalable-and-gpu-ready) supercomputers.
* ... and [many more](features.md).

MFEM is used in many projects, including
[BLAST](http://www.llnl.gov/casc/blast), [RF-SciDAC](https://www.rfscidac4.org/), [VisIt](http://visit.llnl.gov), [Cardioid](https://github.com/llnl/cardioid), [xSDK](https://xsdk.info/), SciDAC/[FASTMath](https://fastmath-scidac.llnl.gov/index.html), and the [Center for Efficient Exascale Discretizations](http://ceed.exascaleproject.org) in the [Exascale Computing Project](https://exascaleproject.org).

See also our [Gallery](gallery.md), [Publications](publications.md) and
[News](news.md) pages.

</div><div class="col-md-6 news-table" markdown="1">


## News

Date         | Message
------------ | -----------------------------------------------------------------
Mar 18, 2021 | [Postdoc position](https://www.llnl.gov/join-our-team/careers/find-your-job/all/mfem/3743990000038667) using MFEM.
Feb 16, 2021 | New page on [GPU performance](gpu-support.md).
Dec 19, 2020 | [PyMFEM](https://github.com/mfem/PyMFEM) available with [`pip install mfem`](https://pypi.org/project/mfem).
Oct 30, 2020 | Version 4.2 [released](https://github.com/mfem/mfem/blob/v4.2/CHANGELOG).

## Latest Release

[New features](https://github.com/mfem/mfem/blob/v4.2/CHANGELOG)
┊ [Examples](examples.md)
┊ [Code documentation](http://mfem.github.io/doxygen/html/index.html)
┊ [Sources](https://github.com/mfem/mfem)

[<button type="button" class="btn btn-success">
**Download mfem-4.2.tgz**
</button>](https://bit.ly/mfem-4-2)

[Older releases](download.md) ┊ [Python wrapper](https://github.com/mfem/PyMFEM)

## Documentation

[Building MFEM](building.md)
┊ [Serial Tutorial](serial-tutorial.md)
┊ [Parallel Tutorial](parallel-tutorial.md)
┊ [GPU tips](gpu-support.md)

[Finite Elements](fem.md)
┊ [Electromagnetics](electromagnetics.md)
┊ [Fluids](fluids.md)
┊ [Meshing](meshing-miniapps.md)
┊ [Performance](performance.md)
┊ [Tools](tools.md)

[comment]: # ([Code Overview](code-overview.md))

New users should start by examining the [example codes](examples.md).

We also recommend using [GLVis](http://glvis.org) for visualization.

## Contact

Use the GitHub [issue tracker](https://github.com/mfem/mfem/issues)
to report [bugs](https://github.com/mfem/mfem/issues/new?labels=bug)
or post [questions](https://github.com/mfem/mfem/issues/new?labels=question)
or [comments](https://github.com/mfem/mfem/issues/new?labels=comment).
See the [About](about.md) page for citation information.


</div>

<div class="col-md-12"></div>


[comment]: # (Jul 11, 2020 | MFEM paper [appeared](http://doi.org/10.1016/j.camwa.2020.06.009) in CAMWA.)
[comment]: # (Jun 24, 2020 | MFEM [video](https://www.youtube.com/watch?v=Rpccj3NopSE) available on YouTube.)
[comment]: # (Jun 8, 2020  | ECP [podcast](https://www.exascaleproject.org/major-update-of-the-mfem-finite-element-library-broadens-gpu-support/) about mfem-4.1.)
[comment]: # (Mar 10, 2020 | Version 4.1 [released](https://github.com/mfem/mfem/blob/v4.1/CHANGELOG).)
[comment]: # (Nov 20, 2019 | MFEM overview [paper](http://arxiv.org/abs/1911.09220) available on arXiv.)
[comment]: # (May 24, 2019 | Version 4.0 [released](https://github.com/mfem/mfem/blob/v4.0/CHANGELOG) with initial GPU support.)
[comment]: # (May 10, 2019 | [AMR](http://arxiv.org/abs/1905.04033) and [TMOP](http://arxiv.org/abs/1807.09807) papers available on arXiv.)
[comment]: # (Nov 9, 2018  | MFEM part of the [E4S](https://e4s-project.github.io/) project.)
[comment]: # (May 29, 2018 | Version 3.4 [released](https://github.com/mfem/mfem/blob/v3.4/CHANGELOG).)
[comment]: # (Apr 2, 2018  | [OpenHPC](https://github.com/openhpc/ohpc/releases/tag/v1.3.4.GA) packages available for MFEM.)
[comment]: # (Mar 30, 2018 | CEED-1.0 and libCEED-0.2 [released](http://ceed.exascaleproject.org/news/#software-release-ceed-10).)
[comment]: # (Mar 1, 2018  | MFEM highlighted in [S&TR](https://str.llnl.gov/2018-01/lee).)
[comment]: # (Nov 10, 2017 | Version 3.3.2 [released](https://github.com/mfem/mfem/blob/v3.3.2/CHANGELOG).)
[comment]: # (Oct 16, 2017 | Postdoc position [available](http://careers-llnl.ttcportals.com/jobs/8037517-postdoctoral-research-staff-member) on the MFEM team.)
[comment]: # (Jun 15, 2017 | [Laghos](https://github.com/ceed/Laghos) miniapp released by [CEED](http://ceed.exascaleproject.org).)
[comment]: # (Feb 16, 2017 | Moved main development to GitHub.)
[comment]: # (Jan 28, 2017 | Version 3.3 [released](https://github.com/mfem/mfem/blob/v3.3/CHANGELOG).)
[comment]: # (Dec 15, 2016 | [Postdoc position](http://careers-ext.llnl.gov/jobs/6264056-post-dr-research-staff-1) for [exascale computing](https://exascaleproject.org/2016/11/11/ecp_co-design_centers) with MFEM.)
[comment]: # (Nov 11, 2016 | MFEM part of [ECP](https://exascaleproject.org)'s [CEED](http://ceed.exascaleproject.org) co-design center.)
[comment]: # (Sep 12, 2016 | PyMFEM - a Python wrapper for MFEM [released](https://github.com/MFEM/PyMFEM).)
[comment]: # (Jun 30, 2016 | Version 3.2 released.)
[comment]: # (May 6, 2016  | MFEM packages available in [homebrew](https://github.com/Homebrew/homebrew-science) and [spack](https://github.com/LLNL/spack).)
[comment]: # (Mar 16, 2016 | Postdoc position [available](http://careers-ext.llnl.gov/jobs/5242192-postdoctoral-research-staff-member) on the MFEM team.)
[comment]: # (Mar 9, 2016  | VisIt 2.10.1 [released](http://software.llnl.gov/news/2016/03/09/visit-2.10.1) with MFEM 3.1 support.)
[comment]: # (Mar 4, 2016  | New LLNL OSS [Blog](http://software.llnl.gov/news) and [Twitter](https://twitter.com/LLNL_OpenSource).)
[comment]: # (Feb 16, 2016 | Version 3.1 released.)
[comment]: # (Aug 18, 2015 | Moved to [GitHub](https://github.com/mfem/mfem) and [mfem.org](http://mfem.org).)
[comment]: # (Jan 26, 2015 | Version 3.0 released.)
