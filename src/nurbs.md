tag-gettingstarted:

# NURBS Miniapps

These miniapps demonstrate the use of NURBS-based Isogeometric analysis[^1],[^2].

[^1]: T.J.R. Hughes, J.A. Cottrell, Y. Bazilevs: "Isogeometric analysis: CAD, finite elements, NURBS, exact geometry and mesh refinement", Computer Methods in Applied Mechanics and Engineering, Elsevier, 2005, 194 (39-41), pp.4135-4195.

[^2]: T.J.R. Hughes, J.A. Cottrell, Y. Bazilevs: "Isogeometric analysis: toward integration of CAD and FEA", Wiley&Sons 2009

### NURBS Ex 1: Poisson problem

This example code solves a simple Poisson problem
\begin{align}
-\Delta u = 1
\end{align}
 with
homogeneous Dirichlet boundary conditions.
For implementation see [`miniapps/nurbs/nurbs__ex1`](https://docs.mfem.org/html/nurbs__ex1_8cpp_source.html).

### NURBS Ex 3: Maxwell problem

This example code solves a simple 3D electromagnetic diffusion
problem corresponding to the second order definite Maxwell
equation
\begin{align}
\nabla\times\nabla\times\, E + E = f
\end{align}
with boundary condition $ E \times n $ = "given tangential field".
Here, we use a given exact solution $E$ and compute the corresponding r.h.s.
$f$. We discretize with Nedelec finite elements in 2D or 3D.

The example demonstrates the use of $H(curl)$ finite element
spaces with the curl-curl and the (vector finite element) mass
bilinear form, as well as the computation of discretization
error when the exact solution is known. Static condensation is
also illustrated.
For implementation see [`miniapps/nurbs/nurbs__ex1`](https://docs.mfem.org/html/nurbs__ex3_8cpp_source.html).

### NURBS Ex 5: Darcy problem

This example code solves a simple 2D/3D mixed Darcy problem
corresponding to the saddle point system
\begin{align}
\begin{array}{rcl}
   k\,{\bf u} + {\rm grad}\,p &=& f \\\\
   -{\rm div}\,{\bf u} &=& g
\end{array}
\end{align}
with natural boundary condition $-p = $ "given pressure".
Here we use a given exact solution $({\bf u},p)$ and compute the
corresponding right hand side $(f, g)$. We discretize with Raviart-Thomas
finite elements (velocity $\bf u$) and piecewise discontinuous
polynomials (pressure $p$).
For implementation see [`miniapps/nurbs/nurbs__ex5`](https://docs.mfem.org/html/nurbs__ex5_8cpp_source.html).


<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
