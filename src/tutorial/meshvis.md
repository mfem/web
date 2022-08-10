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
BooleanDifference(50) = { Volume{1}; Delete; }{ Volume{2,3}; Delete; };
```

Gmsh will use the obtained geometry for generating the mesh. However, without additional specifications, we cannot impose boundary conditions without any attributes assigned to the boundaries. Different attributes can be assigned to the volumetric part of the mesh for using different material coefficients within the domain. Here, however, we will use only a single attribute, as the first example uses only a single diffusion coefficient. 
```diff
Physical Volume(1) = {50};
Physical Surface(1) = {1,6,8};

Mesh.MshFileVersion = 2.2;
```
The first line from the above snippet will define physical volume 1 to coincide with the geometry volume 50, which is the final volume obtained by the boolean operation. The second line will define physical surface 1 to include geometric surfaces {1,6,8}. Finally, the last line specify the the file format. It should be pointed out that MFEM can only read ASCII Gmsh format version 2.2. 


<img style="width:60%" src="../img/gmsh02.png"> 
<img style="width:60%" src="../img/gmsh03.png">

The generated mesh is shown in the figure above. Careful inspection reveals that the cylindrical surface is not represented well by the linear elements. We can improve the representation by refining the mesh. The Gmsh input file can be downloaded  <a href="../cross_heat.geo">here</a>  and the mesh <a href="../cross_heat.msh">here</a>. The users are strongly encouraged to play with the mesh and to generate finer discretizations for the simulations.  

For users without access to the graphical interface of Gmsh, a mesh can be generated in a terminal by the following command: 
```diff
gmsh -3 cross_heat.geo
```

To run simulations with the generated mesh, go to the web browser, click on the "Explorer" window with the right bottom of the mouse and select Upload to upload the mesh file from your computer to the AWS machine. Once uploaded, the file is available to any program on the AWS machine. To run example 1 with the newly prepared mesh, copy the file to the examples directory and run the parallel version of example 1 with the following:
```diff
euler@26c14060d771:~/mfem/examples$ mpirun -np 24 ./ex1p -m mesh_file.msh
``` 
The solution of the diffusion equation for the generated mesh is shown in the following two pictures. The figures are generated with ParaView, and the process of visualization is explained at the end of this tutorial session. 
<img style="width:60%" src="../img/parav00002.png">

If we want to enforce Dirichlet boundary conditions different than zero on some other surface, we must export it as a physical surface. For example, if we want to enforce value one on the other cylindrical surface, we can add the following line to the geo file: 
```diff
Physical Surface(2) = {7};
```

If we run ex1p without modifications, a zero value will be assigned to the newly defined surface. Thus, in order to set it to one, we have to modify section 10 is ex1p.cpp
```diff
   // 10. Define the solution vector x as a parallel finite element grid
   //     function corresponding to fespace. Initialize x with initial guess of
   //     zero, which satisfies the boundary conditions.
   ParGridFunction x(&fespace);
   x = 0.0;
   {
      Array<int> ess_bdr(pmesh.bdr_attributes.Max());
      ess_bdr = 0;
      ess_bdr[1] = 1;
      ConstantCoefficient zero(0.0);
      Coefficient* coeff[1];
      coeff[0]=&one;
      x.ProjectBdrCoefficient(coeff,ess_bdr);
   }
```

In the above snippet, we project coefficient one on the degrees of freedom associated with physical surface 2 (in c/c++ the indexing starts at zero). Executing the modified code with the newly created mesh will result in the following solution: 
<img style="width:60%" src="../img/parav00003.png">

MFEM can import meshes saved in Exodus II format generated with  <a href="https://cubit.sandia.gov/">Cubit</a>. However, this feature requires compilation of the library with HDF5, NetCDF, and Exodus, which is not currently available on the AWS machines. 

---

### <i class="fa fa-check-square-o"></i>&nbsp; MFEM's meshing tools
- Mesh Explorer
- Mesh Optimizer
- Shaper

---

### <i class="fa fa-check-square-o"></i>&nbsp; Visualizing results in VisIt and Paraview
To save the simulation results from example 1 (ex1p.cpp) in ParaView format, add the following lines just before step 17 in the file.

```diff
   {
      ParaViewDataCollection *pd = NULL;
      pd = new ParaViewDataCollection("Example1P", &pmesh);
      pd->SetPrefixPath("ParaView");
      pd->RegisterField("solution", &x);
      pd->SetLevelsOfDetail(order);
      pd->SetDataFormat(VTKFormat::BINARY);
      pd->SetHighOrderOutput(true);
      pd->SetCycle(0);
      pd->SetTime(0.0);
      pd->Save();
      delete pd;
   }
```

The first line defines a ParaViewDataCollection for saving data in ParaView data format. The following two lines define the name of the data collection and the prefix path, which is set to ParaView. Thus, the data set will be written in the directory ParaView relative to the current execution path. The following line registers the ParGridFunction x in the data collection. The rest of the lines set different parameters for the format and the data set, and finally, the set is saved and deleted. The users are advised to read the MFEM documentation for more detailed information. 


To download the results saved in ParaView format to the local user machine, one needs to compress and gather all files in a single archive. Therefore, a user should go to the terminal and type the following command:
```diff
tar cvfz paraview.tgz ParaView/
```
, which will generate the file paraview.tgz in the current directory. Download the file by using the explorer window and then go to the download directory and extract the archive by typing in the local terminal: 

```diff
tar vxfz paraview.tgz ParaView/
```

The above assumes a UNIX type of environment. Windows users could use the graphical user interface or WSL/WSL2 engines.  

<a href="https://www.paraview.org/">ParaView</a> can be freely downloaded both as a source code or precompiled binaries. The precompiled binaries are available for Linux, macOS, and Windows. Please follow the instructions for the corresponding operating system for installation instructions.

To visualize the downloaded simulation data, run ParaView and open the file Example1P.pvd in the ParaView/Example1P directory, where the path is relative to the directory where the archive was downloaded. Next, click on the Apply button and select  "solution" in the drop-down menu in the second row of buttons. The geometry, together with the solution, can be rotated on the screen by holding and dragging the mouse. 

<img style="width:80%" src="../img/parav00004.png">

Replacing the ParaviewDataCollection with VisItDataCollection would allow users to write data in VisIt data format. <a href="https://visit-dav.github.io/visit-website/">VisIt</a> can be freely downloaded and installed on Linux, macOS, and Windows and provides another alternative to ParaView. The steps for downloading and the simulation data are the same as the steps outlined above for ParaView.

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
