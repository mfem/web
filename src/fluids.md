# Navier-Stokes Mini Application

The solver implemented in this miniapp solves the transient incompressible
Navier-Stokes equations.

## Theory

The equations are given in the non-dimensionalized form

\begin{align}
    \frac{\partial u}{\partial t} + (u \cdot \nabla) u - \frac{1}{Re} \nabla^2 u + \nabla p &= f & \quad \text{in } \Omega\\\\
    \nabla \cdot u &= 0 & \quad \text{in } \Omega
\end{align}

where $Re$ represents the Reynolds number. In order to solve these equations,
the method presented in [TOMBOULIDES] is used, which is based on an equal order
finite element discretization on quadrilateral or hexahedral elements of high
polynomial order. The method describes an implicit-explicit time-integration
scheme for the viscous and convective terms respectively. Introducing the
following notation for the linear term $L(u) = \frac{1}{Re} \nabla u$ and the
nonlinear term $N(u) = -(u \cdot \nabla) u$ and their time-extraploted forms

\begin{align}
    L^\*(u^{n+1}) = \sum_{j=1}^k a_j L(u^{n+1-j}) \\\\
    N^\*(u^{n+1}) = \sum_{j=1}^k a_j N(u^{n+1-j})
\end{align}

where $a_j$ are coefficients from the corresponding explicit time integration
method.

**Note** *The notation is very similar to what is used in the code to make it easy
to follow the theoretical explanation and understand what is done in the
implementation.*

## Boundary Conditions

### Essential (inflow and no-slip walls)

## Solvers and preconditioners

## FAQ

- **You are using the spectral element method, why is the mass matrix not a
vector representing the condensed diagonal?** This is a design choice. It is
possible to use the "numerical integration" option, which produces a diagonal
mass matrix with 1 non zero value per row. This leaves freedom to experiment.

- **Do you support simulations using real parameters?** No, right now you have
 to non-dimensionalize your problem. Not doing this impacts the performance a
 lot.

- **I want to implement turbulence model X, how do I dot that?** This is another
 design choice to make and should be discussed, preferrably in a Github issue.

- **Why doesn't it have adaptive time stepping?** While it is possible and there
exists a branch that works with varying step sizes (variable order/variable step
size IMEX), I have not found a reliable and robust method to determine the step
size (CFL based error estimators are very squishy here or have to use a very
conservative limit).

- **How do I compute steady state solutions with this?** There is no
 acceleration to steady state algorithm implemented right now. Your only option
 is to run the transient case until you reach a steady state criterion. (See
 adaptive time stepping problematic).

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
