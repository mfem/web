# HowTo: Nonconforming and AMR meshes

The `Mesh` class provides basic element refinement capabilities:
* All elements may be refined uniformly with `Mesh::UniformRefinement`.
* Local refinement is supported, but only for simplex elements. The method
  `Mesh::GeneralRefinement` uses recursive bisection in this case.

These basic refinement methods preserve mesh conformity, i.e., no hanging nodes
are created. This also means that quadrilaterals and hexahedra cannot be refined
locally by the `Mesh` class. 

For more advanced AMR, MFEM has the class `NCMesh`:
* Tensor product element (quad, hex, prism) refinement is supported, including 
  anisotropic refinement. Hanging nodes are created and handled transparently.
* Triangles and tetrahedra use "red" (isotropic) refinement, also producing
  hanging nodes in this case.
* Derefinement (coarsening) of previously refined elements is supported.
* In parallel, the mesh can be load balanced.

The user never needs to interact directly with the `NCMesh` class -- it is 
created behind the scenes and the `Mesh` class still serves as an interface
with the user and other MFEM classes in the nonconforming mode.

To switch to the nonconforming mode (or convert and existing conforming `Mesh`),
the user needs to call `EnsureNCMesh`, usually at the beginning after loading the
mesh:

```c++
Mesh *mesh = new Mesh(mesh_file, 1, 1);
mesh->EnsureNCMesh(true);
```

The boolean parameter, if `true`, forces even simplex meshes to use nonconforming
refinement (the default is `false`).


## Nonconforming refinement

WIP WIP WIP

Simple case - `GeneralRefinement` example

FiniteElementSpace supports hanging nodes by building the P matrix. Constrained
nodes eliminated in FormLinearSystem

Anisotropic: idea, picture

Forced refinements in anisotropic case.

Note: more advanced refinement with error estimation -- see ex6, ex15.


## Derefinement

Mesh interface: `DerefineByError`, example

More advanced derefiners -- see ex15.

Anisotropic: not supported yet.


## Parallel refinement

Transparent...  `ParNCMesh` class, again no user interaction.

Anisotropic in 3D not supported yet.


## Load balancing

`ParMesh::Rebalance` can be called in NC mode. 

Unlike `ParMesh`, which partitions `Mesh` statically with METIS, `ParNCMesh` uses
dynamic SFC based partitioning .


## NC mesh I/O

In NC mode, `ParMesh::ParPrint` saves the current state, including refinement hierarchy
and partitioning, using the `MFEM 


