 
import {
  resolve,
  join,
} from 'node:path';

export const postProcess = async ({
  sourceDirectory,
  outputDirectory,
  execa,
  log,
}) => {
  const swc = resolve('node_modules/.bin/swc');
  const args = [
    './generated/ts',
    '--out-dir',
    './generated/mjs',
    '--config-file',
    '.swcrc',
  ];

  log(swc, args.join(' '));

  return await execa(swc, args);
};