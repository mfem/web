# Electromagnetics Mini Applications

$\newcommand{\A}{\vec{A}}\newcommand{\B}{\vec{B}}
\newcommand{\D}{\vec{D}}\newcommand{\E}{\vec{E}}
\newcommand{\H}{\vec{H}}\newcommand{\J}{\vec{J}}
\newcommand{\M}{\vec{M}}\newcommand{\P}{\vec{P}}
\newcommand{\dd}[2]{\frac{\partial #1}{\partial #2}}
\newcommand{\cross}{\times}\newcommand{\inner}{\cdot}
\newcommand{\div}{\nabla\cdot}\newcommand{\curl}{\nabla\times}
\newcommand{\grad}{\nabla}$

## Electromagnetics

The equations describing electromagnetic phenomena are know
collectively as the Maxwell Equations. They are usually given as:

  $$\begin{align}
    \curl\H - \dd{\D}{t} & = \J    \label{ampere}  \\\\
    \curl\E + \dd{\B}{t} & = 0     \label{faraday} \\\\
                  \div\D & = \rho  \label{gauss}   \\\\
                  \div\B & = 0     \label{divb}
  \end{align}$$

Where equation \eqref{ampere} can be referred to as *Ampére's Law*,
equation \eqref{faraday} is called *Faraday's Law*,
equation \eqref{gauss} is *Gauss's Law*,
and equation \eqref{divb} doesn't generally have a name but is related
to the nonexistence of magnetic monopoles.
The various fields in these equations are:

  Symbol | Name                  | SI Units
 --------|-----------------------|-------------------
  $\H$   | magnetic field        | Ampere/meter
  $\B$   | magnetic flux density | Tesla
  $\E$   | electric field        | Volts/meter
  $\D$   | electric displacement | Coulomb/meter$^2$
  $\J$   | current density       | Ampere/meter$^2$
  $\rho$ | charge density        | Coulomb/meter$^3$

In the literature these names do vary, particularly those for
$\H$ and $\B$, but in this document we will try to adhere to
the convention laid out above.

Generally we also need constitutive relations between $\E$ and $\D$
and/or between $\H$ and $\B$. These relations start with the definitions:

  $$\begin{align}
    \D & = \epsilon_0\E + \P   \\\\
    \B & = \mu_0\H + \M
  \end{align}$$

Where $\P$ is the *polarization density*, and $\M$ is the *magnetization*.
Also, $\epsilon_0$ is the *permittivity of free space* and $\mu_0$ is the
*permeability of free space* which are both constants of nature.
In many common materials the polarization density can be
approximated as a scalar multiple of the electric field, i.e.,
$\P = \epsilon_0\chi\E$, where $\chi$ is called the *electric susceptibility*.
In such cases we usually use the relation
$\D = \epsilon\E$ with $\epsilon = \epsilon_0(1+\chi)$
and call $\epsilon$ the *permittivity* of the material.

The nature of magnetization is more complicated but we will take a very
simplified view which is valid in many situations.  Specifically, we will
assume that either $\M$ is proportional to $\H$ yielding the relation
$\B = \mu\H$ where $\mu = \mu_0(1+\chi_M)$ and $\chi_M$ is the
*magnetic susceptibility* or that $\M$ is a constant.  The former case
pertains to both diamagnetic and paramagnetic materials
and the later to ferromagnetic materials.

Finally we should note that equations \eqref{ampere} and \eqref{gauss}
can be combined to yield the equation of charge continuity
$\dd{\rho}{t} + \div\J = 0$ which can be important in plasma physics and
magnetohydrodynamics (MHD).


## Static Fields

### Electrostatics

Electrostatic problems come in a variety of subtypes but they all
derive from Gauss's Law and Faraday's Law (equations \eqref{gauss} and
\eqref{faraday}).  When we assume no time variation, Faraday's Law
becomes simply $\curl\E=0$. This suggests that the electric field
can be expressed as the gradient of a scalar field which is
traditionally taken to be $-\varphi$, i.e.

  $$\E = -\grad\varphi  \label{gradphi}$$

where $\varphi$ is called the *electric potential* and has units
of Volts in the SI system.  Inserting this definition into
equation \eqref{gauss} gives:

  $$-\div\epsilon\grad\varphi = \rho  \label{poisson}$$

which is *Poisson's equation* for the electric potential.  Where,
clearly, we have assumed a linear constitutive relation between
$\D$ and $\E$.  If this relation happens to be nonlinear
then Poisson's equation would need to be replaced with a more
complicated nonlinear expression.

The solutions to equation \eqref{poisson} are non unique because they
can be shifted by any additive constant.  This means that we must
apply a Dirichlet boundary condition at least one point in the
problem domain in order to obtain a solution.  Typically this point
will be on the boundary but it need not be so.  Such a Dirichlet value
is equivalent to fixing the voltage (aka potential) at one or more
locations.  Additionally, this equation admits a normal derivative
boundary condition.  This means setting $\hat{n}\cdot\D$ to a
prescribed value on some portion of the boundary.  This is equivalent
to defining a surface charge density on that portion of the boundary.


### Magnetostatics

Magnetostatic problems arise when we assume no time variation in
Ampére's Law (equation \eqref{ampere}) which leads to:

  $$\curl\H = \J  \nonumber$$

In this case we'll assume a somewhat more general constitutive
relation between $\H$ and $\B$:

  $$\B = \mu\H + \M  \nonumber$$

Notice that we use $\mu$ rather than $\mu_0$.  This allows for
paramagnetic and/or diamagnetic materials defined through $\mu$ as
well as ferromagnetic materials represented by $\M$.  This choice
yields:

  $$\curl\mu^{-1} \B = \J + \curl\mu^{-1}\M  \nonumber$$

Of course a nonlinear constitutive relation is possible and would lead
to a rather complicated nonlinear equation for $\B$.

To reach an equation we can solve in the linear case we need to make
use of equation \eqref{divb} which implies that $\B=\curl\A$
for some potential $\A$ which is called the *magnetic vector
potential*. This gives the final form of the equation:

  $$\curl\mu^{-1}\ \curl\A = \J + \curl\mu^{-1}\M  \nonumber$$

Once again the potential is non unique so we must apply Dirichlet
boundary conditions in order to arrive at a solution for $\A$.


### Statics Miniapp

Possible sources:

 * Charge Density $\rho$
 * Current Density $\J$
 * Magnetization $\M$
 * Surface Charge Density $\sigma$
 * Surface Current Density $\vec{K}$

Additional Boundary Conditions:

 * Voltage at least one point
 * Magnetic Vector Potential on some region (restrictions???)
 * Magnetic Scalar Potential at least one point (we may be able to
   choose this for the user)





<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
