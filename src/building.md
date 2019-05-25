# Building MFEM

A simple tutorial how to build and run the serial and parallel version of MFEM
together with GLVis. For more details, see the
[INSTALL](https://raw.githubusercontent.com/mfem/mfem/master/INSTALL) file and
`make help`.

In addition to the native build system described below, MFEM packages are
also available in the following package managers:

- [Spack](https://github.com/spack/spack)
- [OpenHPC](http://openhpc.community/downloads)
- [Homebrew/Science](https://github.com/Homebrew/homebrew-science) (deprecated)

## Instructions

Download MFEM and GLVis

  - [http://mfem.org](http://mfem.org)
  - [http://glvis.org](http://glvis.org)

Below we assume that we are working with versions 3.0.

## Serial version of MFEM and GLVis

Put everything in the same directory:
```sh
~> ls
glvis-3.0.tgz   mfem-3.0.tgz
```

Build the serial version of MFEM:
```sh
~> tar -zxvf mfem-3.0.tgz
~> cd mfem-3.0
~/mfem-3.0> make serial -j
```

Build GLVis:
```sh
~> tar -zxvf glvis-3.0.tgz
~> cd glvis-3.0
~/glvis-3.0> make MFEM_DIR=../mfem-3.0 -j
```

That's it! The MFEM library can be found in `mfem-3.0/libmfem.a`, while the
`glvis` executable will be in the `glvis-3.0` directory.

To start a GLVis server, open a **new terminal** and type
```sh
~> cd glvis-3.0
~/glvis-3.0> ./glvis
```

The serial examples can be build with:
```sh
~> cd mfem-3.0/examples
~/mfem-3.0/examples> make -j
```

All serial examples and miniapps can be build with:
```sh
~> cd mfem-3.0
~/mfem-3.0> make all -j
```

## Parallel MPI version of MFEM

Download *hypre* and metis from

  - [https://computation.llnl.gov/casc/hypre/software.html](https://computation.llnl.gov/casc/hypre/software.html)
  - [http://glaros.dtc.umn.edu/gkhome/metis/metis/download](http://glaros.dtc.umn.edu/gkhome/metis/metis/download)

Below we assume that we are working with versions 2.16.0 and
[4.0.3](http://glaros.dtc.umn.edu/gkhome/fetch/sw/metis/OLD/metis-4.0.3.tar.gz)
respectively. We also assume that the serial version of MFEM and GLVis have been
built as described above.

Put everything in the same directory:
```sh
~> ls
glvis-3.0/  hypre-2.16.0.tar.gz   metis-4.0.tar.gz   mfem-3.0/
```

Build hypre:
```sh
~> tar -zxvf hypre-2.16.0.tar.gz
~> cd hypre-2.16.0/src/
~/hypre-2.16.0/src> ./configure --disable-fortran
~/hypre-2.16.0/src> make -j
~/hypre-2.16.0/src> cd ../..
~> ln -s hypre-2.16.0 hypre
```

Build metis:
```sh
~> tar -zxvf metis-4.0.3.tar.gz
~> cd metis-4.0.3
~/metis-4.0.3> make
~/metis-4.0.3> cd ..
~> ln -s metis-4.0.3 metis-4.0
```

(If you are using METIS 5, see the instructions
[below](#parallel-build-using-metis-5).)

Build the parallel version of MFEM:
```sh
~> cd mfem-3.0
~/mfem-3.0> make parallel -j
```

Note that if hypre or metis are in different locations, or you have different
versions of these libraries, you will need to update the corresponding paths in
the
[`config/defaults.mk`](https://raw.githubusercontent.com/mfem/mfem/master/config/defaults.mk)
file, or create you own `config/user.mk`, as described in the
[`INSTALL`](https://raw.githubusercontent.com/mfem/mfem/master/INSTALL) file.

The parallel examples can be build with:
```sh
~> cd mfem-3.0/examples
~/mfem-3.0/examples> make -j
```

The serial examples can also be build with the parallel version of the library,
e.g.
```sh
~/mfem-3.0/examples> make ex1 ex2
```

All parallel examples and miniapps can be build with:
```sh
~> cd mfem-3.0
~/mfem-3.0> make all -j
```

One can also use the parallel library to optionally (re-)build GLVis:
```sh
~> cd glvis-3.0
~/glvis-3.0> make clean
~/glvis-3.0> make MFEM_DIR=../mfem-3.0 -j
```
This, however, is generally _not recommended_, since the additional MPI thread
interferes with the other GLVis threads.

### Parallel build using METIS 5

Build METIS 5:
```sh
~> tar zvxf metis-5.1.0.tar.gz
~> cd metis-5.1.0
~/metis-5.1.0> make config ; make
~/metis-5.1.0> ln -s build/Linux-x86_64/libmetis/libmetis.a .
```

Build the parallel version of MFEM, setting the options `MFEM_USE_METIS_5` and
`METIS_DIR`, e.g.:
```sh
~> cd mfem-3.0
~/mfem-3.0> make parallel -j MFEM_USE_METIS_5=YES METIS_DIR=@MFEM_DIR@/../metis-5.1.0
```
