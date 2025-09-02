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

Please [register for the workshop](https://docs.google.com/forms/d/e/1FAIpQLSc31dyl4hUQi8TvQryPYZUjbUPAAdyVTqS0ccahCoIdpFMjrg/viewform?usp=header) online.
The deadline to register is **Wednesday, August 27**.

* **In person:** After registering, please proceed to this [payment page](https://commerce.cashnet.com/pdxMFEM)
to submit your registration fee ($100), which will cover food and other expenses.
MFEM-branded items (t-shirt, pint glass, etc.) will also be made available for purchase at a later date.

* **Students:** Thanks to generous sponsorship of the workshop by LLNL, the in-person registration fee is waived for students.
You may apply for travel reimbursement via [this form](https://docs.google.com/forms/d/e/1FAIpQLSegY2TT6UhJVdhMzwL-BOTPr2JEm7A3RsZ5OvIYA5JU3pQEfg/viewform).

* **Remote:** There is no registration fee for remote participants. Zoom details will be distributed prior to the event date.

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

This will be the second hybrid edition of the MFEM community workshop. The meeting will include the
following elements:

- Project news and development updates from the MFEM team
- An overview of the latest features in MFEM-4.8 and future roadmap
- Contributed talks from application developers utilizing MFEM
- Student lightning talks and visualization contest
- Office hours and discussions with the MFEM team

See also the agenda for the previous [2024](../workshop24), [2023](../workshop23), [2022](../workshop22) and [2021](../workshop21) MFEM workshops.

Workshop participants are encouraged to join the
[MFEM Community Slack workspace](https://join.slack.com/t/mfemworkshop/shared_invite/zt-1hxasxnlt-erkRWQTMLmBoHUdXlB0Wfg)
to communicate with other MFEM users and developers before, during and after the
MFEM workshop.

### Agenda

The meeting activities will take place 8:00 am - 5:00 pm Pacific Daylight Time (GMT-7) on Wednesday, September 10 and Thursday, September 11.

<br>

#### Tuesday, October 22

| Time | Activity | Presenter |
|---|---|---|
| 8:00-8:30 | **Breakfast + Registration** <br> | [PSU SMSU 296/8](https://maps.app.goo.gl/aarCK3W6w2Cfzvxp6) |
| 8:30-9:00 | **Welcome & Overview** | **Will Pazner** (PSU) |
| 9:00-9:30 | **The State of MFEM** | **Tzanio Kolev** (LLNL) |
| 9:30-10:00 | **Recent Developments** | **Veselin Dobrev** (LLNL) |
| 10:00-10:30 | **Coffee Break** | discussions on [Slack](https://mfemworkshop.slack.com) |
| 10:30-12:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Will Pazner** | **Stefan Henneking** (UT Austin) <br><details><summary> *Real-time Bayesian inference at extreme scale: A digital twin for tsunami early warning applied to the Cascadia subduction zone*</summary><h6> We present a Bayesian inversion-based digital twin that employs acoustic pressure data from seafloor sensors, along with 3D coupled acoustic-gravity wave equations, to infer earthquake-induced spatiotemporal seafloor motion in real time and forecast tsunami propagation toward coastlines for early warning with quantified uncertainties. Our target is the Cascadia subduction zone, with one billion parameters. Computing the posterior mean alone would require 50 years on a 512 GPU machine. Instead, exploiting the shift invariance of the parameter-to-observable map and devising novel parallel algorithms, we induce a fast offline-online decomposition. The offline component requires just one adjoint wave propagation per sensor; using MFEM, we scale this part of the computation to the full El Capitan system (43,520 GPUs) with 92% weak parallel efficiency. Moreover, given real-time data, the online component exactly solves the Bayesian inverse and forecasting problems in 0.2 seconds on a modest GPU system, a ten-billion-fold speedup. </h6></details><br> **Ziheng Yu** (Cambridge University) <br><details><summary> *Application of MFEM in some common geodynamical problems*</summary><h6> We present how MFEM is applied in our geodynamical computations, i.e., about the viscoelastic deformations of the Earth, coupled with multiphysics effects in planetary length scales and paleo time scales. Some common computing challenges are covered in the talk with a focus on new MFEM extensions we developed to facilitate the solution. The first topic is on dealing with the boundary at infinity (not computationally accessible) for self-gravitation computations, for which we developed the Dirichlet-to-Neumann Operator class. Then, we introduce new classes for supporting the block-system computation of coupled fields that are defined on different but partially overlapping meshes, e.g. Earth's deformation and gravity potential fields. We close by discussing the structure of a tailored TimeDependentOperator class specifically for differential-algebraic systems of equations (DAE), which are notorious but common in geophysical settings. </h6></details><br> **John Camier** (LLNL) <br><details><summary> *A Guided Tour of MFEM GPU Kernel Optimization Techniques*</summary><h6> This presentation explores a variety of kernel optimization strategies for MFEM, leveraging its GPU abstraction layer to achieve high performance on AMD and NVIDIA GPUs. Focusing on the Cascadia application code, we detail the journey toward optimal implementations, highlighting techniques to navigate compiler possibilities and to unlock architectural opportunities. Our discussion provides practical insights for enhancing finite element computations in high-performance computing environments. Joint work with Veselin Dobrev (LLNL), Stefan Henneking (UT Austin), Tzanio Kolev (LLNL), and Jiqun Tu (NVIDIA). </h6></details><br>|
| 12:00-1:00 | **Lunch** | [PSU SMSU 296/8](https://maps.app.goo.gl/aarCK3W6w2Cfzvxp6) |
| 1:00-1:30 | **Student Session 1** <br> (10 mins each)<br><br>Chair:<br> **Ketan Mittal** | **Leonardo Molinari** (Emory University) <br><details><summary> *A Domain-Decomposition Framework for Multiphysics Biomedical Modeling: Application to Cardiac Radiofrequency Ablation* </summary><h6> TBD. </h6></details><br> **Matthew Blomquist** (UC Merced) <br><details><summary> *Characteristic Bending - A Robust Advection Scheme for Incompressible Flows*</summary><h6> TBD. </h6></details><br> **Ramin Pahnabi** (Brigham Young University) <br><details><summary> *High-Order Space–Time Finite Element Simulations of Fluid Mechanics Using MFEM* </summary><h6> TBD. </h6></details><br> |
| 1:40-2:10 | **Student Session 2** <br> (10 mins each)<br><br>Chair:<br> **Ketan Mittal** | **Topher Eyre** (Brigham Young University) <br><details><summary> *Parameter extraction from electromagnetic eigenmode simulations of multimodal cavities using MFEM* </summary><h6> TBD. </h6></details><br> **Tyler Fara** (Oregon State University) <br><details><summary> *A Stable FEM Framework for Coupled PDE–ODE Bioheat Models with Nonlinear Boundary Conditions* </summary><h6> TBD. </h6></details><br> **Barry Fadness** (Portland State University) <br><details><summary> *Algebraic hybridization for the Darcy problem* </summary><h6> TBD. </h6></details></br> |
| 2:20-2:50 | **Student Session 3** <br> (10 mins each)<br><br>Chair:<br> **Ketan Mittal** | **Anthony Kolshorn** (Portland State University) <br><details><summary> *IMEX time integration for DG convection diffusion* </summary><h6> TBD. </h6></details><br> **Rushan	Zhang** (Georgia Institute of Technology) <br><details><summary> *Structure-Preserving Transfer of Grad-Shafranov Equilibria to Magnetohydrodynamic Solvers* </summary><h6> TBD. </h6></details><br> **Patrick Saber** (Pennsylvania State University) <br><details><summary> *An explicit description of implementation of 4D, H(div)-conforming simplicial finite elements in MFEM* </summary><h6> TBD. </h6></details></br> |
| 3:00-3:30 | **Coffee Break & Group Photo** | download a [virtual background](#virtual-backgrounds) below |
| 3:30-5:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Justin Laughlin** | **Juilian Andrej** (LLNL) <br><details><summary> *DFEM: Differentiable Finite Elements in MFEM* </summary><h6> TBD. </h6></details><br> **Joseph Signorelli** (University of Illinois at Urbana-Champaign) <br><details><summary> *Particles in MFEM* </summary><h6> TBD. </h6></details><br> **Christopher Vogl** (LLNL) <br><details><summary> *Coupling MFEM with structured mesh libraries* </summary><h6> When solving partial differential equations, scientific software libraries typically target either structured mesh or unstructured mesh approaches. Recent investment in those libraries has resulted in powerful capabilities; however, users are typically restricted to one of the two meshing approaches. With multiphysics application needs in mind, recent work removes that restriction by developing features in the MFEM library to enable coupling with structured mesh libraries. One such feature is the ability to transfer fields between the element-based adaptive mesh refinement framework in MFEM and the patched-based AMR framework in structured mesh libraries.  Another feature is the generalization of the 2:1 AMR capability in MFEM to support the N:1 refinement common in structured mesh libraries. To showcase these features, this demo will include results coupling MFEM with the PISALE library and coupling MFEM with the AMReX library. </h6></details><br> |
| 5:00 | **Day 1 Wrap-up** | MFEM team |
| 6:00-8:00 | **Workshop Dinner** <br> | Location TBD |

<br>

#### Wednesday, October 23

| Time | Activity | Presenter |
|---|---|---|
| 8:00-8:30 | **Breakfast** <br> | [PSU SMSU 296/8](https://maps.app.goo.gl/aarCK3W6w2Cfzvxp6) |
| 8:30-9:00 | **Visualization Contest Winners** <br> | **Will Pazner** (LLNL) |
| 9:00-10:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Tzanio Kolev** | **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> |
| 10:00-10:30 | **Coffee Break** | discussions on [Slack](https://mfemworkshop.slack.com) |
| 10:30-12:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Sohail Reddy** | **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> **TBD** (TBD)<br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> |
| 12:00-1:00 | **Lunch** | [PSU SMSU 296/8](https://maps.app.goo.gl/aarCK3W6w2Cfzvxp6) |
| 1:00-3:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Qi Tang** | **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> |
| 3:00-3:30 | **Coffee Break** | discussions on [Slack](https://mfemworkshop.slack.com) |
| 3:30-5:00 | **Presentations** <br>(30 mins each)<br><br>Chair:<br> **Tzanio Kolev** | **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> **TBD** (TBD) <br><details><summary> *TBD* </summary><h6> TBD. </h6></details><br> |
| 5:00 | **Day 2 Wrap-up** | MFEM team |

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
<img src="/img/aws_logo.png" width="150">
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
