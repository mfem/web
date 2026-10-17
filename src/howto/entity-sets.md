tag-howto:

# HowTo: Select and use sets of mesh entities

`EntitySets` lets an application give names to arbitrary selections of mesh
vertices, edges, faces, and elements. Unlike mesh attributes, which classify
elements or boundary elements into disjoint integer-labelled groups, entity
sets can overlap, can be sparse, and can select every supported kind of mesh
entity. They are useful for specifying a small boundary portion, a material
subregion assembled from several attributes, an internal interface, a group of
monitoring points, or a region used for postprocessing.

Each set belongs to one of four entity types:

| Entity type | Available on | Typical use |
|---|---|---|
| `VERTEX` | all meshes | selected topological points |
| `EDGE` | 2D and 3D | 2D boundary curves, 3D wires |
| `FACE` | 3D | boundary patches and internal surfaces |
| `ELEMENT` | all meshes | subdomains and volume regions |

Entity indices are local mesh indices. Give each set a descriptive name and
use that name at the point where the set is consumed; this avoids coupling an
application to the order in which sets were created.

## Create a collection and select entities

Retrieve the collection owned by a `Mesh` with `GetOrCreateEntitySets`. The
following example selects elements whose centers lie to the left of a vertical
line and creates a named 2D boundary set from a boundary attribute:

```c++
Mesh mesh(mesh_file, 1, 1);
EntitySets &sets = mesh.GetOrCreateEntitySets();

const int left_region = sets.AddElementSetByPredicate(
   "left region", [](const Vector &x) { return x[0] < 0.5; });

const int left_boundary =
   sets.AddEdgeSetByBoundaryAttribute("left boundary", 1);
```

The predicate receives physical coordinates. For elements, edges, and faces,
the default rule evaluates the predicate at the entity center. Pass the
corresponding `*SetPointRule::ALL_VERTICES` option when every vertex must
satisfy the predicate. The selection is made when the method is called; it is
not reevaluated if the mesh later moves or changes.

The construction methods cover the following common cases:

| Selection | Methods |
|---|---|
| Existing local indices | `AddSet` + `AddEntity`, or `AddVertexSet`, `AddElementSet`, and `AddFaceSet` |
| Marker array | `AddVertexSetByMarker`, `AddElementSetByMarker`, or `AddFaceSetByMarker` |
| Existing element attribute | `AddElementSetByAttribute` |
| Boundary attribute | `AddEdgeSetByBoundaryAttribute` or `AddFaceSetByBoundaryAttribute` |
| Physical location | `AddVertexSetByPredicate`, `AddEdgeSetByPredicate`, `AddFaceSetByPredicate`, or `AddElementSetByPredicate` |
| Nearest mesh vertices | `FindNearestVertices` or `AddVertexSetByNearestPoints` |
| Level-set region | `AddElementSetByLevelSet` |
| Interface of an element set | `AddEdgeSetFromElementSet` in 2D or `AddFaceSetFromElementSet` in 3D |

The generic `AddEntity` method takes an existing local entity index. For edges
and faces, `AddEdge`, `AddTriFace`, and `AddQuadFace` offer a more convenient
alternative when the entity is known by its vertices.

In 3D, an edge set is a wireframe: selecting a boundary attribute adds the
edges of the matching boundary faces. Use a face set for a surface patch.
Similarly, `AddFaceSetFromElementSet` selects only the *internal* interface
between selected and unselected elements; physical-boundary faces can be
selected directly with `AddFaceSetByBoundaryAttribute`.

## Use a set for essential degrees of freedom

`FiniteElementSpace` and `ParFiniteElementSpace` provide overloads of
`GetEssentialVDofs` and `GetEssentialTrueDofs` that accept an entity type and
either a set index or a set name. This is particularly useful when a boundary
condition is defined geometrically rather than by a single boundary attribute.

```c++
H1_FECollection fec(order, mesh.Dimension());
FiniteElementSpace fespace(&mesh, &fec);

Array<int> ess_tdof_list;
fespace.GetEssentialTrueDofs(EntitySets::EDGE, "left boundary",
                             ess_tdof_list);
```

For a 3D boundary patch, create a face set and pass `EntitySets::FACE`
instead. The selected entity type should match the geometric support of the
finite-element degrees of freedom being constrained. A vertex set, in
particular, selects only topological vertices; it does not imply selection of
incident entities, high-order mesh nodes, or all degrees of freedom in a
geometric region.

## Orient edge and face sets

An edge or face entity set describes *which* mesh entities are selected, but
not an order or a direction. This is sufficient for many operations. Path
integrals and fluxes, however, also need an orientation. MFEM represents these
oriented counterparts with `OrientedEdgeSet` and `OrientedFaceSet`.

An `OrientedEdgeSet` stores edges with an orientation of `+1` or `-1` relative
to MFEM's mesh-edge orientation. The edges need not be ordered or connected.
Path constructors are available as a convenience when the selected edges form
a directed curve. A simple chain or loop stored in an edge entity set can be
promoted with `SetFromEdgeSet`:

```c++
const int edge_set = sets.GetSetIndex(EntitySets::EDGE, "measurement path");
OrientedEdgeSet oriented_edges;
oriented_edges.SetFromEdgeSet(sets, edge_set, start_vertex);
```

For a loop, provide `start_vertex`; `next_vertex` can additionally choose the
initial direction. Oriented edge sets can also be created between endpoints,
through ordered waypoints, from explicitly selected edges and orientations, or
while restricting a path search to an element set or boundary edges.

An `OrientedFaceSet` stores face indices and a normal sign for each face. The
sign is `+1` or `-1` and multiplies the canonical physical normal from the face
transformation. To promote a face entity set, copy its local face indices,
choose one sign per face, and use the explicit constructor:

```c++
const int face_set = sets.GetSetIndex(EntitySets::FACE, "measurement surface");
Array<int> faces, signs;
for (const int face : sets(EntitySets::FACE, face_set))
{
   faces.Append(face);
   signs.Append(1); // Select the canonical normal for this face.
}
OrientedFaceSet surface(mesh, faces, signs);
```

For conforming serial 3D meshes, `OrientedFaceSet` can also construct an
outward-facing exterior from an element set or attribute, or an interface
oriented from one element set or attribute to another. These constructors
capture the current mesh topology; recreate the surface after the mesh changes.

## Measure fields on selected entities

MFEM provides measurements whose geometric support and finite-element space
match one another: H1 fields are sampled at vertex sets, H(curl) fields are
integrated along oriented edge paths, H(div) fields are integrated across
oriented face sets, and discontinuous L2 fields are integrated over element
sets. The sections below describe these measurements in that order.

The three integral measurements use an element-dependent default quadrature
order of $2p+3$, where $p$ is the finite-element order; pass a non-negative
order to the constructor to override it. `H1VertexSetMeasurement` instead
performs nodal sampling and requires no quadrature rule. The measurement types
verify that the `GridFunction` uses the measurement mesh and has been updated
after finite-element-space changes. They require the matching H1, H(curl), or
H(div) finite-element space, or a scalar discontinuous L2 space, respectively.

In parallel, the integral measurements return the global sum on every rank.
Provide only the locally owned oriented edges or faces on each rank, so each
physical contribution is included exactly once. For a distributed
`OrientedFaceSet`, use the explicit face-and-sign constructor.

### H1 nodal measurements on a vertex set

`H1VertexSetMeasurement` samples an H1 `GridFunction` at the mesh vertices in
a vertex entity set. Use it when the quantity of interest is a collection of
nodal values—such as sensor locations, point constraints, or a set of tracked
corners—rather than an integral over a curve, surface, or volume.

Start by selecting the topological mesh vertices that define the measurement
locations. For example, this selects vertices on the plane $x=0$ within a
small tolerance:

```c++
constexpr real_t tolerance = 1.e-12;
const int sensors = sets.AddVertexSetByPredicate(
   "left sensors", [=](const Vector &x)
   {
      return x[0] <= tolerance;
   });

H1_FECollection fec(order, mesh.Dimension());
FiniteElementSpace fespace(&mesh, &fec);
GridFunction field(&fespace);
// ... project or solve for field ...

H1VertexSetMeasurement measurement(field, sets, sensors);
```

This is a nodal sampling operation, not quadrature: no integration order is
involved. A vertex set refers to *topological mesh vertices* only. It does not
select every high-order degree of freedom on an edge, face, or geometric
region. To measure a region, path, or surface instead, use the corresponding
element, edge-path, or oriented-face measurement.

### H(curl) path integral along an oriented edge set

`HCurlOrientedEdgeSetIntegral` measures the oriented, tangential line integral
$\int_\Gamma \mathbf{u}\mathbin{\cdot}d\mathbf{x}$ of an H(curl)
`GridFunction` along an `OrientedEdgeSet`. It is suited to Nedelec (`ND`) fields,
such as a tangential electric or magnetic field.

```c++
// The vertex indices identify the endpoints of a path in the mesh-edge graph.
OrientedEdgeSet oriented_edges(mesh, start_vertex, end_vertex);

ND_FECollection fec(order, mesh.Dimension());
FiniteElementSpace fespace(&mesh, &fec);
GridFunction field(&fespace);
// ... project or solve for field ...

HCurlOrientedEdgeSetIntegral path_integral(field, oriented_edges);
const real_t value = path_integral.Eval();
```

### H(div) flux through an oriented face set

`HDivOrientedFaceSetIntegral` measures the normal flux
$\int_S \mathbf{u}\mathbin{\cdot}\mathbf{n}\,dA$ of an H(div)
`GridFunction` across an `OrientedFaceSet`. It is suited to Raviart--Thomas
(`RT`) fields, including velocity, current, and flux fields.

```c++
const int from_region = sets.AddElementSetByAttribute("material 1", 1);
const int to_region = sets.AddElementSetByAttribute("material 2", 2);
OrientedFaceSet interface(mesh, sets, from_region, to_region);

RT_FECollection fec(order, mesh.Dimension());
FiniteElementSpace fespace(&mesh, &fec);
GridFunction field(&fespace);
// ... project or solve for field ...

HDivOrientedFaceSetIntegral flux(field, interface);
const real_t value = flux.Eval();
```

### L2 element-set integral

`L2ElementSetIntegral` computes the integral of a scalar discontinuous L2
`GridFunction` over an element set. It can be constructed with either the set
index or its name:

```c++
L2ElementSetIntegral integral(field, sets, "left region");
const real_t value = integral.Eval();
```

## Refinement and parallel meshes

Define entity sets while the mesh is conforming, before calling
`Mesh::EnsureNCMesh()` or constructing a `ParMesh` from a serial mesh. MFEM
then carries the set information into the nonconforming or distributed mesh.

During refinement, selected edges, faces, and elements are replaced by their
active descendants. A selected vertex remains a selection of that topological
vertex; refinement does not turn it into a selection of surrounding vertices
or entities. This lets a set retain its intended topological meaning through
uniform and nonconforming refinement.

For `ParMesh`, each rank stores the part of each set present in its local mesh.
The finite-element-space methods above synchronize shared degrees of freedom
when needed. Nearest-vertex searches are collective on a parallel mesh: every
input point has one globally selected nearest vertex, and ranks that do not
contain it receive `-1` for that point's local vertex index.

## Store sets in an MFEM mesh file

Entity sets are represented by an optional `MFEM sets v1.0` section after the
mesh vertices. The reader loads this section automatically when it is present.
`EntitySets::Print` writes the section, but `Mesh::Print` does not append it
on its own. To save a compatible MFEM v1.0 mesh and its sets, write both:

```c++
std::ofstream output("mesh-with-sets.mesh");
mesh.Print(output);
sets.Print(output);
```

The basic format is shown below. Set names occupy a complete line, which makes
spaces in names valid. Vertex and element members are local indices; edge and
face members are expressed by their defining vertices so the file does not
depend on an internal edge or face numbering.

```text
MFEM sets v1.0

vertex_sets
<number of vertex sets>

<set name>
<number of vertices>
<vertex index> ...

edge_sets
<number of edge sets>

<set name>
<number of edges>
<first vertex> <second vertex>
...

face_sets                 # 3D meshes only
<number of face sets>

<set name>
<number of faces>
2 <three triangle vertices>
3 <four quadrilateral vertices>
...

element_sets
<number of element sets>

<set name>
<number of elements>
<element index> ...
```

Duplicate entity entries are ignored. Within a single entity type, set names
must be unique; the same name may be reused for different entity types.

For the full API, see the [`EntitySets` Doxygen
reference](../dox.md).

<script type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
