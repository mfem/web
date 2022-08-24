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
<s>You should have received an email with the AWS instance IP address allocated to
you for this tutorial. Use that in place of <code>IP</code> in the instructions below.</s>
<br><br>
If you setup your Docker container locally, you can replace <code>IP</code> with
the computers IP address or hostname that runs Docker. If you setup a cloud instance with the Docker container, you should use the cloud instance IP address.
</div>
</div>

<div class="panel panel-danger">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-warning"></i>&nbsp; Warning</h3>
</div>
<div class="panel-body">
If you use VPN, make sure to <b>turn it off</b> before following the instructions below.
</div>
</div>

---

### <i class="fa fa-check-square-o"></i>&nbsp; Set up VS Code

- Open a new browser window and load `http://IP:3000`.

- You should see the Visual Studio Code (VS Code) interface.

- Click on `Mark Done` to continue.

<img class="tight" src="../img/start1.png">

- Click on `open a folder` (under `Recent`), then select `mfem`, then click `OK`.

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

- Open a new browser window and load `http://IP:8000/live`.

- When you move the mouse to the top of the window you should see the GLVis interface:

<img class="tight" src="../img/start3.png">

- Click on the **Connect to socket** icon &nbsp;<span class="mdi mdi-lan-connect mdi-18px"></span>&nbsp; in
  the upper left corner, then click `CONNECT`.

<div class="panel panel-info" style="width:92%; margin-left: auto; margin-right: auto;">
<div class="panel-heading">
<h3 class="panel-title"><i class="fa fa-info-circle"></i>&nbsp; Note</h3>
</div>
<div class="panel-body">
The <b>Host</b> field in the <b>Connect to socket</b> dialog should match your <code>IP</code>.
</div>
</div>

- When the button switches to `DISCONNECT`, click outside of the **Connect to socket** dialog to close it.

- Your environment should now look like:

<img style="width:90%" src="../img/start4.png">

---

### <i class="fa fa-check-square-o"></i>&nbsp; Simple test

- To test your environment, run `ex1p`, which together with the MFEM library itself,
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
