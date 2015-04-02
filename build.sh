#!/bin/sh

# Build main lib
npm run browserify

# Build languages
for dir in lang/*/
do
  cd $dir
  npm run build
done