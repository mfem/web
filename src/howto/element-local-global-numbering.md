tag-howto:

# HowTo: Map between local element numbering and parallel global element numbering

With MPI parallelization, a distributed mesh is represented by the `ParMesh` class. On each MPI rank,
`ParMesh` stores data about the local elements owned by the rank. The parallel partitioning of
elements is non-overlapping. The local elements have local indexing from `0` to `Mesh::GetNE() - 1`.
Globally, the elements are numbered sequentially with respect to the MPI ranks and in their local
order, starting from 0, so that the global index of an element is the local index plus an offset for
its owning rank.

The `ParMesh` class provides functions for mapping between local and global element indices, as
described below. These functions support conforming or AMR meshes.

The first element-numbering query after construction or a topology change
computes rank offsets using MPI communication. Initialize the numbering by
calling the following on **all ranks**, including ranks with no local elements:

```c++
Array<HYPRE_BigInt> global_indices;
pmesh.GetGlobalElementIndices(global_indices);
```

Subsequent queries can be rank-local until the mesh changes. Repeat collective
initialization after refinement, derefinement, or rebalance. These indices are
numbering for the current partition and topology, not persistent element IDs;
do not reuse old indices to identify elements after such changes.

## Getting the global index corresponding to a local index

For a local index `local_element_num` of an element owned by the current MPI rank, the global index
is returned by `ParMesh::GetGlobalElementNum(local_element_num)`.

## Getting the local index corresponding to a global index

For a global index `global_element_num` of an element owned by the current MPI rank, the local index
is returned by `ParMesh::GetLocalElementNum(global_element_num)`. The return value is `-1` if the
element is owned by a different MPI rank.

## Getting all global indices of locally owned elements

`ParMesh::GetGlobalElementIndices` sets an `Array` of the global indices of all the locally owned
elements on the current MPI rank. The indices set here could alternatively be obtained by calling
`ParMesh::GetGlobalElementNum(i)` for all `i` from `0` to `GetNE() - 1`.

## Getting global indices of other mesh entities

A related topic is how to get global indices for other mesh entities, meaning vertices, edges, or
faces. We use the convention that in 1D, edges and faces are actually vertices, and in 2D, faces
are actually edges. Whereas elements have local and global indices that are used by
`ParFiniteElementSpace` to determine ordering of local and global finite element degrees of freedom,
there are no global indices for the other mesh entities (vertices, edges, and faces). That is, the
other mesh entities only have local indices in MFEM, defined in the `Mesh` class. Although there is
no definition or meaning to global indices for the other mesh entities, the user may wish to have
global indices for the user's own purposes, and the capability to generate them is provided by the
following functions in the `ParMesh` class:

* `GetGlobalVertexIndices`
* `GetGlobalEdgeIndices`
* `GetGlobalFaceIndices`

It should be noted that AMR meshes are currently not supported by these functions (only conforming
meshes). Also, since these global indices are meaningless to the MFEM library, their definition is
arbitrary and based on lowest-order finite element spaces (H1 for vertices, Nedelec for edges,
Raviart-Thomas for faces).

There is no implementation of maps between local and global indices for these other mesh entities.
