# MFEM device handling:
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
There exists variants of this `MFEM_FORALL` macro, namely `MFEM_FORALL_2D` and `MFEM_FORALL_3D` which help maping 2D or 3D blocks of threads to the hardware more efficiently.
In the case of a GPU, `MFEM_FORALL_3D(i,N,X,Y,Z,{...})` will declare `N` block of threads each of size `X`x`Y`x`Z` threads, whereas `MFEM_FORALL` uses `N` threads.

In order to exploit 2D or 3D blocks of threads, it is convenient to use the macro `MFEM_FOREACH_THREAD(i,x,p)` to use threads as a `for` loop,
the first variable `i` is the name of the "loop" variable, `x` is the threadId, it can take the values `x`, `y`, or `z`, and `p` is the the bound of the loop.
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
Using `MFEM_FORALL_3D` and `MFEM_FOREACH_THREAD` allows to use more concurrency `NxXxYxZ` threads instead of only at `N` threads with `MFEM_FORALL`,
but more importantly the memory accesses on `A(i,j,k,n)` are much better with `MFEM_FORALL_3D`.
With `MFEM_FORALL_3D`, threads access consecutive memory, this is called coalesce memory access.
Because most applied math algorithms are highly memory bound, having coalesce memory accesses is critical to achieve high performance.

# Tips-n-tricks

## Compile in debug mode when developping for devices:
The memory manager performs checks that catches most of the missuses of the memory on host or device.
If using device debug, if your code fails you can run gdb or lldb, and set a breakpoint at `b mfem::mfem_error` .
The code will break as soon as it reaches this point and then you can backtrace `bt` from here to see what went wrong and where.

## Forcing synchronization with the host or the device:
It is sometimes needed to synchronize data between host and device.
In order to make sure that the host data is synchronized one should use `HostRead()`,
similarly to ensure synchronized data on the device one should use `Read()`.

## Do not use `GetData()`:
Do not use `GetData()` to use a pointer on GPU since this will always return the host pointer wihtout synchronizing the data.

## Tracking data movements and allocations
Defining the `MFEM_TRACK_CUDA_MEM` macro while building can help you see when data is transferred, allocated, etc.
If you see a lot of data movement between host and device that’s a good indication that you’re running a lot of host or device kernels that are making use of that data.
You want to avoid this at all costs. Pin point where this is occurring and see if you can’t refactor your code so the data stays mainly on the device.
Avoid mallocing memory on the GPU within frequently called kernels. CUDA malloc calls are slow and can hinder performance.
If you really need to do such operations think of making use of a memory pool (e.g. Umpire) that way the mallocs are much cheaper on the GPU.

## The `UseDevice(bool)` function
If you know you’re going to use your `Vector` like object on the GPU go ahead call `UseDevice(true)` right after constructing the `Vector`.
Be aware `UseDevice()` is not the same as `UseDevice(true)`, the first one just returns a boolean that tells you whether the object is intended for computation on the device or not.

## Using `constexpr` inside `MFEM_FORALL`:
The `MFEM_FORALL` relies on lambda capture, one issue that comes up is with lambda captures for `constexpr` variables in `MFEM_FORALL` on MSVC.
In particular according to the standard, `constexpr` variables do not need to be captured, and should not lose their const-ness in a lambda.
However, on MSVC (e.g. in the AppVeyor CI checks), this can result in errors like:

`error C2131: expression did not evaluate to a constant`

A simple fix for this error is to declare the `constexpr` variable as `static constexpr`.
```c++
static constexpr P = ...; // omitting the static would result in an error on MSVC
MFEM_FORALL(I,N,
{
  double my_data[P];
});
```
Similar problems and workarounds are discussed [here](https://stackoverflow.com/questions/55136414).

## Error: `alias not found`
This error message indicates that you are trying to move an "alias" `Vector` to gpu while its "base" `Vector` did not have gpu allocation (valid or not) when the alias was created (and may still not have gpu allocation when the move of the "alias" was attempted). This is another case where we cannot update the "base" `Vector` because we do not have access to it, and even if we did, there are other complications.

Therefore, we need to follow this rule: if you are creating an "alias" that will be used on device, you need to ensure the "base" is allocated on device. Depending on the context, one can use different methods to do that.

For example, if the "base" is initialized (on host, otherwise there will be no issue) in the same function that will create the alias, one can call `base.Write()` to create the device allocation followed by `base.HostWrite()` and then initialize "base" on host -- this sequence avoids any unnecessary host-device transfers.

Another example: if the "base" was initialized outside of the function where the "alias" is created, then the most appropriate choice probably is to call `base.Read()` before creating the "alias". Since the alias will need the data on device, the incurred host-to-device transfer is (at least partially) necessary anyway.

Ideally, "base" Vectors that will be modified/accessed on device through aliases should be allocated on device to begin with, e.g. using `Vector::SetSize(int s, MemoryType mt)` typically with `mt = Device::GetDeviceMemoryType()`.

## `MakeRef()` vectors do not see the same valid host/device data as their base vector.
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

There is no easy way to keep the big "base" `Vector` (`v` in your example) and the "alias" sub-Vector (`w` in your example) synchronized when they are being moved/copied between host and device.
Therefore such synchronizations need to be done "manually" using the methods `Vector::SyncMemory` and `Vector::SyncAliasMemory`.

Basically the issue is that the Memory objects (inside the `Vector`s) do not know about the other version, so they cannot update the validity flags (the host and device validity flags indicate which of the pointers has valid data) of the other `Vector`.
Also such update may not make sense if you just moved the sub-`Vector`.

In your example above, after you move the "base" `Vector v` to host, you need to "inform" the "alias" `w `that the validity flags of its base have been changed.
This is done by calling `w.SyncMemory(v)` which simply copies the validity flags from `v` to `w` -- there are no host-device memory transfers involved.

One the other hand, if in your example you moved `w` to host and modified it there, and then you want to access the data through the base `Vector v` (you can think of the more general case here, when `w` is smaller than `v`) then you need to call `w.SyncAliasMemory(v)`.
In this particular case, the call will move the sub-Vector described by `w` from host to device and update the validity flags of `w` to be the same as the ones of `v`.
This way the whole `Vector v` gets the real data in one location -- before the call part of it was on device and the part described by w was on host.

Both `w.SyncMemory(v)` and `w.SyncAliasMemory(v)` ensure that `w` gets the validity flags of `v`, the difference is where the real data is before the call -- in the first case the real data is in `v` and in the second, it is in `w`.


# Achieving high performance on GPU

roofline model: https://developer.download.nvidia.com/video/gputechconf/gtc/2019/presentation/s9624-performance-analysis-of-gpu-accelerated-applications-using-the-roofline-model.pdf
shared mem: http://developer.download.nvidia.com/GTC/PDF/1083_Wang.pdf
memory diagram: https://stackoverflow.com/questions/37732735/nvprof-option-for-bandwidth
white paper: https://arxiv.org/pdf/1804.06826.pdf
https://software.intel.com/content/www/us/en/develop/articles/intel-advisor-roofline.html
You can look at the stall reasons:
I would recommend this link first: https://docs.nvidia.com/gameworks/content/developertools/desktop/analysis/report/cudaexperiments/kernellevel/issueefficiency.htm
https://docs.nvidia.com/cuda/profiler-users-guide/index.html#metrics-reference-7x
Then if needed: https://stackoverflow.com/questions/14887807/what-are-other-issue-stall-reasons-displayed-by-the-nsight-profiler
You can use nvprof with:
stall_constant_memory_dependency for Percentage of stalls occurring because of immediate constant cache miss
stall_exec_dependency for Percentage of stalls occurring because an input required by the instruction is not yet available
stall_inst_fetch for Percentage of stalls occurring because the next assembly instruction has not yet been fetched
stall_memory_dependency for Percentage of stalls occurring because a memory operation cannot be performed due to the required resources not being available or fully utilized, or because too many requests of a given type are outstanding
stall_memory_throttle for	Percentage of stalls occurring because of memory throttle
stall_not_selected for Percentage of stalls occurring because warp was not selected
stall_other for Percentage of stalls occurring due to miscellaneous reasons
stall_pipe_busy for Percentage of stalls occurring because a compute operation cannot be performed because the compute pipeline is busy
stall_sync for Percentage of stalls occurring because the warp is blocked at a __syncthreads() call
stall_texture for Percentage of stalls occurring because the texture sub-system is fully utilized or has too many outstanding requests
