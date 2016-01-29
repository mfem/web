# Meshing

This page provides as brief description of MFEM's mesh formats and meshing miniapps.

## Mesh formats

MFEM supports a number of mesh formats, including:

  - MFEM's own [mesh v1.0 format](mesh-formats#mfem-mesh-v10), which can describe both [straight](mesh-formats#straight-meshes) as well as [arbitrary high-order curvilinear](mesh-formats#curvilinear-and-more-general-meshes) and [more general](mesh-formats#curvilinear-and-more-general-meshes) meshes,
  - MFEM's own format for [NURBS](mesh-formats#nurbs-meshes) meshes,
  - The [VTK](mesh-formats#curvilinear-vtk-meshes) unstructured mesh format, for triangular, quadrilateral, tetrahedral and hexahedral meshes,
  - The [NETGEN](http://sourceforge.net/projects/netgen-mesher/) triangular and tetrahedral mesh formats,
  - The [TrueGrid](http://www.truegrid.com/) hexahedral mesh format.

Detailed description of these formats can be found on the [mesh formats](mesh-formats) page. These formats are also supported by MFEM's native visualization tool, [GLVis](http://glvis.org/).


## Meshing miniapps

The `miniapps/meshing` directory contains a collection of meshing-related miniapps based on MFEM.

Compared to the example codes in the `examples` directory, the miniapps are more
complex, demonstrating more advanced usage of the library. They are intended to
be more representative of MFEM-based application codes. We recommend that new
users start with the example codes before moving to the miniapps.

The current meshing miniapps are described below.

### mobius-strip

This miniapp generates various Mobius strip-like surface meshes. It is a good
way to generate complex surface meshes.

![](img/mobius-strip.png)

Manipulating the mesh topology and
performing mesh transformation are demonstrated. The `mobius-strip` mesh in the
`data` directory was generated with this miniapp.

### klein-bottle

This miniapp generates three types of Klein bottle surfaces. It is similar to
the mobius-strip miniapp.

![](img/klein-bottle.png)

The `klein-bottle` and `klein-donut` meshes in the
`data` directory were generated with this miniapp.

### mesh-explorer

This miniapp is a handy tool to examine, visualize and manipulate a given
mesh.

![](img/mesh-explorer.png)

Some of its features are:

- visualizing of mesh materials and individual mesh elements
- mesh scaling, randomization, and general transformation
- manipulation of the mesh curvature
- the ability to simulate parallel partitioning
- quantitative and visual reports of mesh quality
