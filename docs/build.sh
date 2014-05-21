#!/usr/bin/env bash

DOCS=`pwd`"/docs/opportunities.json"
TMPDIR=`pwd`"/tmp-docs"

rm $DOCS

mkdir $TMPDIR

# Run tests and spit out opportunities
export BUILD_DOCS=$TMPDIR

mocha --reporter min

# build the docs
echo "building docs"

first=true

echo "{" >> $DOCS

for file in $TMPDIR/* ;
do 

  if [ "$first" == true ] ;
  then
    let first=false
  else
    echo "," >> $DOCS
  fi

  echo '"'${file##*/}'":' >> $DOCS

cat $file >> $DOCS
done 

echo "}" >> $DOCS

rm -rf $TMPDIR

echo "done"