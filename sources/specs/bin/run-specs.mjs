#!/usr/bin/env node

import {
  cwd,
  env,
} from 'node:process';
import {
  join,
} from 'node:path';
import {
  readFile,
} from 'node:fs/promises';
import {
  parseEnv,
} from 'node:util';
import {
  execa,
} from 'execa';

const currentDir = cwd();
const localSpecsDir = join(currentDir, 'specs');
const localEnvFile = join(localSpecsDir, '.env');
const localEnvSpecsFile = join(localSpecsDir, '.env.specs');
const localEnvCoverFile = join(localSpecsDir, '.env.cover');

const read_dot_env = async (dotEnvPath) => {
  try {
    const contents = await readFile(new URL(dotEnvPath, import.meta.url), {
      encoding: 'utf8',
    });

    return parseEnv(contents);
  } catch (fileError) {
    console.debug(fileError);
  }

  return null;
};

const populate_env = (envObject = null) => {
  if (envObject !== null) {
    for(const [ key, value ] of Object.entries(envObject)) {
      env[key] = value;
    }
  }
};

const setup_env = async () => {
  const envObject = await read_dot_env(localEnvFile);
  const specsEnvObject = await read_dot_env(localEnvSpecsFile);
  const coverageEnvObject = await read_dot_env(localEnvCoverFile);

  populate_env(envObject);
  populate_env(specsEnvObject);
  populate_env(coverageEnvObject);
};

const run = async () => {
  await setup_env();

  await execa({
    cwd: currentDir,
    stdout: 'inherit',
    stderr: 'inherit',
  })`node --env-file=${localSpecsDir}/.env --test ${localSpecsDir}/*.specs.mjs`;
};

await run();