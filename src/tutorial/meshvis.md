## <i class="fa fa-picture-o"></i>&nbsp; Meshing and Visualization

<span class="label label-default">30 minutes</span>
<span class="label label-default">intermediate</span>

---

<div class="panel panel-success">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-check"></i>&nbsp; Lesson Objectives</h3>
</div>
<div class="panel-body" style="line-height: 1.8;">
<i class="fa fa-square-o"></i>&nbsp; Learn about external mesh generators that can be used with MFEM.<br>
<i class="fa fa-square-o"></i>&nbsp; Learn about MFEM's internal meshing tools.<br>
<i class="fa fa-square-o"></i>&nbsp; Learn about external visualization tools that can be used with MFEM.
</div>
</div>

<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
Please complete the <a href="../start"><i class="fa fa-play-circle"></i>&nbsp; Getting Started</a>
and <a href="../fem"><i class="fa fa-book"></i> Finite Element Basics</a> pages before this lesson.
</div>
</div>

---

### <i class="fa fa-check-square-o"></i>&nbsp; Importing meshes from Gmsh and Cubit

The goal of the first step of the  Meshing and Visualization part of the tutorial is to demonstrate the common steps necessary for generating high-quality meshes in Gmsh and Cubit and how to use them in finite element simulations with MFEM. We will start with Gmsh. Users can find more details about Cubit can be found later in this section. 


Gmsh is an open-source and freely available mesh generation tool with built-in CAD (Computer-aided design) and a postprocessor. The input to Gmsh can be a simple text file that provides a description of the geometry of the finite element model. The geometry can be generated using the Gmsh graphical user interface, simple text editors such as Vi/Vim/Emacs, or using more sophisticated CAD tools, like SolidWorks or Autocad. CAD models in IGES or STEP formats can be imported by the CAD engine of Gmsh, meshed, and prepared as inputs to the MFEM examples. Here, however, we will focus on more simple examples as the focus is on the process of generating meshes suitable for MFEM and not on the actual geometry. 

Many examples together with documentation on the input syntax can be found at the <a href="https://gmsh.info/">Gmsh web page</a>. Users familiar with Gmsh can skip the first steps and proceed directly to the links for downloading already prepared geometries for meshing. 


We will start with the definitions of a cube with edge length L=1 and two cylinders with a radius L/10 and heights equal to L. The following snippets define the above objects, and a screenshot of the graphical user interface of GMSH with the generated objects is shown below. 

```diff
SetFactory("OpenCASCADE");
  
Mesh.Algorithm = 6;
Mesh.CharacteristicLengthMin = 0.1;
Mesh.CharacteristicLengthMax = 0.1;

L=1.0;

Box(1) = {0,0,0,L,L,L};

Rc=L/10;
Cylinder(2) = {L/8, 0.0, L/4, 0, L, 0, Rc , 2*Pi};
Cylinder(3) = {4*L/8, 0.0, L/4, 0, L, 0, Rc , 2*Pi};
```
<img style="width:90%" src="../img/gmsh01.png">


The first line in the Gmsh input file defines the geometric engine. Here it is assumed that Gmsh is compiled with CAD support. Such precompiled binaries for Windows, Mac, and Linux can be downloaded from the <a href="https://gmsh.info/">Gmsh web page</a>. The next three lines define the mesh algorithm, which will be used later for generating the mesh and the associated characteristic length scale. Finer or coarser meshes can be obtained by playing with these numbers. The following line defines a parameter L which is utilized in the definition of the cube. A parameter R defines the radius of the base of the two cylinders. The final geometry which will be used for simulations is obtained by subtracting the two cylinders from the cube as:
```diff
BooleanDifference(50) = { Volume{1}; Delete; }{ Volume{2,3};};
```










- Click on the "Explorer" window with the right bottom of the mouse and select Upload to upload the mesh file from your computer to the AWS machine. Once uploaded, the file is available to any program on the AWS machine. To run example 1 with the newly prepared mesh, copy  or move the mesh to the examples directory and run the parallel version of example 1 with the following line in the terminal:
```diff
euler@26c14060d771:~/mfem/examples$ mpirun -np 24 ./ex1p -m mesh_file.msh
``` 



- Showcase Uploading to AWS

---

### <i class="fa fa-check-square-o"></i>&nbsp; MFEM's meshing tools
- Mesh Explorer
- Mesh Optimizer
- Shaper

---

### <i class="fa fa-check-square-o"></i>&nbsp; Visualizing results in VisIt and Paraview
- Showcase Downloading from AWS

---

<div class="panel panel-warning">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-question-circle"></i>&nbsp; Questions?</h3>
</div>
<div class="panel-body">
Ask for help in the tutorial <a href="https://radiuss-llnl.slack.com/archives/C03T2DQCSC8">Slack channel</a>.
</div>
</div>

<div class="panel panel-success">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-external-link"></i>&nbsp; Next Steps</h3>
</div>
<div class="panel-body" style="line-height: 1.8; margin-bottom: -10pt;">
Depending on your interests pick one of the following lessons:<br>
<ul>
<li> <a href="../examples"><i class="fa fa-gears"></i>&nbsp; Tour of MFEM Examples</a>
<li> <a href="../solvers"><i class="fa fa-tasks"></i>&nbsp; Solvers and Scalability</a>
<li> <a href="../further"><i class="fa fa-rocket"></i>&nbsp; Further Steps</a>
</ul>
</div>
</div>

---

Back to the [MFEM tutorial page](index.md)

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
