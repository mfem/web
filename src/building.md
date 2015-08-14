# Building MFEM

A simple tutorial how to build and run the serial and parallel version of MFEM together with GLVis. For more details, see the [INSTALL](https://raw.githubusercontent.com/mfem/mfem/master/INSTALL) file and `make help`.

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

That's it! The MFEM library can be found in `mfem-3.0/libmfem.a`, while the `glvis` executable will be in the `glvis-3.0` directory.

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

## Parallel MPI version of MFEM

Download *hypre* and metis from

  - [https://computation.llnl.gov/casc/hypre/software.html](https://computation.llnl.gov/casc/hypre/software.html)
  - [http://glaros.dtc.umn.edu/gkhome/metis/metis/download](http://glaros.dtc.umn.edu/gkhome/metis/metis/download)

Below we assume that we are working with versions 2.10.0b and [4.0.3](http://glaros.dtc.umn.edu/gkhome/fetch/sw/metis/OLD/metis-4.0.3.tar.gz) respectively. We also assume that the serial version of MFEM and GLVis have been built as described above.

Put everything in the same directory:
```sh
~> ls
glvis-3.0/  hypre-2.10.0b.tar.gz   metis-4.0.tar.gz   mfem-3.0/
```

Build hypre:
```sh
~> tar -zxvf hypre-2.10.0b.tar.gz
~> cd hypre-2.10.0b/src/
~/hypre-2.10.0b/src> ./configure --disable-fortran
~/hypre-2.10.0b/src> make -j
~/hypre-2.10.0b/src> cd ../..
```

Build metis:
```sh
~> tar -zxvf metis-4.0.3.tar.gz
~> cd metis-4.0.3
~/metis-4.0.3> make
~/metis-4.0.3> cd ..
~> ln -s metis-4.0.3 metis-4.0
```

Build the parallel version of MFEM:
```sh
~> cd mfem-3.0
~/mfem-3.0> make parallel -j
```

Note that if hypre or metis are in different locations, or you have different versions of these libraries, you will need to update the corresponding paths in the [makefile](https://raw.githubusercontent.com/mfem/mfem/master/makefile) (or create you own [user.mk](https://raw.githubusercontent.com/mfem/mfem/master/config/user.mk.in) file as described in the [INSTALL](https://raw.githubusercontent.com/mfem/mfem/master/INSTALL)).

The parallel examples can be build with:
```sh
~> cd mfem-3.0/examples
~/mfem-3.0/examples> make -j
```

The serial examples can also be build with the parallel version of the library, e.g.
```sh
~/mfem-3.0/examples> make ex1 ex2
```

One can also use the parallel library to optionally (re-)build GLVis:
```sh
~> cd glvis-3.0
~/glvis-3.0> make clean
~/glvis-3.0> make MFEM_DIR=../mfem-3.0 -j
```
