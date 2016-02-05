#!/bin/bash

function filter {
	cat $1 \
	| sed 's|"http://cdn.mathjax.org/.*"|""|' \
	| sed 's|\.\./css|---local---|g' \
	| sed 's|\.\./img|---local---|g' \
	| sed 's|\.\./js|---local---|g' \
	| sed 's|href="\.\.|href="http://mfem.org|g' \
	| sed "s|---local---|$3|g"\
	> $2
}

mfemdir=$HOME/mfem
curdir=$(pwd)

mkdocs build

temp=$(mktemp)
phantomjs export.js file:///$curdir/site/examples/index.html $temp
filter $temp $mfemdir/examples/README.html ../doc/web
rm $temp

temp=$(mktemp)
phantomjs export.js file:///$curdir/site/electromagnetics/index.html $temp
filter $temp $mfemdir/miniapps/electromagnetics/README.html ../../doc/web
rm $temp

temp=$(mktemp)
phantomjs export.js file:///$curdir/site/meshing/index.html $temp
filter $temp $mfemdir/miniapps/meshing/README.html ../../doc/web
rm $temp

