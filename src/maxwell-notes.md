---
author:
- Mark L. Stowell
title: Overview of the Maxwell Miniapp in MFEM
---

# Maxwell's Equations

$$\begin{aligned}
\nabla\times\mbox{\bf H}& = &  \frac{\partial\mbox{\bf D}}{\partial t} + \mbox{\bf J}+ \overline{\sigma}\mbox{\bf E}\label{eq:ampere}\\
\nabla\times\mbox{\bf E}& = & -\frac{\partial\mbox{\bf B}}{\partial t} - \mbox{\bf M}- \overline{\sigma}_M\mbox{\bf H}\label{eq:faraday}\\
\nabla\cdot\mbox{\bf D}& = & \rho\label{eq:gauss}\\
\nabla\cdot\mbox{\bf B}& =  & 0\label{eq:trans}
\end{aligned}$$

With electric current density, $\mbox{\bf J}$, magnetic current density,
$\mbox{\bf M}$, electric conductivity, $\overline{\sigma}$, magnetic
conductivity, $\overline{\sigma}_M$, and electric charge density,
$\rho$. We will sometimes refer to these equations by the names Ampère's
Law, Faraday's Law, Guass' Law, and the Transversality Condition
respectively. It is also necessary to define the constitutive relations
$\mbox{\bf D}\equiv\epsilon\mbox{\bf E}$ and
$\mbox{\bf B}\equiv\mu\mbox{\bf H}$.

It is also common to combine
equations ([\[eq:ampere\]](#eq:ampere){reference-type="ref"
reference="eq:ampere"}) and
([\[eq:faraday\]](#eq:faraday){reference-type="ref"
reference="eq:faraday"}) into a single second order PDE.
$$\begin{aligned}
\frac{\partial^2\left(\epsilon\mbox{\bf E}\right)}{\partial t^2}
+ \frac{\partial\left(\overline{\sigma}\mbox{\bf E}\right)}{\partial t}
+ \nabla\times\left(\mu^{-1}\nabla\times\mbox{\bf E}\right) & \nonumber \\
+ \nabla\times\left(\mu^{-1}\overline{\sigma}_M\mbox{\bf H}\right) &
=
-\frac{\partial\mbox{\bf J}}{\partial t}
- \nabla\times\left(\mu^{-1}\mbox{\bf M}\right)
\label{eq:curlcurle}
%\end{align}
\mbox{or}&\\
%\begin{equation}
\frac{\partial^2\left(\mu\mbox{\bf H}\right)}{\partial t^2}
+ \frac{\partial\left(\overline{\sigma}_M\mbox{\bf H}\right)}{\partial t}
+ \nabla\times\left(\epsilon^{-1}\nabla\times\mbox{\bf H}\right) & \nonumber \\
- \nabla\times\left(\epsilon^{-1}\overline{\sigma}\mbox{\bf E}\right) &
=
-\frac{\partial\mbox{\bf M}}{\partial t}
+\nabla\times\left(\epsilon^{-1}\mbox{\bf J}\right)
\label{eq:curlcurlh}
\end{aligned}$$ One drawback of these formulations is the appearance of
$\mbox{\bf H}$ in
equation ([\[eq:curlcurle\]](#eq:curlcurle){reference-type="ref"
reference="eq:curlcurle"}) or $\mbox{\bf E}$ in
equation ([\[eq:curlcurlh\]](#eq:curlcurlh){reference-type="ref"
reference="eq:curlcurlh"}). The only way to formulate these equations
entirely in terms of $\mbox{\bf E}$ or $\mbox{\bf H}$ is to make
assumptions about the spatial variation of
$\epsilon^{-1}\overline{\sigma}$ or $\mu^{-1}\overline{\sigma}_M$. For
this reason these second order formulations should be avoided unless
$\overline{\sigma}_M=0$ or $\overline{\sigma}=0$.

# Discretization

## Basis Functions

There are two sets of basis functions particularly well suited for
electromagnetics; Nedelec and Raviart-Thomas. The Nedelec basis
functions guarantee tangential continuity of their approximations across
element interfaces. This makes them well suited for the fields
$\mbox{\bf E}$ and $\mbox{\bf H}$ which share this constraint on
material interfaces. The Raviart-Thomas basis functions guarantee
continuity of the normal component of their approximations across
element interfaces. This makes them well suited for the fields
$\mbox{\bf B}$ and $\mbox{\bf D}$ which share this constraint on
material interfaces.

The Nedelec basis functions which discretize the H(Curl) space are
indispensable due to the presence of the Curl operators in
equations ([\[eq:ampere\]](#eq:ampere){reference-type="ref"
reference="eq:ampere"}),
([\[eq:faraday\]](#eq:faraday){reference-type="ref"
reference="eq:faraday"}),
([\[eq:curlcurle\]](#eq:curlcurle){reference-type="ref"
reference="eq:curlcurle"}), and
([\[eq:curlcurlh\]](#eq:curlcurlh){reference-type="ref"
reference="eq:curlcurlh"}). The Raviart-Thomas basis functions which
discretize the H(Div) space are convenient and reduce the computational
cost but are optional, strictly speaking.

## Discretization of the primary fields

There are three choices for discretizing the set of coupled first order
partial differential equations:

-   $\mbox{\bf E}\in$ H(Curl) and
    $\mbox{\bf B},\mbox{\bf J},\mbox{\bf M}\in$ H(Div)

-   $\mbox{\bf H}\in$ H(Curl) and
    $\mbox{\bf D},\mbox{\bf J},\mbox{\bf M}\in$ H(Div)

-   $\mbox{\bf E}\in$ H(Curl), $\mbox{\bf H}\in$ H(Curl), and
    $\mbox{\bf J},\mbox{\bf M}\in$ H(Curl) (grudgingly)

There is only one choice for discretizing the second order equations
i.e. $\mbox{\bf E}$ or $\mbox{\bf H}$ in H(Curl).

These basis function choices merely ensure that the approximate fields
maintain the proper interface constraints at material boundaries. The
choice of formulation can be made based on the required sources,
boundary conditions, and/or post-processing requirements. Hence,
different physical requirements can lead to different choices of
formulation i.e. there is no single best choice for all problems.

## Discretization of $\mbox{\bf J}$ and $\mbox{\bf M}$ {#sec:JM}

The electric and magnetic current source densities are both flux vectors
and as such they are best represented using the H(Div) space. This is
most apparent when modeling the eddy current equation but H(Div) can be
important in wave equations as well. Imagine modeling a current carrying
conductor surrounded by some insulating material. The current density
$\mbox{\bf J}$ may be non-zero inside the conductor but it should be
identically zero outside of it. Assuming the computational mesh conforms
to the surface of this conductor, an H(Div) field can can accurately
represent such a current flow as long as the current at the surface of
the conductor remains parallel to that surface. In other words the
current will not "leak" out of the conductor as long as the normal
component of the current is zero at the surface. On the other hand, if
H(Curl) basis functions were used for $\mbox{\bf J}$ its tangential
components would need to be continuous across the surface of the
conductor. This produces a non-physical current within the first layer
of elements surrounding the conductor.

Non-physical currents leaking out of conductors when using H(Curl) basis
functions for the current density $\mbox{\bf J}$ can lead to inaccurate
eddy current simulations either by producing a larger than expected
magnetic field outside the conductor or a reduced thermal heat load
within the conductor. Similarly, in wave simulations the total power
emanating from an antenna can be either over- or under-estimated
depending upon how $\mbox{\bf J}$ is computed on the surface of the
antenna. Such matters can be eliminated by simply representing
$\mbox{\bf J}$ as an H(Div) function. I'm sure similar arguments can be
made for the magnetization $\mbox{\bf M}$ although I have less
experience with that.

# The `maxwell` Miniapp

The `maxwell` Miniapp uses the **EB** formulation with
$\overline{\sigma}_M$ and $\mbox{\bf M}$ assumed to be zero. It evolves
the first order coupled system of equations using a symplectic time
integration algorithm by Candy and Rozmus described in "A Symplectic
Integration Algorithm for Separable Hamiltonian Functions", Journal of
Computational Physics, Vol. 92, pages 230-256 (1991). The main advantage
of this algorithm is that it conserves energy. Another advantage is that
the approximations of $\mbox{\bf E}$ and $\mbox{\bf B}$ correspond to
the same simulation time rather than being staggered as in other
methods.

The variable order symplectic integration class in MFEM called
` SIAVSolver` requires that we implement our coupled set of PDEs as a
pair of operators. The first is an `Operator` which can be used to
update the magnetic field, $\mbox{\bf B}$, using Faraday's Law by
computing $-\nabla\times\mbox{\bf E}$. The second is a
`TimeDependentOperator` which can be used to update the electric field,
$\mbox{\bf E}$, using Ampère's Law by computing
$\nabla\times\left(\mu^{-1}\mbox{\bf B}\right)-\mbox{\bf J}-\overline{\sigma}\mbox{\bf E}$.
We choose to implement both of these operators in a single class which
we call ` MaxwellSolver`.

The first operator, $-\nabla\times\mbox{\bf E}$, acts on
$\mbox{\bf E}\in$ H(Curl) to produce a result
$\frac{\partial\mbox{\bf B}}{\partial t}\in$ H(Div). By design our
discrete representation of H(Div) contains the curl of any field in our
discrete representation of H(curl). Consequently we can compute this
operator by simply evaluating the curl of our H(Curl) basis functions in
terms of our H(Div) basis functions. This evaluation is handled by a
`DiscreteInterpolator` called ` CurlInterpolator`. The process of
looping over each element to compute these interpolations is conducted
by the the ` ParDiscreteLinearOperator`. In the `MaxwellSolver` this
curl operator is simply named `Curl_` and its negative, needed by the
`SIAVSolver`, is named `NegCurl_`. These operators are setup between
lines 227 and 236 of the file `maxwell_solver.cpp`.

The second operator,
$\nabla\times\left(\mu^{-1}\mbox{\bf B}\right)-\mbox{\bf J}-\overline{\sigma}\mbox{\bf E}$,
requires a bit more effort. The first thing to notice is that we cannot
compute the curl of $\mu^{-1}\mbox{\bf B}$ precisely. Primarily this is
due to the fact that $\mbox{\bf B}\in$ H(Div) rather than H(Curl) but,
in general, the presence of $\mu^{-1}$ is also a problem since we don't
know its derivatives at all. These complications require that we compute
the curl operator in a weak sense.

## Setup of the `TimeDependentOperator`

### Weak curl of $\mu^{-1}\mbox{\bf B}$

Often in wave propagation $\mu$ is assumed to be constant but we will
not make this assumption. In principle $\mu$ could be anisotropic and
inhomogeneous although we do assume it is constant in time. The magnetic
field $\mbox{\bf B}$ will be written as a linear combination of basis
functions in H(Div) which we will label as $\mbox{\bf F}_i$ e.g.
$\mbox{\bf B}(\vec{x})\approx\sum_i b_i(t)\mbox{\bf F}_i(\vec{x})$.

Our goal is to compute $\frac{\partial\mbox{\bf E}}{\partial t}$ where
$\mbox{\bf E}\in$ H(Curl) so we need to represent
$\nabla\times\mu^{-1}\mbox{\bf B}$ also in H(Curl). The basis functions
of H(Curl) will be labeled as $\mbox{\bf W}_i$. To compute the weak form
of this term we multiply the operator of interest by each of our H(Curl)
basis functions and integrate over the entire problem domain to obtain
an equation corresponding to each basis function in H(Curl). For example
$$\begin{aligned}
  \int_\Omega\mbox{\bf W}_i(\vec{x})\cdot\left[\nabla\times\left(\mu^{-1}\mbox{\bf B}\right)\right]\,d\Omega
  &=& \int_\Omega\mbox{\bf W}_i(\vec{x})\cdot\left[\nabla\times\left(\mu^{-1}\sum_jb_j\mbox{\bf F}_j(\vec{x})\right)\right]\,d\Omega\\
  &=& \sum_jb_j\left\{\int_\Omega\mbox{\bf W}_i(\vec{x})\cdot\left[\nabla\times\left(\mu^{-1}\mbox{\bf F}_j(\vec{x})\right)\right]\,d\Omega\right\}
\end{aligned}$$ The expression in curly braces depends only on our
material coefficient and our basis functions so we can precompute this
if we assume $\mu$ does not change in time. This particular integral
requires a little more manipulation to move the curl operator onto the
H(Curl) basis function. $$\begin{aligned}
  \int_\Omega\mbox{\bf W}_i(\vec{x})\cdot\left[\nabla\times\left(\mu^{-1}\mbox{\bf F}_j(\vec{x})\right)\right]\,d\Omega &=&
  \int_\Omega\left(\nabla\times\mbox{\bf W}_i(\vec{x})\right)\cdot\left(\mu^{-1}\mbox{\bf F}_j(\vec{x})\right)\,d\Omega \\
  &-&  \int_\Omega\nabla\cdot\left[\mbox{\bf W}_i(\vec{x})\times\left(\mu^{-1}\mbox{\bf F}_j(\vec{x})\right)\right]\,d\Omega \\
  &=&
  \int_\Omega\left(\mu^{-T}\nabla\times\mbox{\bf W}_i(\vec{x})\right)\cdot\mbox{\bf F}_j(\vec{x})\,d\Omega \\
  &-&  \int_\Gamma\hat{n}\cdot\left[\mbox{\bf W}_i(\vec{x})\times\left(\mu^{-1}\mbox{\bf F}_j(\vec{x})\right)\right]\,d\Gamma \\
  &=&
  \int_\Omega\left(\mu^{-T}\nabla\times\mbox{\bf W}_i(\vec{x})\right)\cdot\mbox{\bf F}_j(\vec{x})\,d\Omega \\
  &+&  \int_\Gamma\mbox{\bf W}_i(\vec{x})\cdot\left[\hat{n}\times\left(\mu^{-1}\mbox{\bf F}_j(\vec{x})\right)\right]\,d\Gamma
\end{aligned}$$ Where $\mu^{-T}$ is the transpose of the inverse of
$\mu$ and $\Gamma=\partial\Omega$ i.e. the boundary of the domain.

The first integral remaining on the right hand side is the weak curl
operator which is implemented in MFEM as a ` BilinearFormIntegrator`
named ` MixedVectorWeakCurlIntegrator`[^1]. This operator is setup
between lines 178 and 184 of the file `maxwell_solver.cpp`.

The boundary integral term shown above is ignored in the `maxwell`
miniapp which implies that it is assumed to be zero. This gives rise to
a so-called natural boundary condition which in this case implies that
$\hat{n}\times\mbox{\bf H}=0$. Any portion of the boundary where an
essential (a.k.a. Dirichlet) boundary condition is set will override
this implicit boundary condition. Alternatively an inhomogeneous Neumann
boundary condition can be applied by providing a nonzero function in
place of $\hat{n}\times\mbox{\bf H}$ in this integral. This would be
accomplished by passing a known vector function to the
` LinearFormIntegrator` named `VectorFEDomainLFIntegrator` and using
this as a boundary integrator in ` ParLinearForm`. Unfortunately we
don't seem to have an example of this usage in either of the `tesla` or
`maxwell` miniapps.

### Loss term $\overline{\sigma}\mbox{\bf E}$

This would seem to be a simple term but, of course, there is a
complication. According to the Candy and Rozmus paper this piece of the
Hamiltonian should not depend on $\mbox{\bf E}$. Furthermore, to
properly model such a loss term it is best to handle it implicitly. To
accomplish this the `MaxwellSolver` stores the current value of the
electric field internally since the `SIAVSolver` will not provide this
data to the update method (which is called ` ImplicitSolve`). The
integral needed to model this term simply computes the product of the
H(Curl) basis functions against each other along with the material
coefficient, $\overline{\sigma}$ in this case. This integrator is called
`VectorFEMassIntegrator`. The portion of this operator which will be
used with the current value of the electric field is setup between lines
195 and 208 of the file ` maxwell_solver.cpp`. The implicit portion is
setup between lines 399 and 407 using the same integrator.

### Current density $\mbox{\bf J}$

The `maxwell` miniapp does not place $\mbox{\bf J}$ in H(Div) despite
the comments in Section [2.3](#sec:JM){reference-type="ref"
reference="sec:JM"}. The reason for this is that the `maxwell` miniapp
does not use a `GridFunction` representation of $\mbox{\bf J}$ in any
computations. It does, however, write $\mbox{\bf J}$ to its data files
for visualization and this really should be done using an H(Div) field.

The way the current density enters the wave equation is a source term
which is computed using the following integral:
$$\int_\Omega\mbox{\bf W}_i\cdot\mbox{\bf J}\,d\Omega$$ This is
accomplished by using the `LinearFormIntegrator` named
`VectorFEDomainLFIntegrator` and a `ParLinearForm` object. The setup of
this object can be found between lines 264 and 266 of the file
`maxwell_solver.cpp`. Integrals such as this, which directly evaluate a
c-style function, avoid the continuity concerns raised in
Section [2.3](#sec:JM){reference-type="ref" reference="sec:JM"}.

### Setting up the solver

The time derivative in Ampère's Law is of the form:
$$\frac{\partial\epsilon\mbox{\bf E}}{\partial t}
  \approx \frac{\partial}{\partial t}\left(\epsilon\sum_ie(t)\mbox{\bf W}_i\right)
  = \epsilon\sum_i\dot{e}(t)\mbox{\bf W}_i$$ Where we have assumed that
$\epsilon$ is constant in time. For the weak form of Ampère's we need to
again multiply by the H(Curl) basis functions and integrate over the
problem domain.
$$\int_\Omega\mbox{\bf W}_i\cdot\left(\epsilon\sum_j\dot{e}(t)\mbox{\bf W}_j\right)\,d\Omega
= \sum_j\dot{e}(t)\left\{\int_\Omega\mbox{\bf W}_i\cdot\left(\epsilon\mbox{\bf W}_j\right)\,d\Omega
\right\}$$ The integral in the curly braces is a mass matrix which is
again computed using the `BilinearFormIntegrator` named
` VectorFEMassIntegrator`. This is setup between lines 388 and 395 of
the file `maxwell_solver.cpp`.

The more unusual part of this operator comes from the implicit handling
of the loss term and the absorbing boundary condition. The latter is a
simple Sommerfeld first order radiation boundary condition. Each of
these implicit terms multiplies the electric field which we approximate
at the time $t+\Delta t/2$.

Each of these pieces bilinear forms which multiply the time derivative
are mass matrices so a conjugate gradient iterative solver with a
diagonal scaling preconditioner should work quite well. These are setup
between lines 423 and 428 of the file `maxwell_solver.cpp`.

One odd thing does appear in this `setupSolver` member function (and a
few other places) and that is the variable `idt`. This is an integer
related to the double precision time step `dt`. The reason for this is
that our variable order symplectic time integrator breaks up a time step
into a handful of smaller time steps which are generally not the same
size. If we need to handle loss terms implicitly this variable time step
will appear in the matrix passed to our solver. Of course we don't want
to rebuild this matrix every time the time step changes so we build and
cache the matrices in a container. The integer `idt` is simply the key
used to access these cached matrices and the solvers that were setup to
work with them.

## Putting it all together

The only remaining thing to discuss is the way in which we use a
combination of primal and dual vectors within the simulation code.
However, it's hard to know what level of detail will be useful here. At
this point I would recommend referring to our online documentation which
can be found at https://mfem.org/pri-dual-vec/ for an overview of this
concept.

I would be happy to go into more detail and describe how and why we use
these primal and dual vectors in the `maxwell` miniapp. Please let me
know if this would be useful and if there are any particular points of
confusion.

[^1]: A list of the various ` BilinearFormIntegrators` can be found at
    https://mfem.org/bilininteg. More detailed descriptions can be found
    in the files `fem/biliniteg.[ch]pp`.

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>