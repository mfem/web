tag-howto:

# HowTo:  Use Block Operators and Matrices

Some problem formulations are defined in block form and need to be implemented
in terms of block operators. Examples include saddle point problems (`ex5.cpp`),
DPG discretization (`ex8.cpp`), and problems with multiple variables (`ex19.cpp`).
The resulting discretized system is expressed in terms of block operators and vectors,
which may be distributed in parallel. This article gives an overview of working with
block operators and their matrix representations.

It should be noted in general that operators and matrices are appropriate in different
situations, regardless of whether they are in block form. Generally, it is preferable
to have an operator and not its matrix representation when only its action is needed
and can be computed faster than matrix assembly, or when matrix storage requires too
much memory. For example, this is the case for high-order FEM, when partial assembly (PA)
is used for fast operator multiplication on GPUs without storing matrices. Also,
matrix storage becomes increasingly expensive (more nonzeros per row) as FEM order increases,
which is another reason to avoid matrix assembly and matrix-based preconditioners for
very high order. On the other hand, for low-order FEM, matrices are necessary for example
in order to use AMG preconditioning (e.g. with hypre). Thus there are cases where operators
or matrices are preferable, in general and in block form.

First, it is important to understand how a single, monolithic operator or matrix is distributed in
parallel in MFEM. Vectors, matrices, and operators are distributed consistently with hypre,
which decomposes the rows of a parallel matrix (`HypreParMatrix`, see `mfem/hypre.hpp`) but stores
all columns of the locally owned rows on each MPI rank. On each process, a `Vector` or `HypreParVector`
is of size equal to the number of locally owned rows, and a `HypreParMatrix` stores the local rows.
The parallel communication necessary for matrix-vector multiplication is performed in hypre.
Similarly, an `Operator` should act on a `Vector` of local entries, perform any necessary communication,
and compute a `Vector` of local entries.

In the case of block operators and vectors, a `Vector` stores the local entries for each block
contiguously in its data. Offsets define where each block begins and ends. For example, in `ex5.cpp`,
there are two blocks for spaces `R_space` and `W_space`, and `block_offsets` is of size three, storing
offsets `0`, `R_space->GetVSize()`, and `R_space->GetVSize() + W_space->GetVSize()`. The class
`BlockOperator` (see `mfem/linalg/blockoperator.hpp`) can be used to form one operator from operators
defining the blocks. It operates on vectors of local entries, stored block-wise.

Similarly, a monolithic `HypreParMatrix` can be constructed, using the function
`HypreParMatrixFromBlocks` (see `hypre.hpp`), from blocks defined as `HypreParMatrix` pointers
or null pointers for empty blocks. The blocks may be rectangular, but their sizes must be consistent.
Scalar coefficients can optionally be used. The monolithic matrix will have copies of the entries from
the blocks, so it can be modified or destroyed independently of the blocks.

The unit test `mfem/tests/unit/linalg/test_matrix_rectangular.cpp` provides an example that compares
a `BlockOperator` and a monolithic `HypreParMatrix`. As noted above, it is not practical to have both
an operator and a matrix, but this test illustrates the equivalence of the two approaches.

The capability to form a monolithic matrix is available only for `HypreParMatrix`, not for the serial
class `SparseMatrix`.


