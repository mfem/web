tag-howto:

# HowTo:  Navigate the connections between mesh primitives with Table objects

Elements, faces, edges, and vertices are all connected to each other to form a cohesive
mesh.  In some lower level applications it may be necessary to navigate the MFEM mesh
through these connections to find the mesh primitives you need.  Each of the mesh primitives
has its own numbering and MFEM represents the connections between these primitives in
Table objects (`general/table.hpp`) that are stored in the Mesh object
(`mesh/mesh.hpp`).  You can access these Table object through 7 different
accessor methods in mesh:

|              Mesh Method                  | Dimension   | Mesh object owns data |
|-------------------------------------------|-------------|-----------------------|
| `const Table &ElementToElementTable()`| 1D, 2D, 3D  |          Yes          |
| `const Table &ElementToFaceTable()`   | 1D, 2D, 3D  |          Yes          |
| `const Table &ElementToEdgeTable()`   | 1D, 2D, 3D  |          Yes          |
| `Table *GetFaceEdgeTable()`           |     3D      |          Yes          |
| `Table *GetEdgeVertexTable()`         | 1D, 2D, 3D  |          Yes          |
| `Table *GetVertexToElementTable()`    | 1D, 2D, 3D  |          No           |
| `Table *GetFaceToElementTable()`      | 1D, 2D, 3D  |          No           |

The interfaces for these accessors are unfortunately not uniform, and care must be
taken to use them properly.  For example the Mesh object owns the data for most, but not
all of them, so care must be taken delete the Table objects returned by the last two.  In
addition, two of the methods are only defined in 3D due to them using the strict definitions
of faces and edges while the others use the looser definition by letting the faces be edges
in 2D and the edges vertices in 1D.  Once you have the table with the information you want
you can access it through the table methods as in the following example:

```c++
const Table &elem_edge = mesh.ElementToEdgeTable();
int num_elems = mesh.GetNE();
for (int elem_id = 0; ei < num_elems; elem_id++)
{
  int num_edges = elem_edge.RowSize(elem_id);
  const int *edges = elem_edge.GetRow(elem_id);
  for (int edgei = 0; edgei < num_edges; edgei ++)
  {
        int edge_id = edges[edgei];
        .... Do something with the edge ID ....
  }
}
```

Another useful method related to navigating mesh connections with these Table objects is
the Transpose method.  This method takes an A_to_B table and transposes it into a B_to_A
table.  Usage is as follows:

```c++
Table &face_edge = *mesh.GetFaceEdgeTable();
Table edge_face;
Transpose(face_edge, edge_face);
int num_edges = mesh.GetNEdges();
for (int edge_id = 0; ei < num_edges; edge_id++)
{
        ....
}
```
