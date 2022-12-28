# MFEM Videos

A collection of MFEM-related videos, including recorded talks from the MFEM workshops and conference presentations.

<div class="col-md-12"  markdown="1">

## MFEM Workshop 2022

---

</div><div class="col-md-6"  markdown="1">

#### Aaron Fisher (LLNL)
#### *Welcome and Overview*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](vaAA9zB1IQ8)

Held on October 25, 2022, the second annual MFEM community workshop brought together users and developers for a review of software features and the development roadmap, a showcase of technical talks and applications, an interactive Q&A session, and a visualization contest. Aaron Fisher of LLNL kicked off the event with an overview of the workshop agenda, participant demographics, and community survey results.

---

#### Tzanio Kolev (LLNL)
#### *The State of MFEM*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](I4pLPBYFR8o)

MFEM principal investigator Tzanio Kolev described the project’s past, present, and future with an emphasis on its key capabilities (including adaptive mesh refinement, GPU support, and FEM operator decomposition and partial assembly), examples, and mini-apps. Kolev also highlighted the growth of the global community as well as features included in the recent v4.5 software release.

---

#### Veselin Dobrev (LLNL)
#### *Recent Developments in MFEM*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](pZQP0Q4SbWU)

Veselin Dobrev of LLNL detailed the project’s recent developments including sub-mesh extraction, linear form assembly on GPUs, coefficient evaluation on GPUs, new mini-apps and examples, Windows 2022 CI testing on GitHub, and more. He also summarized MFEM’s integrations with other software libraries and the team’s engagements with the Extreme-scale Scientific Software Development Kit, SciDAC, and the FASTMath Institute.

---

#### Ben Zwick (University of Western Australia)
#### *Solution of the Electroencephalography (EEG) Forward Problem*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](2BgDwwCERm8)

Ben Zwick of the University of Western Australia presented "Solution of the Electroencephalography (EEG) Forward Problem." The brain's electrical activity can be measured using EEG with electrodes attached to the scalp, or electrocorticography (ECoG), also known as intracranial EEG (iEEG), with electrodes implanted on the brain's surface. EEG source localization combines measurements from EEG or iEEG with data from medical imaging to estimate the location and strengths of the current sources that generated the measured electric potential at the electrodes. Source localization can be used to locate the epileptic zone in pharmaco-resistant focal epilepsies and study evoked related potentials. Accurate source localization requires fast and accurate solutions of the EEG forward problem, which involves calculating the electric potential within the brain volume given a predefined source. This presentation demonstrates how MFEM can be used to solve the EEG forward problem using patient-specific geometry and tissue conductivity obtained from medical images.

---

#### Carlos Brito Pacheco (Université Grenoble Alpes)
#### *Rodin: Density and Topology Optimization Framework*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](ZhfDFRJjnU0)

Carlos Brito Pacheco of Université Grenoble Alpes presented "Rodin: Lightweight and Modern C++17 Shape, Density and Topology Optimization Framework." He introduced the shape optimization library Rodin; a lightweight and modular shape optimization framework which provides many of the associated functionalities that are needed when implementing shape and topology optimization algorithms. These functionalities range from refining and remeshing the underlying shape, to providing elegant mechanisms to specify and solve variational problems. Learn more about [Rodin on GitHub](https://cbritopacheco.github.io/rodin/).

---

#### Alvaro Sánchez Villar (Princeton Plasma Physics Laboratory)
#### *MFEM Application to EM-Wave Simulation in ECR Space Plasma Thrusters*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](PgsQwKFq9Yo)

Alvaro Sánchez Villar of the Princeton Plasma Physics Laboratory presented "MFEM Application to EM-Wave Simulation in ECR Space Plasma Thrusters." The solution of Maxwell equations using the cold-plasma approximation is shown in the context of the design of electron cyclotron resonance plasma thrusters for space propulsion applications. This thruster class utilizes the electron cyclotron resonance to energize the plasma constituents and to sustain the plasma discharge. MFEM finite element discretization is used to solve for the time-harmonic electromagnetic waves. The shape and magnitude of the electromagnetic power density absorbed by the plasma is coupled to the plasma transport variables, and therefore determines the thruster operation performance parameters. Coupled simulations of the electromagnetic-wave and the plasma transport problems are used to interpret thruster operational principles, to understand its sensitivity to operational and design parameters, and compared to experimental measurements to both assess the accuracy of the current numerical model and to highlight its main limitations.

---

#### Brian Young
#### *OpenParEM2D: A 2D Simulator for Guided Waves*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](_CqFJUu7E8E)

Independent software developer Brian Young presented "OpenParEM2D: A Free, Open-Source Electromagnetic Simulator for 2D Waveguides and Transmission Lines." An overview is provided on a 2D electromagnetic simulator for guided waves called OpenParEM2D. It is an open-source and free project licensed under GPLv3 or later and released at its [website](https://openparem.org). Capabilities and methodology are presented.

---

#### Christina Migliore (MIT)
#### *The Development of the EM RF-Edge Interactions Mini-app “Stix” Using MFEM*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](44VeX-AVxU8)

Christina Migliore of MIT presented "The Development of the EM RF-Edge Interactions Mini-App Stix Using MFEM." Ion cyclotron radio frequency range (ICRF) power plays an important role in heating and current drive in fusion devices. However, experiments show that in the ICRF regime there is a formation of a radio frequency (RF) sheath at the material and antenna boundaries that influences sputtering and power dissipation. Given the size of the sheath relative to the scale of the device, it can be approximated as a boundary condition (BC). Electromagnetic field solvers in the ICRF regime typically treat material boundaries as perfectly conducting, thus ignoring the effect of the RF sheath. Here it is described progress of implementing a model for the RF sheath based on a finite impedance sheath BC formulated by J. Myra and D. A. D’Ippolito, Physics of Plasmas 22 (2015) which provides a representation of the RF rectified sheath including capacitive and resistive effects. This research will discuss the results from the development of a parallelized cold-plasma wave equation solver Stix that implements this non-linear sheath impedance BC through the method of finite elements in pseudo-1D and pseudo-2D using the MFEM library.

</div><div class="col-md-6"  markdown="1">

#### Will Pazner (Portland State University)
#### *High-Order Solvers + GPU Acceleration*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](dIC7d1q27hM)

Will Pazner of Portland State University presented "High-Order Solvers + GPU Acceleration." He discussed the benefits of high-order (HO) methods in modeling under-resolved physics and on modern computing architectures, acknowledging that solving HO finite element problems remains challenging. His talk included details about how MFEM supports matrix-free solvers for HO methods, HO operator setup and application, low-order-refined (LOR) preconditioning and matrix assembly, LOR assembly throughput on GPUs (including CPU and GPU comparisons and parallel scalability), and LOR adaptive mesh refinement preconditioning.

---

#### Jorge-Luis Barrera (LLNL)
#### *Shape and Topology Optimization Powered by MFEM*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](eD6Xr2jRrss)

Jorge-Luis Barrera of LLNL presented "Shape and Topology Optimization Powered by MFEM." He discussed the Livermore Design Optimization (LiDO) code, which solves optimization problems for a wide range of Lab-relevant engineering applications. Leveraging MFEM and the LLNL-developed engineering simulation code Serac, LiDO delivers a powerful suite of design tools that run on HPC systems. The talk highlighted several design examples that benefit from LiDO’s integration with MFEM, including multi-material geometries, octet truss lattices, and a concrete dam under stress. LiDO’s graph architecture that seamlessly integrates MFEM features ensures robust topology optimization, as well as shape optimization using nodal coordinates and level set fields as optimization variables.

---

#### Siu Wun Cheung (LLNL)
#### *Reduced Order Modeling for FE Simulations with MFEM & libROM*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](QfczefW8Xgk)

Siu Wun Cheung of LLNL presented "Reduced Order Modeling for Finite Element Simulations Through the Partnership of MFEM and libROM." MFEM provides a wide variety of mesh types and high-order finite element discretizations. However, subject to the model complexity and fine resolution of the discretization, the computational cost can be high, requiring a long time to complete a single forward simulation. In this talk, we will introduce various reduced order modeling techniques, which aim to lower the computational complexity and maintain good accuracy, including intrusive projection-based model reduction and non-intrusive approaches. We will demonstrate the use of reduced order modeling techniques in libROM (www.librom.net), which can be applied to various MFEM examples, including the Poisson problem, linear elasticity, linear advection, mixed nonlinear diffusion, nonlinear elasticity, nonlinear heat conduction, Euler equation, and optimal control problems.

---

#### Devlin Hayduke (ReLogic Research)
#### *Accelerated Deployment of MFEM Based Solvers in Large Scale Industrial Problems*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](JT3RwzEeq8k)

Devlin Hayduke of ReLogic Research presented "Project Minerva: Accelerated Deployment of MFEM Based Solvers in Large Scale Industrial Problems." While many Advanced Scientific Computing Research (ASCR) supported software packages are open source, they are often complicated to use, distributed primarily in source-code form targeting HPC systems, and potential adopters lack options for purchasing commercial support, training, and custom-development services. In response to this need, ReLogic Research, Inc., in collaboration with LLNL, is developing a secure, cloud deployable platform based on the MFEM software termed Minerva. Minerva will feature an integration layer allowing users of commercially available finite element pre/post-processing software (e.g., Abaqus/CAE, Hypermesh, Femap) for use with the Abaqus solver to run simulation studies with the MFEM discretization library and will strengthen further MFEM implemented solvers to make them applicable for solving large scale industrial design and optimization problems.

---

#### Synthetik Applied Technologies
#### *blastFEM: GPU-Accelerated, High-Performance, Energy-Efficient Solver*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](tzQUlm0hlvE)

Tim Brewer, Ben Shields, Peter Vonk, Jeff Heylmun, and Barlev Raymond of Synthetik Applied Technologies presented "blastFEM: A GPU-Accelerated, Very High-Performance and Energy-Efficient Solver for Highly Compressible Flows." Highly compressible multiphase and reactive flows are important, and manifest across a myriad of practical applications: novel energy production and propulsion methods, building design, safety and energy efficiency, material discovery, and maintenance of our nuclear arsenal. There are, however, few tools available to industry capable of simulating these flows at a resolution and scale suitable make predictions of adequate detail—at least within reasonable timeframes and budgetary constraints—to inform engineers and designers. A next generation, highly efficient simulation code is needed that can deliver results within useful timeframes, with sufficient detail to be useful to support simulation-driven design, discovery, and optimization. Furthermore, the code must be designed to run on modern and emerging heterogeneous architectures, and can efficiently leverage these architectures though the use of numerical schemes designed to maximized computational efficiency.

---

#### Adolfo Rodriguez (OpenSim Technology)
#### *Using MFEM for Wellbore Stability Analysis*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](gBEApU1V_80)

Adolfo Rodriguez of OpenSim Technology presented "Using MFEM for Wellbore Stability Analysis." He discussed the results from a Department of Energy Small Business Innovation Research project regarding the implementation of wellbore stability analysis for hydrocarbon producing wells.

---

#### Julian Andrej (LLNL)
#### *AWS Tutorial*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](tsr6vza_7DM)

In this tutorial, Julian Andrej of LLNL demonstrated how to use MFEM in the cloud (e.g., an Amazon Web Services instance) for scalable finite element discretization application development. Step-by-step instructions for the tutorial can be found on the [tutorial page](https://mfem.org/tutorial/).

---

#### Aaron Fisher (LLNL)
#### *Wrap-Up and Simulation Contest Winners*
##### **October 25, 2022** | [MFEM Workshop 2022](workshop.md)

![YouTube](7uExaQm8Dmk)

Aaron Fisher of LLNL concluded the workshop by announcing the winners of the simulation and visualization contest: (1) streamlines of the electric field generated by a current dipole source located in the temporal lobe of an epilepsy patient, rendered by Ben Zwick of the University of Western Australia; (2) a topology-optimized heat sink, rendered by Tobias Duswald of CERN/Technical University of Munich; (3) the magnetic field induced by current running through copper wire in air, rendered by Will Pazner of Portland State University. Contest winners are featured in the MFEM [gallery](gallery.md).

</div><div class="col-md-12"  markdown="1">

## FEM@LLNL Seminars

---

</div><div class="col-md-6"  markdown="1">

#### Garth Wells (University of Cambridge)
#### *FEniCSx: design of the next generation FEniCS libraries for finite element methods*
##### **November 8, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](D-YcVd4-_2E)

The [FEniCS Project](https://fenicsproject.org/) provides libraries for solving partial differential equations using the finite element method. An aim of the FEniCS Project has been to provide high-performance solver environments that closely mirror mathematical syntax, with the hypothesis that high-level representations means that solvers are faster to write, easier to debug, and can deliver faster runtime performance than is reasonably possible by hand. Using domain-specific languages and code generation techniques, arguably the FEniCS libraries delivered on these goals for a set of problems. However, over time limitations, including performance and extensibility, become clear and maintainability/sustainability became an issue.Building on experiences from the FEniCS libraries, I will present and discuss the design on the next generation of tools, FEniCSx. The new design retains strengths of the past approach, and addresses limitations using new designs and new tools. Solvers can be written in C++ or Python, and a number of design changes allow the creation of flexible, fast solvers in Python. In the second part of my presentation, I will discuss high-performance finite element kernels (limited to CPUs on this occasion), motivated by the Center for Efficient Exascale Discretizations 'bake-off' problems, and which would not have been possible in the original FEniCS libraries. Double, single and half-precision kernels are considered, and results include (i) the observation that kernels with vector intrinsics can be slower than auto-vectorised kernels for common cases, and (ii) a cache-aware performance model which is remarkably accurate in predicting performance across architectures.

---

#### Dennis Ogiermann (University of Bochum)
#### *Computing Meets Cardiology: Making Heart Simulations Fast and Accurate*
##### **September 13, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](h0tviC32kE8)

Heart diseases are an ubiquitous societal burden responsible for a majority of deaths world wide. A central problem in developing effective treatments for heart diseases is the inherent complexity of the heart as an organ. From a modeling perspective, the heart can be interpreted as a biological pump involving multiple physical fields, namely fluid and solid mechanics, as well as chemistry and electricity, all interacting on different time scales. This multiphysics and multiscale aspect makes simulations inherently expensive, especially when approached with naive numerical techniques. However, computational models can be extraordinarily useful in helping us understanding how the healthy heart functions and especially how malfunctions influence different diseases. In this context, also information about possible weaknesses of therapies can be obtained to ultimately improve clinical treatment and decision support. In this talk, we will focus primarily on two important model classes in computational cardiology and their respective efficient numerical treatment without compromising significant accuracy. The first class is the problem of computing electrocardiograms (ECG) from electrical heart simulations. Since ECG measurements can give a wide range of insights about a wide range of heart diseases they offer suitable data to validate our electrophysiological models and verify our numerical schemes on organ-scale. Known numerical issues, arising in the context of electrophysiological models, will be reviewed. The second class addresses bidirectionally coupled electromechanical models and their efficient numerical treatment. Focus will be on a unified space-time adaptive operator splitting framework developed on top of MFEM which proves highly efficient so far for the investigated model classes while still preserving high accuracy.

---

#### Ricardo Vinuesa (KTH)
#### *Modeling and Controlling Turbulent Flows through Deep Learning*
##### **August 23, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](0_y70sNTcrY)

The advent of new powerful deep neural networks (DNNs) has fostered their application in a wide range of research areas, including more recently in fluid mechanics. In this presentation, we will cover some of the fundamentals of deep learning applied to computational fluid dynamics (CFD). Furthermore, we explore the capabilities of DNNs to perform various predictions in turbulent flows: we will use convolutional neural networks (CNNs) for non-intrusive sensing, i.e. to predict the flow in a turbulent open channel based on quantities measured at the wall. We show that it is possible to obtain very good flow predictions, outperforming traditional linear models, and we showcase the potential of transfer learning between friction Reynolds numbers of 180 and 550. We also discuss other modelling methods based on autoencoders (AEs) and generative adversarial networks (GANs), and we present results of deep-reinforcement-learning-based flow control.

---

#### Jeffrey Banks (RPI)
#### *Efficient Techniques for Fluid Structure Interaction: Compatibility Coupling and Galerkin Differences*
##### **July 26, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](l_Ds7jfTBUU)

Predictive simulation increasingly involves the dynamics of complex systems with multiple interacting physical processes. In designing simulation tools for these problems, both the formulation of individual constituent solvers, as well as coupling of such solvers into a cohesive simulation tool must be addressed. In this talk, I discuss both of these aspects in the context of fluid-structure interaction, where we have recently developed a new class of stable and accurate partitioned solvers that overcome added-mass instability through the use of so-called compatibility boundary conditions. Here I will present partitioned coupling strategies for incompressible FSI. One interesting aspect of CBC-based coupling is the occurrence of nonstandard and/or high-derivative operators, which can make adoption of the techniques challenging, e.g. in the context of FEM methods. To address this, I will also discuss our newly developed Galerkin Difference approximations, which may provide a natural pathway for CBCs in an FEM context. Although GD is fundamentally a finite element approximation based on a Galerkin projection, the underlying GD space is nonstandard and is derived using profitable ideas from the finite difference literature. The resulting schemes possess remarkable properties including nodal superconvergence and the ability to use large CFL-one time steps. I will also present preliminary results for GD discretizations on unstructured grids using MFEM.

---

#### Paul Fischer (UIUC/ANL)
#### *Outlook for Exascale Fluid Dynamics Simulations*
##### **June 21, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](WqrwDarTdss)

We consider design, development, and use of simulation software for exascale computing, with a particular emphasis on fluid dynamics simulation. Our perspective is through the lens of the high-order code Nek5000/RS, which has been developed under DOE's Center for Efficient Exascale Discretizations (CEED). Nek5000/RS is an open source thermal fluids simulation code with a long development history on leadership computing platforms—it was the first commercial software on distributed memory platforms and a Gordon Bell Prize winner on Intel's ASCII Red. There are a myriad of objectives that drive software design choices in HPC, such as scalability, low-memory, portability, and maintainability. Throughout, our design objective has been to address the needs of the user, including facilitating data analysis and ensuring flexibility with respect to platform and number of processors that can be used. When running on large-scale HPC platforms, three of the most common user questions are: How long will my job take? How many nodes will be required? Is there anything I can do to make my job run faster? Additionally, one might have concerns about storage, post-processing (Will I be able to analyze the results? Where?), and queue times. This talk will seek to answer several of these questions over a broad range of fluid-thermal problems from the perspective of a Nek5000/RS user. We specifically address performance with data for NekRS on several of the DOE's pre-exascale architectures, which feature AMD MI250X or NVIDIA V100 or A100 GPUs.

---

#### Mike Puso (LLNL)
#### *Topics in Immersed Boundary and Contact Methods: Current LLNL Projects and Research*
##### **May 24, 2022** | [FEM@LLNL Seminar Series](https://mfem.org/seminar)

![YouTube](RasTXV6IYC0)

Many of the most interesting phenomena in solid mechanics occurs at material interfaces. This can be in the form of fluid structure interaction, cracks, material discontinuities, impact etc. Solutions to these problems often require some form of immersed/embedded boundary method or contact or combination of both. This talk will provide a brief overview of different lab efforts in these areas and presents some of the current research aspects and results using from LLNL production codes. Technically speaking, the methods discussed here all require Lagrange multipliers to satisfy the constraints on the interface of overlapping or dissimilar meshes which complicates the solution. Stability and consistency of Lagrange multiplier approaches can be hard to achieve both in space and time. For example, the wrong choice of multiplier space will either be over-constrained and/or cause oscillations at the material interfaces for simple statics problems. For dynamics, many of the basic time integration schemes such as Newmark's method are known to be unstable due to gaps opening and closing. Here we introduce some (non-Nitsche) stabilized multiplier spaces for immersed boundary and contact problems and a structure preserving time integration scheme for long time dynamic contact problems. Finally, I will describe some on-going efforts extending this work.

</div><div class="col-md-6"  markdown="1">

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

---

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

#### Vladimir Tomov (LLNL)
#### *Finite Element Algorithms and Research Topics in ALE Hydrodynamics*
##### **November 17, 2022** | [Texas A&M University-Corpus Christi Department of Math & Statistics](https://www.tamucc.edu/science/departments/math-and-statistics/index.php)

![YouTube](WrV_rB4pAnE)

LLNL computational mathematician Vladimir Tomov discussed high-order finite element methods research, development, and application in the context of shock hydrodynamics simulations. The method is based on an Arbitrary Lagrangian-Eulerian (ALE) formulation consisting of separate Lagrangian, mesh optimization, and remap phases. The presentation addressed the following topics: Lagrangian shock hydrodynamics on curved meshes; multi-material closure models; coupling to multigroup radiation diffusion; optimization, r-adaptivity, and surface fitting of high-order meshes; advection-based remap with nonlinear sharpening of material interfaces; synchronization between the max/min bounds of primal and conservative fields during remap; computationally efficient finite element kernels based on partial assembly and sum factorization. The talk also covered the existing methods followed by a discussion about the outstanding research challenges and ongoing work to address them.

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
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](9WViLXI7wx4)

MFEM’s first community workshop was held virtually on October 20, 2021, with participants around the world.
Aaron Fisher of LLNL concluded the workshop by announcing the results of the simulation and visualization contest. The winners represent two very different research applications using MFEM: (1) the electric field generated by electrocardiogram waves of a rabbit’s heart ventricles, rendered by Dennis Ogiermann of Ruhr-University Bochum (Germany); (2) incompressible fluid flow around a rotating turbine, animated by Tamas Horvath of Oakland University (Michigan). Contest submissions are featured in the [gallery](gallery.md).

---

#### Will Pazner (LLNL)
#### *High-Order Matrix-Free Solvers*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](d6Ic9itl21g)

For users unfamiliar with MFEM’s solver library, Will Pazner of LLNL demonstrated a few ways—in some cases adding just a single line of code—to run scalable solvers for differential equations. These solvers execute hierarchical finite element discretizations for both low- and high-order problems.

---

#### Vladimir Tomov (LLNL)
#### *MFEM Capabilities for High-Order Mesh Optimization*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](c-VcclDfT7Y)

Vladimir Tomov of LLNL described MFEM’s mesh optimization strategies including ways the user can define target elements. He demonstrated optimizing a mesh’s shape by limiting displacements to preserve a boundary layer and by changing the size of a uniform mesh in a specific region. MFEM’s mesh-optimizing miniapps are [available online](https://mfem.org/meshing-miniapps).

---

#### William Dawn (NCSU)
#### *Unstructured Finite Element Neutron Transport using MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](Gfq6HFOpKmA)

William Dawn from North Carolina State University described his work with unstructured neutron transport. His team models microreactors, a new class of compact reactor with relatively small electrical output. As part of the Exascale Computing Project, Dawn’s team is modeling the MARVEL reactor, which is planned for construction at Idaho National Laboratory. MFEM satisfies their need for a finite element framework with GPU support and rapid prototyping. With MFEM, the team discretizes a neutron transport equation with six independent variables in space, direction, and energy.

Traditional neutron transport methods use a “sweeping” method to transport particles through a problem, but this is not feasible for generally unstructured meshes. In Dawn’s models, the Self-Adjoint Angular Flux (SAAF) form of the neutron transport equation is used to transform the neutron transport equation from a first-order hyperbolic form to a second-order elliptic form. Then, the SAAF equations are discretized with the finite element method and solved using MFEM. Due to the dependence of the neutron flux on angle and direction, these problems have a high vector-dimension with hundreds to thousands of degrees of freedom (DOF) per mesh vertex. Also, due to the second-order nature of these equations, highly refined meshes are required to sufficiently resolve reactor geometries with millions of vertices in a mesh. Results have been prepared for problems with billions of DOF using the Summit supercomputer at Oak Ridge National Laboratory.

---

#### Syun’ichi Shiraiwa (PPPL)
#### *Development of PyMFEM Python Wrapper for MFEM & Scalable RF Wave Simulation for Nuclear Fusion*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](8MBXq1PwUV8)

Syun’ichi Shiraiwa of Pacific Northwest National Laboratory introduced PyMFEM, a Python wrapper for MFEM that his team uses in radiofrequency (RF) wave simulations for the RF-SciDAC project. RF waves can be used to heat plasma in a nuclear fusion reaction. Simulations of this process present multiple challenges when incorporating a variety of antenna structures at different frequencies, waves with different wave lengths in the same space or spatially diverse, and RF wave effects on background plasma. To integrate MFEM, a C++ software library, into their multiphysics platform, Shiraiwa’s team created a code “wrapper” that binds MFEM to the external Python components of RF wave simulations, ultimately extending MFEM’s features to Python users. Shiraiwa described how the PyMFEM module works in serial and parallel and invited the audience to contribute to the open-source code.

---

#### Qi Tang (LANL)
#### *An Adaptive, Scalable Fully Implicit Resistive MHD Solver*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](-YPgim5GrqE)

Qi Tang of Los Alamos National Laboratory described his team’s development of an efficient, scalable solver for tokamak plasma simulations. Magnetohydrodynamics (MHD) equations are important for studying plasma systems, but efficient numerical solutions for MHD are extremely challenging due to disparate time and length scales, strong hyperbolic phenomena, and nonlinearity. Tang’s team has developed a high-order stabilized finite element algorithm for incompressible resistive MHD equations based on MFEM, which provides physics-based preconditioners, adaptive mesh refinement, parallelization, and load balancing. Tang showed animated examples of the model’s scalable and efficient results.

---

#### Jan Nikl (ELI Beamlines)
#### *Laser Plasma Modeling with High-Order Finite Elements*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](N7kwS0FdaD8)

Jan Nikl outlined how his team at the ELI Beamlines Centre uses MFEM for laser plasma modeling. Lasers have found their application in many scientific disciplines, where generation of plasma, the fourth state of matter, holds great potential for the future. A detailed description of laser produced plasmas is then essential for many applications, like (pre)pulses of ultra-intense lasers and ion acceleration beamlines, laboratory astrophysics, inertial confinement fusion, and many others. All of the mentioned are investigated at ELI Beamlines in the Czech Republic, a European laser facility aiming to operate the most intense laser system in the world. In this context, Nikl described the numerical construction based on the finite element method. This effort concentrates mainly on the Lagrangian hydrodynamics and Vlasov–Fokker–Planck–Maxwell kinetic description of plasma, utilizing the MFEM library for its flexibility and scalability.

---

#### Mathias Davids (Harvard)
#### *Modeling Peripheral Nerve Stimulations (PNS) in Magnetic Resonance Imaging (MRI)*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](Mkz13lAH9Ak)

Mathias Davids from Harvard Medical School presented MFEM’s use in a medical setting. Peripheral nerve stimulation (PNS) limits the usable image encoding performance in the latest generation of magnetic resonance imaging (MRI) scanners. The rapid switching of the MRI gradient coils’ magnetic fields induces electric fields in the human body strong enough to evoke unwanted action potential in peripheral nerves, leading to muscle contractions or touch perceptions. Despite its limiting role in MRI, PNS effects are not directly included during the coil design phase. Davids’ team developed a modeling tool to predict PNS thresholds and locations in the human body, allowing them to directly incorporate PNS metrics in the numeric coil winding optimization to design PNS-optimized coil layouts. This modeling tool relies on electromagnetic field simulations in heterogeneous finite element body models coupled to neurodynamic models of myelinated nerve fibers. This tool enables researchers to develop strategies that mitigate PNS effects without building expensive prototype MRI systems, maximizing the usable image encoding performance.

</div><div class="col-md-6"  markdown="1">

#### Marc Bolinches (UT)
#### *Development of DG Compressible Navier-Stokes Solver with MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](3T9dQI1SU88)

Marc Bolinches from the University of Texas at Austin described a compressible Navier-Stokes solver using MFEM v4,2 which did not include full support for GPUs. The solver uses the discontinuous Galerkin (DG) method as a space discretization and an explicit Runge-Kutta time-integration scheme. An effort has been made to fully support GPU computation by taking over some of the loops internal to the NonLinearForm class. This has also allowed us to implement overlap between computation and communication. The team hopes their open-source code will help other researchers in creating high-fidelity simulations of compressible flows.

---

#### Robert Rieben (LLNL)
#### *The Multiphysics on Advanced Platforms Project: Performance, Portability and Scaling*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](4BK0-VzM1Po)

High-energy-density physics (HEDP) experiments performed at LLNL and other Department of Energy laboratories require multiphysics simulations to predict the behavior of complex physical systems for applications including inertial confinement fusion, pulsed power, and material strength/equations-of-state studies. Robert Rieben described the variety of mathematical algorithms needed for these simulations, including ALE methods, unstructured adaptive mesh refinement, and high-order discretizations. LLNL’s Multiphysics on Advanced Platforms Project (MAPP) is developing a next-generation multiphysics code, called MARBL, based on high-order numerical methods and modular infrastructure for deployment on advanced HPC architectures. MARBL’s use of high-order methods produce better throughput on GPUs. MARBL uses MFEM for finite elements and mesh/field/operator abstractions while leveraging its support for efficient memory management. Rieben explained that co-design efforts among the MARBL, MFEM, and RAJA (portability software) teams led to better device utilization and improved performance for the MARBL code.

---

#### Felipe Gómez, Carlos del Valle, & Julián Jiménez (National University of Colombia)
#### *Phase Change Heat and Mass Transfer Simulation with MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](OPRIpc2o_EA)

Three undergraduate students—Felipe Gómez, Carlos del Valle, and Julián Jiménez—from the National University of Colombia presented their work using MFEM in an oceanographic model. Below the Arctic sea ice, and under the right conditions, a flux of icy brine flows down into the sea. The icy brine has a much lower fusion point and a higher density than normal seawater. As a result, it sinks while freezing everything around it, forming an ice channel called a brinicle (also known as ice stalactite). The team shared their simulations of this phenomenon assuming cylindrical symmetry. The fluid is considered viscous and quasi-stationary, and the problem is simulated taking advantage of the setup symmetries. The heat and salt transport are weakly coupled to the fluid motion and are modeled with the corresponding conservation equations, taking into account diffusive and convective effects. The coupled system of partial differential equations is discretized and solved with the help of the MFEM finite element library.

---

#### Thomas Helfer (CEA)
#### *MFEM-MGIS-MFront, a MFEM-Based Library for Nonlinear Solid Thermomechanic*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](K6HrhFWdfx8)

Thomas Helfer from the French Atomic Energy Commission (CEA) introduced the MFEM-MGIS-MFront library (MMM), which aims for efficient use of supercomputers in the field of implicit nonlinear thermomechanics. His team’s primary focus is to develop advanced nuclear fuel element simulations where the evolution of materials under irradiation are influenced by multiple phenomena (e.g., viscoplasticity, damage, phase transitions, swelling due to solid and gaseous fission products). MFEM provides this project with finite element abstractions, adaptive mesh refinement, and a parallel API. However, as applications dedicated to solid mechanics in MFEM are mostly limited to a few constitutive equations such as elasticity and hyperelasticity, Helfer explained that his team extended the software’s functionality to cover a broader spectrum of mechanics. Thus, this MMM project combines MFEM with the MFrontGenericInterfaceSupport (MGIS), an open-source C++ library that provides data structures to support arbitrarily complex nonlinear constitutive equations generated by the MFront code generator. MMM is developed within the scope of CEA’s PLEIADES project. Helfer’s presentation provided (1) an introduction to MMM goals; (2) a tutorial of MMM usage with a focus on the high-level user interface; (3) an overview of the core design choices of MMM and how MFEM was extended to support a range of scenarios; and (4) feedback on the two main issues encountered during MMM development.

---

#### Jamie Bramwell (LLNL)
#### *Serac: User-Friendly Abstractions for MFEM-Based Engineering Applications*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](EHUID3fnHwU)

Jamie Bramwell of LLNL presented an overview of the open-source [Serac project](https://serac.readthedocs.io/en/latest), whose goal is to provide user-friendly abstractions and modules that enable rapid development of complex nonlinear multiphysics simulation codes. She provided an overview of both the high-level physics modules (thermal conduction, solid mechanics, incompressible flow, electromagnetics) as well as the serac::Functional framework for quickly developing nonlinear GPU-enabled finite element method kernels.

---

#### Veselin Dobrev (LLNL)
#### *Recent Developments in MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](oUk6tkHWjI4)

Veselin Dobrev of LLNL detailed the project’s recent developments including memory manager improvements; serial support for p- and hp-refinement; high-order/low-order refined solution transfer; GLVis visualization via Jupyter Notebooks; and additional GPU support regarding HYPRE preconditioners, PETSc tools, and mesh optimization. MFEM now also integrates with various new libraries (AmgX, Gingko, FMS, and others), and continuous integration testing has been conducted on LLNL’s Quartz, Lassen, and Corona machines. Additionally, Dobrev summarized MFEM’s integrations with other software libraries and the team’s engagements with the Exascale Computing Project, SciDAC, the FASTMath Institute, and other projects.

---

#### Tzanio Kolev (LLNL)
#### *The State of MFEM*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

![YouTube](p4u4AlUhamY)

MFEM principal investigator Tzanio Kolev described the project’s past, present, and future with an emphasis on its key capabilities of discretization algorithms, built-in solvers, parallel scalability, adaptive mesh refinement, and support for a range of computing architectures. Kolev also highlighted the global community’s contributions as well as features included in the recent v4.3 software release.

---

#### Aaron Fisher (LLNL)
#### *Welcome and Overview*
##### **October 20, 2021** | [MFEM Workshop 2021](workshop21.md)

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
