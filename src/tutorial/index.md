# MFEM Tutorial on AWS
<h4>August 22, 2024</h4>

![MFEM on AWS](img/mfem-aws.png)

Welcome to the MFEM tutorial, part of the
[HPC Software Tutorial Series](https://hpcic.llnl.gov/tutorials/2024-hpc-tutorials)
in collaboration with [AWS](https://aws.amazon.com/blogs/hpc/call-for-participation-hpc-tutorial-series-from-the-hpcic/).

[MFEM](https://mfem.org/) is a modular parallel C++ library for finite element
methods developed at [CASC](https://computing.llnl.gov/casc/),
[LLNL](https://www.llnl.gov/) with the help of the MFEM [community](https://github.com/mfem/mfem/graphs/contributors) worldwide.

The pages below provide a self-paced overview of MFEM and its use for scalable
finite element discretizations and application development. You can follow
along in your own [Amazon EC2](https://en.wikipedia.org/wiki/Amazon_Elastic_Compute_Cloud) instance or in a [<span class="mdi mdi-docker"></span> Local Docker Container](docker.md) <span class="mdi mdi-new-box mdi-18px" style="color:#dd5034"></span>&nbsp;. No previous experience is necessary.

<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true });
</script>
<div class="mermaid">
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#deebf7',
    'primaryBorderColor': '#3182bd'
}}}%%
  graph LR;
      A[fa:fa-play-circle Getting Started];
      B[fa:fa-book Finite Element Basics];
      C[fa:fa-gears Tour of MFEM Examples];
      D[fa:fa-picture-o Meshing and Visualization];
      E[fa:fa-tasks Solvers and Scalability];
      F[fa:fa-rocket Further Steps];

      A-->B;
      B-->C;
      B-->D;
      B-->E;
      C-->F;
      D-->F;
      E-->F;

      click A "start"
      click B "fem"
      click C "examples"
      click D "meshvis"
      click E "solvers"
      click F "further"
</div>

We recommend that you start with the
[<i class="fa fa-play-circle"></i> Getting Started](start.md) and
[<i class="fa fa-book"></i> Finite Element Basics](fem.md) lessons,
and then, depending on your interests, pick some of the next 3 lessons:
[<i class="fa fa-gears"></i> Tour of MFEM Examples](examples.md),
[<i class="fa fa-picture-o"></i> Meshing and Visualization](meshvis.md), and
[<i class="fa fa-tasks"></i> Solvers and Scalability](solvers.md).
The tutorial concludes with additional suggestions in the
[<i class="fa fa-rocket"></i> Further Steps](further.md) page.

---

<!-- fa-cloud, fa-bookmark-o, see https://fontawesome.com/v4/icons -->
### <i class="fa fa-play-circle"></i>&nbsp; [Getting Started](start.md)

This is the first page you should visit to setup your tutorial environment.
You will learn about:

- Setting up Visual Studio Code editor and terminal
- Setting up GLVis for visualization
- Testing the setup with a simple MFEM example

---

### <i class="fa fa-book"></i>&nbsp; [Finite Element Basics](fem.md)

Once you have the tutorial environment working, visit this page to learn about
the basics of the finite element method and its implementation in MFEM. The
lesson covers:

- Annotated Example 1
- Serial and parallel runs
- GLVis keys/web interface

---

### <i class="fa fa-gears"></i>&nbsp; [Tour of MFEM Examples](examples.md)

This is an optional lesson where you can learn about MFEM's main features: support
for high-order methods, adaptive mesh refinement, $H^1$, $H(curl)$, $H(div)$ and $L^2$
discretizations, through several of the examples included with the library:

- High-order methods for the full de Rham complex (Examples 1, 2, 3, 4)
- Discontinuous Galerkin (Example 9)
- Nonlinear elasticity (Example 10)
- Adaptive mesh refinement (Example 15)
- Complex methods, PML (Examples 22, 25)

---

### <i class="fa fa-picture-o"></i>&nbsp; [Meshing and Visualization](meshvis.md)

This is an optional lesson that illustrates MFEM's support for external mesh generators,
internal meshing tools, and external visualization tools.
You will learn about:

- Importing meshes from Gmsh and Cubit
- MFEM's meshing tools: Mesh Explorer, Mesh Optimizer, and Shaper
- Visualizing results in VisIt and ParaView

---

### <i class="fa fa-tasks"></i>&nbsp; [Solvers and Scalability](solvers.md)

This is an optional lesson that showcases MFEM's parallel scalability and support for efficient
solvers and preconditioners. The lesson covers:

- Scalable algebraic multigrid preconditioners from hypre (Examples 1, 2, 3, 4)
- MFEM's native Multigrid solver (Example 26)
- Low-order refined methods (Solvers and Transfer miniapps)
- Additional solver integrations via PETSc, SuperLU, and STRUMPACK

---

### <i class="fa fa-rocket"></i>&nbsp; [Further Steps](further.md)

This is the final lesson with further activities, including:

- Explore additional examples and miniapps
- Write your own simple simulation starting from one of the MFEM examples
- Learn about integrations with other libraries and MFEM's GPU capabilities
- Visit the MFEM website, watch MFEM-related videos and seminar talks
- Join the MFEM organization on GitHub to contribute to the project

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
