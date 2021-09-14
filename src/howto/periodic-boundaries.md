tag-howto:

# HowTo: Use periodic meshes and enforce periodic boundary conditions

In order to solve a problem with periodic boundary conditions, the `Mesh` object should have a
periodic topology. This can be achieved in one of two ways:

1. By reading a periodic mesh from disk.
2. By identifying periodic vertices (e.g. through a translation vector), and then creating a new
   periodic mesh.

## Reading a periodic mesh from disk

MFEM supports reading periodic meshes from a [variety of mesh file
formats](https://mfem.org/meshing/). Several periodic sample meshes are included with MFEM in the
`data` directory:

MFEM format:

* `periodic-square.mesh`: a 3x3 Cartesian mesh of the (periodic) square [-1,1]^2
* `periodic-hexagon.mesh`: a quad mesh of a periodic hexagonal domain with 12 elements
* `periodic-cube.mesh`: a 3x3x3 Cartesian mesh of the (periodic) cube [-1,1]^3

Gmsh format (the corresponding `.geo` files are also included):

* `periodic-square.msh`: a 4x4 Cartesian mesh of the (periodic) unit square
* `periodic-cube.msh`: a 4x4x4 Cartesian mesh of the (periodic) unit cube
* `periodic-annulus-sector.msh`: a 2D mesh of an annular sector with periodic boundaries defined by
   a rotation
* `periodic-torus-sector.msh`: a 3D mesh of a torus sector with periodic boundaries defined by a
   rotation

Any of these meshes can be loaded as usual using MFEM (e.g. using the `-m` flag in the [MFEM
examples](https://mfem.org/examples/)), and the periodic topology will be automatically handled.

_(Note that some periodic boundaries (such as `periodic-cube.mesh`) contain so-called "internal
boundary elements", which may result in boundary conditions being enforced for some examples.)_

Example 0 on Periodic Annulus   |  Example 0 on Periodic Torus
:------------------------------:|:------------------------------:
![](/img/periodic-annulus.png)  |  ![](/img/periodic-torus.png)

## Creating a periodic mesh by identifying vertices

MFEM can also create periodic meshes from non-periodic meshes by identifying periodic vertices. The
function `Mesh::MakePeriodic` creates a periodic mesh from a non-periodic mesh given such a vertex
identification. For example, if we wish to create a periodic line segment, then we would like to
_identify_ the two endpoints of the line segment since they represent the same point in the periodic
topology. An example of creating this vertex mapping in the case of a line segment is described
[here](#line-segment).

It is often more convenient to describe the periodicity constraints in terms of _translation
vectors_. Any two vertices that are coincident under any of the given translation vectors will be
considered topologically identical. MFEM can generate a vertex mapping from these translation
vectors using the `Mesh::CreatePeriodicVertexMapping`. An example using this functionality to create
a mesh of the periodic square is shown [here](#square).

### <a name="line-segment"></a>Example: creating a periodic line segment with a vertex map

```c++
Mesh mesh = Mesh::MakeCartesian1D(10);// Make a mesh of the unit interval with 10 elements
// Create the vertex mapping. To begin, create the identity mapping.
std::vector<int> v2v(mesh.GetNV());
for (int i = 0; i < mesh.GetNV(); ++i)
{
   v2v[i] = i;
}
// Modify the mapping so that the last vertex gets mapped to the first vertex.
v2v.back() = 0;
Mesh periodic_mesh = Mesh::MakePeriodic(mesh, v2v); // Create the periodic mesh
```

### <a name="square"></a>Example: creating a periodic square with translation vectors
```c++
// Create a 10x10 quad mesh of the unit square;
Mesh mesh = Mesh::MakeCartesian2D(10, 10, Element::QUADRILATERAL);
// Create translation vectors defining the periodicity
Vector x_translation({1.0, 0.0});
Vector y_translation({0.0, 1.0});
std::vector<Vector> translations = {x_translation, y_translation};
// Create the periodic mesh using the vertex mapping defined by the translation vectors
Mesh periodic_mesh = Mesh::MakePeriodic(mesh, mesh.CreatePeriodicVertexMapping(translations));
```
