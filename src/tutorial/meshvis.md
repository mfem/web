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

First, we will demonstrate the common steps necessary for generating high-quality meshes in [Gmsh](https://gmsh.info/) and [Cubit](https://cubit.sandia.gov/) and how to use them in finite element simulations with MFEM.

Gmsh is an open-source, freely available mesh generation tool with built-in computer-aided design (CAD) functionality and a postprocessor. The input to Gmsh can be a simple text file that provides a description of the geometry of the finite element model. The geometry can be generated using the Gmsh graphical user interface (GUI), simple text editors such as Vi/Vim/Emacs, or using more sophisticated CAD tools such as SolidWorks or Autocad. CAD models in IGES or STEP formats can be imported by the CAD engine of Gmsh, meshed, and prepared as inputs to the MFEM examples. Here, however, we focus on simpler examples showing the process of generating meshes suitable for MFEM and not on the actual geometry. 

Many examples together with documentation on the input syntax can be found at the [Gmsh website](https://gmsh.info/). Users familiar with Gmsh can skip the first steps and [download](../cross_heat.geo) already prepared geometries for meshing. If Gmsh is not installed on your local machine, please download it and follow the installation [instructions](https://gmsh.info/). 

We will start with the definitions of a cube with edge length L=1 and two cylinders with a radius L/10 and heights equal to L. The following snippets define the above objects, and a screenshot of the GUI of GMSH with the generated objects is shown below.

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

The first line in the Gmsh input file defines the geometric engine. Here it is assumed that Gmsh is compiled with CAD support. Such precompiled binaries for Windows, Mac, and Linux can be downloaded from the [Gmsh website](https://gmsh.info/). The next three lines define the mesh algorithm, which will be used later for generating the mesh and the associated characteristic length scale. Finer or coarser meshes can be obtained by adjusting these numbers. The following line defines a parameter L which is utilized in the definition of the cube. A parameter R defines the radius of the base of the two cylinders. The final geometry, which will be used for simulations, is obtained by subtracting the two cylinders from the cube as:

```diff
BooleanDifference(50) = { Volume{1}; Delete; }{ Volume{2,3}; Delete; };
```

Gmsh uses the obtained geometry for generating the mesh. However, without additional specifications, we cannot impose boundary conditions without any attributes assigned to the boundaries. Different attributes can be assigned to the volumetric part of the mesh for using different material coefficients within the domain. Here, however, we use only a single attribute, as the first example uses only a single diffusion coefficient.

```diff
Physical Volume(1) = {50};
Physical Surface(1) = {1,6,8};

Mesh.MshFileVersion = 2.2;
```

The first line from the above snippet defines physical volume 1 to coincide with the geometry volume 50, which is the final volume obtained by the Boolean operation. The second line defines physical surface 1 to include geometric surfaces {1,6,8}. Finally, the last line specifies the file format. Note that MFEM can only read ASCII Gmsh format version 2.2.

<img style="width:60%" src="../img/gmsh02.png"> 
<img style="width:60%" src="../img/gmsh03.png">

The generated mesh is shown in the figures above. Careful inspection reveals that the cylindrical surface is not represented well by the linear elements. We can improve the representation by refining the mesh. We encourage you to play with the mesh and to generate finer discretizations for the simulations.  

You can download the Gmsh input file [here](../cross_heat.geo) and the mesh [here](../cross_heat.msh). For users without access to the Gmsh GUI, a mesh can be generated in your local terminal with the following command:

```diff
gmsh -3 cross_heat.geo
```

To run simulations with the generated mesh, drag-and-drop the mesh file from your computer to the AWS browser window in the MFEM `examples` directory. To run Example 1 with the newly prepared mesh, be sure you are in the `examples` directory and then run the appropriate command:

```diff
mpirun -np 24 ./ex1p -m cross_heat.geo
mpirun -np 24 ./ex1p -m cross_heat.msh
``` 

The solution of the diffusion equation for the generated mesh is shown in the following two pictures. The figures are generated with ParaView, and the process of visualization is explained at the <a href="../meshvis/#visualizing-results-in-visit-and-paraview">end</a>   of this tutorial session.

<img style="width:60%" src="../img/parav00002.png">

If we want to enforce Dirichlet boundary conditions different than zero on some other surface, we must export it as a physical surface. For example, to enforce value one on the other cylindrical surface, add the following line to the `cross_heat.geo` file:

```diff
Physical Surface(2) = {7};
```
The line should be inserted in any place after the definition of geometrical surface 7, e.g., after the boolean operation defining the final geometry. 

If we run [ex1.cpp](https://github.com/mfem/mfem/blob/master/examples/ex1.cpp) without modifications, a zero value will be assigned to the newly defined surface. Thus, in order to set it to one, modify section 10 in [ex1p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex1p.cpp):

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

In the above snippet, we project coefficient one on the degrees of freedom associated with physical surface 2 (in C/C++, the indexing starts at zero). Executing the modified code with the newly created mesh will result in the following solution:

<img style="width:60%" src="../img/parav00003.png">


The results can be seen in the GlVis windows as well. However, the users will see only the defined physical surfaces (1,2) and the boundaries between the parallel partitions. Any 2D cuts will work as usual. 

MFEM can import meshes saved in Exodus II format generated with [Cubit](https://cubit.sandia.gov/). However, this feature requires compilation of the library with HDF5, NetCDF, and Exodus, which is not currently available on the AWS machines. 

---

### <i class="fa fa-check-square-o"></i>&nbsp; MFEM's meshing tools

MFEM provides many tools, routines, and examples for mesh manipulation. The miniapp examples illustrate a large part of the MFEM functionality in the miniapps/meshing subdirectory. Here we will explain more details about only two of them. However, users are strongly encouraged to play with the other miniapps. 

- Mesh Explorer
The mesh explorer miniapp is a handy tool to examine, visualize and manipulate a given mesh. Users have to compile it in the miniapps/meshing subdirectory. Once compiled, it can be executed in the same directory by typing in the terminal 
```diff
./mesh-explorer
```
Before executing it, users should ensure that the GlVis window is [open](../start#set-up-glvis)  and connected to the AWS machine. Once started, many options will appear in the terminal window. An example screenshot of provided below

<img style="width:60%" src="../img/mesh_tools01.png">


Selecting v in the prompt and pressing enter will display the default mesh of a hex-meshed beam in the GlVis window. To display different mesh, users should exit the miniapp and start it again with the following line  
```diff
./mesh-explorer -m new_mesh_file.msh
```
, where new_mesh_file.msh is the mesh file selected by the user. The input mesh can be in any format supported by MFEM. In addition, the miniapp can save the loaded mesh in native MFEM and VTK formats.

- Shaper

---

### <i class="fa fa-check-square-o"></i>&nbsp; Visualizing results in VisIt and ParaView
To save the simulation results from the parallel version of Example 1 ([ex1p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex1p.cpp)) in ParaView format, add the following lines just before step 17 in the file.

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

The first line defines a `ParaViewDataCollection` for saving data in ParaView data format. The following two lines define the name of the data collection and the prefix path, which is set to ParaView. Thus, the data set will be written in the directory `ParaView` relative to the current execution path. The following line registers the `ParGridFunction x` in the data collection. The remaining lines set different parameters for the format and the data set, and finally, the set is saved and deleted. See [MFEM documentation](https://mfem.org/dox/) for more detailed information about ParaView. 

Compile and execute the modified example.

To download the results saved in ParaView format to your local machine, compress and gather all files in a single archive with the following command:

```diff
tar cvfz paraview.tgz ParaView/
```

which will generate the file `paraview.tgz` in the current directory. Download the file via the Explorer window, then go to the download directory and extract the archive: 

```diff
tar vxfz paraview.tgz ParaView/
```

The above assumes a UNIX type of environment. Windows users could use the GUI or WSL/WSL2 engines.  

[ParaView](https://www.paraview.org/) can be freely downloaded both as a source code or precompiled binaries. The precompiled binaries are available for Linux, macOS, and Windows. Please follow the instructions for the corresponding operating system for installation instructions.

To visualize the downloaded simulation data, run ParaView and open the file `Example1P.pvd` in the `ParaView/Example1P` directory, where the path is relative to the directory where the archive was downloaded. Next, click on the Apply button and select Solution in the drop-down menu in the second row of buttons. The geometry, together with the solution, can be rotated on the screen by holding and dragging the mouse. 

<img style="width:80%" src="../img/parav00004.png">

Replacing `ParaviewDataCollection` with `VisItDataCollection` allows you to write data in VisIt data format. [VisIt](https://visit-dav.github.io/visit-website/) can be freely downloaded and installed on Linux, macOS, and Windows and provides another alternative to ParaView. The steps for downloading and the simulation data are the same as the steps outlined above for ParaView.

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
