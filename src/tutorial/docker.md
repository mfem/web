## <span class="mdi mdi-docker"></span>&nbsp; Local Docker Container

<span class="label label-default">15 minutes</span>
<span class="label label-default">basic</span>

---

You don't need a cloud instance to run the MFEM tutorial. Instead, you can
directly run the MFEM [Docker container](https://github.com/mfem/containers)
on your local computer.

This `mfem/developer` container has been specifically created to kickstart the exploration of
MFEM and its capabilities in a variety of computing environments: from the cloud
(like AWS), to HPC clusters, and your own laptop.

Below are instructions on how to start the container on [Linux](#linux) and [macOS](#macos),
and how to use it to [run the tutorial locally](#running-the-tutorial-locally).

You can also use the container (and similar commands) to setup your own cloud instance. See
for example this [AWS script](https://github.com/mfem/containers/blob/main/developer/user-data.sh).

---

### <i class="fa fa-check-square-o"></i>&nbsp; Linux

Depending on your Linux distribution, you have to first install [Docker](https://www.docker.com/).
See the official instructions for e.g. [Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

Once the installation is complete and the `docker` command is in your path,
pull the `mfem/developer` container with:

    docker pull ghcr.io/mfem/containers/developer:latest

Depending on your connection, this may take a while to download and extract (the image is about 2GB).

To start the container, run:

    docker run --cap-add=SYS_PTRACE -p 3000:3000 -p 8000:8000 -p 8080:8080 ghcr.io/mfem/containers/developer:latest

You can later stop this by pressing <kbd>Ctrl-C</kbd>.
See the docker [documenation](https://docs.docker.com/engine/reference/commandline/cli/) for more details.

<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
The forwarding of ports <code>3000</code>, <code>8000</code> and <code>8080</code>
is needed for
<a href="../start/#set-up-vs-code">VS Code</a>, <a href="../start/#set-up-glvis">GLVis</a> and the websocket connection between them.
The <code>--cap-add=SYS_PTRACE</code> option is added to resolve MPI warnings.
</div>
</div>

---

### <i class="fa fa-check-square-o"></i>&nbsp; macOS

On macOS we recommend using [Podman](https://podman.io). See the official
installation instructions [here](https://podman.io/getting-started/installation).

After installing it, use the following commands to create a Podman machine and pull the `mfem/developer` container:

    podman machine init
    podman pull ghcr.io/mfem/containers/developer:latest

Both of these can take a while, depending on your hardware and network connection.

To start the virtual machine and the container in it, run:

    podman machine start
    podman run --cap-add=SYS_PTRACE -p 3000:3000 -p 8000:8000 -p 8080:8080 ghcr.io/mfem/containers/developer:latest

You can later stop these by pressing <kbd>Ctrl-C</kbd> and typing `podman machine stop`.

<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
One can also use <a href="https://docs.docker.com/desktop/install/mac-install/">Docker Desktop</a>
on macOS and follow the Linux <a href="#linux">instructions</a> above.
</div>
</div>

---

### <i class="fa fa-check-square-o"></i>&nbsp; Running the tutorial locally

Once the `mfem/developer` container is running, you can proceed with the
[<i class="fa fa-play-circle"></i> Getting Started](start.md) page using the
following `IP`: `127.0.0.1`. You can alternatively use `localhost` for the `IP`.

In particular, the VS Code and GLVis windows can be accessed at
[localhost:3000](http://localhost:3000) and
[localhost:8000/live](http://localhost:8000/live) respectively.

Furthermore, you can use the above pages from any other devices (tablets,
phones) that are connected to the same network as the machine running the
container.

For example you can run an example from the VS Code terminal on your laptop and
visualize the results on a GLVis window on your phone.

To connect other devices, first run `hostname -s` to get the local host name and then
use that `{hostname}` for the `IP` in the rest of the tutorial.

---

<div class="panel panel-warning">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-question-circle"></i>&nbsp; Questions?</h3>
</div>
<div class="panel-body">
Ask for help in the tutorial <a href="https://radiuss-llnl.slack.com/archives/C03T2DQCSC8">Slack channel</a>.
</div>
</div>

<div class="panel panel-success">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-external-link"></i>&nbsp; Next Steps</h3>
</div>
<div class="panel-body">
Go to the <a href="../start"><i class="fa fa-play-circle"></i> Getting Started</a> page.
</div>
</div>

---

Back to the [MFEM tutorial page](index.md)

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
