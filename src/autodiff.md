# Automatic Differentiation Mini Applications

The code in the `miniapps/autodiff` subdirectory of MFEM provides methods for automatic differentiation (AD) of arbitrary functions implemented in C++, either as lambda functions or functors.  AD consists of a set of techniques to evaluate the derivative of a function implemented as a computer program. AD  does not provide a symbolic form of the derivatives, and AD is not a numerical approximation technique. Instead, the derivatives obtained by AD are exact and exploit the fact that every function implemented on a computer can be represented by a sequence of arithmetic operations and basic functions, i.e., addition, multiplication, `sin`, `cos`, `log`, etc. The derivatives in AD with respect to the input arguments are obtained by applying the chain rule on the recorded sequence of operations. For more theoretical details, the users are referred to [^1].

AD can be implemented on a compiler level by source code transformations or by using some of the features of modern object-oriented languages like operator overloading and templating. Even though several AD implementations on a compiler level exist, they are often utilized for simple functions written in languages like Fortran and C, and developments for general C++ applications are still in their infancy.  The MFEM implementation relies on native and external C++ libraries like CoDiPack [^2].  The users can choose the AD engine during the configuration phase. The choice does not affect the actual utilization of AD  in the code, and it can impact only the performance and memory utilization.

Two distinguished modes, forward and reverse, can be easily identified in software implementations of automatic differentiation.  For a function $f(\mathbf{x}):\mathbb{R}^n \rightarrow\mathbb{R}^m$, forward mode implementations evaluate

\begin{align}
\dot{\mathbf{y}}&=f'\left(\mathbf{x}\right)\dot{\mathbf{x}}, \quad \dot{\mathbf{x}}\in\mathbb{R}^{n\times 1}, \dot{\mathbf{y}}\in\mathbb{R}^{m\times1},
\end{align}

where the vector $\dot{\mathbf{x}}$ is specified by the user. Therefore, to extract the Jacobian $f'\left(\mathbf{x}\right)\dot{\mathbf{x}}$ one has to call the AD procedure $n$ times with n different vectors $\dot{\mathbf{x}}$, where the values of  vector $j=1,\ldots, n$ are defined as $\dot{\mathbf{x}}\_i=\delta_{i,j}$. The Jacobian is extracted column by column.

For a function $f(\mathbf{x}):\mathbb{R}^n \rightarrow\mathbb{R}^m$, reverse mode evaluates

\begin{align}
\bar{\mathbf{x}}^{\sf{T}}&=\bar{\mathbf{y}}^{\sf{T}} f'\left(\mathbf{x}\right), &\bar{\mathbf{x}}\in\mathbb{R}^{n\times 1}, \bar{\mathbf{y}}\in\mathbb{R}^{m\times1},
\end{align}

where $\bar{\mathbf{y}}$ is a vector specified by the user. In contrast to forward mode, the Jacobian, in this case, can be extracted row by row. Thus, for a vector function with a number of arguments smaller than the size of the output, the forward mode will be the preferable one. For a vector function with a number of arguments larger than the size of the output, the reverse mode will be the preferable one. It should be mentioned that reverse mode introduces additional overhead for storing the computational graph in the memory, which might easily fill up the available memory. The interested users are referred to [^3] for detailed comparisons. In MFEM, users can choose between a native implementation using AD in a forward mode and both forward and reverse mode implementation based on CoDiPack [^2]. The native implementation is based on the so-called *dual numbers* briefly described below.

# Dual numbers

In forward mode, the derivative information propagates from the input arguments to the output results. In MFEM, this is achieved with the help of the so-called dual number arithmetic. The native low-level implementation can be found in the header file `fdual.hpp`.  The file implements a large number of basic functions, and if necessary additional basic and more complex functions can be easily added by following the examples.

A dual number  $x+\varepsilon x'$ consists of a primal/real part and a dual part dragging the derivative information. Every real number can be represented as $x+\varepsilon 0 $. The arithmetic is defined with the help of dummy symbol $\varepsilon$ by specifying that $\varepsilon^2=0$. Based on the above, the following set of rules can be easily derived.

- $\left(x+\varepsilon x'\right)+\left(y+\varepsilon y'\right)=\left(x+y\right)+\varepsilon\left(x'+y'\right)$

- $\left(x+\varepsilon x'\right)*\left(y+\varepsilon y'\right)=xy+\varepsilon\left(yx'+xy'\right)$

- $f\left(x+\varepsilon x'\right)=f\left(x\right)+\varepsilon f'\left(x\right)x'$

- $f\left(g \left(x+\varepsilon x'\right) \right)= f\left(g \left(x\right)+\varepsilon g'\left(x\right) x'\right) = f\left(g \left(x \right)\right)+\varepsilon f'\left(g \left(x \right)\right) g'\left(x\right) x'$


# Example of AD differentiated function

The following vector function, defined as lambda expression, has two parameters `kappa` and `load`. The input of the function `uu` is a vector $\left[\partial u/\partial x, \partial u/\partial y,\partial u/\partial z,u \right]^{\sf{T}}$ with 4 components (the last one is not used in the output of the function), and the result is a vector  $\left[\kappa \partial u/\partial x, \kappa \partial u/\partial y, \kappa \partial u/\partial z, -f \right]$  `vres` of size 4.

```c++
//using lambda expression
auto func = [](mfem::Vector& vparam, mfem::ad::ADVectorType& uu, mfem::ad::ADVectorType& vres) {
   auto kappa = vparam[0]; //diffusion coefficient
   auto load = vparam[1]; //volumetric influx

   vres[0] = kappa * uu[0];
   vres[1] = kappa * uu[1];
   vres[2] = kappa * uu[2];
   vres[3] = -load;
};
```
The gradient of `vres` will be a matrix of size 4x4 and is computed with the help of the following object:
```c++
constexpr int output_length = 4;
constexpr int input_length = 4;
constexpr int parameter_length = 2;
mfem::VectorFuncAutoDiff<output_length,input_length,parameter_length> function_derivative(func);
```
The first parameter in the above template specifies the length of the result, the second parameter the length of the input vector `uu`, and the third template parameter specifies the length of `vparam`. Once `function_derivative` is defined, the following statement computes the gradients:
```c++
function_derivative.Jacobian(param,state, grad_mat);
```
The input consists of parameters and a state vector, and the output is 4x4 `grad_mat` matrix. The parameter vector consists of the coefficients $\kappa$ and $f$ (referred to as load in the code).

# Example of AD differentiated function using functors

The following vector function, defined as a functor, has zero parameters. The input of the function `uu` is a vector with 6 components, and the result is a vector `rr` of size 3.

```c++
template<typename TDataType, typename TParamVector, typename TStateVector,
         int residual_size, int state_size, int param_size>
class ExampleResidual
{
public:
    void operator ()(TParamVector& vparam, TStateVector& uu, TStateVector& rr)
    {
        rr[0]=sin(uu[0]+uu[1]+uu[2]);
        rr[1]=cos(uu[1]+uu[2]+uu[3]);
        rr[2]=tan(uu[2]+uu[3]+uu[4]+uu[5]);
    }

};
```

The gradient of `rr` will be a matrix of size 3x6 and is computed with the help of the following object:
```c++
constexpr int output_length = 3;
constexpr int input_length = 6;
constexpr int parameter_length = 0;
mfem::VectorFuncAutoDiff<ExampleResidual,output_length,input_length,parameter_length> erdf;
```

The Jacobian for a vector `uu` is calculated using the following lines:
```c++
mfem::DenseMatrix jac(3,6);
mfem::Vector param; //dummy vector - we do not have parameters
mfem::Vector uu(6); uu=1.0; // all values are set to one
erdf.Jacobian(param,uu,jac);
```
The elements of the state vector `uu` are set to one. In real application they should be set to the actual arguments of the function. The Jacobian is returned in the matrix `jac(3,6)`. The template parameters `output_length`, `input_length`,and `parameter_length` should match the vector function signature.    

It is important to mention that the current AD interface is intended to be used at the integration point level. Thus, all vectors and matrices used as arguments in the functors and the lambda expressions should be serial objects. The provided set of examples, in the mini-app directory, for solving a P-Laplacian problem further exemplifies the intended use of the current implementation.


[^1]: Griewank, A. & Walther, A. Evaluating derivatives: principles and techniques of algorithmic differentiation SIAM, 2008

[^2]: Sagebaum, M.; Albring, T. & Gauger, N. R. High-Performance Derivative Computations Using CoDiPack ACM Trans. Math. Softw., Association for Computing Machinery, 2019, 45

[^3]: Nørgaard, S. A.; Sagebaum, M.; Gauger, N. R. & Lazarov, B. Applications of automatic differentiation in topology optimization Structural and Multidisciplinary Optimization, 2017, 56, 1135-1146

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
