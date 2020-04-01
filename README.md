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


Checklist for adding examples

- Add a brief description in examples.md
- Add an image file in img/examples/
- Update numExamples in examples.md 
- List the "categories" for the example in examples.md (towards the end)
- Add the example in features.md