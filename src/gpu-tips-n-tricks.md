# MFEM device handling:
MFEM relies mainly on two features for running algorithms on devices such as GPUs:
- The memory manager, handles transparently moving data between host (CPU) and device (GPU for instance),
- `MFEM_FORALL` allows to abstract `for` loops to parallelize on an arbitrary device.

## The memory manager
In order to make as transparent as possible the use of memory on host, or on device, MFEM relies on a memory manager.
Instead of storing a pointer of type `T*`, each object that can be accessed on a device contains `Memory<T>` objects.

To get the pointer `T*` from a `Memory<T>` object, one has to use `Read()`, `Write()`, or `ReadWrite()`.
- `Read()` returns a `const T*` pointer, and should be use when the data will only be read,
- `Write()` returns a `T*` pointer, and should be used when writing data **without** using any previously contained data,
- `ReadWrite()` returns `T*` pointer, and should be used when read and write access to the pointer are required.
`Read()`, `Write()`, and `ReadWrite()` are taking care automatically and completely transparently of data movement between host and device.

`Vector`s' and `Array<T>`s' data can also directly be access with these functions.

A convenient class, `DeviceTensor<N,T>` is the only class that can be moved automatically 

### Compile in debug mode when developping for devices:
The memory manager performs checks that catches most of the missuses of the memory on host or device.
If using device debug, if your code fails you can run gdb or lldb, and set a breakpoint at `mfem::mfem_error` .
The code will break as soon as it reaches this point and then you can backtrace from here to see what went wrong and where.

### Forcing synchronization with the host or the device:
It is sometimes needed to synchronize data between host and device.
In order to make sure that the host's data are synchronized one should use `HostRead()`,
similarly to ensure synchronize on the device one should use `Read()`.

### Warning about `GetData()`:
Do not use `GetData()` to use a pointer on GPU since this will always return the host pointer.

### Tracking data movements and allocations
Defining the `MFEM_TRACK_CUDA_MEM` macro while building can help you see when data is transferred, allocated, and etc.
If you see a lot of data movement between host and device that’s a good indication that you’re running a lot of host or device kernels that are making use of that data.
You want to avoid this at all costs. Pin point where this is occurring and see if you can’t refactor your code so the data stays mainly on the device.
Avoid mallocing memory on the GPU within frequently called kernels. CUDA malloc calls are slow and can hinder performance.
If you really need to do such operations think of making use of a memory pool (e.g. Umpire) that way the mallocs are much cheaper on the GPU.

### The `UseDevice(bool)` function
If you know you’re going to use your `mfem::Vector` like object on the GPU go ahead call `UseDevice(true)` right after constructing the object.
Be aware `UseDevice()` is not the same as `UseDevice(true)`, it just returns a boolean that tells you whether the object should be on the device or not.

### `MakeRef()` vector does not see the same valid host/device data as the base vector.
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

### Error: `alias not found`
This error message indicates that you are trying to move an "alias" `Vector` to gpu while its "base" `Vector` did not have gpu allocation (valid or not) when the alias was created (and may still not have gpu allocation when the move of the "alias" was attempted). This is another case where we cannot update the "base" `Vector` because we do not have access to it, and even if we did, there are other complications.

Therefore, we need to follow this rule: if you are creating an "alias" that will be used on device, you need to ensure the "base" is allocated on device. Depending on the context, one can use different methods to do that.

For example, if the "base" is initialized (on host, otherwise there will be no issue) in the same function that will create the alias, one can call `base.Write()` to create the device allocation followed by `base.HostWrite()` and then initialize "base" on host -- this sequence avoids any unnecessary host-device transfers.

Another example: if the "base" was initialized outside of the function where the "alias" is created, then the most appropriate choice probably is to call `base.Read()` before creating the "alias". Since the alias will need the data on device, the incurred host-to-device transfer is (at least partially) necessary anyway.

Ideally, "base" Vectors that will be modified/accessed on device through aliases should be allocated on device to begin with, e.g. using `Vector::SetSize(int s, MemoryType mt)` typically with `mt = Device::GetDeviceMemoryType()`.

## The MFEM_FORALL macro
The idea behind the `MFEM_FORALL` macro is to have the same behavior as a `for` loop and hide all the specifics to devices.
Example:
```
for(int i = 0; i < N; i++)
{
  ...
}
```
becomes
```
MFEM_FORALL(i, N,
{
  ...
});
```
There exists variants of this `MFEM_FORALL` macro, namely `MFEM_FORALL_2D` and `MFEM_FORALL_3D` which helps maping blocks of threads on the hardware more efficiently.
In the case of a GPU, `MFEM_FORALL_3D(i,N,X,Y,Z,{...})` will declare `N` block of threads each of size `X`x`Y`x`Z` threads.


### Remark about using `constexpr` inside `MFEM_FORALL`:
The `MFEM_FORALL` relies on lambda capture, one issue that comes up is with lambda captures for `constexpr` variables in `MFEM_FORALL` on MSVC.
In particular according to the standard, `constexpr` variables do not need to be captured, and should not lose their const-ness in a lambda.
However, on MSVC (e.g. in the AppVeyor CI checks), this can result in errors like:
`error C2131: expression did not evaluate to a constant`

A simple fix for this error is to declare the `constexpr` variable as `static constexpr`.
Similar problems and workarounds are discussed here: https://stackoverflow.com/questions/55136414

# Achieving high performance on GPU

Yohann:
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

Veselin:
One good addition to the “gpu tips and tricks” webpage can be this: https://github.com/mfem/mfem/issues/1578#issuecomment-649139077 with the example there. We can probably simplify the example though.
 https://github.com/mfem/mfem/issues/1578#issuecomment-649962962

Will:
One issue that comes up is with lambda captures for constexpr variables in MFEM_FORALL on MSVC.

In particular according to the standard, constexpr variables do not need to be captured, and should not lose their const-ness in a lambda. However, on MSVC (e.g. in the AppVeyor CI checks), this can result in errors like:

error C2131: expression did not evaluate to a constant
A simple fix for this error is to declare the constexpr variable as static constexpr. Similar problems and workarounds are discussed here: https://stackoverflow.com/questions/55136414

Robert:
I would say some of my “tips and tricks” are:
 
Avoid making use of GetData() it can lead to various issues later down the road when running things on the GPU
Instead make use of HostRead(Write) in areas you know will stay on the Host and Read(Write) for kernels you know could end up on the GPU in the future.
MFEM_FORALLs are an easy way to make sure your code can run on GPUs. However, they are limited to only being able to make use of public class functions within them.
When passing data into the forall it’s a good idea to use Read(Write) to obtain the underlying data pointers passed into the macro
For mfem::Vector and mfem::Array type classes, you can do something like obj.HostRead() or obj.Read() to pull the object’s data down to the host or device. You don’t actually need to make use of the pointers returned by these functions.
Make use of device debug mode early on it. It’s a very useful tool in helping pinpoint whether or not your memory is in the wrong location when used within a compute kernel.
If using device debug, if your code fails you can run gdb and set a breakpoint at mfem::mfem_error . The code will break as soon as it reaches this point and then you can backtrace from here to see what went wrong and where.
Later, you can move the breakpoint to earlier points in the code and see if an object has memory currently located on the host or device.
Defining the MFEM_TRACK_CUDA_MEM macro while building can help you see when data is transferred, allocated, and etc.
If you see a lot of data movement between host and device that’s a good indication that you’re running a lot of host or device kernels that are making use of that data.
You want to avoid this at all costs. Pin point where this is occurring and see if you can’t refactor your code so the data stays mainly on the device.
Avoid mallocing memory on the GPU within frequently called kernels. CUDA malloc calls are slow and can hinder performance.
If you really need to do such operations think of making use of a memory pool (e.g. Umpire) that way the mallocs are much cheaper on the GPU.
If you know you’re going to use your mfem::Vector like object on the GPU go ahead call UseDevice(true) right after constructing the object.
Be aware UseDevice() just returns a boolean tells you whether the object should be on the device or not. It’s not the same as UseDevice(true).
 
I’m sure I’ve got more but these are at least a start.

Arturo:
My recommendation would be to develop in debug mode, and set a break point here https://github.com/mfem/mfem/blob/master/general/error.cpp#L155
 
Most of my bugs stem from not moving the data correctly.
 
Also, I think it would be nice to have an overview of the flags in the memory manager class to help understand what is going on.