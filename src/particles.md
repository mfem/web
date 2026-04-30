# Particles

MFEM now includes a scalable framework for particle-based discretizations,
and shows its used for a range of applications including tracer particles in
incompressible flow, one-way coupled charged particle motion due to electric and
magnetic fields, and two-way-coupled electrostatic particle-in-cell,
while seamlessly integrating with existing MFEM abstractions such as meshes and
grid functions.

The framework introduces three core particle abstractions:

- [ParticleSet](https://github.com/mfem/mfem/blob/master/fem/particleset.hpp):
user-facing class that manages collections of particles,
including spatial coordinates, fields (e.g., mass, momentum, and energy),
tags (e.g., color and order of time integration),
and globally unique IDs, in both serial and parallel.
- [ParticleVector](https://github.com/mfem/mfem/blob/master/linalg/particlevector.hpp):
derived from `mfem::Vector`, the `ParticleVector` container is used inside the
`ParticleSet` class to store one scalar or vector field for all particles,
with a separate `ParticleVector` for each field.
- [Particle](https://github.com/mfem/mfem/blob/master/fem/particleset.hpp): a
convenience container for holding data associated with a given particle.

Together with [FindPointsGSLIB](https://github.com/mfem/mfem/blob/master/fem/gslib.hpp),
these classes provide the building blocks for particle tracking and
particle-mesh coupling in MFEM.

The key features of the new particle framework are:

- arbitrary number of scalar (e.g., mass) and vector fields (e.g., velocity)
- arbitrary number of integer tags (e.g., color)
- GPU support for all particle data
- globally unique particle IDs for convenient post-processing
- particle migration across MPI ranks with `ParticleSet::Redistribute()`
- coupling with finite element mesh and grid function through `FindPointsGSLIB`
- ParaView visualization through CSV output with `ParticleSet::PrintCSV()`
- GLVis visualization for particle cloud and trajectories with new utilities in
  [miniapps/common/particles_extras.hpp](https://github.com/mfem/mfem/blob/master/miniapps/common/particles_extras.hpp)


Learn more about the framework from the [Particles in MFEM](pdf/workshop25/19_Signorelli_Particles.pdf) ([🎬](https://www.youtube.com/watch?v=oL8ThrRqRVw))
presentation at the [MFEM Community Workshop 2025](https://mfem.org/workshop25/).

Visualized below is a snapshot from a simulation where particles are injected into the
MFEM mesh at random positions and velocities, with perfectly elastic collisions
to model interaction with domain boundaries
[🎬](img/gallery/workshop25/mfem-particles.mp4).
[![](img/gallery/workshop25/mfem-particles.png)](img/gallery/workshop25/mfem-particles.mp4)

## Particle Miniapps

### Lorentz Miniapp

The [**lorentz**](https://github.com/mfem/mfem/blob/master/miniapps/electromagnetics/lorentz.cpp)
miniapp demonstrates one-way coupled charged particle motion due to electric and
magnetic fields using the [Boris algorithm](https://doi.org/10.1063/1.4818428). The input grid funtions are
generated using the
[**volta**](electromagnetics.md#volta-mini-application) and
[**tesla**](electromagnetics.md#tesla-mini-application) miniapps, and
these are subsequently used in `lorentz` with
[**FindPointsGSLIB**](https://mfem.org/howto/findpts/) to move particles.

[![](img/examples/lorentz-small.png)](img/examples/lorentz-full.png)


### Navier Bifurcation Miniapp

The [navier_bifurcation](https://github.com/mfem/mfem/blob/master/miniapps/fluids/navier/navier_bifurcation.cpp)
miniapp demonstrates one-way coupled tracer particles
in incompressible flow.
Particles are injected at the inlet of a 2D bifurcating channel, and
move due to the drag and lift forces exerted on them by the surrounding
fluid [🎬](img/gallery/workshop25/particles.mp4).

[![](img/gallery/workshop25/particles.png)](img/gallery/workshop25/particles.mp4)

### Electrostatic PIC Miniapp

The [electrostatic-pic](https://github.com/mfem/mfem/blob/master/miniapps/plasma/pic/electrostatic-pic.cpp)
miniapp demonstrates two-way coupled Particle-In-Cell simulation
(in 2D or 3D spatial dimensions) with charged particles subject to
electric field forces. At each time step:

1. particles deposit charge to the mesh,
2. a Poisson problem is solved for the electrostatic potential,
3. electric field grid function is computed using the gradient of the potential,
4. the electric field is interpolated at particle locations,
5. particle positions are updated under the effect of electric field.

This loop is repeated for a user specified number of time steps.


### Particles Redistribute Miniapp

The [particles_redist](https://github.com/mfem/mfem/blob/master/miniapps/gslib/particles_redist.cpp)
miniapp is a compact demonstration of parallel particle redistribution.
Particles are initialized randomly over the global mesh on each rank.
Since they may not initially be located on the same rank as the
element overlapping them, particle-mesh coupling becomes communication intensive.
Redistribution with `ParticleSet::Redistribute()` moves each particle to the
rank that owns the overlapping element.
Visualized below is output from one of the sample runs of the `particles_redist` miniapp.

<div style="display: flex; flex-wrap: nowrap; gap: 12px; align-items: flex-start;">
  <div style="text-align: center;">
    <img src="../img/examples/pre-redist.png"
         style="height: 300px; width: auto; max-width: none;">
    <div><small>Initial distribution</small></div>
  </div>
  <div style="text-align: center;">
    <img src="../img/examples/post-redist.png"
         style="height: 300px; width: auto; max-width: none;">
    <div><small>Post redistribute</small></div>
  </div>
  <div style="text-align: center;">
    <img src="../img/examples/redist-legend.png"
         style="height: 300px; width: auto; max-width: none;">
    <div><small>Legend</small></div>
  </div>
</div>


