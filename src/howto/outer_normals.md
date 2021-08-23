# HowTo:  Compute the outer normals of the boundary elements of a mesh

In numerous applications it is important to obtain the outer normals to the boundary of your
mesh.  In 2D this will simply be the vector normal to the vector tangent to the boundary point
of interest, and in 3D this will be the vector normal to the plane tangent to the boundary
point of interest.  An easy way to obtain these vector/plane tangents is to use the Jacobian
of the element transformation at the point of interest as in the following example:

```c++
// Loop through the boundary elements and compute the normals at the centers of those elements
for (int it = 0; it < fespace->GetNBE(); it++)
{
  Vector normal(dim);
  ElementTransformation *Trans = fespace->GetBdrElementTransformation(it);
  Trans->SetIntPoint(&Geometries.GetCenter(Trans->GetGeometryType()));
  CalcOrtho(Trans->Jacobian(), n);
  ... Do something of interest with the normals
}
```

The ElementTransformation object handles transformations between the elements and their
corresponding reference elements.  We start by getting the ElementTransformation object
for the boundary element we are interested in.  In order to move forward we then need to
set the point in the element that we are interested in with the SetIntPoint method.  In this
we are setting it to the geometric center of the boundary element.  Finally, we can get the
Jacobian of the boundary element and use the tangent vector/plane that it defines to compute
the boundary element normal at the boundary element center.  The CalcOrtho method simply takes
a 2x1 or 3x2 matrix and compute the normal to the column vectors of that matrix.  It should
be noted that the vectors that are computed in this process and not necessarily of unit
length.
