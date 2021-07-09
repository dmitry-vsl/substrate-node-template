#!/bin/bash

set -e

# cd to repo root
cd $(dirname "${BASH_SOURCE[0]}")/..


# Create temp directory
mkdir -p tmp


echo Build base version to be upgraded
BASE_BIN=tmp/node-template.base
if [ ! -f $BASE_BIN ] ; then
  echo Build base version
  cargo build
  cp ./target/debug/node-template $BASE_BIN
else
  echo Base version already exists, skipping
fi


echo Build modified version
BASE_MODIFIED=tmp/node-template.modified
WASM=tmp/wasm.modified
if [ ! -f $BASE_MODIFIED ] ; then
  echo Build modified version
  cp runtime_upgrade_examples/lib.rs pallets/template/src/lib.rs
  cp runtime_upgrade_examples/runtime-lib.rs runtime/src/lib.rs
  cargo build
  cp ./target/debug/node-template $BASE_MODIFIED
  cp ./target/debug/wbuild/node-template-runtime/node_template_runtime.compact.wasm $WASM
else
  echo Modified version already exists, skipping
fi


echo Starting blockchain
trap "kill -- -$$" EXIT
echo Redirecting node log to tmp/node-log
$BASE_BIN --dev --tmp > tmp/node-log 2>&1 &

echo Waiting blockchain to start
sleep 10

cd runtime_upgrade_examples/

echo install node_modules
if [ ! -d node_modules ] ; then
  npm install
fi

node --unhandled-rejections=strict test.js ../$WASM
