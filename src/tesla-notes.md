tag-electromagnetics:

# Magnetostatic Equations

The magnetostatic equations that we start from are the following:
$$\nabla\times\bf H = \bf J \label{ampere}$$
$$\nabla\cdot{\bf B}= 0 \label{mag_gauss}$$
$${\bf B} = \mu{\bf H}+\mu_0{\bf M} \label{const}$$
Where \eqref{ampere} is Ampère's Law,
\eqref{mag_gauss} is Gauss's Law for Magnetism, and
\eqref{const} is a somewhat atypical way to write the Constitutive Relation
between ${\bf B}$ and ${\bf H}$. The constitutive relation used here
follows "Classical Electrodynamics" 3rd edition by J.D. Jackson and uses
${\bf M}$, measured in A/m, to represent the magnetization of a
permanent magnet. Some sources would instead use
${\bf B}_r=\mu_0{\bf M}$ to represent a residual
magnetization, measured in tesla. These conventions are, of course,
mathematically equivalent but the choice made in this miniapp does seem
a bit odd as I look at it now.

These equations can be combined if we make use of the fact that
$\nabla\cdot{\bf B}=0$ implies
${\bf B}=\nabla\times{\bf A}$ for some vector potential
${\bf A}$. This leads to:
$$\nabla\times(\mu^{-1}\nabla\times{\bf A}) = {\bf J}+ \nabla\times(\mu^{-1}\mu_0{\bf M})$$

This equation supports a current source density, a permanent
magnetization, surface current boundary conditions, and fixed
${\bf A}$ boundary condition which can be used to apply an external
magnetic field.

There also exists a special case in magnetostatics when the current
density is equal to zero. In this case $\nabla\times{\bf H}=0$
which implies that the magnetic field can be computed as
${\bf H}=-\nabla\Phi_M$. This leads to the scalar potential
formulation which we will not consider further except to say that the
electrostatic solver, named `volta`, can be adapted to model such
situations.

# The `tesla` Miniapp

The `tesla` miniapp models the magnetostatic equation for the magnetic
vector potential ${\bf A}$. It includes source terms derived from a
volumetric current source ${\bf J}$, magnetization vector
${\bf M}$, or surface currents ${\bf K}$.
$$\nabla\times(\mu^{-1}\nabla\times{\bf A}) = {\bf J}+\nabla\times(\mu^{-1}\mu_0{\bf M})$$
$$\hat{n}\times(\mu^{-1}\nabla\times{\bf A}) = \hat{n}\times{\bf K}$$

The magnetic vector potential will be approximated in
H(Curl) so that the left hand side operator is well defined.
$${\bf A} \approx \sum_i a_i {\bf W}_i (\vec{x})$$

Inserting this into the left hand side of the equation and integrating the resulting
equation against each H(Curl) basis function leads to the following weak
form:
$$\begin{align}
\int\_{\Omega}{\bf W}\_{i}(\vec{x})\cdot[\nabla\times(\mu^{-1}\nabla\times{\bf A})]d\Omega & \approx
\int\_\Omega{\bf W}_i(\vec{x})\cdot\\{\nabla\times[\mu^{-1}\nabla\times(\sum_j a_j{\bf W}_j(\vec{x}))]\\}d\Omega \\\\
  & = \sum\_j a_j\\{\int\_\Omega{\bf W}_i(\vec{x})\cdot[\nabla\times(\mu^{-1}\nabla\times{\bf W}_j(\vec{x}))]d\Omega\\}
\end{align}$$


The expression in curly braces depends only on our material coefficient and our basis functions. This particular integral
requires a little more manipulation to move the outermost curl operator
onto the H(Curl) basis function. $$\begin{aligned}
  \int\_\Omega{\bf W}_i(\vec{x})\cdot[\nabla\times(\mu^{-1}\nabla\times{\bf W}_j(\vec{x}))]\,d\Omega
  &=&
  \int\_\Omega(\nabla\times{\bf W}_i(\vec{x}))\cdot(\mu^{-1}\nabla\times{\bf W}_j(\vec{x}))\,d\Omega \\\\
  &-&  \int\_\Omega\nabla\cdot[{\bf W}_i(\vec{x})\times(\mu^{-1}\nabla\times{\bf W}_j(\vec{x}))]\,d\Omega \\\\
  &=&
  \int\_\Omega(\nabla\times{\bf W}_i(\vec{x}))\cdot(\mu^{-1}\nabla\times{\bf W}_j(\vec{x}))\,d\Omega \\\\
  &-&  \int\_\Gamma\hat{n}\cdot[{\bf W}_i(\vec{x})\times(\mu^{-1}\nabla\times{\bf W}_j(\vec{x}))]\,d\Gamma \\\\
  &=&
  \int\_\Omega(\nabla\times{\bf W}_i(\vec{x}))\cdot(\mu^{-1}\nabla\times{\bf W}_j(\vec{x}))\,d\Omega \\\\
  &+&  \int\_\Gamma{\bf W}_i(\vec{x})\cdot[\hat{n}\times(\mu^{-1}\nabla\times{\bf W}_j(\vec{x}))]\,d\Gamma \\\\
\end{aligned}$$ The first integral remaining on the right hand side is
implemented in MFEM as a `BilinearFormIntegrator` named
`CurlCurlIntegrator`. The second integral, the boundary integral, gives
rise to a Neumann boundary condition which will be discussed further in
Section [2.1.3](#sec:surf_current){reference-type="ref"
reference="sec:surf_current"}.

## Source Terms

### Current Density ${\bf J}$

The current density ${\bf J}$ requires special care. In order for
the magnetostatic equations to possess a solution ${\bf J}$ must be
in the range of the curl operator. Another way to say this is that the
divergence of ${\bf J}$ must be zero. If
$\nabla\cdot{\bf J}\neq 0$ we can correct this by adding the
gradient of a scalar field. If we start with some initial estimate of
the current density which we call ${\bf J}_0$,
$$\begin{aligned}
  \nabla\cdot({\bf J}_0-\nabla\Psi) &=& 0 \\\\
  \nabla\cdot\nabla\Psi &=& \nabla\cdot{\bf J}_0 \\\\
  {\bf J}& = & {\bf J}_0 - \nabla\Psi
\end{aligned}$$

The current density ${\bf J}$ computed in this
manner will be divergence free and therefore it will be in the range of
the curl operator.

Normally, in the continuous world, we simply define ${\bf J}$
directly, however, in the discrete world we can only approximate
${\bf J}$ so we must always perform this divergence cleaning
procedure on our approximations of ${\bf J}$. Failure to do so can
lead to lack of convergence or complete failure of the solve.

In MFEM the divergence cleaning procedure is handled by a class called
`DivergenceFreeProjector` which is not a part of the MFEM library
itself. It is provided as part of a collection of convenience classes in
the `miniapps/common` subdirectory.

### Magnetization ${\bf M}$

The magnetization ${\bf M}$ is intended to represent permanent
magnetics or other regions of prescribed magnetization. In the Tesla
miniapp ${\bf M}$ is discretized using H(Div) basis functions which
allow its tangential components to be discontinuous. Its curl appears in
the magnetostatic equations as a source term and this curl operation
ensures that this source lies in the range of the curl operator so no
divergence cleaning operation is needed for this portion of the source.

In the Tesla miniapp this source is computed and applied on lines
338-343 in the `TeslaSolver::Solve()` function. The weak curl operator
is configured on lines 168-175 in the `TeslaSolver` constructor.

### Surface Current ${\bf K}$ {#sec:surf_current}

The integration by parts needed to create the weak form of the curl-curl
operators also leads to a boundary integral:
$$\int\_\Gamma{\bf W}_i(\vec{x})\cdot[\hat{n}\times(\mu^{-1}\nabla\times{\bf W}_j(\vec{x}))]\,d\Gamma$$
This means that our weak curl-curl operator applied to ${\bf A}$
differs from the continuous curl-curl operator by a surface integral of
the form:
$$\int\_\Gamma{\bf W}_i(\vec{x})\cdot[\hat{n}\times(\mu^{-1}\nabla\times{\bf A})]\,d\Gamma = \int\_\Gamma{\bf W}_i(\vec{x})\cdot(\hat{n}\times{\bf H})\,d\Gamma$$

If we do nothing to account for this boundary integral we are implicitly
setting it equal to zero which amounts to a boundary condition on the
tangential part of the magnetic field i.e.
$\hat{n}\times{\bf H}=0$. Another possibility is to set a surface
current boundary condition i.e.
$\hat{n}\times{\bf H}=\hat{n}\times{\bf K}$. This could be
done by using a `ParLinearForm` object to integrate
$\hat{n}\times{\bf K}$ over the portion of the boundary where
${\bf K}$ is non-zero and adding the resulting vector to the right
hand side of the linear system.

However, this is not the approach used in the Tesla miniapp. In Tesla we
employ a trick based on the Stoke's theorem. A surface current leads to
a discontinuity in the tangential part of ${\bf H}$ on the
boundary. Similarly, a discontinuity in ${\bf H}$ leads to a
discontinuity in ${\bf A}$ on the boundary. Therefore we can set
the tangential part of ${\bf A}$ to equal ${\bf K}$ and we get
the correct behavior as long as we set the tangential part of
${\bf A}=0$ elsewhere on the boundary. To be honest I'm not sure
how valid this approach is but it does seem to work and it can improve
solver convergence. I would recommend confirming this approach before
relying on it.

## Post-Processing

### Computation of ${\bf H}$ {#sec:h_comp}

The magnetic field ${\bf H}$ needs to have tangential continuity so
we approximate it using the H(Curl) basis:
$${\bf H}\approx\sum_i h_i{\bf W}_i(\vec{x})$$

Recall that the magnetic flux ${\bf B}$ is approximated using the
H(Div) basis due to the continuity of its normal component.
$${\bf B}\approx\sum_i b_i{\bf F}_i(\vec{x})$$

To compute ${\bf H}$ from ${\bf B}$ we make use of the
constitutive equation ${\bf B}=\mu{\bf H}$. Inserting our
approximations and integrating this equation against each H(Curl) basis
function we obtain the following:
$$\sum\_j h_j\int\_\Omega\mu{\bf W}_i\cdot{\bf W}_j\,d\Omega =
\sum\_k b_k\int\_\Omega{\bf W}_i\cdot{\bf F}_k\,d\Omega$$

This set of linear equations is equivalent to the matrix equation:
$$M_1(\mu)h = M_{21}b$$

Where $M_1(\mu)$ is an H(Curl) mass matrix incorporating the material
coefficient $\mu$ which is implemented in MFEM as a
`BilinearFormIntegrator` named `VectorFEMassIntegrator`. The $M_{21}$
operator is a rectangular matrix which maps H(Div) to H(Curl) and is
also built using the `VectorFEMassIntegrator` but with the default
material coefficient which is equal to 1.

The solution of this linear system is usually obtained with a conjugate
gradient iterative solver along with a diagonal scaling preconditioner.
Since the matrix to be inverted is a mass matrix this solution is
usually very efficient involving fewer than thirty solver iterations.

It is important to point out that an H(Curl) approximation usually has
more degrees of freedom than a comparable H(Div) approximation. In the
interior of the domain the density of degrees of freedom are
approximately equal but H(Curl) approximations tend to have more degrees
of freedom on the boundary. Consequently, this type of conversion can
produce H(Curl) approximations with poor accuracy near the boundary. If
the tangential components of ${\bf B}$ are nearly constant within
the elements adjacent to the boundary the conversion can produce a good
approximation. However, if these tangential components vary too rapidly
non-physical oscillations can occur in ${\bf H}$. To alleviate
these oscillations Dirichlet boundary conditions can be applied during
the solution of ${\bf H}$ provided that reasonable values for
$(\hat{n}\times{\bf H})\times\hat{n}$ can be determined. In the
present magnetostatics context we can reuse any Neumann boundary
conditions used during the solution of ${\bf A}$ since these were
equivalent to setting $\hat{n}\times{\bf H}$ on the boundary.

### Magnetic Energy in a Region

The `tesla` miniapp does not compute the energy in the magnetic field
but such a computation should be easy to add. There are two basic
procedures for computing energy in MFEM. One involves a bilinear form
and the other a linear form. The bilinear form approach makes sense when
the energies of multiple fields will be computed with the same operator
so that the cost of building the bilinear form can be amortized. In a
magnetostatic problem the linear form approach is likely to be more
efficient.

The usual formula for magnetic energy is $u =
\frac{1}{2}\int\_\Omega{\bf H}\cdot{\bf B}\,d\Omega$. There are
many ways to compute this quantity in MFEM but perhaps the most
convenient is to make use of a `VectorCoefficient` and a
`ParLinearForm`. For example let's assume we have a coefficient for
$\mu^{-1}$ and a `GridFunction` for ${\bf B}$ called `Bgf`:
```c++
{
   VectorGridFunctionCoefficient BCoef(&Bgf);
   ScalarVectorProductCoefficient HCoef(muInvCoef, BCoef);
   ParLinearForm Hlf(&HDivFESpace);
   Hlf.AddDomainIntegrator(new VectorFEDomainIntegrator(HCoef));
   Hlf.Assemble();

   double energy = 0.5 * Hlf(Bgf);
}
```

This integral can be restricted to some region, defined by a set of
element attributes, by incorporating a ` VectorRestrictedCoefficient`.

Other forms of energy such as
$\frac{1}{2}\int\_\Omega{\bf J}\cdot{\bf A}\,d\Omega$ or
perhaps $\int\_\Omega{\bf M}\cdot{\bf B}\,d\Omega$ could be
computed in a similar manner.

### Torque on a Current Density

Torque can also be defined as a volume integral so we can employ a
technique similar to the one used for the energy computation. The
important difference is that torque is a vector quantity so we will need
to integrate each of its vector components separately. This will likely
require custom coefficients but the procedure should be straightforward.
The existing vector coefficient classes
` ScalarVectorProductCoefficient` and ` VectorCrossProductCoefficient`
should serve as guides for how this can be accomplished.

### Torque on a Permanent Magnet

### Torque on a Surface Current

In theory a surface integral can be computed in a very similar manner to
a volume integral. However, discontinuous finite element spaces such as
H(Curl), H(Div), or L2 create a complication. Approximations made with
these discontinuous fields do not possess well defined values on
surfaces. Consequently such an integral could lack precision or even be
multi-valued.

To overcome this limitation it may be necessary to compute different
contributions to the torque in different manners and combine the
results. For example the normal component of ${\bf B}$ is well
defined on surfaces. Therefore the force
${\bf K}\times{\bf B}$ may be inaccurate but the quantity
$(\hat{n}\cdot{\bf B}){\bf K}\times\hat{n}$ will be more
reliable. To obtain another contribution to the torque we can use the
tangential components of ${\bf H}$ as
$\mu{\bf K}\times[(\hat{n}\times{\bf H})\times\hat{n}]$.
This of course assumes that we have an accurate representation of
${\bf H}$ on this surface which may not be the case if the surface
is an outer boundary (see
Section [Computation of H](#sec:h_comp)).

# Appendix A:  Magnetic Energy

```c++
class MagneticEnergy
{
private:
   const ParGridFunction & b_;
   const ParGridFunction & h_;

public:
   MagneticEnergy(const ParGridFunction & b,
                  const ParGridFunction & h)
      : b_(b), h_(h) {}

   double ComputeEnergy()
   {
      VectorGridFunctionCoefficient h_coef(&h_);

      ParLinearForm h_lf(b_.ParFESpace());
      h_lf.AddDomainIntegrator(new VectorFEDomainLFIntegrator(h_coef));
      h_lf.Assemble();

      return 0.5 * h_lf(b_);
   }

   double ComputeEnergy(const Array<int> & elem_attr_marker)
   {
      VectorGridFunctionCoefficient h_coef(&h_);

      ParLinearForm h_lf(b_.ParFESpace());
      h_lf.AddDomainIntegrator(new VectorFEDomainLFIntegrator(h_coef),
                               const_cast<Array<int>&>(elem_attr_marker));
      h_lf.Assemble();

      return 0.5 * h_lf(b_);
   }
};
```

# Appendix B:  Torque
```c++
class Torque
{
private:
   const ParGridFunction & b_;
   const ParGridFunction & h_;
   const ParGridFunction & j_;

public:
   Torque(const ParGridFunction & b,
          const ParGridFunction & h,
          const ParGridFunction & j)
      : b_(b), h_(h), j_(j) {}

   void ComputeTorqueOnSurface(const Array<int> &bdr_attr_marker,
                               const Vector &cent, Vector &T);
   void ComputeTorqueOnVolume(const Array<int> &vol_attr_marker,
                              const Vector &cent, Vector &T);
};

void Torque::ComputeTorqueOnSurface(const Array<int> &bdr_attr_marker,
                                    const Vector &cent, Vector &trq)
{
   trq = 0.0;

   ParFiniteElementSpace * fes = b_.ParFESpace();
   ParMesh *mesh = b_.ParFESpace()->GetParMesh();
   ElementTransformation *eltrans = NULL;

   Vector b, h, ht(3), nor(3), x(3), f(3), loc_trq(3);
   loc_trq = 0.0;

   for (int i=0; i<fes->GetNBE(); i++)
   {
      const int bdr_attr = mesh->GetBdrAttribute(i);
      if (bdr_attr_marker[bdr_attr-1] == 0) { continue; }

      eltrans = fes->GetBdrElementTransformation(i);
      const FiniteElement &el = *fes->GetBE(i);

      const IntegrationRule *ir = NULL;
      if (ir == NULL)
      {
         const int order = 2*el.GetOrder() + eltrans->OrderW(); // <-----
         ir = &IntRules.Get(eltrans->GetGeometryType(), order);
      }

      for (int pi = 0; pi < ir->GetNPoints(); ++pi)
      {
         const IntegrationPoint &ip = ir->IntPoint(pi);

         eltrans->SetIntPoint(&ip);

         CalcOrtho(eltrans->Jacobian(), nor);

         double a = nor.Norml2();

         eltrans->Transform(ip, x);

         b_.GetVectorValue(*eltrans, ip, b);
         h_.GetVectorValue(*eltrans, ip, h);

         double bn = b * nor / a;
         double hn = h * nor / a;
         add(h, -hn / a, nor, ht);

         f.Set(ip.weight * bn * bn / mu0_, nor);
         f.Add(ip.weight * a * bn, ht);
         f.Add(-0.5 * ip.weight * (mu0_ * (ht * ht) + bn * bn / mu0_), nor);

         loc_trq[0] += (x[1]-cent[1]) * f[2] - (x[2]-cent[2]) * f[1];
         loc_trq[1] += (x[2]-cent[2]) * f[0] - (x[0]-cent[0]) * f[2];
         loc_trq[2] += (x[0]-cent[0]) * f[1] - (x[1]-cent[1]) * f[0];
      }
   }

   MPI_Allreduce(loc_trq, trq, 3, MPI_DOUBLE, MPI_SUM, fes->GetComm());
}

void Torque::ComputeTorqueOnVolume(const Array<int> &attr_marker,
                                   const Vector &cent, Vector &trq)
{
   trq = 0.0;

   ParFiniteElementSpace * fes = b_.ParFESpace();
   ParMesh *mesh = b_.ParFESpace()->GetParMesh();
   ElementTransformation *eltrans = NULL;

   Vector b, j, x(3), f(3), t(3), loc_trq(3);
   loc_trq = 0.0;

   for (int i=0; i<fes->GetNE(); i++)
   {
      const int attr = mesh->GetAttribute(i);
      if (attr_marker[attr-1] == 0) { continue; }

      eltrans = fes->GetElementTransformation(i);
      const FiniteElement &el = *fes->GetFE(i);

      const IntegrationRule *ir = NULL;
      if (ir == NULL)
      {
         const int order = 2*el.GetOrder() + eltrans->OrderW(); // <-----
         ir = &IntRules.Get(eltrans->GetGeometryType(), order);
      }

      for (int pi = 0; pi < ir->GetNPoints(); ++pi)
      {
         const IntegrationPoint &ip = ir->IntPoint(pi);

         eltrans->SetIntPoint(&ip);

         eltrans->Transform(ip, x);

         b_.GetVectorValue(*eltrans, ip, b);
         j_.GetVectorValue(*eltrans, ip, j);

         f[0] = j[1] * b[2] - j[2] * b[1];
         f[1] = j[2] * b[0] - j[0] * b[2];
         f[2] = j[0] * b[1] - j[1] * b[0];

         t[0] = (x[1]-cent[1]) * f[2] - (x[2]-cent[2]) * f[1];
         t[1] = (x[2]-cent[2]) * f[0] - (x[0]-cent[0]) * f[2];
         t[2] = (x[0]-cent[0]) * f[1] - (x[1]-cent[1]) * f[0];

         loc_trq.Add(ip.weight * eltrans->Weight(), t);
      }
   }

   MPI_Allreduce(loc_trq, trq, 3, MPI_DOUBLE, MPI_SUM, fes->GetComm());
}
```

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS_HTML"></script>
