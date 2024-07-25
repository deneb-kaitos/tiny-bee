#!/bin/bash

set -eou pipefail

SPECS_DIR=./specs

export NODE_ENV=test
export NODE_DEBUG=LibWebsocketServer*

node \
  --env-file="$SPECS_DIR/.env" \
  --test "$SPECS_DIR/*.specs.mjs"
