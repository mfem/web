# MFEM Community Workshop
<h4>October 22-24, 2024</h4>
<h4>LLNL + Virtual</h4>

![MFEM Logo](img/logo-300.png)

### Overview

The MFEM team is happy to invite you to the 2024 MFEM Community Workshop, which
will take place on October 22-24, 2024 in a hybrid format: in-person at
[Lawrence Livermore National Laboratory](#about-livermore-and-llnl) (LLNL) + virtually on Zoom.
The goal of the workshop is to foster collaboration among all MFEM users and
developers, share the latest MFEM features with the broader community, deepen
application engagements, and solicit feedback to guide future development
directions for the project.


*We encourage you to join us in person if you can!*
*For questions, please contact the meeting organizers at*
*[mfem@llnl.gov](mailto:mfem@llnl.gov).*

### Registration

If you plan to attend, either in-person or virtually, [please register no later than **October 15th**](https://docs.google.com/forms/d/e/1FAIpQLSfv419dXX4yPS7Tk1sNbfi_2YXgt3DpW56KCd3TZjjsswKpBw/viewform?usp=sf_link).

In-person attendees will receive a follow-up form for the registration fee (*exact amount TBD, but in the $100-$200 range*), which will cover food and the workshop dinner. In-person attendees will also be welcomed to select optional MFEM-branded items (t-shirt, pint glass, etc.) for purchase.

There is no registration fee for remote participants. Zoom details will be distributed prior to the event date.

### Venue

The meeting will take place at the [University of California Livermore Collaboration Center (UCLCC)](https://goo.gl/maps/BEQxeQSfxB9ee7h47) which is just outside of LLNL's East Gate.

<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3157.358039878656!2d-121.7001545245485!3d37.68778967200738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fe163a1270b93%3A0xfd6db0227dc72426!2sUniversity%20of%20California%20Livermore%20Collaboration%20Center!5e0!3m2!1sen!2sus!4v1690851366106!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

### Lodging Options

There are many hotels in Livermore, and others are available in Pleasanton and nearby cities. See LLNL's [recommended list of area hotels](https://www.llnl.gov/sites/www/files/hotel_listing.pdf) or this [Google Maps search](https://www.google.com/maps/search/hotels+near+lawrence+livermore+national+laboratory/@37.6880708,-121.7794089,12z/data=!3m1!4b1). *If you stay outside of Livermore, we recommend staying west of the city to have a reverse commute to the Lab.*

### Meeting format

Depending on the interest and user feedback, the meeting will include the following elements:

- Project news and development updates from the MFEM team
- An overview of the latest features in MFEM-4.7 and future roadmap
- Contributed talks from application developers utilizing MFEM
- Student lightning talks and visualization contest
- Technical discussions in small breakout groups
- Office hours and hackathon on the last day

See also the agenda for the previous [2023](../workshop23), [2022](../workshop22) and [2021](../workshop21) MFEM workshops.

Workshop participants are encouraged to join the
[MFEM Community Slack workspace](https://join.slack.com/t/mfemworkshop/shared_invite/zt-1hxasxnlt-erkRWQTMLmBoHUdXlB0Wfg)
to communicate with other MFEM users and developers before, during and after the
MFEM workshop.

### Agenda

<!--
The meeting activities will take place 8:00am-5:00pm Pacific Daylight Time (GMT-7) on October 22, 23 and 24, with office hours and hackathon in the afternoon of the last day.

The preliminary agenda is listed below. Full agenda will be announced on October 1.
-->

<br>

#### Tuesday, October 22

| Time | Activity | Presenter |
|---|---|---|
| 8:00-8:30 | **Breakfast + Registration** <br> | on site at [UCLCC](https://goo.gl/maps/BEQxeQSfxB9ee7h47) |
| 8:30-9:00 | **Welcome & Overview** <br> | **Aaron Fisher** (LLNL) |
| 9:00-9:30 | **The State of MFEM** <br> | **Tzanio Kolev** (LLNL) |
| 9:30-10:00 | **Recent Developments** <br> | **Veselin Dobrev** (LLNL) |
| 10:00-10:30 | **Break** | discussions on [Slack](https://mfemworkshop.slack.com) |
| 10:30-12:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Tzanio Kolev** | **Máté Kovács** (Braid Technologies, Inc.) <br><details><summary> *Rust Wrapper for MFEM* </summary><h6> Rust is quickly emerging as a modern alternative to C++ for systems and performance-critical programming. With a user-centered design, "batteries included" philosophy around tooling, and principled approach to correctness, Rust holds a lot of potential to make complex libraries easier to use. Building a Rust wrapper for MFEM would achieve most of the benefits of a rewrite at a fraction of the effort. By showcasing this prototype, I hope to convince you that creating and maintaining a Rust wrapper for MFEM is a worthy goal. I will further argue that the small modifications to the C++ API that may be necessary to reach optimal integration with Rust would also improve the usability for C++. </h6></details><br> **Adrian Butscher** (Autodesk Research) <br><details><summary> *Geometrically Constrained Level Set Topology Optimization Using a Novel Hilbert Space Extension Method* </summary><h6> TBD </h6></details><br> **Ketan Mittal** (LLNL) <br><details><summary> *Interpolation at Arbitrary Points in High-Order Meshes on GPUs* </summary><h6> Robust and scalable arbitrary point interpolation is required in the finite element method and spectral element method for querying the partial differential equation solution at points of interest in the domain, comparison of solution between different meshes, and Lagrangian particle tracking. This is a challenging problem, particularly for high-order unstructured meshes partitioned in parallel with MPI, as it requires identifying the element that overlaps a given point and computing the reference space coordinates inside the element corresponding to the point. We present a robust and efficient way to address this problem for large-scale high-order meshes. First, a combination of globally partitioned and processor-local maps are used to determine a list of candidate MPI ranks and element pairs that could contain the point. Next, element-wise bounding boxes are used to further narrow down the list of candidate elements. Finally, Newton's method with trust region-based approach is used to invert the affine map for the candidate elements and determine the reference space coordinates corresponding to the point. Since GPU-based architectures have demonstrated to accelerate computational analyses using meshes with tensor-product elements, specialized kernel have been developed to effect the arbitrary point search and interpolation on GPUs. We demonstrate the effectiveness of this approach using various high-order meshes. </h6></details><br>|
| 12:00-1:00 | **Lunch** | on site at [UCLCC](https://goo.gl/maps/BEQxeQSfxB9ee7h47) |
| 1:00-3:00 | **Student Session** <br> (10 mins each)<br><br>Chair:<br> **Ketan Mittal** |**Student Lightning Talks Part 1** <br><br>**Nanna Berre** (Norwegian University of Science and Technology) <br><details><summary> *High-Order CutFEM Solvers in MFEM* </summary><h6> Creating conforming meshes for complex, realistic problems can be challenging and  consume a significant portion of the total simulation time. The cut finite element method (CutFEM) allows the geometry to be represented independently of the computational domain, thus circumventing the mesh generation while maintaining the accuracy and robustness of the standard finite element method. In this talk, we present recent implementations of CutFEM solvers in MFEM, along with numerical convergence studies. </h6></details><br> **Julian Lüken** (University of Antwerp) <br><details><summary> *Simulating atom probe tomography using MFEM* </summary><h6> In atom probe tomography (APT), spatial reconstruction enables volumetric insight into a specimen's nanostructure. To this day, a fast reconstruction method which utilizes the true potential of APT in terms of resolution does not exist. A model of its effective inverse, the field evaporation, which provides a physically accurate description of the ion trajectories, is a crucial component in reconstruction. The simulation of each individual evaporation while  has been time inefficient. We introduce AdAPTS, an adaptive atom probe tomography simulation library based on MFEM. AdAPTS is capable of generating accurate detector hit maps of various specimens, efficiently representing and simulating the experimental domain from specimen to detector. Using AdAPTS, we are able to accurately simulate the field evaporation of various specimens, revealing realistic poles and zone lines. </h6></details><br> **Aditya Parik** (Utah State University) <br><details><summary> *Arbitrary Point Search and Interpolation on Surface Meshes* </summary><h6> Scalable high-order interpolation at arbitrary locations on finite element meshes is essential in applications such as Lagrangian particle tracking coupled to Eulerian fields, coupled overlapping grids, and grid-to-grid interpolation. This is currently achieved in MFEM for volume meshes using FindPointsGSLIB, which is based on the high-order interpolation library findpts. Therein, global and local hash maps are constructed to rapidly narrow down the search space to determine, first the correct rank, and then the candidate elements on that rank that may contain a given point in physical-space. Next, element-wise bounding boxes help further narrow down the list of candidate elements. Finally, a Newton's method based approach is used to determine if the point overlaps with the element, and the corresponding reference coordinates. Through this work, we extend FindPointsGSLIB to surface meshes where we encounter interesting implementation challenges in the construction of the global and local maps, bounding boxes, and the convergence criterion for the Newton search. The effectiveness of this approach is tested by searching for a large number of points on various 2D and 3D meshes and then obtaining the accuracy of interpolation of a test field at the found coordinates. We also test the GPU scaling characteristics of this approach with respect to the number of points for both search and interpolation operations.</h6></details><br> **Gabriel Pinochet-Soto** (Portland State University) <br><details><summary> *Exploring generalized Jacobi preconditioners and smoothers in MFEM* </summary><h6> This talk will present a new type of smoother called the L(p,q)-Jacobi family of smoothers, which is a generalization of the L(1)-Jacobi smoother. We will discuss how these smoothers are implemented in MFEM and compare the performance of the solvers. Additionally, we will delve into a specific case of the L(1)-Jacobi preconditioner for partially assembled operators and explain their implementation and effectiveness.</h6></details><br> **Student Lightning Talks Part 2**<br><br> **Matthew Blomquist** (University of California Merced)<br><details><summary> *Semi-Lagrangian characteristic reconstruction and projection for transport under incompressible velocity fields*</summary><h6> We present a novel semi-Lagrangian characteristic reconstruction method that leverages a volume preserving projection to advect quantities under incompressible velocity fields. A key advantage of this framework is to see the traditional semi-Lagrangian scheme as the construction of a diffeomorphism between the deformed and original geometry (reference map). This representation allows us to use the local deformation of the geometry to design a projection for the reference map onto the space of volume preserving diffeomorphisms. In the context of the advection of an implicit surface representation (level set method), this results in significant improvements to the interface precision and mass conservation. In this short talk, I will demonstrate our new method with a variety of canonical two-dimensional examples and compare this new approach to traditional schemes.</h6></details><br> **Paul Moujaes** (TU-Dortmund)<br><details><summary> *Clip and Scale Limiting for remapping H1 velocity fields in Lagrangian Hydrodynamics Simulations*</summary><h6> The mesh quality in Lagrangian hydrodynamics simulations can worsen drastically over time. Therefore, pausing the simulation and remapping the quantities is needed at some point. The remapping process can be written as a linear advection equation. In this talk, we present the application of the Clip and Scale limiter for remapping the velocity field which is discretized with continuous finite elements. </h6></details><br> **Arjun Vijaywargiya** (University of Notre Dame)<br><details><summary> *High Order Computation of MFC Barycenters with MFEM* </summary><h6> We develop a class of barycenter problems based on mean field control problems in three dimensions with associated reactive-diffusion systems of unnormalized multi-species densities. The primary objective is to present a comprehensive framework for efficiently computing the proposed variational problem: generalized Benamou-Brenier formulas with multiple input density vectors as boundary conditions. Our approach involves the utilization of high-order finite element discretizations of the spacetime domain to achieve improved accuracy. The discrete optimization problem is then solved using the primal-dual hybrid gradient (PDHG) algorithm, a first-order optimization method for effectively addressing a wide range of constrained optimization problems. The efficacy and robustness of our proposed framework are illustrated through several numerical examples in three dimensions, such as the computation of the barycenter of multi-density systems consisting of Gaussian distributions and reactive-diffusive multi-density systems involving 3D voxel densities. Additional examples highlighting computations on 2D embedded surfaces are also provided. </h6></details><br> **Yi Zong** (Tsinghua University)<br><details><summary> *FP16 Acceleration in Structured Multigrid Preconditioner for Real-World Problems* </summary><h6>Half-precision hardware support is now almost ubiquitous. In contrast to its active use in AI, half-precision is less commonly employed in scientific and engineering computing. The valuable proposition of accelerating scientific computing applications using half-precision prompted this study. Focusing on solving sparse linear systems in scientific computing, we explore the technique of utilizing FP16 in multigrid preconditioners. Based on observations of sparse matrix formats, numerical features of scientific applications, and the performance characteristics of multigrid, this study formulates four guidelines for FP16 utilization in multigrid. The proposed algorithm demonstrates how to avoid FP16 overflow through scaling. A setup-then-scale strategy prevents FP16’s limited accuracy and narrow range from interfering with the multigrid’s numerical properties. Another strategy, recover-and-rescale on the fly, reduces the memory footprint of hotspot kernels. The extra precision-conversion overhead in mix-precision kernels is addressed by the transformation of storage formats and SIMD implementation. Two ablation experiments validate the effectiveness of our algorithm and parallel kernel implementation on ARM and X86 architectures. We further evaluate three idealized and five real-world problems to demonstrate the advantage of utilizing FP16 in a multigrid preconditioner. The average speedups are approximately 2.75x and 1.95x in preconditioner and end-to-end workflow, respectively.</h6></details>
| 3:00-3:30 | **Break & Group Photo** | download a [virtual background](#virtual-backgrounds) below |
| 3:30-5:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Will Pazner** | **Yu Leng** (Los Alamos National Laboratory) <br><details><summary> *Arbitrary Order Virtual Element Methods for High-Order Phase-Field Modeling of Dynamic Fracture* </summary><h6> Accurate modeling of fracture nucleation and propagation in brittle and ductile materials subjected to dynamic loading is important in predicting material damage and failure under extreme conditions. Phase-field fracture models have garnered a lot of attention in recent years due to their success in representing damage and fracture processes in a wide class of materials and under a variety of loading conditions. Second-order phase-field fracture models are by far the most popular among researchers (and increasingly, among practitioners), but fourth-order models have started to gain broader acceptance since their more recent introduction. The exact solution corresponding to these high-order phase-field fracture models has higher regularity. Thus, numerical solutions of the model equations can achieve improved accuracy and higher spatial convergence rates. In this work, we develop a virtual element framework for the high-order phase-field model of dynamic fracture. The virtual element method (VEM) can be regarded as a generalization of the classical finite element method. In addition to many other desirable characteristics, the VEM allows computing on polytopal meshes. Here, we use H1-conforming virtual elements and the generalized-α time integration method for the momentum balance equation, and adopt H2-conforming virtual elements for the high-order phase-field equation. We verify our virtual element framework using classical quasi-static benchmark problems and demonstrate its capabilities with the aid of numerical simulations of dynamic fracture in brittle materials. </h6></details><br> **Michael Tupek** (LLNL) <br><details><summary> *Automatic Parameter Sensitivities in Serac for Engineering Applications* </summary><h6> We present a framework for automatically calculating sensitivities for both topology and shape design optimization workflows. Building on MFEM infrastructure, we provide abstractions for quickly specifying, solving, coupling, and differentiating new PDEs for engineering applications. Recent developments in Serac include: highly robust nonlinear solvers, integration of the Tribol library for contact enforcement, coupled thermal-mechanics, differentiable material model library, and checkpointing for transient adjoint calculations. </h6></details><br> **Jan Nikl** (LLNL) <br><details><summary> *Hybridization of Convection-Diffusion Systems in MFEM* </summary><h6> Convection-diffusion systems are likely the most common class of partial differential equations appearing in practically all different applications. However, their mixed formulation typically suffers from prohibitively high computational costs and difficult preconditioning, especially close to the steady state where the system becomes a saddle point problem. The hybridization technique offers an appealing answer to these issues. The new framework for mixed systems enables single-line hybridization, reducing the problem to face traces of the total flux only. Solution of such system is then inexpensive, and preconditioning becomes nearly trivial. Non-linear convection is also supported with the action-based regime of operation. Description of the mechanism as well as code examples to show ease of usage are presented. </h6></details><br> |
| 5:00 | **Day 1 Wrap-up** | MFEM team |
| 5:30-8:00 | **Workshop Dinner** <br> | [First Street Alehouse](https://firststreetalehouse.com/) |

<br>

#### Wednesday, October 23

| Time | Activity | Presenter |
|---|---|---|
| 8:00-8:30 | **Breakfast** <br> | on site at [UCLCC](https://goo.gl/maps/BEQxeQSfxB9ee7h47) |
| 8:30-9:00 | **Visualization Contest Winners** <br> | **Will Pazner** (Portland State University) |
| 9:00-10:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Sohail Reddy** | **Gourab Panigrahi** (Indian Institute of Science) <br><details><summary> *Hardware Aware Matrix-Free Approach for Accelerating FE Discretized Eigenvalue Problems: Application to Large-Scale Kohn-Sham Density Functional Theory* </summary><h6> The finite-element (FE) discretization of a partial differential equation usually involves construction of a FE discretized operator, and computing its action on trial FE discretized fields for the solution of a linear system of equations or eigenvalue problems using iterative solvers. This is traditionally computed using global sparse-vector multiplication algorithms. However, recent hardware-aware algorithms for evaluating such higher-order FE discretized matrix-vector multiplications suggest that on-the-fly matrix-vector products without building and storing the cell-level dense matrices (cell-matrix approach) reduce both arithmetic complexity and memory footprint and are referred to as matrix-free approaches. These approaches exploit the tensor-structured nature of the FE polynomial basis for evaluating the underlying integrals, and the current state-of-the-art matrix-free implementations deal with the action of FE discretized matrix on a single vector. These are neither optimal nor readily applicable for matrix multi-vector products involving large number of vectors (>1000). We discuss a computationally efficient and scalable matrix-free algorithm and implementation strategies to compute the FE discretized matrix multi-vector products on multi-node GPU architectures. We use batched evaluation strategies, with the batchsize tailored to underlying hardware architectures, leading to better data locality and allowing for parallelization over multiple batches. We devise an algorithm to overlap compute and data movement in conjunction with GPU shared memory, constant memory, and kernel fusion to reduce data accesses to and from device memory and registers to reduce bank conflicts. Further, we propose a strategy where the memory of both the registers and shared memory is utilized to mitigate the memory constraints. We benchmark the performance of our implementation using a representative FE discretized matrix acting on multivectors of various sizes on multi-node GPU architectures and compare the performance against cell-matrix approach and matrix-free approaches implemented in MFEM and deal.ii. Further, usefulness of the proposed approach is demonstrated in accelerating large-scale eigenvalue problems arising in FE discretized Density Functional Theory calculations, a quantum mechanical theory used for first principle material modeling. </h6></details><br> **Julian Andrej** (LLNL) <br><details><summary> *Differentiating Large-Scale Finite Element Applications with MFEM* </summary><h6> This presentation will go over the details of dFEM by explaining how MFEM leverages the Finite Element Operator Decomposition to introduce an automatic differentiation interface. We discuss advantages of this approach over traditional AD techniques and our integration with Enzyme. The talk is concluded with examples and a live demo. </h6></details><br> |
| 10:00-10:30 | **Break** | discussions on [Slack](https://mfemworkshop.slack.com) |
| 10:30-12:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Aaron Fisher** | **Vladimir Tomov** (LLNL) <br><details><summary> *Recent Work in the MFEM Miniapps for Shock Hydro, Field Remap, and Mesh Optimization* </summary><h6> This presentation discusses recent advancements, research, and exploratory work in the MFEM miniapps for shock hydrodynamics (Laghos), field remap (Remhos), and mesh optimization. For shock hydro, we present the implementation of slip wall boundary conditions for curved domains, along with research involving material interfaces using the shifted interface method or cut-element integration through Algoim and moments-based integration. In the field remap miniapp, we cover developments in stabilized remap for continuous fields, interface sharpening techniques, and matrix-free methods for GPU execution. Lastly, we explore recent progress in mesh optimization, including surface fitting and its GPU implementation, tangential relaxation, automatic differentiation (AD) for complex objective functionals, enhanced metric theory and quality metrics, and hpr-adaptivity for the mesh representation. While some of these advancements are public, general methods that can be applied across various practical miniapps, others are exploratory, demonstrating how the miniapps can serve as a starting point for research in specific areas. </h6></details><br> **Hui-Chia Yu** (Michigan State University) <br><details><summary> *Battery Electrode Simulation Toolkit using MFEM (BESFEM)* </summary><h6> Conventional sharp-interface simulations require mesh systems conformal to the domain of interest for solving governing equations. Our research team employs an alternative approach, the smoothed boundary method (SBM), that utilizes a continuous domain function to describe geometries and reformulate governing equations. This formulation enables solving governing equations on a regular Cartesian grid, eliminating the need for body-conforming meshes. We have been developing an Open-Source Battery Electrode Simulation Toolkit using MFEM (BESFEM). This toolkit integrates the SBM approach on the MFEM solver library (a product of the DOE's Exascale Computing Project). To enhance accuracy and computational efficiency, our team leverage MFEM's built-in adaptive mesh refinement (AMR) functionality, where elements near SBM diffuse interfaces are multilevel refined. BESFEM will be made fully available as a research and education tool for the battery science and materials science communities. </h6></details><br> **Dylan Copeland** (LLNL)<br><details><summary> *Sparse, Approximate Quadrature for Acceleration of Isogeometric Analysis and Reduced Order Models* </summary><h6> Numerical integration for assembly of FEM systems typically employs quadrature rules selected for the polynomial order of basis functions in each element. In some cases, a much sparser rule can maintain accuracy. We present an algebraic method for constructing sparse rules, by formulating a constraint system of states required to be integrated accurately. A nonnegative least squares solver finds a sparse, approximate solution to this constraint system, yielding a quadrature rule with fewer points. <br><br> One application we demonstrate is isogeometric analysis, where a NURBS FEM space is defined on patches consisting of many elements. Setup times are greatly accelerated, by using patch-wise integration with sum factorization and reduced quadrature rules constructed on patches. <br><br> Another area of application is reduced order models (ROM), where the FEM system is restricted to a reduced POD basis formed from training data. Instead of hyper-reduction methods such as DEIM, the empirical quadrature procedure (EQP) can be used to accelerate ROM simulations with a sparse quadrature rule in the reduced subspace. We demonstrate this on several benchmark problems in the Laghos miniapp and show that energy conservation is maintained. </h6></details><br> |
| 12:00-1:00 | **Lunch** | on site at [UCLCC](https://goo.gl/maps/BEQxeQSfxB9ee7h47) |
| 1:00-2:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Tzanio Kolev** | **Jacob Spainhour** (CU Boulder) <br><details><summary> *Robust Containment Queries over Collections of Parametric Curves via Generalized Winding Numbers* </summary><h6> The containment query is an important geometric primitive in many multiphysics applications. For example, when initializing multimaterial Arbitrary Lagrangian-Eulerian (ALE) simulations, we often need to determine whether arbitrary quadrature points from the background mesh are inside or outside the regions associated with each material. However, existing methods require expensive refinement to accurately capture curved regions. At the same time, many methods are wholly incompatible with user-defined geometries that contain geometric and numeric gaps and/or self-intersections. In this work, we develop a containment query for 2D regions defined by rational Bezier curves that operates directly on curved objects. Our method relies on the generalized winding number (GWN), a mathematical construction that can be evaluated for each curve independently, making the derived containment query robust to non-watertightness. We use an adaptive algorithm to compute the GWN field exactly, which permits fast evaluation for points considered ""distant"" to the curve while being numerically stable for points that are arbitrarily close. Overall, this classification scheme greatly expands the types of bounding geometry that can be used directly in shaping applications without the need for otherwise expensive repair techniques. If time permits, we will also discuss our extensions of this idea to 3D shapes defined by parametric surfaces. </h6></details><br> **Alexander Blair** (UK Atomic Energy Authority) <br><details><summary> *Platypus: An Open-Source Application for MFEM Problem Set-Up and Assembly in the MOOSE Framework* </summary><h6> "The large-scale open-source finite element simulation framework MOOSE has built an extensive user community around its capabilities in solving large-scale FE problems across a wide range of physics domains whilst maintaining a simple interface for users. However, it currently lacks support for problem set-up and solution on GPU architectures, due in part to its default finite element library backend libMesh, restricting the range of facilities that it may effectively leverage. Here we present Platypus, an open-source MOOSE application under development for the massively parallel multiphysics simulations of finite element problems using the MFEM finite element library, supporting problem assembly and solves on both CPU and GPU architectures. We shall show some initial results on simple thermal and electromagnetic test problems and outline our development plans for supporting upcoming experiments at UKAEA at the HIVE and CHIMERA facilities. </h6></details><br> |
| 2:00-3:00 | **Breakout Sessions** | 2:00-2:45 &mdash; Groups discussions of topics such as: <br> &nbsp; • *current and future application areas* <br> &nbsp; • *new features and enhancements* <br> &nbsp; • *collaboration opportunities* <br> 2:45-3:00 &mdash; Reports from the discussions|
| 3:00-3:30 | **Break** | discussions on [Slack](https://mfemworkshop.slack.com) |
| 3:30-5:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Justin Laughlin** | **Mathias Schmidt** (LLNL) <br><details><summary> *TBD* </summary><h6> TBD </h6></details><br> **Milan Holec** (Xcimer) <br><details><summary> *Towards Predictive Modeling of the World's Most Powerful Fusion Laser at Xcimer* </summary><h6> According to the techno-economic studies, the ultra-violet excimer lasers offer the most straightforward path to the commercial fusion given the lowest J/$ price and their capacity to withstand MJ laser pulses, a fluence when the traditional solid state lasers break. We present our vision on how to model the future laser system spanning the micro-scales at 248nm laser wavelength and macro-scales at tens of meters of the actual laser beamline, where MFEM allows us to design a computationally efficient and accurate discretization based on mathematical details which we will describe in the presentation. </h6></details><br> **Yohann Dudouit** (LLNL) <br><details><summary> *Mitigating Rays-Effect in Phase-Space Advection with Matrix-Free High-Dimensional DG Methods* </summary><h6> The mitigation of the rays-effect in phase-space advection problems is a critical challenge in deterministic transport simulations, particularly when using traditional methods that struggle with numerical artifacts. In this work, we propose a novel high-dimensional matrix-free discontinuous Galerkin (DG) approach designed to address the rays-effect by fully discretizing phase space, including velocity components, up to six dimensions. This methodology avoids the excessive computational cost associated with Monte Carlo simulations while offering a deterministic alternative that preserves accuracy and scalability. A key component of our approach is the use of advanced coordinate transformations, which optimize the coordinate system to minimize the rays-effect by aligning the coordinate system with the net flux. Our matrix-free formulation minimizes memory usage and improves computational efficiency by avoiding the assembly of large sparse matrices, a critical factor when scaling to high-dimensional problems. Numerical experiments demonstrate the effectiveness of this approach in reducing rays-effect artifacts, providing a robust and scalable solution for high-dimensional transport problems. </h6></details><br> |
| 5:00 | **Day 2 Wrap-up** | MFEM team |

<br>

#### Thursday, October 24

| Time | Activity | Presenter |
|---|---|---|
| 8:00-8:30 | **Breakfast** <br> | on site at [UCLCC](https://goo.gl/maps/BEQxeQSfxB9ee7h47) |
| 8:30-12:00 | **Office Hours** <br> | Q&A with MFEM team |
| 12:00-1:00 | **Lunch** | on site at [UCLCC](https://goo.gl/maps/BEQxeQSfxB9ee7h47) |
| 1:00-5:00 | **Additional Meetings and Discussions** | |

---

### Simulation and Visualization Contest

We will be holding a simulation and visualization contest open to all attendees.
Participants can submit visualizations (images or videos) from MFEM-related
simulations. The winner of the competition (selected by the organizing
committee) will receive an MFEM T-shirt. We will also feature the images in the
[gallery](gallery.md). Here are the winners from the 2023 workshop:

<div class="col-md-6" markdown="1">
<a href="https://mfem.org/img/gallery/workshop23/excavator.png"><img src="https://mfem.org/img/gallery/workshop23/excavator.png" height="200"></a>
<center>
**Mehran Ebrahimi**: *Displacement distribution of a loaded excavator arm under static equilibrium*
</center>
</div>

<div class="col-md-6" markdown="1">
<a href="https://mfem.org/img/gallery/workshop23/lf_vortex_rings.mp4"><img src="https://mfem.org/img/gallery/workshop23/lf_vortex_rings.png" width="215"></a>
<center>
**John Camier**: *Leapfrogging vortex rings using an incompressible Schrödinger fluid solver*
</center>
</div>

<div class="col-md-12" markdown="1" style="padding-left:0;">
To submit an entry in the contest, please fill out the
[Google form](https://docs.google.com/forms/d/e/1FAIpQLSe7iIn0KJvu0Iu9Nyp6S0gi9D-l_unsO-WGupBWE3d0l8TgLg/viewform?usp=sf_link).

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
[![](img/workshop-vb/mfem-grey-text.png)](img/workshop-vb/mfem-dark-blue-text.png)
</div>

</center>

<div class="col-md-12" markdown="1" style="padding-left:0;">

---

### About Livermore and LLNL

Founded in 1869, Livermore is California's oldest wine region, framed by award-winning wineries, farmlands, and ranches that mirror the valley's western heritage. As home to renowned science and technology centers, Lawrence Livermore and Sandia national labs, Livermore is a technological hub and an academically engaged community. It has become an integral part of the Bay Area, successfully competing in the global market powered by its wealth of research, technology, and innovation.

For more than 70 years, LLNL has applied science and technology to make the world a safer place. World-class facilities include the National Ignition Facility, the Advanced Manufacturing Laboratory, and the Livermore Computing Center hosting the Sierra supercomputer and home of the future exascale machine, El Capitan.

---

### Organizing Committee
[*Holly Auten*](https://people.llnl.gov/auten1)
┊  [*Aaron Fisher*](https://people.llnl.gov/fisher47)
┊  [*Tzanio Kolev*](https://people.llnl.gov/kolev1)
┊  [*Justin Laughlin*](https://www.linkedin.com/in/justin-laughlin)
┊  [*Ketan Mittal*](https://people.llnl.gov/mittal3)
┊  [*Will Pazner*](https://pazner.github.io)
┊  [*Sohail Reddy*](https://scholar.google.com/citations?user=trH03DQAAAAJ&hl=en)
┊  [*Haley Shuey*](https://www.linkedin.com/in/haley-shuey)

---

### Previous Workshops

- [MFEM Community Workshop 2023](https://mfem.org/workshop23/)
- [MFEM Community Workshop 2022](https://mfem.org/workshop22/)
- [MFEM Community Workshop 2021](https://mfem.org/workshop21/)

</div>
