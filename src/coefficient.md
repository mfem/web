# Coefficients

## Scalar Coefficients

| PWConstCoefficient |
| GridFunctionCoefficient |

| Class Name | Formula |
|--|--|
| ConstantCoefficient | $\alpha$ |
| FunctionCoefficient | $f(\vec\{x},t)$ |
| TransformedCoefficient | $T(Q_1(\vec\{x},t))\mbox\{ or }T(Q_1(\vec\{x},t),Q_2(\vec\{x},t))$ |
| DeltaCoefficient  | $s\,w(\vec\{x},t)\,T(t)\,\delta(\vec\{x}-\vec\{x}_c)$ | 
| RestrictedCoefficient | $Q(\vec\{x})\,\forall a\in A, 0\mbox\{ otherwise}$ |  
| SumCoefficient  | $\alpha\,Q_1(\vec\{x}) + \beta\,Q_2(\vec\{x})$ |
| ProductCoefficient  | $Q_1(\vec\{x})\,Q_2(\vec\{x})$ | 
| PowerCoefficient  | $Q^p$ | 
| InnerProductCoefficient | $\vec\{Q}_1\cdot\vec\{Q}_2$ |  
| VectorRotProductCoefficient | $\vec\{Q}_1\times\vec\{Q}_2\mbox\{ in }\mathbb\{R}^2$ |
| DeterminantCoefficient | $\|\overleftrightarrow\{Q}\|$ |
| DivergenceGridFunctionCoefficient | $\nabla\cdot\vec\{u}$ | 


## Vector Coefficients

| Class Name | Formula |
|--|--|
| VectorConstantCoefficient | $\vec\{\alpha}$ |
| VectorFunctionCoefficient  | $\vec\{f}(\vec\{x})$ |
| VectorArrayCoefficient  | $\vec\{Q}_a$ |
| VectorGridFunctionCoefficient  | $\vec\{u}$ |
| GradientGridFunctionCoefficient  | $\nabla u$ |
| CurlGridFunctionCoefficient  | $\nabla\times\vec\{u}$ |
| VectorDeltaCoefficient  | $s\,\vec\{\alpha}\,\delta(\vec\{x}-\vec\{x}_c)$ |
| VectorRestrictedCoefficient  | $\vec\{Q}(\vec\{x})\,\forall a\in A, 0\mbox\{ otherwise}$ |
| VectorSumCoefficient  | $\alpha\,\vec\{Q}_1(\vec\{x}) + \beta\,\vec\{Q}_2(\vec\{x})$ |
| ScalarVectorProductCoefficient  | $Q_1\,\vec\{Q}_2$ |
| VectorCrossProductCoefficient  | $\vec\{Q}_1\times\vec\{Q}_2$ |
| MatVecCoefficient  | $\overleftrightarrow\{Q}_1\cdot\vec\{Q}_2$ |

## Matrix Coefficients

| Class Name | Formula |
|--|--|
| MatrixConstantCoefficient | $\overleftrightarrow\{\alpha}$ |
| MatrixFunctionCoefficient | $\overleftrightarrow\{f}$ |
| MatrixArrayCoefficient | $\overleftrightarrow\{Q}_a$ |
| MatrixRestrictedCoefficient | $\overleftrightarrow\{Q}(\vec\{x})\,\forall a\in A, 0\mbox\{ otherwise}$ |
| IdentityMatrixCoefficient | $\overleftrightarrow\{I}$ |
| MatrixSumCoefficient | $\alpha\,\overleftrightarrow\{Q}_1(\vec\{x}) + \beta\,\overleftrightarrow\{Q}_2(\vec\{x})$ |
| ScalarMatrixProductCoefficient | $Q_1\,\overleftrightarrow\{Q}_2$ |
| TransposeMatrixCoefficient | $\overleftrightarrow\{Q}^T$ |
| InverseMatrixCoefficient | $\overleftrightarrow\{Q}^\{-1}$ |
| OuterProductCoefficient | $\vec\{Q}_1\otimes\vec\{Q}_2$ |

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
