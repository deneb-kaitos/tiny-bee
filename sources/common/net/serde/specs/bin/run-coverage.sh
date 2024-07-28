#!/bin/bash

set -eou pipefail

COVERAGE_DIR=./coverage
SPECS_DIR=./specs

# rm -rf "$COVERAGE_DIR" && mkdir "$COVERAGE_DIR"

export NODE_ENV=test
export NODE_DEBUG=serde*
export NODE_V8_COVERAGE=./coverage


./node_modules/.bin/c8 \
  --experimental-monocart \
  --reporter=console-details \
  --check-coverage \
  --reporter=v8 \
  node \
    --env-file="$SPECS_DIR/.env" \
    --experimental-test-coverage \
    --test-reporter=lcov \
    --test-reporter-destination="$COVERAGE_DIR/lcov.info" \
    --test "$SPECS_DIR/*.specs.mjs"
