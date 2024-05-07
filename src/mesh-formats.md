# Supported Mesh Formats

MFEM supports a number of mesh formats, including:

  - MFEM's built-in formats, including arbitrary high-order curvilinear meshes
    and non-conforming (AMR) meshes.
  - VTK format (XML VTU format and legacy ASCII format).
  - The [CUBIT](https://cubit.sandia.gov/) meshes through the Genesis (NetCDF)
    binary format.
  - The [NETGEN](https://sourceforge.net/projects/netgen-mesher/) triangular and
    tetrahedral mesh formats.
  - The [TrueGrid](http://www.truegrid.com/) hexahedral mesh format.

See below for more details and information on the specific formats that are
supported. All of these mesh formats are also supported by MFEM's native
visualization tool, [GLVis](https://glvis.org/).


### MFEM Mesh Formats

Detailed description of these formats can be found on [MFEM's mesh
formats](mesh-format-v1.0.md) page.

MFEM supports:

  - MFEM's [mesh v1.0 format](mesh-format-v1.0.md#mfem-mesh-v10) for
    [straight](mesh-format-v1.0.md#straight-meshes) meshes.
  - MFEM's [mesh v1.x format](mesh-format-v1.x.md) for [arbitrary high-order
    curvilinear](mesh-format-v1.0.md#curvilinear-and-more-general-meshes) and
    more general meshes.
  - MFEM's mesh v1.2 format, which adds support for parallel meshes.
  - MFEM's [mesh v1.3 format](mesh-format-v.1.0.md#mfem-meshv13), which adds support for named attribute sets.
  - MFEM's [NC mesh v1.0 format](mesh-format-v1.0.md#mfem-nc-mesh-v10),
    supporting non-conforming (AMR) meshes.
  - MFEM's format for [NURBS](mesh-format-v1.0.md#nurbs-meshes) meshes.

### VTK Mesh Formats

MFEM supports reading VTK (ASCII) and VTU (XML) unstructured meshes. For more details on
these formats, see the [VTK User's
Guide](https://vtk.org/wp-content/uploads/2015/04/file-formats.pdf) and the [VTK
Wiki](https://vtk.org/Wiki/VTK_XML_Formats).

Specifically, MFEM supports:

- Meshes with [high-order Lagrange
  elements](https://blog.kitware.com/modeling-arbitrary-order-lagrange-finite-elements-in-the-visualization-toolkit/).
- Mixed meshes with all element types.
- `XML` format with inline or appended binary data, including `zlib` compression.

<i class="fa fa-info-circle" style="color:green"></i>&nbsp;
If the VTK or VTU file has a cell data array named "material" or "attribute",
this cell data will be used for MFEM's element attribute numbers. If both data
arrays are present, the one named "material" will take precedence.

### Gmsh Mesh Formats

MFEM supports reading version 2.2 of the [Gmsh](https://gmsh.info/) ASCII and
binary formats for 2D and 3D meshes. High-order elements (up to order 9) are
supported, as are periodic meshes.

<i class="fa fa-warning" style="color:red"></i>&nbsp;
Note that newer versions of Gmsh output files in version 4.1 of the Gmsh format,
which is not compatible with MFEM. Users should either specify
`Mesh.MshFileVersion = 2.2;` in their geometry file or run Gmsh with `-format
msh22` from the command line.

<i class="fa fa-info-circle" style="color:green"></i>&nbsp;
Elements' _physical tags_ in Gmsh correspond to their _attribute numbers_ in
MFEM. MFEM only supports strictly positive (&#8805; 1) attributes, so users
should be sure to define all physical groups with strictly positive tag numbers.
The one exception to this is in cases where all elements have physical tag zero
(which happens by default in Gmsh when no physical groups are defined). In this
case, MFEM will reassign all the elements to have attribute number 1 instead of
failing to read the mesh.
