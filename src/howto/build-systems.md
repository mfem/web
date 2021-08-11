# HowTo: Build and test MFEM, syntax for each build-system

MFEM has two build systems:
 - Makefile. We will refer to it as "original Makefile"
 - CMake, an out-of-source build system generator, that will generate a build-system in `Makefile` or another language like `Ninja`.

The most important difference between the two is that CMake being an out-of-source build system, it will require the creation of a build directory, and all commands will be run from there. The original Makefile system will build the code in source from the root directory.

- The original Makefile
```
cd <mfem-root-dir>
make config [...options...]
make all -j 8   # Build everything
make test       # Run the tests
```

- CMake + Makefile (option 1: explicit makefile)
```
cd <mfem-root-dir>
mkdir build
cd build
cmake [...options...] ..   # Note the ".."
make -j 8                  # Build MFEM
make tests -j 8            # Build unit-tests
make examples -j 8         # Build examples
make miniapps -j 8         # Build miniapps
make test                  # Run the tests
```

- CMake + Makefile (option 2: generic build, cmake wrappers)
```
cd <mfem-root-dir>
mkdir build
cd build
cmake [...options...] ..                  # Note the ".."
cmake --build . -j 8                      # Build MFEM
cmake --build . --target tests -j 8       # Build unit-tests
cmake --build . --target examples -j 8    # Build examples
cmake --build . --target miniapps -j 8    # Build miniapps
ctest --output-on-failure -T test         # Run the tests
```

- CMake + Ninja (this is not what we are used to doing, but it works)
```
cd <mfem-root-dir>
mkdir build
cd build
cmake [...options...] -GNinja ..          # Note the ".."
cmake --build . -j 8                      # Build MFEM
cmake --build . --target tests -j 8       # Build unit-tests
cmake --build . --target examples -j 8    # Build examples
cmake --build . --target miniapps -j 8    # Build miniapps
ctest --output-on-failure -T test         # Run the tests
```
