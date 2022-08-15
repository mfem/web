# mfem / web

This repo contains the MFEM website [MkDocs](https://www.mkdocs.org/) sources.

To make changes to the website you will need an install of Python version >= 3.6.9 with the following libraries:

- use MkDocs v1.0.4 with Markdown v3.0 and the latest PyYAML and mkdocs-exclude-search:
  * `pip install --upgrade --user mkdocs==1.0.4`
  * `pip install --upgrade --user Markdown==3.0`
  * `pip install --upgrade --user PyYAML`
  * `pip install --upgrade --user mkdocs-exclude-search`
  * `pip install --upgrade --user "jinja2<3.1.0"`
- or in a Python virtual environment
  * `python3 -m venv mfem-web-venv`
  * `. ./mfem-web-venv/bin/activate`
  * `pip install -r requirements.txt`
- newer versions may not generate correct front page (to see the installed version, use `pip show mkdocs`)
- make sure you don't have `mkdocs-material` installed which may conflict with regular `mkdocs`
- clone this repo,
- edit or add some `.md` files (you may also need to update the `mkdocs.yml` config),
- preview locally with `mkdocs serve` (Windows users may need to specify a port, such as `mkdocs serve --dev-addr 127.0.0.1:4000`),
- publish with `mkdocs gh-deploy`.

#### Breadcrumbs:

- We have several article collections: `tag-howto`, `tag-gettingstarted`, `tag-fem`, `tag-mesh` each of which has a base page, e.g. `howto-index.md` for `tag-howto`.
- If an article belongs to a collection, a "Back to <Base Page>" link will appear below its TOC.
- To mark that an article is part of one or several collection, add the tags at the very beginning of the file, see e.g. `fem.md`.
- To add a new collection, see the code in `template/toc.html`.

#### Checklist for adding examples:

- Add a one-line summary of the example in `features.md`
- Add an image file in `img/examples/`, e.g. `img/examples/ex1.png`
- Add a brief description in `examples.md` following the description at the top of the C++ file
- Add a "showElement" line with the appropriate categories for the example in the `update` function at the end of `examples.md`

#### To add a new Application / Finite Elements / Discretization / Solver category:

- Add an `<option>` tag at the top of `examples.md`, e.g.
  `<option id="wave">Wave</option>`
- Use the `id` in filter expressions of appropriate examples in `update`, e.g.
  `showElement("ex25", (maxwell || wave) && hcurl && galerkin && (gmres || ams));`

#### Checklist for adding miniapps:

- Consider adding a one-line summary of the example in `features.md` (if we want to advertise the miniapp to users)
- Add an image file in `img/examples/`, e.g. `img/examples/shaper.png`
- Add a brief description in `examples.md` following the description at the top of the C++ file
- Add a "showElement" line with the appropriate categories for the miniapp in the `update` function at the end of `examples.md`
- If the miniapp is part of a group, e.g. meshing miniapps, add it also to `meshing-miniapps.md`
