tag-fem:

# Complex-Valued Classes

MFEM represents complex-valued finite element problems using real-valued
building blocks.  A complex quantity $z = z_r + i z_i$ is stored as its real
and imaginary parts, while the complex FEM classes assemble and operate on the
corresponding real block system.  This approach supports the usual MFEM
discretizations, assembly levels, and device memory model for frequency-domain
and other complex-valued problems.

The complete complex API is available through the normal umbrella header:

```c++
#include "mfem.hpp"

using namespace mfem;
```

[Example 22](https://docs.mfem.org/html/ex22_8cpp_source.html) demonstrates a
serial complex-valued harmonic-oscillator problem in $H^1$, $H(\operatorname{curl})$,
and $H(\operatorname{div})$. Its parallel counterpart is Example 22p.

## Scalars and containers

### `complex_t`

`mfem::complex_t` is MFEM's lightweight complex scalar. It has two `real_t`
components and is compatible with host and device kernels. Construct it with a
real component, or with real and imaginary components:

```c++
complex_t z(2.0, -3.0);  // 2 - 3i
complex_t r(4.0);        // 4 + 0i
complex_t zero{};        // value-initialized to 0 + 0i
```

The usual arithmetic operators are available, along with `real`, `imag`,
`abs`, `norm`, `conj`, `exp`, `log`, `pow`, `sqrt`, `sin`, `cos`, and `tan`.
They can be called through `mfem::` or found by unqualified lookup for a
`complex_t` argument.

`complex_t` and `std::complex<real_t>` are different types. MFEM does not
silently convert one to the other, so make the conversion yourself when code
outside MFEM expects `std::complex`:

```c++
complex_t mfem_value(2.0, -3.0);

// Pseudocode: make the conversion at the library boundary.
std::complex<real_t> standard_value(mfem_value.real(), mfem_value.imag());
complex_t value_again(standard_value.real(), standard_value.imag());
```

Also, `complex_t z;` creates a value whose components have not been set yet;
do not read it until assigning to it. Use `complex_t z{};` when the initial
value should be $0 + 0i$.

### `ComplexVector` and `ComplexDenseMatrixData`

`ComplexVector` is a device-aware vector of `complex_t` entries. It follows
the ownership, memory, indexing, and `Read`/`Write` conventions of `Vector`.
It supports element-wise arithmetic and non-conjugating dot products with
complex and real vectors.

```c++
ComplexVector x(3);
x = complex_t{};
x(0) = complex_t(1.0, 2.0);
x(1) = -1.0;

ComplexVector y({complex_t(2.0), complex_t(0.0, 1.0), complex_t(3.0)});
complex_t dot = x * y; // no conjugation is applied
```

The `add` and `subtract` helpers combine `ComplexVector` and `Vector`
arguments, for example `add(alpha, x, beta, y, z)` computes
`z = alpha*x + beta*y`.

`ComplexDenseMatrixData` provides analogous device-aware storage for dense
complex values. It is useful for matrix-valued coefficients and supports
element access and component-wise arithmetic. It is not a `Matrix` or an
`Operator`, so it does not provide matrix-vector products. Use
`ComplexDenseMatrix` when a complex operator made from real and imaginary
`DenseMatrix` blocks is needed.

Both `ComplexVector::real()` / `imag()` and
`ComplexDenseMatrixData::real()` / `imag()` return refreshed cached copies of
the components, not aliases of the complex storage. Do not modify a returned
component expecting the source object to change. When direct host access is
needed after device work, follow the normal MFEM memory rules; for example,
call `HostRead()` on a returned `Vector` before reading its entries.

## Complex coefficients

The complex coefficient hierarchy mirrors MFEM's scalar, vector, and matrix
coefficient interfaces:

| Value | Base class | Common concrete classes |
|---|---|---|
| Scalar | `ComplexCoefficient` | `ComplexConstantCoefficient`, `ComplexFunctionCoefficient` |
| Vector | `ComplexVectorCoefficient` | `ComplexVectorConstantCoefficient`, `ComplexVectorFunctionCoefficient` |
| Matrix | `ComplexMatrixCoefficient` | `ComplexMatrixConstantCoefficient` |

The three base classes are abstract. Derive from one and implement `Eval` to
define a custom spatial or time-dependent complex field. Each base class also
has `real()` and `imag()` methods that expose standard MFEM coefficient views.
This makes a complex coefficient usable wherever the complex FEM classes need
the two real components.

For an existing pair of real-valued coefficients, use the corresponding
`*FromRealImag` wrapper:

```c++
FunctionCoefficient re([](const Vector &x) { return x(0); });
ConstantCoefficient im(1.0);
ComplexCoefficientFromRealImag coefficient(re, im);
```

The wrapped real and imaginary coefficients are not owned. They must remain
alive for as long as the complex wrapper is used. The same lifetime rule
applies to coefficients supplied to complex forms.

For constant or function-defined fields, construct the complex coefficient
directly:

```c++
ComplexConstantCoefficient damping(-omega * omega * epsilon,
                                  omega * sigma);

ComplexFunctionCoefficient source([](const Vector &x)
{
   return complex_t(std::cos(x(0)), std::sin(x(0)));
});
```

`ComplexVectorFunctionCoefficient` receives a `ComplexVector` result to fill;
it can also be scaled by an optional `ComplexCoefficient`. All complex
coefficient types support `SetTime(t)`, and the real and imaginary views track
that time.

## Complex finite element forms and grid functions

`ComplexGridFunction` and `ParComplexGridFunction` represent a complex finite
element field. They provide `real()` and `imag()` grid-function views and can
project scalar or vector complex coefficients, including normal and tangential
boundary coefficients. Their `ComputeL2Error` methods combine the real and
imaginary errors into the complex $L^2$ norm.

Use `ComplexLinearForm` / `ParComplexLinearForm` for complex right-hand sides
and `SesquilinearForm` / `ParSesquilinearForm` for complex bilinear forms.
The templated `Add*Integrator` methods accept both existing real-valued and
new complex-valued coefficients. Specify the existing integrator type
explicitly:

```c++
FiniteElementSpace fespace(&mesh, &fec);
ComplexGridFunction u(&fespace);
ComplexLinearForm b(&fespace);
SesquilinearForm a(&fespace);

ComplexConstantCoefficient mass(-omega * omega * epsilon, omega * sigma);
a.AddDomainIntegrator<MassIntegrator>(mass);

a.Assemble();
OperatorHandle A;
Vector X, B;
a.FormLinearSystem(ess_tdof_list, u, b, A, X, B);
```

The form creates the needed real and imaginary integrators and owns those
integrators. The supplied coefficient itself is not owned, so retain it until
the form no longer needs to assemble or update.

## Block-system conventions

At the linear-algebra boundary, a complex vector is represented by a real
`Vector` with all real entries first and all imaginary entries second. For
$A = A_r + i A_i$, `ComplexOperator` supports two conventions:

| Convention | Real block system | Best suited to |
|---|---|---|
| `ComplexOperator::HERMITIAN` (default) | $\begin\{bmatrix}A_r & -A_i\\\ A_i & A_r\end\{bmatrix}$ | Hermitian operators: symmetric real part and antisymmetric imaginary part |
| `ComplexOperator::BLOCK_SYMMETRIC` | $\begin\{bmatrix}A_r & -A_i\\\ -A_i & -A_r\end\{bmatrix}$ | Problems with symmetric real and imaginary parts, such as damped oscillations |

The block-symmetric convention computes the conjugate of $A x$. Choose the
convention consistently for the forms, operators, preconditioners, and solver
formulation. `ComplexSparseMatrix`, `ComplexDenseMatrix`, and, in parallel,
`ComplexHypreParMatrix` provide operator specializations when access to the
assembled block matrix is needed.

For a complete working setup—including essential boundary conditions,
preconditioning, solving, and GLVis output—see [Example 22](https://docs.mfem.org/html/ex22_8cpp_source.html).

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
