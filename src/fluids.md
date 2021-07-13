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
the method presented in Tomboulides (1997)[^1] is used, which is based on an
equal order finite element discretization on quadrilateral or hexahedral
elements of high polynomial order. The method describes an implicit-explicit
time-integration scheme for the viscous and convective terms respectively.
Introducing the following notation the nonlinear term $N(u) = -(u \cdot \nabla)
u$ and the time-extrapolated form

\begin{align}
    \label{eq:Next}
    N^\*(u^{n}) = \sum_{j=1}^k a_j N(u^{n+1-j})
\end{align}

where $a_j$ are coefficients from the corresponding explicit time integration
method.

Applying a BDF method with coefficients $b_j$ to the initial equation using the
introduced forms yields

\begin{align}
    \sum_{j=0}^k \frac{b_j}{\Delta t} u^{n+1-j} =
    -\nabla p^{n+1} + L(u^{n+1}) + N^\*(u^{n}) + f^{n+1}.
\end{align}

Collecting all known quantities at a given time with

\begin{align}
    F^\*(u^n) = -\sum_{j=1}^k \frac{b_j}{\Delta t} u^{n+1-j}
    + N^\*(u^{n}) + f^{n+1}
\end{align}

the BDF expression reduces to

\begin{align}
    \label{eq:bdf_short}
    \frac{b_0}{\Delta t} u^{n+1} = -\nabla p^{n+1} + L(u^{n+1}) + F^\*(u^n).
\end{align}

To achieve a high order convergence in space the linear term $L(u)$ is replaced
by

\begin{align}
    L_{\times}(u) = \nu \nabla(\nabla \cdot u) - \nu \nabla \times \nabla \times u
\end{align}

which is used to weakly enforce incompressibility by setting the first term to
zero. Like in \eqref{eq:Next} we introduce the time extrapolated term

\begin{align}
    L^\*\_{\times}(u^{n}) = \sum_{j=1}^k a_j L_{\times}(u^{n+1-j}).
\end{align}

To compute the pressure we rearrange \eqref{eq:bdf_short} and take the
divergence on both sides

\begin{align}
    \label{eq:prespois}
    \nabla^2 p^{n+1} = \nabla \cdot (L_{\times}^\*(u^{n}) + F^\*(u^{n})),
\end{align}

which is closed by the Neumann type boundary condition

\begin{align}
    \nabla p^{n+1} \cdot \hat{n} = -\frac{b_0}{\Delta t} u^{n+1} \cdot \hat{n}
    + (L_{\times}^\*(u^{n}) + F^\*(u^{n})) \cdot \hat{n}.
\end{align}

We will refer to this as the pressure Poisson equation in the following. The
last step is a Helmholtz type equation to solve for the implicit (viscous)
velocity part which is also derived from \eqref{eq:bdf_short}. Consider

\begin{align}
    \label{eq:hlm}
    \frac{b_0}{\Delta t} u^{n+1} - L(u^{n+1}) = -\nabla p^{n+1} + F^*(u^{n})
\end{align}

with the Dirichlet (essential type) boundary condition

\begin{align}
    u^{n+1} = g_D^{n+1}.
\end{align}

A detailed walk through can also be found in Franco et al (2020) [^2].

**Note** *The notation is very similar to what is used in the code to make it easy
to follow the theoretical explanation and understand what is done in the
implementation.*

[^1]: A. G. Tomboulides, J. C. Y. Lee & S. A. Orszag (1997) Numerical Simulation
of Low Mach Number Reactive Flows

[^2]: Michael Franco, Jean-Sylvain Camier, Julian Andrej, Will Pazner (2020)
High-order matrix-free incompressible flow solvers with GPU acceleration and
low-order refined preconditioners (https://arxiv.org/abs/1910.03032)

## Boundary Conditions

### Inflow and no-slip walls

For inflow or no-slip wall boundary conditions one should use the method
*NavierSolver::AddVelDirichletBC*. This enforces the value on $u^{n+1}$ in
\eqref{eq:hlm}. It is valid to call this method multiple times on different
boundary attributes of the mesh. The *NavierSolver* instance keeps track of the
associated *Coefficient* and accompanying boundary attribute. The passed
attribute array can be modified, deleted or reused, since a copy is created.

### Pressure outlet

If an outlet of a domain is supposed to represent a pressure outlet (e.g.
zero-pressure), one should use the method *NavierSolver::AddPresDirichletBC*.
This enforces the pressure value $p^{n+1}$ in \eqref{eq:prespois}.

### Zero-stress

This boundary condition is used to represent an outflow attribute. Due to the
nature of the $H^1$ finite-element discretization, the terms arise naturally in
\eqref{eq:prespois} and \eqref{eq:hlm} resulting in

\begin{align}
    \nu \nabla u \cdot \hat{n} - p \mathbb{I} \cdot \hat{n} = 0,
\end{align}

where $\mathbb{I}$ represents the identity tensor.

If there is no other boundary condition applied to a certain attribute, this
boundary condition is applied automatically (not through modification but rather
through the formulation).

## Solvers and preconditioners

The choice of solvers and preconditioners for \eqref{eq:prespois} and
\eqref{eq:hlm} are essential for the performance and robustness of the
simulation.

The pressure Poisson equation \eqref{eq:prespois} is solved using the CG Krylov
method in combination with the low-order refined preconditioning technique
coupled with AMG (c.f. Franco et al (2020)[^2]).

Due to the nature of the explicit time discretization of the nonlinear term, the
method used is CFL (and therefore time step) bound. As a result the time
derivative term in \eqref{eq:hlm} is dominating and a CG Krylov method
preconditioned with Jacobi is sufficient.

Depending on the problem, this results in the majority of time per time step
being spent in the pressure Poisson solve.

At the moment there is no interface to change the default options for the
solvers, but a user can easily modify them in the code itself.

## FAQ

- **You are using the spectral element method, why is the mass matrix not a
vector representing the condensed diagonal?** This is a design choice. It is
possible to use the "numerical integration" option, which produces a diagonal
mass matrix with 1 non zero value per row. This leaves freedom to experiment.

- **Do you support simulations using real parameters?** No, right now you have
 to non-dimensionalize your problem. Not doing this impacts the performance a
 lot.

- **I want to implement turbulence model X, how do I dot that?** This is another
 design choice to make and should be discussed, preferably in a Github issue.

- **Why doesn't it have adaptive time stepping?** While it is possible and there
exists a branch that works with varying step sizes (variable order/variable step
size IMEX), I have not found a reliable and robust method to determine the step
size (CFL based error estimators are very squishy here or have to use a very
conservative limit).

- **How do I compute steady state solutions with this?** There is no
 acceleration to steady state algorithm implemented right now. Your only option
 is to run the transient case until you reach a steady state criterion. (See
 adaptive time stepping FAQ above).

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
