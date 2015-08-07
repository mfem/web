<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  tex2jax: {inlineMath: [['$','$']]}
});
</script>
<script type="text/javascript"
  src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>

# Example Codes

This page provides a brief overview of the MFEM example codes. For
detailed documentation of the MFEM sources, including the examples, build the
[Doxygen documentation](../../doc/CodeDocumentation/html/index.html) in the
`doc` directory, or browse the
[online version](http://mfem.github.io/doxygen/html/index.html).

Clicking on any of the categories below displays examples that contain the
described feature. _All examples support (arbitrarily) high-order meshes and
finite element spaces_.
The numerical results from the example codes can be visualized using the
GLVis visualization tool (based on MFEM). See the
[GLVis website](http://glvis.org) for more details.

Users are encouraged to submit any example codes that they have created and
would like to share. <br>
_Contact a member of the MFEM team to report
[bugs](https://github.com/mfem/mfem/issues/new)
or post
[questions](https://github.com/mfem/mfem/issues/new)
or comments_.

<table class="table table-bordered" markdown="1">
<tr>
<td>
   **Equation (PDE)**

   <label><input type="radio" id="all1" onchange="update(this.id);" checked="checked" /> All</label><br/>
   <label><input type="radio" id="laplace" onchange="update(this.id);" /> Laplace</label><br/>
   <label><input type="radio" id="elasticity" onchange="update(this.id);" /> Elasticity</label><br/>
   <label><input type="radio" id="maxwell" onchange="update(this.id);" /> Definite Maxwell</label><br/>
   <label><input type="radio" id="graddiv" onchange="update(this.id);" /> grad-div</label><br/>
   <label><input type="radio" id="darcy" onchange="update(this.id);" /> Darcy</label><br/>
   <label><input type="radio" id="advection" onchange="update(this.id);" /> Advection</label><br/>
</td>
<td>
   **Finite Elements**

   <label><input type="radio" id="all2" onchange="update(this.id);" checked="checked" /> All</label><br/>
   <label><input type="radio" id="l2" onchange="update(this.id);" /> $L_2$ discontinuous elements</label><br/>
   <label><input type="radio" id="h1" onchange="update(this.id);" /> $H^1$ nodal elements</label><br/>
   <label><input type="radio" id="hcurl" onchange="update(this.id);" /> $H(curl)$ Nedelec elements</label><br/>
   <label><input type="radio" id="hdiv" onchange="update(this.id);" /> $H(div)$ Raviart-Thomas elements</label><br/>
   <label><input type="radio" id="h12" onchange="update(this.id);" /> $H^{-1/2}$ interfacial elements</label><br/>
</td>
</tr>
<tr>
<td>
   **Discretization**

   <label><input type="radio" id="all3" onchange="update(this.id);" checked="checked" /> All</label><br/>
   <label><input type="radio" id="galerkin" onchange="update(this.id);" /> Galerkin FEM</label><br/>
   <label><input type="radio" id="mixed" onchange="update(this.id);" /> Mixed FEM</label><br/>
   <label><input type="radio" id="dg" onchange="update(this.id);" /> Discontinuous Galerkin (DG)</label><br/>
   <label><input type="radio" id="dpg" onchange="update(this.id);" /> Discontinuous Petrov-Galerkin (DPG)</label><br/>
   <label><input type="radio" id="nurbs" onchange="update(this.id);" /> Isogeometric analysis (NURBS)</label><br/>
   <label><input type="radio" id="amr" onchange="update(this.id);" /> Adaptive mesh refinement (AMR)</label><br/>
</td>
<td>
   **Solver**

   <label><input type="radio" id="all4" onchange="update(this.id);" checked="checked" /> All</label><br/>
   <label><input type="radio" id="jacobi" onchange="update(this.id);" /> Jacobi</label> <br/>
   <label><input type="radio" id="gs" onchange="update(this.id);" /> Gauss-Seidel</label> <br/>
   <label><input type="radio" id="pcg" onchange="update(this.id);" /> PCG</label> <br/>
   <label><input type="radio" id="minres" onchange="update(this.id);" /> MINRES</label> <br/>
   <label><input type="radio" id="amg" onchange="update(this.id);" /> Algebraic Multigrid (BoomerAMG)</label> <br/>
   <label><input type="radio" id="ams" onchange="update(this.id);" /> Auxiliary-space Maxwell Solver (AMS)</label> <br/>
   <label><input type="radio" id="ads" onchange="update(this.id);" /> Auxiliary-space Divergence Solver (ADS)</label> <br/>
   <label><input type="radio" id="umfpack" onchange="update(this.id);" /> UMFPACK (serial direct)</label><br/>
   <label><input type="radio" id="newton" onchange="update(this.id);" /> Newton method (nonlinear solver)</label><br/>
   <label><input type="radio" id="rk" onchange="update(this.id);" /> Explicit Runge-Kutta (ODE integration)</label><br/>
   <label><input type="radio" id="sdirk" onchange="update(this.id);" /> Implicit Runge-Kutta (ODE integration)</label><br/>
</td>
</tr>
</table>

<!-- ------------------------------------------------------------------------- -->
<div id="ex1" markdown="1">
<hr style="clear:both;"/><img src="../img/ex1.png" style="float:right;">

##Example 1: Laplace Problem

This example code demonstrates the use of MFEM to define a
simple isoparametric finite element discretization of the
Laplace problem $$-\Delta u = 1$$ with homogeneous Dirichlet
boundary conditions. Specifically, we discretize with the
FE space coming from the mesh (linear by default, quadratic
for quadratic curvilinear mesh, NURBS for NURBS mesh, etc.)

The example highlights the use of mesh refinement, finite
element grid functions, as well as linear and bilinear forms
corresponding to the left-hand side and right-hand side of the
discrete linear system. We also cover the explicit elimination
of boundary conditions on all boundary edges, and the optional
connection to the [GLVis](http://glvis.org) tool for visualization.

_The example has a serial ([ex1.cpp](https://github.com/mfem/mfem/blob/master/examples/ex1.cpp))
and a parallel ([ex1p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex1p.cpp)) version._

</div>

<!-- ------------------------------------------------------------------------- -->
<div id="ex2" markdown="1">
<hr style="clear:both;"/><img src="../img/ex2.png" style="float:right;">

##Example 2: Linear Elasticity

This example code solves a simple linear elasticity problem
describing a multi-material cantilever beam.
Specifically, we approximate the weak form of
$$-{\rm div}({\sigma}({\bf u})) = 0$$
where
$${\sigma}({\bf u}) = \lambda\, {\rm div}({\bf u})\,I + \mu\,(\nabla{\bf u} + \nabla{\bf u}^T)$$
is the stress tensor corresponding to displacement field ${\bf u}$, and $\lambda$ and $\mu$
are the material Lame constants. The boundary conditions are
${\bf u}=0$ on the fixed part of the boundary with attribute 1, and
${\sigma}({\bf u})\cdot n = f$ on the remainder with $f$ being
a constant pull down vector on boundary elements with attribute 2, and zero
otherwise. The geometry of the domain is assumed to be as follows:

<img src="../img/ex2-domain.png">

The example demonstrates the use of high-order and NURBS vector
finite element spaces with the linear elasticity bilinear form,
meshes with curved elements, and the definition of piece-wise
constant and vector coefficient objects.

_The example has a serial ([ex2.cpp](https://github.com/mfem/mfem/blob/master/examples/ex2.cpp)) 
and a parallel ([ex2p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex2p.cpp)) version.
We recommend viewing Example 1 before viewing this example._
</div>

<!-- ------------------------------------------------------------------------- -->
<div id="ex3" markdown="1">
<hr style="clear:both;"/><img src="../img/ex3.png" style="float:right;">

##Example 3: Definite Maxwell Problem

This example code solves a simple 3D electromagnetic diffusion
problem corresponding to the second order definite Maxwell
equation $${\rm curl\, curl}\, E + E = f$$
with boundary condition $ E \times n $ = "given tangential field".
Here, we use a given exact solution $E$ and compute the corresponding r.h.s.
$f$. We discretize with Nedelec finite elements.

The example demonstrates the use of $H(curl)$ finite element
spaces with the curl-curl and the (vector finite element) mass
bilinear form, as well as the computation of discretization
error when the exact solution is known.

_The example has a serial ([ex3.cpp](https://github.com/mfem/mfem/blob/master/examples/ex3.cpp))
and a parallel ([ex3p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex3p.cpp)) version.
We recommend viewing examples 1-2 before viewing this example._
</div>

<!-- ------------------------------------------------------------------------- -->
<div id="ex4" markdown="1">
<hr style="clear:both;"/><img src="../img/ex4.png" style="float:right;">

##Example 4: grad-div Problem

This example code solves a simple 2D/3D $H(div)$
diffusion problem corresponding to the second order definite equation
$$-{\rm grad}(\alpha\,{\rm div}(F)) + \beta F = f$$
with boundary condition $F \cdot n$ = "given normal field".
Here we use a given exact solution $F$ and compute the corresponding 
right hand side $f$.  We discretize with the Raviart-Thomas finite elements.

The example demonstrates the use of $H(div)$
finite element spaces with the grad-div and $H(div)$
vector finite element mass bilinear form, as well as the computation of discretization
error when the exact solution is known.

_The example has a serial ([ex4.cpp](https://github.com/mfem/mfem/blob/master/examples/ex4.cpp))
and a parallel ([ex4p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex4p.cpp)) version.
We recommend viewing examples 1-3 before viewing this example._
</div>

<!-- ------------------------------------------------------------------------- -->
<div id="ex5" markdown="1">
<hr style="clear:both;"/><img src="../img/ex5.png" style="float:right;">

##Example 5: Darcy Problem

This example code solves a simple 2D/3D mixed Darcy problem
corresponding to the saddle point system
$$ \begin{array}{rcl}
   k\,{\bf u} + {\rm grad}\,p &=& f \\\\
   -{\rm div}\,{\bf u} &=& g
\end{array} $$
with natural boundary condition $-p = $ "given pressure".
Here we use a given exact solution $({\bf u},p)$ and compute the
corresponding right hand side $(f, g)$. We discretize with Raviart-Thomas
finite elements (velocity $\bf u$) and piecewise discontinuous
polynomials (pressure $p$).

The example demonstrates the use of the BlockMatrix and BlockOperator
classes, as well as the collective saving of several grid functions in
a [VisIt](http://visit.llnl.gov) visualization format.

_The example has a serial ([ex5.cpp](https://github.com/mfem/mfem/blob/master/examples/ex5.cpp))
and a parallel ([ex5p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex5p.cpp)) version.
We recommend viewing examples 1-4 before viewing this example._
</div>

<!-- ------------------------------------------------------------------------- -->
<div id="ex6" markdown="1">
<hr style="clear:both;"/><img src="../img/ex6.png" style="float:right;">

##Example 6: Laplace Problem with AMR

This is a version of Example 1 with a simple adaptive mesh
refinement loop. The problem being solved is again the Laplace
equation $$-\Delta u = 1$$ with homogeneous Dirichlet boundary
conditions. The problem is solved on a sequence of meshes which
are locally refined in a conforming (triangles, tetrahedrons)
or non-conforming (quadrilateral, hexahedrons) manner according
to a simple ZZ error estimator.

The example demonstrates MFEM's capability to work with both
conforming and nonconforming refinements, in 2D and 3D, on
linear, curved and surface meshes. Interpolation of functions
from coarse to fine meshes, as well as persistent [GLVis](http://glvis.org)
visualization are also illustrated.

_The example currently has only a serial version ([ex6.cpp](https://github.com/mfem/mfem/blob/master/examples/ex6.cpp)).
We recommend viewing Example 1 before viewing this example._
</div>

<!-- ------------------------------------------------------------------------- -->
<div id="ex7" markdown="1">
<hr style="clear:both;"/><img src="../img/ex7.png" style="float:right;">

##Example 7: Surface Meshes

This example code demonstrates the use of MFEM to define a
triangulation of a unit sphere and a simple isoparametric
finite element discretization of the Laplace problem with mass
term, $$-\Delta u + u = f.$$

The example highlights mesh generation, the use of mesh
refinement, high-order meshes and finite elements, as well as
surface-based linear and bilinear forms corresponding to the
left-hand side and right-hand side of the discrete linear
system.

_The example has a serial ([ex7.cpp](https://github.com/mfem/mfem/blob/master/examples/ex7.cpp))
and a parallel ([ex7p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex7p.cpp)) version.
We recommend viewing Example 1 before viewing this example._
</div>

<!-- ------------------------------------------------------------------------- -->
<div id="ex8" markdown="1">
<hr style="clear:both;"/><img src="../img/ex8.png" style="float:right;">

##Example 8: DPG for the Laplace Problem

This example code demonstrates the use of the Discontinuous
Petrov-Galerkin (DPG) method in its primal 2x2 block form as a
simple finite element discretization of the Laplace problem
$$-\Delta u = f$$ with homogeneous Dirichlet boundary conditions. We
use high-order continuous trial space, a high-order interfacial
(trace) space, and a high-order discontinuous test space
defining a local dual ($H^{-1}$) norm.

The example highlights the use of interfacial (trace) finite
elements and spaces, trace face integrators and the definition
of block operators and preconditioners.

_The example has a serial ([ex8.cpp](https://github.com/mfem/mfem/blob/master/examples/ex8.cpp))
and a parallel ([ex8p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex8p.cpp)) version.
We recommend viewing examples 1-5 before viewing this example._
</div>

<!-- ------------------------------------------------------------------------- -->
<div id="ex9" markdown="1">
<hr style="clear:both;"/><img src="../img/ex9.png" style="float:right;">

##Example 9: DG Advection

This example code solves the time-dependent advection equation
$$\frac{du}{dt} = v \cdot \nabla u,$$ where $v$ is a given fluid
velocity, and $u_0(x)=u(0,x)$ is a given initial condition.

The example demonstrates the use of Discontinuous Galerkin (DG) bilinear forms
in MFEM (face integrators), the use of explicit ODE time integrators, the
definition of periodic boundary conditions through periodic meshes, as well as
the use of [GLVis](http://glvis.org) for persistent
visualization of a time-evolving solution. The saving of time-dependent data
files for external visualization with [VisIt](http://visit.llnl.gov)
is also illustrated.

_The example has a serial ([ex9.cpp](https://github.com/mfem/mfem/blob/master/examples/ex9.cpp))
and a parallel ([ex9p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex9p.cpp)) version._
</div>

<!-- ------------------------------------------------------------------------- -->
<div id="ex10" markdown="1">
<hr style="clear:both;"/><img src="../img/ex10.png" style="float:right;">

##Example 10: Nonlinear Elasticity

This examples solves a time dependent nonlinear elasticity problem of the form
$$ \frac{dv}{dt} = H(x) + S v\,,\qquad \frac{dx}{dt} = v\,, $$
where $H$ is a hyperelastic model and $S$ is a viscosity operator of
Laplacian type. The geometry of the domain is assumed to be as follows:

<img src="../img/ex10-domain.png">

The example demonstrates the use of nonlinear operators, as well as their
implicit time integration using a Newton method for solving an associated
reduced backward-Euler type nonlinear equation. Each Newton step requires the
inversion of a Jacobian matrix, which is done through a (preconditioned) inner
solver.

_The example has a serial ([ex10.cpp](https://github.com/mfem/mfem/blob/master/examples/ex10.cpp))
and a parallel ([ex10p.cpp](https://github.com/mfem/mfem/blob/master/examples/ex10p.cpp)) version.
We recommend viewing examples 2 and 9 before viewing this example._
</div>

<!-- ------------------------------------------------------------------------- -->
<div id="nomatch"><hr>
<br/><br/><br/>
<center>
No examples match your criteria.
</center>
<br/><br/><br/>
</div>

<hr>
<br/>

<div style="clear:both;"/></div>
<script type="text/javascript"><!--
function isChecked(id)
{
    return document.getElementById(id).checked;
}

function setChecked(id, value)
{
    document.getElementById(id).checked = value;
}

function showElement(id, show)
{
    //document.getElementById(id).style.display = show ? "block" : "none";

    // workaround because Doxygen splits and duplicates the divs for some reason
    var divs = document.getElementsByTagName("div");
    for (i = 0; i < divs.length; i++)
        if (divs.item(i).id == id)
            divs.item(i).style.display = show ? "block" : "none";
}

function updateGroup(names, id)
{
   // make only one box checked in the group
   if (names.indexOf(id) != -1)
      for (i = 0; i < names.length; ++i)
         setChecked(names[i], id == names[i]);

   // generate boolean variables from the group names
   for (i = 0; i < names.length; ++i)
      this[names[i]] = isChecked(names[i]) || isChecked(names[0]);
}

function elementVisible(id)
{
   var elem = document.getElementById(id);
   return elem != null && elem.style.display != "none";
}

function exampleVisible(num)
{
   return elementVisible("ex"+num);// || elementVisible("ex"+num+"p");
}

function update(id)
{
   var group1 = ["all1", "laplace", "elasticity", "maxwell", "graddiv", "darcy", "advection"];
   var group2 = ["all2", "l2", "h1", "hcurl", "hdiv", "h12"];
   var group3 = ["all3", "galerkin", "mixed", "dg", "dpg", "nurbs", "amr" ];
   var group4 = ["all4", "jacobi", "gs", "pcg", "minres", "amg", "ams", "ads", "umfpack", "newton", "rk", "sdirk"];

   updateGroup(group1, id);
   updateGroup(group2, id);
   updateGroup(group3, id);
   updateGroup(group4, id);

   showElement("ex1",  laplace && h1 && (galerkin || nurbs) && (gs || pcg || umfpack || amg));
   showElement("ex2",  elasticity && h1 && (galerkin || nurbs) && (gs || pcg || umfpack || amg));
   showElement("ex3",  maxwell && hcurl && galerkin && (gs || pcg || umfpack || ams));
   showElement("ex4",  graddiv && hdiv && galerkin && (gs || pcg || umfpack || ads || ams));
   showElement("ex5",  darcy && (l2 || hdiv) && mixed && (gs || jacobi || minres || umfpack || amg ));
   showElement("ex6",  laplace && h1 && (galerkin || nurbs || amr) && (gs || pcg || umfpack));
   showElement("ex7",  laplace && h1 && galerkin && (gs || pcg || umfpack || amg));
   showElement("ex8",  laplace && (l2 || h1 || h12) && dpg && (gs || pcg || umfpack || amg));
   showElement("ex9",  advection && l2 && dg && (pcg || rk));
   showElement("ex10", elasticity && (l2 || h1) && galerkin && (jacobi || pcg || minres || umfpack || newton || rk || sdirk));

   // NOTE: update 'numExamples' below when adding examples!
   var numExamples = 10;
   var allHidden = true;
   for (i = 1; i <= numExamples; i++) {
      if (exampleVisible(i)) {
         allHidden = false;
         break;
      }
   }
   showElement("nomatch", allHidden);
}

function initButtons()
{
   var query = location.search.substr(1);
   query.split("&").forEach(function(id)
   {
      setChecked(id, true);
      update(id);
   });
}

// make sure "no match" div is not visible after page is loaded
window.onload = update;

// force vertical scrollbar
document.getElementsByTagName("body")[0].style = "overflow-y: scroll"

// parse URL part after '?', e.g., http://.../index.html?elasticity&nurbs
initButtons();

//--></script>
