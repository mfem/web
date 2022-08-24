# MFEM Docker

We have created [Docker containers](https://github.com/mfem/containers) to
kickstart exploration of MFEM and its capabilities. These images can be run on
any cloud service (like AWS) or locally. Below are instructions on how to run
these images on Linux and macOS.

## Linux

Depending on your Linux distribution, you have to install Docker. See the
official instructions for e.g.
[Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

You have to pull an mfem container e.g.
```sh
docker pull ghcr.io/mfem/containers/developer:latest
```
and start the image by running
```sh
docker run --cap-add=SYS_PTRACE -p 3000:3000 -p 8000:8000 -p 8080:8080 ghcr.io/mfem/containers/developer:latest
```
<div class="panel panel-info" style="width:92%; margin-left: auto; margin-right: auto;">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
--cap-add=SYS_PTRACE is added to resolve MPI warnings
</div>
</div>

## macOS

On macOS we recommend using [podman](https://podman.io). See the official
instructions [here](https://podman.io/getting-started/installation).

Then use the equivalent commands as for Docker
```sh
podman pull ghcr.io/mfem/containers/developer:latest
podman run --cap-add=SYS_PTRACE -p 3000:3000 -p 8000:8000 -p 8080:8080 ghcr.io/mfem/containers/developer:latest
```