# HowTo: Use [`FindPointsGSLIB`](https://github.com/mfem/mfem/blob/master/fem/gslib.hpp#L45) for high-order interpolation

`FindPointsGSLIB` provides a wrapper for high-order interpolation
via `findpts`, a set of routines that were developed as
a part of the gather-scatter library, [gslib](https://github.com/Nek5000/gslib).
While `findpts` was originally developed for interpolation of grid functions in
`H1` for meshes with quadrilateral or hexahedron elements, `FindPointsGSLIB`
also enables interpolation of functions `L2, H(div), H(curl)` on meshes with
triangle and tetrahedral elements by using `findpts`' kernels for communication
and MFEM's internal methods for interpolation.

The key steps of using `FindPointsGSLIB`, as demonstrated in the
[gslib](https://github.com/mfem/mfem/tree/master/miniapps/gslib) miniapps
are:

* First, setup the internal data structures required by the `gslib` library for
the mesh of interest. This is done by using the `FindPointsGSLIB::Setup(mesh)`
method with the desired `mfem::Mesh` or `mfem::ParMesh`.

* Next, `FindPointsGSLIB::FindPoints(xyz)` method must be used with the
`mfem::Vector xyz` of physical-space coordinates of the points where the user
wants to interpolate the desired grid function.
The ordering of the coordinates in `xyz` must be by `vdim`,
i.e. (**x** = x<sub>1</sub>,x<sub>2</sub>,x<sub>3</sub>...,x<sub>N</sub>,
              y<sub>1</sub>,y<sub>2</sub>,y<sub>3</sub>...,y<sub>N</sub>,
              z<sub>1</sub>,z<sub>2</sub>,z<sub>3</sub>...,z<sub>N</sub>).

    At this step, `findpts` determines the computational coordinates
(**q**<sub>j</sub> = {e<sub>j</sub>, **r**<sub>j</sub>,
p<sub>j</sub>}) for each point.
These computational coordinates include the element number
(e<sub>j</sub> in `mfem::Array<int> gsl_elem`) in which the point is found,
the reference-space coordinates (**r**<sub>j</sub> in `mfem::Vector gsl_ref`) inside e<sub>j</sub>,
and the MPI rank that the element is partitioned on (p<sub>j</sub> `mfem::Array<int> gsl_proc`).
`FindPoints` also returns a code (`mfem::Array<int> gsl_code`) to indicate wether
the point was found inside an element (`gsl_code[j] = 0`), on the edge/face of an
element (`gsl_code[j] = 1`), or not found at all (`gsl_code[j] = 2`) for the case
when the point is located outside the mesh.

    **Note** that if a point (**x**<sub>j</sub>) is located outside the mesh within
a certain tolerance, `findpts` tries to find the closest location on the mesh
surface (i.e. `gsl_code[j] = 1`) and returns the distance (`mfem::Vector gsl_dist`)
between the sought point and the point found on the mesh surface.

* Finally, `FindPointsGSLIB::Interpolate(u, ui)` can be used to interpolate the
desired `mfem::(Par)GridFunction u` at the physical-space coordinates given by `xyz`
and return the interpolated values in `mfem::Vector ui`.

    If `u` is in `H1`, we use `findpts` for interpolation. Otherwise,
we use `findpts` only for communicating computational coordinates of each point
across MPI ranks, followed by MFEM's internal methods (`mfem::GridFunction::GetValues`)
for interpolation.

* **Note**, the `FindPointsGSLIB::FreeData()` method must be used before the
program is terminated to free up the memory setup internally by `findpts` during
the `setup` phase. Not doing this step will result in memory leaks.

For convenience, `FindPointsGSLIB` class provides methods such as
`FindPointsGSLIB::Interpolate(mesh, xyz, u, ui)` which combines the three steps
(setup, finding the computatational coordinates of the sought points, and
interpolation) into a single method. Please see the [class definition](https://github.com/mfem/mfem/blob/master/fem/gslib.hpp#L45)
for more details.

## Application of `FindPointsGSLIB`
The `gslib` miniapps demonstrate several application of `FindPointsGSLIB`:

* [findpts/pfindpts](https://github.com/mfem/mfem/blob/master/miniapps/gslib/findpts.cpp)
miniapps demonstrate high-order interpolation of a function in `H1`, `L2`, `H(div)`, or `H(curl)` at an
arbitrary set of of points in physical space.

* [field-diff](https://github.com/mfem/mfem/blob/master/miniapps/gslib/field-diff.cpp)
miniapp demonstrates comparison of grid functions defined on two
different meshes.

* [field-interp](https://github.com/mfem/mfem/blob/master/miniapps/gslib/field-interp.cpp)
miniapp demonstrates transfer of a grid function from one mesh
on to another mesh.

* [schwarz_ex1/ex1p](https://github.com/mfem/mfem/blob/master/miniapps/gslib/schwarz_ex1.cpp)
miniapp demonstrates use of overlapping Schwarz method to
solve the Poisson problem in overlapping meshes. Here, we use `FindPointsGSLIB` to
transfer solution between overlapping meshes to enforce Dirichlet conditions
at the interdomain boundaries.

* [cht](https://github.com/mfem/mfem/blob/master/miniapps/navier/navier_cht.cpp)
Navier miniapp demonstrates how a conjugate heat transfer problem can be
solve with the incompressible Navier-Stokes equations and the unsteady heat
equation solved on different grids. Here, `FindPointsGSLIB` is used to
transfer the solution from one mesh to another to couple the two PDEs.
