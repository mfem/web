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