# MFEM device handling
MFEM relies mainly on two features for running algorithms on devices:

- The memory manager handles transparently moving data between host (CPU) and device (GPU for instance),
- `MFEM_FORALL` allows to abstract `for` loops to parallelize transparently on an arbitrary device.

## The memory manager
In order to make as transparent as possible the use of memory on host, or on device, MFEM relies on a memory manager.
Instead of storing a pointer of type `T*`, each object that can be accessed on a device contains `Memory<T>` objects.
The `Memory<T>` objects handle host and device pointers, memory allocations, and data synchronizations between host and device.

To get the pointer `T*` from a `Memory<T>` object, one has to use the `Read()`, `Write()`, or `ReadWrite()` methods.

-  `Read()` returns a `const T*` pointer, and should be used when the data will only be read,
-  `Write()` returns a `T*` pointer, and should be used when writing data **without** using any previously contained data,
-  `ReadWrite()` returns `T*` pointer, and should be used when read and write access to the pointer are required.

`Read()`, `Write()`, and `ReadWrite()` are taking care automatically and completely transparently of data movements between host and device.

The method `void UseDevice(bool)` specifies if a `Memory<T>` object is intended for computation on host or on device.
The `Read()`,`Write()`, and `ReadWrite()` methods will return device pointer if using the device has been set to `true` with `UseDevice`, by default it is `false` and will return a host pointer.

Sometimes, it is necessary to access data on host regardless, in this situation the `HostRead()`, `HostWrite()`, and `HostReadWrite()` methods should be used.

In practice, developers rarely have to manipulate `Memory<T>` objects, instead objects data can be stored using `Vector` and `Array<T>`.
`Vector` and `Array<T>` data pointers can be accessed with the same methods as `Memory<T>`.
```c++
Vector v;
v.UseDevice(true);
const double *device_ptr = v.Read();
const double *host_ptr = v.HostRead();
```

## The MFEM_FORALL macro
The idea behind the `MFEM_FORALL` macro is to have the same behavior as a `for` loop and hide all the specifics to devices.
Example:
```c++
for(int i = 0; i < N; i++)
{
  ...
}
```
becomes
```c++
MFEM_FORALL(i, N,
{
  ...
});
```

The `DeviceTensor<N,T>` class is an `N` dimension array containing elements of type `T`, `T` is `double` by default.
It is convenient to use the `DeviceTensor<N,T>` class in combination with the memory manager and `MFEM_FORALL`.
The `Reshape` function reshapes an array into an `N` dimension array:
```c++
Vector a;
a.UseDevice(true);
const int p = ...;
const int q = ...;
const int r = ...;
const int N = ...;
auto A = Reshape(a.Write(), p, q, r, N); // returns a DeviceTensor<4,double>
MFEM_FORALL(n, N,
{
  for (int k = 0; k < r; k++)
    for (int j = 0; j < q; j++)
      for (int i = 0; i < p; i++)
        A(i,j,k,n) = ...;
});
```
There exists variants of this `MFEM_FORALL` macro, namely `MFEM_FORALL_2D` and `MFEM_FORALL_3D` which help mapping 2D or 3D blocks of threads to the hardware more efficiently.
In the case of a GPU, `MFEM_FORALL_3D(i,N,X,Y,Z,{...})` will declare `N` block of threads each of size `X`x`Y`x`Z` threads, whereas `MFEM_FORALL` uses `N` threads.

In order to exploit 2D or 3D blocks of threads, it is convenient to use the macro `MFEM_FOREACH_THREAD(i,x,p)` to use threads as a `for` loop,
the first variable `i` is the name of the "loop" variable, `x` is the threadId, it can take the values `x`, `y`, or `z`, and `p` is the bound of the loop.
If we rewrite the previous example using `MFEM_FORALL_3D` and `MFEM_FOREACH_THREAD`, we get:
```c++
Vector a;
a.UseDevice(true);
const int p = ...;
const int q = ...;
const int r = ...;
const int N = ...;
auto A = Reshape(a.Write(), p, q, r, N); // returns a DeviceTensor<4,double>
MFEM_FORALL_3D(n, N, p, q, r,
{
  MFEM_FOREACH_THREAD(k,z,r)
    MFEM_FOREACH_THREAD(j,y,q)
      MFEM_FOREACH_THREAD(i,x,p)
        A(i,j,k,n) = ...;
});
```
The reasons for this more complex syntax is to better utilize the hardware, GPUs in particular.
Using `MFEM_FORALL_3D` and `MFEM_FOREACH_THREAD` allows to use more concurrency `NxXxYxZ` threads instead of only `N` threads with `MFEM_FORALL`,
but more importantly the memory accesses on `A(i,j,k,n)` are much better with `MFEM_FORALL_3D`.
With `MFEM_FORALL_3D`, threads access consecutive memory, this is called coalesce memory access.
Because most applied math algorithms are highly memory bound, having coalesce memory accesses is critical to achieve high performance.

# Achieving high performance on GPU
As mentioned above, most applied math algorithms are usually highly [memory bound](https://developer.download.nvidia.com/video/gputechconf/gtc/2019/presentation/s9624-performance-analysis-of-gpu-accelerated-applications-using-the-roofline-model.pdf) on GPU, therefore in order to achieve peak performance one has to maximize the utilization of the different [memory bandwidths](https://stackoverflow.com/questions/37732735/nvprof-option-for-bandwidth).
In particular, the main memory, or device memory, is the memory that has to be maximized in order to achieve peak performance.
It is important to *not* saturate memory bandwidth other than the main memory bandwidth, failing to do so will decrease the main memory throughput by creating memory bandwidth bottlenecks.

Maximizing the main memory bandwidth is achieved by issuing enough memory transactions and using efficiently the data transferred.
The more computationally light a kernel is the more frequently memory transactions are issued, and if there is no memory bandwidth saturated other than the main memory bandwidth, e.g: shared or L1 memory, then the first condition to achieve peak performance is fulfilled.
Memory is transferred by contiguous blocks, called *cache-line*, which are typically the size of 32 `float`, or 16 `double`.
Since each cache-line is a block of contiguous memory it is common to over-fetch data when accessing non-contiguous memory addresses (because not all the data is used in each cache-line).
In the worst case, only one `float` of each cache-line is used resulting in only 1/32 of the data transferred being used, such a kernel is potentially 32 times slower than a kernel that would fully utilize the data in each cache line.
When a kernel is cautiously written to use all the data from each cache-line, the memory access are often referred as coalesce memory access.
Having coalesces memory access kernels is critical to achieving peak performance.

In term of parallelization, when seeing GPUs as having only one level of parallelism over threads, severe constraints are imposed to the kernels in order to achieve high performance.
Each thread is limited to 255 `float` registers, using more registers results in what is known as *register spilling* which significantly impacts performance, this is why this type of parallelization strategy should only be used for the most simple kernels.
Therefore, it is usually a good strategy to see GPUs as having two levels of parallelism: the coarse parallelism level among block of threads, and the fine parallelism level among threads in a block of threads.
Threads in different blocks of threads can only exchange data through the main memory, therefore data exchange between blocks of threads should kept to the absolute minimum.
Threads inside a block of threads can exchange data efficiently by using the [shared memory](http://developer.download.nvidia.com/GTC/PDF/1083_Wang.pdf).
Shared memory can also be used to store data common between threads, but stored data should be carefully managed due to the very limited storage capacity of the shared memory.
Due to their low arithmetic intensity, applied math algorithms often require a significant amount of shared memory bandwidth to exchange information between threads in a block.
High amounts of shared memory bandwidth usage is a common bottleneck to achieve high performance.
In order to be used efficiently, shared memory also requires specific memory access patterns to prevent *bank conflicts*.
When bank conflicts occur, memory access are serialized instead of being parallel.
Each cache line in the shared memory is linearly spread over the shared memory banks, if the threads in a block of threads access different data in the same bank then a bank conflict occurs.
However, if the threads in a block access the same data in a bank, or different data in different banks, then the memory access can occur optimally in parallel.

## Profiling on NVIDIA GPUs
When profiling to improve the performance of a memory bound kernel, I recommend the following steps:

1. Measure the main memory bandwidth and efficiency: this tells us how far from peak throughput we are.

2. Insure that no *register spills* are occurring: most kernels can be written without any register spilling.

3. Measure the shared memory bandwidth and efficiency: try to prevent the shared memory to be the performance bottleneck.

### Optimizing the main memory usage:
The first thing we need to know is how far from peak throughput and how efficiently the main memory is accessed.
For instance, with `nvprof` the following command `nvprof --metrics gld_throughput,gst_throughput,gld_efficiency,gst_efficiency` gives us the desired information.
The sum of the load throughput (`gld_throughput`) and store throughput (`gst_throughput`) should be as close as possible to the main memory maximum bandwidth.
`gld_efficiency` and `gst_efficiency` informs us on ratio of requested global memory load/store throughput to required global memory load/store throughput expressed as percentage.
As mentioned above, efficiency issues are critical to achieve peak performance and are solved by coalescing memory access.

Once we know how far we are from peak throughput, it can be interesting to look at the main stall reasons to give us an idea of what might be slowing down the kernels:
- Instruction Fetch — The next assembly instruction has not yet been fetched.
- Memory Throttle — A large number of pending memory operations prevent further forward progress. These can be reduced by combining several memory transactions into one.
- Memory Dependency — A load/store cannot be made because the required resources are not available or are fully utilized, or too many requests of a given type are outstanding. Memory dependency stalls can potentially be reduced by optimizing memory alignment and access patterns.
- Synchronization — The warp is blocked at a _syncthreads() call.
- Execution Dependency — An input required by the instruction is not yet available. Execution dependency stalls can potentially be reduced by increasing instruction-level parallelism.

You can use `nvprof --metrics` with:
`stall_inst_fetch` for the percentage of stalls occurring because of instruction fetch,
`stall_exec_dependency` for the percentage of stalls occurring because of execution dependency,
`stall_memory_dependency` for the percentage of stalls occurring because a memory dependency,
`stall_memory_throttle` for the	percentage of stalls occurring because of memory throttle,
`stall_sync` for the percentage of stalls occurring because the warp is blocked at a `__syncthreads()` call.

### Optimizing the register usage:
We can know if there is register spilling by two means:

- Compiling for Cuda with `-Xptxas="-v"` tells you at compilation the register usage and spills for each kernel.
- Measuring *local memory transfers* with a profiler tells you if there is register spills. `nvprof --metrics local_load_transactions,local_store_transactions --kernels myKernel` should be `0`.

Register spills happen for two main reasons:

- Each thread uses too many registers,
- Array indices are not known at compilation time.

When each thread uses too many registers it is often useful to redesign the kernel to use more threads per block to perform the computation, this lowers the amount of registers used per thread but usually increases the shared memory usage due to more distributed data.
Computing indices at compilation can often be resolved by simply unrolling loops with `MFEM_UNROLL` and making sure that all the necessary information to compute the indices is known at compilation time.

## Roofline model
A [roofline model](https://developer.download.nvidia.com/video/gputechconf/gtc/2019/presentation/s9624-performance-analysis-of-gpu-accelerated-applications-using-the-roofline-model.pdf) helps predicting the peak performance achievable by a specific algorithm.
The arithmetic intensity is the ratio of the total number of operations divided by the amount of data movement from and to the main memory.
By dividing the maximum FLOPs, by the maximum bandwidth we get an arithmetic intensity threshold value between the two main regime of a GPU.
A kernel with an arithmetic intensity below and above the threshold value will be **memory bound** and **computation bound** respectively.

For in depths performance analysis I would recommend to look at [efficiency issues](https://docs.nvidia.com/gameworks/content/developertools/desktop/analysis/report/cudaexperiments/kernellevel/issueefficiency.htm)

[Here](https://docs.nvidia.com/cuda/profiler-users-guide/index.html#metrics-reference-7x) is the list of all the possible metrics for nvprof.

# Tips-n-tricks

## Compile in debug mode when developing for devices:
The memory manager performs checks that catches most of the missuses of the memory on host or device.
When using device debug, if your code fails you can run gdb or lldb, and set a breakpoint at `b mfem::mfem_error`.
The code will break as soon as it reaches this point and then you can backtrace `bt` from here to see what went wrong and where.

## Forcing synchronization with the host or the device:
It is sometimes needed to force synchronization between host and device data.
In order to make sure that the host data is synchronized one should use `HostRead()`,
similarly to ensure synchronized data on the device one should use `Read()`.

## Do not use `GetData()`:
Do not use `GetData()` to access a pointer for device work since this will always return the host pointer without synchronizing the data with the device.

## Tracking data movements and allocations:
Compiling MFEM with `MFEM_TRACK_CUDA_MEM` can help you see when data is transferred, allocated, etc.
Large amount of data movement between host and device should be avoided at all costs.
Pin point where this is occurring and see if you can’t refactor your code so the data stays mainly on the device.
Avoid allocating GPU memory too frequently, CUDA malloc calls are slow and can hinder performance.
If you really need to allocate frequently GPU memory, consider using a memory pool (e.g. Umpire), that way the mallocs are much cheaper on the GPU.

## The `UseDevice(bool)` function:
It is a good practice to call `UseDevice(true)` on any `Vector` intended to go on device right after constructing it.
```c++
Vector v; v.UseDevice(true);
```
Be aware `UseDevice()` is not the same as `UseDevice(true)`, the first one just returns a boolean that tells you whether the object is intended for computation on the device or not.

## Using `constexpr` inside `MFEM_FORALL`:
```c++
constexpr P = ...; // Result in an error on MSVC
MFEM_FORALL(I,N,
{
  double my_data[P];
});
```
The `MFEM_FORALL` relies on lambda capture, one issue comes up with MSVC is the capture for `constexpr` variables in `MFEM_FORALL`.
In particular according to the standard, `constexpr` variables do not need to be captured, and should not lose their const-ness in a lambda.
However, on MSVC (e.g. in the AppVeyor CI checks), this can result in errors like:

`error C2131: expression did not evaluate to a constant`

A simple fix for this error is to declare the `constexpr` variable as `static constexpr`.
```c++
static constexpr P = ...; // Omitting the static would result in an error on MSVC
MFEM_FORALL(I,N,
{
  double my_data[P];
});
```
Similar problems and workarounds are discussed [here](https://stackoverflow.com/questions/55136414).

## Error: `alias not found`:
This error message indicates that you are trying to move an "alias" `Vector` to gpu while its "base" `Vector` did not have gpu allocation (valid or not) when the alias was created (and may still not have gpu allocation when the move of the "alias" was attempted). This is another case where we cannot update the "base" `Vector` because we do not have access to it, and even if we did, there are other complications.

Therefore, we need to follow this rule:
**if you are creating an "alias" that will be used on device, you need to ensure that the "base" is allocated on device.**

Depending on the context, one can use different methods to do that.
For example, if the "base" is initialized (on host, otherwise there will be no issue) in the same function that will create the alias, one can call `base.Write()` to create the device allocation followed by `base.HostWrite()` and then initialize "base" on host -- this sequence avoids any unnecessary host-device transfers.

Another example: if the "base" was initialized outside of the function where the "alias" is created, then the most appropriate choice probably is to call `base.Read()` before creating the "alias". Since the alias will need the data on device, the incurred host-to-device transfer is (at least partially) necessary anyway.

Ideally, "base" Vectors that will be modified/accessed on device through aliases should be allocated on device to begin with, e.g. using `Vector::SetSize(int s, MemoryType mt)` typically with `mt = Device::GetDeviceMemoryType()`.

## `MakeRef()` vectors do not see the same valid host/device data as their base vector:
```c++
const int vSize = 10;
Vector v; v.UseDevice(true); v.SetSize(vSize); v = 0.0;
cout << "IsHost(v) = " << IsHostMemory(v.GetMemory().GetMemoryType()) << endl;

Vector w; w.MakeRef(v, 0, vSize);
cout << "IsHost(w) = " << IsHostMemory(w.GetMemory().GetMemoryType()) << endl;

auto hv = v.HostWrite();
for (int j = 0; j < vSize; j++) { hv[j] = 1.0; }
cout << "IsHost(v) = " << IsHostMemory(v.GetMemory().GetMemoryType()) << endl;
cout << "IsHost(w) = " << IsHostMemory(w.GetMemory().GetMemoryType()) << endl;

Vector z; z.UseDevice(true); z.SetSize(vSize);
auto dz = z.Write();
auto dw = w.Read();
MFEM_FORALL(i, vSize,
{
  dz[i] = dw[i];
});
z.HostRead();
cout << "norm(z) = " << z.Norml2() << endl;

dz = z.Write();
auto dv = v.Read();
MFEM_FORALL(i, vSize,
{
  dz[i] = dv[i];
});
z.HostRead();
cout << "norm(z) = " << z.Norml2() << endl;
```

There is no easy way to keep the big "base" `Vector` (`v` in the example) and the "alias" sub-Vector (`w` in the example) synchronized when they are being moved/copied between host and device.
Therefore such synchronizations need to be done "manually" using the methods `Vector::SyncMemory` and `Vector::SyncAliasMemory`.

Basically the issue is that the Memory objects (inside the `Vector`s) do not know about the other version, so they cannot update the validity flags (the host and device validity flags indicate which of the pointers has valid data) of the other `Vector`.
Also such update may not make sense if you just moved the sub-`Vector`.

In the example above, after you move the "base" `Vector v` to host, you need to "inform" the "alias" `w` that the validity flags of its base have been changed.
This is done by calling `w.SyncMemory(v)` which simply copies the validity flags from `v` to `w` -- there are no host-device memory transfers involved.

One the other hand, if in the example you moved `w` to host and modified it there, and then you want to access the data through the base `Vector v` (you can think of the more general case here, when `w` is smaller than `v`) then you need to call `w.SyncAliasMemory(v)`.
In this particular case, the call will move the sub-Vector described by `w` from host to device and update the validity flags of `w` to be the same as the ones of `v`.
This way the whole `Vector v` gets the real data in one location -- before the call part of it was on device and the part described by w was on host.

Both `w.SyncMemory(v)` and `w.SyncAliasMemory(v)` ensure that `w` gets the validity flags of `v`, the difference is where the real data is before the call -- in the first case the real data is in `v` and in the second, it is in `w`.

