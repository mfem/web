# MFEM Videos

A collection of MFEM-related videos, including recorded talks from the MFEM workshops and conference presentations.

## FEM@LLNL Seminars

---

<div class="col-md-6"  markdown="1">

#### Mike Puso (LLNL)
#### *Topics in Immersed Boundary and Contact Methods: Current LLNL Projects and Research*
##### **May 24, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](RasTXV6IYC0)

Many of the most interesting phenomena in solid mechanics occurs at material interfaces. This can be in the form of fluid structure interaction, cracks, material discontinuities, impact etc. Solutions to these problems often require some form of immersed/embedded boundary method or contact or combination of both. This talk will provide a brief overview of different lab efforts in these areas and presents some of the current research aspects and results using from LLNL production codes. Technically speaking, the methods discussed here all require Lagrange multipliers to satisfy the constraints on the interface of overlapping or dissimilar meshes which complicates the solution. Stability and consistency of Lagrange multiplier approaches can be hard to achieve both in space and time. For example, the wrong choice of multiplier space will either be over-constrained and/or cause oscillations at the material interfaces for simple statics problems. For dynamics, many of the basic time integration schemes such as Newmark's method are known to be unstable due to gaps opening and closing. Here we introduce some (non-Nitsche) stabilized multiplier spaces for immersed boundary and contact problems and a structure preserving time integration scheme for long time dynamic contact problems. Finally, I will describe some on-going efforts extending this work.

---

#### Robert Chiodi (UIUC)
#### *CHyPS: An MFEM-Based Material Response Solver for Hypersonic Thermal Protection Systems*
##### **April 16, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](Z7jJZ1Z5gz0)

The University of Illinois at Urbana-Champaign’s Center for Hypersonics and Entry Systems Studies has developed a material response solver, named CHyPS, to predict the behavior of thermal protection systems for hypersonic flight.  CHyPS uses MFEM to provide the underlying discontinuous Galerkin spatial discretization and linear solvers used to solve the equations. In this talk, we will briefly present the physics and corresponding equations governing material response in hypersonic environments. We will also include a discussion on the implementation of a direct Arbitrary Lagrangian-Eulerian approach to handle mesh movement resulting from the ablation of the material surface. Results for standard community test cases developed at a series of Ablation Workshop meetings over the past decade will be presented and compared to other material response solvers. We will also show the potential of high-order solutions for simulating thermal protection system material response.

---

#### Tamas Horvath (Oakland University)
#### *Space-Time Hybridizable Discontinuous Galerkin with MFEM*
##### **March 29, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](v8-EubYMT-A)

Unsteady partial differential equations on deforming domains appear in many real-life scenarios, such as wind turbines, helicopter rotors, car wheels, free-surface flows, etc. We will focus on the space-time finite element method, which is an excellent approach to discretize problems on evolving domains. This method uses discontinuous Galerkin to discretize both in the spatial and temporal directions, allowing for an arbitrarily high-order approximation in space and time. Furthermore, this method automatically satisfies the geometric conservation law, which is essential for accurate solutions on time-dependent domains. The biggest criticism is that the application of space-time discretization increases the computational complexity significantly. To overcome this, we can use the high-order accurate Hybridizable or Embedded discontinuous Galerkin method. Numerical results will be presented to illustrate the applicability of the method for fluid flow around rigid bodies.

---

#### Tobin Isaac (Georgia Tech)
#### *Unifying the Analysis of Geometric Decomposition in FEEC*
##### **March 22, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](edK62yPUtIs)

Two operations take function spaces and make them suitable for finite element computations. The first is the construction of trace-free subspaces (which creates "bubble" functions) and the second is the extension of functions from cell boundaries into cell interiors (which create edge functions with the correct continuity): together these operations define the _geometric decomposition_ of a function space. In finite element exterior calculus (FEEC), these two operations have been treated separately for the two main families of finite elements: full polynomial elements and trimmed polynomial elements. In this talk we will see how one constructor of trace-free functions and one extension operator can be used for both families, and indeed for all differential forms. We will also examine the practicality of these two operators as tools for implementing geometric decompositions in actual finite element codes.

</div><div class="col-md-6"  markdown="1">

#### Raphaël Zanella (UT Austin)
#### *Axisymmetric MFEM-Based Solvers for the Compressible Navier-Stokes Equations and Other Problems*
##### **March 1, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](qCW60wWmv4Y)

An axisymmetric model leads, when suitable, to a substantial cut in the computational cost with respect to a 3D model. Although not as accurate, the axisymmetric model allows to quickly obtain a result which can be satisfying. Simple modifications to a 2D finite element solver allow to obtain an axisymmetric solver. We present MFEM-based parallel axisymmetric solvers for different problems. We first present simple axisymmetric solvers for the Laplacian problem and the heat equation. We then present an axisymmetric solver for the compressible Navier-Stokes equations. All solvers are based on H^1-conforming finite element spaces. The correctness of the implementation is verified with convergence tests on manufactured solutions. The Navier-Stokes solver is used to simulate axisymmetric flows with an analytical solution (Poiseuille and Taylor-Couette) and an air flow in a plasma torch geometry.

---

#### Robert Carson (LLNL)
#### *An Overview of ExaConstit and Its Use in the ExaAM Project*
##### **February 1, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](I0kTJdR8oZU)

As additively manufactured (AM) parts become increasingly more popular in industry, a growing need exists to help expediate the certifying process of parts. The ExaAM project seeks to help this process by producing a workflow to model the AM process from the melt pool process all the way up to the part scale response by leveraging multiple physics codes run on upcoming exascale computing platforms. As part of this workflow, ExaConstit is a next-generation quasi-static, solid mechanics FEM code built upon MFEM used to connect local microstructures and local properties within the part scale response. Within this talk, we will first provide an overview of ExaConstit, how we have ported it over to the GPU, and some performance numbers on a number of different platforms. Next, we will discuss how we have leveraged MFEM and the FLUX workflow to run hundreds of high-fidelity simulations on Summit in-order to generate the local properties needed to drive the part scale simulation in the ExaAM workflow. Finally, we will show case a few other areas ExaConstit has been used in.

</div><div class="col-md-6"  markdown="1">

#### Guglielmo Scovazzi (Duke)
#### *The Shifted Boundary Method: An Immersed Approach for Computational Mechanics*
##### **January 20, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](WJ5dAhOR6Gg)

Immersed/embedded/unfitted boundary methods obviate the need for continual re-meshing in many applications involving rapid prototyping and design. Unfortunately, many finite element embedded boundary methods are also difficult to implement due to the need to perform complex cell cutting operations at boundaries, and the consequences that these operations may have on the overall conditioning of the ensuing algebraic problems. We present a new, stable, and simple embedded boundary method, named “shifted boundary method” (SBM), which eliminates the need to perform cell cutting. Boundary conditions are imposed on a surrogate discrete boundary, lying on the interior of the true boundary interface. We then construct appropriate field extension operators, by way of Taylor expansions, with the purpose of preserving accuracy when imposing the boundary conditions. We demonstrate the SBM on large-scale solid and fracture mechanics problems; thermomechanics problems; porous media flow problems; incompressible flow problems governed by the Navier-Stokes equations (also including free surfaces); and problems governed by hyperbolic conservation laws.

</div><div class="col-md-12"  markdown="1">

## Conferences in 2022

---

</div><div class="col-md-6"  markdown="1">

#### John Camier (LLNL)
#### *All-Out Kernel Fusion: Reaching Peak Performance Faster in High-Order Finite Element Simulations*
##### **March 21–24, 2022** | [NVIDIA GTC22](https://www.nvidia.com/gtc/)

![YouTube](M2a1eW9XMJQ)

LLNL research scientist John Camier described recent improvements of high-order finite element CUDA kernels that can reduce the time-to-solution by a factor of 10. Augmenting traditional compiler representations with a general mathematical description enables a sustainable way to generate optimized kernels, matching the peak performance of hand-tuned CUDA code. Such intermediate graph-based representation provides significant potential for optimization, both in terms of minimizing the number of kernel launches and in reducing the memory bandwidth. Camier also presented results on single and multiple GPUs that demonstrate significant reduction in the local problem size required to reach peak performance, leading to faster time-to-solution in finite element applications.

</div><div class="col-md-12"  markdown="1">

## MFEM Workshop 2021

---

</div><div class="col-md-6"  markdown="1">

#### Aaron Fisher (LLNL)
#### *Wrap-Up and Simulation Contest Winners*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](9WViLXI7wx4)

MFEM’s first community workshop was held virtually on October 20, 2021, with participants around the world.
Aaron Fisher of LLNL concluded the workshop by announcing the results of the simulation and visualization contest. The winners represent two very different research applications using MFEM: (1) the electric field generated by electrocardiogram waves of a rabbit’s heart ventricles, rendered by Dennis Ogiermann of Ruhr-University Bochum (Germany); (2) incompressible fluid flow around a rotating turbine, animated by Tamas Horvath of Oakland University (Michigan). Contest submissions are featured in the [gallery](gallery.md).

---

#### Will Pazner (LLNL)
#### *High-Order Matrix-Free Solvers*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](d6Ic9itl21g)

For users unfamiliar with MFEM’s solver library, Will Pazner of LLNL demonstrated a few ways—in some cases adding just a single line of code—to run scalable solvers for differential equations. These solvers execute hierarchical finite element discretizations for both low- and high-order problems.

---

#### Vladimir Tomov (LLNL)
#### *MFEM Capabilities for High-Order Mesh Optimization*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](c-VcclDfT7Y)

Vladimir Tomov of LLNL described MFEM’s mesh optimization strategies including ways the user can define target elements. He demonstrated optimizing a mesh’s shape by limiting displacements to preserve a boundary layer and by changing the size of a uniform mesh in a specific region. MFEM’s mesh-optimizing miniapps are [available online](https://mfem.org/meshing-miniapps).

---

#### William Dawn (NCSU)
#### *Unstructured Finite Element Neutron Transport using MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](Gfq6HFOpKmA)

William Dawn from North Carolina State University described his work with unstructured neutron transport. His team models microreactors, a new class of compact reactor with relatively small electrical output. As part of the Exascale Computing Project, Dawn’s team is modeling the MARVEL reactor, which is planned for construction at Idaho National Laboratory. MFEM satisfies their need for a finite element framework with GPU support and rapid prototyping. With MFEM, the team discretizes a neutron transport equation with six independent variables in space, direction, and energy.

Traditional neutron transport methods use a “sweeping” method to transport particles through a problem, but this is not feasible for generally unstructured meshes. In Dawn’s models, the Self-Adjoint Angular Flux (SAAF) form of the neutron transport equation is used to transform the neutron transport equation from a first-order hyperbolic form to a second-order elliptic form. Then, the SAAF equations are discretized with the finite element method and solved using MFEM. Due to the dependence of the neutron flux on angle and direction, these problems have a high vector-dimension with hundreds to thousands of degrees of freedom (DOF) per mesh vertex. Also, due to the second-order nature of these equations, highly refined meshes are required to sufficiently resolve reactor geometries with millions of vertices in a mesh. Results have been prepared for problems with billions of DOF using the Summit supercomputer at Oak Ridge National Laboratory.

---

#### Syun’ichi Shiraiwa (PPPL)
#### *Development of PyMFEM Python Wrapper for MFEM & Scalable RF Wave Simulation for Nuclear Fusion*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](8MBXq1PwUV8)

Syun’ichi Shiraiwa of Pacific Northwest National Laboratory introduced PyMFEM, a Python wrapper for MFEM that his team uses in radiofrequency (RF) wave simulations for the RF-SciDAC project. RF waves can be used to heat plasma in a nuclear fusion reaction. Simulations of this process present multiple challenges when incorporating a variety of antenna structures at different frequencies, waves with different wave lengths in the same space or spatially diverse, and RF wave effects on background plasma. To integrate MFEM, a C++ software library, into their multiphysics platform, Shiraiwa’s team created a code “wrapper” that binds MFEM to the external Python components of RF wave simulations, ultimately extending MFEM’s features to Python users. Shiraiwa described how the PyMFEM module works in serial and parallel and invited the audience to contribute to the open-source code.

---

#### Qi Tang (LANL)
#### *An Adaptive, Scalable Fully Implicit Resistive MHD Solver*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](-YPgim5GrqE)

Qi Tang of Los Alamos National Laboratory described his team’s development of an efficient, scalable solver for tokamak plasma simulations. Magnetohydrodynamics (MHD) equations are important for studying plasma systems, but efficient numerical solutions for MHD are extremely challenging due to disparate time and length scales, strong hyperbolic phenomena, and nonlinearity. Tang’s team has developed a high-order stabilized finite element algorithm for incompressible resistive MHD equations based on MFEM, which provides physics-based preconditioners, adaptive mesh refinement, parallelization, and load balancing. Tang showed animated examples of the model’s scalable and efficient results.

---

#### Jan Nikl (ELI Beamlines)
#### *Laser Plasma Modeling with High-Order Finite Elements*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](N7kwS0FdaD8)

Jan Nikl outlined how his team at the ELI Beamlines Centre uses MFEM for laser plasma modeling. Lasers have found their application in many scientific disciplines, where generation of plasma, the fourth state of matter, holds great potential for the future. A detailed description of laser produced plasmas is then essential for many applications, like (pre)pulses of ultra-intense lasers and ion acceleration beamlines, laboratory astrophysics, inertial confinement fusion, and many others. All of the mentioned are investigated at ELI Beamlines in the Czech Republic, a European laser facility aiming to operate the most intense laser system in the world. In this context, Nikl described the numerical construction based on the finite element method. This effort concentrates mainly on the Lagrangian hydrodynamics and Vlasov–Fokker–Planck–Maxwell kinetic description of plasma, utilizing the MFEM library for its flexibility and scalability.

---

#### Mathias Davids (Harvard)
#### *Modeling Peripheral Nerve Stimulations (PNS) in Magnetic Resonance Imaging (MRI)*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](Mkz13lAH9Ak)

Mathias Davids from Harvard Medical School presented MFEM’s use in a medical setting. Peripheral nerve stimulation (PNS) limits the usable image encoding performance in the latest generation of magnetic resonance imaging (MRI) scanners. The rapid switching of the MRI gradient coils’ magnetic fields induces electric fields in the human body strong enough to evoke unwanted action potential in peripheral nerves, leading to muscle contractions or touch perceptions. Despite its limiting role in MRI, PNS effects are not directly included during the coil design phase. Davids’ team developed a modeling tool to predict PNS thresholds and locations in the human body, allowing them to directly incorporate PNS metrics in the numeric coil winding optimization to design PNS-optimized coil layouts. This modeling tool relies on electromagnetic field simulations in heterogeneous finite element body models coupled to neurodynamic models of myelinated nerve fibers. This tool enables researchers to develop strategies that mitigate PNS effects without building expensive prototype MRI systems, maximizing the usable image encoding performance.

</div><div class="col-md-6"  markdown="1">

#### Marc Bolinches (UT)
#### *Development of DG Compressible Navier-Stokes Solver with MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](3T9dQI1SU88)

Marc Bolinches from the University of Texas at Austin described a compressible Navier-Stokes solver using MFEM v4,2 which did not include full support for GPUs. The solver uses the discontinuous Galerkin (DG) method as a space discretization and an explicit Runge-Kutta time-integration scheme. An effort has been made to fully support GPU computation by taking over some of the loops internal to the NonLinearForm class. This has also allowed us to implement overlap between computation and communication. The team hopes their open-source code will help other researchers in creating high-fidelity simulations of compressible flows.

---

#### Robert Rieben (LLNL)
#### *The Multiphysics on Advanced Platforms Project: Performance, Portability and Scaling*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](4BK0-VzM1Po)

High-energy-density physics (HEDP) experiments performed at LLNL and other Department of Energy laboratories require multiphysics simulations to predict the behavior of complex physical systems for applications including inertial confinement fusion, pulsed power, and material strength/equations-of-state studies. Robert Rieben described the variety of mathematical algorithms needed for these simulations, including ALE methods, unstructured adaptive mesh refinement, and high-order discretizations. LLNL’s Multiphysics on Advanced Platforms Project (MAPP) is developing a next-generation multiphysics code, called MARBL, based on high-order numerical methods and modular infrastructure for deployment on advanced HPC architectures. MARBL’s use of high-order methods produce better throughput on GPUs. MARBL uses MFEM for finite elements and mesh/field/operator abstractions while leveraging its support for efficient memory management. Rieben explained that co-design efforts among the MARBL, MFEM, and RAJA (portability software) teams led to better device utilization and improved performance for the MARBL code.

---

#### Felipe Gómez, Carlos del Valle, & Julián Jiménez (National University of Colombia)
#### *Phase Change Heat and Mass Transfer Simulation with MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](OPRIpc2o_EA)

Three undergraduate students—Felipe Gómez, Carlos del Valle, and Julián Jiménez—from the National University of Colombia presented their work using MFEM in an oceanographic model. Below the Arctic sea ice, and under the right conditions, a flux of icy brine flows down into the sea. The icy brine has a much lower fusion point and a higher density than normal seawater. As a result, it sinks while freezing everything around it, forming an ice channel called a brinicle (also known as ice stalactite). The team shared their simulations of this phenomenon assuming cylindrical symmetry. The fluid is considered viscous and quasi-stationary, and the problem is simulated taking advantage of the setup symmetries. The heat and salt transport are weakly coupled to the fluid motion and are modeled with the corresponding conservation equations, taking into account diffusive and convective effects. The coupled system of partial differential equations is discretized and solved with the help of the MFEM finite element library.

---

#### Thomas Helfer (CEA)
#### *MFEM-MGIS-MFront, a MFEM-Based Library for Nonlinear Solid Thermomechanic*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](K6HrhFWdfx8)

Thomas Helfer from the French Atomic Energy Commission (CEA) introduced the MFEM-MGIS-MFront library (MMM), which aims for efficient use of supercomputers in the field of implicit nonlinear thermomechanics. His team’s primary focus is to develop advanced nuclear fuel element simulations where the evolution of materials under irradiation are influenced by multiple phenomena (e.g., viscoplasticity, damage, phase transitions, swelling due to solid and gaseous fission products). MFEM provides this project with finite element abstractions, adaptive mesh refinement, and a parallel API. However, as applications dedicated to solid mechanics in MFEM are mostly limited to a few constitutive equations such as elasticity and hyperelasticity, Helfer explained that his team extended the software’s functionality to cover a broader spectrum of mechanics. Thus, this MMM project combines MFEM with the MFrontGenericInterfaceSupport (MGIS), an open-source C++ library that provides data structures to support arbitrarily complex nonlinear constitutive equations generated by the MFront code generator. MMM is developed within the scope of CEA’s PLEIADES project. Helfer’s presentation provided (1) an introduction to MMM goals; (2) a tutorial of MMM usage with a focus on the high-level user interface; (3) an overview of the core design choices of MMM and how MFEM was extended to support a range of scenarios; and (4) feedback on the two main issues encountered during MMM development.

---

#### Jamie Bramwell (LLNL)
#### *Serac: User-Friendly Abstractions for MFEM-Based Engineering Applications*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](EHUID3fnHwU)

Jamie Bramwell of LLNL presented an overview of the open-source [Serac project](https://serac.readthedocs.io/en/latest), whose goal is to provide user-friendly abstractions and modules that enable rapid development of complex nonlinear multiphysics simulation codes. She provided an overview of both the high-level physics modules (thermal conduction, solid mechanics, incompressible flow, electromagnetics) as well as the serac::Functional framework for quickly developing nonlinear GPU-enabled finite element method kernels.

---

#### Veselin Dobrev (LLNL)
#### *Recent Developments in MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](oUk6tkHWjI4)

Veselin Dobrev of LLNL detailed the project’s recent developments including memory manager improvements; serial support for p- and hp-refinement; high-order/low-order refined solution transfer; GLVis visualization via Jupyter Notebooks; and additional GPU support regarding HYPRE preconditioners, PETSc tools, and mesh optimization. MFEM now also integrates with various new libraries (AmgX, Gingko, FMS, and others), and continuous integration testing has been conducted on LLNL’s Quartz, Lassen, and Corona machines. Additionally, Dobrev summarized MFEM’s integrations with other software libraries and the team’s engagements with the Exascale Computing Project, SciDAC, the FASTMath Institute, and other projects.

---

#### Tzanio Kolev (LLNL)
#### *The State of MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop)

![YouTube](p4u4AlUhamY)

MFEM principal investigator Tzanio Kolev described the project’s past, present, and future with an emphasis on its key capabilities of discretization algorithms, built-in solvers, parallel scalability, adaptive mesh refinement, and support for a range of computing architectures. Kolev also highlighted the global community’s contributions as well as features included in the recent v4.3 software release.

---

#### Aaron Fisher (LLNL)
#### *Welcome and Overview*
##### **October 20, 2021** | [MFEM Workshop 2021](https://mfem.org/workshop/)

![YouTube](534cBuede4w)

The MFEM community workshop held virtually on October 20, 2021, brought together users and developers for a review of software features and the development roadmap, a showcase of technical talks and applications, collaborative breakout sessions, and a simulation contest. Aaron Fisher of LLNL kicked off the event with an overview of the workshop agenda, participant demographics, and community survey results.

</div><div class="col-md-12"  markdown="1">

## Conferences in 2021

---

</div><div class="col-md-6"  markdown="1">

#### Tzanio Kolev (LLNL)
#### *Efficient Finite Element Discretizations for Exascale Applications*
##### **February 25, 2021** | [ExCALIBUR SLE 3 workshop](https://excalibur-sle.github.io/)

![YouTube](lsBSctsSMFY)

</div><div class="col-md-12"  markdown="1">

## ATPESC 2017, 2018

---

</div><div class="col-md-6"  markdown="1">

#### Tzanio Kolev (LLNL), Mark Shephard (RPI) and Cameron Smith (RPI)
#### *Unstructured Meshing Technologies*
##### **August 6, 2018** | [ATPESC 2018](https://extremecomputingtraining.anl.gov/)

![YouTube](Zh6pFjkmr0g)

Presented at the Argonne Training Program on Extreme-Scale Computing 2018.
Slides for this presentation are available [here](https://extremecomputingtraining.anl.gov/files/2018/08/ATPESC_2018_Track-4_5_8-6_11am_Kolev-Shephard-Smith-Unstructured_Meshing_Technologies.pdf).

---

#### Tzanio Kolev (LLNL) and Mark Shephard (RPI)
#### *Unstructured Meshing Technologies*
##### **August 7, 2017** | [ATPESC 2017](https://extremecomputingtraining.anl.gov/)

![YouTube](eJ6hRN7TeEU)

Presented at the Argonne Training Program on Extreme-Scale Computing 2017.
Slides for this presentation are available [here](https://extremecomputingtraining.anl.gov/files/2017/08/ATPESC_2017_Track-4_07_8-7_1145am_Kolev-Shephard-Unstructured_Mesh_Technologies.pdf).

</div><div class="col-md-6"  markdown="1">

#### Tzanio Kolev (LLNL) and Mark Shephard (RPI)
#### *Conforming & Nonconforming Adaptivity for Unstructured Meshes*
##### **August 7, 2017** | [ATPESC 2017](https://extremecomputingtraining.anl.gov/)

![YouTube](RLIZWXggXqU)

Presented at the Argonne Training Program on Extreme-Scale Computing 2017.
Slides for this presentation are available [here](https://extremecomputingtraining.anl.gov/files/2017/08/ATPESC_2017_Track-4_13_8-7_630pm_Kolev-Shephard-Adaptivity_for_Unstructured_Meshes.pdf).

</div><div class="col-md-12"  markdown="1">

## Other Videos

---

</div><div class="col-md-6"  markdown="1">

#### *MFEM: Advanced Simulation Algorithms for HPC Applications*
##### **Jun 24, 2020** | [YouTube](https://www.youtube.com/watch?v=Rpccj3NopSE)

![YouTube](Rpccj3NopSE)

Overview of MFEM 4.0 featuring some of its developers.

---

#### *Center for Applied Scientific Computing*
##### **Jul 12, 2019** | [YouTube](https://www.youtube.com/watch?v=5CIeSLWs7hI&t=45s)

![YouTube](5CIeSLWs7hI)

Overview of the Center for Applied Scientific Computing at Lawrence Livermore National Laboratory, including a highlight of MFEM.

</div><div class="col-md-6"  markdown="1">

#### *S&TR Preview: Exascale Computing*
##### **October 6, 2016** | [YouTube](https://www.youtube.com/watch?v=ePWyiDf_XTg&t=172s)

![YouTube](ePWyiDf_XTg)

Some early MFEM results in the [BLAST](https://computing.llnl.gov/projects/blast) project.

</div>
