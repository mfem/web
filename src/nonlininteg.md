# Nonlinear Form Integrators

$
\newcommand{\cross}{\times}
\newcommand{\inner}{\cdot}
\newcommand{\div}{\nabla\cdot}
\newcommand{\curl}{\nabla\times}
\newcommand{\grad}{\nabla}
\newcommand{\ddx}[1]{\frac\{d#1}\{dx}}
$

Nonlinear form integrators are used to express the local action of a general
nonlinear finite element operator. Depending on the implementation it can also
provide the capability to assemble the local gradient operator or to compute the
local energy.

## Convective acceleration

The `VectorConvectionNLFIntegrator` implements the local action of $(u \cdot
\grad u, v)$, where $u, v \in H_1^d$ for $d = 2, 3$. This term arises e.g. in
the weak form of the Navier-Stokes equations. It also allows to assemble the
local gradient which is represented by the linearization of the local action
around $\delta u$. Using the definition of the Gateaux derivative for functions

\begin{equation}
    F'(u, \delta u) = 
    \lim_{\epsilon \to \infty} \frac{F(u + \epsilon \delta u) - F(u)}{\epsilon}
\end{equation}

with $F(u) = u \cdot \grad u$, we arrive at

\begin{equation}
    F'(u, \delta u) = u \cdot \grad \delta u + \delta u \cdot \grad u.
\end{equation}

The local gradient $(F'(u, \delta u), v)$ can be computed by calling the
`GetGradient` method of `NonlinearForm`.

## Hyperelasticity

## TMOP integrator for variational minimization

The `TMOP_Integrator` is used for mesh optimization by node movement.
It represents the nonlinear objective function that arises in the Target-Matrix
Optimization Paradigm (TMOP), as described in
[this publication](https://epubs.siam.org/doi/abs/10.1137/18M1167206).
The local action and gradient, for an element $E_p$ in physical space, of the
integrator compute

\begin{equation}
  F(x) = \int_{E_t} \frac{\partial \mu(J_{pt})}{\partial x} ~ d x_t \,,
  \quad
  \partial F(x) =
    \int_{E_t} \frac{\partial^2 \mu(J_{pt})}{\partial{x^2}} ~ d x_t \,,
\end{equation}

where $x$ is the vector of positions for the mesh nodes of $E_p$;
$x_t$ are positions in the target element $E_t$, which corresponds to $E_p$
(see class `TargetConstructor`), and
$J_{pt}$ is the Jacobian of the transformation from $E_t$ to $E_p$;
and $\mu$ is a mesh quality metric that is evaluated at quadrature points
(see class `TMOP_QualityMetric`).
The local energy of the integrator represents the integral of $\mu$ over the
target element.


## Treatment of essential boundary conditions

* $F(x) = 0$
* Residual fulfilled on essential dofs
* Therefore residual always zero on those idx

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
