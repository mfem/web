# HowTo: Use Spack to install MFEM.

MFEM can be built with `make` or using `CMake`. But MFEM has also been packaged to be built with `Spack`.

## What does it mean to use Spack, and why using it.

### Packaging V.S. Build-System.

In concrete terms, packaging with Spack here means that:

* Spack will interface with the build system: no make or CMake command required.
* Build options are specified as "variants". There may no be a variant for every options or combination of options allowed by building from source "manually".
* Spack will also installed the dependencies, which may also be activated using "variants".

_(Note that so far, the MFEM Spack package interfaces with MFEM makefile build system, not CMake.)_

The first takeaway is that using Spack may not allow as much configuration as possible manually but will manage the installation of dependencies.

### Why using Spack, why not using it.

Spack is a *from source* package manager. So Spack will allow you to build mfem from source using the underlying makefile build system.

#### To manage your libraries for development.

Spack is typically used to deploy software. You may use it to install MFEM among other libraries in a shared location for developers using MFEM as a dependency: all will have access to the same configuration and you will be able to reproduce this installation at will.

But you will be limited to a predefined set of versions. Typically the releases and the latest state of `master` branch. In that sense Spack is not meant to be use to develop in MFEM *a priori*.

_(For those looking to use Spack to develop in MFEM, see [Spack workflow feature](https://spack-tutorial.readthedocs.io/en/latest/tutorial_developer_workflows.html)_

#### To install dependencies automatically.

Spack will automatically build the dependencies, which can be especially valuable to get started quickly with an advanced configuration of MFEM.

This is a great way to get students started quickly with a configuration that would require much too many steps otherwise.

#### To reproduce a vetted configuration.

Spack is used in Gitlab CI context to automate the build on dependencies, easily update those, and improve reproducibility.

For more details about this, explore [MFEM Uberenv configuration](https://github.com/mfem/mfem-uberenv), and the documentation mentioned in the README.


## How to use Spack to install MFEM.

Using Spack is easy to start with, complex when it comes to getting exactly what you want, and can be tedious to maintain on the long term.

### Best practices for a long-term sane reliationship with Spack.

Unless you want to develop in Spack, those rules will help keeping things under control:

* Use a single Spack instance. Spack has `environments` that mimic the way python environment work to allow you to partition things so that not all the packages installed show up in a big mess.
* Stick to a release of Spack. Packages evolve along with Spack source code. It means that updating Spack will likely affect reproducing the build of specs already installed. Expect to reinstall everything when you update Spack.

### Using Spack to install MFEM on lassen and quartz.

Those machines are used to test MFEM. The tests running in Gitlab CI use Spack to manage MFEM dependencies. The configuration used for those tests can be reproduced exactly. This guarantees to get a working installation through Spack.

Unfortunately, only a handful of configurations are being tested. But this is a good starting point to explore further. See [MFEM Uberenv configuration](https://github.com/mfem/mfem-uberenv) for more details.
