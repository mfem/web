# mfem / web

This repo contains the MFEM website [MkDocs](http://www.mkdocs.org/) sources.

To make changes to the website:

- use the latest versions of MkDocs, Markdown, and PyYAML:
  * `pip install --upgrade --user mkdocs`
  * `pip install --upgrade --user Markdown`
  * `pip install --upgrade --user PyYAML`
- clone this repo,
- edit or add some ```.md``` files (you may also need to update the ```mkdocs.yml``` config),
- preview locally with ```mkdocs serve``` (Windows users may need to specify a port, such as ```mkdocs serve --dev-addr 127.0.0.1:4000```),
- publish with ```mkdocs gh-deploy```.


Checklist for adding examples:

- Add a one-line summary of the example in `features.md`
- Add an image file in `img/examples/`, e.g. `img/examples/ex1.png`
- Add a brief description in `examples.md` following the description at the top of the C++ file
- Add a "showElement" line with the appropriate categories for the example in the `update` function at the end of `examples.md`

To add a new Application / Finite Elements / Discretization / Solver category:

- Add an `<option>` tag at the top of `examples.md`, e.g.
  ```<option id="wave">Wave</option>```
- Use the `id` in filter expressions of appropriate examples in `update`, e.g.
  ```showElement("ex25", (maxwell || wave) && hcurl && galerkin && (gmres || ams));```

Checklist for adding miniapps:

- Consider adding a one-line summary of the example in `features.md` (if we want to advertise the miniapp to users)
- Add an image file in `img/examples/`, e.g. `img/examples/shaper.png`
- Add a brief description in `examples.md` following the description at the top of the C++ file
- Add a "showElement" line with the appropriate categories for the miniapp in the `update` function at the end of `examples.md`
- If the miniapp is part of a group, e.g. meshing miniapps, add it also to `meshing.md`


