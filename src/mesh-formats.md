# Mesh Formats

MFEM supports a number of mesh formats, including:

  - MFEM's [mesh v1.0 format](mesh-format-v1.0.md#mfem-mesh-v10) for [straight](mesh-format-v1.0.md#straight-meshes) meshes,
  - MFEM's [mesh v1.0 format](mesh-format-v1.0.md#curvilinear-and-more-general-meshes) for [arbitrary high-order curvilinear](mesh-format-v1.x.md) and more general meshes,
  - MFEM's mesh v1.2 format, which adds support for parallel meshes,
  - MFEM's [NC mesh v1.0 format](mesh-format-v1.0.md#mfem-nc-mesh-v10), supporting non-conforming (AMR) meshes,
  - MFEM's format for [NURBS](mesh-format-v1.0.md#nurbs-meshes) meshes,
  - The [VTK](mesh-format-v1.0.md#curvilinear-vtk-meshes) unstructured mesh format, for triangular, quadrilateral, tetrahedral and hexahedral meshes,
  - The [Gmsh](http://gmsh.info/) ASCII and binary formats for 2D and 3D meshes.
  - The [CUBIT](https://cubit.sandia.gov/) meshes through the Genesis (NetCDF) binary format.
  - The [NETGEN](http://sourceforge.net/projects/netgen-mesher/) triangular and tetrahedral mesh formats,
  - The [TrueGrid](http://www.truegrid.com/) hexahedral mesh format.

Detailed description of these formats can be found on the [mesh formats](mesh-format-v1.0.md) page. These formats are also supported by MFEM's native visualization tool, [GLVis](http://glvis.org/).
