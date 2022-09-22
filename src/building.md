tag-gettingstarted:

# Building MFEM

A simple tutorial how to build and run the serial and parallel version of MFEM
together with GLVis. For more details, see the
[INSTALL](https://raw.githubusercontent.com/mfem/mfem/master/INSTALL) file and
`make help`.

In addition to the native build system described below, MFEM packages are
also available in the following package managers:

- [Spack](https://github.com/spack/spack)
- [OpenHPC](https://openhpc.community/downloads)

MFEM can also be installed as part of

- [xSDK](https://xsdk.info)
- [E4S](https://e4s-project.github.io)
- [FASTMath](https://scidac5-fastmath.lbl.gov)
- [RADIUSS](https://software.llnl.gov/radiuss)
- [CEED](https://ceed.exascaleproject.org/software)

A pre-built version of MFEM is also available in a container form, see our
[AWS tutorial](tutorial/index.md) and the
[mfem/containers](https://github.com/mfem/containers) repo.

## Instructions

Download MFEM and GLVis

  - [https://mfem.org](https://mfem.org)
  - [https://glvis.org](https://glvis.org)

Below we assume that we are working with versions `mfem-4.4` and `glvis-4.2`.

## Serial version of MFEM and GLVis

Put everything in the same directory:
```sh
~> ls
glvis-4.2.tgz   mfem-4.4.tgz
```

Build the serial version of MFEM:
```sh
~> tar -zxvf mfem-4.4.tgz
~> cd mfem-4.4
~/mfem-4.4> make serial -j
~/mfem-4.4> cd ..
```

Build GLVis:
```sh
~> tar -zxvf glvis-4.2.tgz
~> cd glvis-4.2
~/glvis-4.2> make MFEM_DIR=../mfem-4.4 -j
~/glvis-4.2> cd ..
```

That's it! The MFEM library can be found in `mfem-4.4/libmfem.a`, while the
`glvis` executable will be in the `glvis-4.2` directory.

Note: as of version 4.0, GLVis has additional dependencies that need to be installed
first, see its building [documentation](https://glvis.org/building/).

To start a GLVis server, open a **new terminal** and type
```sh
~> cd glvis-4.2
~/glvis-4.2> ./glvis
```

The serial examples can be build with:
```sh
~> cd mfem-4.4/examples
~/mfem-4.4/examples> make -j
```

All serial examples and miniapps can be build with:
```sh
~> cd mfem-4.4
~/mfem-4.4> make all -j
```

## Parallel MPI version of MFEM

Download *hypre* and METIS from

  - [https://github.com/hypre-space/hypre/tags](https://github.com/hypre-space/hypre/tags)
  - [https://github.com/mfem/tpls](https://github.com/mfem/tpls)

Note: We recommend MFEM's mirror of `metis-4.0.3` and `metis-5.1.0` above because the
[METIS webpage](http://glaros.dtc.umn.edu/gkhome/metis/metis/overview),
is often down and we don't support yet the new
[GitHub repo](https://github.com/KarypisLab/METIS).

Below we assume that we are working with `hypre-2.25.0` and [metis-4.0.3](https://github.com/mfem/tpls/raw/gh-pages/metis-4.0.3.tar.gz)
(see [below](#parallel-build-using-metis-5) for METIS version 5 and later). We also assume that the serial version
of MFEM and GLVis have been built as described above.

Put everything in the same directory:
```sh
~> ls
glvis-4.2/  hypre-2.25.0.tar.gz   metis-4.0.3.tar.gz   mfem-4.4/
```

Build hypre:
```sh
~> tar -zxvf hypre-2.25.0.tar.gz
~> cd hypre-2.25.0/src/
~/hypre-2.25.0/src> ./configure --disable-fortran
~/hypre-2.25.0/src> make -j
~/hypre-2.25.0/src> cd ../..
~> ln -s hypre-2.25.0 hypre
```

Build METIS:
```sh
~> tar -zxvf metis-4.0.3.tar.gz
~> cd metis-4.0.3
~/metis-4.0.3> make OPTFLAGS=-Wno-error=implicit-function-declaration
~/metis-4.0.3> cd ..
~> ln -s metis-4.0.3 metis-4.0
```

(If you are using METIS 5, see the instructions
[below](#parallel-build-using-metis-5).)

Build the parallel version of MFEM:
```sh
~> cd mfem-4.4
~/mfem-4.4> make parallel -j
~/mfem-4.4> cd ..
```

Note that if hypre or METIS are in different locations, or you have different
versions of these libraries, you will need to update the corresponding paths in
the
[`config/defaults.mk`](https://raw.githubusercontent.com/mfem/mfem/master/config/defaults.mk)
file, or create you own `config/user.mk`, as described in the
[`INSTALL`](https://raw.githubusercontent.com/mfem/mfem/master/INSTALL) file.

The parallel examples can be build with:
```sh
~> cd mfem-4.4/examples
~/mfem-4.4/examples> make -j
```

The serial examples can also be build with the parallel version of the library,
e.g.
```sh
~/mfem-4.4/examples> make ex1 ex2
```

All parallel examples and miniapps can be build with:
```sh
~> cd mfem-4.4
~/mfem-4.4> make all -j
```

One can also use the parallel library to optionally (re-)build GLVis:
```sh
~> cd glvis-4.2
~/glvis-4.2> make clean
~/glvis-4.2> make MFEM_DIR=../mfem-4.4 -j
```
This, however, is generally _not recommended_, since the additional MPI thread
can interfere with the other GLVis threads.

### Parallel build using METIS 5

Build METIS 5:
```sh
~> tar zvxf metis-5.1.0.tar.gz
~> cd metis-5.1.0
~/metis-5.1.0> make BUILDDIR=lib config
~/metis-5.1.0> make BUILDDIR=lib
~/metis-5.1.0> cp lib/libmetis/libmetis.a lib
```

Build the parallel version of MFEM, setting the options `MFEM_USE_METIS_5` and
`METIS_DIR`, e.g.:
```sh
~> cd mfem-4.4
~/mfem-4.4> make parallel -j MFEM_USE_METIS_5=YES METIS_DIR=@MFEM_DIR@/../metis-5.1.0
```

## CUDA version of MFEM
Build the serial CUDA version of MFEM:
```sh
~/mfem> make cuda -j
```

Build the parallel CUDA version of MFEM:
```sh
~/mfem> make pcuda -j
```

It can be useful to specify the [compute capability](https://developer.nvidia.com/cuda-gpus#compute), with the `CUDA_ARCH` flag, corresponding to your NVidia GPU.
Build the parallel CUDA version of MFEM for `sm_70` (NVidia V100):
```sh
~/mfem> make pcuda CUDA_ARCH=sm_70 -j
```

## HIP version of MFEM
Build the serial HIP version of MFEM:
```sh
~/mfem> make hip -j
```

Build the parallel HIP version of MFEM:
```sh
~/mfem> make phip -j
```

## Installing MFEM with Spack
If Spack is already available on your system and is visible in your `PATH`, you can install the MFEM software simply with:
```sh
spack install mfem
```
To enable package testing during the build process, use instead:
```sh
spack install -v --test=all mfem
```
If you don't have Spack, you can download it and install MFEM with the following commands:
```sh
git clone https://github.com/spack/spack.git
cd spack
./bin/spack install -v mfem
```
