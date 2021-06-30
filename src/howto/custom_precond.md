# HowTo:  Create a custom preconditoner using only matrix actions

For many problems of interest the off the shelf preconditioners are insufficient and 
something more taylored to the equations of interest is required.  MFEM has a flexible 
approach to defining preconditioners enabled by deriving from the existing Solver
class and overridding the necessesary methods to define the action.  Se the following
example:


```
// Define a custom solver class that can be used as the preconditioner for a broader problem solvers
// Here we will define the example preconditioner:  P x = M x + Ainv x
class SumSolver : mfem::Solver
{
  private:
    const mfem::Operator *M;		//Since these are Operators only their
    const mfem::Operator *Ainv;		//actions need to be defined

  public:
    SumSolver(const mfem::Operator *M_, const mfem::Operator *Ainv_)
      : mfem::Solver(M_->Height(), M_->Width(), false)
      {
        MFEM_VERIFY(M_->Height() == Ainv_->Height());
        MFEM_VERIFY(M_->Width() == Ainv_->Width());
        M = M_;
        Ainv = Ainv_;
      };

    // Define the action of the Solver
    // y = P x =  M x + Ainv x
    void Mult(const mfem::Vector &x, mfem::Vector &y) const
    {
      y = 0.0;
      mfem::Vector M_x(M->Height());
      mfem::Vector Ainv_x(Ainv->Height());
      M->Mult(x, M_x);			// M_x = A x
      Ainv->Mult(x, Ainv_x);	// Ainv_x = Ainv x
      y.Add(1.0, M_x);			// y += M_x
      y.Add(1.0, Ainv_x);		// y += Ainv_x
    };

    void SetOperator(const Operator &op) { M = &op;};
};

```

In this example we defined a new MFEM solver that can be applies as a preconditioner for a broader
solution.  In this case we demonstrated an example where we have a matrix M, the action of the inverse 
of a matrix A, and we want to define the action of a preconditioner that is the sum of the two.  In this 
case we cannot simply sum the matrices to form the new preconditioner because we no access to the elements
of Ainv.  As you can see this approach is quite flexible and can be utilized to create custom preconditioners
of arbitrary complexity.