tag-fem:
tag-bc:

# Essential Boundary Condition Elimination

When MFEM eliminates degrees of freedom associated with essential
boundary conditions it does not reduce the dimension of the linear
system. It simply alters the associated rows and columns of the linear
system to produce the desired boundary values. Part of this alteration
involves an optional modification of the diagonal entries of the
system matrix. This option is controlled by the `DiagonalPolicy`
enumeration defined in
[linalg/operator.hpp](https://github.com/mfem/mfem/blob/master/linalg/operator.hpp#L47)
with values `DIAG_ZERO`, `DIAG_ONE`, or `DIAG_KEEP` which respectively
replace the diagonal entries with 0, 1, or leaves them unchanged.

In the following sections it will be useful to define a handful of
diagonal matrices which will help illustrate the modification of our
linear system. Each of these matrices is square and shares the
dimension of linear operator $A$ in $A x = b$.

| Symbol | Description |
|--------|-------------|
| $D_0$ | The zero matrix |
| $D_1$ | Matrix with ones on the diagonal entries associates with essential DoFs and zeros elsewhere |
| $D_K$ | Matrix with $A_\{ii}$ on the diagonal entries associates with essential DoFs and zeros elsewhere |
| $C_1$ | Matrix $(I - D_1)$ where $I$ is the identity matrix |

Note that MFEM does actually not form these matrices. They are merely
a useful conceptual tool.

## Standard Linear Systems

To enforce essential boundary conditions $x=x_\{bc}$ on a set of
degrees of freedom when solving the linear system

$$A x = b$$

we modify $A$ and $b$ as follows:

$$\begin{align\*}
A &\rightarrow C_1 A C_1 + D_p \\\\
b &\rightarrow C_1 b - A D_1 x_\{bc} + D_p x_\{bc}
\end{align\*}$$

Where $D_p$ is the appropriate $D$ matrix for the chosen `DiagonalPolicy`.

## Complex-Valued Linear Systems

Complex-valued linear systems are solved as if they were 2x2 block
systems of real-valued operators. There are two equivalent
representations distinguished by the `Convention` enumeration
described in
[linalg/complex_operator.hpp](https://github.com/mfem/mfem/blob/master/linalg/complex_operator.hpp#L71). Both
conventions support elimination of essential boundary conditions.

For our purposes in this document we can ignore the `Convention` by
writing the complex-valued linear system as:

$$(A + i B)(x + i y) = a + i b$$

Where $A$, $B$, $a$, $b$, $x$, and $y$ are all real-valued matrices or vectors.

We can then modify the various pieces as follows:

$$\begin{align\*}
A &\rightarrow C_1 A C_1 + D_p \\\\
B &\rightarrow C_1 B C_1 \\\\
a &\rightarrow C_1 a - A D_1 x_\{bc} + B D_1 y_\{bc} + D_p x_\{bc}\\\\
b &\rightarrow C_1 b - A D_1 y_\{bc} - B D_1 x_\{bc} + D_p y_\{bc}
\end{align\*}$$

These modified operators and vectors can then be placed into the 2x2
block structure according to the chosen `Convention`.

Note that this scheme supports `DiagonalPolicy` equal to `DIAG_ONE` in
the usual sense but `DIAG_KEEP` in the sense that the diagonal entries
of the 2x2 block matrix are kept in place. In other words the diagonal
entries of $A$ are kept but the diagonal entries of $B$ are set to
zero. It should be possible to retain the diagonal entries of both $A$
and $B$ but MFEM does not currently implement this because there was
no clear advantage to justify this more complicated scheme.

Also note that this scheme would support setting boundary conditions
for the real and imaginary parts of the solution at different
locations i.e. on different sets of DoFs. However, MFEM does not
support this in its `SesquilinearForm` and `ParSesquilinearForm`
objects because partial differential equations do not typically, if
ever, define boundary conditions in this manner.

## Block Linear Systems

For a block system:

$$\left(\begin{array}{3}
A_\{11}&A_\{12}&A_\{13}\\\\
A_\{21}&A_\{22}&A_\{23}\\\\
A_\{31}&A_\{32}&A_\{33}
\end{array}\right)
\left(\begin{array}{1}x\\\\y\\\\z\end{array}\right)
=
\left(\begin{array}{1}b_1\\\\b_2\\\\b_3\end{array}\right)
$$
where only two portions of the solution vector, say $x = x_\{bc}$ and
$y = y_\{bc}$, contain an essential boundary condition we can set:

$$\begin{align\*}
A_\{11} \rightarrow & C_1 A_\{11} C_1 + D_p,   \hspace{2ex} &
A_\{12} \rightarrow & C_1 A_\{12} C_1,         \hspace{2ex} &
A_\{13} \rightarrow & C_1 A_\{13}, \\\\
A_\{21} \rightarrow & C_1 A_\{21} C_1,         \hspace{2ex} &
A_\{22} \rightarrow & C_1 A_\{22} C_1 + D_p,   \hspace{2ex} &
A_\{23} \rightarrow & C_1 A_\{23}, \\\\
A_\{31} \rightarrow & A_\{31} C_1,             \hspace{2ex} &
A_\{32} \rightarrow & A_\{32} C_1,             \hspace{2ex} &
A_\{33} \rightarrow & A_\{33}, \\\\
\end{align\*}$$
$$\begin{align\*}
b_1 \rightarrow & C_1 b_1 - A_\{11} D_1 x_\{bc} - A_\{12} D_1 y_\{bc} + D_p x_\{bc}, \\\\
b_2 \rightarrow & C_1 b_2 - A_\{21}D_1 x_\{bc} - A_\{22} D_1 y_\{bc} + D_p y_\{bc}, \\\\
b_3 \rightarrow & b_3 - A_\{31}D_1 x_\{bc}  - A_\{32}D_1 y_\{bc}
\end{align\*}$$

Where again $D_p$ is the appropriate $D$ matrix for the chosen
`DiagonalPolicy`. Also note that diagonal blocks need not have the
same dimensions. In this case different $C$ and $D$ matrices would
need to be applied in the proper locations but the generalization
should be clear.

It should also be clear that this pattern is equivalent to the modifications for the standard linear system where the $C$ and $D$ matrices are replaced by:

$$C_1\rightarrow
\left(
\begin{array}{3}C_1 & 0 & 0\\\\0 & C_1 & 0\\\\0 & 0 & I\end{array}
\right)
\mbox{, }\hspace{2ex}
D_1\rightarrow
\left(
\begin{array}{3}D_1 & 0 & 0\\\\0 & D_1 & 0\\\\0 & 0 & 0\end{array}
\right)
\mbox{,}\hspace{1ex}\mbox{ and }
D_p\rightarrow
\left(
\begin{array}{3}D_p & 0 & 0\\\\0 & D_p & 0\\\\0 & 0 & 0\end{array}
\right)
\nonumber$$

Of course, this can be readily generalized to square block systems of
arbitrary size.

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
