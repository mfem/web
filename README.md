# mfem / web

This repo contains the MFEM website [MkDocs](http://www.mkdocs.org/) sources.

To make changes to the website:

- use MkDocs v1.0.4 with Markdown v2.6.8, e.g. use
  * `pip install --upgrade --user mkdocs==1.0.4`
  * `pip install --upgrade --user Markdown==2.6.8`
- clone this repo,
- edit or add some ```.md``` files (you may also need to update the ```mkdocs.yml``` config),
- preview locally with ```mkdocs serve```,
- publish with ```mkdocs gh-deploy```.


Checklist for adding examples:

- Add a one-line summary of the example in `features.md`
- Add an image file in `img/examples/`, e.g. `img/examples/ex1.png`
- Add a brief description in `examples.md` following the description at the top of the C++ file
- Update `numExamples` in examples.md in the JavaScript code at the end of the files

To add a new Application / Finite Elements / Discretization / Solver category:

- Add a radio button at the top of `examples.md`, e.g.
  ```<label><input type="radio" id="wave" onchange="update(this.id);" /> Wave</label><br/>```
- List the `id` in the appropriate examples in `update` at the end of `examples.md`, e.g.
  ```showElement("ex25", (maxwell || wave) && hcurl && galerkin && (gmres || ams));```

Checklist for adding miniapps:

- Consider adding a one-line summary of the example in `features.md` (if we want to advertise the miniapp to users)
- Add an image file in `img/examples/`, e.g. `img/examples/shaper.png`
- Add a brief description in `examples.md` following the description at the top of the C++ file
- Update `numExamples` in examples.md in the JavaScript code at the end of the files in the appropriate miniapps section
- Add a line with the appropriate  categories for the example in the `update` function at the end of `examples.md`
- If the miniapp is part of a group, e.g. meshing miniapps, add it also to `meshing.md`


