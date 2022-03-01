<div class="col-md-12"  markdown="1">

# FEM@LLNL Seminar Series

We are happy to announce a new FEM@LLNL seminar series, starting in 2022, which will focus on finite element research and applications talks of interest to the MFEM community. We have lined up some excellent speakers for our first year and plan to keep adding more. Videos will be added to a [YouTube playlist](https://www.youtube.com/playlist?list=PLy9rIbGDXrG1Lfy3Um-KEPqFae7Ipghqj) as well as this site's [videos page](videos.md).


### <i class="fa fa-envelope-o" aria-hidden="true"></i> Sign-Up

Fill in [this form](https://docs.google.com/forms/d/e/1FAIpQLScrJ9QT7v7abx2ELcETKJnhWaU7_Wa2V3d7WIPdf3_JYK4JmA/viewform?usp=sf_link) to sign-up for future FEM@LLNL seminar announcements.

### <i class="fa fa-star"></i> Next Talk

</div><div class="col-md-3"  markdown="1">

![](img/seminar/zanella.jpg)

</div><div class="col-md-12"  markdown="1">

#### Raphaël Zanella (UT Austin)
##### *Axisymmetric MFEM-based solvers for the compressible Navier-Stokes equations and other problems*
##### [**9am PDT, March 1, 2022**](https://everytimezone.com/s/f34b1e90)
[<button type="button" class="btn btn-success">
**WebEx**
</button>](https://llnlfed.webex.com/meet/kolev1)

**Abstract:** An axisymmetric model leads, when suitable, to a substantial cut in the computational cost with respect to a 3D model. Although not as accurate, the axisymmetric model allows to quickly obtain a result which can be satisfying. Simple modifications to a 2D finite element solver allow to obtain an axisymmetric solver. We present MFEM-based parallel axisymmetric solvers for different problems. We first present simple axisymmetric solvers for the Laplacian problem and the heat equation. We then present an axisymmetric solver for the compressible Navier-Stokes equations. All solvers are based on H^1-conforming finite element spaces. The correctness of the implementation is verified with convergence tests on manufactured solutions. The Navier-Stokes solver is used to simulate axisymmetric flows with an analytical solution (Poiseuille and Taylor-Couette) and an air flow in a plasma torch geometry.

---

### <i class="fa fa-check" aria-hidden="true"></i> Previous Talks

</div><div class="col-md-3"  markdown="1">

![](img/seminar/carson.jpg)

</div><div class="col-md-12"  markdown="1">

#### Robert Carson (LLNL)
##### *An overview of ExaConstit and its use in the ExaAM project*
##### February 1, 2022
[<button type="button" class="btn btn-primary">
**Slides**
</button>](pdf/seminar/carson.pdf)
&nbsp;&nbsp;
[<button type="button" class="btn btn-success">
**Talk Recording**
</button>](https://www.youtube.com/watch?v=I0kTJdR8oZU&list=PLy9rIbGDXrG1Lfy3Um-KEPqFae7Ipghqj&index=2)

**Abstract:** As additively manufactured (AM) parts become increasingly more popular in industry, a growing need exists to help expediate the certifying process of parts. The ExaAM project seeks to help this process by producing a workflow to model the AM process from the melt pool process all the way up to the part scale response by leveraging multiple physics codes run on upcoming exascale computing platforms. As part of this workflow, ExaConstit is a next-generation quasi-static, solid mechanics FEM code built upon MFEM used to connect local microstructures and local properties within the part scale response. Within this talk, we will first provide an overview of ExaConstit, how we have ported it over to the GPU, and some performance numbers on a number of different platforms. Next, we will discuss how we have leveraged MFEM and the FLUX workflow to run hundreds of high-fidelity simulations on Summit in-order to generate the local properties needed to drive the part scale simulation in the ExaAM workflow. Finally, we will show case a few other areas ExaConstit has been used in.

</div><div class="col-md-3"  markdown="1">

![](img/seminar/scovazzi.jpg)

</div><div class="col-md-12"  markdown="1">

####  Guglielmo Scovazzi (Duke University)
##### *The Shifted Boundary Method: An Immersed Approach for Computational Mechanics*
##### January 20, 2022
[<button type="button" class="btn btn-primary">
**Slides**
</button>](pdf/seminar/scovazzi.pdf)
&nbsp;&nbsp;
[<button type="button" class="btn btn-success">
**Talk Recording**
</button>](https://www.youtube.com/watch?v=WJ5dAhOR6Gg&list=PLy9rIbGDXrG1Lfy3Um-KEPqFae7Ipghqj&index=1)

**Abstract:** Immersed/embedded/unfitted boundary methods obviate the need for continual re-meshing in many applications involving rapid prototyping and design. Unfortunately, many finite element embedded boundary methods are also difficult to implement due to the need to perform complex cell cutting operations at boundaries, and the consequences that these operations may have on the overall conditioning of the ensuing algebraic problems. We present a new, stable, and simple embedded boundary method, named “shifted boundary method” (SBM), which eliminates the need to perform cell cutting. Boundary conditions are imposed on a surrogate discrete boundary, lying on the interior of the true boundary interface. We then construct appropriate field extension operators, by way of Taylor expansions, with the purpose of preserving accuracy when imposing the boundary conditions. We demonstrate the SBM on large-scale solid and fracture mechanics problems; thermomechanics problems; porous media flow problems; incompressible flow problems governed by the Navier-Stokes equations (also including free surfaces); and problems governed by hyperbolic conservation laws.

---

### <i class="fa fa-calendar" aria-hidden="true"></i> Future Talks

&nbsp;

#### Tamas Hovarth (Oakland University)
##### *Space-Time Hybridizable Discontinuous Galerkin with MFEM*
##### **March 29, 2022**

---

#### Robert Chodi (UIUC)
##### *CHyPS: An MFEM-Based Material Response Solver for Hypersonic Thermal Protection Systems*
##### **April 26, 2022**

---

#### Mike Puso (LLNL)
##### *Topics in immersed boundary and contact interface methods*
##### **May 24, 2022**

---

#### Paul Fischer (UIUC)
##### *Outlook for Exascale Fluid Dynamics Simulations*
##### **June 21, 2022**

---

#### Victoria Korchogova (Russian Academy of Sciences)
##### *On Using of AMR Algorithms for Solving Gas Dynamics Problems by RKDG Method*
##### **July 19, 2022**

---

#### Dennis Ogiermann (University of Bochum)
##### *Computing meets Cardiology: Making heart simulations fast and accurate*
##### **September 13, 2022**

---

#### Clark Dohrmann (SNL)
##### *High-Order Finite Elements and Applications to Elastic Wave Propagation*
##### **October 11, 2022**

---

#### Garth Wells (University of Cambridge)
##### *FEniCSx: design of the next generation FEniCS libraries for finite element methods*
##### **November 8, 2022**

---

&nbsp;

</div>
