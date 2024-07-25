#!/bin/bash

set -eou pipefail

SPECS_DIR=./specs

export NODE_ENV=test
export NODE_DEBUG=serde*

node \
  --test "$SPECS_DIR/*.specs.mjs"
