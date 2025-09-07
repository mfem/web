# MFEM Community Workshop
<h4>September 10-11, 2025</h4>
<h4>Portland State University + Virtual</h4>

![MFEM Logo](img/logo-300.png)

### Overview

The MFEM team and Portland State University's Fariborz Maseeh Department of Mathematics are happy to
invite you to the 2025 MFEM Community Workshop, which will take place on September 10-11, 2025 in a
hybrid format: in-person at [Portland State University](#venue) + virtually on Zoom. The goal of
the workshop is to foster collaboration among all MFEM users and developers, share the latest MFEM
features with the broader community, deepen application engagements, and solicit feedback to guide
future development directions for the project.

*We encourage you to join us in person if you can!*
*For questions, please contact the meeting organizers at*
*[mfem@llnl.gov](mailto:mfem@llnl.gov).*

### Registration

Registration closed on **August 27**.

<!--
* **In person:** After registering, please proceed to this [payment page](https://commerce.cashnet.com/pdxMFEM)
to submit your registration fee ($100), which will cover food and other expenses.
MFEM-branded items (t-shirt, pint glass, etc.) will also be made available for purchase at a later date.

* **Students:** Thanks to generous sponsorship of the workshop by LLNL, the in-person registration fee is waived for students.
You may apply for travel reimbursement via [this form](https://docs.google.com/forms/d/e/1FAIpQLSegY2TT6UhJVdhMzwL-BOTPr2JEm7A3RsZ5OvIYA5JU3pQEfg/viewform).

* **Remote:** There is no registration fee for remote participants. Zoom details will be distributed prior to the event date.
-->

### Venue

The workshop will take place at [Portland State University](https://www.pdx.edu) (PSU) in Portland,
Oregon. PSU is located in downtown Portland, about a 25 minute drive from the Portland International
Airport.

The meeting will be held in Smith Memorial Student Union (SMSU) room 296/8. This location is
highlighted on the map below. See also the [interactive campus map](https://map.pdx.edu/?building=SMSU) and [this diagram](img/psu_campus_map_smsu.png).

<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.912285253112!2d-122.68682832352792!3d45.511844330258114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950a16c6b61c87%3A0x2d1664732d286db7!2sSmith%20Memorial%20Student%20Union!5e0!3m2!1sen!2sus!4v1745949341371!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

### Lodging Options

There are several downtown hotels within easy walking distance of campus:

* [Hotel Zags](https://www.thehotelzags.com/)
* [University Place Hotel](http://www.uplacehotel.com/)

### Meeting Format

This will be the second hybrid edition of the MFEM community workshop.

<!--
The meeting will include the following elements:

- Project news and development updates from the MFEM team
- An overview of the latest features in MFEM-4.8 and future roadmap
- Contributed talks from application developers utilizing MFEM
- Student lightning talks and visualization contest
- Office hours and discussions with the MFEM team

See also the agenda for the previous [2024](../workshop24), [2023](../workshop23), [2022](../workshop22), and [2021](../workshop21) MFEM workshops.
-->

Workshop participants are encouraged to join the
[MFEM Community Slack workspace](https://join.slack.com/t/mfemworkshop/shared_invite/zt-1hxasxnlt-erkRWQTMLmBoHUdXlB0Wfg)
to communicate with other MFEM users and developers before, during and after the
MFEM workshop.

### Agenda

The meeting activities will take place 8:00 am - 5:00 pm Pacific Daylight Time (GMT-7) on Wednesday, September 10 and Thursday, September 11.

<br>

#### Wednesday, September 10

| Time | Activity | Presenter |
|---|---|---|
| 8:00-8:30 | **Breakfast + Registration** <br> | [PSU SMSU 296/8](https://maps.app.goo.gl/aarCK3W6w2Cfzvxp6) |
| 8:30-8:50 | **Welcome & Overview** | **Will Pazner** (PSU) |
| 8:50-9:10 | **The State of MFEM** | **Tzanio Kolev** (LLNL) |
| 9:10-9:40 | **Recent Developments** | **Veselin Dobrev** (LLNL) |
| 9:40-10:10 | **Coffee Break & Group Photo** | download a [virtual background](#virtual-backgrounds) below |
| 10:10-12:00 | **Presentations** <br><br>Chair:<br> **Will Pazner** | **Stefan Henneking** (UT Austin) <br><details><summary> *Real-time Bayesian Inference at Extreme Scale: A Digital Twin for Tsunami Early Warning Applied to the Cascadia Subduction Zone*</summary><h6> We present a Bayesian inversion-based digital twin that employs acoustic pressure data from seafloor sensors, along with 3D coupled acoustic-gravity wave equations, to infer earthquake-induced spatiotemporal seafloor motion in real time and forecast tsunami propagation toward coastlines for early warning with quantified uncertainties. Our target is the Cascadia subduction zone, with one billion parameters. Computing the posterior mean alone would require 50 years on a 512 GPU machine. Instead, exploiting the shift invariance of the parameter-to-observable map and devising novel parallel algorithms, we induce a fast offline-online decomposition. The offline component requires just one adjoint wave propagation per sensor; using MFEM, we scale this part of the computation to the full El Capitan system (43,520 GPUs) with 92% weak parallel efficiency. Moreover, given real-time data, the online component exactly solves the Bayesian inverse and forecasting problems in 0.2 seconds on a modest GPU system, a ten-billion-fold speedup. </h6></details><br> **Thomas Helfer** (Commissariat à l'Énergie Atomique et aux Énergies Alternatives) <br><details><summary> *MFEM/MGIS and SLOTH: 2 Open-Source Applications of MFEM Dedicated to Nuclear Fuel Modeling* </summary><h6> This talk focuses on two applications developed at the French Atomic Commission in the Nuclear Fuel Department, MFEM-MGIS and SLOTH: [MFEM/MGIS](https://thelfer.github.io/mfem-mgis/index.html) aims at providing a general-purpose quasi-static thermo-mechanical solver coupling MFEM and MFront, a code generation tool handling complex mechanical behaviours (see the dedicated talk for the 2021 MFEM community workshop). Several examples of simulations will be discussed, including crack propagation in brittle media using a micromorphic approach and computations at the microstructural scale performed in the context of the Opera-HPC European project. [SLOTH](https://collab4sloth.github.io/Documentation/) is an open-source, multiphase-field, multicomponent framework dedicated to studying fuel behavior at different scales, from nominal operating conditions to severe accident conditions. It is based on the two main phase-field models, Cahn-Hilliard and Allen-Cahn, and offers a suite of features for performing multiphysics simulations, including phase-field, thermal diffusion, multicomponent diffusion, and CALPHAD thermodynamic calculations. This presentation will provide a general overview of SLOTH, with a particular focus on the code architecture, the main physical systems modeled, recent and ongoing developments regarding code performance, and multiphysics couplings. </h6></details><br> **Matt Chandler** (CFMS Services Ltd) <br><details><summary> *Bounce: An HPC-scale Elastodynamic Solver for Ultrasonic Non-destructive Testing Applications* </summary><h6> In ultrasonic non-destructive evaluation (NDE), components are inspected using high frequency elastic waves to determine fitness for service without causing damage or destruction in the process. This is a highly valuable tool for many industrial applications: in the aerospace and energy industries, bespoke components are produced for use in situations where safety is critical. Technicians must therefore have a high confidence that any flaws which are introduced in manufacturing or during service will be identified, which requires large quantities of high fidelity data to qualify inspection methods. Further, with the increasing use of data-intensive processing methods such as machine learning, this requirement is compounded. As real flaws are rare, it is difficult and often infeasible to produce large amounts of data from genuinely defective components. CFMS have therefore been developing an explicit elastodynamic solver using MFEM to simulate ultrasonic inspection. Relying on the integration of MFEM with MPI, this has allowed the deployment of this solver for HPC-scale simulations, evaluating large models on the scale of metres, up to 1 billion elements. Additionally, materials with anisotropic elastic properties have been modelled to simulate inspections of high-performance materials including composite and titanium. Complex forcing profiles have also been implemented to study the interaction of an ultrasonic wave with arbitrary embedded flaws. In this talk, an overview of these applications will be discussed. </h6></details><br> **John Camier** (LLNL) <br><details><summary> *A Guided Tour of MFEM GPU Kernel Optimization Techniques*</summary><h6> This presentation explores a variety of kernel optimization strategies for MFEM, leveraging its GPU abstraction layer to achieve high performance on AMD and NVIDIA GPUs. Focusing on the Cascadia application code, we detail the journey toward optimal implementations, highlighting techniques to navigate compiler possibilities and to unlock architectural opportunities. Our discussion provides practical insights for enhancing finite element computations in high-performance computing environments. Joint work with Veselin Dobrev (LLNL), Stefan Henneking (UT Austin), Tzanio Kolev (LLNL), and Jiqun Tu (NVIDIA). </h6></details><br> |
| 12:00-1:00 | **Lunch** | [PSU SMSU 296/8](https://maps.app.goo.gl/aarCK3W6w2Cfzvxp6) |
| 1:00-1:30 | **Student Session 1** <br> (10 mins each)<br><br>Chair:<br> **Ketan Mittal** | **Patrick Saber** (Pennsylvania State University) <br><details><summary> *An Explicit Description of Implementation of 4D, H(div)-conforming Simplicial Finite Elements in MFEM* </summary><h6> In this talk, we will provide an explicit description of our implementation of 4D, H(div)-conforming simplicial finite elements in MFEM. We choose to develop finite elements in 4D because of their usefulness in space-time applications. Furthermore, we are interested in simplicial elements due to their potential for anisotropic mesh adaptivity. Our work modifies and updates a previously generated MFEM branch developed by Andreas Schafelner and Martin Neumüller. Our implementation consists of the following stages: 1. defining degrees of freedom on a reference element, 2. constructing a Vandermonde matrix to transform modal functions to nodal functions, 3. methods for computing both the value of H(div)-conforming basis functions and their derivatives, and 4. orientation mappings for interfaces between neighboring elements. We then show the performance of our newly-developed basis functions with an order of accuracy study on a simple grad-div problem. </h6></details><br> **Matthew Blomquist** (UC Merced) <br><details><summary> *Characteristic Bending - A Robust Advection Scheme for Incompressible Flows*</summary><h6>We introduce a characteristic bending method that combines the reference map technique with a volume-preserving projection to advect quantities in incompressible velocity fields. The approach improves volume/mass conservation in level set applications, maintains divergence-free fields in self-advection, and enhances stability in multiphase flows. In this lightning talk, I’ll outline the core idea, show how it differs from existing advection schemes, and present results demonstrating its robustness and accuracy across several representative examples. </h6></details><br> **Ramin Pahnabi** (Brigham Young University) <br><details><summary> *High-order Space–Time Finite Element Simulations of Fluid Mechanics Using MFEM* </summary><h6> Accurate modeling of dynamic fluid behavior is an essential component of multiphysics behavior, including for aerothermal and aerothermoelastic modeling based the compressible Navier-Stokes equations. However, stable and efficient modeling of this behavior is challenging due to the nonlinear coupling of thermal, fluid, and structural behavior. We explore a space–time finite element strategy that employs high-order continuous methods in space and discontinuous Galerkin discretization in time to enhance accuracy while reducing expense. Using MFEM, Lawrence Livermore National Laboratory’s scalable high-order solver, we demonstrate preliminary results that highlight the potential of this framework for efficient large-scale simulations for dynamic flow and outlook for full compressible flow modeling. </h6></details><br> |
| 1:40-2:20 | **Student Session 2** <br> (10 mins each)<br><br>Chair:<br> **Ketan Mittal** | **Topher Eyre** (Brigham Young University) <br><details><summary> *Parameter Extraction from Electromagnetic Eigenmode Simulations of Multimodal Cavities using MFEM* </summary><h6> This talk will present computation of several of the lowest nonzero electromagnetic eigenmodes of a metal cavity through discretization of the curl-curl operator using a Nedelec finite element space in three-dimensions. The implementation of our code is derived from MFEM example 13. The cavities under investigation include microstrips and dielectric substrates. We perform parameter extraction for equivalent circuit representations of the cavity modes which are instrumental in modelling coupling with the cavity in lumped element circuit simulators. Parameter extraction is conducted using surface integrals of the electric and magnetic fields. </h6></details><br> **Tyler Fara** (Oregon State University) <br><details><summary> *A Stable FEM Framework for Coupled PDE–ODE Bioheat Models with Nonlinear Boundary Conditions* </summary><h6> We introduce a stable finite element framework for a nonlinear PDE–ODE compartment model of bioheat transfer. The formulation couples a distributed extremity domain with a lumped core temperature via nonlinear exchange terms and Robin boundary conditions. We establish stability of the continuous problem and a priori error estimates for a backward Euler–Galerkin discretization. Simulations illustrate the model's ability to predict the onset of frostbite and hypothermia during cold exposure. </h6></details><br> **Barry Fadness** (Portland State University) <br><details><summary> *Algebraic Hybridization for the Darcy Problem* </summary><h6> We present an implementation that utilizes the information already contained in MFEM classes. For example, entity relation tables from the Mesh and FiniteElementSpace classes are used to keep track of degrees of freedom. The code also deals with dense element matrices and local vectors. We will discuss choices for their storage and construction. </h6></details><br> **Anthony Kolshorn** (Portland State University) <br><details><summary> *Implementation of IMEX Integrators in MFEM with Examples* </summary><h6> This talk will describe a new framework for IMEX integrators in MFEM. IMEX Methods are used in a wide array of applications, including fluid dynamics and heat flow. Two new classes are created to streamline the utilization of IMEX Methods in MFEM. Successful implementation of these methods are showcased using examples from Advection-Diffusion problems. Future work, as well as broader applications, are discussed. </h6></details><br> |
| 2:30-3:00 | **Student Session 3** <br> (10 mins each)<br><br>Chair:<br> **Ketan Mittal** | **Rushan Zhang** (Georgia Institute of Technology) <br><details><summary> *Structure-preserving Transfer of Grad-Shafranov Equilibria to Magnetohydrodynamic Solvers* </summary><h6> Magnetohydrodynamic (MHD) codes used to study plasmas for magnetic confinement fusion typically rely on initial conditions describing a force equilibrium, and which are provided by separate codes based on the Grad-Shafranov (GS) equation. Transferring such equilibria from the GS discretization to the MHD discretization may lead to errors that can result in unwanted perturbations to the equilibria on the level of the MHD discretization. In this work, we identify and analyze sources of such errors in the context of finite element methods, with a focus on the force balancing and zero-divergence properties of the loaded equilibria. In particular, next to alignment of the MHD and GS solver grids, an important error source is given by the choice of magnetic field space in the MHD scheme relative to the choice of poloidal flux and toroidal field function spaces in the GS scheme. With this in mind, we experiment different structure-preserving finite element spaces using compatible finite element methods. Finally, in a series of numerical results, we demonstrate and quantify equilibria errors arising in the transferred initial conditions due to mesh misalignment as well as non-structure preserving choices of function spaces. Results show that the force balancing is best preserved when we adopt the structure-preserving choices of function spaces, and when the MHD mesh and the GS mesh are aligned. We also demonstrate that projecting magnetic into curl-conforming spaces, while not optimal for force balancing, yet weakly preserves the divergence-free property of the magnetic field. </h6></details><br> **Leonardo Molinari** (Emory University) <br><details><summary> *A Domain-Decomposition Framework for Multiphysics Biomedical Modeling: Application to Cardiac Radiofrequency Ablation* </summary><h6>Cardiac radiofrequency ablation (RFA), a cornerstone treatment for arrhythmias, suffers from limited understanding of lesion formation, hindering optimal outcomes. Current RFA models often oversimplify the complex multiphysics interactions within heterogeneous domains, neglecting crucial factors. This research introduces a high-fidelity, multiphysics, and multi-domain computational framework designed to enhance RFA treatment and minimize complications. The framework integrates heat transfer, electrostatics, fluid dynamics, and a three-state cell-death model across electrode, fluid, and tissue regions. Notably, some processes are confined to specific compartments (e.g., fluid dynamics in the fluid, cell-death in the tissue), while others (e.g., electrostatics, heat transfer) span multiple domains. To achieve accurate and scalable simulations, we employ physics- and domain-decomposition (DD) approaches. Specifically, Dirichlet-Neumann and Optimized Schwarz-like DD methods are explored, supported by their convergence analysis. Implemented using high-order numerical methods within the MFEM library, and enhanced by efficient partially assembled operators, this framework demonstrates significant computational efficiency. Importantly, the framework’s design allows for extensibility, making it a versatile platform for RF simulations across diverse tissue types (e.g., kidney, uterine, hepatic) and energy sources (RF, microwave, ultrasound, laser), as well as a range of other biomedical modeling applications (e.g., degradation of bio-resorbable stents). By advancing computational modeling and data assimilation, this research aims to bridge the gap between theoretical simulations and clinical practice, facilitating the development of more effective, personalized, and safer ablation therapies. </h6></details><br> **Vimarsh Sathia** (UIUC) <br><details><summary> *AD-aware Compiler Optimizations in Enzyme MLIR*</summary><h6> Enzyme MLIR is a compiler dialect that provides first-class automatic differentiation (AD) support directly within the powerful MLIR ecosystem. The core idea behind AD-aware optimizations is to enrich traditional and dialect-specific compiler analyses with domain-specific information like variable activities. In this talk, we will explore how EnzymeMLIR uses domain-specific optimizations to drive derivative codegen. We will also demonstrate how combining activity analysis with dataflow analyses like constant folding and incorporating use-def info can prune unnecessary gradient computations. </h6></details><br> |
| 3:10-3:40 | **Coffee Break** | Discussions on [Slack](https://mfemworkshop.slack.com/archives/C08SURGGU1W) |
| 3:40-5:00 | **Presentations** <br><br>Chair:<br> **Justin Laughlin** | **Julian Andrej** (LLNL) <br><details><summary> *dFEM: Differentiable Finite Elements in MFEM* </summary><h6> In this presentation we will take a detailed look into the recent developments of Automatic Differentiation in MFEM which leverages modern compiler framework techniques of the LLVM project. The presentation is concluded with exciting new experiments as well as news about recent developments. </h6></details><br> **Joseph Signorelli** (University of Illinois at Urbana-Champaign) <br><details><summary> *Particles in MFEM* </summary><h6> Accurately and efficiently modeling billions of particles computationally at-scale is essential for research in a wide range of fields such as electromagnetics and fluid dynamics. This talk introduces a new scalable particle tracking framework in MFEM. Key features are discussed including (i) support for an arbitrary number of “fields” (vector data of any vector dimension), “tags” (integer data), and a global identifier associated with each particle, (ii) rebalancing of particle data across MPI ranks, (iii) seamless integration with existing MFEM data structures such as `Vector`, making it easy to leverage GPU acceleration, and (iv) IO functionality for visualizing particle trajectories in GLVis and ParaView. Example usage is demonstrated through new and improved miniapps, including an electromagnetics example and a new incompressible Navier-Stokes particle solver. </h6></details><br> **Christopher Vogl** (LLNL) <br><details><summary> *Coupling MFEM with Structured Mesh Libraries* </summary><h6> When solving partial differential equations, scientific software libraries typically target either structured mesh or unstructured mesh approaches. Recent investment in those libraries has resulted in powerful capabilities; however, users are typically restricted to one of the two meshing approaches. With multiphysics application needs in mind, recent work removes that restriction by developing features in the MFEM library to enable coupling with structured mesh libraries. One such feature is the ability to transfer fields between the element-based adaptive mesh refinement framework in MFEM and the patched-based AMR framework in structured mesh libraries. Another feature is the generalization of the 2:1 AMR capability in MFEM to support the N:1 refinement common in structured mesh libraries. To showcase these features, this demo will include results coupling MFEM with the PISALE library and coupling MFEM with the AMReX library. </h6></details><br> |
| 5:00 | **Day 1 Wrap-up** | MFEM team |
| 6:00-8:00 | **Workshop Dinner** | [McMenamin's Tavern & Pool](https://www.mcmenamins.com/tavern-pool) ([Transit Directions](https://maps.app.goo.gl/Drd7GnGCUunFWpbh9)) |

<br>

#### Thursday, September 11

| Time | Activity | Presenter |
|---|---|---|
| 8:00-8:30 | **Breakfast** <br> | [PSU SMSU 296/8](https://maps.app.goo.gl/aarCK3W6w2Cfzvxp6) |
| 8:30-8:50 | **Visualization Contest Winners** <br> | **Will Pazner** (Portland State) |
| 8:50-9:50 | **Presentations** <br><br>Chair:<br> **Tzanio Kolev** | **Hugh Carson** (AWS Center for Quantum Computing) <br><details><summary> *Electromagnetic Simulation with Palace* </summary><h6> The Palace solver is a 3D electromagnetics solver built within the AWS Center for Quantum Computing, making use of the MFEM and libCEED projects for efficient large-scale solving. In this talk we will introduce Palace, its capabilities and recent developments. </h6></details><br> **Jaewook Lee** (TU Wien) <br><details><summary> *Spline-based Framework for Fluid-Structure-Contact Interaction Modeling* </summary><h6> We present a framework for modeling the secondary shear-zone in orthogonal cutting as a fluid–structure–contact interaction problem. The structural solver, built on MFEM’s NURBS discretization, is coupled to an in-house fluid solver. We highlight how MFEM’s modular architecture enabled our spline-based extensions and their seamless integration into the coupled process. This work provides a starting point for exploring complex multiphysics phenomena in the orthogonal cutting contact zone. </h6></details><br> |
| 9:50-10:20 | **Coffee Break** | Discussions on [Slack](https://mfemworkshop.slack.com/archives/C08SURGGU1W) |
| 10:20-11:50 | **Presentations** <br><br>Chair:<br> **Sohail Reddy** |  **Jan Nikl** (LLNL) <br><details><summary> *Framework for Hybridization of Mixed Systems in MFEM* </summary><h6> The presentation introduces the framework for mixed systems in MFEM, which enables an easy construction of such systems for problems from hydrodynamics, thermodynamics, electromagnetics and other disciplines. It also enables automatic elimination of the discontinuous potentials or fluxes to reduce the size of the discrete system. However, the key feature of the framework is the single-line hybridization procedure, which weakly enforces continuity of the total flux, reducing the whole problem to only a discrete system for the trace variables defined on the skeleton of the mesh. This reformulation offers manyfold benefits in terms of more efficient preconditioning, increased stability and performance. Usage of the framework is shown on multiple examples spanning from steady-state diffusion to time resolved convection-diffusion problems. Additionally, new extensions and features are summarized, like reconstruction of the superconvergent quantities or support for systems of equations. </h6></details><br> **Ketan Mittal** (LLNL) <br><details><summary> *A Method for Bounding High-Order Functions + Recent Developments in High-Order Mesh Optimization* </summary><h6> We introduce a novel method for bounding high-order multi-dimensional polynomials in finite element approximations. The method involves precomputing optimal piecewise-linear bounding boxes for polynomial basis functions, which can then be used to locally bound any combination of these basis functions. This approach can be applied to any element/basis type at any approximation order and can be evaluated efficiently on-the-fly in simulations. We also present some recent developments to high-order mesh optimization in MFEM. These include a technique for tangential relaxation on curved boundaries, detecting mesh validity through bounds on the determinant of the Jacobian of the nodal position function, and a PDE-constrained approach for r-adaptivity that improves mesh quality to reduce error in the PDE solution. </h6></details><br> **Vladimir Tomov** (LLNL) <br><details><summary> *Remap through Interpolation and Optimization* </summary><h6> We introduce a novel field remap method and its application to multimaterial Arbitrary Lagrangian–Eulerian (ALE) hydrodynamics. Given an initial and a final mesh, we first perform a direct interpolation in physical space. This step is computationally practical thanks to recent advances in GPU-accelerated interpolation routines provided by the GSLIB library. The interpolation produces bounded fields with low diffusion but does not guarantee conservation. To recover conservation while maintaining physical bounds, we apply two complementary optimization strategies. The first uses interior-point methods implemented in C. Petra's HiOp optimization library. The second, based on B. Keith's Proximal Galerkin framework, performs optimization in a latent space that inherently enforces bounds without explicit constraints. The approach achieves minimal diffusion for finite element fields of arbitrary order and supports direct remapping of integration-point quantities, eliminating the need for projection onto finite element spaces. It also circumvents long-standing difficulties in synchronizing primal variables and conserved quantities inherent to advection-based remap methods. We demonstrate results on standard 2D and 3D benchmarks as well as full ALE hydrodynamics simulations. </h6></details><br> |
| 11:50-12:50 | **Lunch** | [PSU SMSU 296/8](https://maps.app.goo.gl/aarCK3W6w2Cfzvxp6)<br> |
| 12:50-2:50 | **Presentations** <br><br>Chair:<br> **Qi Tang** | **Syun'ichi Shiraiwa** (Princeton Plasma Physics Laboratory) <br><details><summary> *Radio-frequency Wave Simulation in Hot Magnetized Plasma using Differential Operator for Non-local Conductivity Response* </summary><h6> The dielectric response of plasma with finite temperature is non-local, due to freely moving charged particles. For the finite element method, such a non-locality presents significant challenges, in both assembling and solving a linear system. In fact, the majority of radio-frequency wave simulation for fusion plasmas based on finite elements, to date, uses a some-sort of localized response. In our previous work (presented in the 2023 workshop), we proposed to utilize the numerical techniques to solve the fractional differential equation, in order to introduce the non-local dielectric response in the Maxwell equations. We demonstrated that such an approach can  reproduce an expected propagation pattern of the electron Bernstein wave that can exist only when the plasma response is non-local. This work generalize the previous work. We start from a dielectric response of a uniform magnetized Maxwellian plasma, and we construct a semi-differential form of dielectric currents. At this point, the expression contains non-locality as perpendicular and parallel wave numbers. Then, we  transform them to a set of PDEs using directional Laplacians. This approach yields a more generalized differential operator for the dielectric response, which can be used to simulate a variety of waves in fusion plasmas. We also discuss an approach to guarantee the self-adjointness of the operator, when plasma is loss-less. Using the new operator, 2D simulations of various waves in tokamak plasmas will be presented. </h6></details><br> **Alexander Blair** (UK Atomic Energy Authority) <br><details><summary> *MFEM in MOOSE: An Overview of Current Capabilities* </summary><h6> In order to suitably assess complex components in challenging multiphysics environments, engineers must have access to performant, scalable simulation tools with simple user interfaces for design qualification. Earlier this year, support for MFEM as an available back-end was added to the large-scale open-source FE simulation framework MOOSE through a collaborative effort between UKAEA, STFC, and INL, enabling MOOSE's extensive user community to assemble and solve FE multiphysics problems on GPU architectures with MOOSE for the first time. In this talk, we shall present an overview of MOOSE's current MFEM capabilities, show examples tackling thermal, electromagnetic, and solid mechanics use-cases, and outline our future plans for extending MFEM support in MOOSE for non-linear problems. </h6></details><br> **Tucker Hartland** (LLNL) <br><details><summary> *A Scalable Interior-point Gauss-Newton Method for Large-scale PDE-constrained Optimization with Bound Constraints* </summary><h6> We present a scalable method for large-scale PDE- and bound-constrained optimization. Such problems are a means to learn unknown aspects of PDE-based models. It is assumed that such model uncertainty is mathematically manifest in an unknown spatially distributed parameter field, ρ(x). Bound-constraints ρ(x)≥ρℓ(x) are a natural means to introduce additional knowledge of an unknown parameter field, e.g., nonnegativity of a diffusivity parameter field. Bound-constraints are, however, the source of additional computational challenges as they introduce complementarity conditions into the nonlinear optimality system. We utilize a robust, full-space, interior-point method to solve the optimization problem. In order to avoid the computational costs required to regularize the inertia of the linearized optimality system matrix, we use a Gauss-Newton search direction. We discuss two related preconditioned Krylov-subspace solution strategies for said linear system. We show that the number of preconditioned Krylov-subspace iterations is independent of not only discretization but also the ill-conditioning that notoriously plagues interior-point linear systems. We conclude with parallel scaling results on a nonlinear elliptic and linear parabolic PDE- and bound-constrained optimization example problems. The results were generated with a native implementation of the computational framework that makes extensive use of MFEM, a scalable C++ finite element library. </h6></details><br> **Socratis Petrides** (LLNL)<br><details><summary> *AMG with Filtering: An Efficient Preconditioner for Interior Point Methods in Large-scale Contact Mechanics Optimization* </summary><h6> Large-scale contact mechanics simulations are crucial in many engineering fields such as structural design and manufacturing. In the case of frictionless contact, the problems can be modeled by minimizing an energy functional; however, they are often nonlinear, non-convex, and become harder to solve with higher mesh resolution. In this work, we employ a Newton-based interior-point (IP) filter line-search method; an effective approach for large-scale constrained optimization. While this method converges rapidly, each iteration requires solving a large saddle-point linear system that becomes ill-conditioned as the optimization process converges to the optimizer, largely due to IP treatment of the contact constraints. Such ill-conditioning can hinder scalability and increase iteration counts as the mesh is refined. To address this challenge, we introduce a novel preconditioner, AMG with Filtering (AMGF), tailored to the Schur complement of the saddle-point system. Building on the classical algebraic multigrid (AMG) solver, routinely used for large-scale elasticity problems, we add a specialized subspace correction to filter the near null space components arising from the enforcement of contact interface constraints. Through theoretical analysis and numerical experiments on various linear and nonlinear contact problems, we showcase that the proposed solver demonstrates mesh-independent convergence and is robust to the ill-conditioning that notoriously plagues IP methods. These results indicate that the proposed preconditioner makes contact mechanics simulations more tractable and broadens the applicability of Newton-based IP methods in challenging engineering scenarios. More generally, the approach is well suited for problems, optimization or otherwise, where standard solvers perform well except on a low-dimensional subspace, such as those arising from localized constraints, interface conditions or model heterogeneities. This makes the method widely applicable beyond contact mechanics and constrained optimization. </h6></details><br> |
| 2:50-3:20 | **Coffee Break** | Discussions on [Slack](https://mfemworkshop.slack.com/archives/C08SURGGU1W) |
| 3:20-5:20 | **Presentations** <br><br>Chair:<br> **Tzanio Kolev** | **David Williams** (Penn State)<br><details><summary> *Quadrature Procedures for 4D Applications and Beyond* </summary><h6> Quadrature (i.e. numerical integration) is a frequently overlooked aspect of finite element methods. In this talk, we discuss the importance of quadrature, and the advantages/disadvantages of various quadrature procedures for hypercubic and simplicial finite elements. We are particularly concerned with unexpected pathologies related to numerical stability and accuracy, which arise for applications in dimensions 4D to 7D. This topic is relevant for researchers who are interested in solving space-time problems consisting of three spatial dimensions and one temporal dimension (3D+t problems), as well as radiation transport problems consisting of three spatial dimensions, three phase-space dimensions, and one temporal dimension (3D+3D+t) problems. </h6></details><br> **Ziheng Yu** (Cambridge University) <br><details><summary> *MFEM in glacier isostatic adjustment: Infinite Domain treatments for self-gravitation*</summary><h6> Glacial isostatic adjustment (GIA) couples solid-Earth deformation, self-gravitation, and sea-level change—but the gravitational potential lives on an unbounded exterior, while our meshes do not. This talk presents MFEM-based treatments that bring the “infinite domain” into finite computations with controlled accuracy and stability. I outline a compact, linearized GIA formulation (an elasticity–gravity core with optional rotation, sea level, and viscoelastic effects) and focus on three exterior closures for self-gravitation: (1) a Dirichlet-to-Neumann operator that enforces the exact exterior decay on a spherical outer boundary; once computed, it can be reused across solves and iterations; (2) a multipole continuation that represents the exterior field with spherical harmonics and injects it as a modification to the RHS, providing tunable accuracy and diagnostic access to modes; and (3) an infinite-element approach that captures far-field decay in a mapped radial layer. These methods are benchmarked against the "very-large-domain" fallback, showing why boundary operators win on both accuracy and cost. I also demonstrate a linearized gravity problem driven by a prescribed displacement field, illustrating how these operators integrate into forward and adjoint workflows in MFEM. </h6></details><br> **Sandilya Kambampati** (Intact Solutions) <br><details><summary> *Scalable Deployment of MFEM for Generative Design and Additive Manufacturing Applications* </summary><h6> In this project, we discuss the integration of MFEM within Intact.Simulation, a high-performance platform for generative design and additive manufacturing (AM). Intact.Simulation virtually eliminates manual pre-processing by enabling mesh-free analysis of extreme geometries and heterogeneous material models through commercial plugins and cloud services. The project seeks to deliver scalable, high-fidelity finite element analysis (FEA) for AM applications by leveraging MFEM’s capabilities, including immersed discretizations, advanced integration schemes, and support for high-performance computing. Our initial focus is on feasibility: embedding MFEM to automate grid generation, quadrature enforcement, and boundary condition handling. The overall goal is to scale the solution to handle industrial-grade nonlinear and viscoelastic models on non-conforming meshes. The anticipated outcomes of this project include optimized lattice-structured components for aerospace, defense, and medical sectors, thus accelerating adoption of AM technologies via robust generative design and simulation workflows. </h6></details><br> **Pierson Guthrey** (LLNL) <br><details><summary> *Finite Element Tensor Network Solvers for High Dimensional PDE* </summary><h6> High-dimensional kinetic equations, such as those arising in radiation transport and Vlasov models, present significant computational challenges due to the curse of dimensionality. In this talk, I present a novel framework that combines the MFEM finite element library with the BoBa tensor network package to construct finite element tensor network solvers for these complex systems. I will discuss the architectural design for coupling finite element discretizations with tensor network representations, enabling efficient handling of high-dimensional state spaces. </h6></details><br> |
| 5:20 | **Day 2 Wrap-up** | MFEM team |

<br>

### Simulation and Visualization Contest

We will be holding a simulation and visualization contest open to all attendees.
Participants can submit visualizations (images or videos) from MFEM-related
simulations. The winner of the competition (selected by the organizing
committee) will receive an MFEM T-shirt. We will also feature the images in the
[gallery](gallery.md). Here are the winners from the 2024 workshop:

<div class="col-md-6" markdown="1">
<a href="https://mfem.org/img/gallery/workshop24/ex5-aniso-q-200x200-p2-Q3-HDG-a1e3-ks1e-3-c2e4.png"><img src="https://mfem.org/img/gallery/workshop24/ex5-aniso-q-200x200-p2-Q3-HDG-a1e3-ks1e-3-c2e4.png" width="250"></a>
<center>
**Jan Nikl**: *Heat flux magnitude in a convection - (anisotropic) diffusion simulation with MFEM text as the initial temperature profile*
</center>
</div>

<div class="col-md-6" markdown="1">
<a href="https://mfem.org/img/gallery/workshop24/conf-topopt.png"><img src="https://mfem.org/img/gallery/workshop24/conf-topopt.png" width="400"></a>
<center>
**Mathias Schmidt**: *Multi-component topology optimization with conformal meshes*
</center>
</div>

<div class="col-md-12" markdown="1" style="padding-left:0;">
To submit an entry in the contest, please fill out the
[Google form](https://docs.google.com/forms/d/e/1FAIpQLSdDpasPq0V-q2v_UFpmMyEjV14C67DNrmGbTdnkP57Tzsc3Gg/viewform?usp=dialog).

Alternatively, you may email your submission to
[mfem@llnl.gov](mailto:mfem@llnl.gov), including your name, institution, a short
description of the simulation (the underlying physics, discretization,
application details, etc.), and visualization software used (GLVis, ParaView,
VisIt, etc.).

---

### Virtual Backgrounds

We invite workshop participants to use the virtual backgrounds designed for this event.
Click each image to enlarge, then right-click to save locally.
</div>

<center>

<div class="col-md-4"  markdown="1">
[![](img/workshop-vb/mfem-blueprint-text.png)](img/workshop-vb/mfem-blueprint-text.png)
[![](img/workshop-vb/mfem-dark-blue-text.png)](img/workshop-vb/mfem-dark-blue-text.png)
</div>

<div class="col-md-4"  markdown="1">
[![](img/workshop-vb/mfem-wave-text.png)](img/workshop-vb/mfem-wave-text.png)
[![](img/workshop-vb/mfem-light-blue-text.png)](img/workshop-vb/mfem-light-blue-text.png)
</div>

<div class="col-md-4"  markdown="1">
[![](img/workshop-vb/mfem-tron-wave-text.png)](img/workshop-vb/mfem-tron-wave-text.png)
[![](img/workshop-vb/mfem-grey-text.png)](img/workshop-vb/mfem-grey-text.png)
</div>

</center>

<div class="col-md-12" markdown="1" style="padding-left:0;">

---

### About Livermore and LLNL

Founded in 1869, Livermore is California's oldest wine region, framed by award-winning wineries,
farmlands, and ranches that mirror the valley's western heritage. As home to renowned science and
technology centers, Lawrence Livermore and Sandia national labs, Livermore is a technological hub
and an academically engaged community. It has become an integral part of the Bay Area, successfully
competing in the global market powered by its wealth of research, technology, and innovation.

For more than 70 years, LLNL has applied science and technology to make the world a safer place.
World-class facilities include the National Ignition Facility, the Advanced Manufacturing
Laboratory, and the Livermore Computing Center hosting the world's fastest exascale supercomputer,
El Capitan.

---

### About PSU's Fariborz Maseeh Department of Mathematics + Statistics

[​Portland State University](https://www.pdx.edu) (PSU), established in 1946 and located in downtown
Portland, Oregon, is a public research institution known for its commitment to innovation and
community engagement. With over 200 degree programs, PSU serves more than 20,000 students, making it
Oregon’s most diverse and affordable research university. The university emphasizes practical
solutions and sustainability, integrating education with creative problem-solving to serve both
local and global communities.​

Within PSU, the [Fariborz Maseeh Department of Mathematics and Statistics](https://www.pdx.edu/math)
is dedicated to excellence in research and teaching across mathematics and statistics. The
department focuses on applied and computational mathematics and statistics, fostering
cross-disciplinary engagement to address real-world challenges. It offers a range of undergraduate
and graduate programs, including certificates, master's degrees, and Ph.D. programs, supported by a
faculty of over 30 members and a vibrant community of undergraduate and graduate students.

---

### Workshop Sponsors

We gratefully acknowledge the contributions of our **gold tier** workshop sponsors, **Amazon Web Services (AWS)** and **Lawrence Livermore National Laboratory (LLNL)**.

</div>

<center>
<div class="col-md-6"  markdown="1">
<img src="/img/aws_logo_squid_ink.png" width="150">
</div>
<div class="col-md-6"  markdown="1">
<img src="/img/llnl_logo.png" width="300">
</div>
</center>

<div class="col-md-12" markdown="1" style="padding-left:0;">

---

### Organizing Committee
[*Holly Auten*](https://people.llnl.gov/auten1)
┊  [*Aaron Fisher*](https://people.llnl.gov/fisher47)
┊  [*Tzanio Kolev*](https://people.llnl.gov/kolev1)
┊  [*Justin Laughlin*](https://www.linkedin.com/in/justin-laughlin)
┊  [*Ketan Mittal*](https://people.llnl.gov/mittal3)
┊  [*Will Pazner*](https://pazner.github.io)
┊  [*Sohail Reddy*](https://scholar.google.com/citations?user=trH03DQAAAAJ&hl=en)
┊  [*Qi Tang*](https://tangqi.github.io)

---

### Previous Workshops

- [MFEM Community Workshop 2024](../workshop24)
- [MFEM Community Workshop 2023](../workshop23)
- [MFEM Community Workshop 2022](../workshop22)
- [MFEM Community Workshop 2021](../workshop21)

</div>
