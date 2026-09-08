## <i class="fa fa-play-circle"></i>&nbsp; Getting Started

<span class="label label-default">15 minutes</span>
<span class="label label-default">basic</span>

---

<div class="panel panel-success">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-check"></i>&nbsp; Lesson Objectives</h3>
</div>
<div class="panel-body" style="line-height: 1.8;">
<i class="fa fa-square-o"></i>&nbsp; Setup a browser-based MFEM development environment.<br>
<i class="fa fa-square-o"></i>&nbsp; Run a simple MFEM code to test the environment.
</div>
</div>

<div class="panel panel-info">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
<i class="fa fa-arrow-circle-right"></i>&nbsp; If you are part of the
<a href="https://hpcic.llnl.gov/tutorials/2026-hpc-tutorials">HPC software tutorial series</a>,
use the URLs sent by the Slackbot when it starts your development container.
For example, the Slackbot message includes URLs for VS Code and GLVis like
<code>https://SESSION.mfem.hpcic.training?folder=/home/euler/mfem</code> and
<code>https://SESSION.mfem.hpcic.training/glvis/live/?socket=/glvis-ws</code>.
<p><p>
<i class="fa fa-arrow-circle-right"></i>&nbsp; If you are running a
Docker container locally, follow the local URLs in the <a href="../docker/#running-the-tutorial-locally"><span class="mdi mdi-docker"></span> Local Docker Container</a> page.
</div>
</div>

---

### <i class="fa fa-check-square-o"></i>&nbsp; Set up VS Code

- Open the VS Code URL in a new browser window.

- You should see the Visual Studio Code (VS Code) interface.

- Click on `Mark Done` to continue.

- If the VS Code URL includes `?folder=/home/euler/mfem`, the MFEM directory opens automatically and you can skip the next step.

<img class="tight" src="../img/start1.png">

- (If needed) Click on `open a folder` (under `Recent`), then select `mfem`, then click `OK`.

- In the left pane, open `examples` and select `ex1.cpp`.

- Open a new terminal by clicking on &nbsp;<i class="fa fa-bars"></i>&nbsp; in the upper left corner, then `Terminal`, and then `New Terminal`.

- Alternatively you can open a new terminal by pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>`</kbd>.

- You should now see the MFEM source tree and a terminal in the `~/mfem` directory.

<img class="tight" src="../img/start2.png">

<div class="panel panel-info" style="width:92%; margin-left: auto; margin-right: auto;">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
The browser window contains a fully functioning copy of Visual Studio Code. You can customize it further,
and adjust it similarly to the desktop version.
</div>
</div>

---

### <i class="fa fa-check-square-o"></i>&nbsp; Set up GLVis

In this tutorial we use [GLVis](https://glvis.org) for finite element visualization based on MFEM.

- Open the GLVis URL in a new browser window.

- When you move the mouse to the top of the window you should see the GLVis interface:

<img class="tight" src="../img/start3.png">

- If the GLVis URL includes <code>?socket=/glvis-ws</code>, it is already connected and you can skip the next step.

- (If needed) Click the **Connect to socket** icon &nbsp;<span class="mdi mdi-lan-connect mdi-18px"></span>&nbsp; in the upper left corner, then enter the current host name followed by <code>/glvis-ws</code> in the <b>Host</b> field, for example <code>SESSION.mfem.hpcic.training/glvis-ws</code> or <code>localhost:3000/glvis-ws</code>, and click `CONNECT`.

- Your environment should now look like:

<img style="width:90%" src="../img/start4.png">

---

### <i class="fa fa-check-square-o"></i>&nbsp; Simple test

- To test your environment, run `ex1`, which together with the MFEM library itself,
  comes pre-build in the AWS image.

- In the VS Code terminal, type

        cd examples
        ./ex1

- You should see `111` iterations printed in the terminal and the image in the
GLVis window should change:

<img style="width:90%" src="../img/start5.png">

- To test the visualization, click in the GLVis window, and make sure you can
rotate the plot with the <kbd>Left</kbd> mouse button and zoom in/out with the
<kbd>Right</kbd> mouse button.

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
Go to the <a href="../fem"><i class="fa fa-book"></i> Finite Element Basics</a> page.
</div>
</div>

---

Back to the [MFEM tutorial page](index.md)

<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {equationNumbers: {autoNumber: "all"}}, tex2jax: {inlineMath: [['$','$']]}});</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML"></script>
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
