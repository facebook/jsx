#!/bin/bash

set -e

# Start in website/ even if run from root directory
cd "$(dirname "$0")"

cd ../../jsx-gh-pages
git checkout -- .
git clean -dfx
git fetch
git rebase
rm -Rf *
cd ../jsx/website
node server/generate.js
cp -R build/jsx/* ../../jsx-gh-pages/
rm -Rf build/
cd ../../jsx-gh-pages
git add --all
git commit -m "update website"
git push
cd ../jsx/website
