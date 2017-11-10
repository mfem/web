#!/bin/bash

mfemdir=$HOME/mfem/code-reviews/mfem-clean

function preprocess { # src dst
	cat $1 \
	| sed 's|config=TeX-AMS_HTML|config=TeX-AMS-MML_SVG|' \
	> $2
}

function postprocess { # src dst localdir
	cat $1 \
	| sed 's|"https://cdnjs.cloudflare.com/.*"|""|' \
	| sed 's|\.\./css|---local---|g' \
	| sed 's|\.\./img|---local---|g' \
	| sed 's|\.\./js|---local---|g' \
	| sed 's|href="\.\.|href="http://mfem.org|g' \
	| sed "s|---local---|$3|g"\
	> $2
}

function exportfile { # src dst localdir
	echo
	echo Exporting $1
	tmp1=${1}_tmp1.html
	tmp2=$(mktemp export.XXXXXXXXXX)
	# tmp2=${1}_tmp2.html
	preprocess $1 $tmp1
	phantomjs export.js file://$PWD/$tmp1 $tmp2
	postprocess $tmp2 $2 $3
	rm $tmp1
	rm $tmp2
}

# build the docs in the 'site' directory
mkdocs build

# export pages
exportfile site/examples/index.html \
           $mfemdir/examples/README.html \
           ../doc/web

exportfile site/electromagnetics/index.html \
           $mfemdir/miniapps/electromagnetics/README.html \
           ../../doc/web

exportfile site/meshing/index.html \
           $mfemdir/miniapps/meshing/README.html \
           ../../doc/web

exportfile site/performance/index.html \
           $mfemdir/miniapps/performance/README.html \
           ../../doc/web
