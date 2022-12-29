# MFEM in the Real World

The MFEM software library provides advanced finite element discretization methods to many high-performance computing (HPC) applications in the Department of Energy, academia, and industry. In the decade-plus since being released as open source, MFEM’s [capabilities](features.md) have grown to include dynamic adaptive mesh refinement, mesh optimization, high-order methods, scalable solvers, GPU support, and more. Today the project has over 120 contributors, 150 GitHub visitors per day, and 180 downloads per day.

Below are examples of MFEM’s usage in the global community. Contribute your usage of MFEM by referring to the [project template](https://github.com/mfem/web/tree/master/template/project.md) and [opening a PR](https://github.com/mfem/web/pulls).

## Center for Efficient Exascale Discretizations

<img src="../img/ceed-ho-spaces.png" align="left" style="margin-top: 2px; margin-right: 10px" width="225" alt="2x3 grid of warped squares patterned with dots and lines">

[CEED](https://ceed.exascaleproject.org/) is a co-design center within the U.S. Department of Energy’s [Exascale Computing Project](https://www.exascaleproject.org/). This research partnership involves 30+ computational scientists from two DOE labs and five universities, including members of the Nek5000, MFEM, MAGMA, OCCA, and PETSc projects. CEED produces a range of software products supporting general finite element algorithms on triangular, quadrilateral, tetrahedral and hexahedral meshes in 3D, 2D and 1D. The project provides efficient matrix-free operator evaluation for any order space on any order mesh, including high-order curved meshes and all geometries in the de Rham complex. MFEM is a main component of CEED’s efforts in the [Applications](https://ceed.exascaleproject.org/ap/) and [Finite Element](https://ceed.exascaleproject.org/fe/) thrusts.

- [CEED participating organizations](https://ceed.exascaleproject.org/about/)
- [CEED software releases](https://ceed.exascaleproject.org/news/)

## Rodin (Université Grenoble Alpes)

<img src="../img/rodin.png" align="left" style="margin-top: 2px; margin-right: 10px" width="225" alt="colorful simulation on a complex mesh">

[Rodin](https://cbritopacheco.github.io/rodin/) is a lightweight, modular shape, density, and topology optimization framework written in C++, enabling the rapid prototyping of shape optimization algorithms. Rodin provides many of the associated functionalities needed when implementing shape and topology optimization algorithms. These functionalities range from refining and remeshing the underlying shape, to providing elegant mechanisms to specify and solve variational problems. Rodin allows for easy specification and resolution of variational problems, provides uniform class interfaces and transparent conversions between different types of meshes and grid functions, enforces semantic rules related to weak formulations, and adds functionalities of its own on top of wrapped classes. The software library uses MFEM for solving and assembling the linear systems related to the weak formulations.

- [Rodin examples and tutorials](https://cbritopacheco.github.io/rodin/examples-index.html)
- 2022 MFEM workshop: Carlos Brito Pacheco presents *Rodin: Lightweight and Modern C++17 Shape, Density and Topology Optimization Framework* ([PDF](pdf/workshop22/05_BritoPacheco_Rodin.pdf), [video](https://youtu.be/ZhfDFRJjnU0))

## Wellbore Stability Analysis (OpenSim Technology)

<img src="../img/wellbore.png" align="left" style="margin-top: 2px; margin-right: 10px" width="225" alt="cylindrical wellbore surrounded by a rainbow-colored mesh on gray 3D grid">

[OpenSim Technology](https://opensim.technology/) models subsurface wellbores to prevent collapse. The project’s equations solve for mechanical equilibrium linear elasticity, using PyMFEM to implement the solution. OpenSim’s synthetic well model requires a refined mesh around the wellbore itself to accurately capture stress points, then a coarser mesh farther away from that focal point. The model can compute a second grid of concentric rings, which depict stresses around the cylindrical wellbore and identify failure zones. The team has implemented performance speedups with parallel processing, and they are working on a web app for engineers to use in the field.

- [OpenSim Technology’s publications](https://opensim.technology/publications)
- [OpenSim Technology’s test cases](https://opensim.technology/test-cases)
- 2022 MFEM workshop: Adolfo Rodriguez presents *Using MFEM for Wellbore Stability Analysis* ([PDF](pdf/workshop22/15_Rodriguez_Wellbore.pdf), [video](https://youtu.be/gBEApU1V_80))

