#!/bin/sh

# Build main lib
npm run build:browserify
npm run build:minify

# Build languages
for dir in lang/*/
do
  cd $dir
  npm run build
done